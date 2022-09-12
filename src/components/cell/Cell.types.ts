import type { CellValue } from "../../utils/minesweeper/types";

export type CellProps = {
  className?: string;
  bgColor?: string;
  variant?: string;
  value: CellValue;
  onClick: () => void;
  onContextMenu: () => void;
};
