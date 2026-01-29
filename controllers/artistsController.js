// Les controllers permettent de définir la logique métier pour chaque route (chaque action)

// Import du modèle Artist pour interagir avec la base de données
import Artist from '../models/artistsModel.js'
// Import des fonctions d'upload vers Cloudinary
import { uploadImageToCloudinary, uploadFileToCloudinary } from '../middlewares/uploadMiddleware.js'

// Récupérer les artistes validés pour la page publique
export const getPublicArtists = async (req, res) => {
  try {
    // Recherche tous les artistes avec isValidated = true
    // collation({ locale: 'fr', strength: 2 }) : compare les textes en français, ignore majuscules/accents
    // sort({ projectName: 1 }) : trie par ordre alphabétique croissant
    const artists = await Artist.find({ isValidated: true })
      .collation({ locale: 'fr', strength: 2 })
      .sort({ projectName: 1 })
    
    // Si aucun artiste trouvé, retourne une erreur 404
    if (!artists) {
      return res.status(404).json({ message: 'Aucun artiste validé trouvé' })
    }
    
    // Retourne la liste des artistes en JSON
    res.json(artists)
  } catch (error) {
    // En cas d'erreur serveur, retourne un code 500
    res.status(500).json({ message: error.message })
  }
}

// Récupérer tous les artistes (route admin privée)
export const getAllArtists = async (req, res) => {
  try {
    // Recherche TOUS les artistes (validés ou non) pour l'admin
    const artists = await Artist.find()
      .collation({ locale: 'fr', strength: 2 })
      .sort({ projectName: 1 })
    
    res.json(artists)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer un artiste spécifique par ID ou projectName
export const getArtist = async (req, res) => {
  try {
    // Récupère le paramètre 'id' de l'URL (peut être un ID MongoDB ou un nom de projet)
    const { id } = req.params
    
    // Essaie d'abord de trouver par ID MongoDB
    // Si échec (.catch(() => null)), essaie par projectName
    // L'opérateur || retourne le premier résultat non-null
    const artist = await Artist.findById(id).catch(() => null) ||
                  await Artist.findOne({ projectName: id })
    
    // Si aucun artiste trouvé, retourne 404
    if (!artist) return res.status(404).json({ message: 'Artiste non trouvé' })
    
    res.json(artist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Créer un nouvel artiste (route admin)
export const createArtist = async (req, res) => {
  try {
    // Crée une nouvelle instance du modèle Artist avec les données du body
    const artist = new Artist(req.body)
    
    // Sauvegarde en base de données (déclenche les validations du schéma)
    const newArtist = await artist.save()
    
    // Retourne l'artiste créé avec un code 201 (Created)
    res.status(201).json(newArtist)
  } catch (error) {
    // Code 400 (Bad Request) si les données sont invalides
    res.status(400).json({ message: error.message })
  }
}

// Créer ou mettre à jour un artiste via le formulaire public
export const createOrUpdateArtist = async (req, res) => {
  try {
    // Vérifie que le nom du projet est fourni (champ obligatoire)
    if (!req.body.projectName) {
      return res.status(400).json({ message: 'Nom du projet requis' })
    }
    
    // Liste des champs texte à nettoyer
    const textFields = [
      'projectName', 'firstName', 'lastName', 'email', 'phone',
      'guestName', 'setup', 'setupTime', 'needsSoundcheck',
      'comments', 'musicalStyle', 'riderTechUrl'
    ]
    
    // Nettoie tous les champs texte : supprime les espaces au début/fin
    // Important pour éviter les doublons ("Artiste" vs "Artiste ")
    textFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = req.body[field].trim()
      }
    })

    // Si socialLinks est une chaîne JSON, la convertit en objet
    // (nécessaire quand les données viennent d'un FormData)
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      req.body.socialLinks = JSON.parse(req.body.socialLinks)
    }

    // Upload de la photo promo si présente dans les fichiers
    if (req.files?.promoPhoto) {
      // req.files.promoPhoto[0].buffer : contenu du fichier en mémoire
      // 'PromoPhoto' : dossier Cloudinary
      // req.body.projectName : nom du fichier (public_id)
      const result = await uploadImageToCloudinary(
        req.files.promoPhoto[0].buffer,
        'PromoPhoto',
        req.body.projectName
      )
      // Stocke l'URL sécurisée de l'image dans le body
      req.body.promoPhoto = result.secure_url
    }

    // Upload du rider technique si présent (fichier PDF/Word/Excel)
    // Priorité sur l'URL : si un fichier est uploadé, on ignore l'URL
    if (req.files?.riderTechUpload) {
      const result = await uploadFileToCloudinary(
        req.files.riderTechUpload[0].buffer,
        'RiderTech',
        req.body.projectName
      )
      req.body.riderTechUpload = result.secure_url
      // Supprime l'URL si un fichier a été uploadé
      delete req.body.riderTechUrl
    }

    // findOneAndUpdate avec upsert: true
    // - Si l'artiste existe (même projectName), il est mis à jour
    // - Si l'artiste n'existe pas, il est créé
    // collation: recherche insensible à la casse ("ARTISTE" = "artiste")
    // new: true : retourne le document après modification (pas avant)
    // runValidators: true : applique les validations du schéma
    const artist = await Artist.findOneAndUpdate(
      { projectName: req.body.projectName }, // Critère de recherche
      req.body, // Données à mettre à jour
      {
        new: true,
        runValidators: true,
        upsert: true, // Crée si n'existe pas
        collation: { locale: 'fr', strength: 2 }
      }
    )
    
    // Retourne l'artiste créé/mis à jour
    res.status(200).json(artist)
  } catch (error) {
    console.error('Erreur createOrUpdateArtist:', error)
    res.status(400).json({ message: error.message })
  }
}

// Mettre à jour un artiste existant (route admin)
export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params

    // Convertit socialLinks en objet si c'est une string JSON
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      try {
        req.body.socialLinks = JSON.parse(req.body.socialLinks)
      } catch (err) {
        // Si le parsing échoue, on met un objet vide plutôt que de crasher
        console.warn('Impossible de parser socialLinks, on ignore', err)
        req.body.socialLinks = {}
      }
    }

    // Upload de la photo si présente
    if (req.files?.promoPhoto) {
      const result = await uploadImageToCloudinary(
        req.files.promoPhoto[0].buffer,
        'PromoPhoto',
        id // Utilise l'ID comme nom de fichier
      )
      req.body.promoPhoto = result.secure_url
    }

    // Upload du rider technique si présent (priorité sur l'URL)
    if (req.files?.riderTechUpload) {
      const result = await uploadFileToCloudinary(
        req.files.riderTechUpload[0].buffer,
        'RiderTech',
        id
      )
      req.body.riderTechUpload = result.secure_url
      delete req.body.riderTechUrl
    }

    // Supprime les champs vides pour ne pas écraser les valeurs existantes
    // Exemple : si email = '', on ne veut pas remplacer l'email existant par vide
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === '' || req.body[key] === null) {
        delete req.body[key]
      }
    })

    // Essaie d'abord de mettre à jour par ID MongoDB
    let artist = await Artist.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )

    // Si non trouvé par ID, essaie par projectName et crée si nécessaire
    // (utile si l'ID passé est en fait un nom de projet)
    if (!artist) {
      artist = await Artist.findOneAndUpdate(
        { projectName: id },
        req.body,
        { new: true, runValidators: true, upsert: true }
      )
    }

    res.json(artist)
  } catch (error) {
    console.error(error)
    res.status(400).json({ message: error.message })
  }
}

// Supprimer un artiste (route admin)
export const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params
    
    // Essaie de supprimer par ID MongoDB, sinon par projectName
    // L'opérateur || retourne le premier résultat non-null
    const artist = await Artist.findByIdAndDelete(id).catch(() => null) ||
                    await Artist.findOneAndDelete({ projectName: id })
    
    // Si aucun artiste trouvé, retourne 404
    if (!artist) {
      return res.status(404).json({ message: 'Artiste non trouvé' })
    }
    
    // Confirme la suppression
    res.json({ message: 'Artiste supprimé' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
