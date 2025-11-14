// Import du modèle Artist pour interagir avec la base de données
import Artist from '../models/artistsModel.js';

// Récupérer tous les artistes (route admin privée)
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ projectName: 1 });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Récupérer un artiste spécifique par ID ou projectName
export const getArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist =  await Artist.findById(id).catch(() => null) || 
                    await Artist.findOne({ projectName: id });
    if (!artist) return res.status(404).json({ message: 'Artiste non trouvé' });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Créer un nouvel artiste (route admin)
export const createArtist = async (req, res) => {
  try {
    const artist = new Artist(req.body);
    const newArtist = await artist.save();
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Créer ou mettre à jour un artiste via le formulaire public
export const createOrUpdateArtist = async (req, res) => {
  try {
    console.log('📥 Données reçues:', req.body)
    console.log('📷 Fichier reçu:', req.file)
    
    if (!req.body.projectName) {
      return res.status(400).json({ message: 'Nom du projet requis' });
    }
    
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      req.body.socialLinks = JSON.parse(req.body.socialLinks);
    }
    
    if (req.file) {
      console.log('✅ URL Cloudinary:', req.file.path)
      req.body.promoPhoto = req.file.path;
    } else {
      console.log('⚠️ Aucun fichier uploadé')
    }
    
    const artist = await Artist.findOneAndUpdate(
      { projectName: req.body.projectName },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    res.status(200).json(artist);
  } catch (error) {
    console.error('❌ Erreur createOrUpdateArtist:', error)
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour un artiste existant (route admin)
export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
      req.body.socialLinks = JSON.parse(req.body.socialLinks);
    }
    
    if (req.file) {
      req.body.promoPhoto = req.file.path;
    }
    
    let artist = await Artist.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).catch(() => null);
    
    if (!artist) {
      artist = await Artist.findOneAndUpdate(
        { projectName: id },
        req.body,
        { new: true, runValidators: true, upsert: true }
      );
    }
    res.json(artist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un artiste (route admin)
export const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const artist =  await Artist.findByIdAndDelete(id).catch(() => null) ||
                    await Artist.findOneAndDelete({ projectName: id });
    if (!artist) return res.status(404).json({ message: 'Artiste non trouvé' });
    res.json({ message: 'Artiste supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
