import mongoose from "mongoose";

const AuteurSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  biographie: {
    type: String,
    maxlength: 2000
  },
  date_naissance: Date,
  nationalite: String
}, {
  timestamps: true,
  statics: {
    async livresPubliesApres1900() {
      return this.aggregate([
        {
          $lookup: {
            from: "livres", // nom de la collection MongoDB
            localField: "_id",
            foreignField: "auteur",
            as: "livres"
          }
        },
        {
          $addFields: {
            livres_apres_1900: {
              $size: {
                $filter: {
                  input: "$livres",
                  as: "livre",
                  cond: { $gt: ["$$livre.annee_publication", 1900] }
                }
              }
            }
          }
        },
        {
          $project: {
            nom: 1,
            livres_apres_1900: 1
          }
        }
      ]);
    }
  }
});

const Auteur = mongoose.model("Auteur", AuteurSchema);

export default Auteur;
