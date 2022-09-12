import * as R from "ramda";

import { Values } from "./constants";
import { GameStatus } from "./types";
import type { CellState } from "./types";

export const generateNumbers = (
  quantity: number,
  upperLimit: number
): Set<number> => {
  function* randomNumber() {
    while (true) {
      yield Math.floor(Math.random() * upperLimit);
    }
  }
  const rng = randomNumber();
  const numbers: Set<number> = new Set();
  do {
    numbers.add(Number(rng.next().value));
  } while (numbers.size < quantity);
  return numbers;
};

export const createBoard = (
  dimension: number,
  totalBombs: number
): CellState[] => {
  const MIN_DIMENSION_SIZE = 8;
  const MIN_NUMBER_OF_CELLS = Math.pow(MIN_DIMENSION_SIZE, 2);

  const numberOfCells =
    dimension > MIN_DIMENSION_SIZE
      ? dimension * dimension
      : MIN_NUMBER_OF_CELLS;
  const bombLocations = generateNumbers(totalBombs, numberOfCells);

  return [...Array(numberOfCells).keys()].map((i) => ({
    revealed: false,
    flagged: false,
    value: bombLocations.has(i) ? Values.Bomb : Values.Empty
  }));
};

export const displayValue = (cell: CellState) => {
  const { revealed, flagged, value } = cell;
  if (!revealed && !flagged) return Values.Initial;
  if (!revealed && flagged) return Values.Flagged;
  return value;
};

export const toggleFlag = (
  cells: CellState[],
  cellIndex: number
): CellState[] => {
  return cells.map((cellState, i) =>
    i === cellIndex
      ? { ...cellState, revealed: false, flagged: !cellState.flagged }
      : cellState
  );
};

export const revealBombLocations = (cells: CellState[]): CellState[] => {
  return cells.map((cellState) =>
    cellState.value === Values.Bomb
      ? { ...cellState, revealed: true }
      : cellState
  );
};

const isRevealed = R.propEq("revealed", true);
const isFlagged = R.propEq("flagged", true);
const isBomb = R.propEq("value", Values.Bomb);

const filterByBombs = R.filter(isBomb);
const filterBySafeCells = R.filter(R.compose(R.not, isBomb));

export const isBombRevealed = (cells: CellState[]): boolean => {
  const _isBombRevealed = R.compose(R.any(isRevealed), filterByBombs);
  return _isBombRevealed(cells);
};

export const bombsCount = (cells: CellState[]): number => {
  const _bombsCount = R.count(isBomb);
  return _bombsCount(cells);
};

export const findNeighbourCellIndices = (
  cellsLength: number,
  sourceIndex: number,
  gridDimension: number
) => {
  /**
   *   NW    N         NE
   *    \    |        /
   * W -- sourceIndex -- E
   *    /    |        \
   *   SW    S         SE
   */

  const N = sourceIndex - gridDimension;
  const NW =
    sourceIndex > gridDimension &&
    sourceIndex < cellsLength &&
    sourceIndex % gridDimension !== 0
      ? N - 1
      : -1;
  const NE =
    sourceIndex >= gridDimension &&
    sourceIndex <= cellsLength - 1 &&
    sourceIndex % gridDimension <= gridDimension - 2
      ? N + 1
      : -1;
  const S = sourceIndex + gridDimension;
  const SE =
    sourceIndex >= 0 &&
    sourceIndex < cellsLength - 1 - gridDimension &&
    sourceIndex % gridDimension <= gridDimension - 2
      ? S + 1
      : -1;
  const SW =
    sourceIndex > 0 &&
    sourceIndex <= cellsLength - 1 - gridDimension &&
    sourceIndex % gridDimension !== 0
      ? S - 1
      : -1;
  const E =
    sourceIndex >= 0 &&
    sourceIndex < cellsLength - 1 &&
    sourceIndex % gridDimension <= gridDimension - 2
      ? sourceIndex + 1
      : -1;
  const W =
    sourceIndex > 0 &&
    sourceIndex < cellsLength &&
    sourceIndex % gridDimension !== 0
      ? sourceIndex - 1
      : -1;
  return [NW, N, NE, E, SE, S, SW, W].filter((i) => i >= 0 && i < cellsLength);
};

export const reveal = (cells: CellState[], cellIndex: number): CellState[] => {
  // 1. if it contains a bomb
  //    a. return new CellState[] with all bomb locations revealed
  //    b. end game
  // 2. if it contains an empty
  //    a. return new CellState[] where:
  //        1. connected cells are revealed if it is empty and not flagged and not a bomb
  //        2. empty cells where a neighbour cell contains a bomb should indicate number of bombs nearby

  const { revealed, flagged, value } = cells[cellIndex];

  if (revealed || flagged) {
    return cells;
  }

  if (value === Values.Bomb) {
    return revealBombLocations(cells);
  }

  // reveal current cell
  const cellsWithCurrentCellRevealed = cells.map((cellState, i) =>
    i === cellIndex ? { ...cellState, revealed: true } : cellState
  );
  // const cellsWithCurrentCellRevealed = R.update(
  //   cellIndex,
  //   { ...cells[cellIndex], revealed: true },
  //   cells
  // );

  const gridDimension = Math.sqrt(cells.length);
  const neighbourCellIndices = findNeighbourCellIndices(
    cellsWithCurrentCellRevealed.length,
    cellIndex,
    gridDimension
  );
  const neighbourCells = neighbourCellIndices.map(
    (i) => cellsWithCurrentCellRevealed[i]
  );
  const nearbyBombsCount = bombsCount(neighbourCells);
  if (nearbyBombsCount === 0) {
    const revealNeighbour = R.curry((neighbourIndex: number) =>
      R.partialRight(reveal, [neighbourIndex])
    );
    const revealNeighbours = R.pipe(
      /* @ts-ignore */
      ...R.map(revealNeighbour, neighbourCellIndices)
    );
    return revealNeighbours(cellsWithCurrentCellRevealed);
  } else {
    return cellsWithCurrentCellRevealed.map((cellState, i) =>
      i === cellIndex ? { ...cellState, value: nearbyBombsCount } : cellState
    );
  }
};

const hasFlaggedAllBombs = (cells: CellState[]): boolean => {
  const _hasFlaggedAllBombs = R.compose(R.all(isFlagged), filterByBombs);
  return _hasFlaggedAllBombs(cells);
};

const hasRevealedAllSafeCells = (cells: CellState[]): boolean => {
  const _hasRevealedAllSafeCells = R.compose(
    R.all(isRevealed),
    filterBySafeCells
  );
  return _hasRevealedAllSafeCells(cells);
};

export const gameStatus = (cells: CellState[]): GameStatus => {
  if (isBombRevealed(cells)) {
    return GameStatus.LOSS;
  } else if (hasFlaggedAllBombs(cells) && hasRevealedAllSafeCells(cells)) {
    return GameStatus.WIN;
  }
  return GameStatus.UNDETERMINED;
};
