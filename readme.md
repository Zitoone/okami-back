🥳 # API OKAMI Connect

![Licence MIT](https://img.shields.io/badge/Licence-MIT-yellow.svg)
![APIRest](https://img.shields.io/badge/APIRest-pink)
![Node.js](https://img.shields.io/badge/Node.js-purple)
![Express](https://img.shields.io/badge/Express-lightblue)
![MongoDB](https://img.shields.io/badge/MongoDB-green)

## Table des matières

- [Description](#description)
- [Structure](#Structureduprojet)
- [Endpoints](#endpoints)

- [Installation](#installation)
- [Utilisation](#utilisation)
- [Exécutiondestests](#executiondestests)
- [Contributions](#contributions)
- [Licence](#licence)
- [Contact](#contact)

## 📝 Description

Cette API REST fournit des points d'accès pour gérer les intervenants et leurs données pour la gestion d'un festival. Elle est construite avec Node.js et Express.
Les fonctionnalités principales sont la création, la lecture, la mise à jour et la suppression des différents type d'intervenants.
La création pourra être faite via un formulaire sur des pages publiques, mais toutes les autres actions seront effectués uniquement par un admin aprés authentification.

## 📂 Structure du projet

```
controllers/        # Création des controllers pour les opérations CRUD
models/             # Création d'un modèle de schéma de chaque type d'intervenant
routes/             # Configuration des routes
scripts/            #
App.jsx             # Point d’entrée de l’application React
db.js               # Connexion à la base de données MongoDB
```

## 💻 Les endpoints

* POST        /type-intervenant → Créer un nouvel intervenant
* GET         /admin/type-intervenant → Pour récupérer tous les intervenants de ce type
* GET         /admin/type-intervenant/:id → Récupérer un intervenant en particulier
* PATCH       /admin/type-intervenant/:id → Modifier un intervenant en particulier
* DELETE      /admin/type-intervenant/:id → Supprimer un intervenant en particulier

## 🔖 Schema de données (modèle)

_voir pour mettre en place la JSDoc_

### Installation

### Prérequis

- Node.js (version 24 ou supérieure)
- Compte MongoDB

Pour installer et configurer le projet, suivez les étapes ci-dessous:

#### 1. Cloner le repo
```bash
git clone https://github.com/Zitoone/okami-back
cd okami-back
```

#### 2. Installer les dépendances
```bash
npm install
```

#### 3. Liaison avec MongoDB
- Créer un compte sur MongoDB si besoin, et obtenez le lien de connexion à votre cluster via **Drivers**
- Créer un fichier `.env` à la racine :
```env
PORT=3000
MONGO_URI=mongoDB://localhost:27017/nomdevotrebase
JWT_SECRET=votre_secret_jwt
```
* `PORT`: port utilisé
* `MONGO_URI` : lien fournit par MongoDB pour se connecter à la base de données

#### 4. Lancer le back
En local : `node app.js`
Lancez le serveur sur [http://localhost:3000]

## 📋 Utilisation

### Récupérer tous les intervenants
**GET** `api/intervenant`
```json
[
  {
    "id": "1",
    "nom": "Astrix",
    "type": "Artiste",
    "email": "astrix@dj.com"
  },
  {
    "id": "2",
    "nom": "Martin",
    "type": "Bénévole",
    "email": "martin@email.com"
  }
]
```

### Créer un intervenant
**POST** `api/intervenants`

```json
{
  "nom": "Martin",
  "type": "Bénévole",
  "email": "martin@email.com"
}
```

## Exécution des tests

<!-- ```bash
npm test
``` -->

## 🚀 Déploiement

...

## 🤝 Contributions

**Contributeurs :** Olivia Nanquette (développeuse)

Les contributions sont les bienvenues: 

1. Fork le projet
2. Créer une branche (git checkout -b feature/ma-fonctionnalité)
3. Commit (git commit -m 'Ajout de ma fonctionnalité')
4. Push (git push origin feature/ma-fonctionnalité)
5. Ouvrir une Pull Request


## 📝 Licence

Ce projet est sous licence MIT Voir le fichier _LICENSE_ pour plus de détails.

## 🦄 Contact

Pour toutes questions, contactez Olivia Nanquette (mailto: olivia@okamifestival.com)

