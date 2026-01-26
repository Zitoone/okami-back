import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import artistsRoutes from './routes/artistsRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import emailRoutes from './routes/emailRoutes.js'

const app = express()

app.use(cors({
  origin: process.env.FRONT_URL || 'https://okami-sigma.vercel.app',
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/artists', artistsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/email', emailRoutes)

app.get('/', (req, res) => {
    res.send('Bienvenue sur votre API RESTful OKAMI!')
})

// Démarrage du serveur (local et production)
const port = process.env.PORT || 5001

// Connexion à MongoDB puis démarrage du serveur
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Serveur démarré sur le port ${port}`)
    })
  })
  .catch((error) => {
    console.error('Impossible de démarrer le serveur:', error)
    process.exit(1)
  })

export default app
