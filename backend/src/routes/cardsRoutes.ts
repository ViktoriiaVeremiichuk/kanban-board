import { Router } from 'express';
import {
  createCard,
  getCards,
  updateCard,
  deleteCard,
} from '../controllers/cardsController';

const router = Router();

router.post('/:boardId/cards', createCard);
router.get('/:boardId/cards', getCards);
router.patch('/:boardId/cards/:cardId', updateCard);
router.delete('/:boardId/cards/:cardId', deleteCard);

export default router;
