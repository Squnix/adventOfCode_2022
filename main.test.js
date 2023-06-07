import * as utils from "./testUtils";
import { expect, test } from "vitest";
import solution1 from "./solution1/1";
import solution1_2 from "./solution1/1_2";
import solution2 from "./solution2/2";

test("First puzzle", async () => {
  const stream = utils.createStreamFromFile("./data/1.txt");
  expect(
    await utils.meassureDuration(solution1, stream, "Solution 1, part one")
  ).toBe(75622);
});
test("First puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/1.txt");
  expect( await utils.meassureDuration(solution1_2, stream, "Solution 1, part two")).toBe(213159);
});

test("Second puzzle", async () => {
  const stream = utils.createStreamFromFile("./data/2.txt");
  expect(await utils.meassureDuration(solution2, stream, "Solution 2")).toBe(11906);
});
