import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';
import { Board } from '../models/board';

export const createBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.body;

    const boardId = crypto.randomBytes(6).toString('hex');

    const newBoard = await Board.create({ boardId, name });
    res.status(201).json(newBoard);
  } catch (error) {
    next(error);
  }
};

export const getBoardByBoardId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { boardId } = req.params;

    const board = await Board.findOne({ boardId });

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res.status(200).json(board);
  } catch (error) {
    next(error);
  }
};

export const updateBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { boardId } = req.params;

    const updatedBoard = await Board.findOneAndUpdate({ boardId }, req.body, {
      new: true,
    });
    if (!updatedBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }
    res
      .status(200)
      .json({ message: 'Board updated successfully', updatedBoard });
  } catch (error) {
    next(error);
  }
};

export const deleteBoard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { boardId } = req.params;

    const deletedBoard = await Board.findOneAndDelete({ boardId });

    if (!deletedBoard) {
      return res.status(404).json({ message: 'Board not found' });
    }

    res
      .status(200)
      .json({ message: 'Board deleted successfully', deletedBoard });
  } catch (error) {
    next(error);
  }
};
