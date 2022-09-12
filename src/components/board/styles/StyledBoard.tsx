import styled from "@emotion/styled";

type StyledBoardProps = {
  rows: number;
  columns: number;
};

export const StyledBoard = styled.div<StyledBoardProps>`
  display: grid;
  grid-template-rows: repeat(
    ${(props) => (Number.isInteger(props.rows) ? Math.max(8, props.rows) : 8)},
    45px
  );
  grid-template-columns: repeat(
    ${(props) =>
      Number.isInteger(props.columns) ? Math.max(8, props.columns) : 8},
    45px
  );
  gap: 6px;
`;
