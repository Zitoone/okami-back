const mongoose = require ('mongoose')

const dbURI=process.env.MONGO_URI

mongoose.connect(dbURI)
.then(()=>console.log("Connexion à MongoDB réussie: ", mongoose.connection.name))
.catch(err=>console.error("Erreur de connexion à MongoDB"))

module.exports = mongoose.connection

