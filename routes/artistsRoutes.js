const express = require('express')
const router = express.Router();
const artistsController=require('../controllers/artistsController')


//Création d'artiste via le formulaire
router.post('/form', artistsController.createOrUpdateArtist)

//Gestion des artistes par les admin


module.exports = router
