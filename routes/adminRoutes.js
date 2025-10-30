import express from 'express'
import * as adminController from '../controllers/adminController.js'

const router = express.Router()

//Connexion admin
router.post('/login', adminController.login)

export default router