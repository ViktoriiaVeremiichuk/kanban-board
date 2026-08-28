import axios from "axios";
import { type Card } from "../types/card";

const api = axios.create({ baseURL: "https://kanban-board-n4ad.onrender.com" });

export const createCard = async (
  boardId: string,
  cardData: Omit<Card, "_id">,
): Promise<Card> => {
  const response = await api.post<Card>(
    `api/boards/${boardId}/cards`,
    cardData,
  );
  return response.data;
};


export const getCards = async (boardId: string): Promise<Card[]> => {
  const response = await api.get<Card[]>(`/api/boards/${boardId}/cards`);
  return response.data;
};


export const updateCard = async (
  boardId: string,
  _id: string,
  updatedData: Partial<Card>,
): Promise<Card> => {
  const response = await api.patch<{ message: string; updatedCard: Card }>(
    `/api/boards/${boardId}/cards/${_id}`,
    updatedData,
  );
  return response.data.updatedCard;
};

export const deleteCard = async (
  boardId: string,
  _id: string,
): Promise<Card> => {
  const response = await api.delete<{ message: string; deletedCard: Card }>(
    `/api/boards/${boardId}/cards/${_id}`,
  );
  return response.data.deletedCard;
};
