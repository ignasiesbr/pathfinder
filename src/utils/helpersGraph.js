import Graph from '../DataStructures/Graph';
import {cols, rows} from './constants';


export const addEdge = (graph, node) => {
    if (!((node+1)%cols === 0)) {
        graph.addEdge(node, node+1);
        if (node+cols <( cols * rows) - 1) {
            graph.addEdge(node, node+cols)
        }
    }
    else {
        if ((node+cols) <= (cols * rows) - 1 ) {
            graph.addEdge(node, node+cols)
        }
    }
}

export const restoreEdge = (graph, node) => {
    if (node > cols && graph.getVertex(node-cols)) {
        graph.addEdge(node, node-cols);
    }
    if ((!((node+1)%cols === 0)) && graph.getVertex(node+1) ) {
        graph.addEdge(node, node+1);
    }
    if ( (node + cols <= (rows*cols))  && graph.getVertex(node+cols)) {
        graph.addEdge(node, node+cols);
    }
    if ( (!(node % cols === 0)) && graph.getVertex(node-1)) {
        graph.addEdge(node, node-1);
    }
}

export const addWeight = (graph, node, weight) => {
    let nodeClicked = graph.getVertex(node);
    let nodeAdj = graph.getVertex(node-cols);
    const isUndirected = graph.edgeDirection === Graph.UNDIRECTED;
    if (node > cols && nodeAdj) {
        nodeClicked.setWeight(nodeAdj, weight);
        if (isUndirected) {
            nodeAdj.setWeight(nodeClicked, weight)
        }
    }
    nodeAdj = graph.getVertex(node+1)
    if ((!((node+1)%cols === 0)) && nodeAdj ) {
        nodeClicked.setWeight(nodeAdj, weight);
        if (isUndirected) {
            nodeAdj.setWeight(nodeClicked, weight)
        }
    }
    nodeAdj = graph.getVertex(node+cols);
    if ( (node + cols <= (rows*cols))  && nodeAdj) {
        nodeClicked.setWeight(nodeAdj, weight);
        if (isUndirected) {
            nodeAdj.setWeight(nodeClicked, weight)
        }
    }
    nodeAdj = graph.getVertex(node-1);
    if ( (!(node % cols === 0)) && graph.getVertex(node-1)) {
        nodeClicked.setWeight(nodeAdj, weight);
        if (isUndirected) {
            nodeAdj.setWeight(nodeClicked, weight)
        }
    }
}

export const generateGraph = () => {
    const graph = new Graph(Graph.UNDIRECTED);
    let total = rows*cols;
    for (let count = 0; count<total; count++) {
        addEdge(graph, count);
    }
    return graph;
}

export const getPredList = (node, start) => {
    let max = 1000;
    let count = 0;
    let done = false;
    let list = [node.getValue()];
    let current = node;
    while (!done) {
        if (!current.getPred() || count >= max || current.getValue() == start) {
            done = true;
        }
        else {
            count++;
            current = current.getPred();
            list.push(current.getValue());
        }
    }
    return list.reverse();
}
