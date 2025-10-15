const express = require('express')
const router = express.Router()
const artistsController=require('../controllers/artistsController')
const authMiddleware=require('../middlewares/authMiddleware')
const multerMiddleware=require('../middlewares/multerMiddleware')


// Création d'artiste via le formulaire avec Multer
router.post('/form', multerMiddleware, artistsController.createOrUpdateArtist)

//Gestion des artistes par les admin
router.post('/new', authMiddleware, artistsController.createNewArtist)
router.get('/', authMiddleware, artistsController.getAllArtists)
router.get('/:id', authMiddleware, artistsController.getArtistById)
router.patch('/:id', authMiddleware, artistsController.updateArtist)
router.delete('/:id', authMiddleware, artistsController.deleteArtist)

module.exports = router


