import Node from "./Node";
import Queue from "./Queue";
import Stack from "./Stack";
import PriorityQueue from "./PriorityQueue";

class Graph {
  constructor(edgeDirection = Graph.DIRECTED) {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }

  addEdge(source, destination, weight = 0) {
    const sourceNode = this.addVertex(source);
    const destinationNode = this.addVertex(destination);

    sourceNode.addAdjacent(destinationNode, weight);

    if (this.edgeDirection === Graph.UNDIRECTED) {
      destinationNode.addAdjacent(sourceNode, weight);
    }

    return [sourceNode, destinationNode];
  }

  addVertex(value) {
    if (this.nodes.has(value)) {
      return this.nodes.get(value);
    } else {
      const vertex = new Node(value);
      this.nodes.set(value, vertex);
      return vertex;
    }
  }

  removeVertex(value) {
    const current = this.nodes.get(value);
    if (current) {
      for (const node of this.nodes.values()) {
        node.removeAdjacent(current);
      }
    }
    return this.nodes.delete(value);
  }

  removeEdge(source, destination) {
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if (sourceNode && destinationNode) {
      sourceNode.removeAdjacent(destinationNode);

      if (this.edgeDirection === Graph.UNDIRECTED) {
        destinationNode.removeAdjacent(sourceNode);
      }
    }

    return [sourceNode, destinationNode];
  }

  printConnections() {
    for (let node of this.nodes) {
      let val = node[1].getValue();
      node[1]
        .getAdjacents()
        .forEach(adj =>
          console.log(
            `( ${val} , ${adj.getValue()}, weight: ${node[1].getWeight(adj)} )`
          )
        );
    }
  }

  getConnections() {
    let s = "";
    for (let node of this.nodes) {
      let val = node[1].getValue();
      node[1]
        .getAdjacents()
        .forEach(adj => (s += `( ${val} , ${adj.getValue()} , ${node[1].getWeight(adj)} )` + "\n"));
    }
    return s;
  }

  getVertex(key) {
    return this.nodes.get(key);
  }

  *bfs(first) {
    const visited = new Map();
    const visitList = new Queue();

    visitList.add(first);

    while (!visitList.isEmpty()) {
      const node = visitList.remove();
      if (node && !visited.has(node)) {
        yield node;
        visited.set(node);
        node.getAdjacents().forEach(adj => visitList.add(adj));
      }
    }
  }

  *dfs(first) {
    const visited = new Map();
    const visitList = new Stack();

    visitList.add(first);

    while (!visitList.isEmpty()) {
      const node = visitList.remove();
      if (node && !visited.has(node)) {
        yield node;
        visited.set(node);
        node.getAdjacents().forEach(adj => visitList.add(adj));
      }
    }
  }

  bfs2(first) {
    console.log('running bfs');
    const visited = new Map();
    const visitList = new Queue();

    visitList.add(first);

    const visitedList = [];

    while (!visitList.isEmpty()) {
      const node = visitList.remove();
      if (node && !visited.has(node)) {
        visitedList.push(node.value);
        visited.set(node);
        node.getAdjacents().forEach(adj => visitList.add(adj));
      }
    }
    return visitedList;
  }

  dfs2(first) {
    console.log('running dfs');
    const visited = new Map();
    const visitList = new Stack();

    visitList.push(first);

    const visitedList = [];

    while (!visitList.isEmpty()) {
      const node = visitList.pop();
      if (node && !visited.has(node)) {
        visitedList.push(node.value);
        visited.set(node);
        node.getAdjacents().forEach(adj => visitList.push(adj));
      }
    }
    return visitedList;
  }

  dijkstra(start) {
    console.log('running dijkstra');
    let dijkstra = [start];
    let pq = new PriorityQueue();
    start.setDistance(0);
    // this.dijkstra.bind(this);
    for (let node of this.nodes) {
      pq.add([node[1].getDistance(), node[1]]);
    }
    while (!pq.isEmpty()) {
      let currentNode = pq.delMin();
      // console.log('current:',currentNode.getValue())
      for (let nextNode of currentNode.getAdjacents()) {
        // console.log(' - :',nextNode.getValue())
        let newDist =
          currentNode.getDistance() + currentNode.getWeight(nextNode);
        if (newDist < nextNode.getDistance()) {
          nextNode.setDistance(newDist);
          dijkstra.push(nextNode);
          pq.decreaseKey(nextNode, newDist);
        }
      }
    }
    return dijkstra.map(node => node.getValue());
  }

  getAlgo(pos) {
    let algos = [this.bfs2, this.dfs2, this.dijkstra];
    return algos[pos];
  }
}

Graph.UNDIRECTED = Symbol("undirected graph"); // one-way edges
Graph.DIRECTED = Symbol("directed graph"); // two-ways edges

export default Graph;

const graph = new Graph(Graph.UNDIRECTED);

// const [first] = graph.addEdge(1,2);
// graph.addEdge(1, 3);
// graph.addEdge(1, 4);
// graph.addEdge(5, 2);
// graph.addEdge(6, 3);
// graph.addEdge(7, 3);
// graph.addEdge(8, 4);
// graph.addEdge(9, 5);
// graph.addEdge(10, 6);

// console.log(graph.bfs2(first));
