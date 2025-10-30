import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';

dotenv.config();
const app=express();

/* app.use(cors({ origin: "http://localhost:5176" }))  */// port front Vite

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads')) // Pour que les images soient accessibles depuis le front

connectDB();

import artistsRoutes from './routes/artistsRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import emailRoutes from './routes/emailRoutes.js'

app.use('/api/artists', artistsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/email', emailRoutes)

app.get('/', (req,res)=>{
    res.send('Bienvenue sur votre API RESTful OKAMI!')
})

const port = process.env.PORT || 5001
app.listen(port, ()=>{
console.log(`Serveur démarré sur http://localhost:${port}`)
})