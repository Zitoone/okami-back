const express=require('express')
const router=express.Router()
const adminController = require('../controllers/adminController')
const artistsController = require('../controllers/artistsController')
const authMiddleware=require('../middlewares/authMiddleware')

router.post('/login', adminController.login)

//Gestion des artistes
router.post('/artists', authMiddleware, artistsController.createNewArtist)
router.get('/artists', authMiddleware, artistsController.getAllArtists)
router.get('/artists/:id', authMiddleware, artistsController.getArtistById)
router.patch('/artists/:id', authMiddleware, artistsController.updateArtist)
router.delete('/artists/:id', authMiddleware, artistsController.deleteArtist)


module.exports=router