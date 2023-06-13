import * as fs from "fs";
import readLine from "readline";
import events from "events";

const totalSpace = 70000000;
const neededSpace = 30000000;

type filetype = number;

type directoryType = {
  [name: string]: directoryType | filetype;
};

type diskMapType = {
  currentDir: {
    path: string[];
    reference: directoryType | undefined;
  };
  diskMap: directoryType;
};

enum commandsType {
  cd = "cd",
  ls = "ls",
}

const handleDirectoryChange = (diskMap: diskMapType, route: string) => {
  if (route === "..") {
    diskMap.currentDir.path.pop();
    diskMap.currentDir.reference = diskMap.currentDir.path.reduce(
      (currentPath: undefined | directoryType, nextPath: string) => {
        if (currentPath === undefined) {
          return diskMap.diskMap[nextPath] as directoryType;
        }
        return currentPath[nextPath] as directoryType;
      },
      undefined
    );
    return;
  }
  diskMap.currentDir.path.push(route);
  diskMap.currentDir.reference = diskMap.currentDir.reference
    ? (diskMap.currentDir.reference[route] as directoryType)
    : (diskMap.diskMap["/"] as directoryType);
};

const executeCommand = (diskMap: diskMapType, line: string) => {
  const keys = line.split(" ");
  keys.shift();
  switch (keys[0]) {
    case commandsType.cd:
      handleDirectoryChange(diskMap, keys[1]);
      return false;
    case commandsType.ls:
    default:
      break;
  }
};

const commandChar = "$";

const parseLine = (diskMap: diskMapType, line: string) => {
  if (line[0] === commandChar) {
    executeCommand(diskMap, line);
    return;
  }
  const path = line.split(" ");
  if (diskMap.currentDir.reference) {
    if (path[0] === "dir") {
      diskMap.currentDir.reference[path[1]] = {};
      return;
    }
    diskMap.currentDir.reference[path[1]] = +path[0];
  }
};

const getSizeRecusively = (
  reference: directoryType,
  calculatedSizes: number[],
  uncalculatedSizes: number[]
) => {
  Object.keys(reference).forEach((path) => {
    const temp = reference[path];
    if (typeof temp === "number") {
      uncalculatedSizes = uncalculatedSizes.map((size) => size + temp);
    }
  });
  Object.keys(reference).forEach((path) => {
    const temp = reference[path];
    if (typeof temp !== "number") {
      uncalculatedSizes.push(0);
      uncalculatedSizes = getSizeRecusively(
        temp,
        calculatedSizes,
        uncalculatedSizes
      );
    }
  });
  uncalculatedSizes.length && calculatedSizes.push(uncalculatedSizes.pop() as number);
  return uncalculatedSizes;
};

const calculateSizes = (diskMap: diskMapType): number[] => {
  const sizes: number[] = [];
  const tempSizes: number[] = [];
  getSizeRecusively(diskMap.diskMap, sizes, tempSizes);
  return sizes;
};

const sizesSum = async (dataStream: fs.ReadStream) => {
  const diskMap: diskMapType = {
    currentDir: {
      path: [],
      reference: undefined,
    },
    diskMap: {
      "/": {},
    },
  };
  const rl = readLine.createInterface({
    input: dataStream,
    crlfDelay: Infinity,
  });
  rl.on("line", (line) => {
    parseLine(diskMap, line);
  });
  await events.once(rl, "close");
  const sizes: number[] = calculateSizes(diskMap);
  const spaceToFree = neededSpace - (totalSpace - sizes[sizes.length - 1]);
  const bigEnoughtDirectories = sizes.filter((size) => {
    return size > spaceToFree ? true : false
  });
  return bigEnoughtDirectories.reduce((previousSize, nextSize) => {
    return nextSize < previousSize ? nextSize : previousSize;
  });
};

export default sizesSum;
