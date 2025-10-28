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
                type: String    
            },
            setupTimeInMin:{
                type: String
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
            },
            socials:{
                type: String 
            },
            promoText:{
                type: String
            }
    },
    // Infos gérées par les admin
    adminInfo:{
        nbOfPerson:{
            type: String   
        },
        stage:{
            type: String
        },
        gigDateTime:{
            type: String
        },
        soundcheckDayTime:{
            type: String
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
            type: String
        },
        contract:{
            type: String
        },
        invoice:{
            type: String
        },
        bookingFee:{
            type: String
        },
        travelExpense:{
            type: String
        },
        totalFees:{
            type: String
        },
        paiementInfo:{
            type: String
        },
        sacemForm:{
            type: String
        },
        specialInfo:{
            type: String
        },
        descriptionFr:{
            type: String
        },
        descriptionEng:{
            type: String
        },
        style:{
            type: String
        },
    },
    createdAt: { type: Date, default: Date.now }
})

module.exports=mongoose.model("Artist", artistSchema)