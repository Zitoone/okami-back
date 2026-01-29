# 🚀 Guide de déploiement sur Render - API OKAMI Connect

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

### Services tiers

- **Render** : Plateforme PaaS pour l'hébergement de l'API
- **MongoDB Atlas** : Base de données NoSQL managée
- **Cloudinary** : Stockage et optimisation des fichiers (images, PDFs)
- **Gmail SMTP** : Service d'envoi d'emails via Nodemailer
- **GitHub** : Gestion de version et déploiement automatique

---

## 📦 Prérequis techniques

### Versions minimales

- **Node.js** : v20.x ou supérieur
- **npm** : v9.x ou supérieur
- **Git** : v2.x ou supérieur

---


## 🔐 Variables d'environnement

### Variables requises

## 🔐 Configuration locale (.env)

Créer un fichier `.env` à la racine du projet en y insérant toutes les variables requises :

| Variable                 | Description                      | Exemple                                     | Obligatoire |
|--------------------------|----------------------------------|--------------------------------------------|-------------|
| `MONGO_URI`              | URI de connexion MongoDB Atlas   | `mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>` | Oui |
| `JWT_SECRET`             | Clé secrète pour JWT            | `votre_secret_complexe`                     | Oui |
| `CLOUDINARY_CLOUD_NAME`  | Nom du cloud Cloudinary         | `name-cloud`                               | Oui |
| `CLOUDINARY_API_KEY`     | Clé API Cloudinary              | `123456789`                                 | Oui |
| `CLOUDINARY_API_SECRET`  | Secret API Cloudinary           | `abcdefg`                                   | Oui |
| `MAIL_HOST`              | Serveur SMTP                    | `smtp.gmail.com`                            | Oui |
| `MAIL_PORT`              | Port SMTP                        | `587`                                       | Oui |
| `MAIL_USER`              | Email d'envoi                    | `votre-email@gmail.com`                     | Oui |
| `MAIL_PASS`              | Mot de passe d'application Gmail | `xxxx`                                      | Oui |
| `FRONT_URL`              | URL du frontend                  | `https://votre-front.vercel.app`           | Oui |
| `PORT`                   | Port d'écoute du serveur         | `5001`                                      | Non (Render définit automatiquement) |

⚠️ **Important** : Ne jamais committer le fichier `.env`. Ajoutez-le systématiquement dans `.gitignore`.

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
git add .
git commit -m "chore: prepare for Render deployment"
git push origin main
```

---

## 🌐 Étape 2 : Configuration Render

#### 2.1 Créer un compte

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **"Get Started"** → **"Sign up with GitHub"**
3. Autorisez Render à accéder à vos repos

#### 2.2 Créer un nouveau Web Service

1. Dans le dashboard, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre repo GitHub **`okami-back`**
3. Configurez le service :
   - **Name** : `okami-back` (ou nom de votre choix)
   - **Region** : `Frankfurt (EU Central)` (ou plus proche de vous)
   - **Branch** : `main`
   - **Runtime** : `Node`
   - **Build Command** : `npm ci`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free`

---

## 🔐 Étape 3 : Configuration des variables d'environnement

#### 3.1 Ajouter les variables

