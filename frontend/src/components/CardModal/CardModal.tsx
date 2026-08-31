import styles from "./CardModal.module.css";
import { useState } from "react";

interface CardModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialTitle?: string;
  initialDescription?: string;
  onClose: () => void;
  onSave: (title: string, description: string) => Promise<void> | void;
}

export default function CardModal({
  isOpen,
  mode,
  initialTitle = "",
  initialDescription = "",
  onClose,
  onSave,
}: CardModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSave(title.trim(), description.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.cardModal}>
        <h2 className={styles.title}>
          {mode === "create" ? "Add new card" : "Edit card"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.button}
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className={styles.button}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                  ? "Create"
                  : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
