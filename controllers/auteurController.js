import Auteur from "../models/Auteur.js";

export const getAllAuteurs = async (req, res) => {
  try {
    const auteurs = await Auteur.find();
    res.json(auteurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStatsLivresApres1900 = async (req, res) => {
  try {
    const resultats = await Auteur.livresPubliesApres1900();
    res.json(resultats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
