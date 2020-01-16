const getIndex = (list, node) => {
    let index = -1;
    let count = 0;
    for (let pair of list) {
      if (pair[0] === node) {
        index = count;
        break;
      }
      count++;
    }
    return index;
  };
  
  class Node {
    constructor(value) {
      this.value = value;
      this.adjacents = [];
      this.pred = null;
      this.distance = Number.MAX_SAFE_INTEGER;
    }
  
    addAdjacent(node, weight) {
      this.adjacents.push([node, weight]);
    }
  
    setPred(p) {
      this.pred = p;
    }

    getPred() {
      return this.pred
    }

    removeAdjacent(node) {
      let index = getIndex(this.adjacents, node);
      if (index > -1) {
        this.adjacents.splice(index, 1);
        return node;
      }
    }
  
    getAdjacents() {
      let adjacents = this.adjacents.map(adj => adj[0]);
      return adjacents;
    }
  
    getWeight(node) {
      let index = getIndex(this.adjacents, node);
      let pair = this.adjacents[index];
      return pair[1];
    }

    setWeight(node, weight) {
      let index = getIndex(this.adjacents, node);
      let pair = this.adjacents[index];
      pair[1] = weight;

    }
  
    isAdjacent(node) {
      return getIndex(this.adjacents, node) > -1;
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
  