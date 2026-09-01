import styles from "./BoardPage.module.css";
import { type CardType } from "../../types/card.ts";
import { useState, useEffect } from "react";
import { useBoardStore } from "../../store/useBoardStore.ts";
import Loader from "../Loader/Loader.tsx";
import { BOARD_COLUMNS } from "../../types/column";
import Column from "../Column/Column.tsx";
import CardModal from "../CardModal/CardModal.tsx";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";

export default function BoardPage() {
  const {
    boardId,
    currentBoard,
    cards,
    loading,
    error,
    setBoardId,
    fetchBoardData,
    createNewBoard,
    updateCurrentBoardName,
    removeBoard,
    addNewCard,
    editCard,
    removeCard,
    moveCard,
  } = useBoardStore();

  const [searchInput, setSearchInput] = useState<string>("");

  const [newBoardName, setNewBoardName] = useState<string>("");
  const [isEditingBoard, setIsEditingBoard] = useState<boolean>(false);
  const [boardNameInput, setBoardNameInput] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [activeColumn, setActiveColumn] = useState<string>("");
  const [currentCardId, setCurrentCardId] = useState<string | null>(null);
  const [initialTitle, setInitialTitle] = useState<string>("");
  const [initialDescription, setInitialDescription] = useState<string>("");

  const [modalKey, setModalKey] = useState(0);

  useEffect(() => {
    if (boardId) {
      fetchBoardData(boardId);
    }
  }, [boardId, fetchBoardData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedId = searchInput.trim();
    if (!trimmedId) return;
    setBoardId(trimmedId);
    setSearchInput("");
    setNewBoardName("");
  };

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardName.trim() || loading) return;
    await createNewBoard(newBoardName.trim());
    setSearchInput("");
    setNewBoardName("");
  };

  const handleUpdateBoardName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardNameInput.trim()) return;
    await updateCurrentBoardName(boardNameInput.trim());
    setIsEditingBoard(false);
  };

  const handleDeleteBoard = async () => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    await removeBoard();
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
    if (modalMode === "create") {
      await addNewCard(
        title,
        description,
        activeColumn as "To Do" | "In Progress" | "Done",
      );
    } else if (modalMode === "edit" && currentCardId) {
      await editCard(currentCardId, title, description);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    await removeCard(cardId);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const updatedCards = [...cards];
    const cardToMoveIndex = updatedCards.findIndex(
      (card) => card._id === draggableId,
    );
    if (cardToMoveIndex === -1) return;

    const [cardToMove] = updatedCards.splice(cardToMoveIndex, 1);

    const updatedCard: CardType = {
      ...cardToMove,
      column: destination.droppableId as "To Do" | "In Progress" | "Done",
    };

    const targetColumnCards = updatedCards.filter(
      (card) => card.column === destination.droppableId,
    );

    targetColumnCards.splice(destination.index, 0, updatedCard);

    const reorderedTargetCards = targetColumnCards.map((card, index) => ({
      ...card,
      order: index,
    }));

    const finalCards = updatedCards
      .filter((card) => card.column !== destination.droppableId)
      .concat(reorderedTargetCards);

    await moveCard(finalCards, reorderedTargetCards);
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

        <div className={styles.boardHeaderRow}>
          {currentBoard ? (
            <>
              {isEditingBoard ? (
                <form
                  onSubmit={handleUpdateBoardName}
                  className={styles.editForm}
                >
                  <div className={styles.boardNameRow}>
                    <input
                      className={styles.input}
                      type="text"
                      value={boardNameInput}
                      onChange={(e) => setBoardNameInput(e.target.value)}
                      autoFocus
                    />
                  </div>

                  <div className={styles.boardActions}>
                    <button className={styles.button} type="submit">
                      Save
                    </button>

                    <button
                      className={styles.button}
                      type="button"
                      onClick={() => setIsEditingBoard(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.titleSection}>
                  <div className={styles.boardNameRow}>
                    <h1 className={styles.title}>{currentBoard.name}</h1>
                  </div>
                  <div className={styles.boardActions}>
                    <button
                      className={styles.button}
                      onClick={() => {
                        setBoardNameInput(currentBoard.name);
                        setIsEditingBoard(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className={styles.button}
                      onClick={handleDeleteBoard}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}

              <p>Board ID: {boardId}</p>
            </>
          ) : (
            <h1 className={styles.title}>
              Create a new board or enter an ID to start
            </h1>
          )}
        </div>

        <div className={styles.columnsContainer}>
          {BOARD_COLUMNS.map((column) => (
            <Column
              key={column.id}
              title={column.title}
              cards={cards
                .filter((card) => card.column === column.title)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))}
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
