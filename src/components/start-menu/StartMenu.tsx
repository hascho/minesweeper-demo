type StartMenuProps = {
  mode?: string;
  onChangeMode: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onStartClick: () => void;
};

export const StartMenu = (props: StartMenuProps) => {
  const { mode, onChangeMode, onStartClick } = props;

  return (
    <div>
      <h1>start menu</h1>
      <select value={mode} onChange={onChangeMode}>
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
      <button onClick={onStartClick}>start</button>
    </div>
  );
};
