import { Values } from "./constants";

export type CellValue = typeof Values[keyof typeof Values] | number;

export type CellState = {
  revealed: boolean;
  flagged: boolean;
  value: CellValue;
};

export enum GameStatus {
  UNDETERMINED,
  WIN,
  LOSS
}
