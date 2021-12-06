import * as fs from "fs";

var numbers = fs.readFileSync("input", "utf8").split(",").map(o => +o);

const days = 80;

for (let index = 0; index < days; index++) {
    numbers = numbers.flatMap(n => n === 0 ? [6,8] : --n);
}

console.log(numbers.length);