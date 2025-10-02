const express=require ('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const cors = require("cors");


require('./db')

app.use(cors({ origin: "http://localhost:5173" })) // port front Vite
app.use(express.json())

const adminRoutes = require('./routes/adminRoutes')
const artistsRoutes = require('./routes/artistsRoutes')

app.use('/api/admin', adminRoutes)
app.use('/api/artist', artistsRoutes)

app.get('/', (req,res)=>{
    res.send('Bienvenue sur votre API RESTful OKAMI!')
})

    app.listen(port, ()=>{
console.log(`Serveur démarré sur http://localhost:${port}`)
})