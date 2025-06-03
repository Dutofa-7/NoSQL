import express from 'express';
import {
  getLivres,
  searchLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre,
  livresParGenre,
  livresParLangue
} from '../controllers/livreController.js';

const router = express.Router();

router.get('/', getLivres);
// router.get('/search', searchLivres);
// router.get('/:id', getLivreById);
router.post('/', createLivre);
router.patch('/:_id', updateLivre);
router.delete('/:_id', deleteLivre);
// router.get('/genre/:genre', livresParGenre);
// router.get('/langue/:langue', livresParLangue);


export default router;