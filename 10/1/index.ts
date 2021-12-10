import * as fs from "fs";

const syntaxMap = new Map<string, string>([
  ["{", "}"],
  ["(", ")"],
  ["<", ">"],
  ["[", "]"],
]);

const openers = Array.from(syntaxMap.keys());

const scoreMap = new Map<string, number>([
  [")", 3],
  ["]", 57],
  ["}", 1197],
  [">", 25137],
]);

// takes row, return illegal character index
function processRow(row: string[]): number | undefined {
  const stack = [row[0]];
  for (let index = 1; index < row.length; index++) {
    const symbol = row[index];
    // if opening symbol, put on top of stack
    if (openers.some((o) => o == symbol)) {
      stack.push(symbol);
      continue;
    }

    // closing symbol, check top of stack for opener

    // peek stack
    const topVal = stack[stack.length - 1];
    // if current val is closing val for top of stack
    if (syntaxMap.get(topVal) === symbol) {
      stack.pop();
      continue;
    }

    console.log(
      `col:${index}: Expected ${syntaxMap.get(topVal)}, but found ${symbol} instead.`
    );
    return index;
  }
  return undefined;
}

var score = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .map((o) => o.split(""))
  .flatMap((o) => {
    const result = processRow(o);
    return result ? o[result] : [];
  })
  .map((char) => scoreMap.get(char)!)
  .reduce((a, b) => a + b);

console.log(score);
