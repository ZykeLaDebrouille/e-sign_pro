# E-Sign PRO

## **Présentation de notre proposition pour la digitalisation des conventions de stage**

---

### **1. Participants et rôles**

**Équipe projet :**

- **Enes** : Responsable Backend et Intégration des données
  - Rôle : Conception des APIs, gestion des bases de données et intégration des fonctionnalités principales (upload, signatures).
- **Salomon** : Responsable Frontend et Expérience Utilisateur
  - Rôle : Conception de l’interface utilisateur, gestion de l’accessibilité multiplateforme et mise en place d’une interface fluide et intuitive.

---

### **2. Proposition de solution et fonctionnalités clés**

#### **Objectif :**

Digitaliser et simplifier le processus de signature et d’archivage des conventions de stage pour les élèves, leurs responsables légaux, les entreprises et l’équipe éducative.

#### **Fonctionnalités du MVP (Minimum Viable Product) :**

1. **Upload et gestion des fichiers PDF :**
   - Les conventions de stage peuvent être téléchargées par les élèves ou pré-remplies depuis un modèle.
   - Enregistrement sécurisé sur le serveur.

2. **Signature électronique séquencée :**
   - Processus de signature défini par ordre (l’élève, les parents, l’entreprise, puis l’équipe pédagogique).
   - Authentification par e-mail ou lien unique pour chaque signataire.

3. **Génération du document final :**
   - Un PDF complet intégrant toutes les signatures, prêt à imprimer ou à archiver.

4. **Notifications :**
   - Alertes pour chaque étape complétée ou en attente (e-mails ou SMS).

5. **Archivage sécurisé :**
   - Stockage numérique conformément au RGPD.

#### **Schéma fonctionnel :**

```shema
[Utilisateur (Frontend)] ⇒ [API Backend] ⇒ [Base de données]
    ⇑               ⇓
[Génération PDF]    [Notifications]
```

---

### **3. Technologies à utiliser et raisons du choix**

#### **Frontend :**

- **React.js** : Framework moderne et réactif pour une interface intuitive.
  - Raison : Facile à configurer pour une PWA (Progressive Web App) compatible avec mobiles et PC.
- **Bootstrap** ou **Tailwind CSS** : Pour une interface présentable rapidement.

#### **Backend :**

- **Node.js** avec **Express** : API rapide et modulable.
  - Raison : Légèreté et communauté importante pour un développement efficace.

#### **Base de données :**

- **SQLite** (local) ou **MongoDB** (si NoSQL préféré).
  - Raison : Simplicite et rapidité pour prototyper un MVP.

#### **Génération PDF :**

- **PDFKit** : Librairie Node.js permettant de créer et de modifier des PDF.

#### **Hébergement :**

- **Railway** pour le backend et **Vercel** pour le frontend.
  - Raison : Solutions gratuites pour les petites équipes avec des besoins limités.

#### **Sécurité :**

- Utilisation de **JWT (JSON Web Tokens)** pour authentifier les utilisateurs.
- Connexions via **HTTPS**.

---

### **4. Infrastructure Docker**

Architecture des services Docker :
Frontend : Hébergé sur un conteneur Nginx.
Backend : Exécuté dans un conteneur Node.js.
Base de données : Exécutée dans un conteneur SQLite ou MongoDB (via une image Docker).
Proxy Nginx : Centralise les accès entre le frontend et le backend.
Commandes essentielles :
Build et lancement :

```bash
docker-compose up --build
```

Arrêt des services :

```bash
docker-compose down
```

Fichier docker-compose.yml simplifié :

```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"

  db:
    image: mongo
    ports:
      - "27017:27017"

  proxy:
    build:
      context: ./proxy
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - frontend
      - backend
```

---

### **5. Timeline envisagée**

| **Phase**              | **Date limite** | **Tâches principales**                           |
|-------------------------|-----------------|--------------------------------------------------|
| **Analyse initiale**    | 15 décembre     | Commence à choisir les outils choisis. |
| **Développement Backend** | 15 janvier      | APIs : Upload PDF, gestion des signatures.       |
| **Développement Frontend**| 31 janvier      | Interface : Formulaires, workflow utilisateur.   |
| **Intégration initiale**  | 15 février      | Mise en place du système complet pour tests. / Dernier rush     |
| **Tests utilisateurs**  | 28 février      | Recueil des retours et correction des bugs.      |

---

### **6. Modalités d’échange avec le client**

1. **Type d’échange :**
   - Réunions virtuelles 1/2 semaine pour présenter l’avancement.
   - Utilisation d’une plateforme collaborative comme **Notion** ou **Trello** pour partager les informations.

2. **Fréquence :**
   - Check-in toutes les deux semaines avec compte rendu des progrès.

---

### **7. Autres informations**

- **Formation utilisateurs :**
  - Une vidéo explicative ou une documentation succincte sera fournie pour aider les utilisateurs peu familiers avec le numérique.
- **Options futures :**
  - Intégration éventuelle avec Pronote pour automatiser encore plus le processus.

---

Nous restons à votre disposition pour toute clarification ou ajustement !
