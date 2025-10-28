const express=require ('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const cors = require("cors")

require('./db')

/* app.use(cors({ origin: "http://localhost:5176" }))  */// port front Vite

app.use(cors())
app.use(express.json())

const adminRoutes = require('./routes/adminRoutes')
const artistsRoutes = require('./routes/artistsRoutes')
const emailRoutes = require('./routes/emailRoutes')

app.use('/api/admin', adminRoutes)
app.use('/api/artists', artistsRoutes)
app.use('/api/uploads', express.static('uploads')) // Pour que les images soient accessibles depuis le front
app.use('/api/email', emailRoutes)

app.get('/', (req,res)=>{
    res.send('Bienvenue sur votre API RESTful OKAMI!')
})

app.listen(port, ()=>{
console.log(`Serveur démarré sur http://localhost:${port}`)
})