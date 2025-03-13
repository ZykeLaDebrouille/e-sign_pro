-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    firstname TEXT,
    lastname TEXT,
    role TEXT DEFAULT 'ELEVE',
    is_active BOOLEAN DEFAULT 1,
    telephone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table des documents (nouvelle table pour la gestion des PDF)
CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content BLOB,
    status TEXT DEFAULT 'draft',
    student_info TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users (id)
);

-- Table des entreprises
CREATE TABLE IF NOT EXISTS entreprises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raison_sociale TEXT NOT NULL,
    siret TEXT,
    adresse TEXT,
    code_postal TEXT,
    ville TEXT,
    telephone TEXT,
    email TEXT,
    tuteur_id INTEGER,
    effectif_entreprise INTEGER,
    code_naf TEXT,
    convention_collective TEXT,
    caisse_retraite TEXT,
    urssaf_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tuteur_id) REFERENCES users(id)
);

-- Table des conventions
CREATE TABLE IF NOT EXISTS conventions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    eleve_id INTEGER,
    entreprise_id INTEGER,
    date_debut DATE,
    date_fin DATE,
    nb_semaines INTEGER,
    status TEXT DEFAULT 'brouillon',
    sujet_stage TEXT,
    gratification_montant DECIMAL(10,2),
    gratification_periode TEXT,
    horaires_travail TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES users(id),
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
);

-- Table des signatures
CREATE TABLE IF NOT EXISTS signatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    document_id INTEGER,
    convention_id INTEGER,
    user_id INTEGER,
    role TEXT,
    signature_data BLOB,
    date_signature DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (document_id) REFERENCES documents(id),
    FOREIGN KEY (convention_id) REFERENCES conventions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table pour les commentaires/retours sur les conventions
CREATE TABLE IF NOT EXISTS commentaires_convention (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    convention_id INTEGER,
    user_id INTEGER,
    commentaire TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (convention_id) REFERENCES conventions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table pour l'historique des modifications
CREATE TABLE IF NOT EXISTS historique_conventions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    convention_id INTEGER,
    user_id INTEGER,
    action TEXT,
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (convention_id) REFERENCES conventions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table de relation entre utilisateurs et documents
CREATE TABLE IF NOT EXISTS user_documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    document_id INTEGER NOT NULL,
    can_sign BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (document_id) REFERENCES documents(id)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_conventions_eleve ON conventions(eleve_id);
CREATE INDEX IF NOT EXISTS idx_conventions_entreprise ON conventions(entreprise_id);
CREATE INDEX IF NOT EXISTS idx_signatures_convention ON signatures(convention_id);
CREATE INDEX IF NOT EXISTS idx_signatures_document ON signatures(document_id);
CREATE INDEX IF NOT EXISTS idx_entreprises_tuteur ON entreprises(tuteur_id);
CREATE INDEX IF NOT EXISTS idx_user_documents ON user_documents(user_id, document_id);
