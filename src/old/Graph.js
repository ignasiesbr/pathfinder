import React,{useState} from 'react'
import Node from './Node';

const Graph = ({rows, cols}) => {
    const [nodes, setNodes] = useState(new Map());

    const addEdge = (source,destination) => {
        const sourceNode = addVertex(source);
        const destinationNode = addVertex(destination);

        sourceNode.addAdjacent(destinationNode);
        destinationNode.addAdjacent(sourceNode);

        return [sourceNode, destinationNode];
    };

    const addVertex = (value) => {
        if (nodes.has(value)) {
            return nodes.get(value);
        }
        else {
            const vertex = Node(value);
            setNodes(nodes.set(value, vertex));
            console.log(nodes);
            return vertex;
        }
    }

    const removeVertex = (value) => {
        const current = nodes.get(value);
        if (current) {
            for (const node of nodes.values()) {
                nodes.removeAdjacent(current);
            };
        }
        return setNodes(nodes.delete(value));
    }

    const removeEdge = (source, destination) => {
        const sourceNode = nodes.get(source);
        const destinationNode = nodes.get(destination);

        if (sourceNode && destinationNode) {
            sourceNode.removeAdjacent(destinationNode);
        }

        return [sourceNode, destinationNode];
    }

    const obj = {
        graph: nodes,
        lon:[]
    };
    let count = 0;
    for (let i = 0; i<rows; i++ ) {
        obj.lon[i] = [];
        for (let k = 0; k<cols; k++) {
            let node = <Node key={`${i}-${k}`} x={i} y={k} />

            obj.lon[i][k] = node;

            addEdge(count, count+1);
            // addEdge(count, count+5)
        }
    };

    return (
        <div>
            this is a graph
            <button onClick={() => console.log(nodes)}>Click me to console.log the nodes</button>
            <div className="grid">
                {obj.lon}
            </div>
        </div>
    )
}

export default Graph
