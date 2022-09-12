import * as React from "react";

import {
  createBoard,
  gameStatus,
  reveal,
  toggleFlag
} from "../../utils/minesweeper/utils";
import { CellState, GameStatus } from "../../utils/minesweeper/types";

export const useGame = (gridSize: number, bombs: number) => {
  const [boardValues, setBoardValues] = React.useState<CellState[]>(() =>
    createBoard(gridSize, bombs)
  );

  const status = gameStatus(boardValues);
  const hasGameEnded = () => {
    return status === GameStatus.LOSS || status === GameStatus.WIN;
  };

  const handleReveal = (index: number) => {
    if (hasGameEnded()) return;

    const { revealed, flagged } = boardValues[index];
    if (revealed || flagged) return;

    setBoardValues((prev) => reveal(prev, index));
  };

  const handleFlagToggle = (index: number) => {
    if (hasGameEnded()) return;

    const { revealed } = boardValues[index];
    if (revealed) return;

    setBoardValues((prev) => toggleFlag(prev, index));
  };

  const resetGame = () => {
    setBoardValues(createBoard(gridSize, bombs));
  };

  return {
    boardValues,
    status,
    hasGameEnded,
    handleReveal,
    handleFlagToggle,
    resetGame
  };
};
