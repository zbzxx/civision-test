import mongoose from 'mongoose';

// Définition du schéma pour la collection Civisiontest
const civisionTestSchema = new mongoose.Schema({
  saison: { type: String, required: true },
  prix: { type: Number, required: true },
  age: { type: Number, required: true },
  niveau: { type: String, required: true },
  compte: { type: Boolean, required: true },
  passe: { type: String, required: true },
});

// Utilisation du modèle pour la collection Civisiontest
const CivisionTestModel = mongoose.models.Civisiontest || mongoose.model('Civisiontest', civisionTestSchema);

export default CivisionTestModel;
