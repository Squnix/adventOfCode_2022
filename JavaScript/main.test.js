import * as utils from "./testUtils";
import { expect, test } from "vitest";
import solution1 from "./solution1/1";
import solution1_2 from "./solution1/1_2";
import solution2 from "./solution2/2";
import solution2_2 from "./solution2/2_2";
import solution3 from "./solution3/3";
import solution3_2 from "./solution3/3_2";
import solution4 from "./solution4/4";
import solution4_2 from "./solution4/4_2";
import solution5 from "./solution5/5";
import solution5_2 from "./solution5/5_2";
import solution6 from "./solution6/6";
import solution6_2 from "./solution6/6_2";
import solution7 from "./solution7/7";
import solution7_2 from "./solution7/7_2";
import solution8 from "./solution8/8";
import solution8_2 from './solution8/8_2';
import solution9 from './solution9/9';
import solution9_2 from './solution9/9_2';

test("First puzzle part 1", async () => {
  const stream = utils.createStreamFromFile("./data/1.txt");
  expect(
    await utils.meassureDuration(solution1, stream, "Solution 1, part one")
  ).toBe(75622);
});

test("First puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/1.txt");
  expect(
    await utils.meassureDuration(solution1_2, stream, "Solution 1, part two")
  ).toBe(213159);
});

test("Second puzzle part 1", async () => {
  const stream = utils.createStreamFromFile("./data/2.txt");
  expect(
    await utils.meassureDuration(solution2, stream, "Solution 2, part one")
  ).toBe(11906);
});

test("Second puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/2.txt");
  expect(
    await utils.meassureDuration(solution2_2, stream, "Solution 2, part two")
  ).toBe(11186);
});

test("Third puzzle part 1", async () => {
  const stream = utils.createStreamFromFile("./data/3.txt");
  expect(
    await utils.meassureDuration(solution3, stream, "Solution 3, part one")
  ).toBe(7742);
});

test("Third puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/3.txt");
  expect(
    await utils.meassureDuration(solution3_2, stream, "Solution 3, part two")
  ).toBe(2276);
});

test("Fourth puzzle part 1", async () => {
  const stream = utils.createStreamFromFile("./data/4.txt");
  expect(
    await utils.meassureDuration(solution4, stream, "Solution 4, part one")
  ).toBe(456);
});

test("Fourth puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/4.txt");
  expect(
    await utils.meassureDuration(solution4_2, stream, "Solution 4, part two")
  ).toBe(808);
});

test("Fifth puzzle part 1", async () => {
  const stream = utils.createStreamFromFile("./data/5.txt");
  expect(
    await utils.meassureDuration(solution5, stream, "Solution 5, part one")
  ).toBe("TLNGFGMFN");
});

test("Fifth puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/5.txt");
  expect(
    await utils.meassureDuration(solution5_2, stream, "Solution 5, part two")
  ).toBe("FGLQJCMBD");
});

test("Sixth puzzle part 1", async () => {
  const stream = utils.createStreamFromFile("./data/6.txt");
  expect(
    await utils.meassureDuration(solution6, stream, "Solution 6, part one")
  ).toBe(1987);
});

test("Sixth puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/6.txt");
  expect(
    await utils.meassureDuration(solution6_2, stream, "Solution 6, part two")
  ).toBe(3059);
});

test("Seventh puzzle part 1", async () => {
  const stream = utils.createStreamFromFile("./data/7.txt");
  expect(
    await utils.meassureDuration(solution7, stream, "Solution 7, part one")
  ).toBe(1297159);
});

test("Seventh puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/7.txt");
  expect(
    await utils.meassureDuration(solution7_2, stream, "Solution 7, part two")
  ).toBe(3866390);
});

test("Eighth puzzle part 1", async () => {
  const stream = utils.createStreamFromFile("./data/8.txt");
  expect(
    await utils.meassureDuration(solution8, stream, "Solution 8, part one")
  ).toBe(1829);
});

test("Eighth puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/8.txt");
  expect(
    await utils.meassureDuration(solution8_2, stream, "Solution 8, part two")
  ).toBe(291840);
});

test("Ninth puzzle part 1", async () => {
  const stream = utils.createStreamFromFile("./data/9.txt");
  expect(
    await utils.meassureDuration(solution9, stream, "Solution 9, part one")
  ).toBe(5513);
});

test("Ninth puzzle part 2", async () => {
  const stream = utils.createStreamFromFile("./data/9.txt");
  expect(
    await utils.meassureDuration(solution9_2, stream, "Solution 9, part two")
  ).toBe(2427);
});
