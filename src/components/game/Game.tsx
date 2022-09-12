import * as React from "react";

import { Board } from "../board";

import { Container } from "./styles/Container";
import { ActionsContainer } from "./styles/ActionsContainer";
import { Status } from "./Status";
import { useGame } from "./useGame";

import type { GameProps } from "./Game.types";

export const Game = (props: GameProps) => {
  const { gridSize, bombs, onBackClick } = props;
  const {
    boardValues,
    status,
    hasGameEnded,
    handleReveal,
    handleFlagToggle,
    resetGame
  } = useGame(gridSize, bombs);

  return (
    <Container>
      <Status status={status} />
      <Board
        rows={gridSize}
        columns={gridSize}
        values={boardValues}
        handleReveal={handleReveal}
        handleFlagToggle={handleFlagToggle}
      />
      <ActionsContainer>
        {hasGameEnded() && (
          <>
            <button onClick={resetGame}>reset</button>
            <button onClick={onBackClick}>main menu</button>
          </>
        )}
      </ActionsContainer>
    </Container>
  );
};
