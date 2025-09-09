const mongoose = require('mongoose')

const artistSchema= new mongoose.Schema({
    //Infos formulaire artiste
    personalInfo:{
            lastName:{
                type: String,
                /* required:[true, "Le nom est requis"] */        
            },
            firstName:{
                type: String,
                /* required:[true, "Le prénom est requis"]    */     
            },
            email:{
                type: String,
                /* required: [true, "L'email est obligatoire"], */
                trim: true,
                lowercase: true,
                match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,6})+$/, "Veuillez entrer un email valide"]
            },
            phone:{
                type: String,
                /* required: [true, "Le téléphone est obligatoire"] */
            },
            projectName:{
                type: String,
                /* required:[true, "Le nom du projet est requis"] */
            },
            invitName:{
                type: String    
            },
            infoRun:{
                type: String,     
            },
            setupTimeInMin:{
                type: Number
            },
            soundcheck:{
                type: String
            },
            record:{
                type: String
            },
            setup:{
                type: String
            },
            artistComments:{
                type: String    
            },
            pics:{
                type: String
            }
    },
    // Infos gérées par les admin
    adminInfo:{
        nbOfPerson:{
            type: Number,     
        },
        stage:{
            type: String
        },
        gigDateTime:{
            type: Date
        },
        soundcheckDayTime:{
            type: Date
        },
        arrivedRun:{
            type: String
        },
        departRun:{
            type: String
        },
        accommodation: {
            type: String
        },
        roadMap:{
            type: Boolean,
            default:false
        },
        contract:{
            type: Boolean,
            default:false
        },
        invoice:{
            type: Boolean,
            default:false
        },
        bookingFee:{
            type: Number
        },
        travelExpense:{
            type: Number
        },
        totalFees:{
            type: Number
        },
        paiementInfo:{
            type: String
        },
        sacemForm:{
            type: Boolean,
            default: false
        },
        specialInfo:{
            type: String
        },
        adminComments:{
            type: String
        }
    },
    createdAt: { type: Date, default: Date.now }
})

module.exports=mongoose.model("Artist", artistSchema)