-- Table des utilisateurs
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    nom TEXT NOT NULL,
    prenom TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    FOREIGN KEY (tuteur_id) REFERENCES users(id)
);

-- Table des signatures
CREATE TABLE signatures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    convention_id INTEGER,
    user_id INTEGER,
    role TEXT,
    date_signature TIMESTAMP,
    FOREIGN KEY (convention_id) REFERENCES conventions(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
