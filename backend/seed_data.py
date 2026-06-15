import sqlite3
import json
import os

DB_PATH = "backend/data/database.db"

def seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Clear old data to recreate from scratch
    cursor.execute("DELETE FROM formations")
    cursor.execute("DELETE FROM filieres")
    cursor.execute("DELETE FROM categories")

    # Categories
    categories = [
        {"id": "diplomes-etat", "name": "Diplômes d'État (BTS)"}
    ]
    
    for c in categories:
        cursor.execute("INSERT INTO categories (id, name) VALUES (?, ?)", (c["id"], c["name"]))

    # Filieres
    filieres = [
        {"id": "hotellerie-tourisme", "name": "Hôtellerie & Tourisme", "categoryId": "diplomes-etat"},
        {"id": "sciences-gestion", "name": "Sciences de gestion", "categoryId": "diplomes-etat"},
        {"id": "informatique-numerique", "name": "Informatique & Numérique", "categoryId": "diplomes-etat"}
    ]

    for f in filieres:
        cursor.execute("INSERT INTO filieres (id, name, categoryId) VALUES (?, ?, ?)", (f["id"], f["name"], f["categoryId"]))

    # Formations
    formations = [
        # Hôtellerie & Tourisme
        {
            "id": "gestion-et-administration-hotelieres",
            "title": "Gestion et Administration Hôtelières",
            "categoryId": "diplomes-etat",
            "filiereId": "hotellerie-tourisme",
            "filiereName": "Hôtellerie & Tourisme",
            "description": "Formez-vous aux fonctions d'encadrement et de gestion au sein des établissements hôteliers.",
            "duration": "30 mois",
            "objectives": ["Gérer l'accueil des clients", "Superviser les opérations d'hébergement", "Administrer les activités de restauration"]
        },
        {
            "id": "reception",
            "title": "Réception",
            "categoryId": "diplomes-etat",
            "filiereId": "hotellerie-tourisme",
            "filiereName": "Hôtellerie & Tourisme",
            "description": "Devenez le premier point de contact des clients et assurez le bon déroulement de leur séjour.",
            "duration": "30 mois",
            "objectives": ["Accueillir les clients et gérer les départs", "Gérer le système de réservations", "Assurer la facturation et la caisse"]
        },
        {
            "id": "management-en-hotellerie-et-restauration",
            "title": "Management en hôtellerie et restauration",
            "categoryId": "diplomes-etat",
            "filiereId": "hotellerie-tourisme",
            "filiereName": "Hôtellerie & Tourisme",
            "description": "Développez vos compétences managériales appliquées aux secteurs de l'hôtellerie et de la restauration.",
            "duration": "30 mois",
            "objectives": ["Manager les équipes en salle et en cuisine", "Piloter l'exploitation d'un restaurant", "Gérer les approvisionnements et les stocks"]
        },
        {
            "id": "agence-de-voyage",
            "title": "Agence de voyage",
            "categoryId": "diplomes-etat",
            "filiereId": "hotellerie-tourisme",
            "filiereName": "Hôtellerie & Tourisme",
            "description": "Apprenez à concevoir, conseiller et vendre des séjours touristiques.",
            "duration": "30 mois",
            "objectives": ["Vendre des prestations de transport et de séjour", "Conseiller les clients sur les destinations", "Concevoir des packages touristiques"]
        },
        {
            "id": "production-et-commercialisation",
            "title": "Production et commercialisation",
            "categoryId": "diplomes-etat",
            "filiereId": "hotellerie-tourisme",
            "filiereName": "Hôtellerie & Tourisme",
            "description": "Maîtrisez la création et la promotion d'offres touristiques innovantes.",
            "duration": "30 mois",
            "objectives": ["Négocier avec les prestataires de services", "Développer la stratégie commerciale", "Assurer la promotion digitale des offres"]
        },
        # Sciences de gestion
        {
            "id": "comptabiliter-et-gestion",
            "title": "Comptabilité et gestion",
            "categoryId": "diplomes-etat",
            "filiereId": "sciences-gestion",
            "filiereName": "Sciences de gestion",
            "description": "Maîtrisez les outils comptables, fiscaux et de gestion pour piloter la performance financière des organisations.",
            "duration": "30 mois",
            "objectives": ["Assurer la tenue de la comptabilité générale", "Établir les déclarations fiscales et sociales", "Participer au contrôle de gestion et audit"]
        },
        {
            "id": "grh",
            "title": "Gestion des Ressources Humaines",
            "categoryId": "diplomes-etat",
            "filiereId": "sciences-gestion",
            "filiereName": "Sciences de gestion",
            "description": "Formez-vous aux métiers du recrutement, de la paie, de la formation et de la gestion sociale.",
            "duration": "30 mois",
            "objectives": ["Gérer l'administration du personnel et la paie", "Conduire les processus de recrutement", "Élaborer le plan de développement des compétences"]
        },
        {
            "id": "marketing",
            "title": "Marketing",
            "categoryId": "diplomes-etat",
            "filiereId": "sciences-gestion",
            "filiereName": "Sciences de gestion",
            "description": "Apprenez à élaborer des stratégies commerciales, analyser les marchés et mener des campagnes marketing.",
            "duration": "30 mois",
            "objectives": ["Réaliser des études de marché qualitatives et quantitatives", "Élaborer et piloter le plan marketing opérationnel", "Gérer la communication de marque et le digital"]
        },
        {
            "id": "commerce-international",
            "title": "Commerce international",
            "categoryId": "diplomes-etat",
            "filiereId": "sciences-gestion",
            "filiereName": "Sciences de gestion",
            "description": "Développez une expertise dans la négociation internationale, la logistique import-export et le douane.",
            "duration": "30 mois",
            "objectives": ["Gérer les contrats de vente internationale", "Piloter la chaîne logistique internationale (Supply Chain)", "Assurer la conformité douanière et documentaire"]
        },
        # Informatique & Numérique
        {
            "id": "administration-et-securite-des-reseaux-informatiques",
            "title": "Administration et sécurité des réseaux informatiques",
            "categoryId": "diplomes-etat",
            "filiereId": "informatique-numerique",
            "filiereName": "Informatique & Numérique",
            "description": "Formez-vous à la conception, la maintenance et la sécurisation des infrastructures système et réseau.",
            "duration": "30 mois",
            "objectives": ["Configurer les équipements réseau (routeurs, switchs)", "Superviser la sécurité des systèmes d'information", "Assurer le support technique et la haute disponibilité"]
        },
        {
            "id": "developpeur-web-et-multimedia",
            "title": "Développeur web et mobile",
            "categoryId": "diplomes-etat",
            "filiereId": "informatique-numerique",
            "filiereName": "Informatique & Numérique",
            "description": "Concevez et développez des applications web, des sites interactifs et des applications mobiles modernes.",
            "duration": "30 mois",
            "objectives": ["Développer des interfaces utilisateur réactives (Frontend)", "Créer des API et gérer le serveur (Backend)", "Concevoir des architectures mobiles Android et iOS"]
        },
        {
            "id": "bases-de-donnees",
            "title": "Base de données",
            "categoryId": "diplomes-etat",
            "filiereId": "informatique-numerique",
            "filiereName": "Informatique & Numérique",
            "description": "Devenez un expert de la structuration, du stockage et de l'administration des données en entreprise.",
            "duration": "30 mois",
            "objectives": ["Modéliser et requêter des bases de données SQL et NoSQL", "Administrer et optimiser les serveurs de données", "Assurer l'intégrité, la sauvegarde et la réplication"]
        }
    ]

    for f in formations:
        semesters = [
            {"number": 1, "modules": [f"Semestre 1 - Introduction à la filière {f['filiereName']}", f"Semestre 1 - Outils de base & Méthodologie"]},
            {"number": 2, "modules": [f"Semestre 2 - Fondations théoriques et pratiques", f"Semestre 2 - Travaux dirigés appliqués"]},
            {"number": 3, "modules": [f"Semestre 3 - Spécialisation et techniques avancées", f"Semestre 3 - Analyse d'études de cas réels"]},
            {"number": 4, "modules": [f"Semestre 4 - Préparation au projet de fin d'études", "Stage obligatoire de 6 mois en milieu professionnel"]}
        ]
        cursor.execute("""
            INSERT INTO formations (id, title, categoryId, filiereId, filiereName, description, duration, objectives, brochure, semesters)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f["id"], f["title"], f["categoryId"], f["filiereId"], f["filiereName"],
            f["description"], f["duration"], json.dumps(f["objectives"]), "", json.dumps(semesters)
        ))

    conn.commit()
    print("Database seeded with default INSIM Bejaia catalog successfully!")
    conn.close()

if __name__ == "__main__":
    seed()
