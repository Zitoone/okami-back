import express from 'express'
import * as artistsController from '../controllers/artistsController.js'
import { upload } from '../middlewares/uploadMiddleware.js'
import authMiddleware from '../middlewares/authMiddleware.js'


const router = express.Router()


// Création d'artiste via le formulaire public
router.post('/form', upload.fields([{ name: 'promoPhoto', maxCount: 1 }, { name: 'riderTechUpload', maxCount: 1 }]), artistsController.createOrUpdateArtist)

// Route publique AVANT les autres pour la promo des artistes
router.get('/public', artistsController.getPublicArtists)

//Gestion des artistes par les admin
router.post('/new', authMiddleware, artistsController.createArtist)

router.get('/', authMiddleware, artistsController.getAllArtists)
router.get('/:id', authMiddleware, artistsController.getArtist)
router.patch('/:id',authMiddleware, upload.fields([{ name: 'promoPhoto', maxCount: 1 }, { name: 'riderTechUpload', maxCount: 1 }]), artistsController.updateArtist)
router.delete('/:id', authMiddleware, artistsController.deleteArtist)

export default router
