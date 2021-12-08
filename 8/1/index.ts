import * as fs from "fs";

const part1 = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .flatMap((line) => line.split(" | ")[1].split(' '))
  .filter(
    (o) => o.length === 2 || o.length === 3 || o.length === 4 || o.length === 7
  ).length;

console.log(part1);
