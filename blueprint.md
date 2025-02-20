D'accord, je vais retirer toutes les références à **MongoDB** et ajouter une section résumant les **ajouts potentiels** pour le projet **E-Sign PRO**. Voici la version mise à jour :

---

## **Documentation Technique : E-Sign PRO**

---

### **1. User Stories et Mockups**

**Objectif :** Décrire les fonctionnalités du MVP du point de vue de l'utilisateur et créer des maquettes pour l'interface utilisateur.

**User Stories :**
1. **En tant qu'élève**, je veux uploader une convention de stage pour qu'elle soit signée par les parties concernées.
2. **En tant que parent**, je veux recevoir une notification pour signer la convention de stage de mon enfant.
3. **En tant qu'entreprise**, je veux signer la convention de stage en ligne pour éviter les délais postaux.
4. **En tant qu'équipe pédagogique**, je veux valider la convention de stage une fois toutes les signatures obtenues.

**Priorisation (MoSCoW) :**
- **Must Have** : Upload, signature séquencée, notifications.
- **Should Have** : Archivage sécurisé, génération du PDF final.
- **Could Have** : Intégration avec Pronote.
- **Won't Have** : Gestion des paiements.

**Mockups :**
- **Maquette 1** : Page d'upload du PDF.
- **Maquette 2** : Interface de signature électronique.
- **Maquette 3** : Tableau de bord de suivi des conventions.

---

### **2. Architecture du Système**

**Objectif :** Décrire comment les composants du système interagissent.

**Diagramme d'Architecture :**

```mermaid
graph TD
    A[Frontend: React] -->|Requêtes API| B[Backend: Node.js/Express]
    B -->|Stockage des données| C[(Base de Données: SQLite)]
    B -->|Génération PDF| D[PDFKit]
    B -->|Notifications| E[Service de Notifications]
    E -->|E-mails/SMS| F[Utilisateurs]
```

**Explication :**
- **Frontend** : Interface utilisateur en React.
- **Backend** : API en Node.js/Express pour gérer les requêtes.
- **Base de Données** : SQLite pour stocker les conventions et les informations des utilisateurs.
- **PDFKit** : Pour générer les PDF signés.
- **Service de Notifications** : Envoi d'e-mails ou de SMS aux utilisateurs.

---

### **3. Composants, Classes et Base de Données**

**Objectif :** Décrire la structure interne du système.

**Classes Backend :**
- **User** : Gère les informations des utilisateurs (élèves, parents, entreprises).
- **Convention** : Stocke les données de la convention (PDF, signatures, statut).
- **Notification** : Gère l'envoi des notifications.

**Base de Données :**
- **Table : Users**
  - `id` (INT, PK), `name` (TEXT), `email` (TEXT), `role` (TEXT).
- **Table : Conventions**
  - `id` (INT, PK), `file_path` (TEXT), `signatures` (TEXT), `status` (TEXT).

---

### **4. Diagrammes de Séquence**

**Objectif :** Illustrer les interactions entre les composants pour les cas d'utilisation clés.

**Diagramme de Séquence : Signature d'une Convention**

```mermaid
sequenceDiagram
    participant Élève
    participant Frontend
    participant Backend
    participant BaseDeDonnées
    participant ServiceNotifications

    Élève ->> Frontend: Upload du PDF
    Frontend ->> Backend: Envoi du PDF
    Backend ->> BaseDeDonnées: Enregistrement du PDF
    Backend ->> ServiceNotifications: Notification pour le parent
    ServiceNotifications ->> Parent: E-mail/SMS
    Parent ->> Frontend: Signature
    Frontend ->> Backend: Envoi de la signature
    Backend ->> BaseDeDonnées: Mise à jour de la convention
    Backend ->> ServiceNotifications: Notification pour l'entreprise
```

---

### **5. Documentation des APIs**

**Objectif :** Décrire les APIs externes et internes.

**APIs Externes :**
- Aucune API externe utilisée pour ce MVP.

**APIs Internes :**
1. **Upload du PDF**
   - **URL** : `/api/upload`
   - **Méthode** : POST
   - **Input** : `{ "file": "PDF", "userId": 1 }`
   - **Output** : `{ "status": "success", "conventionId": 1 }`

2. **Signature Électronique**
   - **URL** : `/api/sign`
   - **Méthode** : POST
   - **Input** : `{ "conventionId": 1, "signature": "base64", "role": "parent" }`
   - **Output** : `{ "status": "success" }`

---

### **6. Stratégies SCM et QA**

**Gestion du Code Source (SCM) :**
- **Outil** : Git.
- **Branches** :
  - `main` : Version stable.
  - `develop` : Développement en cours.
  - `feature/*` : Branches pour chaque fonctionnalité.
- **Processus** :
  - Code reviews avant fusion dans `develop`.
  - Déploiement automatique sur Vercel (Frontend) et Railway (Backend).

**Assurance Qualité (QA) :**
- **Tests Unitaires** : Jest pour tester les APIs.
- **Tests d'Intégration** : Postman pour tester les workflows complets.
- **Tests Manuels** : Validation des fonctionnalités clés par l'équipe.

---

### **7. Justifications Techniques**

**Choix des Technologies :**
- **React** : Facile à utiliser pour une interface utilisateur réactive.
- **Node.js/Express** : Léger et adapté pour une API rapide.
- **SQLite** : Simple et efficace pour un MVP, ne nécessite pas de serveur de base de données séparé.
- **PDFKit** : Simple à intégrer pour générer des PDF.
- **JWT** : Sécurise l'authentification des utilisateurs.

---

### **8. Ajouts Potentiels**

Le projet **E-Sign PRO** est bien avancé, mais les améliorations suivantes sont nécessaires pour garantir sa conformité et son efficacité :

1. **Politique de Confidentialité :**
   - Ajouter une politique claire expliquant comment les données sont collectées, utilisées et protégées.

2. **Routes API pour les Droits des Utilisateurs :**
   - Mettre en place des endpoints pour gérer les permissions (ex : accès aux PDF, suppression des données).

3. **Sécurisation des Données :**
   - Renforcer la sécurité des PDFs et des données stockées (chiffrement des fichiers, validation des accès).

4. **Gestion des Données :**
   - Clarifier la durée de conservation des données et les procédures de suppression.
   - Vérifier où les données sont stockées (UE ou hors UE) pour garantir la conformité au RGPD.

5. **Gestion du Consentement :**
   - Mettre en place un système de consentement explicite pour l'envoi d'e-mails (opt-in).

---

### **9. Conclusion**

Cette documentation technique fournit un **blueprint complet** pour le développement du MVP d'**E-Sign PRO**. Elle décrit les fonctionnalités, l'architecture, les interactions, et les stratégies de gestion du code et de qualité. En suivant ce plan, l'équipe peut développer le projet de manière structurée et efficace, tout en anticipant les améliorations nécessaires pour garantir la conformité et la sécurité.
