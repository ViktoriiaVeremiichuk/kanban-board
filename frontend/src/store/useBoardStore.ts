import { create } from "zustand";
import { type Board } from "../types/board";
import { type CardType } from "../types/card";
import { createBoard, getBoard, updateBoard, deleteBoard } from "../api/boards";
import { getCards, createCard, updateCard, deleteCard } from "../api/cards";

interface BoardState {
  boardId: string;
  currentBoard: Board | null;
  cards: CardType[];
  loading: boolean;
  error: boolean;

  setBoardId: (id: string) => void;
  fetchBoardData: (id: string) => Promise<void>;
  createNewBoard: (name: string) => Promise<void>;
  updateCurrentBoardName: (newName: string) => Promise<void>;
  removeBoard: () => Promise<void>;

  addNewCard: (
    title: string,
    description: string,
    column: "To Do" | "In Progress" | "Done",
  ) => Promise<void>;
  editCard: (
    cardId: string,
    title: string,
    description: string,
  ) => Promise<void>;
  removeCard: (cardId: string) => Promise<void>;
  moveCard: (
    finalCards: CardType[],
    reorderedTargetCards: CardType[],
  ) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boardId: "",
  currentBoard: null,
  cards: [],
  loading: false,
  error: false,
  setBoardId: (id) => set({ boardId: id }),

  fetchBoardData: async (id) => {
    try {
      set({ loading: true, error: false });
      const [boardData, cardsData] = await Promise.all([
        getBoard(id),
        getCards(id),
      ]);

      set({ currentBoard: boardData, cards: cardsData, boardId: id });
    } catch (error) {
      set({ error: true, currentBoard: null, cards: [] });
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  createNewBoard: async (name) => {
    try {
      set({ loading: true, error: false });
      const createdBoard = await createBoard(name);
      set({
        currentBoard: createdBoard,
        boardId: createdBoard.boardId,
        cards: [],
      });
    } catch (error) {
      set({ error: true });
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },

  updateCurrentBoardName: async (newName) => {
    const { boardId } = get();
    if (!boardId) return;

    try {
      set({ loading: true, error: false });
      const updated = await updateBoard(boardId, newName);
      set({ currentBoard: updated });
    } catch (error) {
      set({ error: true });
      console.error("Failed to update board:", error);
    } finally {
      set({ loading: false });
    }
  },

  removeBoard: async () => {
    const { boardId } = get();
    if (!boardId) return;

    try {
      set({ loading: true, error: false });
      await deleteBoard(boardId);
      set({
        boardId: "",
        currentBoard: null,
        cards: [],
      });
    } catch (error) {
      set({ error: true });
      console.error("Failed to delete board:", error);
    } finally {
      set({ loading: false });
    }
  },

  addNewCard: async (title, description, column) => {
    const { boardId } = get();
    if (!boardId) return;

    try {
      const newCard = await createCard(boardId, {
        title,
        description,
        column,
        boardId,
        order: 0,
      });
      set((state) => ({ cards: [...state.cards, newCard] }));
    } catch (error) {
      console.error(error);
    }
  },

  editCard: async (cardId, title, description) => {
    const { boardId } = get();
    if (!boardId) return;

    try {
      const updated = await updateCard(boardId, cardId, {
        title,
        description,
      });
      set((state) => ({
        cards: state.cards.map((card) =>
          card._id === cardId ? updated : card,
        ),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  removeCard: async (cardId) => {
    const { boardId } = get();
    if (!boardId) return;
    try {
      await deleteCard(boardId, cardId);
      set((state) => ({
        cards: state.cards.filter((card) => card._id !== cardId),
      }));
    } catch (error) {
      console.error(error);
    }
  },

  moveCard: async (finalCards, reorderedTargetCards) => {
    const { boardId } = get();
    if (!boardId) return;
    set({ cards: finalCards });

    try {
      await Promise.all(
        reorderedTargetCards.map((card) =>
          updateCard(boardId, card._id, {
            column: card.column,
            order: card.order,
          }),
        ),
      );
    } catch (error) {
      console.error("Failed to update card positions:", error);
    }
  },
}));
