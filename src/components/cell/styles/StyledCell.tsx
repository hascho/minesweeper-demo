import styled from "@emotion/styled";

import type { CellProps } from "../Cell.types";

type StyledProps = Pick<CellProps, "variant">;

export const StyledCell = styled.div<StyledProps>`
  border: 3px solid
    ${(props) => (props.variant === "faded" ? "hsla(0, 0%, 0%, 25%)" : "black")};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  user-select: none;
  font-family: "monospace";
  font-size: 16px;
`;
