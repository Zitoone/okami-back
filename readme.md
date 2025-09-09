# API OKAMI Connect

![Licence MIT](https://img.shields.io/badge/Licence-MIT-yellow.svg)
![APIRest](https://img.shields.io/badge/APIRest-pink)

Cette API REST fournit des points d'accès pour gérer les intervenants et leurs données du festival Okami. Elle est construite avec Node.js et Express.

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Exécutiondestests](#executiondestests)
- [Contributions](#contributions)
- [Licence](#licence)
- [Contact](#contact)

## Fonctionnalités

- Création, lecture, mise à jour et suppression d'intervenants


### Installation

Pour installer et configurer le projet, suivez les étapes ci-dessous:

```bash
git clone https://github.com/Zitoone/okami-back
cd okami-back
```

Pour installer les dépendances:

```bash
npm install
```

Configurer les variables d'environnement
Créer un fichier `.env` à la racine du projet
```
PORT=3000
MONGO_URI=mongoDB://localhost:27017/nomdevotrebase
JWT_SECRET=votre_secret_jwt
```

3. Pour Lancer l'API et qu'elle se mette à jour automatiquement

```bash
nodemon app.js
```

l'API sera disponible sur `http://localhost:3000`


## Utilisation

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

## Contributions

**Contributeurs :** Olivia Nanquette (développeuse)

Les contributions sont les bienvenues: 

1. Fork le projet
2. Créer une branche (git checkout -b feature/ma-fonctionnalité)
3. Commit (git commit -m 'Ajout de ma fonctionnalité')
4. Push (git push origin feature/ma-fonctionnalité)
5. Ouvrir une Pull Request


## Licence

Ce projet est sous licence MIT Voir le fichier _LICENSE_ pour plus de détails.

## Contact

Pour toutes questions, contactez Olivia Nanquette (mailto: oliviananquette@yahoo.fr)

