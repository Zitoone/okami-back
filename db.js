import mongoose from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        "Connexion à MongoDB réussie"
    } catch (error) {
        console.error("Erreur de connexion à MongoDB", error.message)
        process.exit(1)
    }
}

export default connectDB

