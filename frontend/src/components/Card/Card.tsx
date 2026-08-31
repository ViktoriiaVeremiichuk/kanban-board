import styles from "./Card.module.css";
import { type CardType } from "../../types/card";

interface CardProps {
  card: CardType;
  onEdit: (card: CardType) => void;
  onDelete: (cardId: string) => void;
}

export default function Card({ card, onEdit, onDelete }: CardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{card.title}</h3>
      {card.description && (
        <p className={styles.description}>{card.description}</p>
      )}
      <div className={styles.buttonsGroup}>
        <button className={styles.buttonIcon} onClick={() => onEdit(card)}>
          <img src="/editIcon.svg" alt="Edit" width={25} height={25} />
        </button>
        <button
          className={styles.buttonIcon}
          onClick={() => onDelete(card._id)}
        >
          <img src="/deleteIcon.svg" alt="Delete" width={26} height={26} />
        </button>
      </div>
    </div>
  );
}
