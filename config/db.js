import mongoose from "mongoose"

//Utilisation d'un cache global pour les fonctions serverless qui évite de récréer un connexion a chaque fois
let cached=global.mongoose

if(!cached){
    cached=global.mongoose={conn:null,promise:null}
}

const connectDB = async()=>{
    if(cached.conn){
        // Si la connexion existe déjà on l' réutilise
        return cached.conn
    }

    if(!cached.promise){
        const opts={
            bufferCommands:false,
            maxPoolSize:10 //limite les connexions simultanées
        }
        //On stocke la promesse pour réutilisation
        cached.promise=mongoose.connect(process.env.MONGO_URI, opts)
            .then((mongoose)=> mongoose)
            .catch((error) => {
                console.error ("Erreur de connexion à MongoDB: ", error.message)
                throw error
            })
        }
        try {
            cached.conn = await cached.promise
            console.log("Connexion à MongoDB réussie :-)")
            return cached.conn
        } catch (error) {
            console.error("Erreur lors de l'attente à MongoDB: ", error.message)
            process.exit(1) // Termine la fonction si erreur
        }
    }

export default connectDB

