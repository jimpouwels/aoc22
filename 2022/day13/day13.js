export default function run(input) {
    const pairs = parseLines(input);

    let part1 = 0;
    pairs.forEach((pair, index) => {
        if (comparePair(pair) == 1) {
            part1 += (index + 1);
        }
    });

    return {
        part1: part1,
        part2: 0
    };
}

function comparePair(pair) {
    return compareList(pair.left, pair.right);
}

function compareList(left, right) {
    for (let i = 0; i < left.length(); i++) {
        if (i == right.length()) {
            return -1;
        }
        let leftItem = left.values[i];
        let rightItem = right.values[i];
        if (Array.isArray(leftItem.values) && !Array.isArray(rightItem.values)) {
            const result = compareInt(leftItem.values[0], rightItem);
            if (result === 0) {
                continue;
            } else {
                return result;
            }
        } else if (!Array.isArray(leftItem.values) && Array.isArray(rightItem.values)) {
            const result = compareInt(leftItem, rightItem.values[0]);
            if (result === 0) {
                continue;
            } else {
                return result;
            }
        }
        if (Array.isArray(leftItem.values) && Array.isArray(rightItem.values)) {
            const result = compareList(leftItem, rightItem);
            if (result === 0) {
                continue;
            } else {
                return result;
            }
        } else {
            const result = compareInt(leftItem, rightItem);
            if (result === 0) {
                continue;
            } else {
                return result;
            }
        }
    }
    if (left.length() < right.length()) {
        return 1;
    }
    return 0;
}

function compareInt(left, right) {
    if (left === right) {
        return 0;
    }
    if (left < right) {
        return 1;
    } else {
        return -1;
    }
}

function parseLines(lines) {
    return lines.split('\n\n').map(pair => { 
        const splittedPair = pair.split('\n');
        const left = parseLine(splittedPair[0]);
        const right = parseLine(splittedPair[1]);
        return { left: left, right: right };
    });
}

function parseLine(line) {
    let cursor = 0;
    let root, currentList = null;
    while (cursor < line.length) {
        const token = readToken(line, cursor);
        cursor += token.length;
        switch (token) {
            case '[':
                const subList = new List(currentList);
                if (!root) {
                    root = subList;
                    currentList = root;
                } else {
                    currentList.push(subList);
                    currentList = subList;
                }
                break;
            case ']':
                currentList = currentList.parent;
                break;
            case ',':
                break;
            default:
                currentList.push(parseInt(token));
        }
    }
    return root;
}

function readToken(line, cursor) {
    let token = line.charAt(cursor);
    if (isNaN(token)) {
        return token;
    } else {
        if (!isNaN(line.charAt(cursor + 1))) {
            return token + readToken(line, cursor + 1);
        } else {
            return token;
        }
    }
}

class List {
    values = [];
    parent;

    constructor(parent) {
        this.parent = parent;
    }
    
    push(value) {
        this.values.push(value);
    }

    length() {
        return this.values.length;
    }
}