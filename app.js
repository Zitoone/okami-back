const express=require ('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT

require('./db')

app.use(express.json())

const artistsRoutes = require('./routes/artistsRoutes')

app.use('/api/artists', artistsRoutes)

app.get('/', (req,res)=>{
    res.send('Bienvenue sur votre API RESTful OKAMI!')
})

    app.listen(port, ()=>{
console.log(`Serveur démarré sur http://localhost:${port}`)
})