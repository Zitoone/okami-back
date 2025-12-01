// Ce fichier gère l'upload d'images vers Cloudinary avec Multer en mémoire
// On stocke d'abord le fichier en mémoire, puis on le pousse vers Cloudinary via un flux
import dotenv from 'dotenv'
dotenv.config()

import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier' // convertit le buffer en flux lisible

// Configuration Cloudinary depuis les variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Multer stocke les fichiers en mémoire pour pouvoir les envoyer ensuite sur Cloudinary
const storage = multer.memoryStorage()

// Middleware Multer pour gérer l'upload des fichiers
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB max
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'promoPhoto') {
      const allowedTypes = /jpeg|jpg|png|gif|webp/
      const isValid = allowedTypes.test(file.mimetype)
      if (isValid) cb(null, true)
      else cb(new Error('Seules les images sont autorisées pour promoPhoto'))
    } else if (file.fieldname === 'riderTechUpload') {
      const allowedTypes = /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet/
      const isValid = allowedTypes.test(file.mimetype)
      if (isValid) cb(null, true)
      else cb(new Error('Seuls les fichiers PDF, Word et Excel sont autorisés pour riderTechUpload'))
    } else {
      cb(new Error('Champ de fichier inconnu'))
    }
  }
})

// Fonction pour uploader une image vers Cloudinary
export const uploadImageToCloudinary = (fileBuffer, folder = 'PromoPhoto', filename = null) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }]
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

// Fonction pour uploader un fichier (PDF, Word, Excel) vers Cloudinary
export const uploadFileToCloudinary = (fileBuffer, folder = 'RiderTech', filename = null) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: 'auto' // permet tous types de fichiers
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

// Export du middleware upload pour Express
export { upload }
