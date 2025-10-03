const Artist = require('../models/artistsModel')

//Fonction pour créer (ou modifier si existant) un nouvel artiste via le form
exports.createOrUpdateArtist = async (req, res) => {
  const { lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics } = req.body.personalInfo

  try {
    let artist = await Artist.findOne({ "personalInfo.projectName": projectName })

    if(artist){
    const personalInfo = artist.personalInfo
    if (lastName) personalInfo.lastName = lastName
    if (firstName) personalInfo.firstName = firstName
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

      await artist.save()
      res.json({ message: "Artiste mis à jour", artist })
    } else {
      artist = new Artist({
        personalInfo: { lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics }
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
        const { personalInfo, adminInfo } = req.body;

        const artist = new Artist({
            personalInfo: personalInfo || {},
            adminInfo: adminInfo || {}
        });

        const newArtist = await artist.save();

        res.status(201).json(newArtist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


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
    const {lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics} = req.body.personalInfo
    const {nbOfPerson, stage, gigDateTime, soundcheckDayTime, arrivedRun, departRun, accommodation, roadMap, contract, invoice, bookingFee, travelExpense, totalFees, paiementInfo, sacemForm, specialInfo, adminComments} =req.body.adminInfo
    try {
        const artist=await Artist.findById(req.params.id)
        if(artist == null){
            return res.status(404).json({message: 'Artiste non trouvé'})
        }
        if(artist){
            const personalInfo = artist.personalInfo
            const adminInfo = artist.adminInfo
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

            if (nbOfPerson) adminInfo.nbOfPerson = nbOfPerson
            if (stage) adminInfo.stage = stage
            if (gigDateTime) adminInfo.gigDateTime = gigDateTime
            if (soundcheckDayTime) adminInfo.soundcheckDayTime = soundcheckDayTime
            if (arrivedRun) adminInfo.arrivedRun = arrivedRun
            if (departRun) adminInfo.departRun = departRun
            if (accommodation) adminInfo.accommodation = accommodation
            if (roadMap) adminInfo.roadMap = roadMap
            if (contract) adminInfo.contract = contract
            if (invoice) adminInfo.invoice = invoice
            if (bookingFee) adminInfo.bookingFee = bookingFee
            if (travelExpense) adminInfo.travelExpense = travelExpense
            if (totalFees) adminInfo.totalFees = totalFees
            if (paiementInfo) adminInfo.paiementInfo = paiementInfo
            if (sacemForm) adminInfo.sacemForm = sacemForm
            if (specialInfo) adminInfo.specialInfo = specialInfo
            if (adminComments) adminInfo.adminComments = adminComments

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