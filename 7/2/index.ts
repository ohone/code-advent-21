import * as fs from "fs";

let vars = fs
    .readFileSync("input", "utf8")
    .split(",")
    .map(o => +o)
    .sort((a,b) => a > b ? -1 : 1);

const largestDisplacement = vars[0];

// tally of positions ([position] = count)
let tally = new Array<number>(largestDisplacement + 1).fill(0);
// populate tally
vars.forEach(o => tally[o]++);

// tally of gas costs per final position ([final position] = total gas cost)
const gasCosts = new Array<number>(largestDisplacement + 1).fill(0);

// save cost per distance to save recalculation
const distanceCosts = new Array<number>(largestDisplacement + 1);

// for each position in tally, calculate gas cost to get there
for (let costsToIndex = 0; costsToIndex < tally.length; costsToIndex++) {
    for (let costsFromIndex = 0; costsFromIndex < tally.length; costsFromIndex++) {
        // if we're calculating costs from the same index to the same index, skip
        // if there are no crabs in this position to consume gas, skip
        if (costsToIndex == costsFromIndex || tally[costsFromIndex] == 0){
            continue;
        }

        const distance = Math.abs(costsFromIndex - costsToIndex);

        // check if we've already calculated the gas for this distance
        if (!distanceCosts[distance]){
            // if not, calculate and add for later use
            const distanceCost = (distance * (distance + 1)) / 2;
            distanceCosts[distance] = distanceCost;
        }
        gasCosts[costsToIndex] += distanceCosts[distance] * tally[costsFromIndex];
    }
}

var indexOfSmallest = 0;
for (let index = 1; index < gasCosts.length; index++) {
    if (gasCosts[index] < gasCosts[indexOfSmallest]){
        indexOfSmallest = index;
    }
}
console.log(gasCosts[indexOfSmallest]);
