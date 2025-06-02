import mongoose from "mongoose";

const LivreSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  auteur: {
    type: String,
    required: true,
    trim: true,
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

// Données d'exemple - 5 livres français connus
const livresExemples = [
  {
    titre: "Le Petit Prince",
    auteur: "Antoine de Saint-Exupéry",
    annee_publication: 1943,
    genre: ["Conte", "Littérature jeunesse", "Philosophie"],
    isbn: "978-2-07-040857-0",
    editeur: "Gallimard",
    edition: "collector",
    langue: "français",
    resume: "L'histoire d'un petit prince qui voyage de planète en planète et rencontre des adultes aux comportements étranges, avant d'arriver sur Terre où il se lie d'amitié avec un aviateur.",
  },
  {
    titre: "Les Misérables",
    auteur: "Victor Hugo",
    annee_publication: 1862,
    genre: ["Roman", "Drame", "Littérature classique"],
    isbn: "978-2-253-09681-4",
    editeur: "Le Livre de Poche",
    langue: "français",
    resume: "L'épopée de Jean Valjean, ancien forçat en quête de rédemption dans la France du XIXe siècle, entre révolutions et misère sociale.",
  },
  {
    titre: "L'Étranger",
    auteur: "Albert Camus",
    annee_publication: 1942,
    genre: ["Roman", "Philosophie", "Existentialisme"],
    isbn: "978-2-07-036002-1",
    editeur: "Gallimard",
    langue: "français",
    resume: "Meursault, un homme indifférent à tout, commet un meurtre absurde sur une plage d'Alger et se retrouve face à la justice et à l'absurdité de l'existence.",
  },
  {
    titre: "Madame Bovary",
    auteur: "Gustave Flaubert",
    genre: ["Roman", "Réalisme", "Littérature classique"],
    isbn: "978-2-253-00115-4",
    editeur: "Le Livre de Poche",
    langue: "français",
    resume: "Emma Bovary, femme d'un médecin de campagne, s'ennuie dans sa vie bourgeoise et cherche l'évasion dans des rêves romantiques qui la mèneront à sa perte.",
  },
  {
    titre: "Le Rouge et le Noir",
    auteur: "Stendhal",
    annee_publication: 1830,
    genre: ["Roman", "Psychologique", "Littérature classique"],
    isbn: "978-2-253-00616-6",
    editeur: "Le Livre de Poche",
    langue: "français",
    resume: "Julien Sorel, jeune homme ambitieux de la Restauration, tente de s'élever socialement par tous les moyens dans une société rigide et hypocrite.",
  }
];

// Fonction pour insérer les données d'exemple
export async function insertLivresExemples() {
  try {
    await Livre.deleteMany({}); // Nettoyer la collection
    await Livre.insertMany(livresExemples);
    console.log('5 livres français ajoutés avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'insertion:', error);
  }
}

export default Livre;