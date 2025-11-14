import Admin from '../models/adminModel.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Connexion de l'admin
export const login = async(req,res)=>{
    const{email, password}=req.body

    // Vérification que les champs sont remplis
    if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" })
    }

    try {
        // Recherche de l'admin par email
        const admin = await Admin.findOne({email})
        if(!admin) return res.status(401).json({message: "Cet email n'existe pas"})
        
        // Vérification du mot de passe hashé
        const isMatch = await bcrypt.compare(password, admin.password)
        if(!isMatch) return res.status(403).json({message:"Mot de passe invalide"})
        
        // Génération du token JWT valide 1 jour
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )
        
        // Envoi du token au client
        res.json({token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
