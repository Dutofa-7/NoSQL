import express from 'express';
import {
  getLivres,
  searchLivres,
  getLivreById,
  createLivre,
  updateLivre,
  deleteLivre
} from '../controllers/livreController.js';

const router = express.Router();

router.get('/', getLivres);
router.get('/search', searchLivres);
router.get('/:id', getLivreById);
router.post('/', createLivre);
router.patch('/:id', updateLivre);
router.delete('/:id', deleteLivre);

export default router;