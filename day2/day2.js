import * as fs from 'fs';
import * as path from 'path';
import Hand from './hand.js';

const input = fs.readFileSync(path.join(process.cwd(), 'day2/input.txt')).toString();
const lines = input.split('\n');
const handTypes = createHandTypes();

let battlesStrat1 = lines.map(line => parseBattleStrat1(line));
let battlesStrat2 = lines.map(line => parseBattleStrat2(line));

console.log(`Part1: My score: ${playBattles(battlesStrat1)}`);
console.log(`Part2: My score: ${playBattles(battlesStrat2)}`);

function playBattles(battles) {
    return battles.map(battle => battle.p2.fight(battle.p1))
                  .reduce((total, score) => total + score);
}

function parseBattleStrat1(line) {
    const splitted = line.split(' ');
    return { p1: parseHandString(splitted[0]), p2: parseHandString(splitted[1]) };
}

function parseBattleStrat2(line) {
    const splitted = line.split(' ');
    const p1 = parseHandString(splitted[0]);
    const p1Index = handTypes.indexOf(p1);
    let p2Index = p1Index;

    switch (splitted[1]) {
        case 'X':
            p2Index = p2Index == 0 ? handTypes.length - 1 : p2Index - 1;
            break;
        case 'Z':
            p2Index = p2Index == handTypes.length - 1 ? 0 : p2Index + 1;
            break;
    }
    return { p1: p1, p2: handTypes[p2Index] };
}

function parseHandString(value) {
    return handTypes.find(t => t.hasMatch(value));
}

function createHandTypes() {
    const handTypes = [ 
                new Hand("ROCK", 1, 'A', 'X'),
                new Hand("PAPER", 2, 'B', 'Y'),
                new Hand("SCISSORS", 3, 'C', 'Z') 
    ];

    for (let i = 0; i < handTypes.length; i++) {
        let previous = i - 1;
        if (previous < 0) {
            previous = handTypes.length - 1;
        }
        handTypes[i].beats = handTypes[previous];
    }
    return handTypes;
}
