import * as fs from "fs";

type coord = { row: number; column: number };

function getAdjacentPoints(point: coord, grid: number[][]): coord[] {
  return [
    { row: point.row - 1, column: point.column },
    { row: point.row + 1, column: point.column },
    { row: point.row - 1, column: point.column - 1 },
    { row: point.row - 1, column: point.column + 1 },
    { row: point.row + 1, column: point.column + 1 },
    { row: point.row + 1, column: point.column - 1 },
    { row: point.row, column: point.column - 1 },
    { row: point.row, column: point.column + 1 },
  ].filter((o) => {
    return grid[o.row] !== undefined && grid[o.row][o.column] !== undefined;
  });
}

function canFlash(point: coord, rows: number[][], alreadyFlashed: coord[]) {
  const above9 = rows[point.row][point.column] > 9;
  const fristFlash = !alreadyFlashed.some(
    (o) => o.row === point.row && o.column === point.column
  );

  return above9 && fristFlash;
}

const rows = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .map((o) => o.split("").map((n) => +n));
var flashCount = 0;
for (var tick = 0; tick < 100; tick++) {
  const flashesToPropogate: coord[] = [];

  // update values
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      row[colIndex]++;
      if (row[colIndex] > 9) {
        flashesToPropogate.push({ row: rowIndex, column: colIndex });
      }
    }
  }

  // propogateFlashes
  const flashedThisTick: coord[] = [...flashesToPropogate];
  while (flashesToPropogate.length > 0) {
    const flashed = flashesToPropogate.pop()!;
    const adjacent = getAdjacentPoints(flashed, rows);
    adjacent.forEach((ajd) => {
      // increment value
      rows[ajd.row][ajd.column]++;
      if (canFlash(ajd, rows, flashedThisTick)) {
        flashesToPropogate.push(ajd);
        flashedThisTick.push(ajd);
      }
    });
  }

  // set flashed to 0
  while (flashedThisTick.length > 0) {
    const flashed = flashedThisTick.pop()!;
    rows[flashed.row][flashed.column] = 0;
    flashCount++;
  }
}

console.log(flashCount);
