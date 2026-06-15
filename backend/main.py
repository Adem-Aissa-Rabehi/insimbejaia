import os
import json
import time
import math
import logging
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, Request, Response, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import sqlite3
from dotenv import load_dotenv
import httpx

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("insim-backend")

# Resolve directories
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"))

PORT = int(os.getenv("PORT", 5000))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

DB_PATH = os.path.join(DATA_DIR, "database.db")

app = FastAPI(title="INSIM Bejaia Backend", version="2.0.0")

# CORS middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SQLite Database Helper Functions
def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
    finally:
        conn.close()

def db_init():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    cursor = conn.cursor()
    
    # Create tables
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS categories (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS filieres (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            categoryId TEXT,
            FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS formations (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            categoryId TEXT,
            filiereId TEXT,
            filiereName TEXT,
            description TEXT,
            duration TEXT,
            objectives TEXT, -- JSON string array
            brochure TEXT,
            semesters TEXT, -- JSON semesters array
            FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
            FOREIGN KEY (filiereId) REFERENCES filieres(id) ON DELETE CASCADE
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
            address TEXT,
            phone TEXT,
            mobile TEXT,
            email TEXT,
            lat TEXT,
            lng TEXT,
            facebook TEXT,
            instagram TEXT,
            linkedin TEXT,
            twitter TEXT,
            metaPixelId TEXT,
            metaAccessToken TEXT
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS campuses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            website TEXT,
            facebook TEXT,
            sieges TEXT -- JSON array of sieges
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            formationId TEXT,
            formationTitle TEXT,
            createdAt INTEGER
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS registrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            prenom TEXT NOT NULL,
            birthDate TEXT,
            birthPlace TEXT,
            phone TEXT,
            email TEXT,
            address TEXT,
            lastDegree TEXT,
            selectedCategory TEXT,
            selectedFiliere TEXT,
            selectedFormation TEXT,
            createdAt INTEGER
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT,
            createdAt INTEGER
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS page_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT NOT NULL,
            visitedAt INTEGER NOT NULL
        );
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS formation_views (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            formationId TEXT NOT NULL,
            viewedAt INTEGER NOT NULL
        );
    """)
    conn.commit()

    # Dynamic migrations
    columns_to_add = [
        ("settings", "metaPixelId", "TEXT"),
        ("settings", "metaAccessToken", "TEXT")
    ]
    for table, col, col_type in columns_to_add:
        try:
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}")
            conn.commit()
        except sqlite3.OperationalError:
            pass # Column already exists

    # Seed settings if empty
    cursor.execute("SELECT COUNT(*) FROM settings")
    if cursor.fetchone()[0] == 0:
        default_settings = {
            "address": "Cité Ihaddaden (près de la trémie) | 06000 Bejaia | Algérie",
            "phone": "+213 (0) 34 12 34 56, +213 (0) 34 12 34 57",
            "mobile": "+213 (0) 550 123 456, +213 (0) 770 123 456",
            "email": "contact@insimbejaia.com, inscriptions@insimbejaia.com",
            "lat": "36.7511",
            "lng": "5.0567",
            "facebook": "https://facebook.com",
            "instagram": "https://instagram.com",
            "linkedin": "https://linkedin.com",
            "twitter": ""
        }
        
        cursor.execute("""
            INSERT INTO settings (id, address, phone, mobile, email, lat, lng, facebook, instagram, linkedin, twitter)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            default_settings["address"],
            default_settings["phone"],
            default_settings["mobile"],
            default_settings["email"],
            default_settings["lat"],
            default_settings["lng"],
            default_settings["facebook"],
            default_settings["instagram"],
            default_settings["linkedin"],
            default_settings["twitter"]
        ))
        conn.commit()

    # Seed campuses if empty
    cursor.execute("SELECT COUNT(*) FROM campuses")
    if cursor.fetchone()[0] == 0:
        default_campuses = [
            {
                "name": "INSIM Alger",
                "website": "https://insim-alger.com",
                "facebook": "https://facebook.com/insimalger",
                "sieges": [
                    {
                        "id": 101,
                        "name": "Siège principal Hydra",
                        "city": "Alger (Hydra)",
                        "address": "Rue Djenane El Malik, Hydra, Alger",
                        "phone": "+213 (0) 21 60 21 21, +213 (0) 21 60 21 22",
                        "email": "contact@insim-alger.com, Hydra@insim-alger.com",
                        "googleMapsLink": "https://www.google.com/maps/place/36.7431,3.0298",
                        "lat": "36.7431",
                        "lng": "3.0298"
                    },
                    {
                        "id": 102,
                        "name": "Annexe Dély Ibrahim",
                        "city": "Alger (Dély Ibrahim)",
                        "address": "12 Bois des Cars, Dély Ibrahim, Alger",
                        "phone": "+213 (0) 21 91 10 10",
                        "email": "delyibrahim@insim-alger.com",
                        "googleMapsLink": "https://www.google.com/maps/place/36.7525,2.9833",
                        "lat": "36.7525",
                        "lng": "2.9833"
                    }
                ]
            },
            {
                "name": "INSIM Tizi Ouzou",
                "website": "https://insim-tiziouzou.com",
                "facebook": "https://facebook.com/insimtizi",
                "sieges": [
                    {
                        "id": 201,
                        "name": "Campus Principal",
                        "city": "Tizi Ouzou",
                        "address": "Nouvelle Ville, Tizi Ouzou",
                        "phone": "+213 (0) 26 21 34 34",
                        "email": "contact@insimtizi.com",
                        "googleMapsLink": "https://www.google.com/maps/place/36.7022,4.0538",
                        "lat": "36.7022",
                        "lng": "4.0538"
                    }
                ]
            }
        ]
        for campus in default_campuses:
            cursor.execute("""
                INSERT INTO campuses (name, website, facebook, sieges)
                VALUES (?, ?, ?, ?)
            """, (campus["name"], campus["website"], campus["facebook"], json.dumps(campus["sieges"])))
        conn.commit()

    # Seed categories & filieres if completely empty (to avoid empty catalog on first run)
    cursor.execute("SELECT COUNT(*) FROM categories")
    if cursor.fetchone()[0] == 0:
        cursor.execute("INSERT INTO categories (id, name) VALUES (?, ?)", ("brevet-de-technicien-sup-rieure-bts", "Brevet De Technicien Supérieure (BTS)"))
        cursor.execute("INSERT INTO filieres (id, name, categoryId) VALUES (?, ?, ?)", ("informatique", "Informatique", "brevet-de-technicien-sup-rieure-bts"))
        conn.commit()

    conn.close()

