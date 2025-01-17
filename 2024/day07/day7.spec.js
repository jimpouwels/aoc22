import { readLines } from '../../common/readlines.js';
import run from './day7.js';

describe('day7', () => {

    it('run', () => {
        expect(run(readLines('2024/day07/testdata.txt'), ['+', '*'])).toEqual(3598800864292);
        // expect(run(readLines('2024/day07/testdata.txt'), ['+', '*', '|'])).toEqual(340362529351427); // takes 12 seconds to run, uncomment if you want to include it
    });

});