// Import du modèle Artist pour interagir avec la base de données
import Artist from '../models/artistsModel.js'
import { uploadImageToCloudinary, uploadFileToCloudinary } from '../middlewares/uploadMiddleware.js'

// Fonction pour générer un nom de fichier Cloudinary sûr
const getSafeCloudinaryName = (name) => {
  if (!name) return 'unknown'
  // Remplace tout ce qui n'est pas lettre, chiffre ou accent par un underscore
  return name
    .normalize('NFD')               // décompose les accents
    .replace(/[^a-zA-Z0-9_-]/g, '_') // remplace symboles et espaces
}


//Récupérer les artistes validés pour la page publique
export const getPublicArtists = async (req, res) => {
  try {
    const artists = await Artist.find({ isValidated: true }).sort({ projectName: 1 })
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
    const artists = await Artist.find().sort({ projectName: 1 })
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
/* export const createOrUpdateArtist = async (req, res) => {
  console.log("⚡ Artist form POST triggered ⚡")

  console.log(">>> BODY =", req.body)
console.log(">>> FILES =", req.files)

  try {
    // Vérifie que le nom du projet est fourni
    if (!req.body.projectName) return res.status(400).json({ message: 'Nom du projet requis' })

    // Convertit socialLinks en objet si nécessaire
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      req.body.socialLinks = JSON.parse(req.body.socialLinks)
    }

    const safeName = getSafeCloudinaryName(req.body.projectName)
    // Upload de la photo si présente
    if (req.files?.promoPhoto?.[0].buffer) {
      const fileBuffer = req.files.promoPhoto[0].buffer
      const result = await uploadImageToCloudinary(fileBuffer, 'okami/artists/promoPhoto', safeName)
      req.body.promoPhoto = result.secure_url
    }

    // Upload du rider tech si présent
    if (req.files?.riderTechUpload?.[0]) {
      const fileBuffer = req.files.riderTechUpload[0].buffer
      const result = await uploadFileToCloudinary(fileBuffer, 'okami/artists/riderTech', safeName)
      req.body.riderTechUpload = result.secure_url
    }

    // Mise à jour ou création si non trouvé
    const artist = await Artist.findOneAndUpdate(
      { projectName: req.body.projectName },
      req.body,
      { new: true, runValidators: true, upsert: true }
    )
    res.status(200).json(artist)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
} */

export const createOrUpdateArtist = async (req, res) => { //test
  console.log("⚡ Artist form POST triggered ⚡");

  try {
    console.log(">>> BODY =", req.body);
    console.log(">>> FILES =", req.files);

    // Vérifie que le nom du projet est fourni
    if (!req.body.projectName) {
      return res.status(400).json({ message: 'Nom du projet requis' });
    }

    // Convertit socialLinks en objet si nécessaire
    if (req.body.socialLinks) {
      if (typeof req.body.socialLinks === 'string') {
        try {
          req.body.socialLinks = JSON.parse(req.body.socialLinks);
        } catch (err) {
          console.warn('Impossible de parser socialLinks, on ignore', err);
          req.body.socialLinks = {};
        }
      }
    } else {
      req.body.socialLinks = {};
    }

    const safeName = req.body.projectName.replace(/[^a-zA-Z0-9_-]/g, '_') || 'unknown';

    // Upload promoPhoto si présent
    if (req.files?.promoPhoto?.[0]?.buffer) {
      try {
        const fileBuffer = req.files.promoPhoto[0].buffer;
        const result = await uploadImageToCloudinary(fileBuffer, 'okami/artists/promoPhoto', safeName);
        req.body.promoPhoto = result.secure_url;
      } catch (err) {
        console.error('Erreur upload promoPhoto:', err);
      }
    }

    // Upload riderTechUpload si présent
    if (req.files?.riderTechUpload?.[0]?.buffer) {
      try {
        const fileBuffer = req.files.riderTechUpload[0].buffer;
        const result = await uploadFileToCloudinary(fileBuffer, 'okami/artists/riderTech', safeName);
        req.body.riderTechUpload = result.secure_url;
      } catch (err) {
        console.error('Erreur upload riderTechUpload:', err);
      }
    }

    // Mise à jour ou création si non trouvé
    const artist = await Artist.findOneAndUpdate(
      { projectName: req.body.projectName },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );

    res.status(200).json(artist);

  } catch (error) {
    console.error("Erreur createOrUpdateArtist:", error);
    res.status(400).json({ message: error.message });
  }
};


  // Mettre à jour un artiste existant (route admin)
export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params

    // Convertit socialLinks en objet si nécessaire
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      try {
        req.body.socialLinks = JSON.parse(req.body.socialLinks)
      } catch (err) {
        console.warn('Impossible de parser socialLinks, on ignore', err)
        req.body.socialLinks = {}
      }
    }

    // Nom safe pour Cloudinary : fallback sur ID si projectName absent
    const safeName = req.body.projectName
      ? getSafeCloudinaryName(req.body.projectName)
      : id

    // Upload promoPhoto si présent
    if (req.files?.promoPhoto?.[0]) {
      const fileBuffer = req.files.promoPhoto[0].buffer
      const result = await uploadImageToCloudinary(
        fileBuffer,
        'okami/artists/promoPhoto',
        safeName
      )
      req.body.promoPhoto = result.secure_url
    }

    // Upload riderTech si présent
    if (req.files?.riderTechUpload?.[0]) {
      const fileBuffer = req.files.riderTechUpload[0].buffer
      const result = await uploadFileToCloudinary(
        fileBuffer,
        'okami/artists/riderTech',
        safeName
      )
      req.body.riderTechUpload = result.secure_url
    }

    // Supprime les champs vides
    Object.keys(req.body).forEach(key => {
      if (req.body[key] === '' || req.body[key] === null) delete req.body[key]
    })

    // Mise à jour par ID
    let artist = await Artist.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )

    // Si non trouvé, essaie par projectName et crée si nécessaire
    if (!artist && req.body.projectName) {
      artist = await Artist.findOneAndUpdate(
        { projectName: req.body.projectName },
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
    const artist = await Artist.findByIdAndDelete(id).catch(() => null) ||
                    await Artist.findOneAndDelete({ projectName: id })
    if (!artist) return res.status(404).json({ message: 'Artiste non trouvé' })
    res.json({ message: 'Artiste supprimé' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