Ajoutez toutes les variables listées dans la section [Variables d'environnement](#variables-denvironnement) ci-dessus.

⚠️ **Important** :
- Ne PAS créer de variable `PORT` - Render la définit automatiquement
- Ne JAMAIS commiter ces valeurs dans le code
- Utiliser des mots de passe forts et uniques

#### 3.2 Lancer le déploiement

Cliquez sur **"Create Web Service"**. Render va :
- Cloner le repo
- Exécuter `npm ci` (installation propre des dépendances avec Clear Install)
- Exécuter `npm start` (démarrage du serveur)

---

## 🚀 Étape 4 : Suivre le déploiement

#### 4.1 Consulter les logs

1. Le déploiement démarre automatiquement
2. Consultez les logs en temps réel dans l'onglet **Logs**
3. Attendez le message **"Your service is live"**

#### 4.2 Logs de succès

**Logs attendus :**
```
==> Starting service with 'npm start'
> back@1.0.0 start
> node app.js

Serveur démarré sur le port 10000
Connexion à MongoDB réussie :-)
```

#### 4.3 Récupérer l'URL publique

Une fois le déploiement réussi, Render génère automatiquement une URL :
```
https://okami-back.onrender.com
```

Vous la trouverez en haut du dashboard, sous le nom du service.

⚠️ **Important** : Sur le plan gratuit, le serveur se met en veille après 15 minutes d'inactivité. Le premier accès après veille prend ~30 secondes (cold start).

---

## ✅ Étape 5 : Vérification

#### 5.1 Tester l'API

Ouvrez l'URL Render dans le navigateur :
```
https://okami-back.onrender.com/
```

Vous devriez voir :
```
Bienvenue sur votre API RESTful OKAMI!
```

⚠️ **Premier accès** : Si le serveur était en veille, attendez ~30 secondes.

#### 5.2 Tester un endpoint

```bash
curl https://okami-back.onrender.com/api/artists/public
```

#### 5.3 Vérifier les logs

En cas d'erreur, consultez les logs dans l'onglet **Logs** du dashboard.

---

## 🔗 Étape 6 : Mise à jour du frontend

#### 6.1 Configurer l'URL de l'API

Dans les variables d'environnement du frontend, mettez à jour :

```env
VITE_API_URL=https://okami-back.onrender.com/api/
```

⚠️ **Note** : Si votre frontend ajoute déjà `/api/` dans les appels, utilisez `https://okami-back.onrender.com` sans le `/api/`.

#### 6.2 Mettre à jour FRONT_URL sur Render

Dans Render, mettez à jour la variable `FRONT_URL` avec l'URL exacte de votre frontend.

#### 6.3 Tester l'intégration

Testez le formulaire en production pour vérifier la communication frontend-backend.

---

## 🔄 CI/CD

### Déploiement automatique

Render est configuré pour le déploiement continu :

```
git push origin main → Render détecte → Build → Deploy
```

**Workflow :**
1. Développeur push sur `main`
2. Render détecte le changement via webhook GitHub
3. Render clone le repo
4. Render exécute `npm install`
5. Render exécute `npm start`
6. Nouveau container déployé
7. Ancien container arrêté (zero-downtime)

### Déploiement manuel

Pour forcer un redéploiement :

1. Dans le dashboard Render
2. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**

### Rollback

En cas de problème :

1. Allez dans **Events**
2. Trouvez le dernier déploiement fonctionnel
3. Cliquez sur **"Rollback to this deploy"**

---

## 🧪 Tests de validation

### Checklist manuelle post-déploiement

- [ ] API répond sur `/` (message de bienvenue)
- [ ] Endpoint `/api/artists/public` retourne les artistes validés
- [ ] Upload de photo fonctionne (< 10 MB)
- [ ] Upload de PDF fonctionne (< 10 MB)
- [ ] Connexion MongoDB établie
- [ ] CORS configuré correctement
- [ ] Emails envoyés via Nodemailer

---

## 📚 Bonnes pratiques

### Sécurité

- ✅ Variables sensibles dans Render (jamais dans le code)
- ✅ `.gitignore` configuré
- ✅ CORS configuré avec origine spécifique
- ✅ JWT pour l'authentification admin
- ✅ Validation des fichiers uploadés (type, taille)
- ✅ MongoDB Atlas avec authentification

### Performance

- ✅ Connection pooling MongoDB (maxPoolSize: 50)
- ✅ Cache de connexion
- ✅ Optimisation des images via Cloudinary
- ✅ Tri avec collation pour performance

### Maintenance

- ✅ Logs structurés pour le debugging
- ✅ Gestion d'erreurs centralisée
- ✅ Monitoring via Render dashboard
- ✅ Déploiement automatique via CI/CD

---

## ✨ Checklist de déploiement

- [ ] Code préparé et testé localement
- [ ] Variables d'environnement configurées dans Render
- [ ] Web Service Render créé et lié à GitHub
- [ ] Premier déploiement réussi
- [ ] Tests de validation passés (API répond)
- [ ] Frontend mis à jour avec nouvelle URL
- [ ] CORS configuré avec `FRONT_URL`
- [ ] MongoDB Atlas autorise toutes les IPs
- [ ] Cloudinary configuré correctement
- [ ] Documentation mise à jour

**Votre API est maintenant déployée sur Render ! 🎉**r un environnement de staging :

1. Créer une branche `staging`
2. Créer un nouveau Web Service Render lié à cette branche
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
ab -n 100 -c 10 https://okami-back.onrender.com/api/artists/public
```

### Approche TDD

Le projet n'utilise pas actuellement TDD. Pour l'implémenter :

1. Écrire les tests avant le code
2. Exécuter les tests (ils échouent)
3. Écrire le code minimal pour passer les tests
4. Refactoriser
5. Répéter

---

---

## 📞 Support

En cas de problème :
- Documentation Render : [render.com/docs](https://render.com/docs)
- Community Render : [community.render.com](https://community.render.com)
- Logs Render : Toujours consulter les logs en premier

---

---

## 📚 Bonnes pratiques

### Sécurité

- ✅ Variables sensibles dans Render (jamais dans le code)
- ✅ `.gitignore` configuré
- ✅ CORS configuré avec origine spécifique
- ✅ JWT pour l'authentification admin
- ✅ Validation des fichiers uploadés (type, taille)
- ✅ MongoDB Atlas avec authentification

### Performance

- ✅ Connection pooling MongoDB (maxPoolSize: 50)
- ✅ Cache de connexion
- ✅ Optimisation des images via Cloudinary
- ✅ Tri avec collation pour performance

### Maintenance

- ✅ Logs structurés pour le debugging
- ✅ Gestion d'erreurs centralisée
- ✅ Monitoring via Render dashboard
- ✅ Déploiement automatique via CI/CD

---

---

## ✨ Checklist de déploiement

- [ ] Code préparé et testé localement
- [ ] Variables d'environnement configurées dans Render
- [ ] Web Service Render créé et lié à GitHub
- [ ] Premier déploiement réussi
- [ ] Tests de validation passés (API répond)
- [ ] Frontend mis à jour avec nouvelle URL
- [ ] CORS configuré avec `FRONT_URL`
- [ ] MongoDB Atlas autorise toutes les IPs
- [ ] Cloudinary configuré correctement
- [ ] Documentation mise à jour

**Votre API est maintenant déployée sur Render ! 🎉**