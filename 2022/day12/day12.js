export default function run(lines) {
    const input = parseInput(lines);
    const part1 = getStepCount(aStar(input.from, input.to, input.grid));

    resetGrid(input.grid);
    const froms = getAllPossibleStartingPoints(input, 0);
    const part2 = Math.min(...froms.map(from => {
        resetGrid(input.grid);
        const destination = aStar(from, input.to, input.grid);
        return destination ? getStepCount(destination) : Infinity;
    }));
    return {
        part1: part1,
        part2: part2
    };
}

function aStar(from, to, grid) {
    const open = [from];
    const closed = [];

    while (true) {
        const current = open.shift();
        closed.push(current);
        
        if (!current) {
            return;
        }
        if (current == to) {
            return current;
        }
        const neighbours = getNeighbours(current, grid).filter(n => n.elevation - current.elevation < 2);
        for (const neighbour of neighbours) {
            if (closed.includes(neighbour)) {
                continue;
            }
            const newCost = getCost(from, neighbour, to);
            if (newCost <= neighbour.cost || !open.includes(neighbour)) {
                neighbour.cost = newCost;
                neighbour.parent = current;
                if (!open.includes(neighbour)) {
                    open.push(neighbour);
                }
            }
        }
    }

}

function getCost(from, current, to) {
    return getDistanceTo(current, from) + getDistanceTo(current, to);
}

function getDistanceTo(pos1, pos2) {
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

function getStepCount(found) {
    let stepCount = 0;
    let current = found;
    while (current.parent) {
        stepCount++;
        current = current.parent;
    }
    return stepCount;
}

function getNeighbours(currentPosition, grid) {
    const surroundingTiles = [];
    if (currentPosition.x > 0) {
        surroundingTiles.push(grid[currentPosition.y][currentPosition.x - 1]);
    }
    if (currentPosition.x < grid[0].length - 1) {
        surroundingTiles.push(grid[currentPosition.y][currentPosition.x + 1]);
    }
    if (currentPosition.y > 0) {
        surroundingTiles.push(grid[currentPosition.y - 1][currentPosition.x]);
    }
    if (currentPosition.y < grid.length - 1) {
        surroundingTiles.push(grid[currentPosition.y + 1][currentPosition.x]);
    }
    return surroundingTiles;
}

function resetGrid(grid) {
    grid.forEach(row => 
        row.forEach(position => {
            position.cost = Infinity;
            position.parent = null;
        })
    );
}

function getAllPossibleStartingPoints(input, elevationToFind) {
    return input.grid.flatMap(line => line.filter(position => position.elevation === elevationToFind));
}

function parseInput(lines) {
    let from, to;
    const grid = lines.map((line, row) => line.split('').flatMap((char, column) => {
        switch (char) {
            case 'S':
                from = { x: column, y: row, elevation: 0, cost: Infinity };
                return from;
            case 'E':
                to = { x: column, y: row, elevation: 25, cost: Infinity };
                return to;
            default:
                return { x: column, y: row, elevation: char.charCodeAt(0) % 97, cost: Infinity }; 
        }
    }));
    return {
        grid: grid,
        from: from,
        to: to
    }
}