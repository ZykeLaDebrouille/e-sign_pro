# E-Sign PRO

## **Digitalisation des Conventions de Stage**

Ce document constitue le README officiel du projet E-Sign PRO. Il a pour vocation d’informer l’ensemble des utilisateurs, développeurs et parties prenantes sur l’architecture, les technologies utilisées et la planification du projet.

---

### **1. Participants et Rôles**

**Équipe projet :**

- **Enes** : Responsable Backend et Intégration des données  
  *Rôle* : Conception des APIs, gestion des bases de données et intégration des fonctionnalités principales (upload, signatures).

- **Salomon** : Responsable Frontend et Expérience Utilisateur  
  *Rôle* : Conception de l’interface utilisateur, gestion de l’accessibilité multiplateforme et mise en place d’une interface fluide et intuitive.

---

### **2. Description du Projet et Fonctionnalités Clés**

**Objectif :**  
Digitaliser et simplifier le processus de signature et d’archivage des conventions de stage pour les élèves, leurs responsables légaux, les entreprises et l’équipe éducative.

**Fonctionnalités du MVP (Minimum Viable Product) :**

1. **Upload et gestion des fichiers PDF :**  
   - Téléchargement des conventions de stage par les élèves ou pré-remplissage depuis un modèle.  
   - Enregistrement sécurisé sur le serveur.

2. **Signature électronique séquencée :**  
   - Processus de signature défini par ordre (élève, parents, entreprise, puis équipe pédagogique).  
   - Authentification via e-mail ou lien unique pour chaque signataire.

3. **Génération du document final :**  
   - Création d’un PDF intégrant toutes les signatures, prêt à imprimer ou archiver.

4. **Notifications :**  
   - Alertes pour chaque étape complétée ou en attente (via e-mails ou SMS).

5. **Archivage sécurisé :**  
   - Stockage numérique conforme au RGPD.

**Schéma fonctionnel :**

```shema
[Utilisateur (Frontend)] ⇒ [API Backend] ⇒ [Base de données]
    ⇑               ⇓
[Génération PDF]    [Notifications]
```

---

### **3. Technologies Utilisées et Justifications**

#### **Frontend :**

- **React.js**  
  *Utilisation* : Développement d’une interface réactive et moderne.  
- **Tailwind CSS**  
  *Utilisation* : Mise en place d’un design épuré et facilement personnalisable pour une meilleure expérience utilisateur.

#### **Backend :**

- **Node.js** avec **Express**  
  *Utilisation* : Création d’API rapides et modulables.  
  *Justification* : Forte communauté et simplicité de mise en œuvre pour répondre aux besoins du projet.

#### **Gestion des PDF :**

- **PDFLib**  
  *Utilisation* : Création et modification des PDF de manière dynamique pour intégrer les signatures et autres informations nécessaires.

#### **Infrastructure et Proxy :**

- **NGINX**  
  *Utilisation* : Mise en place du proxy pour centraliser les accès entre le frontend et le backend, garantissant ainsi une meilleure gestion des flux et une sécurité accrue.

#### **Base de Données :**

- **SQLite** (option locale) ou **MongoDB** (pour une approche NoSQL)  
  *Justification* : Choix guidé par la simplicité et la rapidité lors de la phase de prototypage du MVP.

#### **Hébergement :**

- **Vercel**  
  *Justification* : Solutions adaptées aux petites équipes et aux besoins limités de déploiement initial.

#### **Sécurité :**

- Mise en œuvre de **JWT (JSON Web Tokens)** pour authentifier les utilisateurs.  
- Utilisation de **HTTPS** pour sécuriser les connexions.

---

### **4. Infrastructure Docker**

L’architecture Docker se compose de plusieurs services :

- **Frontend :**  
  Hébergé dans un conteneur NGINX pour servir l’application React avec Tailwind CSS.

- **Backend :**  
  Exécuté dans un conteneur Node.js avec Express.

- **Base de Données :**  
  Exécutée dans un conteneur SQLite.

- **Proxy :**  
  Un conteneur NGINX pour centraliser et sécuriser les accès entre le frontend et le backend.

**Commandes essentielles :**

- **Build et lancement :**

  ```bash
  docker-compose up --build
  ```

- **Arrêt des services :**

  ```bash
  docker-compose down
  ```

**Exemple simplifié du fichier docker-compose.yml :**

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

### **5. Planning et Échéancier**

| **Phase**                  | **Date limite**  | **Tâches principales**                                          |
|----------------------------|------------------|-----------------------------------------------------------------|
| **Analyse initiale**       | 15 décembre      | Choix et configuration des outils et technologies.              |
| **Développement Backend**  | 15 janvier       | Création des APIs : Upload PDF, gestion des signatures.          |
| **Développement Frontend** | 31 janvier       | Conception de l’interface utilisateur et mise en place du workflow. |
| **Intégration initiale**   | 15 février       | Intégration complète du système pour phase de tests.              |
| **Tests utilisateurs**     | 28 février       | Recueil des retours et correction des bugs identifiés.            |

---

### **7. Documentation et Formation**

- **Formation des utilisateurs :**  
  Une vidéo explicative et une documentation succincte seront mises à disposition pour faciliter la prise en main du système, en particulier pour les utilisateurs peu familiers avec le numérique.

- **Évolutions futures :**  
  Possibilité d’intégrer des fonctionnalités avancées, telles que l’automatisation de certaines tâches via Pronote, pour optimiser davantage le processus de gestion des conventions de stage.

---

Nous restons à votre disposition pour toute clarification ou ajustement. Ce README est conçu pour être la référence principale du projet.
