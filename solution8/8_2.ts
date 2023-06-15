import * as fs from "fs";
import readLine from "readline";
import events from "events";

enum directionsType {
  up = "up",
  left = "left",
  right = "right",
  down = "down",
}
const directions: directionsType[] = [
  directionsType.up,
  directionsType.left,
  directionsType.right,
  directionsType.down,
];

const calculateSceningScore = (
  treeHeight: number,
  y: number,
  x: number,
  grid: Array<Array<number>>
): number => {
  let sceningScoresForTree: number[] = [];
  for (let i = 0; i < 4; i++) {
    const direction = directions[i];
    let treeToCompare: number;
    let [tempX, tempY] = [x, y];
    let treeCount = 0;
    directions: switch (direction) {
      case directionsType.up:
        while (--tempY >= 0) {
          treeToCompare = grid[tempY][x];
          if (treeHeight >= treeToCompare) {
            treeCount++;
            if(treeHeight === treeToCompare) break directions;
          } 
        }
        break;
      case directionsType.left:
        while (--tempX >= 0) {
          treeToCompare = grid[y][tempX];
          if (treeHeight >= treeToCompare) {
            treeCount++;
            if(treeHeight === treeToCompare) break directions;
          }
        }
        break;
      case directionsType.right:
        while (++tempX < grid[y].length) {
          treeToCompare = grid[y][tempX];
          if (treeHeight >= treeToCompare) {
            treeCount++;
            if(treeHeight === treeToCompare) break directions;
          } 
        }
        break;
      case directionsType.down:
        while (++tempY < grid[y].length) {
          treeToCompare = grid[tempY][x];
          if (treeHeight >= treeToCompare) {
            treeCount++;
            if(treeHeight === treeToCompare) break directions;
          } 
        }
        break;
      default:
        break;
    };
    sceningScoresForTree.push(treeCount);
  }
  return sceningScoresForTree.reduce((prev, next) => next * prev);
};

const getNumberOfVisibleTrees = async (dataStream: fs.ReadStream) => {
  let highestScenicScore = 0;
  const grid: Array<Array<number>> = [];
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    grid.push(line.split("").map((height) => parseInt(height)));
  });
  await events.once(rl, "close");
  grid.forEach((row, rowIndex) => {
    row.forEach((tree, treeInRowIndex) => {
      const sceningScore = calculateSceningScore(
        tree,
        rowIndex,
        treeInRowIndex,
        grid
      );
      highestScenicScore =
        highestScenicScore > sceningScore ? highestScenicScore : sceningScore;
    });
  });
  return highestScenicScore;
};

export default getNumberOfVisibleTrees;
