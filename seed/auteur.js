import mongoose from "mongoose";
import dotenv from "dotenv";
import Auteur from "../models/Auteur.js";

dotenv.config();

const auteursExemples = [
  {
    nom: "Victor Hugo",
    biographie: "Écrivain, poète et dramaturge français du XIXe siècle.",
    date_naissance: new Date("1802-02-26"),
    nationalite: "Française"
  },
  {
    nom: "Antoine de Saint-Exupéry",
    biographie: "Écrivain, poète, aviateur et reporter français.",
    date_naissance: new Date("1900-06-29"),
    nationalite: "Française"
  },
  {
    nom: "Albert Camus",
    biographie: "Écrivain, philosophe et journaliste français.",
    date_naissance: new Date("1913-11-07"),
    nationalite: "Française"
  },
  {
    nom: "Gustave Flaubert",
    biographie: "Écrivain français, auteur de Madame Bovary.",
    date_naissance: new Date("1821-12-12"),
    nationalite: "Française"
  },
  {
    nom: "Stendhal",
    biographie: "Écrivain français, auteur du Rouge et le Noir.",
    date_naissance: new Date("1783-01-23"),
    nationalite: "Française"
  }
];

async function seedAuteurs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Auteur.deleteMany({});
    await Auteur.insertMany(auteursExemples);
    console.log("Seed des auteurs terminé !");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors du seed des auteurs:", err);
    process.exit(1);
  }
}

seedAuteurs();