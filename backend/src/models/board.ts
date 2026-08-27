import { Schema, model } from 'mongoose';

export interface Board {
  boardId: string;
  name: string;
}

const boardSchema = new Schema<Board>(
  {
    boardId: { type: String, required: true },
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const Board = model('Board', boardSchema);
