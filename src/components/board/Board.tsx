import { Values } from "../../utils/minesweeper/constants";
import { displayValue } from "../../utils/minesweeper/utils";

import { Cell, StyledRoundedCell } from "../cell";

import { StyledBoard } from "./styles/StyledBoard";
import type { BoardProps } from "./Board.types";

export const Board = (props: BoardProps) => {
  const { rows, columns, values, handleReveal, handleFlagToggle } = props;

  return (
    <StyledBoard rows={rows} columns={columns}>
      {values.map((cellState, index) => {
        const cellProps = {
          key: index,
          value: displayValue(cellState),
          onClick: () => handleReveal(index),
          onContextMenu: () => handleFlagToggle(index)
        };
        const { value } = cellProps;

        if (typeof value === "number") {
          return <StyledRoundedCell {...cellProps} />;
        }

        const component = {
          [Values.Empty]: <Cell {...cellProps} variant="faded" />,
          [Values.Flagged]: (
            <Cell {...cellProps} className="spinner spinner_highlighted" />
          ),
          [Values.Bomb]: (
            <StyledRoundedCell
              {...cellProps}
              variant="outlined"
              bgColor="black"
            />
          ),
          [Values.Initial]: <Cell {...cellProps} className="spinner " />
        }[value];

        return component;
      })}
    </StyledBoard>
  );
};
