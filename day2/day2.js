import assert from '../assert.js';
import readLines from '../readlines.js';
import Hand from './hand.js';

const lines = readLines('day2/input.txt');
const handTypes = createHandTypes();
const LOSE = 'X';
const DRAW = 'Y';
const WIN = 'Z';

let battlesStrat1 = lines.map(line => parseBattleStrat1(line));
let battlesStrat2 = lines.map(line => parseBattleStrat2(line));

assert(15572, playBattles(battlesStrat1));
assert(16098, playBattles(battlesStrat2));

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
        case LOSE:
            p2Index = p2Index == 0 ? handTypes.length - 1 : p2Index - 1;
            break;
        case WIN:
            p2Index = p2Index == handTypes.length - 1 ? 0 : p2Index + 1;
            break;
        case DRAW:
            break;
    }
    return { p1: p1, p2: handTypes[p2Index] };
}

function parseHandString(value) {
    return handTypes.find(t => t.hasMatch(value));
}

function createHandTypes() {
    const handTypes = [ 
                new Hand(1, 'A', 'X'),
                new Hand(2, 'B', 'Y'),
                new Hand(3, 'C', 'Z') 
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

