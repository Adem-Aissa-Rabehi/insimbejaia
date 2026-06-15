import sqlite3
import json
import os
import time

DB_PATH = "backend/data/database.db"

def seed_rich_data():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database file not found at {DB_PATH}. Please run backend server first to create it.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Clear old data to rebuild with rich training data
    print("Clearing old catalog data...")
    cursor.execute("DELETE FROM formations")
    cursor.execute("DELETE FROM filieres")
    cursor.execute("DELETE FROM categories")
    cursor.execute("DELETE FROM leads")
    cursor.execute("DELETE FROM registrations")
    conn.commit()

    # 1. Categories
    print("Seeding training categories (BTS, BT, CMP)...")
    categories = [
        {"id": "bts", "name": "Brevet de Technicien Supérieur (BTS)"},
        {"id": "bt", "name": "Brevet de Technicien (BT)"},
        {"id": "cmp", "name": "Certificat de Maîtrise Professionnelle (CMP)"}
    ]
    for c in categories:
        cursor.execute("INSERT INTO categories (id, name) VALUES (?, ?)", (c["id"], c["name"]))

    # 2. Filieres
    print("Seeding sectors (Filières)...")
    filieres = [
        # BTS Filieres
        {"id": "informatique-numerique", "name": "Informatique & Numérique", "categoryId": "bts"},
        {"id": "sciences-gestion", "name": "Sciences de Gestion", "categoryId": "bts"},
        {"id": "hotellerie-tourisme", "name": "Hôtellerie & Tourisme", "categoryId": "bts"},
        # BT Filieres
        {"id": "administration-secretariat-bt", "name": "Administration & Secrétariat (BT)", "categoryId": "bt"},
        {"id": "commerce-gestion-bt", "name": "Commerce & Gestion (BT)", "categoryId": "bt"},
        {"id": "tourisme-bt", "name": "Tourisme & Voyage (BT)", "categoryId": "bt"},
        # CMP Filieres
        {"id": "bureau-cmp", "name": "Secrétariat & Bureautique (CMP)", "categoryId": "cmp"},
        {"id": "services-cmp", "name": "Services & Restauration (CMP)", "categoryId": "cmp"}
    ]
    for f in filieres:
        cursor.execute("INSERT INTO filieres (id, name, categoryId) VALUES (?, ?, ?)", (f["id"], f["name"], f["categoryId"]))

    # 3. Formations
    print("Seeding actual formations with rich study programs...")
    formations = [
        # ────────── BTS Formations ──────────
        {
            "id": "bts-administration-et-securite-des-reseaux-informatiques",
            "title": "BTS Administration et Sécurité des Réseaux Informatiques",
            "categoryId": "bts",
            "filiereId": "informatique-numerique",
            "filiereName": "Informatique & Numérique",
            "description": "Devenez un expert des infrastructures système et réseau. Apprenez à concevoir, déployer, administrer et sécuriser des parcs informatiques d'entreprise en gérant les serveurs, la virtualisation, la sécurité périmétrique et la haute disponibilité.",
            "duration": "30 mois",
            "objectives": [
                "Configurer et optimiser les équipements réseau (routeurs, switchs)",
                "Administrer les serveurs Windows Server (Active Directory) et Linux",
                "Mettre en place des stratégies de sécurité et de pare-feu",
                "Superviser les infrastructures et gérer les plans de sauvegarde"
            ],
            "semesters": [
                {
                    "number": 1,
                    "modules": ["Algorithmique & Structures de données", "Architecture des ordinateurs", "Mathématiques appliquées aux réseaux", "Bases des réseaux locaux (Cisco CCNA 1)", "Anglais technique"]
                },
                {
                    "number": 2,
                    "modules": ["Routage et Commutation (Cisco CCNA 2)", "Systèmes d'exploitation client (Windows/Linux)", "Bases de données SQL", "Électricité & Physique des transmissions", "Droit de l'informatique"]
                },
                {
                    "number": 3,
                    "modules": ["Sécurité des réseaux (Firewalls, VPN)", "Systèmes d'exploitation serveur (Active Directory, services DNS/DHCP)", "Virtualisation des serveurs (VMware/Hyper-V)", "Interconnexion des réseaux WAN"]
                },
                {
                    "number": 4,
                    "modules": ["Projet d'intégration technique de fin d'études", "Stage pratique de 6 mois en milieu professionnel", "Rédaction et soutenance de mémoire"]
                }
            ]
        },
        {
            "id": "bts-developpeur-web-et-mobile",
            "title": "BTS Développeur Web et Mobile",
            "categoryId": "bts",
            "filiereId": "informatique-numerique",
            "filiereName": "Informatique & Numérique",
            "description": "Formez-vous aux langages et frameworks les plus demandés du marché. Cette formation vous enseigne le développement frontend et backend, la création d'applications mobiles natives et hybrides, ainsi que la modélisation de bases de données performantes.",
            "duration": "30 mois",
            "objectives": [
                "Développer des interfaces web modernes et réactives (React, Vue)",
                "Créer et documenter des API RESTful avec Node.js, FastAPI ou Django",
                "Concevoir des applications mobiles Android et iOS",
                "Maîtriser les outils de versioning (Git) et de déploiement continu"
            ],
            "semesters": [
                {
                    "number": 1,
                    "modules": ["Logique algorithmique et pseudo-code", "Bases de l'intégration Web (HTML5, CSS3, Responsive Design)", "Introduction aux bases de données SQL", "Architecture Web & Protocoles (HTTP)", "Anglais technique"]
                },
                {
                    "number": 2,
                    "modules": ["Programmation JavaScript moderne (ES6+)", "Développement Backend I (Python & FastAPI ou Node.js)", "Conception UI/UX & Maquettage Figma", "Système d'exploitation Linux & Ligne de commande"]
                },
                {
                    "number": 3,
                    "modules": ["Développement Frontend avec React.js", "Développement Mobile Hybride (Flutter / React Native)", "Sécurité des applications Web (OWASP)", "Bases de données NoSQL (MongoDB, Redis)", "Versionnage de code (Git/GitHub)"]
                },
                {
                    "number": 4,
                    "modules": ["Projet de synthèse et développement d'une application complète", "Stage d'immersion pratique en entreprise (6 mois)", "Rédaction du mémoire de stage"]
                }
            ]
        },
        {
            "id": "bts-comptabilite-et-gestion",
            "title": "BTS Comptabilité et Gestion",
            "categoryId": "bts",
            "filiereId": "sciences-gestion",
            "filiereName": "Sciences de Gestion",
            "description": "Une formation solide pour maîtriser la gestion comptable, fiscale et financière des entreprises. Apprenez à enregistrer les opérations comptables, à élaborer le bilan et le compte de résultat, à gérer la paie et à analyser les coûts pour guider les décisions de gestion.",
            "duration": "30 mois",
            "objectives": [
                "Enregistrer et contrôler les écritures comptables quotidiennes",
                "Établir les déclarations fiscales et sociales réglementaires",
                "Produire les états financiers annuels (bilan, TCR)",
                "Utiliser les logiciels comptables de référence (SAGE, PC Compta)"
            ],
            "semesters": [
                {
                    "number": 1,
                    "modules": ["Comptabilité générale I (Principes de base)", "Microéconomie", "Droit civil et commercial", "Mathématiques financières", "Bureautique appliquée (MS Excel avancé)"]
                },
                {
                    "number": 2,
                    "modules": ["Comptabilité générale II (Opérations d'inventaire)", "Fiscalité des entreprises (TVA, IBS, IRG)", "Droit du travail & Législation sociale", "Comptabilité analytique de gestion"]
                },
                {
                    "number": 3,
                    "modules": ["Analyse financière & Diagnostic de l'entreprise", "Comptabilité des sociétés", "Gestion budgétaire & Plan de trésorerie", "Logiciels de comptabilité et de paie intégrés"]
                },
                {
                    "number": 4,
                    "modules": ["Étude de cas comptable approfondie", "Stage pratique en cabinet d'expertise comptable ou entreprise (6 mois)", "Rédaction du mémoire"]
                }
            ]
        },
        {
            "id": "bts-gestion-des-ressources-humaines",
            "title": "BTS Gestion des Ressources Humaines",
            "categoryId": "bts",
            "filiereId": "sciences-gestion",
            "filiereName": "Sciences de Gestion",
            "description": "Préparez-vous à gérer le capital humain de l'entreprise. Ce programme aborde l'administration du personnel (contrats, paie, congés), le recrutement, la formation professionnelle, la gestion des compétences (GPEC) et les relations sociales.",
            "duration": "30 mois",
            "objectives": [
                "Assurer la gestion administrative quotidienne du personnel",
                "Établir la paie et préparer les déclarations sociales",
                "Mener des entretiens de recrutement et intégrer les collaborateurs",
                "Élaborer et budgétiser un plan de formation d'entreprise"
            ],
            "semesters": [
                {
                    "number": 1,
                    "modules": ["Introduction aux Ressources Humaines", "Droit du travail & Contrat de travail", "Psychologie du travail", "Techniques d'expression et de communication", "Logiciels de secrétariat"]
                },
                {
                    "number": 2,
                    "modules": ["Administration du personnel (Congés, Absences, Retraites)", "Techniques de paie et charges sociales", "Gestion prévisionnelle des emplois et des compétences (GPEC)", "Logiciels de gestion de paie"]
                },
                {
                    "number": 3,
                    "modules": ["Processus de recrutement et d'intégration", "Ingénierie de la formation professionnelle", "Négociation collective et relations sociales", "Santé, sécurité et hygiène au travail"]
                },
                {
                    "number": 4,
                    "modules": ["Étude de cas en management des ressources humaines", "Stage d'application pratique de 6 mois en service RH", "Rédaction et soutenance de mémoire"]
                }
            ]
        },
        {
            "id": "bts-gestion-et-administration-hotelieres",
            "title": "BTS Gestion et Administration Hôtelières",
            "categoryId": "bts",
            "filiereId": "hotellerie-tourisme",
            "filiereName": "Hôtellerie & Tourisme",
            "description": "Formez-vous aux postes d'encadrement dans les grands hôtels et restaurants. Maîtrisez le management des équipes d'hébergement et de restauration, la gestion financière d'exploitation, l'accueil haut de gamme et la commercialisation touristique.",
            "duration": "30 mois",
            "objectives": [
                "Superviser les opérations d'accueil et d'hébergement (Front Office)",
                "Manager les équipes de service en restauration et d'étage",
                "Gérer les achats, les stocks et optimiser la rentabilité",
                "Assurer la commercialisation et la communication de l'établissement"
            ],
            "semesters": [
                {
                    "number": 1,
                    "modules": ["Techniques de service en hôtellerie", "Introduction au tourisme et à l'hébergement", "Hygiène, sécurité et normes hôtelières", "Anglais de l'hôtellerie I", "Bureautique appliquée"]
                },
                {
                    "number": 2,
                    "modules": ["Gestion et comptabilité d'exploitation", "Techniques de service en restauration (F&B)", "Communication professionnelle & Relation client", "Allemand ou Espagnol hôtelier I"]
                },
                {
                    "number": 3,
                    "modules": ["Management d'équipes hôtelières", "Yield Management & Tarification dynamique", "Marketing hôtelier et promotion digitale", "Législation hôtelière et touristique"]
                },
                {
                    "number": 4,
                    "modules": ["Projet d'événementiel ou d'exploitation hôtelière", "Stage de 6 mois dans un établissement hôtelier conventionné", "Mémoire de stage"]
                }
            ]
        },

        # ────────── BT Formations ──────────
        {
            "id": "bt-secretariat-de-direction",
            "title": "BT Secrétariat de Direction",
            "categoryId": "bt",
            "filiereId": "administration-secretariat-bt",
            "filiereName": "Administration & Secrétariat (BT)",
            "description": "Devenez le collaborateur direct de la direction générale. Apprenez à gérer les flux d'informations, organiser les réunions et les déplacements, rédiger les courriers officiels et concevoir des outils de suivi de dossiers administratifs.",
            "duration": "24 mois",
            "objectives": [
                "Assurer le traitement et la rédaction des courriers professionnels",
                "Organiser les agendas complexes et planifier les événements de direction",
                "Prendre des notes en réunion et rédiger les comptes-rendus",
                "Classer et archiver les dossiers de manière physique et numérique"
            ],
            "semesters": [
                {
                    "number": 1,
                    "modules": ["Techniques de secrétariat fondamental", "Traitement de texte & Clavier (Word)", "Français des affaires", "Classement et organisation de fichiers"]
                },
                {
                    "number": 2,
                    "modules": ["Correspondance administrative & Rédaction", "Tableur Excel de base", "Techniques d'accueil physique et téléphonique", "Législation administrative"]
                },
                {
                    "number": 3,
                    "modules": ["Secrétariat de direction spécialisé", "Gestion du temps et planification", "Anglais commercial et de bureau", "Logiciels de présentation (PowerPoint)"]
                },
                {
                    "number": 4,
                    "modules": ["Stage pratique de 4 mois en secrétariat administratif", "Exposé oral de fin d'études devant un jury"]
                }
            ]
        },
        {
            "id": "bt-vente-et-commerce",
            "title": "BT Vente et Commerce",
            "categoryId": "bt",
            "filiereId": "commerce-gestion-bt",
            "filiereName": "Commerce & Gestion (BT)",
            "description": "Apprenez les bases du commerce et de la vente. Cette formation pratique vous prépare à conseiller les clients, à agencer les rayons de vente, à négocier les achats et à gérer les encaissements en magasin ou en agence commerciale.",
            "duration": "24 mois",
            "objectives": [
                "Accueillir les clients et mener des entretiens de vente",
                "Gérer les stocks et approvisionner le point de vente",
                "Réaliser des devis, factures et gérer la caisse",
                "Mettre en valeur les produits (merchandising)"
            ],
            "semesters": [
                {
                    "number": 1,
                    "modules": ["Bases de la vente et étapes du processus commercial", "Connaissance générale des produits de consommation", "Calculs commerciaux et marges", "Bureautique de caisse"]
                },
                {
                    "number": 2,
                    "modules": ["Techniques de négociation commerciale", "Gestion des stocks et inventaires en magasin", "Merchandising de base & Agencement vitrines", "Droit commercial fondamental"]
                },
                {
                    "number": 3,
                    "modules": ["Fidélisation client & Service après-vente (SAV)", "Techniques de communication de vente", "Anglais de vente de base", "Bases de la publicité locale"]
                },
                {
                    "number": 4,
                    "modules": ["Stage pratique de 4 mois en commerce ou agence", "Présentation du rapport d'activités commerciales"]
                }
            ]
        },

        # ────────── CMP Formations ──────────
        {
            "id": "cmp-operateur-de-saisie",
            "title": "CMP Opérateur de Saisie",
            "categoryId": "cmp",
            "filiereId": "bureau-cmp",
            "filiereName": "Secrétariat & Bureautique (CMP)",
            "description": "Une formation de niveau CMP axée sur la rapidité et l'exactitude de saisie. Maîtrisez le clavier à l'aveugle, la mise en forme de documents bureautiques simples, l'alimentation de bases de données et les tâches d'archivage courantes.",
            "duration": "12 mois",
            "objectives": [
                "Saisir rapidement et sans erreurs des données textes et chiffrées",
                "Maîtriser les raccourcis clavier et l'outil Microsoft Word / Excel",
                "Trier, indexer et archiver des dossiers numériques",
                "Vérifier l'exactitude des informations à insérer dans le système"
            ],
            "semesters": [
                {
                    "number": 1,
                    "modules": ["Technique de dactylographie (Clavier aveugle)", "Traitement de texte Word (saisie et mise en forme)", "Système Windows (Fichiers, Dossiers, Raccourcis)", "Français de base"]
                },
                {
                    "number": 2,
                    "modules": ["Saisie sur Tableur Excel (Tableaux, calculs simples)", "Archivage de données numériques", "Stage pratique de 2 mois en entreprise", "Examen pratique de vitesse de saisie"]
                }
            ]
        },
        {
            "id": "cmp-agent-d-accueil-et-reception",
            "title": "CMP Agent d'Accueil et Réception",
            "categoryId": "cmp",
            "filiereId": "services-cmp",
            "filiereName": "Services & Restauration (CMP)",
            "description": "Devenez le premier visage d'une organisation. Cette formation prépare aux métiers d'accueil d'entreprise ou d'administration, en travaillant la posture professionnelle, la gestion du standard, l'orientation des visiteurs et l'anglais d'accueil de base.",
            "duration": "12 mois",
            "objectives": [
                "Accueillir chaleureusement les visiteurs physiques",
                "Filtrer et orienter les appels téléphoniques (gestion de standard)",
                "Prendre des messages et les transmettre aux bons services",
                "Gérer les registres d'entrées et de sorties d'établissement"
            ],
            "semesters": [
                {
                    "number": 1,
                    "modules": ["Techniques d'accueil & Posture d'agent", "Techniques d'écoute & Communication orale", "Gestion du standard téléphonique", "Vocabulaire d'accueil en français"]
                },
                {
                    "number": 2,
                    "modules": ["Bases de l'anglais d'accueil", "Introduction à la bureautique de secrétariat d'accueil", "Stage en entreprise d'accueil (2 mois)", "Simulation finale d'accueil et gestion des conflits"]
                }
            ]
        }
    ]

    for f in formations:
        cursor.execute("""
            INSERT INTO formations (id, title, categoryId, filiereId, filiereName, description, duration, objectives, brochure, semesters)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f["id"], f["title"], f["categoryId"], f["filiereId"], f["filiereName"],
            f["description"], f["duration"], json.dumps(f["objectives"]), "", json.dumps(f["semesters"])
        ))

    # 4. Seeds for downloaded brochures (Leads) to show data visualizer
    print("Seeding test leads (brochures)...")
    current_time_ms = int(time.time() * 1000)
    day_in_ms = 24 * 60 * 60 * 1000
    
    leads = [
        {"name": "Mourad Amara", "email": "mourad.amara@gmail.com", "phone": "0555234567", "formationId": "bts-developpeur-web-et-mobile", "formationTitle": "BTS Développeur Web et Mobile", "createdAt": current_time_ms - 3 * day_in_ms},
        {"name": "Sarah Bouazza", "email": "sarah.b@yahoo.fr", "phone": "0661987654", "formationId": "bts-comptabilite-et-gestion", "formationTitle": "BTS Comptabilité et Gestion", "createdAt": current_time_ms - 2 * day_in_ms},
        {"name": "Kenza Merabti", "email": "kenza.merab@outlook.com", "phone": "0770123456", "formationId": "bt-secretariat-de-direction", "formationTitle": "BT Secrétariat de Direction", "createdAt": current_time_ms - 1 * day_in_ms},
        {"name": "Yacine Kaci", "email": "yacine.kaci@gmail.com", "phone": "0552456789", "formationId": "bts-administration-et-securite-des-reseaux-informatiques", "formationTitle": "BTS Administration et Sécurité des Réseaux Informatiques", "createdAt": current_time_ms},
        {"name": "Amina Larabi", "email": "amina.l@gmail.com", "phone": "0699887766", "formationId": "cmp-agent-d-accueil-et-reception", "formationTitle": "CMP Agent d'Accueil et Réception", "createdAt": current_time_ms}
    ]
    for l in leads:
        cursor.execute("""
            INSERT INTO leads (name, email, phone, formationId, formationTitle, createdAt)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (l["name"], l["email"], l["phone"], l["formationId"], l["formationTitle"], l["createdAt"]))

    # 5. Seeds for online pre-registrations (Registrations) to show dashboard rendering
    print("Seeding online pre-registrations (registrations)...")
    registrations = [
        {
            "nom": "Ait Ali",
            "prenom": "Karim",
            "birthDate": "2005-04-12",
            "birthPlace": "Bejaia",
            "phone": "0550998877",
            "email": "karim.aitali@gmail.com",
            "address": "Cité Ihaddaden, Bejaia",
            "lastDegree": "Baccalauréat",
            "selectedCategory": "bts",
            "selectedFiliere": "informatique-numerique",
            "selectedFormation": "BTS Développeur Web et Mobile",
            "createdAt": current_time_ms - 5 * day_in_ms
        },
        {
            "nom": "Belkacemi",
            "prenom": "Lyna",
            "birthDate": "2006-09-18",
            "birthPlace": "El Kseur",
            "phone": "0662334455",
            "email": "lyna.belk@gmail.com",
            "address": "Aamriw, Bejaia",
            "lastDegree": "Baccalauréat",
            "selectedCategory": "bts",
            "selectedFiliere": "sciences-gestion",
            "selectedFormation": "BTS Comptabilité et Gestion",
            "createdAt": current_time_ms - 2 * day_in_ms
        },
        {
            "nom": "Mansouri",
            "prenom": "Sofiane",
            "birthDate": "2007-02-25",
            "birthPlace": "Bejaia",
            "phone": "0771882299",
            "email": "sof.mansouri@hotmail.com",
            "address": "Tichy, Bejaia",
            "lastDegree": "2ème Année Secondaire",
            "selectedCategory": "bt",
            "selectedFiliere": "commerce-gestion-bt",
            "selectedFormation": "BT Vente et Commerce",
            "createdAt": current_time_ms - 1 * day_in_ms
        },
        {
            "nom": "Sidhoum",
            "prenom": "Fatiha",
            "birthDate": "2008-07-30",
            "birthPlace": "Bejaia",
            "phone": "0656778899",
            "email": "fatiha.sidhoum@gmail.com",
            "address": "Sidi Ahmed, Bejaia",
            "lastDegree": "4ème Année Moyenne",
            "selectedCategory": "cmp",
            "selectedFiliere": "bureau-cmp",
            "selectedFormation": "CMP Opérateur de Saisie",
            "createdAt": current_time_ms
        }
    ]
    for r in registrations:
        cursor.execute("""
            INSERT INTO registrations (nom, prenom, birthDate, birthPlace, phone, email, address, lastDegree, selectedCategory, selectedFiliere, selectedFormation, createdAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (r["nom"], r["prenom"], r["birthDate"], r["birthPlace"], r["phone"], r["email"], r["address"], r["lastDegree"], r["selectedCategory"], r["selectedFiliere"], r["selectedFormation"], r["createdAt"]))

    # 6. Seed page_views and formation_views to feed the local analytics stats
    print("Seeding local stats page views...")
    page_views = [
        ("/", current_time_ms - 4 * day_in_ms),
        ("/", current_time_ms - 3 * day_in_ms),
        ("/formations", current_time_ms - 3 * day_in_ms),
        ("/a-propos", current_time_ms - 2 * day_in_ms),
        ("/contact", current_time_ms - 2 * day_in_ms),
        ("/", current_time_ms - 1 * day_in_ms),
        ("/formations", current_time_ms - 1 * day_in_ms),
        ("/preinscription", current_time_ms),
        ("/formations/bts-developpeur-web-et-mobile", current_time_ms),
        ("/formations/bts-comptabilite-et-gestion", current_time_ms),
    ]
    # Add multiple views to make counts realistic
    for path, visited_at in page_views:
        # Loop to insert multiple times
        for _ in range(5):
            cursor.execute("INSERT INTO page_views (path, visitedAt) VALUES (?, ?)", (path, visited_at))

    print("Seeding local stats formation views...")
    formation_views = [
        ("bts-developpeur-web-et-mobile", current_time_ms - 2 * day_in_ms),
        ("bts-comptabilite-et-gestion", current_time_ms - 1 * day_in_ms),
        ("bt-secretariat-de-direction", current_time_ms),
        ("bts-administration-et-securite-des-reseaux-informatiques", current_time_ms)
    ]
    for fid, viewed_at in formation_views:
        for _ in range(3):
            cursor.execute("INSERT INTO formation_views (formationId, viewedAt) VALUES (?, ?)", (fid, viewed_at))

    conn.commit()
    print("Database seeded successfully with BT, BTS, CMP data, registrations, brochure downloads, and local page views!")
    conn.close()

if __name__ == "__main__":
    seed_rich_data()
