import styles from "./BoardPage.module.css";
import { type Board } from "../../types/board.ts";
import { type CardType } from "../../types/card.ts";
import { useState, useEffect } from "react";
import { createBoard, getBoard } from "../../api/boards.ts";
import { createCard, updateCard, deleteCard } from "../../api/cards.ts";
import { getCards } from "../../api/cards.ts";
import Loader from "../Loader/Loader.tsx";
import { BOARD_COLUMNS } from "../../types/column";
import Column from "../Column/Column.tsx";
import CardModal from "../CardModal/CardModal.tsx";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

export default function BoardPage() {
  const [boardId, setBoardId] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");

  const [newBoardName, setNewBoardName] = useState<string>("");

  const [currentBoard, setCurrentBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [cards, setCards] = useState<CardType[]>([]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeColumn, setActiveColumn] = useState<string>("");
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [initialTitle, setInitialTitle] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");

  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    if (!boardId) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const [boardData, cardsData] = await Promise.all([
          getBoard(boardId),
          getCards(boardId),
        ]);
        setCurrentBoard(boardData);
        setCards(cardsData);
      } catch (err) {
        setError(true);
        setCurrentBoard(null);
        setCards([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [boardId]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = searchInput.trim();
    if (!trimmedId) return;

    try {
      setLoading(true);
      setError(false);

      const [boardData, cardsData] = await Promise.all([
        getBoard(trimmedId),
        getCards(trimmedId),
      ]);

      setCurrentBoard(boardData);
      setCards(cardsData);
      setBoardId(trimmedId);
      setSearchInput("");
      setNewBoardName("");
    } catch (err) {
      setError(true);
      setCurrentBoard(null);
      setCards([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBoardName.trim() || loading) return;
    try {
      setLoading(true);
      setError(false);
      const createdBoard = await createBoard(newBoardName.trim());
      setCurrentBoard(createdBoard);
      setBoardId(createdBoard.boardId);
      setSearchInput("");
      setNewBoardName("");
    } catch (error) {
      setError(true);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = (columnTitle: string) => {
    if (!boardId) {
      alert("Please create or find a board before adding cards!");
      return;
    }
    setModalMode("create");
    setActiveColumn(columnTitle);
    setInitialTitle("");
    setInitialDescription("");
    setCurrentCardId(null);
    setIsModalOpen(true);
    setModalKey((prev) => prev + 1);
  };

  const openEditModal = (card: CardType) => {
    setModalMode("edit");
    setCurrentCardId(card._id);
    setInitialTitle(card.title);
    setInitialDescription(card.description || "");
    setIsModalOpen(true);
    setModalKey((prev) => prev + 1);
  };

  const handleSaveCard = async (title: string, description: string) => {
    if (!boardId) return;

    try {
      if (modalMode === "create") {
        const newCard = await createCard(boardId, {
          title,
          description,
          column: activeColumn as "To Do" | "In Progress" | "Done",
          boardId,
          order: 0,
        });
        setCards((prev) => [...prev, newCard]);
      } else if (modalMode === "edit" && currentCardId) {
        const updated = await updateCard(boardId, currentCardId, {
          title,
          description,
        });
        setCards((prev) =>
          prev.map((card) => (card._id === currentCardId ? updated : card)),
        );
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      await deleteCard(boardId, cardId);
      setCards((prev) => prev.filter((card) => card._id !== cardId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedCards = [...cards];

    const cardToMove = updatedCards.find((card) => card._id === draggableId);
    if (!cardToMove) return;

    const sourceIndex = updatedCards.findIndex(
      (card) => card._id === draggableId,
    );

    updatedCards.splice(sourceIndex, 1);

    const updatedCard: CardType = {
      ...cardToMove,
      column: destination.droppableId as "To Do" | "In Progress" | "Done",
    };

    updatedCards.splice(destination.index, 0, updatedCard);

    setCards(updatedCards);

    try {
      updateCard(boardId, draggableId, {
        column: updatedCard.column,
        order: destination.index,
      });
    } catch (err) {
      console.error("Failed to update card position:", err);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <div className={styles.inputField}>
          <form onSubmit={handleCreateBoard}>
            <input
              className={styles.input}
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="Enter board name"
              disabled={loading}
            />
            <button className={styles.button} type="submit" disabled={loading}>
              Create board
            </button>
          </form>

          <form onSubmit={handleSearch}>
            <input
              className={styles.input}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter board ID"
              disabled={loading}
            />
            <button className={styles.button} type="submit" disabled={loading}>
              Search
            </button>
          </form>
        </div>

        {loading && <Loader />}
        {error && <div className={styles.errorText}>Data loading error</div>}

        <h1 className={styles.title}>
          {currentBoard
            ? `${currentBoard.name} `
            : "Create a new board or enter an ID to start"}
        </h1>
        <p>Board ID: {boardId}</p>
        <div className={styles.columnsContainer}>
          {BOARD_COLUMNS.map((column) => (
            <Column
              key={column.id}
              title={column.title}
              cards={cards.filter((card) => card.column === column.title)}
              onAddCard={() => openCreateModal(column.title)}
              onEditCard={openEditModal}
              onDeleteCard={handleDeleteCard}
            />
          ))}
        </div>

        <CardModal
          key={modalKey}
          isOpen={isModalOpen}
          mode={modalMode}
          initialTitle={initialTitle}
          initialDescription={initialDescription}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCard}
        />
      </div>
    </DragDropContext>
  );
}
