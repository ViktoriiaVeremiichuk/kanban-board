import { Router } from 'express';
import {
  createBoard,
  getBoardByBoardId,
  updateBoard,
  deleteBoard,
} from '../controllers/boardsController';

const router = Router();

router.post('/', createBoard);
router.get('/:boardId', getBoardByBoardId);
router.patch('/:boardId', updateBoard);
router.delete('/:boardId', deleteBoard);

export default router;
