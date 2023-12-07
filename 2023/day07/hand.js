import { cardValues } from "./card_values";

export default class Hand {
    cards;
    valueMap;
    bet = 0;
    score = 0;
    includeJokers = false;

    constructor(cards, bet, includeJokers = false) {
        this.valueMap = Array(15).fill(0);
        cards.forEach(c => this.valueMap[c]++)
        this.cards = cards;
        this.bet = bet;
        this.includeJokers = includeJokers;
    }

    calculateScore() {
        if (this.hasPairOf(5, 1))
            this.score = 7;
        else if (this.hasPairOf(4, 1))
            this.score = 6;
        else if (this.hasFullHouse())
            this.score = 5;
        else if (this.hasPairOf(3, 1))
            this.score = 4;
        else if (this.hasPairOf(2, 2))
            this.score = 3;
        else if (this.hasPairOf(2, 1))
            this.score = 2;
        else
            this.score = 1;
    }

    hasPairOf(length, count) {
        let keys = Object.keys(this.valueMap);
        let jokerCount = 0;
        if (this.includeJokers) {
            jokerCount = this.valueMap[keys.filter(k => k == cardValues["J"])];
            keys = keys.filter(k => k != cardValues["J"]);
        }
        return keys.filter(k => {
            if (this.valueMap[k] + jokerCount == length) {
                jokerCount = Math.max(0, jokerCount - 1);
                return true;
            }
            return false;
        }).length >= count;
    }

    hasFullHouse() {
        let keys = Object.keys(this.valueMap);
        let jokerCount = 0;
        if (this.includeJokers) {
            jokerCount = this.valueMap[keys.filter(k => k == cardValues["J"])];
            keys = keys.filter(k => k != cardValues["J"]);
        }
        if (this.hasPairOf(3, 1)) {
            let pairOfThree = keys.filter(k => {
                if (this.valueMap[k] + jokerCount == 3) {
                    jokerCount = Math.max(0, jokerCount - 1);
                    return true;
                }
                return false;
            })[0];
            if (!pairOfThree) {
                return false;
            }

            return keys.filter(k => k != pairOfThree).filter(k => this.valueMap[k] == 2).length == 1;
        }
        return false;
    }
}