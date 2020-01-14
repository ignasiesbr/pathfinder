class Node {
    constructor(value) {
        this.value = value;
        this.adjacents = [];
        this.distance = Number.MAX_SAFE_INTEGER;
    }

    addAdjacent(node) {
        this.adjacents.push(node);
    };

    removeAdjacent(node) {
        const index = this.adjacents.indexOf(node);
        if (index > -1) {
            this.adjacents.splice(index, 1);
            return node;
        }
    }

    getAdjacents() {
        return this.adjacents;
    }

    isAdjacent(node) {
        return this.adjacents.indexOf(node) > -1;
    }

    getValue() {
        return this.value;
    }

    getDistance() {
        return this.distance;
    }

    setDistance(dist) {
        this.distance = dist;
    }
}

export default Node;