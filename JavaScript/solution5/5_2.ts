import * as fs from "fs";
import readLine from "readline";
import events from "events";

const getCargosFromLine = (line: string) => {
  const cargosInLine: (string | null)[] = [];
  for (let i = 1; i < line.length; i += 4) {
    if (line[i] === "1") break;
    if (line[i] === " ") {
      cargosInLine.push(null);
      continue;
    }
    cargosInLine.push(line[i]);
  }
  return cargosInLine;
};

const initialiseStack = (stack: [string[]], stacksToAdd: number) => {
  for (let i = 1; i < Math.ceil(stacksToAdd / 4); i++) {
    stack.push([]);
  }
};

const addToStack = (stack: [string[]], line: string) => {
  if (stack.length === 1) {
    initialiseStack(stack, line.length);
  }
  const cargos: (string | null)[] = getCargosFromLine(line);
  cargos.forEach((cargo, index) => {
    if (cargo) {
      stack[index].push(cargo);
    }
  });
};

const moveStack = (stack: [string[]], line: string) => {
  const instructions = line.split(" ");
  const quantity = +instructions[1];
  const cargo = stack[+instructions[3] - 1].splice(-quantity, quantity);
  if (typeof cargo === undefined) return;
  cargo.forEach((cargo) => {
    stack[+instructions[5] - 1].push(cargo as string);
  });
};

const getTopOfTheStacks = async (dataStream: fs.ReadStream) => {
  const stacks: [string[]] = [[]];
  let initialisationCompleted = false;
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    if (!initialisationCompleted) {
      if (line === "") {
        initialisationCompleted = true;
        stacks.forEach((stack) => {
          stack.reverse();
        });
        return;
      }
      addToStack(stacks, line);
    } else {
      moveStack(stacks, line);
    }
  });
  await events.once(rl, "close");
  return stacks.reduce(
    (prev, next) => prev + next[next.length ? next.length - 1 : 0],
    ""
  );
};

export default getTopOfTheStacks;
