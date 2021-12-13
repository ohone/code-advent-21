import * as fs from "fs";

type fold = { axis: string; value: number };
type point = { x: number; y: number };
const parts = fs.readFileSync("input", "utf8").split("\n\n");

function filterAlongFold(coords: point[], fold: fold) {
  const indicesToRemove: number[] = [];

  if (fold.axis == "x") {
    const foldingCoords = coords
      .map((o, i) => {
        return { point: o, index: i };
      })
      .filter((o) => o.point.x > fold.value);

    foldingCoords.forEach((o) => {
      const newX = fold.value - (o.point.x - fold.value);
      if (coords.some((coord) => coord.x == newX && coord.y == o.point.y)) {
        indicesToRemove.push(o.index);
      } else {
        o.point.x = newX;
      }
    });
  } else {
    const foldingCoords = coords
      .map((o, i) => {
        return { point: o, index: i };
      })
      .filter((o) => o.point.y > fold.value);

    foldingCoords.forEach((o) => {
      const newY = fold.value - (o.point.y - fold.value);
      if (coords.some((coord) => coord.y == newY && coord.x == o.point.x)) {
        indicesToRemove.push(o.index);
      } else {
        o.point.y = newY;
      }
    });
  }

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
  return { axis, value };
});

console.log(gamePoints.length);
filterAlongFold(gamePoints, folds[0]);

console.log(gamePoints.length);
