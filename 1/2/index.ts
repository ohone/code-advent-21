import * as fs from "fs";

const numbers = fs.readFileSync("input", "utf8").split("\n");
let prevSum = undefined;
let count = 0;
for (let current = 2; current < numbers.length; current++) {
  const sum = numbers
    .slice(current - 2, current + 1)
    .reduce((sum, i) => sum + +i, 0);

  if (prevSum && sum > prevSum) {
    count++;
  }
  prevSum = sum;
}

console.log(count);
