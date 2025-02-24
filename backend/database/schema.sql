-- Table des utilisateurs
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    telephone TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des conventions
CREATE TABLE conventions (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES users(id),
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id)
);

-- Table des entreprises
CREATE TABLE entreprises (
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tuteur_id) REFERENCES users(id)
);


-- Table des signatures
CREATE TABLE signatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    convention_id INTEGER,
    user_id INTEGER,
    role TEXT,
    date_signature TIMESTAMP,
    ip_address TEXT,
    signature_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (convention_id) REFERENCES conventions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Nouvelle table pour les commentaires/retours sur les conventions
CREATE TABLE commentaires_convention (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    convention_id INTEGER,
    user_id INTEGER,
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (convention_id) REFERENCES conventions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Nouvelle table pour l'historique des modifications
CREATE TABLE historique_conventions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    convention_id INTEGER,
    user_id INTEGER,
    action TEXT,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (convention_id) REFERENCES conventions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Index pour améliorer les performances
CREATE INDEX idx_conventions_eleve ON conventions(eleve_id);
CREATE INDEX idx_conventions_entreprise ON conventions(entreprise_id);
CREATE INDEX idx_signatures_convention ON signatures(convention_id);
CREATE INDEX idx_entreprises_tuteur ON entreprises(tuteur_id);