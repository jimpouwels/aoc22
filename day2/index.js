import { readFileSync } from 'fs';
import { join } from 'path';
import Hand from './hand.js';

const input = readFileSync(join(process.cwd(), 'input.txt')).toString();
const lines = input.split('\n');

const types = [ new Hand("ROCK", 1, 'A', 'X'),
                new Hand("PAPER", 2, 'B', 'Y'),
                new Hand("SCISSORS", 3, 'C', 'Z') ];


for (let i = 0; i < types.length; i++) {
    types[i].beats = types[indexAt(i - 1, types.length - 1)];
    types[i].beatenBy = types[indexAt(i + 1, types.length - 1)];
}

function indexAt(index, max) {
    if (index > max) {
        return 0;
    } else if (index < 0) {
        return max;
    }
    return index;
}

let playerScore = lines.map(line => parse(line))
                       .map(hands => hands.p2.battle(hands.p1))
                       .reduce((total, score) => total + score);

console.log(`Part1: My score: ${playerScore}`);

function parse(line) {
    const splitted = line.split(' ');
    return { p1: parseHandString(splitted[0]), p2: parseHandString(splitted[1]) };
}

function parseHandString(value) {
    return types.find(t => t.hasMatch(value));
}

