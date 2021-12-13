import * as fs from "fs";

type fold = { axis: keyof point; value: number };
type point = { x: number; y: number };
const parts = fs.readFileSync("input", "utf8").split("\n\n");

function filterAlongFold(coords: point[], fold: fold) {
  const indicesToRemove: number[] = [];

  const foldingCoords = coords
    .map((o, i) => {
      return { point: o, index: i };
    })
    .filter((o) => o.point[fold.axis] > fold.value);

  foldingCoords.forEach((o) => {
    const newCoordinate = fold.value - (o.point[fold.axis] - fold.value);
    o.point[fold.axis] = newCoordinate;
    if (
      coords.filter((coord) => coord.x == o.point.x && coord.y == o.point.y)
        .length > 1
    ) {
      indicesToRemove.push(o.index);
    }
  });

  indicesToRemove
    .sort((a, b) => (a > b ? -1 : 1))
    .forEach((index) => coords.splice(index, 1));
}

function printCode(points: point[], xRes: number, yRes: number) {
  for (let y = 0; y < yRes + 1; y++) {
    for (let x = 0; x < xRes + 1; x++) {
      const pointIndex = points.findIndex((o) => o.x == x && o.y == y);
      if (pointIndex == -1) {
        process.stdout.write(".");
      } else {
        process.stdout.write("#");
        points.splice(pointIndex, 1);
      }
    }
    console.log("");
  }
}

const gamePoints = parts[0].split("\n").map((pt) => {
  const split = pt.split(",");
  return { x: +split[0], y: +split[1] };
});

const folds = parts[1].split("\n").map<fold>((desc) => {
  const bits = desc.split("=");
  const axis = bits[0][bits[0].length - 1];
  const value = +bits[1];
  return { axis: axis as keyof point, value };
});

console.log(gamePoints.length);

const maxValues: Map<string, number> = new Map<string, number>([
  ["x", 0],
  ["y", 0],
]);
folds.forEach((fold) => {
  maxValues.set(fold.axis, fold.value - 1);
  filterAlongFold(gamePoints, fold);
});

printCode(gamePoints, maxValues.get("x")!, maxValues.get("y")!);
