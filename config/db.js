import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            bufferCommands: false,
            maxPoolSize: 50
        })
        console.log("Connexion à MongoDB réussie :-)")
    } catch (error) {
        console.error("Erreur de connexion à MongoDB:", error.message)
        throw error
    }
}

export default connectDB
