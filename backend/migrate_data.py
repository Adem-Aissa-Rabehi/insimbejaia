import sqlite3
import json
import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "data", "database.db")
BTS_JSON_PATH = os.path.join(BASE_DIR, "data", "bts.json")
CMP_BT_JSON_PATH = os.path.join(BASE_DIR, "data", "cmp_bt.json")
DUMP_JSON_PATH = os.path.join(BASE_DIR, "data", "dump.json")

def slugify(text):
    text = text.lower()
    text = re.sub(r'[éèêëàâäôöûüç]', lambda m: {
        'é':'e', 'è':'e', 'ê':'e', 'ë':'e',
        'à':'a', 'â':'a', 'ä':'a',
        'ô':'o', 'ö':'o',
        'û':'u', 'ü':'u',
        'ç':'c'
    }[m.group(0)], text)
    # Remove non-alphanumeric except spaces and hyphens
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    # Replace spaces and multiple hyphens with a single hyphen
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def migrate():
    print("Starting database migration...")
    if not os.path.exists(DB_PATH):
        print(f"Error: Database file not found at {DB_PATH}.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Clear old categories, filieres, formations
    print("Clearing old catalog tables...")
    cursor.execute("DELETE FROM formations")
    cursor.execute("DELETE FROM filieres")
    cursor.execute("DELETE FROM categories")
    conn.commit()

    # 1. Seed new categories
    print("Seeding new categories...")
    categories = [
        {"id": "bts", "name": "Brevet de Technicien Supérieur (BTS)"},
        {"id": "bt", "name": "Brevet de Technicien (BT)"},
        {"id": "cmp", "name": "Certificat de Maîtrise Professionnelle (CMP)"}
    ]
    for cat in categories:
        cursor.execute("INSERT INTO categories (id, name) VALUES (?, ?)", (cat["id"], cat["name"]))

    # 2. Seed new filieres (Informatique and Gestion for each category)
    print("Seeding new filieres...")
    filieres = [
        # BTS
        {"id": "bts-informatique", "name": "Informatique", "categoryId": "bts"},
        {"id": "bts-gestion", "name": "Gestion", "categoryId": "bts"},
        # BT
        {"id": "bt-informatique", "name": "Informatique", "categoryId": "bt"},
        {"id": "bt-gestion", "name": "Gestion", "categoryId": "bt"},
        # CMP
        {"id": "cmp-informatique", "name": "Informatique", "categoryId": "cmp"},
        {"id": "cmp-gestion", "name": "Gestion", "categoryId": "cmp"}
    ]
    for fil in filieres:
        cursor.execute("INSERT INTO filieres (id, name, categoryId) VALUES (?, ?, ?)", (fil["id"], fil["name"], fil["categoryId"]))
    conn.commit()

    # Define descriptions and objectives mappings for all formations
    descriptions = {
        # BTS Informatique
        "Administration et Sécurité des Réseaux Informatiques": "Devenez un expert des infrastructures système et réseau. Apprenez à concevoir, déployer, administrer et sécuriser des parcs informatiques d'entreprise en gérant les serveurs, la virtualisation, la sécurité périmétrique et la haute disponibilité.",
        "Bases de Données": "Devenez un spécialiste de la modélisation, de l'implémentation et de l'administration des données. Apprenez à concevoir des architectures relationnelles robustes, à sécuriser les accès et à développer des applications web connectées.",
        "Développeur Web et Mobile": "Formez-vous aux langages et frameworks les plus demandés du marché. Cette formation vous enseigne le développement frontend et backend, la création d'applications mobiles natives et hybrides, ainsi que la modélisation de bases de données performantes.",
        
        # BTS Gestion
        "Agence de voyage": "Maîtrisez la conception, le conseil et la vente de produits touristiques. Cette formation vous prépare à gérer l'accueil, les réservations et la comptabilité commerciale au sein d'une agence de voyage ou d'un tour-opérateur.",
        "Assurance": "Devenez un professionnel de la gestion des risques et des contrats d'assurance. Apprenez à évaluer les besoins des clients, à élaborer des propositions adaptées et à gérer le règlement des sinistres.",
        "Banque": "Formez-vous aux métiers de la relation client et de la gestion des opérations financières en milieu bancaire. Apprenez à conseiller la clientèle, à traiter les dépôts, virements et crédits tout en maîtrisant les risques.",
        "Commerce International": "Maîtrisez les opérations d'import-export et les techniques du commerce mondial. Cette formation aborde la négociation commerciale, les douanes, la logistique internationale et le financement international.",
        "Comptabilité et gestion": "Une formation solide pour maîtriser la gestion comptable, fiscale et financière des entreprises. Apprenez à enregistrer les opérations comptables, à élaborer le bilan et le compte de résultat, à gérer la paie et à analyser les coûts.",
        "Gestion des Ressources Humaines": "Préparez-vous à gérer le capital humain de l'entreprise. Ce programme aborde l'administration du personnel (contrats, paie, congés), le recrutement, la formation professionnelle, la gestion des compétences (GPEC) et les relations sociales.",
        "Marketing": "Apprenez à élaborer des stratégies commerciales, analyser les marchés et mener des campagnes marketing. Devenez un expert de l'enquête marketing, de la distribution, de la publicité et de la relation client.",

        # BT Gestion
        "Agent de transit et de dédouanement (BT)": "Formez-vous aux procédures douanières et logistiques de l'import-export. Apprenez à organiser la manutention, l'enlèvement des marchandises et à traiter le dédouanement dans le respect de la réglementation.",
        "Secrétariat de Direction": "Devenez le collaborateur direct de la direction générale. Apprenez à gérer les flux d'informations, organiser les réunions et les déplacements, rédiger les courriers officiels et concevoir des outils de suivi.",
        "Vente et Commerce": "Apprenez les bases du commerce et de la vente. Cette formation pratique vous prépare à conseiller les clients, à agencer les rayons de vente, à négocier les achats et à gérer les encaissements.",

        # CMP Informatique
        "Opérateur de Saisie": "Une formation de niveau CMP axée sur la rapidité et l'exactitude de saisie. Maîtrisez le clavier à l'aveugle, la mise en forme de documents bureautiques simples et l'alimentation de bases de données.",

        # CMP Gestion
        "Banque (CMP)": "Une formation pratique pour maîtriser les opérations classiques de banque. Apprenez à recevoir la clientèle, traiter les dépôts, retraits et virements tout en gérant les documents commerciaux.",
        "Comptabilité (CMP)": "Apprenez les bases de la comptabilité générale d'entreprise. Maîtrisez le classement des pièces de base, l'enregistrement des écritures comptables quotidiennes et la préparation des états financiers.",
        "Agent d'Accueil et Réception": "Devenez le premier visage d'une organisation. Cette formation prépare aux métiers d'accueil d'entreprise ou d'administration, en travaillant la posture professionnelle, le standard et l'orientation."
    }

    objectives = {
        "Administration et Sécurité des Réseaux Informatiques": [
            "Configurer et optimiser les équipements réseau (routeurs, switchs)",
            "Administrer les serveurs Windows Server (Active Directory) et Linux",
            "Mettre en place des stratégies de sécurité et de pare-feu",
            "Superviser les infrastructures et gérer les plans de sauvegarde"
        ],
        "Bases de Données": [
            "Concevoir et modéliser des bases de données relationnelles (UML)",
            "Administrer les serveurs de bases de données (SGBD SQL/NoSQL)",
            "Assurer la sécurité, les sauvegardes et la réplication des données",
            "Développer des applications web d'accès aux bases de données à distance"
        ],
        "Développeur Web et Mobile": [
            "Développer des interfaces web modernes et réactives (React, Vue)",
            "Créer et documenter des API RESTful avec Node.js, FastAPI ou Django",
            "Concevoir des applications mobiles Android et iOS",
            "Maîtriser les outils de versioning (Git) et de déploiement continu"
        ],
        "Agence de voyage": [
            "Élaborer et tarifer des produits et séjours touristiques",
            "Assurer l'accueil physique et téléphonique des clients",
            "Maîtriser les logiciels de réservation (GDS, Amadeus)",
            "Gérer le suivi commercial et comptable des dossiers clients"
        ],
        "Assurance": [
            "Analyser les risques et déterminer les besoins de couverture des clients",
            "Rédiger et adapter les contrats d'assurance",
            "Gérer les sinistres et estimer les indemnités dues",
            "Maîtriser le droit commercial et la comptabilité appliquée"
        ],
        "Banque": [
            "Gérer et conseiller un portefeuille de clients particuliers",
            "Réaliser et vérifier les opérations courantes de guichet",
            "Étudier et monter des dossiers de demande de crédit",
            "Maîtriser le droit bancaire, la fiscalité et la comptabilité financière"
        ],
        "Commerce International": [
            "Prospecter les marchés étrangers et négocier à l'international",
            "Établir et suivre les documents de transport et de douane",
            "Gérer la logistique d'approvisionnement et d'expédition",
            "Maîtriser le financement et l'assurance du commerce extérieur"
        ],
        "Comptabilité et gestion": [
            "Enregistrer et contrôler les écritures comptables quotidiennes",
            "Établir les déclarations fiscales et sociales réglementaires",
            "Produire les états financiers annuels (bilan, TCR)",
            "Utiliser les logiciels comptables de référence (SAGE, PC Compta)"
        ],
        "Gestion des Ressources Humaines": [
            "Assurer la gestion administrative quotidienne du personnel",
            "Établir la paie et préparer les déclarations sociales",
            "Mener des entretiens de recrutement et intégrer les collaborateurs",
            "Élaborer et budgétiser un plan de formation d'entreprise"
        ],
        "Marketing": [
            "Mener et analyser des enquêtes de satisfaction et études de marché",
            "Concevoir des campagnes de communication et de publicité",
            "Gérer la force de vente et mener des négociations commerciales",
            "Maîtriser les concepts fondamentaux du marketing stratégique et opérationnel"
        ],
        "Agent de transit et de dédouanement (BT)": [
            "Maîtriser les réglementations et techniques douanières",
            "Organiser la logistique de transport et de transit des marchandises",
            "Établir les déclarations et documents commerciaux d'import-export",
            "Calculer les droits et taxes douaniers applicables"
        ],
        "Secrétariat de Direction": [
            "Assurer le traitement et la rédaction des courriers professionnels",
            "Organiser les agendas complexes et planifier les événements de direction",
            "Prendre des notes en réunion et rédiger les comptes-rendus",
            "Classer et archiver les dossiers de manière physique et numérique"
        ],
        "Vente et Commerce": [
            "Accueillir les clients et mener des entretiens de vente",
            "Gérer les stocks et approvisionner le point de vente",
            "Réaliser des devis, factures et gérer la caisse",
            "Mettre en valeur les produits (merchandising)"
        ],
        "Opérateur de Saisie": [
            "Saisir rapidement et sans erreurs des données textes et chiffrées",
            "Maîtriser les raccourcis clavier et l'outil Microsoft Word / Excel",
            "Trier, indexer et archiver des dossiers numériques",
            "Vérifier l'exactitude des informations à insérer dans le système"
        ],
        "Banque (CMP)": [
            "Accueillir et orienter les clients en agence bancaire",
            "Réaliser et contrôler les opérations courantes de dépôt et retrait",
            "Effectuer le traitement des virements et des moyens de paiement",
            "Maîtriser l'arithmétique commerciale et les notions comptables de base"
        ],
        "Comptabilité (CMP)": [
            "Étudier, classer et archiver les documents comptables de base",
            "Réaliser l'enregistrement comptable des pièces au journal",
            "Reporter et vérifier les écritures au grand livre et à la balance",
            "Participer aux travaux de fin d'exercice et à l'édition des états financiers"
        ],
        "Agent d'Accueil et Réception": [
            "Accueillir chaleureusement les visiteurs physiques",
            "Filtrer et orienter les appels téléphoniques (gestion de standard)",
            "Prendre des messages et les transmettre aux bons services",
            "Gérer les registres d'entrées et de sorties d'établissement"
        ]
    }

    # Helper function to parse programmes object to semesters list
    def parse_programmes(prog_dict):
        sems = []
        for key, modules in prog_dict.items():
            num_match = re.search(r'\d+', key)
            num = int(num_match.group(0)) if num_match else len(sems) + 1
            sems.append({
                "number": num,
                "modules": modules
            })
        return sorted(sems, key=lambda s: s["number"])

    # 3. Load from bts.json
    print(f"Loading BTS formations from {BTS_JSON_PATH}...")
    if os.path.exists(BTS_JSON_PATH):
        with open(BTS_JSON_PATH, "r", encoding="utf-8") as f:
            bts_data = json.load(f)
        for item in bts_data.get("formations", []):
            title = item["titre"]
            sems = parse_programmes(item["programmes"])
            
            # Determine Filiere
            filiere_key = "bts-gestion"
            filiere_name = "Gestion"
            if any(x in title.lower() for x in ["reseau", "réseau", "informatique", "web", "mobile", "donnée", "donnee"]):
                filiere_key = "bts-informatique"
                filiere_name = "Informatique"
            
            desc = descriptions.get(title, f"Formation de niveau BTS en {title}.")
            objs = objectives.get(title, [f"Maîtriser les compétences clés en {title}."])
            slug = "bts-" + slugify(title)

            cursor.execute("""
                INSERT INTO formations (id, title, categoryId, filiereId, filiereName, description, duration, objectives, brochure, semesters)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (slug, title, "bts", filiere_key, filiere_name, desc, "30 mois", json.dumps(objs), "", json.dumps(sems)))
            print(f"Added BTS: {title} ({slug})")
    else:
        print("Warning: bts.json not found!")

    # 4. Load from cmp_bt.json
    print(f"Loading CMP/BT formations from {CMP_BT_JSON_PATH}...")
    if os.path.exists(CMP_BT_JSON_PATH):
        with open(CMP_BT_JSON_PATH, "r", encoding="utf-8") as f:
            cmp_bt_data = json.load(f)
        for item in cmp_bt_data.get("formations_additionnelles", []):
            title = item["titre"]
            sems = parse_programmes(item["programmes"])

            # Determine category and filiere
            category_id = "bt" if "(bt)" in title.lower() else "cmp"
            clean_title = title.replace(" (BT)", "").replace(" (CMP)", "").strip()
            
            filiere_key = f"{category_id}-gestion"
            filiere_name = "Gestion"
            if any(x in clean_title.lower() for x in ["saisie", "informatique", "operateur", "opérateur"]):
                filiere_key = f"{category_id}-informatique"
                filiere_name = "Informatique"

            desc = descriptions.get(title, descriptions.get(clean_title, f"Formation de niveau {category_id.upper()} en {clean_title}."))
            objs = objectives.get(title, objectives.get(clean_title, [f"Maîtriser les compétences clés en {clean_title}."]))
            slug = f"{category_id}-" + slugify(clean_title)

            duration = "24 mois" if category_id == "bt" else "12 mois"

            cursor.execute("""
                INSERT INTO formations (id, title, categoryId, filiereId, filiereName, description, duration, objectives, brochure, semesters)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (slug, clean_title, category_id, filiere_key, filiere_name, desc, duration, json.dumps(objs), "", json.dumps(sems)))
            print(f"Added {category_id.upper()}: {clean_title} ({slug})")
    else:
        print("Warning: cmp_bt.json not found!")

    # 5. Insert existing database formations that were missing from bts.json/cmp_bt.json
    # Like Secretariat de Direction, Vente/Commerce, Opérateur de Saisie, Agent d'accueil, Hôtellerie
    # We can seed them explicitly under the new filieres to keep the database complete!
    extra_formations = [
        {
            "id": "bt-secretariat-de-direction",
            "title": "Secrétariat de Direction",
            "categoryId": "bt",
            "filiereId": "bt-gestion",
            "filiereName": "Gestion",
            "description": "Devenez le collaborateur direct de la direction générale. Apprenez à gérer les flux d'informations, organiser les réunions et les déplacements, rédiger les courriers officiels et concevoir des outils de suivi.",
            "duration": "24 mois",
            "objectives": objectives["Secrétariat de Direction"],
            "semesters": [
                {"number": 1, "modules": ["Techniques de secrétariat fondamental", "Traitement de texte & Clavier (Word)", "Français des affaires", "Classement et organisation de fichiers"]},
                {"number": 2, "modules": ["Correspondance administrative & Rédaction", "Tableur Excel de base", "Techniques d'accueil physique et téléphonique", "Législation administrative"]},
                {"number": 3, "modules": ["Secrétariat de direction spécialisé", "Gestion du temps et planification", "Anglais commercial et de bureau", "Logiciels de présentation (PowerPoint)"]},
                {"number": 4, "modules": ["Stage pratique de 4 mois en secrétariat administratif", "Exposé oral de fin d'études devant un jury"]}
            ]
        },
        {
            "id": "bt-vente-et-commerce",
            "title": "Vente et Commerce",
            "categoryId": "bt",
            "filiereId": "bt-gestion",
            "filiereName": "Gestion",
            "description": "Apprenez les bases du commerce et de la vente. Cette formation pratique vous prépare à conseiller les clients, à agencer les rayons de vente, à négocier les achats et à gérer les encaissements.",
            "duration": "24 mois",
            "objectives": objectives["Vente et Commerce"],
            "semesters": [
                {"number": 1, "modules": ["Bases de la vente et étapes du processus commercial", "Connaissance générale des produits de consommation", "Calculs commerciaux et marges", "Bureautique de caisse"]},
                {"number": 2, "modules": ["Techniques de négociation commerciale", "Gestion des stocks et inventaires en magasin", "Merchandising de base & Agencement vitrines", "Droit commercial fondamental"]},
                {"number": 3, "modules": ["Fidélisation client & Service après-vente (SAV)", "Techniques de communication de vente", "Anglais de vente de base", "Bases de la publicité locale"]},
                {"number": 4, "modules": ["Stage pratique de 4 mois en commerce ou agence", "Présentation du rapport d'activités commerciales"]}
            ]
        },
        {
            "id": "cmp-operateur-de-saisie",
            "title": "Opérateur de Saisie",
            "categoryId": "cmp",
            "filiereId": "cmp-informatique",
            "filiereName": "Informatique",
            "description": "Une formation de niveau CMP axée sur la rapidité et l'exactitude de saisie. Maîtrisez le clavier à l'aveugle, la mise en forme de documents bureautiques simples, l'alimentation de bases de données.",
            "duration": "12 mois",
            "objectives": objectives["Opérateur de Saisie"],
            "semesters": [
                {"number": 1, "modules": ["Technique de dactylographie (Clavier aveugle)", "Traitement de texte Word (saisie et mise en forme)", "Système Windows (Fichiers, Dossiers, Raccourcis)", "Français de base"]},
                {"number": 2, "modules": ["Saisie sur Tableur Excel (Tableaux, calculs simples)", "Archivage de données numériques", "Stage pratique de 2 mois en entreprise", "Examen pratique de vitesse de saisie"]}
            ]
        },
        {
            "id": "cmp-agent-d-accueil-et-reception",
            "title": "Agent d'Accueil et Réception",
            "categoryId": "cmp",
            "filiereId": "cmp-gestion",
            "filiereName": "Gestion",
            "description": "Devenez le premier visage d'une organisation. Cette formation prépare aux métiers d'accueil d'entreprise ou d'administration, en travaillant la posture professionnelle, la gestion du standard, l'orientation des visiteurs et l'anglais d'accueil de base.",
            "duration": "12 mois",
            "objectives": objectives["Agent d'Accueil et Réception"],
            "semesters": [
                {"number": 1, "modules": ["Techniques d'accueil & Posture d'agent", "Techniques d'écoute & Communication orale", "Gestion du standard téléphonique", "Vocabulaire d'accueil en français"]},
                {"number": 2, "modules": ["Bases de l'anglais d'accueil", "Introduction à la bureautique de secrétariat d'accueil", "Stage en entreprise d'accueil (2 mois)", "Simulation finale d'accueil et gestion des conflits"]}
            ]
        },
        {
            "id": "bts-gestion-et-administration-hotelieres",
            "title": "Gestion et Administration Hôtelières",
            "categoryId": "bts",
            "filiereId": "bts-gestion",
            "filiereName": "Gestion",
            "description": "Formez-vous aux fonctions d'encadrement et de gestion au sein des établissements hôteliers.",
            "duration": "30 mois",
            "objectives": ["Gérer l'accueil des clients", "Superviser les opérations d'hébergement", "Administrer les activités de restauration"],
            "semesters": [
                {"number": 1, "modules": ["Techniques de service en hôtellerie", "Introduction au tourisme et à l'hébergement", "Hygiène, sécurité et normes hôtelières", "Anglais de l'hôtellerie I", "Bureautique appliquée"]},
                {"number": 2, "modules": ["Gestion et comptabilité d'exploitation", "Techniques de service en restauration (F&B)", "Communication professionnelle & Relation client", "Allemand ou Espagnol hôtelier I"]},
                {"number": 3, "modules": ["Management d'équipes hôtelières", "Yield Management & Tarification dynamique", "Marketing hôtelier et promotion digitale", "Législation hôtelière et touristique"]},
                {"number": 4, "modules": ["Projet d'événementiel ou d'exploitation hôtelière", "Stage de 6 mois dans un établissement hôtelier conventionné", "Mémoire de stage"]}
            ]
        }
    ]

    for ef in extra_formations:
        # Check if already inserted
        cursor.execute("SELECT id FROM formations WHERE id = ?", (ef["id"],))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO formations (id, title, categoryId, filiereId, filiereName, description, duration, objectives, brochure, semesters)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (ef["id"], ef["title"], ef["categoryId"], ef["filiereId"], ef["filiereName"], ef["description"], ef["duration"], json.dumps(ef["objectives"]), "", json.dumps(ef["semesters"])))
            print(f"Added extra formation: {ef['title']} ({ef['id']})")

    conn.commit()
    print("Database catalog successfully updated!")

    # 6. Dump SQLite Database State to dump.json
    print(f"Exporting SQLite database state to {DUMP_JSON_PATH}...")
    
    dump_data = {}

    tables = ["categories", "filieres", "formations", "settings", "campuses", "leads", "registrations", "messages"]
    for t in tables:
        cursor.execute(f"SELECT * FROM {t}")
        # Fetch rows as dicts
        columns = [col[0] for col in cursor.description]
        rows = []
        for row in cursor.fetchall():
            row_dict = dict(zip(columns, row))
            # If table is settings, campuses, leads, registrations, messages, it may contain json string columns
            # But in dump.json, we don't necessarily have to parse them, let's keep them as matches what was originally in dump.json
            rows.append(row_dict)
        dump_data[t] = rows

    with open(DUMP_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(dump_data, f, indent=2, ensure_ascii=False)
    
    print("JSON backup database dump.json successfully updated!")
    conn.close()
    print("Migration completed successfully!")

if __name__ == "__main__":
    migrate()
