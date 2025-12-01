import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import artistsRoutes from './routes/artistsRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import emailRoutes from './routes/emailRoutes.js'

const app = express()

app.use(cors())

app.use(express.json())


// Connexion à la base de données
app.use(async (req, res, next) =>{
    await connectDB()
    next()
})


// Routes
app.use('/api/artists', artistsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/email', emailRoutes)

app.get('/', (req, res) => {
    res.send('Bienvenue sur votre API RESTful OKAMI!')
})

// Démarrage du serveur (local et production)
const port = process.env.PORT || 5001
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`)
})

export default app
