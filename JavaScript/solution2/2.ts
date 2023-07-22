import * as fs from "fs";
import readLine from "readline";
import events from "events";

enum ShapesNames {
  ROCK = "ROCK",
  PAPER = "PAPER",
  SCISSORS = "SCISSORS",
}

enum gameResults {
  WIN = "WIN",
  DRAW = "DRAW",
  LOSE = "LOSE",
}

const ElfShapes = {
  A: ShapesNames.ROCK,
  B: ShapesNames.PAPER,
  C: ShapesNames.SCISSORS,
};

const PlayerShapes = {
  X: ShapesNames.ROCK,
  Y: ShapesNames.PAPER,
  Z: ShapesNames.SCISSORS,
};

type ElfShape = keyof typeof ElfShapes;
type PlayerShape = keyof typeof PlayerShapes;

const points = {
  [ShapesNames.ROCK]: 1,
  [ShapesNames.PAPER]: 2,
  [ShapesNames.SCISSORS]: 3,
  [gameResults.LOSE]: 0,
  [gameResults.DRAW]: 3,
  [gameResults.WIN]: 6,
};

function calculatePoints(game: [ElfShape, PlayerShape]): number {
  let tempPoints = 0;
  tempPoints += points[PlayerShapes[game[1]]];
  if (
    (ElfShapes[game[0]] === ShapesNames.ROCK &&
      PlayerShapes[game[1]] === ShapesNames.PAPER) ||
    (ElfShapes[game[0]] === ShapesNames.PAPER &&
      PlayerShapes[game[1]] === ShapesNames.SCISSORS) ||
    (ElfShapes[game[0]] === ShapesNames.SCISSORS &&
      PlayerShapes[game[1]] === ShapesNames.ROCK)
  ) {
    tempPoints += points[gameResults.WIN];
  } else if (
    (ElfShapes[game[0]] === ShapesNames.ROCK &&
      PlayerShapes[game[1]] === ShapesNames.ROCK) ||
    (ElfShapes[game[0]] === ShapesNames.PAPER &&
      PlayerShapes[game[1]] === ShapesNames.PAPER) ||
    (ElfShapes[game[0]] === ShapesNames.SCISSORS &&
      PlayerShapes[game[1]] === ShapesNames.SCISSORS)
  ) {
    tempPoints += points[gameResults.DRAW];
  } else if (
    (ElfShapes[game[0]] === ShapesNames.ROCK &&
      PlayerShapes[game[1]] === ShapesNames.PAPER) ||
    (ElfShapes[game[0]] === ShapesNames.PAPER &&
      PlayerShapes[game[1]] === ShapesNames.SCISSORS) ||
    (ElfShapes[game[0]] === ShapesNames.SCISSORS &&
      PlayerShapes[game[1]] === ShapesNames.ROCK)
  ) {
    tempPoints += points[gameResults.LOSE];
  }
  return tempPoints;
}

const calculateResult = async (dataStream: fs.ReadStream) => {
  let points = 0;
  const nextGame: [ElfShape | undefined, PlayerShape | undefined] = [
    undefined,
    undefined,
  ];
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    if (line[0] in ElfShapes && line[2] in PlayerShapes) {
      nextGame[0] = line[0] as ElfShape;
      nextGame[1] = line[2] as PlayerShape;
      points += calculatePoints(nextGame as [ElfShape, PlayerShape]);
    } else {
      throw new Error(`Not implemented value in line: ${line}`);
    }
  });
  await events.once(rl, "close");
  return points;
};

export default calculateResult;
