const MINUTES_TO_OPEN = 1;

export default function run(lines) {
    const valves = parseValves(lines);
    const routes = [];
    createRoutes(valves, routes);
    console.log(`ROUTES COMPLETED: found ${routes.length} routes`);
    const paths = createPaths(valves.find(x => x.name === 'AA'), valves.filter(v => v.rate > 0), routes, 30);
    console.log(`PATHS COMPLETED: found ${paths.length} paths`);
    let highestScore = 0;
    paths.forEach(path => {
        const score = tryPath(path, valves);
        highestScore = Math.max(highestScore, score);
    });
    console.log(`PATHS COMPLETED: ${paths.length} paths tested`);

    return {
        part1: highestScore
    }
}

function tryPath(path, valves) {
    let score = 0;
    let current = path.shift();
    for (let i = 0; i < 30; i++) {
        valves.forEach(v => score += v.releasePressure());
        current.do();
        if (current.travelTime <= 0) {
            if (path.length === 0) {
                continue;
            } 
            current = path.shift();
        }
    }
    valves.forEach(v => v.reset());
    return score;
}

function createPaths(currentValve, allNonZeroValves, routes, remainingMinutes, openValves = []) {
    const paths = [];
    if (!allNonZeroValves.find(v => !openValves.includes(v.name) && v.name !== currentValve.name)) {
        paths.push([ new Open(currentValve, [])]);
    } else {
        const possibleTargets = allNonZeroValves.filter(v => !openValves.includes(v.name));
        for (const targetValve of possibleTargets) {
            if (targetValve === currentValve) {
                paths.push([ new Open(currentValve, []) ]);
                continue;
            }
            const route = findRoute(routes, currentValve, targetValve);
            if ((route.length + MINUTES_TO_OPEN + 1) > remainingMinutes) {
                paths.push([ new Open(currentValve, []) ]);
            } else {
                for (const subPath of createPaths(targetValve, allNonZeroValves, routes, remainingMinutes - route.length - 1, [...openValves, currentValve.name])) {
                    paths.push([ new Open(currentValve, route), ...subPath ]);
                }
            }
        }
    }
    return paths;
}

class Open {
    valve;
    travelTime;
    route;

    constructor(valve, route) {
        this.valve = valve;
        this.route = route;
        this.travelTime = route.length;
    }

    do() {
        if (!this.valve.isOpen && this.valve.rate !== 0) {
            this.valve.open();
        } else {
            this.travelTime--;
        }
    }
}

function parseValves(lines) {
    const valveMap = [];
    const valves = lines.map(line => {
        const { valve, rate, targets } = line.match(/Valve (?<valve>([A-Z]+)) has flow rate=(?<rate>(\d+)); tunnel[s]? lead[s]? to valve[s]? (?<targets>[A-Z, ]+)/).groups;
        valveMap[valve] = targets.split(', ');
        return new Valve(valve, +rate);
    });
    valves.forEach(valve => {
        valveMap[valve.name].forEach(t => {
            valve.targets.push(valves.find(v => v.name == t));
        });
    });
    return valves;
}

function createRoutes(valves, routes) {
    for (let i = 0; i < valves.length - 1; i++) {
        for (let j = 1; j < valves.length; j++) {
            if (valves[i] == valves[j]) {
                continue;
            }
            const route = { from: valves[i], to: valves[j], path: valves[i].findPathTo(valves[j], routes).slice(1) };
            route.scoreForRemaining = function(remainingMinutes) {
                return scoreForRemainingMins(remainingMinutes, this);
            }
            routes.push(route);
        }
    }
}

function findRoute(routes, from, to) {
    let foundRoute = routes.find(r => (r.from === from && r.to === to));
    if (!foundRoute) {
        return routes.find(r => (r.from === to && r.to === from)).path.reverse();
    }
    return foundRoute.path;
}

function scoreForRemainingMins(remainingMinutes, route) {
    return (remainingMinutes - route.path.length - 1) * route.to.rate;
}

class Valve {
    name;
    rate = 0;
    targets = [];
    isOpen = false;

    constructor(name, rate) {
        this.name = name;
        this.rate = rate;
    }

    open() {
        this.isOpen = true;
    }

    releasePressure() {
        if (this.isOpen) {
            return this.rate;
        }
        return 0;
    }

    reset() {
        this.isOpen = false;
    }

    findPathTo(otherValve, routes, visited = []) {
        visited.push(this.name);
        if (otherValve !== this) {
            const existingPath = routes.find(r => r.from == this && r.to == otherValve);
            if (existingPath) {
                return [ this, ...existingPath.path ];
            }
            const shortestPath = this.targets.filter(t => !visited.includes(t.name))
                                             .map(t => t.findPathTo(otherValve, routes, [ ...visited ]))
                                             .filter(p => p[p.length - 1] == otherValve)
                                             .sort((a, b) => a.length - b.length)[0];
            return shortestPath ? [ this, ...shortestPath ] : [ this ];
        }
        return [ this ];
    }

}