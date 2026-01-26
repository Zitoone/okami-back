# 🚂 Documentation de Déploiement - API OKAMI Connect

## 📋 Table des matières

- [Infrastructure](#infrastructure)
- [Prérequis techniques](#prérequis-techniques)
- [Variables d'environnement](#variables-denvironnement)
- [Procédure de déploiement](#procédure-de-déploiement)
- [CI/CD](#cicd)
- [Tests de validation](#tests-de-validation)
- [Monitoring et maintenance](#monitoring-et-maintenance)
- [Troubleshooting](#troubleshooting)
- [Bonnes pratiques](#bonnes-pratiques)

---

## 🏗️ Infrastructure

### Architecture

```
┌─────────────────┐
│   Frontend      │
│   (Client)      │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│   Railway       │
│   (PaaS)        │
│                 │
│  ┌───────────┐  │
│  │ Node.js   │  │
│  │ Express   │  │
│  └─────┬─────┘  │
└────────┼────────┘
         │
         ▼
┌─────────────────┐      ┌─────────────────┐
│  MongoDB Atlas  │      │   Cloudinary    │
│  (Database)     │      │  (File Storage) │
└─────────────────┘      └─────────────────┘
```

### Environnements

| Environnement | Hébergement | Base de données | URL |
|---------------|-------------|-----------------|-----|
| **Production** | Railway | MongoDB Atlas | `https://okami-back-production.up.railway.app` |
| **Développement** | Local | MongoDB Atlas | `http://localhost:5001` |

### Services tiers

- **Railway** : Plateforme PaaS pour l'hébergement de l'API
- **MongoDB Atlas** : Base de données NoSQL managée
- **Cloudinary** : Stockage et optimisation des fichiers (images, PDFs)
- **Gmail SMTP** : Service d'envoi d'emails (Nodemailer)
- **GitHub** : Gestion de version et déploiement automatique

---

## 📦 Prérequis techniques

### Versions minimales

- **Node.js** : v20.x ou supérieur
- **npm** : v9.x ou supérieur
- **Git** : v2.x ou supérieur

### Dépendances système

Aucune dépendance système spécifique requise. Toutes les dépendances sont gérées via npm.

### Dépendances principales

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.18.1",
  "multer": "^2.0.2",
  "cloudinary": "^2.8.0",
  "jsonwebtoken": "^9.0.2",
  "bcrypt": "^6.0.0",
  "cors": "^2.8.5",
  "dotenv": "^17.2.1",
  "nodemailer": "^7.0.10"
}
```

### Comptes requis

- **GitHub** : Pour le versioning et le déploiement automatique
- **Railway** : Plateforme d'hébergement (plan gratuit disponible)
- **MongoDB Atlas** : Base de données (plan gratuit M0 disponible)
- **Cloudinary** : Stockage de fichiers (plan gratuit disponible)
- **Gmail** : Pour l'envoi d'emails (compte avec mot de passe d'application)

---

## 🔐 Variables d'environnement

### Variables requises

| Variable | Description | Exemple | Obligatoire |
|----------|-------------|---------|-------------|
| `MONGO_URI` | URI de connexion MongoDB Atlas | `mongodb+srv://user:pass@cluster.mongodb.net/db` | ✅ |
| `JWT_SECRET` | Clé secrète pour les tokens JWT | `votre_secret_securise_32_caracteres` | ✅ |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary | `dyjbhe4yp` | ✅ |
| `CLOUDINARY_API_KEY` | Clé API Cloudinary | `111965166654227` | ✅ |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary | `V5G8shyUTbHRiBmvrzs8aB0OdfE` | ✅ |
| `MAIL_HOST` | Serveur SMTP | `smtp.gmail.com` | ✅ |
| `MAIL_PORT` | Port SMTP | `465` | ✅ |
| `MAIL_USER` | Email d'envoi | `contact@okamifestival.com` | ✅ |
| `MAIL_PASS` | Mot de passe d'application Gmail | `xxxx xxxx xxxx xxxx` | ✅ |
| `FRONT_URL` | URL du frontend | `https://okami-sigma.vercel.app` | ✅ |
| `PORT` | Port d'écoute du serveur | `5001` | ❌ (auto Railway) |

### Configuration locale (.env)

Créer un fichier `.env` à la racine du projet :

```env
PORT=5001
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/okami2026?retryWrites=true&w=majority
JWT_SECRET=votre_secret_jwt_securise
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret
MAIL_HOST=smtp.gmail.com
MAIL_PORT=465
MAIL_USER=votre_email@gmail.com
MAIL_PASS=votre_mot_de_passe_application
FRONT_URL=http://localhost:5173
```

⚠️ **Important** : Ne jamais committer le fichier `.env` (déjà dans `.gitignore`)

---

## 🚀 Procédure de déploiement

### Étape 1 : Préparation du code

#### 1.1 Vérifier la structure

Assurez-vous que `app.js` écoute sur le port dynamique :

```javascript
const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`)
})
```

#### 1.2 Vérifier package.json

```json
{
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

#### 1.3 Commit et push

```bash
git add -A
git commit -m "chore: prepare for Railway deployment"
git push origin main
```

### Étape 2 : Configuration Railway

#### 2.1 Créer un compte

1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur **"Login"** → **"Login with GitHub"**
3. Autorisez Railway à accéder à vos repos

#### 2.2 Créer un nouveau projet

1. Cliquez sur **"New Project"**
2. Sélectionnez **"Deploy from GitHub repo"**
3. Choisissez le repo **`okami-back`**
4. Railway détecte automatiquement Node.js et lance le build

#### 2.3 Générer un domaine public

1. Cliquez sur votre service dans le dashboard
2. Allez dans **Settings** → **Networking**
3. Cliquez sur **"Generate Domain"**
4. Railway vous donne une URL : `https://okami-back-production.up.railway.app`

---

### Étape 3 : Configuration des variables

#### 3.1 Ajouter les variables

Dans le dashboard Railway, cliquez sur **Variables** et ajoutez toutes les variables listées dans la section [Variables d'environnement](#variables-denvironnement).

#### 3.2 Partager avec le service

⚠️ **Important** : Railway crée les variables au niveau du projet. Il faut les partager avec le service.

Pour chaque variable :
1. Cliquez sur **"Share"** à côté de la variable
2. Sélectionnez votre service **"okami-back"**
3. Validez

⚠️ **Ne PAS créer de variable `PORT`** - Railway la définit automatiquement.

#### 3.3 Redéploiement automatique

Railway redéploie automatiquement après l'ajout des variables.

---

### Étape 4 : Déploiement

#### 4.1 Build automatique

Railway détecte :
- `package.json` → Installe les dépendances avec `npm install`
- Script `start` → Lance l'app avec `npm start`

#### 4.2 Suivre le déploiement

1. Allez dans **Deployments**
2. Cliquez sur le dernier déploiement
3. Consultez les logs en temps réel

**Logs de succès :**
```
Starting Container
> back@1.0.0 start
> node app.js

Serveur démarré sur le port 8080
Connexion à MongoDB réussie :-)
```

---

### Étape 5 : Vérification

#### 5.1 Tester l'API

Ouvrez l'URL Railway dans le navigateur :
```
https://okami-back-production.up.railway.app/
```

Vous devriez voir :
```
Bienvenue sur votre API RESTful OKAMI!
```

#### 5.2 Tester un endpoint

```bash
curl https://okami-back-production.up.railway.app/api/artists/public
```

#### 5.3 Vérifier les logs

En cas d'erreur, consultez les logs dans **Deployments** → **View Logs**.

---

### Étape 6 : Mise à jour du frontend

#### 6.1 Configurer l'URL de l'API

Dans les variables d'environnement du frontend, mettez à jour :

```env
VITE_API_URL=https://okami-back-production.up.railway.app
```

#### 6.2 Tester l'intégration

Testez le formulaire en production pour vérifier la communication frontend-backend.

---

## 🐛 Troubleshooting

### Erreur : "Application failed to respond"

**Cause :** Le serveur ne démarre pas ou crash.

**Solution :**
1. Vérifiez les logs dans **Deployments**
2. Vérifiez que toutes les variables sont partagées avec le service
3. Vérifiez `MONGO_URI` (erreur fréquente)

### Erreur : MongoDB connection failed

**Cause :** `MONGO_URI` incorrecte ou non partagée.

**Solution :**
1. Vérifiez que `MONGO_URI` est bien partagée avec le service
2. Testez la connexion MongoDB depuis MongoDB Atlas
3. Vérifiez que l'IP de Railway est autorisée (ou mettez `0.0.0.0/0`)

### Erreur 502 Bad Gateway

**Cause :** Le serveur a crashé ou timeout (5 minutes max).

**Solution :**
1. Consultez les logs pour voir l'erreur exacte
2. Si timeout : fichiers trop lourds (> 10 MB)
3. Augmentez la limite dans `uploadMiddleware.js` si nécessaire

### Erreur CORS

**Cause :** `FRONT_URL` incorrecte ou non définie.

**Solution :**
1. Vérifiez que `FRONT_URL` est bien définie dans Railway
2. Vérifiez que la valeur correspond exactement à l'URL du front
3. Pas de `/` à la fin : `https://front.example.com` ✅ pas `https://front.example.com/` ❌

### Upload de fichiers échoue

**Cause :** Fichier trop lourd ou timeout Cloudinary.

**Solution :**
1. Vérifiez la limite dans `uploadMiddleware.js` (actuellement 10 MB)
2. Vérifiez les credentials Cloudinary dans les variables
3. Consultez les logs pour voir l'erreur Cloudinary exacte

---

## 📈 Monitoring et maintenance

### Limites du plan gratuit Railway

- **500 heures d'exécution/mois**
- **100 GB de bande passante/mois**
- **Pas de limite de taille de fichier**
- **Timeout : 5 minutes par requête**

### Logs en temps réel

Dans Railway, allez dans **Logs** pour voir les requêtes en temps réel :
- ✅ `200` : Succès
- ⚠️ `500` : Erreur serveur
- ⚠️ `499` : Client a annulé (timeout côté user)
- ❌ `502` : Timeout Railway (> 5 minutes)

### Métriques

Railway affiche automatiquement :
- CPU usage
- Memory usage
- Network traffic

---

## 🔄 CI/CD

### Déploiement automatique

Railway est configuré pour le déploiement continu :

```
git push origin main → Railway détecte → Build → Deploy
```

**Workflow :**
1. Développeur push sur `main`
2. Railway détecte le changement via webhook GitHub
3. Railway clone le repo
4. Railway exécute `npm install`
5. Railway exécute `npm start`
6. Nouveau container déployé
7. Ancien container arrêté (zero-downtime)

### Déploiement manuel

Pour forcer un redéploiement sans changement de code :

```bash
# Via Railway Dashboard
Settings → Redeploy
```

### Rollback

En cas de problème, Railway permet de revenir à un déploiement précédent :

1. Allez dans **Deployments**
2. Sélectionnez un déploiement précédent
3. Cliquez sur **Redeploy**

### Branches et environnements

Pour créer un environnement de staging :

1. Créer une branche `staging`
2. Créer un nouveau service Railway lié à cette branche
3. Configurer les variables d'environnement spécifiques

---

## 🧪 Tests de validation

### Tests automatisés

Actuellement, le projet n'implémente pas de tests automatisés. Recommandations futures :

#### Tests unitaires (Jest)

```javascript
// Exemple de test pour artistsController
describe('createOrUpdateArtist', () => {
  it('should create a new artist', async () => {
    // Test implementation
  })
})
```

#### Tests d'intégration

```javascript
// Exemple de test d'endpoint
describe('POST /api/artists/form', () => {
  it('should upload files and create artist', async () => {
    // Test implementation
  })
})
```

### Tests de non-régression post-déploiement

#### Checklist manuelle

- [ ] API répond sur `/` (message de bienvenue)
- [ ] Endpoint `/api/artists/public` retourne les artistes validés
- [ ] Upload de photo fonctionne (< 10 MB)
- [ ] Upload de PDF fonctionne (< 10 MB)
- [ ] Connexion MongoDB établie
- [ ] CORS configuré correctement
- [ ] Emails envoyés via Nodemailer

#### Tests de charge

Pour tester la capacité de l'API :

```bash
# Avec Apache Bench
ab -n 100 -c 10 https://okami-back-production.up.railway.app/api/artists/public
```

### Approche TDD

Le projet n'utilise pas actuellement TDD. Pour l'implémenter :

1. Écrire les tests avant le code
2. Exécuter les tests (ils échouent)
3. Écrire le code minimal pour passer les tests
4. Refactoriser
5. Répéter

---

## 📞 Support

En cas de problème :
- Documentation Railway : [docs.railway.app](https://docs.railway.app)
- Discord Railway : [discord.gg/railway](https://discord.gg/railway)
- Logs Railway : Toujours consulter les logs en premier

---

## 📚 Bonnes pratiques

### Documentation

- ✅ Documentation versionnée avec le code (dossier `/docs` ou fichiers `.md` à la racine)
- ✅ Format Markdown pour la lisibilité
- ✅ Mise à jour à chaque changement majeur
- ✅ Schémas d'architecture inclus

### Sécurité

- ✅ Variables sensibles dans `.env` (jamais commitées)
- ✅ `.gitignore` configuré
- ✅ CORS configuré avec origine spécifique
- ✅ JWT pour l'authentification admin
- ✅ Validation des fichiers uploadés (type, taille)

### Performance

- ✅ Connection pooling MongoDB (maxPoolSize: 50)
- ✅ Cache de connexion pour serverless
- ✅ Optimisation des images via Cloudinary
- ✅ Tri avec collation pour performance

### Maintenance

- ✅ Logs structurés pour le debugging
- ✅ Gestion d'erreurs centralisée
- ✅ Monitoring via Railway dashboard
- ✅ Déploiement automatique via CI/CD

---

## ✨ Checklist de déploiement

- [ ] Code préparé et testé localement
- [ ] Variables d'environnement configurées
- [ ] Projet Railway créé et lié à GitHub
- [ ] Domaine public généré
- [ ] Premier déploiement réussi
- [ ] Tests de validation passés
- [ ] Frontend mis à jour avec nouvelle URL
- [ ] Monitoring configuré
- [ ] Documentation mise à jour

**Votre API est maintenant déployée sur Railway ! 🎉**

---

*Documentation mise à jour le : 01/12/2024*  
*Version de l'API : 1.0.0*  
*Auteur : Olivia Nanquette*
