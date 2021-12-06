import * as fs from "fs";

const createArray = () => new Array<number>(9).fill(0);

var fish = createArray();
const resetVal = 6;

fs.readFileSync("testinput", "utf8")
    .split(",")
    .map(o => +o)
    .forEach(n => fish[n]++);

const days = 256;

for (let day = 0; day < days; day++) {
    const newArray = createArray();

    // shift values down one
    for (let fishIndex = fish.length - 1; fishIndex > 0; fishIndex--) {
        newArray[fishIndex - 1] = fish[fishIndex];  
    }
    
    newArray[resetVal] += fish[0];
    newArray[newArray.length - 1] = fish[0];
    fish = newArray;
}

console.log(fish.reduce((agg,n) => agg + n, 0));