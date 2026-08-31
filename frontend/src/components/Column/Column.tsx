import { Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "./Column.module.css";
import Card from "../Card/Card";
import { type CardType } from "../../types/card";

interface ColumnProps {
  title: string;
  cards: CardType[];
  onAddCard: () => void;
  onEditCard: (card: CardType) => void;
  onDeleteCard: (cardId: string) => void;
}

export default function Column({
  title,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
}: ColumnProps) {
  return (
    <div className={styles.column}>
      <h2 className={styles.title}>{title}</h2>

      <Droppable droppableId={title}>
        {(provided) => (
          <div
            className={styles.cardList}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {cards.map((card, index) => (
              <Draggable key={card._id} draggableId={card._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${styles.draggableCard} ${
                      snapshot.isDragging ? styles.isDragging : ""
                    }`}
                  >
                    <Card
                      card={card}
                      onEdit={onEditCard}
                      onDelete={onDeleteCard}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button className={styles.buttonIcon} onClick={onAddCard}>
        <img src="/addIcon.svg" alt="Add" width={30} height={30} />
      </button>
    </div>
  );
}
