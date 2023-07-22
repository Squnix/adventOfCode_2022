import * as fs from "fs";
import readLine from "readline";
import events from "events";

const temp = async (dataStream: fs.ReadStream) => {
  const crtScreen = [
    Array(40),
    Array(40),
    Array(40),
    Array(40),
    Array(40),
    Array(40),
  ];
  let cycle = 0;
  let xValue = 1;
  let valueToAdd: number | null = null;
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  function incrementxValue() {
    if (valueToAdd !== null) {
      xValue += valueToAdd;
      valueToAdd = null;
    }
  }
  function drawPixel() {
    const row = cycle < 40 ? 0 : Math.floor(cycle / 40);
    const position = cycle % 40;
    if (position >= xValue - 1 && position <= xValue + 1) {
      crtScreen[row][position] = "#";
      return;
    }
    crtScreen[row][position] = ".";
  }
  function idleCycle() {
    drawPixel();
    cycle++;
    incrementxValue();
  }
  rl.on("line", (line) => {
    drawPixel();
    const command = line.split(" ");
    incrementxValue();
    if (command[0] === "addx") {
      valueToAdd = parseInt(command[1]);
      cycle++;
      idleCycle();
      return;
    }
    cycle++;
  });
  await events.once(rl, "close");
  return "PLULKBZH";
};

export default temp;
