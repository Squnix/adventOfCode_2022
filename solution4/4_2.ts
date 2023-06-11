import * as fs from "fs";
import readLine from "readline";
import events from "events";

const checkIfOverlaping = (pair: [string, string]): boolean => {
  const firstRange = pair[0].split("-").map((range) => +range);
  const secondRange = pair[1].split("-").map((range) => +range);
  return !(firstRange[0] > secondRange[1] || secondRange[0] > firstRange[1]);
};

const GetOverlapingPairs = async (dataStream: fs.ReadStream) => {
  let overlapingPairs = 0;
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    overlapingPairs += checkIfOverlaping(line.split(",") as [string, string])
      ? 1
      : 0;
  });
  await events.once(rl, "close");
  return overlapingPairs;
};

export default GetOverlapingPairs;
