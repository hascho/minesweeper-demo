import * as React from "react";

import { Game } from "./components/game";
import { StartMenu } from "./components/start-menu";

import { Mode, options } from "./constants";
import "./styles.css";

export default function App() {
  const [screen, setScreen] = React.useState("start");
  const [mode, setMode] = React.useState<string>(Mode.easy);

  const handleChangeMode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
  };

  const handleStartClick = () => {
    setScreen("game");
  };

  const handleBackToStartMenuClick = () => {
    setScreen("start");
  };

  const renderComponent = {
    start: (
      <StartMenu
        mode={mode}
        onChangeMode={handleChangeMode}
        onStartClick={handleStartClick}
      />
    ),
    game: (
      <Game
        {...options[Mode[mode as Mode]]}
        onBackClick={handleBackToStartMenuClick}
      />
    )
  }[screen];

  return <div className="App">{renderComponent}</div>;
}
