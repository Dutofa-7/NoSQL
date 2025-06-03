import Livre from "../models/Livre.js";

export const getLivres = async (req, res) => {
  try {
    const livres = await Livre.find();
    res.json(livres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchLivres = async (req, res) => {
  const { titre } = req.query;
  try {
    const livres = await Livre.find({ titre: new RegExp(titre, 'i') });
    res.json(livres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLivreById = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json(livre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLivre = async (req, res) => {
  const livre = new Livre(req.body);
  try {
    const nouveauLivre = await livre.save();
    res.status(201).json(nouveauLivre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLivre = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json(livre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLivre = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndDelete(req.params.id);
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};