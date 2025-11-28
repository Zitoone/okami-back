import dotenv from 'dotenv'
dotenv.config()

import connectDB from '../config/db.js'
import Admin from '../models/adminModel.js'
import mongoose from 'mongoose'

async function createAdmin() {
    try{
        await connectDB()
        const existing=await Admin.findOne({email: "jason@okamifestival.com"})
        if(existing){
            console.log("⚠️ Admin déjà existant")
            return
        }

        const admin=new Admin({
            firstName: "Jason",
            lastName: "Longa",
            email: "jason@okamifestival.com",
            password: "legend",
            role: "admin"
        })

        await admin.save()
        console.log(`✅ Admin ${admin.firstName} créé avec succès !`)
    }catch(err){
        console.error("❌ Erreur lors de la création de l’admin :", err.message)
    }finally{
        mongoose.connection.close()
    }
}

createAdmin()

//Pour créer un nouvel admin:
// Modifier la const avec les infos et entrer la commande
// node scripts/createAdmin.js