import React, {useState} from 'react'
import Node from './Node';
import Graph from './DataStructures/Graph';



const PathfinderGrid = () => {
    console.log('rendering');
    //Dimensions of the grid
    const [dimensions, setDimensions] = useState({rows:3, cols:5});
    const [graph, setGraph] = useState(()=>new Graph(Graph.UNDIRECTED));
    const [visitedNodes, setVisited] = useState(new Array(dimensions.cols*dimensions.rows).fill(false));

    //Initialization of the grid. Iterate through it and store into the grid vble Node components passing x and y as props.
    const [grid, setGrid] = useState(() => {
        console.log('initializing grid')
        const rows = [];
        let count = 0;
        for (let i=0; i<dimensions.rows; i++) {
            rows[i] = [];
            for (let k = 0; k<dimensions.cols; k++) {
                // Generate visual Nodes.
                let node = <Node key={`${i}-${k}`} x={i} y={k} />
                rows[i][k] = node;

                //Generate the graph.
                // If it's not a cell of the last column put edge in the following cell and in the cell of the next row.
                if (!((count+1)%dimensions.cols === 0)) {
                    graph.addEdge(count, count+1);
                    if (count+dimensions.cols <( dimensions.cols * dimensions.rows) - 1) {
                        graph.addEdge(count, count+dimensions.cols)
                    }
                }
                //if its of the last column put edge down, only if it's not the last row.
                else {
                    if ((count+dimensions.cols) <= (dimensions.cols * dimensions.rows) - 1 ) {
                        graph.addEdge(count, count+dimensions.cols)
                    }
                }
                count++;
                
            }
        }
        return rows;
    });

    const visualizeAlgo = visitList => {
        const getCoords = (n, acc) => n > dimensions.cols ? getCoords(n-dimensions.cols, ++acc) : [acc,n];
        const delay = ms => new Promise(res => setTimeout(res, ms));
        visitList.forEach(async node => {
            let coords = getCoords(node,0);
            await delay(1000);
            console.log('awaited 1sec')
            let newGrid = grid.slice(0, coords[0]).concat([ grid[coords[0]].slice(0, coords[1]).concat(
                <Node key={`${coords[0]}-${coords[1]}`} x={coords[0]} y={coords[1]} visited={true}/>).concat(grid[coords[0]].slice(coords[1]+1)) ]);    
            setGrid(newGrid);
        })
        // let a = [[0,1,2,3,4], [5,6,7,8,9], [10,11,12,13,14]]
        // b = a.slice(0,2).concat([a[2].slice(0,3).concat(a[2][3] + 100).concat(a[2].slice(4))])
        // b = grid.slice(0,coords[0]).concat([grid[coords[0]].slice(0,coords[1]).concat(<Node x={coords[0]} y={coords[1]} visited={true} /> ).concat(grid[coords[0]].slice(coords[1]))])
        // let coords = [2,3];
        // let b = grid.slice(0,coords[0]).concat([grid[coords[0]].slice(0,coords[1]).concat(<Node x={coords[0]} y={coords[1]} visited={true} /> ).concat(grid[coords[0]].slice(coords[1]))])
        // console.log('sliced' , b);
        // setGrid([...grid])
        // console.log(...grid);

        // let b = grid.slice(0, coords[0]).concat([ grid[coords[0]].slice(0, coords[1]).concat(
        //     <Node key={`${coords[0]}-${coords[1]}`} x={coords[0]} y={coords[1]} visited={true}/>).concat(grid[coords[0]].slice(coords[1]+1)) ]);
        // setGrid(b);
        // console.log(b);
    }

    const handleClick = () => {
        let first = graph.getVertex(0);
        const visitOrder = graph.bfs2(first);
        visualizeAlgo(visitOrder);
    }

    const testClick = () => {
        let coords = [2,3];
        let newGrid = grid.slice(0, coords[0]).concat([ grid[coords[0]].slice(0, coords[1]).concat(
            <Node key={`${coords[0]}-${coords[1]}`} x={coords[0]} y={coords[1]} visited={true}/>).concat(grid[coords[0]].slice(coords[1]+1)) ]);    
        setGrid(newGrid);
    }

    return (
        <div>
            <div className="grid">
                {grid}  
            </div>
            <button onClick={() => handleClick()}>BFS!</button>
            <button onClick={() => console.log(grid)}>Check grid</button>
            <button onClick={() => testClick()}>Visit node 2-3 (13)</button>
            <button onClick={() => graph.printConnections()}>Veure grafo</button>
        </div>
    )
}

export default PathfinderGrid;
