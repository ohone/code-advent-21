import * as fs from "fs";

// types

type coord = { row: number; column: number };

// functions

function getAdjacentPoints(point: coord): coord[] {
  return [
    { row: point.row - 1, column: point.column },
    { row: point.row + 1, column: point.column },
    { row: point.row, column: point.column - 1 },
    { row: point.row, column: point.column + 1 },
  ].filter((o) => {
    return (
      numbers[o.row] !== undefined && numbers[o.row][o.column] !== undefined
    );
  });
}

function basinAroundPoint(point: coord, currentBasin: coord[] = []): coord[] {
  const pointHeight = numbers[point.row][point.column];

  const higherAdjacentPoints = getAdjacentPoints(point)
    .filter(
      (o) => !currentBasin.some((e) => e.column == o.column && e.row == o.row)
    )
    .filter(
      (o) =>
        numbers[o.row][o.column] > pointHeight && numbers[o.row][o.column] !== 9
    );

  if (higherAdjacentPoints.length == 0) {
    return [];
  }
  var basinPoints = [...higherAdjacentPoints, ...currentBasin];
  return higherAdjacentPoints.flatMap((hap) => {
    const newPoints = [hap, ...basinAroundPoint(hap, basinPoints)];
    basinPoints = [...basinPoints, ...newPoints];
    return newPoints;
  });
}

function getLowpoints(grid: number[][]): coord[] {
  const lps = [];
  for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
    const row = grid[rowIndex];
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      const pointValue = row[columnIndex];

      const adjacents = getAdjacentPoints({
        row: rowIndex,
        column: columnIndex,
      });

      // if no adjacent are equal or lower
      if (!adjacents.some((o) => grid[o.row][o.column] <= pointValue)) {
        lps.push({ row: rowIndex, column: columnIndex });
      }
    }
  }
  return lps;
}

// script

var numbers = fs
  .readFileSync("input", "utf8")
  .split("\n")
  .map((s) => s.split("").map((char) => +char));

const lowpoints = getLowpoints(numbers);

const largest3Basins = lowpoints
  .map<coord[]>((lowPoint) => [
    lowPoint,
    ...basinAroundPoint(lowPoint, [lowPoint]),
  ])
  .sort((a, b) => (a.length > b.length ? -1 : 1))
  .slice(0, 3);

const answer = largest3Basins.reduce((a, b) => a * b.length, 1);
console.log(answer);
