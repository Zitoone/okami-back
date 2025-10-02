const Admin = require('../models/adminModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.login = async(req,res)=>{
    const{email, password}=req.body
    try {
        const  admin = await Admin.findOne({email})
        if(!admin) return res.status(401).json({message: "Cet email n'existe pas"})
        
        const isMatch = await bcrypt.compare(password, admin.password)

        if(!isMatch) return res.status(403).json({message:"Mot de passe invalide"})
        
        const token = jwt.sign(
            {
                id: admin.id, email: admin.email
            },
            process.env.JWT_SECRET,
            {expiresIn: '1d'}
        )
        res.json({token})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}