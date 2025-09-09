const express = require('express')
const router = express.Router();
const artistsController=require('../controllers/artistsController')
const authMiddleware=require('../middlewares/authMiddleware')

//Création d'artiste via le formulaire
router.post('/', artistsController.createOrUpdateArtist)

//Gestion des artistes par les admin
router.post('/admin', authMiddleware, artistsController.createNewArtist)
router.get('/', authMiddleware, artistsController.getAllArtists)
router.get('/:id', authMiddleware, artistsController.getArtistById)

module.exports = router

//Comment tester l'authentification sans front