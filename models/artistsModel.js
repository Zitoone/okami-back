import mongoose from 'mongoose';

const artistSchema = new mongoose.Schema({
  // Clé unique pour relier les données
  projectName: { type: String, required: true, unique: true, trim: true },
  
  // Données personnelles (artiste)
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  email: { type: String, trim: true },
  phone: { type: String, trim: true },
  guestName: { type: String, trim: true },
  runInfo: { type: String },
  
  // Informations techniques (artiste)
  setup: { type: String },
  setupTime: { type: String },
  needsSoundcheck: { type: Boolean, default: false },
  canRecordSet: { type: Boolean, default: false }, 
  comments: { type: String },
  
  // Médias et promotion (artiste)
  promoPhoto: { type: String },
  socialLinks: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    spotify: { type: String, default: '' },
    soundcloud: { type: String, default: '' },
    website: { type: String, default: '' },
  },
  musicalStyle: { type: String },
  promoText: { type: String },
  
  // Données admin
  numberOfPeople: { type: Number },
  stage: { type: String },
  performanceDateTime: { type: String},
  soundcheckDateTime: { type: String },
  arrivalRun: { type: String },
  departureRun: { type: String },
  accommodation: { type: String },
  
  // Documents admin
  contract: { type: String },
  invoice: { type: String },
  roadmap: { type: String },
  sacemForm: { type: String },
  specialInfo: { type: String },
  
  // Finances admin
  fee: { type: Number, default: 0 },
  travelExpenses: { type: Number, default: 0 },
  totalTTC: { type: String },
  paymentInfo: { type: String },
    
  // Métadonnées
  dataSource: { type: String, enum: ['artist', 'admin'], default: 'artist' },
  lastModifiedBy: { type: String, enum: ['artist', 'admin'] },
  isValidated: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Artist2026', artistSchema,'artists_2026');
