import * as fs from "fs";

const commands = fs.readFileSync("input", "utf8").split("\n");
let aim = 0;
let horizontal = 0;
let depth = 0;
commands.forEach((o) => {
  const items = o.split(" ");
  switch (items[0]) {
    case "down":
      aim += +items[1];
      break;
    case "up":
      aim -= +items[1];
      break;
    case "forward":
      let value = +items[1];
      horizontal += value;
      depth += aim * value;
      break;
  }
});

console.log(horizontal * depth);
