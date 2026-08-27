import { Schema, model } from 'mongoose';

export interface Card {
  title: string;
  description: string;
  column: string;
  boardId: string;
  order: number;
}

const cardSchema = new Schema<Card>(
  {
    title: { type: String, required: true },
    description: { type: String, required: false },
    column: {
      type: String,
      enum: ['To Do', 'In Progress', 'Done'],
      required: true,
      default: 'To Do',
    },
    boardId: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

export const Card = model('Card', cardSchema);
