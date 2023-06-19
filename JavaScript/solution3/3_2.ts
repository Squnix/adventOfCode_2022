import * as fs from "fs";
import readLine from "readline";
import events from "events";

const getPriorityValue = (errorType: string): number => {
  if (errorType.charCodeAt(0) >= 0x61 && errorType.charCodeAt(0) <= 0x7a) {
    return errorType.charCodeAt(0) - 0x60;
  } else {
    return errorType.charCodeAt(0) - 0x40 + 26;
  }
};

const temp = async (dataStream: fs.ReadStream) => {
  let prioritiesResult = 0;
  let typeMap: string[] = [];
  let foundTypes = new Set<string>();
  let groupIndex = 0;
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    if (groupIndex === 0) {
      typeMap = line.split("");
    } else if (groupIndex === 1) {
      line.split("").forEach((type) => {
        if (typeMap.includes(type)) {
          foundTypes.add(type);
        }
      });
    } else if(groupIndex === 2) {
      line.split("").forEach((type) => {
        if (foundTypes.has(type)) {
          prioritiesResult += getPriorityValue(type);
          foundTypes = new Set();
          return;
        }
      });
    }
    groupIndex = groupIndex === 2 ? 0 : ++groupIndex;
  });
  await events.once(rl, "close");
  return prioritiesResult;
};

export default temp;
