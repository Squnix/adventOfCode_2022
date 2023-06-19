import * as fs from "fs";
import readLine from "readline";
import events from "events";

const getMostCalories = async (dataStream: fs.ReadStream) => {
  let mostCalories = 0;
  let caloriesFromElf = 0;
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    if (line === "") {
      mostCalories =
        mostCalories > caloriesFromElf ? mostCalories : caloriesFromElf;
      caloriesFromElf = 0;
      return;
    }
    caloriesFromElf += parseInt(line); 
  });
  await events.once(rl, "close");
  return mostCalories;
};

export default getMostCalories;
