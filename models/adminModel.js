const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const adminSchema=new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/]
    },
    password:{
        type: String,
        required: true,
        minlength:[6]
    },
    role:{
        type: String,
        enum: ["admin", "referent"],
        default: 'référent'
    },
    isActive:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})

//méthode pre() => se lance AVANT une action prédéfinie
adminSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    
    try{
        const salt=await bcrypt.genSalt(12)
        this.password=await bcrypt.hash(this.password,salt)
    }catch(err){
        next(err)
    }
})

module.exports=mongoose.model("Admin", adminSchema)