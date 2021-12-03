import * as fs from "fs";

const binaryArray = inputToBools(fs.readFileSync("input", "utf8").split("\n"));

function inputToBools(input: string[]) : boolean[][]{
  const result : boolean[][] = [];
  for (let row = 0; row < input.length; row++) {
    result[row] = binaryStringToBooleanArray(input[row])
  }
  return result;
}

function binaryStringToBooleanArray(input: string) : boolean[]{
  const arr : boolean[] = [];
  for (let col = 0; col < input.length; col++) {
    arr.push(!!+input[col])
  }
  return arr;
}


function filterInput(input: boolean[][], column: number = 0, lower : boolean = true) : boolean[]{
  if (input.length == 1){
    return input[0];
  }
  const half = input.length / 2;
  const positiveRowsCount = input.filter(o => o[column]).length;
  if (positiveRowsCount >= half){
    return filterInput(input.filter(o => o[column] !== lower), ++column, lower);
  } else {
    return filterInput(input.filter(o => o[column] === lower), ++column, lower);
  }
}

function binaryToDecimal(binary: boolean[]): number {
  let result = 0;
  for (let index = 0; index < binary.length; index++) {
    const power = binary.length - 1 - index;
    const amount = Math.pow(2, power);

    if (binary[index]) {
      result += amount;
    };
  }
  return result;
}

const o2 = binaryToDecimal(filterInput(Object.assign([], binaryArray),0,false));
const co2 = binaryToDecimal(filterInput(binaryArray,0,true));

console.log(o2 * co2);
