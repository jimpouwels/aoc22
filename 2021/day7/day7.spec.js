import { readFile } from '../../common/readlines.js';
import run from './day7.js';

describe('day7', () => {

    it('part1', () => {
        expect(run(readFile('2021/day7/testdata.txt')).part1).toEqual(37);
    });

});