const Artist = require('../models/artistsModel')

//Fonction pour créer (ou modifier si existant) un nouvel artiste via le form
exports.createOrUpdateArtist = async (req, res) => {
    try {
    const file = req.file
    const personalInfo = req.body.personalInfo ? JSON.parse(req.body.personalInfo) : {}
    const { lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics, socials, promoText } = personalInfo
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
        const { projectName, lastName, firstName, email } = req.body

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

//Fonction pour récupérer tous les artistes (admin)
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
exports.updateArtist=async (req, res)=>{
    const {lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics, socials, promoText} = req.body.personalInfo
    const {nbOfPerson, stage, gigDateTime, soundcheckDayTime, arrivedRun, departRun, accommodation, roadMap, contract, invoice, bookingFee, travelExpense, totalFees, paiementInfo, sacemForm, specialInfo} =req.body.adminInfo
    const {descriptionFr, descriptionEng, style} = req.body.promo
    try {
        const artist=await Artist.findById(req.params.id)
        if(artist == null){
            return res.status(404).json({message: 'Artiste non trouvé'})
        }
        if(artist){
            const personalInfo = artist.personalInfo
            const adminInfo = artist.adminInfo
            const promo = artist.promo
            if (lastName) personalInfo.lastName = lastName
            if (firstName) personalInfo.firstName = firstName
            if (email) personalInfo.email = email
            if (phone) personalInfo.phone = phone
            if (projectName) personalInfo.projectName = projectName
            if (invitName) personalInfo.invitName = invitName
            if (infoRun) personalInfo.infoRun = infoRun
            if (setupTimeInMin) personalInfo.setupTimeInMin = setupTimeInMin
            if (soundcheck) personalInfo.soundcheck = soundcheck
            if (record) personalInfo.record = record
            if (setup) personalInfo.setup = setup
            if (artistComments) personalInfo.artistComments = artistComments
            if (pics) personalInfo.pics = pics
            if (socials) personalInfo.socials = socials
            if (promoText) personalInfo.promoText = promoText


            if (nbOfPerson !== undefined) adminInfo.nbOfPerson = nbOfPerson
            if (stage) adminInfo.stage = stage
            if (gigDateTime) adminInfo.gigDateTime = gigDateTime
            if (soundcheckDayTime) adminInfo.soundcheckDayTime = soundcheckDayTime
            if (arrivedRun) adminInfo.arrivedRun = arrivedRun
            if (departRun) adminInfo.departRun = departRun
            if (accommodation) adminInfo.accommodation = accommodation
            if (roadMap !== undefined) adminInfo.roadMap = roadMap
            if (contract !== undefined) adminInfo.contract = contract
            if (invoice !== undefined) adminInfo.invoice = invoice
            if (bookingFee !== undefined) adminInfo.bookingFee = bookingFee
            if (travelExpense !== undefined) adminInfo.travelExpense = travelExpense
            if (totalFees) adminInfo.totalFees = totalFees
            if (paiementInfo) adminInfo.paiementInfo = paiementInfo
            if (sacemForm !== undefined) adminInfo.sacemForm = sacemForm
            if (specialInfo) adminInfo.specialInfo = specialInfo

            if (descriptionFr) promo.descriptionFr = descriptionFr
            if (descriptionEng) promo.descriptionEng = descriptionEng
            if (style) promo.style = style

            await artist.save()
            res.json({ message: "Artiste mis à jour", artist })
        }        
    } catch (err) {
        res.status(400).json({message: err.message})
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