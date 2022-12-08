import { readLines } from '../../common/readlines.js';
import day7 from './day7.js';

describe('day7', () => {

    it('part1', () => {
        expect(day7(readLines('2022/day7/testdata.txt')).part1).toEqual(1206825);
    });

    it('part2', () => {
        expect(day7(readLines('2022/day7/testdata.txt'), 8381165).part2).toEqual(9608311);
    });

});