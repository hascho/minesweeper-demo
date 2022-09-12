export enum Mode {
  easy = "easy",
  medium = "medium",
  hard = "hard"
}

export const options = {
  [Mode.easy]: { gridSize: 8, bombs: 10 },
  [Mode.medium]: { gridSize: 16, bombs: 40 },
  [Mode.hard]: { gridSize: 24, bombs: 90 }
} as const;
