import * as fs from "fs";

const binaryArray = fs.readFileSync("input", "utf8").split("\n");

function filterBinaryArray(
  characterIndex: number = 0,
  binaryNumbers: string[],
  mostCommon: boolean
): string {

  // get indexes of rows with '1'
  const positiveBitRowsIndices: number[] = [];
  for (let index = 0; index < binaryNumbers.length; index++) {
    if (+binaryNumbers[index][characterIndex]) {
      positiveBitRowsIndices.push(index);
    }
  }

  // decide on comparison (are we interested in most frequent or least frequent)
  const comparitor = mostCommon
    ? positiveBitRowsIndices.length >= binaryNumbers.length / 2
    : positiveBitRowsIndices.length <= binaryNumbers.length / 2;

  // if comparison matches
  if (comparitor) {
    filterOutRowsAt(positiveBitRowsIndices, binaryNumbers);
  } else {
    // create new array from positive rows
    const newBinary = [];
    for (let index = positiveBitRowsIndices.length - 1; index > -1; index--) {
      newBinary.push(binaryNumbers[positiveBitRowsIndices[index]]);
    }
    binaryNumbers = newBinary;
  }

  // completion condition
  if (binaryNumbers.length == 1) {
    return binaryNumbers[0];
  }

  // recurse on new set of rows, on next character along
  return filterBinaryArray(++characterIndex, binaryNumbers, mostCommon);
}

function filterOutRowsAt<T>(rowsToRemove : number[], removeFrom : Array<T>){
      // filter out positive rows from array
      for (let index = removeFrom.length - 1; index > -1; index--) {
        removeFrom.splice(rowsToRemove[index], 1);
      }
}

function filterOutRowsExcluding<T>(rowsToRemove: number[], removeFrom : Array<T>){
    // create new array from positive rows
    const newBinary = [];
    for (let index = rowsToRemove.length - 1; index > -1; index--) {
      newBinary.push(removeFrom[rowsToRemove[index]]);
    }
    removeFrom = newBinary;
}

function binaryToDecimal(binary: string): number {
  let result = 0;
  for (let index = 0; index < binary.length; index++) {
    const power = binary.length - 1 - index;
    const amount = Math.pow(2, power);

    if (+binary[index]) {
      result += amount;
    };
  }
  return result;
}

const binaryArrayCopy = Object.assign([], binaryArray);
const oxygen = binaryToDecimal(filterBinaryArray(0, binaryArrayCopy, true));
const co2 = binaryToDecimal(filterBinaryArray(0, binaryArray, false));

console.log(oxygen);
console.log(co2);

console.log(oxygen * co2);
