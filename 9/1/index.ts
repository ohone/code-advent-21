import * as fs from "fs";

var numbers = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .map((s) => s.split("").map((char) => +char));

const lowPoints: [number, number][] = [];

for (let rowIndex = 0; rowIndex < numbers.length; rowIndex++) {
  const row = numbers[rowIndex];
  for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
    const pointValue = row[columnIndex];

    const comparitors = [
      numbers[rowIndex - 1] ? [numbers[rowIndex - 1][columnIndex]] : [],
      numbers[rowIndex + 1] ? [numbers[rowIndex + 1][columnIndex]] : [],
      row[columnIndex - 1] !== undefined ? [row[columnIndex - 1]] : [],
      row[columnIndex + 1] !== undefined ? [row[columnIndex + 1]] : [],
    ].flatMap((o) => o);

    // if no adjacent are equal or lower
    if (!comparitors.some((o) => o <= pointValue)) {
      lowPoints.push([rowIndex, columnIndex]);
    }
  }
}

const riskLevel = lowPoints
  .map((p) => numbers[p[0]][p[1]] + 1)
  .reduce((a, b) => a + b);

console.log(riskLevel);
