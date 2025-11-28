// uploadMiddleware.js
import dotenv from 'dotenv'
dotenv.config()

import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Stockage Multer en mémoire
const storage = multer.memoryStorage()

// Middleware unique pour gérer plusieurs champs
// promoPhoto : max 1 fichier, riderTechUpload : max 1 fichier
export const uploadFields = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // limite max 20MB, suffit pour le rider
  fileFilter: (req, file, cb) => {
    // On distingue les champs
    if (file.fieldname === 'promoPhoto') {
      const allowedTypes = /jpeg|jpg|png|gif|webp/
      const isValid = allowedTypes.test(file.mimetype)
      if (isValid) return cb(null, true)
      else return cb(new Error('Seules les images sont autorisées pour promoPhoto'))
    }
    if (file.fieldname === 'riderTechUpload') {
      const allowedTypes = /pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.ms-excel|vnd.openxmlformats-officedocument.spreadsheetml.sheet/
      const isValid = allowedTypes.test(file.mimetype)
      if (isValid) return cb(null, true)
      else return cb(new Error('Seuls les fichiers PDF, Word et Excel sont autorisés pour riderTechUpload'))
    }
    cb(new Error('Champ de fichier inconnu'))
  }
}).fields([
  { name: 'promoPhoto', maxCount: 1 },
  { name: 'riderTechUpload', maxCount: 1 }
])

// Upload image vers Cloudinary (avec transformation)
export const uploadImageToCloudinary = (fileBuffer, folder = 'PromoPhoto', filename = null) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        transformation: [
          { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}

// Upload fichier vers Cloudinary (sans transformation)
export const uploadFileToCloudinary = (fileBuffer, folder = 'RiderTech', filename = null) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    streamifier.createReadStream(fileBuffer).pipe(stream)
  })
}
