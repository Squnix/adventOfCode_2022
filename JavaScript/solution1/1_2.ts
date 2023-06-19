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
      if (topThree[0] < elfTotal) {
        topThree[0] = elfTotal;
        topThree.sort((a, b) => {
          return a - b;
        });
      }
      elfTotal = 0;
      return;
    }
    const calories = parseInt(line);
    if (isNaN(calories))
      return new Error(`NaN from parsing line to int: ${line}`);
    elfTotal += calories;
  });
  await events.once(rl, "close");
  return topThree.reduce((prev, curr) => {
    return prev + curr;
  });
};

export default getTopThreeCalories;
