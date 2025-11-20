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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    // Vérifie que le type MIME du fichier est autorisé
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const isValid = allowedTypes.test(file.mimetype)
    if (isValid) cb(null, true)
    else cb(new Error('Seules les images sont autorisées'))
  }
})

// Fonction pour uploader un buffer vers Cloudinary
// fileBuffer : le fichier en mémoire
// folder : le dossier Cloudinary où stocker l'image
// filename : nom public du fichier
export const uploadToCloudinary = (fileBuffer, folder = 'uploads', filename = null) => {
  return new Promise((resolve, reject) => {
    // cloudinary.uploader.upload_stream permet d'envoyer un flux (stream)
    const stream = cloudinary.uploader.upload_stream(
      {
        folder, // dossier sur Cloudinary
        public_id: filename, // nom du fichier
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto' } // redimension / optimisation
        ]
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )

    // Conversion du buffer en flux et envoi vers Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

// Export du middleware upload pour Express
export { upload }
