export default function run(input) {
    const rockPositions = input.flatMap(lineParts => {
        return parseLineParts(lineParts);
    });
    const maxX = Math.max(...rockPositions.map(p => p.x));
    const maxY = Math.max(...rockPositions.map(p => p.y));

    const grid = new Array(maxY + 1);
    for (let y = 0; y < grid.length; y++) {
        grid[y] = new Array(maxX + 1);
        for (let x = 0; x <= maxX; x++) {
            grid[y][x] = new Cell();
        }
    }
    rockPositions.forEach(rock => {
        grid[rock.y][rock.x].isBlocked = true;
    });

    let sandCount = 0;
    top: while (true) {
        const sand = { x: 500, y: 0 };
        while (true) {
            if (sand.y === grid.length - 1) {
                break top;
            }
            if (!grid[sand.y + 1][sand.x].isBlocked) {
                sand.y++;
                continue;
            }
            if (!grid[sand.y + 1][sand.x - 1].isBlocked) {
                sand.y++;
                sand.x--;
                continue;
            }
            if (!grid[sand.y + 1][sand.x + 1].isBlocked) {
                sand.y++;
                sand.x++;
                continue;
            }
            grid[sand.y][sand.x].isBlocked = true;
            sandCount++;
            break;
        }
    }
    return {part1: sandCount};
}

function parseLineParts(lineParts) {
    return lineParts.split(' -> ')
                            .flatMap((part, index, parts) => {
                                if (!parts[index + 1]) {
                                    return null;
                                };
                                const begin = parsePoint(part);
                                const end = parsePoint(parts[index + 1]);
                                
                                const allPoints = allPointsFrom(begin, end)
                                return allPoints;
                            })
                            .filter(part => part);
}

function allPointsFrom(begin, end) {
    const allPoints = [];
    if (begin.x > end.x) {
        for (let x = begin.x; x >= end.x; x--) {
            allPoints.push({ x: x, y: begin.y });
        }
    } else if (begin.x < end.x) {
        for (let x = begin.x; x <= end.x; x++) {
            allPoints.push({ x: x, y: begin.y });
        }
    } else if (begin.y > end.y) {
        for (let y = begin.y; y >= end.y; y--) {
            allPoints.push({ x: begin.x, y: y });
        }
    } else if (begin.y < end.y) {
        for (let y = begin.y; y <= end.y; y++) {
            allPoints.push({ x: begin.x, y: y });
        }
    }
    return allPoints;
}

function parsePoint(pointString) {
    const parts = pointString.split(',')
    return  { x: parseInt(parts[0]), y: parseInt(parts[1])};
}

class Cell {
    isBlocked = false;
}