import * as fs from "fs";
import readLine from "readline";
import events from "events";

const temp = async (dataStream: fs.ReadStream) => {
  let xValue = 1;
  const cycleNumbersToParse = [20, 60, 100, 140, 180, 220];
  let currentCycleNumberIndexToParse = 0;
  let cycle = 0;
  const valuesParsed: number[] = [];
  let valueToAdd: number | null = null;
  function incrementxValue() {
    if (valueToAdd !== null) {
      xValue += valueToAdd;
      valueToAdd = null;
    }
  }
  function checkIfReadyToParse() {
    if (cycle === cycleNumbersToParse[currentCycleNumberIndexToParse]) {
      valuesParsed.push(cycle * xValue);
      currentCycleNumberIndexToParse++;
    }
  }
  function idleCycle() {
    checkIfReadyToParse();
    cycle++;
    incrementxValue();
  }
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    checkIfReadyToParse();
    const command = line.split(" ");
    if (command[0] === "addx") {
      incrementxValue();
      valueToAdd = parseInt(command[1]);
      cycle++;
      idleCycle();
      return;
    }
    cycle++;
  });
  await events.once(rl, "close");
  return valuesParsed.reduce((acc, val) => acc + val);
};

export default temp;
