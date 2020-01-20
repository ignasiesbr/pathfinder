import Node from "./Node";
import Queue from "./Queue";
import Stack from "./Stack";
import PriorityQueue from "./PriorityQueue";
import {cols, rows}  from '../utils/constants';

let calculateY = (endValue, acc) => {
  if (endValue < cols) {
    return acc;
  } else {
    let newVal = endValue - cols;
    let newAcc = acc + 1;
    return calculateY(newVal, newAcc);
  }
};

class Graph {
  constructor(edgeDirection = Graph.DIRECTED) {
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }

  addEdge(source, destination, weight = 1) {
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
            `( ${val} , ${adj.getValue()}, weight: ${node[1].getWeight(
              adj
            )}, dist: ${node[1].getDistance()} )`
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
        .forEach(
          adj =>
            (s +=
              `( ${val} , ${adj.getValue()} , ${node[1].getWeight(adj)} )` +
              "\n")
        );
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
    console.log("running bfs");
    const visited = new Map();
    const visitList = new Queue();
    this.setToInfinity();
    visitList.add(first);

    const visitedList = [];

    while (!visitList.isEmpty()) {
      const node = visitList.remove();
      if (node && !visited.has(node)) {
        visitedList.push(node.value);
        visited.set(node);
        node.getAdjacents().forEach(adj => {
          visitList.add(adj);
          if (!adj.getPred()) {
            adj.setPred(node);
          }
        });
      }
    }
    return visitedList;
  }

  dfs2(first) {
    console.log("running dfs");
    const visited = new Map();
    const visitList = new Stack();
    this.setToInfinity();

    visitList.push(first);

    const visitedList = [];

    while (!visitList.isEmpty()) {
      const node = visitList.pop();
      if (node && !visited.has(node)) {
        visitedList.push(node.value);
        visited.set(node);
        node.getAdjacents().forEach(adj => {
          visitList.push(adj);
          if (!adj.getPred()) {
            adj.setPred(node);
          }
        });
      }
    }
    return visitedList;
  }

  setToInfinity(start) {
    //BFS through setting to MAXSAFE INTEGER.
    const visited = new Map();
    const visitList = new Stack();
    visitList.push(start);
    while (!visitList.isEmpty()) {
      const node = visitList.pop();
      if (node && !visited.has(node)) {
        visited.set(node);
        node.setDistance(Number.MAX_SAFE_INTEGER);
        node.setPred(null);
        node.getAdjacents().forEach(adj => visitList.push(adj));
      }
    }
  }

  dijkstra(start) {
    console.log("running dijkstra");
    graph.setToInfinity(start);
    let dijkstra = [start];
    let pq = new PriorityQueue();
    start.setDistance(0);
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
        // console.log('new dist:' , newDist, 'next idst:', nextNode.getDistance())
        if (newDist <= nextNode.getDistance()) {
          nextNode.setDistance(newDist);
          dijkstra.push(nextNode);
          pq.decreaseKey(nextNode, newDist);
          nextNode.setPred(currentNode);
        }
      }
    }
    return dijkstra.map(node => node.getValue());
  }

  a_star(startNode, endNode) {
    console.log('running a * ');
    let openList = [];
    let closedList = [];
    let visited = [startNode.getValue()];

    startNode.g = startNode.h = startNode.f = 0;

    endNode.g = endNode.h = endNode.f = 0;
    let xEnd = endNode.getValue() % cols;
    let yEnd = calculateY(endNode.getValue(), 0);

    openList.push(startNode);
    while (openList.length > 0) {
      let current = openList[0];
      let currentIndex = 0;
      let index = 0;
      for (let node of openList) {
        if (node.f < current.f) {
          current = node;
          currentIndex = index;
        }
        index++;
      }

      openList = openList
        .slice(0, currentIndex)
        .concat(openList.slice(currentIndex + 1));
      closedList.push(current);
      if (current.getValue() === endNode.getValue()) {
        let path = [];
        let curr = current;
        startNode.setPred(null)
        while (curr) {
          path.push(curr.getValue());
          curr = curr.getPred();
        }
        return [path.reverse(), visited];
      }

      //iterate through adjacent
      for (let node of current.getAdjacents()) {
        visited.push(node.getValue());
        let inClosedList = closedList.filter(
          closedNode => node.getValue() === closedNode.getValue()
        );
        if (inClosedList.length === 0) {
          //Create g,h,f for node
          node.g = current.getWeight(node) + current.g;
          //heuristic calc.
          let xCurr = node.getValue() % cols;
          let yCurr = calculateY(node.getValue(), 0);
          node.h = Math.pow(xCurr - xEnd, 2) + Math.pow(yCurr - yEnd, 2);
          node.f = node.h + node.g;

          //If node in openList continue to beggining forloop
          let cont = true;
          for (let openNode of openList) {
            if (
              node.getValue() === openNode.getValue() &&
              node.g >= openNode.g
            ) {
              cont = false;
            }
          }

          if (cont) {
            node.setPred(current);
            openList.push(node);
          }
        }
      }
    }
  }

  getAlgo(pos) {
    let algos = [this.bfs2, this.dfs2, this.dijkstra, this.a_star];
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
