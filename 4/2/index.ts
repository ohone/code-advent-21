import * as fs from "fs";
import { CLIENT_RENEG_WINDOW } from "tls";

type Card = Square[][];
interface CardAggregation {
  Cards: Card[],
  Current: Card
}
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
  return input.reduce<CardAggregation>((agg, o) => {
    if (o == "") {
      if (agg.Current.length > 0) {
        agg.Cards.push(agg.Current);
        agg.Current = [];
      }
      return agg;
    }
    const numbers = o.split(' ').filter(o => o !== '').flatMap(o => { return new Square(+o) });
    agg.Current.push(numbers);
    return agg;
  }, { Cards: [], Current: [] })
    .Cards;
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
  if (card.filter(row => row.filter(square => square.Checked).length == row.length).length > 0) {
    return true;
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

function getWinningCardIndices(cards: Card[]): number[] {
  return cards
    .map((card, index) => { return { index: index, card: card } })
    .filter(card => checkCard(card.card))
    .map(card => card.index);
}

function resultFromCard(card: Card, number: number) {
  return card
    .flatMap(o => o
      .filter(p => !p.Checked)
      .map(f => f.Value))
    .reduce((acc, item) => acc + item, 0) * number;
}

const gamedata = fs.readFileSync("input", "utf8").split("\n");
const game = gamedata[0].split(',').flatMap(o => +o);

let cards = generateCards(gamedata.slice(1));

var lastNumber: number | undefined;
for (const number of game) {
  lastNumber = number;

  // check boxes
  updateCards(cards, number);

  if (cards.length == 1) {
    break;
  }

  // get index of winners
  // and remove from set
  getWinningCardIndices(cards)
    .sort((a, b) => a > b ? -1 : 1)
    .forEach(index => cards.splice(index, 1));
}

console.log(resultFromCard(cards[0], lastNumber!));