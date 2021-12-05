import * as fs from "fs";

type coord = {
  x: number,
  y: number
}

type CoordCount = {
  coord: coord,
  count: number
}

// split each line into pair of coordinates
function parseLines(lineData: string[]): coord[][] {
  return lineData
    .map(o => o
      .split(' -> ')
      .map<coord>(rawCoord => {
        const splicoords = rawCoord.split(',');
        return {
          x: +splicoords[0], y: +splicoords[1]
        }
      })
    );
}

const lines = parseLines(fs.readFileSync("input", "utf8").split("\n"));

const allCoordinates: coord[] = lines
  // generate all coordinates from line start and ends
  .flatMap(o => {
    if (o[0].x == o[1].x) {
      const iter = o.sort((a, b) => a.y > b.y ? 1 : -1)
        .map(o => o.y);
      const resultCoord: coord[] = [];
      for (let i = iter[0]; i < iter[1] + 1; i++) {
        resultCoord.push({ x: o[0].x, y: i })
      }
      return resultCoord;
    }
    if (o[0].y == o[1].y) {
      const iter = o.sort((a, b) => a.x > b.x ? 1 : -1)
        .map(o => o.x);
      const resultCoord: coord[] = [];
      for (let i = iter[0]; i < iter[1] + 1; i++) {
        resultCoord.push({ x: i, y: o[0].y })
      }
      return resultCoord;
    }
    return []
  });

const result = allCoordinates
  // tally occurence of each coordinate
  .reduce((o, m) => {
    var res = o.filter(k => k.coord.x == m.x && k.coord.y == m.y);
    if (res.length > 0) {
      res[0].count++;
    }
    else {
      o.push({ coord: m, count: 1 })
    }
    return o;
  }, new Array<CoordCount>())
  .filter(o => o.count > 1);

console.log(result.length);