import * as fs from "fs";
import readLine from "readline";
import events from "events";

const handleMove = (
  line: string,
  H: number[],
  T: number[],
  visited: boolean[][]
): number => {
  let visitedForTheFirstTime = 0;
  const [direction, amount] = line.split(" ");
  if (!direction || !amount) {
    console.log("Error parsing line: ", line);
    return 0;
  }
  switch (direction) {
    case "U":
      for (let i = 0; i < +amount; i++) {
        H[1]++;
        if (H[1] - T[1] > 1) {
          T[0] = H[0];
          T[1]++;
          visitedForTheFirstTime += !checkIfVisited(T, visited) ? 1 : 0;
        }
      }
      break;
    case "L":
      for (let i = 0; i < +amount; i++) {
        H[0]--;
        if (T[0] - H[0] > 1) {
          T[1] = H[1];
          T[0]--;
          visitedForTheFirstTime += !checkIfVisited(T, visited) ? 1 : 0;
        }
      }
      break;
    case "R":
      for (let i = 0; i < +amount; i++) {
        H[0]++;
        if (H[0] - T[0] > 1) {
          T[1] = H[1];
          T[0]++;
          visitedForTheFirstTime += !checkIfVisited(T, visited) ? 1 : 0;
        }
      }
      break;
    case "D":
      for (let i = 0; i < +amount; i++) {
        H[1]--;
        if (T[1] - H[1] > 1) {
          T[0] = H[0];
          T[1]--;
          visitedForTheFirstTime += !checkIfVisited(T, visited) ? 1 : 0;
        }
      }
      break;
    default:
      break;
  }
  return visitedForTheFirstTime;
};

const checkIfVisited = (T: number[], visited: boolean[][]): boolean => {
  const [x, y] = T;
  if (visited[x] === undefined) {
    visited[x] = [];
    visited[x][y] = true;
    return false;
  } else if (!visited[x][y]) {
    visited[x][y] = true;
    return false;
  }
  return true;
};

const temp = async (dataStream: fs.ReadStream) => {
  const T = [0, 0],
    H = [0, 0];
  const visited: boolean[][] = [];
  let visitedAtLeastOnce = 0;
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    visitedAtLeastOnce += handleMove(line, H, T, visited);
  });
  await events.once(rl, "close");
  return visitedAtLeastOnce;
};

export default temp;
