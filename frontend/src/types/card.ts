export interface Card {
  _id: string;
  title: string;
  description?: string;
  column: "To Do" | "In Progress" | "Done";
  boardId: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}
