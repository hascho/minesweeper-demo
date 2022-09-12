import * as React from "react";

import { StyledCell } from "./styles/StyledCell";
import type { CellProps } from "./Cell.types";

export const Cell = (props: CellProps): React.ReactElement => {
  const { className, variant, value, onClick, onContextMenu } = props;

  const handleClick = () => {
    onClick();
  };

  const handleRightClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    onContextMenu();
  };

  return (
    <StyledCell
      className={className}
      variant={variant}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >
      {value}
    </StyledCell>
  );
};
