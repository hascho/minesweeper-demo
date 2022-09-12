import type { CellState } from "../../utils/minesweeper/types";

export type BoardProps = {
  rows: number;
  columns: number;
  values: CellState[];
  handleReveal: (index: number) => void;
  handleFlagToggle: (index: number) => void;
};
