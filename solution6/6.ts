import * as fs from "fs";
import events from "events";

const updateMarker = (marker: string[], signal: string) => {
  const repetableIndex = marker.indexOf(signal);
  if (repetableIndex !== -1) {
    marker.splice(0, repetableIndex + 1);
  }
  marker.push(signal);
};

const getSignalsQuantityBeforeMarker = async (dataStream: fs.ReadStream) => {
  const marker: string[] = [];
  let characterProcessed = 0;
  dataStream.on("readable", () => {
    let signal;
    do {
      signal = dataStream.read(1);
      if (signal) {
        characterProcessed++;
        updateMarker(marker, signal as string);
      }
      if (marker.length >= 4) break;
    } while (signal !== null);
    dataStream.close();
  });
  await events.once(dataStream, "close");
  return characterProcessed;
};

export default getSignalsQuantityBeforeMarker;
