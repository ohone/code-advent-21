import * as fs from "fs";
import { exit } from "process";

type Card = Square[][];

class Square {
  constructor(value: number) {
    this.Value = value;
  }
  Checked: boolean = false;
  Value: number

  public toString = (): string => {
    return `[${this.Value},${this.Checked}]`
  }
}

function generateCards(input: string[]): Card[] {
  const result: Card[] = [];

  var currentCard: Card = [];
  for (const iterator of input) {
    if (iterator == "") {
      if (currentCard.length > 0) {
        result.push(currentCard);
        currentCard = [];
      }
      continue;
    }

    const numbers = iterator.split(' ').filter(o => o !== '').flatMap(o => { return new Square(+o) });
    currentCard.push(numbers);
  }

  result.push(currentCard);

  return result;
}

function updateCards(cards: Card[], piece: number): void {
  cards.forEach((card) => {
    card.forEach((row) => {
      row.forEach((square) => {
        if (square.Value === piece) {
          square.Checked = true;
        }
      })
    })
  });
}

function checkCard(card: Card): boolean {
  // check rows
  for (const row of card) {
    if (row.filter(o => o.Checked).length == row.length) {
      return true;
    }
  }

  // check columns
  for (let column = 0; column < card[0].length; column++) {
    for (let row = 0; row < card.length; row++) {
      if (!card[row][column].Checked) {
        break;
      }

      if (row === card.length - 1) {
        return true;
      }
    }
  }
  return false;
}

function getWinningCardIndices(cards: Card[]): number[]{
  return cards
  .flatMap((card,index) => { return {index: index, card : card}})
  .filter(card => checkCard(card.card))
  .flatMap(card => card.index);
}

function resultFromCard(card: Card, number: number) {
  return card
    .flatMap(o => o
      .filter(p => !p.Checked)
      .flatMap(f => f.Value))
    .reduce((acc, item) => acc + item, 0) * number;
}

const gamedata = fs.readFileSync("testinput", "utf8").split("\n");
const game = gamedata[0].split(',').flatMap(o => +o);

let cards = generateCards(gamedata.slice(1));

var lastNumber : number | undefined;
for (const number of game) {
  lastNumber = number;
  
  // check boxes
  updateCards(cards, number);
  
  if (cards.length == 1){
    break;
  }

  // get index of winners
  // and remove from set
  getWinningCardIndices(cards)
    .sort((a,b) => a > b ? -1 : 1)
    .forEach(index => cards.splice(index, 1));
}

console.log(resultFromCard(cards[0], lastNumber!));