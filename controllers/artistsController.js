const Artist = require('../models/artistsModel')

//Fonction pour créer (ou modifier si existant) un nouvel artiste via le form
exports.createOrUpdateArtist = async (req, res) => {
    try {
    const file = req.file
    const personalInfo = req.body.personalInfo ? JSON.parse(req.body.personalInfo) : {}
    const { lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, socials, promoText } = personalInfo
    if(file){
        personalInfo.pics = file.path
    }
    let artist = await Artist.findOne({ "personalInfo.projectName": personalInfo.projectName })

    if(artist){
    const info = artist.personalInfo
    if (lastName) info.lastName = lastName
    if (firstName) info.firstName = firstName
    if (phone) info.phone = phone
    if (email) info.email = email
    if (projectName) info.projectName = projectName
    if (invitName) info.invitName = invitName
    if (infoRun) info.infoRun = infoRun
    if (setupTimeInMin) info.setupTimeInMin = setupTimeInMin
    if (soundcheck) info.soundcheck = soundcheck
    if (record) info.record = record
    if (setup) info.setup = setup
    if (artistComments) info.artistComments = artistComments
    if (socials) info.socials = socials
    if (promoText) info.promoText = promoText

    await artist.save()
    res.json({ message: "Artiste mis à jour", artist })
    } else {
        artist = new Artist({
        personalInfo: { lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics: personalInfo.pics, socials, promoText }
    })
    await artist.save()
    res.status(201).json(artist)
    }
    } catch (err) {
    res.status(400).json({ message: err.message })
    }
}


//Fonction pour créer un nouvel artiste dans la bdd par un admin
exports.createNewArtist = async (req, res) => {
    try {
        const { projectName, lastName, firstName, email } = req.body.personalInfo

        if (!projectName) return res.status(400).json({message: "Nom du projet obligatoire"})
        
        const checkIfExist = await Artist.findOne({"personalInfo.projectName": projectName})
        if (checkIfExist) return res.status(400).json({message: "Cet artiste existe déjà"})
        
        const artist = new Artist({
        personalInfo:{
            projectName,
            lastName: lastName || "",
            firstName: firstName || "",
            email: email || ""}
        })

        const newArtist = await artist.save()

        res.status(201).json(newArtist)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


/* exports.createNewArtist=async(req,res)=>{
    const { personalInfo:{lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics}, adminInfo:{nbOfPerson, stage, gigDateTime, soundcheckDayTime, arrivedRun, departRun, accommodation, roadMap, contract, invoice, bookingFee, travelExpense, totalFees, paiementInfo, sacemForm, specialInfo, adminComments }} =req.body

    const artist=new Artist({        
        personalInfo:{
            lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics
        },
        adminInfo:{
            nbOfPerson, stage, gigDateTime, soundcheckDayTime, arrivedRun, departRun, accommodation, roadMap, contract, invoice, bookingFee, travelExpense, totalFees, paiementInfo, sacemForm, specialInfo, adminComments
        }
    })
    try{
            const newArtist=await artist.save()
            res.status(201).json(newArtist)
    }catch(err){
            res.status(400).json({message: err.message})
    }
} */

//Fonction pour récupérer tous les artistes (admin ou public pour la promo)
exports.getAllArtists=async (req,res)=>{
    try{
        const artists= await Artist.find()
        res.json(artists)
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

//Fonction pour récupérer un artiste par son ID (admin)
exports.getArtistById=async (req, res)=>{
    try {
        const artist=await Artist.findById(req.params.id)
        if(artist == null){
            return res.status(404).json({message: 'Artiste non trouvé'})
        }
        res.json(artist)
        }catch (err) {
        res.status(500).json({message: err.message})
    }
}

//Fonction pour mettre à jour un artiste (admin)
exports.updateArtist = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id)
        if (!artist) return res.status(404).json({ message: 'Artiste non trouvé' })

        const file = req.file
        const personalInfo = req.body.personalInfo ? JSON.parse(req.body.personalInfo) : {}
        const adminInfoBody = req.body.adminInfo ? JSON.parse(req.body.adminInfo) : {}

        // Met à jour les infos personnelles
        for (const key in personalInfo) {
            if (personalInfo[key] != null) artist.personalInfo[key] = personalInfo[key]
        }

        // Met à jour les infos admin
        for (const key in adminInfoBody) {
            if (adminInfoBody[key] != null) artist.adminInfo[key] = adminInfoBody[key]
        }

        // Photo
        if (file) artist.personalInfo.pics = file.path

        await artist.save()
        res.json(artist)

    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}



//Fonction pour supprimer un artiste (admin)
exports.deleteArtist = async(req,res) => {
    try {
        const artist = await Artist.findById(req.params.id)
        if(artist == null){
            res.status(404).json({message: "Artiste non trouvé"})
        }
        await artist.deleteOne()
        res.json({message: "Artiste supprimé"})
    } catch (error) {
        res.status(500).json({message: error})
    }
}