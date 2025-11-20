import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import artistsRoutes from './routes/artistsRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import emailRoutes from './routes/emailRoutes.js'

const app = express()

// CORS ouvert temporairement pour le déploiement avant d'avoir l'URL du front
const allowedOrigins =
    process.env.NODE_ENV === 'production'
    ? '*' // toutes les origines autorisées en prod temporairement
    : ['http://localhost:5173', 'http://127.0.0.1:5173']

app.use(
    cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins === '*' || allowedOrigins.includes(origin)) {
        callback(null, true)
        } else {
        callback(new Error('Not allowed by CORS'))
        }
    }
    })
)

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

// Export pour Vercel
export default app

// Écoute locale seulement si on lance directement ce fichier
if (process.env.NODE_ENV !== 'production') {
        const port = process.env.PORT || 5001
        app.listen(port, () => {
        console.log(`Serveur démarré sur http://localhost:${port}`)
    })
}
