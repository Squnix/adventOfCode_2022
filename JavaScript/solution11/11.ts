import * as fs from "fs";
import readLine from "readline";
import events from "events";

type monkeyType = {
  activeIndex: number;
  startingItems: number[];
  operation: Array<number | string>;
  test: {
    condition: number;
    true: number;
    false: number;
  };
};

type availableStateMachineValues =
  | "number"
  | "items"
  | "operation"
  | "test"
  | "positive"
  | "negative";

type parsingStatusStateMachineType = {
  [key: string]: {
    id: availableStateMachineValues;
    nextState: availableStateMachineValues;
  };
};

const parsingStatusStateMachine: parsingStatusStateMachineType = {
  number: {
    id: "number",
    nextState: "items",
  },
  items: {
    id: "items",
    nextState: "operation",
  },
  operation: {
    id: "operation",
    nextState: "test",
  },
  test: {
    id: "test",
    nextState: "positive",
  },
  positive: {
    id: "positive",
    nextState: "negative",
  },
  negative: {
    id: "negative",
    nextState: "number",
  },
};

const temp = async (dataStream: fs.ReadStream) => {
  function startRound() {
    for (const monkey of monkeys) {
      for (const item of monkey.startingItems) {
        monkey.activeIndex++;
        const [first, operand, second] = monkey.operation;
        const firstParsed = first === -1 ? item : (first as number);
        const secondtParsed = second === -1 ? item : (second as number);
        let affectedWorryLevel = item;
        switch (operand) {
          case "*":
            affectedWorryLevel = firstParsed * secondtParsed;
            break;
          case "+":
            affectedWorryLevel = firstParsed + secondtParsed;
            break;
        }
        affectedWorryLevel = Math.floor(affectedWorryLevel / 3);
        if (affectedWorryLevel % monkey.test.condition === 0) {
          monkeys[monkey.test.true].startingItems.push(affectedWorryLevel);
        } else {
          monkeys[monkey.test.false].startingItems.push(affectedWorryLevel);
        }
      }
      monkey.startingItems = [];
    }
  }
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  const mostActiveMonkeysActiveIndex: number[] = [];
  function findMostActiveMonkeys() {
    for (const monkey of monkeys) {
      mostActiveMonkeysActiveIndex.push(monkey.activeIndex);
    }
    mostActiveMonkeysActiveIndex.sort((a, b) => b - a);
  }
  let round = 0;
  const monkeys: monkeyType[] = Array(7);
  let parsingStatus: keyof typeof parsingStatusStateMachine = "number";
  let currentMonkeyIndex = 0;
  rl.on("line", (line) => {
    if (line.length === 0) return;
    const trimmedLine = line.trim();
    const parsedLine = trimmedLine.split(" ");
    switch (parsingStatus) {
      case "number":
        currentMonkeyIndex = parseInt(parsedLine[1][0]);
        monkeys[currentMonkeyIndex] = {
          activeIndex: 0,
          startingItems: [],
          operation: [],
          test: {
            condition: 0,
            true: 0,
            false: 0,
          },
        };
        break;
      case "items":
        for (let i = 2; i < parsedLine.length; i++) {
          const number = parsedLine[i];
          const parsedNumber =
            number[number.length - 1] === ","
              ? number.slice(0, number.length - 1)
              : number;
          monkeys[currentMonkeyIndex].startingItems.push(
            parseInt(parsedNumber),
          );
        }
        break;
      case "operation":
        for (let i = 3; i < parsedLine.length; i++) {
          const lineValue =
            i !== 4
              ? parsedLine[i] === "old"
                ? -1
                : (parseInt(parsedLine[i]) as number)
              : parsedLine[i];
          monkeys[currentMonkeyIndex].operation.push(lineValue);
        }
        break;
      case "test":
        monkeys[currentMonkeyIndex].test.condition = parseInt(parsedLine[3]);
        break;
      case "positive":
        monkeys[currentMonkeyIndex].test.true = parseInt(parsedLine[5]);
        break;
      case "negative":
        monkeys[currentMonkeyIndex].test.false = parseInt(parsedLine[5]);
        break;
    }
    parsingStatus = parsingStatusStateMachine[parsingStatus].nextState;
  });
  await events.once(rl, "close");
  do {
    round++;
    startRound();
  } while (round < 20);
  findMostActiveMonkeys();
  return mostActiveMonkeysActiveIndex[0] * mostActiveMonkeysActiveIndex[1];
};

export default temp;
