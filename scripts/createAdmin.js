require('../db')
const Admin = require ('../models/adminModel')
const mongoose = require("mongoose")

async function createAdmin() {
    try{
        const existing=await Admin.findOne({email: "olivia@okamifestival.com"})
        if(existing){
            console.log("⚠️ Admin déjà existant")
            return
        }

        const admin=new Admin({
            firstName: "Olivia",
            lastName: "Nanquette",
            email: "olivia@okamifestival.com",
            password: "pass1234",
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