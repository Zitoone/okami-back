import express from 'express'
import * as artistsController from '../controllers/artistsController.js'
import { upload } from '../middlewares/multerMiddleware.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import Artist from '../models/artistsModel.js'

const router = express.Router()


// Création d'artiste via le formulaire public
router.post('/form', upload.single('promoPhoto'), artistsController.createOrUpdateArtist)

// Route publique AVANT les autres pour la promo des artistes
router.get('/public', async (req,res)=>{
    const artists = await Artist.find({ isValidated: true }).sort({ projectName: 1 })
    res.json(artists)
})
//Gestion des artistes par les admin
router.post('/new', authMiddleware, artistsController.createArtist)

router.get('/', authMiddleware, artistsController.getAllArtists)
router.get('/:id', authMiddleware, artistsController.getArtist)
router.patch('/:id', authMiddleware, upload.single('promoPhoto'), artistsController.updateArtist)
router.delete('/:id', authMiddleware, artistsController.deleteArtist)

export default router



