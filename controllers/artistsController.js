// Import du modèle Artist pour interagir avec la base de données
import Artist from '../models/artistsModel.js'
import { uploadImageToCloudinary, uploadFileToCloudinary } from '../middlewares/uploadMiddleware.js'

//Récupérer les artistes validés pour la page publique
export const getPublicArtists = async (req, res) => {
  try {
    const artists = await Artist.find({ isValidated: true }).collation({ locale: 'fr', strength: 2 }).sort({ projectName: 1 })
    if (!artists) {
      return res.status(404).json({ message: 'Aucun artiste validé trouvé' })
    }
    res.json(artists)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer tous les artistes (route admin privée)
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find().collation({ locale: 'fr', strength: 2 }).sort({ projectName: 1 })
    res.json(artists)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Récupérer un artiste spécifique par ID ou projectName
export const getArtist = async (req, res) => {
  try {
    const { id } = req.params
    const artist = await Artist.findById(id).catch(() => null) ||
                  await Artist.findOne({ projectName: id })
    if (!artist) return res.status(404).json({ message: 'Artiste non trouvé' })
    res.json(artist)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Créer un nouvel artiste (route admin)
export const createArtist = async (req, res) => {
  try {
    const artist = new Artist(req.body)
    const newArtist = await artist.save()
    res.status(201).json(newArtist)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Créer ou mettre à jour un artiste via le formulaire public
export const createOrUpdateArtist = async (req, res) => {
  try {
    // Vérifie que le nom du projet est fourni
    if (!req.body.projectName) return res.status(400).json({ message: 'Nom du projet requis' })
    
    // Nettoie tous les champs texte (supprime espaces début/fin)
    const textFields = ['projectName', 'firstName', 'lastName', 'email', 'phone', 'guestName', 'setup', 'setupTime', 'needsSoundcheck', 'comments', 'musicalStyle', 'riderTechUrl']
    textFields.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        req.body[field] = req.body[field].trim()
      }
    })

    // Convertit socialLinks en objet si nécessaire
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      req.body.socialLinks = JSON.parse(req.body.socialLinks)
    }

    // Upload de la photo si présente
    if (req.files?.promoPhoto) {
      const result = await uploadImageToCloudinary(req.files.promoPhoto[0].buffer, 'PromoPhoto', req.body.projectName)
      req.body.promoPhoto = result.secure_url
    }

    // Upload du rider technique si présent (priorité sur l'URL)
    if (req.files?.riderTechUpload) {
      const result = await uploadFileToCloudinary(req.files.riderTechUpload[0].buffer, 'RiderTech', req.body.projectName)
      req.body.riderTechUpload = result.secure_url
      delete req.body.riderTechUrl // Supprime l'URL si fichier uploadé
    }

    // Mise à jour ou création si non trouvé (insensible à la casse)
    const artist = await Artist.findOneAndUpdate(
      { projectName: req.body.projectName },
      req.body,
      { new: true, runValidators: true, upsert: true, collation: { locale: 'fr', strength: 2 } }
    )
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

    // Convertit socialLinks en objet si c’est une string
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      try {
        req.body.socialLinks = JSON.parse(req.body.socialLinks);
      } catch (err) {
        console.warn('Impossible de parser socialLinks, on ignore', err)
        req.body.socialLinks = {}
      }
    }

    // Upload de la photo si présente
    if (req.files?.promoPhoto) {
      const result = await uploadImageToCloudinary(req.files.promoPhoto[0].buffer, 'PromoPhoto', id)
      req.body.promoPhoto = result.secure_url
    }

    // Upload du rider technique si présent (priorité sur l'URL)
    if (req.files?.riderTechUpload) {
      const result = await uploadFileToCloudinary(req.files.riderTechUpload[0].buffer, 'RiderTech', id)
      req.body.riderTechUpload = result.secure_url
      delete req.body.riderTechUrl // Supprime l'URL si fichier uploadé
    }

    // Supprime les champs vides
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === '' || req.body[key] === null) delete req.body[key]
    })

    // Mise à jour par ID
    let artist = await Artist.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

    // Si non trouvé, essaie par projectName et crée si nécessaire
    if (!artist) {
      artist = await Artist.findOneAndUpdate(
        { projectName: id },
        req.body,
        { new: true, runValidators: true, upsert: true }
      );
    }

    res.json(artist)
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message })
  }
}


// Supprimer un artiste (route admin)
export const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params
    const artist = await Artist.findByIdAndDelete(id).catch(() => null) ||
                    await Artist.findOneAndDelete({ projectName: id })
    if (!artist) return res.status(404).json({ message: 'Artiste non trouvé' })
    res.json({ message: 'Artiste supprimé' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
