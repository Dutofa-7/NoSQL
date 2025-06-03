import express from 'express'
import Livre from '../models/Livre.js'

const router = express.Router()

// Route pour obtenir tous les livres
router.get('/', async (req, res) => {
  try {
    const livres = await Livre.find()
    res.json(livres)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// Route pour rechercher des livres par titre
router.get('/search', async (req, res) => {
  const { titre } = req.query
  try {
    const livres = await Livre.find({ titre: new RegExp(titre, 'i') })
    res.json(livres)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Route pour obtenir un livre par son ID
router.get('/:id', async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id)
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' })
    res.json(livre)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Route pour créer un nouveau livre
router.post('/', async (req, res) => {
  const livre = new Livre(req.body)
  try {
    const nouveauLivre = await livre.save()
    res.status(201).json(nouveauLivre)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// Route pour mettre à jour un livre
router.patch('/:id', async (req, res) => {
  try {
    const livre = await Livre.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' })
    res.json(livre)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
)

// Route pour supprimer un livre
router.delete('/:id', async (req, res) => {
  try {
    const livre = await Livre.findByIdAndDelete(req.params.id)
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' })
    res.json({ message: 'Livre supprimé avec succès' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router;