import * as fs from "fs";

const commands = fs.readFileSync("input", "utf8").split("\n");

const rowCounts : number[] = [];

// iterate rows
for (let index = 0; index < commands.length; index++) {
  // iterate digits in row
  for (let charIndex = 0; charIndex < commands[index].length; charIndex++) {
    // get digit
    let numb = +commands[index][charIndex];

    if (rowCounts[charIndex]){
      rowCounts[charIndex] += numb;
    }
    else{
      rowCounts[charIndex] = numb;
    }
  }
}

const binary : boolean[] = [];

const half = commands.length / 2;
for (const num of rowCounts) {
  binary.push(num > half);
}

console.log(binary);

let gammaRate : number = 0;
let epsilonRate : number = 0;

for (let index = 0; index < binary.length; index++) {
  const power = binary.length -1 - index;
  const amount = Math.pow(2, power);
  
  if (binary[index]){ // if 1
    gammaRate += amount;
  }
  else{
    epsilonRate += amount;
  }
}

console.log(gammaRate * epsilonRate);