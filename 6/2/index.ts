import * as fs from "fs";

var fish = [0,0,0,0,0,0,0,0,0]
const resetVal = 6;
fs.readFileSync("testinput", "utf8").split(",").map(o => +o).forEach(n => { fish[n] = ++fish[n]; });

const days = 256;

for (let day = 0; day < days; day++) {
    const newArray : number[] = [0,0,0,0,0,0,0,0,0];

    // shift values down one
    for (let fishIndex = fish.length - 1; fishIndex > 0; fishIndex--) {
        newArray[fishIndex - 1] = fish[fishIndex];  
    }
    
    newArray[resetVal] += fish[0];
    newArray[newArray.length - 1] = fish[0];
    fish = newArray;
}

console.log(fish.reduce((agg,n) => agg + n, 0));