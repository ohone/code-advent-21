import * as fs from "fs";

type Coordinate = {
  x: number,
  y: number
}

type CoordCount = {
  Coord: Coordinate,
  Count: number
}

// split each line into pair of coordinates
function parseLines(lineData: string[]): Coordinate[][] {
  return lineData
    .map(o => o
      .split(' -> ')
      .map<Coordinate>(rawCoord => {
        const splitCoords = rawCoord.split(',');
        return {
          x: +splitCoords[0], y: +splitCoords[1]
        }
      })
    );
}

function isHorizontalLine(start: Coordinate, end: Coordinate): boolean {
  return start.y == end.y;
}

function isVerticalLine(start: Coordinate, end: Coordinate): boolean {
  return start.x == end.x;
}

function isDiagonalLine(start: Coordinate, end: Coordinate): boolean {
  return Math.abs((start.y - end.y) / (start.x - end.x)) == 1;
}

function parseDiagonal(coords: Coordinate[]): Coordinate[] {
  const coordinatesSortedByX = coords.sort((a, b) => a.x > b.x ? 1 : -1);

  const yiterator = coordinatesSortedByX[1].y > coordinatesSortedByX[0].y
    ? (y: number) => ++y
    : (y: number) => --y;

  const result: Coordinate[] = [];
  let y = coordinatesSortedByX[0].y;
  for (var x = coordinatesSortedByX[0].x; x < coordinatesSortedByX[1].x + 1; x++) {
    result.push({ x, y });
    y = yiterator(y);
  }
  return result;
}

const lines = parseLines(fs.readFileSync("input", "utf8").split("\n"));

const allCoordinates: Coordinate[] = lines
  // generate all coordinates from line start and ends
  .flatMap(o => {
    if (isVerticalLine(o[0], o[1])) {
      const iter = o.sort((a, b) => a.y > b.y ? 1 : -1)
        .map(o => o.y);
      const resultCoord: Coordinate[] = [];
      for (let i = iter[0]; i < iter[1] + 1; i++) {
        resultCoord.push({ x: o[0].x, y: i })
      }
      return resultCoord;
    }
    if (isHorizontalLine(o[0], o[1])) {
      const iter = o.sort((a, b) => a.x > b.x ? 1 : -1)
        .map(o => o.x);
      const resultCoord: Coordinate[] = [];
      for (let i = iter[0]; i < iter[1] + 1; i++) {
        resultCoord.push({ x: i, y: o[0].y })
      }
      return resultCoord;
    }
    if (isDiagonalLine(o[0], o[1])) {
      return parseDiagonal([o[0], o[1]]);
    }
    return []
  });

const result = allCoordinates
  // tally occurence of each coordinate
  .reduce((aggregate, m) => {
    var res = aggregate.filter(k => k.Coord.x == m.x && k.Coord.y == m.y)[0];
    if (res) {
      res.Count++;
    }
    else {
      aggregate.push({ Coord: m, Count: 1 })
    }
    return aggregate;
  }, new Array<CoordCount>())
  .filter(o => o.Count > 1);

console.log(result.length);