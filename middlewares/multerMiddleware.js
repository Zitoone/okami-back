// Ce fichier gère l'upload d'images vers Cloudinary
// Problème résolu : Les imports ES6 sont exécutés AVANT dotenv.config()
// Solution : Configuration "lazy" (à la demande) de Cloudinary

import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'

// Variable globale pour stocker l'instance Multer une fois créée
// null au départ, sera initialisée à la première requête
let uploaderInstance = null

// Cette fonction crée et configure Multer + Cloudinary
// Elle est appelée SEULEMENT quand une requête arrive (après dotenv.config())
function getUploader() {
  // Si l'uploader existe déjà, on le réutilise (pas besoin de reconfigurer)
  if (!uploaderInstance) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    })
    
    
    // Configuration du Storage Cloudinary
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [{ 
          width: 1200,
          height: 1200,
          crop: 'limit',
          quality: 'auto'
        }]
      }
    })
    
    // Vérifie que le fichier est bien une image AVANT l'upload cb=callback
    const fileFilter = (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif|webp/
      const mimetype = allowedTypes.test(file.mimetype)
      
      if (mimetype) {
        return cb(null, true) 
      } else {
        cb(new Error('Seules les images sont autorisées'))
      }
    }
    
    // On crée Multer avec le storage Cloudinary et les options
    uploaderInstance = multer({
      storage: storage, 
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: fileFilter
    })
  }
  
  return uploaderInstance
}

export const upload = {
  single: (fieldName) => {
    return (req, res, next) => {
      getUploader().single(fieldName)(req, res, next)
    }
  }
}


// 1. Frontend envoie FormData avec une image vers /api/artists/form
// 2. La route appelle upload.single('promoPhoto')
// 3. Le wrapper appelle getUploader() qui configure Cloudinary (1ère fois seulement)
// 4. Multer intercepte le fichier
// 5. fileFilter vérifie que c'est une image
// 6. CloudinaryStorage upload l'image vers Cloudinary
// 7. Cloudinary redimensionne/optimise automatiquement
// 8. req.file.path contient l'URL Cloudinary
// 9. Le controller stocke cette URL dans MongoDB
// 10. Le frontend affiche l'image avec l'URL Cloudinary
