import express from 'express'
import * as artistsController from '../controllers/artistsController.js'
import { uploadFields } from '../middlewares/uploadMiddleware.js'
import authMiddleware from '../middlewares/authMiddleware.js'


const router = express.Router()


// Création d'artiste via le formulaire public
router.post('/form', uploadFields, artistsController.createOrUpdateArtist)

// Route publique AVANT les autres pour la promo des artistes
router.get('/public', artistsController.getPublicArtists)

//Gestion des artistes par les admin
router.post('/new', authMiddleware, artistsController.createArtist)

router.get('/', authMiddleware, artistsController.getAllArtists)
router.get('/:id', authMiddleware, artistsController.getArtist)
router.patch('/:id',authMiddleware, uploadFields, artistsController.updateArtist)
router.delete('/:id', authMiddleware, artistsController.deleteArtist)

export default router
