import * as fs from "fs";
import readLine from "readline";
import events from "events";

const getTopThreeCalories = async (dataStream: fs.ReadStream) => {
  const topThree: [number, number, number] = [0, 0, 0];
  let elfTotal = 0;
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    if (line === "") {
      if (topThree[2] < elfTotal) {
        topThree[2] = elfTotal;
        topThree.sort((a, b) => {
          if (a > b) {
            return -1;
          }
          if (a < b) {
            return 1;
          }
          return 0;
        });
      }
      elfTotal = 0;
    } else {
      elfTotal += parseInt(line);
    }
  });
  await events.once(rl, "close");
  return topThree.reduce((prev, curr) => {
    return prev + curr;
  }, 0);
};

export default getTopThreeCalories;
