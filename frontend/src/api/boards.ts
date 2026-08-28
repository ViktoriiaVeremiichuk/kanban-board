import axios from "axios";
import { type Board } from "../types/board";

const api = axios.create({ baseURL: "https://kanban-board-n4ad.onrender.com" });

export const createBoard = async (name: string): Promise<Board> => {
  const response = await api.post<Board>(`/api/boards`, { name });
  return response.data;
};

export const getBoard = async (boardId: string): Promise<Board> => {
  const response = await api.get<Board>(`/api/boards/${boardId}`);
  return response.data;
};

export const updateBoard = async (
  name: string,
  boardId: string,
): Promise<Board> => {
  const response = await api.patch<{ message: string; updatedBoard: Board }>(
    `/api/boards/${boardId}`,
    { name },
  );
  return response.data.updatedBoard;
};

export const deleteBoard = async (boardId: string): Promise<Board> => {
  const response = await api.delete<{ message: string; deletedBoard: Board }>(
    `/api/boards/${boardId}`,
  );
  return response.data.deletedBoard;
};
