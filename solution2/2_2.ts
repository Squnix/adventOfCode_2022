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
};

const ExpectedResults = {
  X: gameResults.LOSE,
  Y: gameResults.DRAW,
  Z: gameResults.WIN,
};

type Shape = keyof typeof Shapes;
type ExpectedResult = keyof typeof ExpectedResults;

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
  tempPoints += points[ExpectedResults[game[1]]];
  if(ExpectedResults[game[1]] === gameResults.LOSE) {
    if(Shapes[game[0]] === ShapesNames.ROCK) {
      tempPoints = points[gameResults.WIN];
    } else if(Shapes[game[0]] === ShapesNames.PAPER) {
      tempPoints = points[gameResults.LOSE];
    } else if(Shapes[game[0]] === ShapesNames.SCISSORS) {
      tempPoints = points[gameResults.DRAW];
    }
  } else if (ExpectedResults[game[1]] === gameResults.DRAW) {
  
  } else {

  }
  return tempPoints;
}

const calculateResult = async (stream: fs.ReadStream) => {
  let points = 0;
  const nextGame: [Shape, Shape] = ["A", "A"];
  const rl = readLine.createInterface({
    input: stream,
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
