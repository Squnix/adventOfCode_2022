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

const updateGrid = (
  height: number,
  y: number,
  x: number,
  gridCopy: number[][]
) => {
  gridCopy[y][x] = height;
};

const checkIfTreeVisible = (
  treeHeight: number,
  y: number,
  x: number,
  gridCopy: Array<Array<number>>
): boolean => {
  if (
    x === 0 ||
    x === gridCopy[0].length - 1 ||
    y === 0 ||
    y === gridCopy.length - 1
  )
    return true;
  if (treeHeight === 0) return false;
  let isVisible = false;
  for (let i = 0; i < 4; i++) {
    const direction = directions[i];
    let treeToCompare: number;
    let [tempX, tempY] = [x, y];
    directions: switch (direction) {
      case directionsType.up:
        treeToCompare = gridCopy[0][x];
        if (treeHeight > treeToCompare) {
          updateGrid(treeHeight, 0, x, gridCopy);
          isVisible = true;
        }
        break;
      case directionsType.left:
        treeToCompare = gridCopy[y][0];
        if (treeHeight > treeToCompare) {
          updateGrid(treeHeight, y, 0, gridCopy);
          isVisible = true;
        }
        break;
      case directionsType.right:
        if (isVisible) break;
        while (++tempX < gridCopy[y].length) {
          treeToCompare = gridCopy[y][tempX];
          if (treeHeight <= treeToCompare) {
            break directions;
          }
        }
        isVisible = true;
        break;
      case directionsType.down:
        if (isVisible) break;
        while (++tempY < gridCopy[y].length) {
          treeToCompare = gridCopy[tempY][x];
          if (treeHeight <= treeToCompare) {
            break directions;
          }
        }
        isVisible = true;
        break;
      default:
        break;
    }
  }
  return isVisible;
};

const getNumberOfVisibleTrees = async (dataStream: fs.ReadStream) => {
  let visibleTrees = 0;
  const grid: Array<Array<number>> = [];
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    grid.push(line.split("").map((height) => parseInt(height)));
  });
  await events.once(rl, "close");
  const gridCopy = [...grid];
  grid.forEach((row, rowIndex) => {
    row.forEach((tree, treeInRowIndex) => {
      visibleTrees += checkIfTreeVisible(
        tree,
        rowIndex,
        treeInRowIndex,
        gridCopy
      )
        ? 1
        : 0;
    });
  });
  return visibleTrees;
};

export default getNumberOfVisibleTrees;
