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

filterAlongFold(gamePoints, folds[0]);

console.log(gamePoints.length);
