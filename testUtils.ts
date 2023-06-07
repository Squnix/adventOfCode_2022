import * as fs from "fs";

export function createStreamFromFile(path: string): fs.ReadStream {
  const stream = fs.createReadStream(path, { encoding: "utf8" });
  stream.setEncoding("utf8");
  return stream;
}

export async function meassureDuration(
  callback: Function,
  dataStream: fs.ReadStream,
  name: string
) {
  console.time(name);
  const result = await callback(dataStream);
  console.timeEnd(name);
  dataStream.close();
  return result;
}
