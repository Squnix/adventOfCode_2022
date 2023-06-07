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

const Shapes = {
  A: ShapesNames.ROCK,
  B: ShapesNames.PAPER,
  C: ShapesNames.SCISSORS,
  X: ShapesNames.ROCK,
  Y: ShapesNames.PAPER,
  Z: ShapesNames.SCISSORS,
};

type Shape = keyof typeof Shapes;

const points = {
  [ShapesNames.ROCK]: 1,
  [ShapesNames.PAPER]: 2,
  [ShapesNames.SCISSORS]: 3,
  [gameResults.LOSE]: 0,
  [gameResults.DRAW]: 3,
  [gameResults.WIN]: 6,
};

function calculatePoints(game: [Shape, Shape]): number {
  let tempPoints = 0;
  tempPoints += points[Shapes[game[1]]];
  if (
    (Shapes[game[0]] === ShapesNames.ROCK &&
      Shapes[game[1]] === ShapesNames.PAPER) ||
    (Shapes[game[0]] === ShapesNames.PAPER &&
      Shapes[game[1]] === ShapesNames.SCISSORS) ||
    (Shapes[game[0]] === ShapesNames.SCISSORS &&
      Shapes[game[1]] === ShapesNames.ROCK)
  ) {
    tempPoints += points[gameResults.WIN];
  } else if (
    (Shapes[game[0]] === ShapesNames.ROCK &&
      Shapes[game[1]] === ShapesNames.ROCK) ||
    (Shapes[game[0]] === ShapesNames.PAPER &&
      Shapes[game[1]] === ShapesNames.PAPER) ||
    (Shapes[game[0]] === ShapesNames.SCISSORS &&
      Shapes[game[1]] === ShapesNames.SCISSORS)
  ) {
    tempPoints += points[gameResults.DRAW];
  } else if (
    (Shapes[game[0]] === ShapesNames.ROCK &&
      Shapes[game[1]] === ShapesNames.PAPER) ||
    (Shapes[game[0]] === ShapesNames.PAPER &&
      Shapes[game[1]] === ShapesNames.SCISSORS) ||
    (Shapes[game[0]] === ShapesNames.SCISSORS &&
      Shapes[game[1]] === ShapesNames.ROCK)
  ) {
    tempPoints += points[gameResults.LOSE];
  }
  return tempPoints;
}

const calculateResult = async (dataStream: fs.ReadStream) => {
  let points = 0;
  const nextGame: [Shape, Shape] = ["A", "A"];
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    nextGame[0] = line[0] as Shape;
    nextGame[1] = line[2] as Shape;
    points += calculatePoints(nextGame);
  });
  await events.once(rl, "close");
  return points;
};

export default calculateResult;
