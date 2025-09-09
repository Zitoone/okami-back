const Artist = require('../models/artistsModel')

//Fonction pour créer (ou modifier si existant) un nouvel artiste via le form
exports.createOrUpdateArtist = async (req, res) => {
  const { lastName, firstName, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics } = req.body

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

//Fonction pour récupérer tous les artistes
exports.getAllArtists=async (req,res)=>{
    try{
        const artists= await Artist.find()
        res.json(artists)
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

//Fonction pour récupérer un artiste par son ID
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

/* exports.updateArtist=async (req, res)=>{
    const {name, email, phone, projectName, invitName, infoRun, setupTimeInMin, soundcheck, record, setup, artistComments, pics, nbOfPerson, stage, gigDateTime, soundcheckDayTime, arrivedRun, departRun, accommodation, roadMap, contract, invoice, bookingFee, travelExpense, totalFees, paiementInfo, sacemForm, specialInfo, adminComments} =req.body
    try {
        const artist=await Artist.findById(req.params.id)
        if(artist == null){
            return res.status(404).json({message: 'Artiste non trouvé'})
        }
        if(name != null){
            artist.name= req.body.name
        }
        const updateArtist=await artist.save()
        res.json(updateArtist)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
} */