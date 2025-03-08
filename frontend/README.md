# E-Sign PRO

E-Sign PRO est une application dédiée à la digitalisation des conventions de stage, permettant une gestion fluide et sécurisée des signatures électroniques. Ce projet vise à simplifier le processus administratif tout en respectant les normes de sécurité et de confidentialité des données.

## Fonctionnalités principales

1. **Authentification sécurisée** :
   - Système de connexion utilisant JWT (JSON Web Token).
   - Validation légère par OTP (One-Time Password) envoyé par email.

2. **Gestion des signatures électroniques** :
   - Options pour dessiner, saisir un nom ou importer une image de signature.
   - Signatures enregistrées avec horodatage et adresse IP.
   - Hashage des signatures à l'aide de SHA-256 pour garantir leur intégrité.

3. **Intégration des documents PDF** :
   - Génération et intégration des signatures directement dans des fichiers PDF.
   - Documents verrouillés après la signature pour éviter toute modification.

4. **Suivi et traçabilité** :
   - Journalisation complète des activités (audit trail).
   - Gestion des états des signatures (signé, en attente, etc.).

## Technologies utilisées

### Frontend :
- **React.js** : Framework JavaScript pour la création d'une interface utilisateur interactive.
- **React Signature Canvas** : Outil pour la gestion des signatures électroniques dessinées.
- **Tailwind CSS** : Framework CSS pour un design simple et rapide.

### Backend :
- **Node.js** avec **Express** : Serveur backend.
- **PDFKit** : Librairie pour la gestion des documents PDF.
- **SQLite** / **MongoDB** : Base de données pour le stockage des informations liées aux utilisateurs, documents et signatures.
- **Node-SignPDF** : Intégration des signatures dans les fichiers PDF.
- **Crypto (SHA-256)** : Hashage des signatures pour une sécurité renforcée.

### Infrastructure :
- **Docker** : Conteneurisation pour simplifier le déploiement et la gestion de l'application.
- **Railway** : Déploiement du backend.
- **Vercel** : Hébergement du frontend.

## Structure du projet

### Frontend
- **`/public`** : Contient les fichiers statiques.
- **`/src`** : Code source de l'application React.
  - **`components`** : Composants réutilisables.
  - **`pages`** : Pages principales de l'application (Connexion, Liste des documents, etc.).
  - **`services`** : Gestion des appels API.

### Backend
- **`routes`** : Définit les endpoints de l'API.
- **`controllers`** : Logique métier pour la gestion des utilisateurs et des documents.
- **`models`** : Définit les schémas de la base de données.
- **`middlewares`** : Gestion de l'authentification et des validations.

## Installation et démarrage

### Prérequis
- **Node.js** (v16+ recommandé).
- **Docker** (optionnel pour la conteneurisation).
- **SQLite/MongoDB** configuré pour le backend.

### Étapes d'installation
1. Clonez le dépôt GitHub :
   ```bash
   git clone https://github.com/M02laleague/e-sign-pro.git
   ```
2. Accédez au répertoire du projet :
   ```bash
   cd e-sign-pro
   ```
3. Installez les dépendances pour le backend et le frontend :
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```
4. Configurez les variables d'environnement (backend) :
   - Créez un fichier `.env` dans le répertoire `backend`.
   - Ajoutez les variables nécessaires (exemple dans `.env.example`).

5. Lancez le projet :
   ```bash
   # Backend
   cd backend
   npm start

   # Frontend
   cd ../frontend
   npm start
   ```

### Utilisation avec Docker (optionnel)
1. Assurez-vous que Docker est installé sur votre machine.
2. Construisez et démarrez les conteneurs :
   ```bash
   docker-compose up --build
   ```

## Fonctionnalités en cours de développement

- Amélioration de la gestion des rôles pour les utilisateurs.
- Interface utilisateur pour l'historique des signatures.
- Notifications par email pour informer les signataires.

## Contributions
Les contributions sont les bienvenues ! Veuillez suivre ces étapes :
1. Forkez le dépôt.
2. Créez une branche pour vos modifications :
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalité
   ```
