export default function(input) {
    let numberCompletelyInclude = 0;
    let numberPartiallyInclude = 0;

    input.forEach(line => {
        const ranges = parseRanges(line);
        if (fullyIncludes(ranges.range1, ranges.range2) || fullyIncludes(ranges.range2, ranges.range1)) {
            numberCompletelyInclude++;
            numberPartiallyInclude++;
        } else if (ranges.range1.find(r1 => ranges.range2.includes(r1)) ||
            ranges.range2.find(r2 => ranges.range1.includes(r2))) {
            numberPartiallyInclude++;
        }
    });

    return {
        part1: numberCompletelyInclude,
        part2: numberPartiallyInclude
    };
}

function fullyIncludes(array1, array2) {
    return array1.filter(array1Item => array2.includes(array1Item)).length === array1.length;
}

function parseRanges(line) {
    const ranges = line.split(',');
    const range1 = parseRange(ranges[0]);
    const range2 = parseRange(ranges[1]);
    return { range1: range1, range2: range2 };
}

function parseRange(stringValue) {
    const parts = stringValue.split('-');
    let range = [];
    for (let i = parseInt(parts[0]); i < parseInt(parts[1]) + 1; i++) {
        range.push(i);
    }
    return range;
}