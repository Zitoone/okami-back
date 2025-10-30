import Artist from '../models/artistsModel.js';

export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find().sort({ projectName: 1 });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const createArtist = async (req, res) => {
  try {
    const artist = new Artist(req.body);
    const newArtist = await artist.save();
    res.status(201).json(newArtist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createOrUpdateArtist = async (req, res) => {
  try {
    if (!req.body.projectName) {
      return res.status(400).json({ message: 'Nom du projet requis' });
    }
    const artist = await Artist.findOneAndUpdate(
      { projectName: req.body.projectName },
      req.body,
      { new: true, runValidators: true, upsert: true }
    );
    res.status(200).json(artist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateArtist = async (req, res) => {
  try {
    const { id } = req.params;
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

export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier fourni' });
    }
    const photoUrl = `/uploads/${req.file.filename}`;
    res.json({ url: photoUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
