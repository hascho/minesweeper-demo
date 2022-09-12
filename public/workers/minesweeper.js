const R = require("ramda");

const isBomb = R.propEq("value", "B");

const revealBombLocations = (cells) => {
  return cells.map((cellState) =>
    cellState.value === "B" ? { ...cellState, revealed: true } : cellState
  );
};

const bombsCount = (cells) => {
  const _bombsCount = R.count(isBomb);
  return _bombsCount(cells);
};

const findNeighbourCellIndices = (cellsLength, sourceIndex, gridDimension) => {
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

const reveal = (cells, cellIndex) => {
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

  if (value === "B") {
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
    const revealNeighbour = R.curry((neighbourIndex) =>
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

self.onmessage = (e) => {
  const [message, cells, cellIndex] = e;
  if (message === "reveal") {
    const revealedSquares = reveal(cells, cellIndex);
    self.postMessage(revealedSquares);
  }
};
