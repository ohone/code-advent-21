import * as fs from "fs";

const syntaxMap = new Map<string, string>([
  ["{", "}"],
  ["(", ")"],
  ["<", ">"],
  ["[", "]"],
]);

const inverseSyntaxMap = new Map<string, string>([
  ["{", "}"],
  ["(", ")"],
  ["<", ">"],
  ["[", "]"],
]);

const openers = Array.from(syntaxMap.keys());

const scoreMap = new Map<string, number>([
  [")", 1],
  ["]", 2],
  ["}", 3],
  [">", 4],
]);

// takes row, return illegal character index
function processRow(row: string[]): string[] {
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
      `col:${index}: Expected ${syntaxMap.get(
        topVal
      )}, but found ${symbol} instead.`
    );
    // corrupted row
    return [];
  }

  const autoCompleted : string[] = [];
  // got to the end of an incomplete row
  while(stack.length > 0){
    autoCompleted.push(inverseSyntaxMap.get(stack.pop()!)!)
  }
  return autoCompleted;
}

const calculateScore = (inputs : number[]) =>
  inputs.reduce((agg,num) => (agg * 5) + num , 0)


var scores = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .map((o) => processRow(o.split("")))
  .filter(o => o.length > 0)
  .map(row => calculateScore(row.map(char => scoreMap.get(char)!)))
  .sort((a,b) => a > b ? -1 : 1)

console.log(scores[Math.floor(scores.length / 2)])