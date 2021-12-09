import * as fs from "fs";
import { arrayBuffer } from "stream/consumers";

type AcceptableChar = "a" | "b" | "c" | "d" | "e" | "f" | "g";
type AcceptableNum = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type AcceptableLen = 2 | 3 | 4 | 5 | 6 | 7;
export class Row {
  constructor(input: string[], results: string[]) {
    this.InputValues = input;
    this.ResultValues = results;
  }

  InputValues: string[];
  ResultValues: string[];
  AllValues: () => string[] = () => [...this.InputValues, ...this.ResultValues];
}

// final mapping
const finalMapping = new Map<string, string>();

const potentialsMapping = new Map<AcceptableChar, string[]>([
  ["a", []],
  ["b", []],
  ["c", []],
  ["d", []],
  ["e", []],
  ["f", []],
  ["g", []],
]);

const entryLengthToFinalNumber = new Map<AcceptableLen, AcceptableNum[]>([
  [2, [1]],
  [3, [7]],
  [4, [4]],
  [5, [2, 3, 5]],
  [6, [6, 9, 0]],
  [7, [8]],
]);

const finalNumberChars = new Map<AcceptableNum, AcceptableChar[]>([
  [0, ["a", "b", "c", "e", "f", "g"]],
  [1, ["c", "f"]],
  [2, ["a", "c", "d", "e", "g"]],
  [3, ["a", "c", "d", "f", "g"]],
  [4, ["b", "c", "d", "f"]],
  [5, ["a", "b", "d", "f", "g"]],
  [6, ["a", "b", "d", "e", "f", "g"]],
  [7, ["a", "c", "f"]],
  [8, ["a", "b", "c", "d", "e", "f", "g"]],
  [9, ["a", "b", "c", "d", "f", "g"]],
]);

function populateByLength(entries: string[]) {
  for (const entry of entries) {
    const finalNums = entryLengthToFinalNumber.get(
      entry.length as AcceptableLen
    )!;
    if (finalNums.length == 1) {
      const charsRepresentedByEntryChars = finalNumberChars.get(finalNums[0])!;
      const puzzleLetters = entry.split("");

      for (const char of charsRepresentedByEntryChars) {
        potentialsMapping.set(char, puzzleLetters);
      }
    }
  }
}

const rows = fs
  .readFileSync("testinput", "utf8")
  .split("\n")
  .map<Row>((line) => {
    const parts = line.split(" | ").map((part) => part.split(" "));
    return new Row(parts[0], parts[1]);
  });

//populatePotentials(rows[0], potentialsMapping);
console.log(potentialsMapping);
const uniqueEntries = rows[0]
  .AllValues()
  .filter(
    (val, idx, self) => self.findIndex((v) => v.length === val.length) === idx
  )
  .sort((a, b) => (a.length > b.length ? -1 : 1));

console.log(uniqueEntries);
populateByLength(uniqueEntries);
console.log(potentialsMapping);

const entriesWithOnePossibleResult = Array.from(
  entryLengthToFinalNumber.entries()
).filter((o) => o[1].length == 1);
// foreach pair of tuple (length,finalnumber[]) in entryLengthToFinalNumber where length == 1
// diff finalNumberChars[tuple1.finalNumber] + finalNumberChars[tuple2.finalNumber];
// some set of final chars ['a']
// diff uniqueEntries.Find(o => o.length == tuple1.length) + uniqueEntries.Find(o => o.length == tuple2.length);
// some set of untranslated chars ['c']
//foreach char in finalChars,
// potentialsMappings[char].filter(//remove items not in untranslated set)
// if potentialsMapping[char].length == 1 :)
for (let index = 0; index < entriesWithOnePossibleResult.length; index++) {
  for (let idx = 0; idx < entriesWithOnePossibleResult.length; idx++) {
    if (idx == index) {
      continue;
    }

    const tuple1 = entriesWithOnePossibleResult[idx];
    const tuple2 = entriesWithOnePossibleResult[index];

    const finalCharSet1 = finalNumberChars.get(tuple1[1][0])!;
    const finalCharSet2 = finalNumberChars.get(tuple2[1][0])!;

    // diff finalcharsets
    let difference = finalCharSet1
      .filter((x) => !finalCharSet2.includes(x))
      .concat(finalCharSet2.filter((x) => !finalCharSet1.includes(x)));

    const puzzleCharSet1 = uniqueEntries
      .find((o) => o.length == tuple1[0])!
      .split("");
    const puzzeCharSet2 = uniqueEntries
      .find((o) => o.length == tuple2[0])!
      .split("");

    let puzzleDiff = puzzleCharSet1
      .filter((x) => !puzzeCharSet2.includes(x))
      .concat(puzzeCharSet2.filter((x) => !puzzleCharSet1.includes(x)));

    for (const char of difference) {
      const potentials = potentialsMapping.get(char)!;
      const filteredPotentials = potentials?.filter((o) =>
        puzzleDiff.find((p) => o == p)
      );
      if (filteredPotentials.length == 1) {
        console.log("found " + filteredPotentials);
        excludeCharFromAllBut(filteredPotentials[0], char);
      }
      potentialsMapping.set(char, filteredPotentials);
    }
  }
}

console.log(potentialsMapping);

// foreach entryLengthToFinalNumber where length > 1
// diff each against the others
const entryLengthsWithMoreThanOnePossibleResult = Array.from(
  entryLengthToFinalNumber.entries()
).filter((o) => o[1].length > 1);

for (
  let index = 0;
  index < entryLengthsWithMoreThanOnePossibleResult.length;
  index++
) {
  // diff from final chars represented here
  const entryLengthToPossibleNumbers =
    entryLengthsWithMoreThanOnePossibleResult[index];
  const charSets = entryLengthToPossibleNumbers[1].map(
    (e) => finalNumberChars.get(e)!
  );
  const allChars = charSets.flatMap((cs) => cs);
  const finalCharDiff = charSets.flatMap((char) =>
    char.filter((c) => allChars.filter((ac) => ac == c).length == 1)
  );

  // diff from input chars represented here
  const inputsWithLength = uniqueEntries
    .filter((o) => o.length == entryLengthToPossibleNumbers[0])
    .map((o) => o.split(""));

  const allInputChars = inputsWithLength.flatMap((cs) => cs);
  const inputCharDiff = inputsWithLength.flatMap((char) =>
    char.filter((c) => allInputChars.filter((ac) => ac == c).length == 1)
  );

  for (const char of finalCharDiff) {
    const potentials = potentialsMapping.get(char)!;
    const filteredPotentials = potentials?.filter((o) =>
      inputCharDiff.find((p) => o == p)
    );
    if (filteredPotentials.length == 1) {
      console.log("found " + filteredPotentials);
      excludeCharFromAllBut(filteredPotentials[0], char);
    }
    potentialsMapping.set(char, filteredPotentials);
  }
}

console.log(potentialsMapping);

function excludeCharFromAllBut(char: string, except: string) {
  for (const iterator of Array.from(potentialsMapping.entries())) {
    if (iterator[0] !== except && iterator[1].find((o) => o == char)) {
      console.log(iterator[1].length);
      const filtered = iterator[1].filter((o) => o !== char);
      potentialsMapping.set(iterator[0], filtered);
      if (filtered.length == 1) {
        console.log("found " + filtered[0]);
        excludeCharFromAllBut(filtered[0], iterator[0]);
      }
    }
  }
}
