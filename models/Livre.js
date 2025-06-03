import mongoose from "mongoose";

const LivreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  // auteur: {
  //   type: String,
  //   required: true,
  //   trim: true,
  // },
  auteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auteur", 
    required: true,
  },
  annee_publication: {
    type: Number,
    required: true,
    min: 1000,
    max: new Date().getFullYear(),
  },
  genre: {
    type: [String],
    required: true,
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/.test(v);
      },
      message: 'ISBN format invalide'
    }
  },
  editeur: {
    type: String,
    required: true,
    trim: true,
  },
  langue: {
    type: String,
    required: true,
    lowercase: true,
    default: 'français',
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  date_ajout: {
    type: Date,
    default: Date.now,
  },
  resume: {
    type: String,
    maxlength: 2000,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 1,
  }
}, {
  statics: {
    async countByGenre(genre) {
      return this.countDocuments({ genre: genre });
    },
    async countPerGenre() {
      return this.aggregate([
        { $unwind: "$genre" },
        { $group: { _id: "$genre", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);
    },
    async countByAuteur(auteur) {
      return this.countDocuments({ auteur: new RegExp(auteur, 'i') });
    },
    async livresDisponibles() {
      return this.find({ disponible: true, stock: { $gt: 0 } });
    },
    async livresParAnnee(annee) {
      return this.find({ annee_publication: annee });
    }
  },
  query: {
    byTitre(titre) {
      return this.where({ titre: new RegExp(titre, 'i') });
    },
    byAuteur(auteur) {
      return this.where({ auteur: new RegExp(auteur, 'i') });
    },
    byGenre(genre) {
      return this.where({ genre: genre });
    },
    disponibles() {
      return this.where({ disponible: true, stock: { $gt: 0 } });
    },
    parPeriode(anneeDebut, anneeFin) {
      return this.where({ 
        annee_publication: { 
          $gte: anneeDebut, 
          $lte: anneeFin 
        } 
      });
    }
  }
});

// Index pour optimiser les recherches
LivreSchema.index({ genre: 1 });
LivreSchema.index({ auteur: 1 });
LivreSchema.index({ annee_publication: -1 });
LivreSchema.index({ disponible: 1, stock: 1 });
LivreSchema.index({ titre: 'text', auteur: 'text', resume: 'text' });

// Méthodes d'instance
LivreSchema.methods.estDisponible = function() {
  return this.disponible && this.stock > 0;
};

LivreSchema.methods.emprunter = function() {
  if (this.stock > 0) {
    this.stock -= 1;
    if (this.stock === 0) {
      this.disponible = false;
    }
    return this.save();
  } else {
    throw new Error('Livre non disponible en stock');
  }
};

LivreSchema.methods.retourner = function() {
  this.stock += 1;
  this.disponible = true;
  return this.save();
};

// Propriétés virtuelles
LivreSchema.virtual('infosComplete')
  .get(function() {
    return `${this.titre} par ${this.auteur} (${this.annee_publication}) - ${this.genre.join(', ')}`;
  })
  .set(function(value) {
    const match = value.match(/^(.+?)\s+par\s+(.+?)\s+\((\d{4})\)\s+-\s+(.+)$/);
    if (match) {
      this.titre = match[1].trim();
      this.auteur = match[2].trim();
      this.annee_publication = parseInt(match[3]);
      this.genre = match[4].split(',').map(g => g.trim());
    } else {
      throw new Error("Format invalide. Exemple: 'Le Petit Prince par Antoine de Saint-Exupéry (1943) - Conte, Littérature jeunesse'");
    }
  });

LivreSchema.virtual('statutStock')
  .get(function() {
    if (this.stock === 0) return 'Épuisé';
    if (this.stock <= 5) return 'Stock faible';
    return 'En stock';
  });

const Livre = mongoose.model("Livre", LivreSchema);

export default Livre;