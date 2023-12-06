export default function run(lines) {
    let maps = parseMaps(lines);
    let seeds = parseSeeds(lines[0]);

    let part1 = Math.min(...seeds.map(seed => {
        let out = null;
        maps.forEach(m => {
            out = m.nav(out ? out : seed);
        });
        return out;
    }));

    let part2 = Number.MAX_VALUE;

    let inRanges = [];
    for (let i = 0; i < seeds.length; i += 2) {
        inRanges.push(new Range(seeds[i], seeds[i] + seeds[i + 1]));
    }
    let outRanges = null;
    maps.forEach(m => {
        outRanges = m.navRange(outRanges ? outRanges : inRanges);
    });

    part2 = Math.min(...outRanges.map(r => r.from));


    return {
        part1: part1,
        part2: part2
    }
}

function parseSeeds(line) {
    return line.split(': ').slice(1).flatMap(s => s.split(' ').map(i => parseInt(i)));
}

function parseMaps(lines) {
    return lines.slice(2).join('\n').split('\n\n')
                .flatMap(mapString => parseMap(mapString));
}

function parseMap(mapString) {
    return mapString.split('\n\n')
                    .map(mapArr => {
                        let map = new Map();
                        mapArr.split('\n').forEach(((m, i) => {
                            if (i === 0) {
                                return null;
                            }
                            let rangeSplit = m.split(' ').map(r => parseInt(r));
                            map.setIn(rangeSplit[1], rangeSplit[2]);
                            map.setOut(rangeSplit[0], rangeSplit[2]);
                        }));
                        
                        return map;
                    });
}

class Map {
    ins = [];
    outs = [];

    nav(nr) {
        let rangeIndex = -1;
        let index = -1;
        for (let i = 0; i < this.ins.length; i++) {
            if (nr >= this.ins[i].from && nr <= this.ins[i].to) {
                rangeIndex = i;
                index = nr - this.ins[i].from;
                break;
            }
        }
        let result = nr;
        if (index !== -1) {
            result = this.outs[rangeIndex].from + index;
        }
        return result;
    }

    navRange(ranges) {
        let outRanges = [];

        ranges.forEach(range => {
            let matchStuff = [];
            this.ins.forEach((inx, ix) => {
                if ((range.from >= inx.from && range.from <= inx.to) ||
                    (range.to >= inx.from && range.to <= inx.to)) {
                    matchStuff.push({i: ix, matches: inx});
                }
            });
            if (matchStuff.length == 0) {
                outRanges.push(new Range(range.from, range.to));
            } else {
                matchStuff.forEach(matchingIns => {
                    let matchingIn = matchingIns.matches;
                    let i = matchingIns.i;
                    if (!matchingIn) {
                        outRanges.push(new Range(range.from, range.to));
                    } else {
                        // check left side
                        if (range.from < matchingIn.from) {
                            outRanges.push(new Range(range.from, Math.min(matchingIn.from, range.to)));
                        }
                        // check right side
                        if (range.to > matchingIn.to) {
                            outRanges.push(new Range(Math.max(range.from, matchingIn.to), range.to));
                        }
                        // overlap
                        let outFrom = this.outs[i].from;
                        let outTo = this.outs[i].to;
                        if (range.from >= matchingIn.from && range.from <= matchingIn.to) {
                            outFrom = range.from + (this.outs[i].from - matchingIn.from);
                        }
                        if (range.to <= matchingIn.to && range.to >= matchingIn.from) {
                            outTo = range.to + (this.outs[i].from - matchingIn.from);
                        }
                        outRanges.push(new Range(outFrom, outTo));
                    }
                });
            }
        });
        return outRanges;
    }

    setIn(from, length) {
        this.ins.push(new Range(from, from + length));
    }

    setOut(from, length) {
        this.outs.push(new Range(from, from + length));
    }
}

class Range {
    from;
    to;

    constructor(from, to) {
        this.from = from;
        this.to = to;
    }

    length() {
        return this.to - this.from;
    }
}