db_init()

# Normalize routes to handle requests coming from Node legacy URLs (e.g. without /api)
@app.middleware("http")
async def normalize_routes_middleware(request: Request, call_next):
    path = request.url.path
    if path.startswith("/formations-data"):
        # Map legacy formations-data path
        new_path = path.replace("/formations-data", "/api/formations")
        request.scope["path"] = new_path
    elif not path.startswith("/api/") and path != "/sitemap.xml" and not path.startswith("/uploads/"):
        api_routes = [
            "categories", "filieres", "formations", "settings", "campuses", 
            "leads", "registrations", "messages", "track", "stats", "analytics", "auth"
        ]
        parts = path.split("/")
        if len(parts) > 1 and parts[1] in api_routes:
            request.scope["path"] = f"/api{path}"

    response = await call_next(request)
    return response

# Pydantic Schemas
class CategorySchema(BaseModel):
    id: str
    name: str

class FiliereSchema(BaseModel):
    id: str
    name: str
    categoryId: str

class SettingsSchema(BaseModel):
    address: str
    phone: str
    mobile: str
    email: str
    lat: str
    lng: str
    facebook: str
    instagram: str
    linkedin: str
    twitter: str
    metaPixelId: Optional[str] = None
    metaAccessToken: Optional[str] = None

class CampusSchema(BaseModel):
    name: str
    website: str
    facebook: str
    sieges: List[Dict[str, Any]]

