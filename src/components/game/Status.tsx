import { GameStatus } from "../../utils/minesweeper/types";

type Props = {
  status: GameStatus;
};

export const Status = (props: Props) => {
  const { status } = props;
  return (
    <>
      {status === GameStatus.WIN && <p>win</p>}
      {status === GameStatus.LOSS && <p>loss</p>}
    </>
  );
};
