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
  origin: 'https://okami-sigma.vercel.app',
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}))
app.options('*', cors())

app.use(express.json())


// Connexion à la base de données, une seule fois au démarrage
connectDB().catch((err) => {
        console.error('❌ Erreur de connexion à MongoDB :', err.message)
        process.exit(1) // Arrête l'application en cas d'erreur
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