class LeadSchema(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    formationId: Optional[str] = None
    formationTitle: Optional[str] = None

class RegistrationSchema(BaseModel):
    nom: str
    prenom: str
    birthDate: Optional[str] = None
    birthPlace: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    lastDegree: Optional[str] = None
    selectedCategory: Optional[str] = None
    selectedFiliere: Optional[str] = None
    selectedFormation: Optional[str] = None

class MessageSchema(BaseModel):
    name: str
    email: str
    subject: Optional[str] = None
    message: Optional[str] = None

class PageViewSchema(BaseModel):
    path: str

# ─────────────────────────────────────────────────────────────────────────────
# REST ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

# CATEGORIES
@app.get("/api/categories")
def get_categories(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM categories")
    rows = cursor.fetchall()
    return [dict(r) for r in rows]

@app.post("/api/categories", status_code=201)
def create_category(category: CategorySchema, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO categories (id, name) VALUES (?, ?)", (category.id, category.name))
        db.commit()
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return category

@app.put("/api/categories/{category_id}")
def update_category(category_id: str, category: CategorySchema, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE categories SET name = ? WHERE id = ?", (category.name, category_id))
    db.commit()
    return category

@app.delete("/api/categories/{category_id}", status_code=204)
def delete_category(category_id: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM categories WHERE id = ?", (category_id,))
    db.commit()
    return Response(status_code=204)

# FILIERES
@app.get("/api/filieres")
def get_filieres(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM filieres")
    rows = cursor.fetchall()
    return [dict(r) for r in rows]

@app.post("/api/filieres", status_code=201)
def create_filiere(filiere: FiliereSchema, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO filieres (id, name, categoryId) VALUES (?, ?, ?)", 
                       (filiere.id, filiere.name, filiere.categoryId))
        db.commit()
    except sqlite3.IntegrityError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return filiere

@app.put("/api/filieres/{filiere_id}")
def update_filiere(filiere_id: str, filiere: FiliereSchema, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE filieres SET name = ?, categoryId = ? WHERE id = ?", 
                   (filiere.name, filiere.categoryId, filiere_id))
    db.commit()
    return filiere

@app.delete("/api/filieres/{filiere_id}", status_code=204)
def delete_filiere(filiere_id: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM filieres WHERE id = ?", (filiere_id,))
    db.commit()
    return Response(status_code=204)

# FORMATIONS
@app.get("/api/formations")
def get_formations(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM formations")
    rows = cursor.fetchall()
    res = []
    for r in rows:
        d = dict(r)
        d["objectives"] = json.loads(d["objectives"]) if d["objectives"] else []
        d["semesters"] = json.loads(d["semesters"]) if d["semesters"] else []
        res.append(d)
    return res

@app.get("/api/formations/{formation_id}")
def get_formation(formation_id: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM formations WHERE id = ?", (formation_id,))
    r = cursor.fetchone()
    if not r:
        raise HTTPException(status_code=404, detail="Formation non trouvée")
    d = dict(r)
    d["objectives"] = json.loads(d["objectives"]) if d["objectives"] else []
    d["semesters"] = json.loads(d["semesters"]) if d["semesters"] else []
    return d

@app.post("/api/formations", status_code=201)
async def create_formation(
    id: str = Form(...),
    title: str = Form(...),
    categoryId: str = Form(...),
    filiereId: str = Form(...),
    filiereName: str = Form(...),
    description: str = Form(...),
    duration: str = Form("30 mois"),
    objectives: str = Form("[]"),
    semesters: str = Form("[]"),
    brochure: Optional[str] = Form(None),
    brochureFile: Optional[UploadFile] = File(None),
    db: sqlite3.Connection = Depends(get_db)
):
    brochure_path = brochure or ""
    if brochureFile:
        # Save file to uploads/
        safe_name = "".join([c if c.isalnum() or c in "._-" else "_" for c in brochureFile.filename])
        filename = f"{int(time.time() * 1000)}_{safe_name}"
        file_path = os.path.join(UPLOADS_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(await brochureFile.read())
        brochure_path = f"/uploads/{filename}"

    cursor = db.cursor()
    try:
        # Parse and re-dump to ensure valid JSON format
        obj_list = json.loads(objectives)
        sem_list = json.loads(semesters)
        cursor.execute("""
            INSERT INTO formations (id, title, categoryId, filiereId, filiereName, description, duration, objectives, brochure, semesters)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (id, title, categoryId, filiereId, filiereName, description, duration, json.dumps(obj_list), brochure_path, json.dumps(sem_list)))
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return get_formation(id, db)

@app.put("/api/formations/{formation_id}")
async def update_formation(
    formation_id: str,
    title: str = Form(...),
    categoryId: str = Form(...),
    filiereId: str = Form(...),
    filiereName: str = Form(...),
    description: str = Form(...),
    duration: str = Form("30 mois"),
    objectives: str = Form("[]"),
    semesters: str = Form("[]"),
    brochure: Optional[str] = Form(None),
    brochureFile: Optional[UploadFile] = File(None),
    db: sqlite3.Connection = Depends(get_db)
):
    brochure_path = brochure or ""
    cursor = db.cursor()

    if brochureFile:
        # Delete old brochure if it was an uploaded file
        cursor.execute("SELECT brochure FROM formations WHERE id = ?", (formation_id,))
        old_row = cursor.fetchone()
        if old_row and old_row["brochure"] and old_row["brochure"].startswith("/uploads/"):
            old_file = os.path.join(BASE_DIR, old_row["brochure"].lstrip("/"))
            if os.path.exists(old_file):
                try:
                    os.remove(old_file)
                except Exception:
                    pass
        # Save new file
        safe_name = "".join([c if c.isalnum() or c in "._-" else "_" for c in brochureFile.filename])
        filename = f"{int(time.time() * 1000)}_{safe_name}"
        file_path = os.path.join(UPLOADS_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(await brochureFile.read())
        brochure_path = f"/uploads/{filename}"

    try:
        obj_list = json.loads(objectives)
        sem_list = json.loads(semesters)
        cursor.execute("""
            UPDATE formations
            SET title = ?, categoryId = ?, filiereId = ?, filiereName = ?, description = ?, duration = ?, objectives = ?, brochure = ?, semesters = ?
            WHERE id = ?
        """, (title, categoryId, filiereId, filiereName, description, duration, json.dumps(obj_list), brochure_path, json.dumps(sem_list), formation_id))
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    return get_formation(formation_id, db)

@app.delete("/api/formations/{formation_id}", status_code=204)
def delete_formation(formation_id: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT brochure FROM formations WHERE id = ?", (formation_id,))
    old_row = cursor.fetchone()
    if old_row and old_row["brochure"] and old_row["brochure"].startswith("/uploads/"):
        old_file = os.path.join(BASE_DIR, old_row["brochure"].lstrip("/"))
        if os.path.exists(old_file):
            try:
                os.remove(old_file)
            except Exception:
                pass

    cursor.execute("DELETE FROM formations WHERE id = ?", (formation_id,))
    db.commit()
    return Response(status_code=204)

# SETTINGS
@app.get("/api/settings")
def get_settings(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM settings WHERE id = 1")
    return dict(cursor.fetchone())

@app.put("/api/settings")
def update_settings(s: SettingsSchema, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        UPDATE settings
        SET address = ?, phone = ?, mobile = ?, email = ?, lat = ?, lng = ?, facebook = ?, instagram = ?, linkedin = ?, twitter = ?,
            metaPixelId = ?, metaAccessToken = ?
        WHERE id = 1
    """, (
        s.address, s.phone, s.mobile, s.email, s.lat, s.lng, s.facebook, s.instagram, s.linkedin, s.twitter,
        s.metaPixelId, s.metaAccessToken
    ))
    db.commit()
    return get_settings(db)

# CAMPUSES
@app.get("/api/campuses")
def get_campuses(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM campuses")
    rows = cursor.fetchall()
    res = []
    for r in rows:
        d = dict(r)
        d["sieges"] = json.loads(d["sieges"]) if d["sieges"] else []
        res.append(d)
    return res

@app.post("/api/campuses", status_code=201)
def create_campus(c: CampusSchema, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO campuses (name, website, facebook, sieges)
        VALUES (?, ?, ?, ?)
    """, (c.name, c.website, c.facebook, json.dumps(c.sieges)))
    db.commit()
    new_id = cursor.lastrowid
    return {"id": new_id, "name": c.name, "website": c.website, "facebook": c.facebook, "sieges": c.sieges}

@app.put("/api/campuses/{campus_id}")
def update_campus(campus_id: int, c: CampusSchema, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        UPDATE campuses
        SET name = ?, website = ?, facebook = ?, sieges = ?
        WHERE id = ?
    """, (c.name, c.website, c.facebook, json.dumps(c.sieges), campus_id))
    db.commit()
    return {"id": campus_id, "name": c.name, "website": c.website, "facebook": c.facebook, "sieges": c.sieges}

@app.delete("/api/campuses/{campus_id}", status_code=204)
def delete_campus(campus_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM campuses WHERE id = ?", (campus_id,))
    db.commit()
    return Response(status_code=204)

# LEADS
@app.get("/api/leads")
def get_leads(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM leads ORDER BY createdAt DESC")
    return [dict(r) for r in cursor.fetchall()]

@app.post("/api/leads", status_code=201)
async def create_lead(lead: LeadSchema, db: sqlite3.Connection = Depends(get_db)):
    created_at = int(time.time() * 1000)
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO leads (name, email, phone, formationId, formationTitle, createdAt)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (lead.name, lead.email, lead.phone, lead.formationId, lead.formationTitle, created_at))
    db.commit()
    
    # Meta conversions event (ViewContent / Lead)
    await send_meta_event(
        event_name="Lead",
        user_data={"em": [lead.email], "ph": [lead.phone] if lead.phone else []},
        custom_data={"content_name": lead.formationTitle, "content_category": lead.formationId},
        db=db
    )

    return {"id": cursor.lastrowid, **lead.dict(), "createdAt": created_at}

# REGISTRATIONS
@app.get("/api/registrations")
def get_registrations(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM registrations ORDER BY createdAt DESC")
    return [dict(r) for r in cursor.fetchall()]

@app.post("/api/registrations", status_code=201)
async def create_registration(r: RegistrationSchema, db: sqlite3.Connection = Depends(get_db)):
    created_at = int(time.time() * 1000)
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO registrations (nom, prenom, birthDate, birthPlace, phone, email, address, lastDegree, selectedCategory, selectedFiliere, selectedFormation, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (r.nom, r.prenom, r.birthDate, r.birthPlace, r.phone, r.email, r.address, r.lastDegree, r.selectedCategory, r.selectedFiliere, r.selectedFormation, created_at))
    db.commit()

    # Meta conversions event (CompleteRegistration)
    await send_meta_event(
        event_name="CompleteRegistration",
        user_data={"em": [r.email] if r.email else [], "ph": [r.phone] if r.phone else []},
        custom_data={"content_name": r.selectedFormation},
        db=db
    )

    return {"id": cursor.lastrowid, **r.dict(), "createdAt": created_at}

# MESSAGES
@app.get("/api/messages")
def get_messages(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM messages ORDER BY createdAt DESC")
    return [dict(r) for r in cursor.fetchall()]

@app.post("/api/messages", status_code=201)
async def create_message(msg: MessageSchema, db: sqlite3.Connection = Depends(get_db)):
    created_at = int(time.time() * 1000)
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO messages (name, email, subject, message, createdAt)
        VALUES (?, ?, ?, ?, ?)
    """, (msg.name, msg.email, msg.subject, msg.message, created_at))
    db.commit()

    # Meta conversions event (Contact)
    await send_meta_event(
        event_name="Contact",
        user_data={"em": [msg.email]},
        custom_data={"subject": msg.subject},
        db=db
    )

    return {"id": cursor.lastrowid, **msg.dict(), "createdAt": created_at}

# VISIT TRACKING
@app.post("/api/track/page", status_code=204)
def track_page(v: PageViewSchema, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO page_views (path, visitedAt) VALUES (?, ?)", (v.path, int(time.time() * 1000)))
    db.commit()
    return Response(status_code=204)

@app.get("/api/stats/pages")
def get_page_stats(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT path, COUNT(*) as count
        FROM page_views
        GROUP BY path
        ORDER BY count DESC
    """)
    return {r["path"]: r["count"] for r in cursor.fetchall()}

@app.post("/api/track/formation/{formation_id}", status_code=204)
def track_formation_view(formation_id: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO formation_views (formationId, viewedAt) VALUES (?, ?)", (formation_id, int(time.time() * 1000)))
    db.commit()
    return Response(status_code=204)

@app.get("/api/stats/formations")
def get_formation_stats(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT formationId, COUNT(*) as views
        FROM formation_views
        GROUP BY formationId
        ORDER BY views DESC
    """)
    return [dict(r) for r in cursor.fetchall()]

@app.get("/api/stats/formations/weekly")
def get_weekly_formation_stats(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    seven_days_ago = int(time.time() * 1000) - 7 * 24 * 60 * 60 * 1000
    cursor.execute("""
        SELECT formationId, viewedAt
        FROM formation_views
        WHERE viewedAt >= ?
        ORDER BY viewedAt ASC
    """, (seven_days_ago,))
    return [dict(r) for r in cursor.fetchall()]

# META PIXEL / CONVERSIONS API
async def send_meta_event(event_name: str, user_data: Dict[str, Any], custom_data: Dict[str, Any], db: sqlite3.Connection):
    cursor = db.cursor()
    cursor.execute("SELECT metaPixelId, metaAccessToken FROM settings WHERE id = 1")
    row = cursor.fetchone()
    pixel_id = None
    access_token = None
    if row:
        pixel_id = row["metaPixelId"]
        access_token = row["metaAccessToken"]

    # Fallback to env
    pixel_id = pixel_id or os.getenv("META_PIXEL_ID")
    access_token = access_token or os.getenv("META_ACCESS_TOKEN")

    if not pixel_id or not access_token:
        return

    payload = {
        "data": [{
            "event_name": event_name,
            "event_time": int(time.time()),
            "action_source": "website",
            "user_data": user_data,
            "custom_data": custom_data
        }]
    }

    url = f"https://graph.facebook.com/v19.0/{pixel_id}/events?access_token={access_token}"
    try:
        async with httpx.AsyncClient() as client:
            res = await client.post(url, json=payload)
            if res.status_code != 200:
                logger.warning(f"Meta Pixel CAPI failed: {res.text}")
    except Exception as e:
        logger.error(f"Error calling Meta CAPI: {e}")

@app.get("/api/analytics/meta/status")
def get_meta_status(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT metaPixelId, metaAccessToken FROM settings WHERE id = 1")
    row = cursor.fetchone()
    pixel_id = row["metaPixelId"] if row else None
    access_token = row["metaAccessToken"] if row else None
    
    pixel_id = pixel_id or os.getenv("META_PIXEL_ID")
    access_token = access_token or os.getenv("META_ACCESS_TOKEN")

    return {
        "configured": bool(pixel_id and access_token),
        "pixelId": f"{pixel_id[:4]}..." if pixel_id else None
    }

# ─────────────────────────────────────────────────────────────────────────────
# DYNAMIC SITEMAP XML GENERATION
# ─────────────────────────────────────────────────────────────────────────────

def generate_sitemap_xml(host: str, is_secure: bool, db: sqlite3.Connection) -> str:
    cursor = db.cursor()
    cursor.execute("SELECT id FROM formations")
    rows = cursor.fetchall()

    protocol = "https" if is_secure else "http"
    base_url = f"{protocol}://{host}" if host else f"{protocol}://insimbejaia.com"

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    # Static pages
    for page in ["", "/a-propos", "/formations", "/contact", "/preinscription"]:
        priority = "1.0" if page == "" else "0.8"
        xml += "  <url>\n"
        xml += f"    <loc>{base_url}{page}</loc>\n"
        xml += "    <changefreq>weekly</changefreq>\n"
        xml += f"    <priority>{priority}</priority>\n"
        xml += "  </url>\n"

    # Dynamic course detail pages
    for r in rows:
        xml += "  <url>\n"
        xml += f"    <loc>{base_url}/formations/{r['id']}</loc>\n"
        xml += "    <changefreq>monthly</changefreq>\n"
        xml += "    <priority>0.6</priority>\n"
        xml += "  </url>\n"

    xml += "</urlset>"
    return xml

@app.get("/sitemap.xml")
def sitemap_root(request: Request, db: sqlite3.Connection = Depends(get_db)):
    host = request.headers.get("host", "insimbejaia.com")
    is_secure = request.url.scheme == "https"
    xml_content = generate_sitemap_xml(host, is_secure, db)
    return Response(content=xml_content, media_type="application/xml")

@app.get("/api/sitemap.xml")
def sitemap_api(request: Request, db: sqlite3.Connection = Depends(get_db)):
    host = request.headers.get("host", "insimbejaia.com")
    is_secure = request.url.scheme == "https"
    xml_content = generate_sitemap_xml(host, is_secure, db)
    return Response(content=xml_content, media_type="application/xml")

# Static uploads folder serving
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
