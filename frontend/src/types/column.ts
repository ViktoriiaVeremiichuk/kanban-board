export type ColumnStatus = "To Do" | "In Progress" | "Done";

export interface Column {
  id: string;
  title: ColumnStatus;
}

export const BOARD_COLUMNS: Column[] = [
  { id: "1", title: "To Do" },
  { id: "2", title: "In Progress" },
  { id: "3", title: "Done" },
];
