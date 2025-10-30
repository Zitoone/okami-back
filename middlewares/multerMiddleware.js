import multer from 'multer';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs' //Module File System inclus dans node

// Créer les dossiers uploads si inexistants
const uploadDirs = ['uploads/artists/', 'uploads/volunteers/', 'uploads/partners/'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Utilise le type passé dans la requête ou 'artists' par défaut
    const uploadType = req.body.uploadType || 'artists';
    cb(null, `uploads/${uploadType}/`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

// Middleware pour redimensionner l'image après upload
export const resizeImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const uploadType = req.body.uploadType || 'artists';
    const filename = `resized-${req.file.filename}`;
    const outputPath = path.join('uploads', uploadType, filename);

    await sharp(req.file.path)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    // Supprimer l'original
    fs.unlinkSync(req.file.path);

    // Mettre à jour req.file avec le nouveau fichier
    req.file.filename = filename;
    req.file.path = outputPath;

    next();
  } catch (error) {
    console.error('Erreur Sharp:', error);
    next(error);
  }
};
