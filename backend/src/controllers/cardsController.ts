import { Request, Response, NextFunction } from 'express';
import { Card } from '../models/card';

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { boardId } = req.params as { boardId: string };
    const { title, description, column, order } = req.body;

    const newCard = await Card.create({
      boardId,
      title,
      description,
      column,
      order,
    });

    res.status(201).json(newCard);
  } catch (error) {
    next(error);
  }
};

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { boardId } = req.params as { boardId: string };

    const card = await Card.find({ boardId });

    res.status(200).json(card);
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { boardId, cardId } = req.params as {
      boardId: string;
      cardId: string;
    };
    const { title, description, column, order } = req.body;

    const updatedCard = await Card.findOneAndUpdate(
      { _id: cardId, boardId },
      { title, description, column, order },
      { new: true },
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.status(200).json({ message: 'Card updated successfully', updatedCard });
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { boardId, cardId } = req.params as {
      boardId: string;
      cardId: string;
    };

    const deletedCard = await Card.findOneAndDelete({ _id: cardId, boardId });

    if (!deletedCard) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.status(200).json({ message: 'Card deleted successfully', deletedCard });
  } catch (error) {
    next(error);
  }
};
