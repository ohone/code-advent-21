import * as fs from "fs";

const commands = fs.readFileSync("input", "utf8").split("\n");
let horizontal = 0;
let depth = 0;
commands.forEach((o) => {
  const items = o.split(" ");
  switch (items[0]) {
    case "down":
      depth += +items[1];
      break;
    case "up":
      depth -= +items[1];
      break;
    case "forward":
      horizontal += +items[1];
      break;
  }
});

console.log(horizontal * depth);
