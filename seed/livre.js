import mongoose from "mongoose";
import dotenv from "dotenv";
import Livre from "../models/Livre.js";
import Auteur from "../models/Auteur.js";

dotenv.config();

async function seedLivres() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const auteurs = {};
    const auteursDocs = await Auteur.find();
    auteursDocs.forEach(a => {
      auteurs[a.nom] = a._id;
    });

    const livresExemples = [
      {
        titre: "El Petit Prince",
        auteur: auteurs["Antoine de Saint-Exupéry"],
        annee_publication: 1943,
        genre: ["Conte", "Littérature jeunesse", "Philosophie"],
        isbn: "978-2-07-040857-0",
        editeur: "Gallimard",
        edition: "collector",
        langue: "espagnol",
        resume: "La historia de un pequeño príncipe que viaja de planeta en planeta y encuentra adultos con comportamientos extraños, antes de llegar a la Tierra donde se hace amigo de un aviador.",
      },
      {
        titre: "Le Petit Prince",
        auteur: auteurs["Antoine de Saint-Exupéry"],
        annee_publication: 1943,
        genre: ["Conte", "Littérature jeunesse", "Philosophie"],
        isbn: "978-2-07-061275-5",
        editeur: "Gallimard",
        edition: "collector",
        langue: "français",
        resume: "L'histoire d'un petit prince qui voyage de planète en planète et rencontre des adultes aux comportements étranges, avant d'arriver sur Terre où il se lie d'amitié avec un aviateur.",
      },
      {
        titre: "Les Misérables",
        auteur: auteurs["Victor Hugo"],
        annee_publication: 1862,
        genre: ["Roman", "Drame", "Littérature classique"],
        isbn: "978-2-253-09681-4",
        editeur: "Le Livre de Poche",
        langue: "français",
        resume: "L'épopée de Jean Valjean, ancien forçat en quête de rédemption dans la France du XIXe siècle, entre révolutions et misère sociale.",
      },
      {
        titre: "L'Étranger",
        auteur: auteurs["Albert Camus"],
        annee_publication: 1942,
        genre: ["Roman", "Philosophie", "Existentialisme"],
        isbn: "978-2-07-036002-1",
        editeur: "Gallimard",
        langue: "français",
        resume: "Meursault, un homme indifférent à tout, commet un meurtre absurde sur une plage d'Alger et se retrouve face à la justice et à l'absurdité de l'existence.",
      },
      {
        titre: "Madame Bovary",
        auteur: auteurs["Gustave Flaubert"],
        annee_publication: 1857,
        genre: ["Roman", "Réalisme", "Littérature classique"],
        isbn: "978-2-253-00115-4",
        editeur: "Le Livre de Poche",
        langue: "français",
        resume: "Emma Bovary, femme d'un médecin de campagne, s'ennuie dans sa vie bourgeoise et cherche l'évasion dans des rêves romantiques qui la mèneront à sa perte.",
      },
      {
        titre: "Le Rouge et le Noir",
        auteur: auteurs["Stendhal"],
        annee_publication: 1830,
        genre: ["Roman", "Psychologique", "Littérature classique"],
        isbn: "978-2-253-00616-6",
        editeur: "Le Livre de Poche",
        langue: "français",
        resume: "Julien Sorel, jeune homme ambitieux de la Restauration, tente de s'élever socialement par tous les moyens dans une société rigide et hypocrite.",
      }
    ];

    await Livre.deleteMany({});
    await Livre.insertMany(livresExemples);
    console.log("Seed des livres terminé !");
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors du seed des livres:", err);
    process.exit(1);
  }
}

seedLivres();