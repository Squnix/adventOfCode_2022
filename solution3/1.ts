import * as fs from 'fs';
import readLine from 'readline';
import events from 'events';

const findError = (compartmentOne: string[], compartmentTwo: string[]): string => {
  let errorType = "";
  compartmentTwo.forEach((item) => {
    if(compartmentOne.includes(item)) {
      errorType = item;
      return;
    } 
  });
  return errorType;
}

const getPriorityValue = (errorType: string): number => {
  if(errorType.charCodeAt(0) >= 0x61 && errorType.charCodeAt(0) <= 0x7a) {
    return errorType.charCodeAt(0) - 0x60;
  } else {
    return errorType.charCodeAt(0) - 0x40 + 26;
  };
};

const calculatePriorities = async (dataStream: fs.ReadStream) => {
  let prioritiesResult = 0;
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  })
  rl.on("line", (line) => {
    const compartmentOne = line.slice(0, line.length / 2).split("");
    const compartmentTwo = line.split("");
    const errorType = findError(compartmentOne, compartmentTwo);
    prioritiesResult += getPriorityValue(errorType);
  });
  await events.once(rl, "close");
  return prioritiesResult;
}

export default calculatePriorities;
