export default class Numbers {
    map = new Map();

    constructor(data) {
        data.forEach(n => this.map.set(n, 1));
    }

    keys() {
        return this.map.keys();
    }

    get(key) {
        return this.map.get(key);
    }

    handle(delta) {
        if (!this.map.has(delta.number))
            this.map.set(delta.number, 0);

        this.map.set(delta.number, this.map.get(delta.number) + delta.count);
    }

    count() {
        let total = 0;
        this.map.forEach(value => total += (value > 0 ? value : 0));
        return total;
    }
}