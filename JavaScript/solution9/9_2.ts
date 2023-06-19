import * as fs from "fs";
import readLine from "readline";
import events from "events";


const followAlong = (knots: knotPositionType[]) => {
  knots.reduce((H, T) => {
    if(H[0] - T[0] > 1 && H[1] - T[1] > 1) {
      T[0]++;
      T[1]++;
    } else if(T[0] - H[0] > 1 && H[1] - T[1] > 1) {
      T[0]--;
      T[1]++;
    } else if(H[0] - T[0] > 1 && T[1] - H[1] > 1) {
      T[0]++;
      T[1]--;
    } else if(T[0] - H[0] > 1 && T[1] - H[1] > 1) {
      T[0]--;
      T[1]--;
    } else if (H[1] - T[1] > 1) {
      T[0] = H[0];
      T[1]++;
    } else if (H[0] - T[0] > 1) {
      T[1] = H[1];
      T[0]++;
    } else if (T[0] - H[0] > 1) {
      T[1] = H[1];
      T[0]--;
    } else if (T[1] - H[1] > 1) {
      T[0] = H[0];
      T[1]--;
    }
    return T;
  });
};

const handleMove = (
  line: string,
  ropeKnots: knotPositionType[],
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
        ropeKnots[0][1]++;
        followAlong(ropeKnots);
        visitedForTheFirstTime += !checkIfVisited(ropeKnots[9], visited)
          ? 1
          : 0;
      }
      break;
    case "L":
      for (let i = 0; i < +amount; i++) {
        ropeKnots[0][0]--;
        followAlong(ropeKnots);
        visitedForTheFirstTime += !checkIfVisited(ropeKnots[9], visited)
          ? 1
          : 0;
      }
      break;
    case "R":
      for (let i = 0; i < +amount; i++) {
        ropeKnots[0][0]++;
        followAlong(ropeKnots);
        visitedForTheFirstTime += !checkIfVisited(ropeKnots[9], visited)
          ? 1
          : 0;
      }
      break;
    case "D":
      for (let i = 0; i < +amount; i++) {
        ropeKnots[0][1]--;
        followAlong(ropeKnots);
        visitedForTheFirstTime += !checkIfVisited(ropeKnots[9], visited)
          ? 1
          : 0;
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

type knotPositionType = [number, number];

const numberOfVisitedPoints = async (dataStream: fs.ReadStream) => {
  const ropeKnots = new Array<knotPositionType>;
  for(let i = 0; i < 10; i++) {
    ropeKnots[i] = [0, 0] as knotPositionType;
  }
  const visited: boolean[][] = [];
  let visitedAtLeastOnce = 0;
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    visitedAtLeastOnce += handleMove(line, ropeKnots, visited);
  });
  await events.once(rl, "close");
  return visitedAtLeastOnce;
};

export default numberOfVisitedPoints;
