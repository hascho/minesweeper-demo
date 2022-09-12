import styled from "@emotion/styled";

import { Cell } from "../Cell";

export const StyledRoundedCell = styled(Cell)`
  border-radius: 50%;
  background-color: ${(props) => props.bgColor};
  border-color: ${(props) =>
    props.variant === "outlined" ? "hsl(347, 77%, 45%)" : undefined};
`;
