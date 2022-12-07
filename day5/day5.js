export default function day5(input) {
    const moves = parseMoves(input);
    const part1Stacks = rearrange(parseStacks(input), moves, true);
    const part2Stacks = rearrange(parseStacks(input), moves, false);
    
    return {
        part1: topCratesAsString(part1Stacks),
        part2: topCratesAsString(part2Stacks)
    };
}

function rearrange(stacks, moves, oneByOne) {
    moves.forEach(move => {
        let stackToMove = stacks[move.from].splice(0, move.count);
        if (oneByOne) {
            stackToMove = stackToMove.reverse();
        }
        stacks[move.to] = [...stackToMove, ...stacks[move.to]];
    });
    return stacks;
}

function topCratesAsString(stacks) {
    return stacks.map(s => s[0].replace('[', '').replace(']', '')).join('');
}

function parseStacks(lines) {
    let crateRows = lines.filter(line => line.trim().startsWith('['))
                          .map(line => parseCrateRow(line));
    return convertToStacks(crateRows);    
}

function parseCrateRow(line) {
    const crates = [];
    for (let i = 0; i < line.length; i += 4) {
        const stackIndex = i / 4;
        let crate = readChars(line, i, i + 4).trim();
        if (crate) {
            crates.push({ crate: crate, stackIndex: stackIndex });
        }
    }
    return crates;
}

function parseMoves(lines) {
    const moves = [];
    lines.filter(line => line.startsWith('move')).forEach(line => {
        const parts = line.split(' ');
        moves.push({ count: parts[1], from: parts[3] - 1, to: parts[5] - 1 });
    });
    return moves;
}

function convertToStacks(crateRows) {
    const stacks = [];
    crateRows.forEach(row => row.forEach(crate => {
        if (!stacks[crate.stackIndex]) {
            stacks[crate.stackIndex] = [];
        }
        stacks[crate.stackIndex].push(crate.crate);
    }));
    return stacks;
}

function readChars(value, from, to) {
    return value.slice(from, to);
}