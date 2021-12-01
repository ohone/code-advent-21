import * as fs from 'fs'

const numbers = fs.readFileSync('unput', 'utf8').split('\n');
let count = 0;
for (let current = 1; current < numbers.length; current++) {
    const element = +numbers[current];
    if (element > +numbers[current-1]){
        count++;
    }
}

console.log(count);