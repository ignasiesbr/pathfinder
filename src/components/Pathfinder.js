import React, {useState, useCallback, useRef, useEffect} from 'react'
import produce from 'immer';
import Graph from '../DataStructures/Graph';

const rows = 3;
const cols = 5;

const generateEmptyGrid = () => {
    return new Array(rows*cols).fill(0);
}

const addEdge = (graph, node) => {
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

const restoreEdge = (graph, node) => {
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

const generateGraph = () => {
    const graph = new Graph(Graph.UNDIRECTED);
    let total = rows*cols;
    for (let count = 0; count<total; count++) {
        addEdge(graph, count);
    }
    return graph;
}


const Pathfinder = () => {
    const [grid, setGrid] = useState(() => {
        return generateEmptyGrid();
    });
    const gridRef = useRef(grid);
    gridRef.current = grid;

    const [graph, setGraph] = useState(() => {
       return generateGraph();
    });

    const [start, setStart] = useState( () => {
        return (Math.floor(rows/2) + Math.floor(cols/4)*cols)
    });
    const [end, setEnd] = useState(() => {
        return (Math.floor(rows/2)*3 + Math.floor(cols/4)*cols)
    });

    useEffect(() => {
        const newGrid = produce(grid, gridCopy => {
            gridCopy[start] = "START";
            gridCopy[end] = "END";
        });
        setGrid(newGrid);
    }, [start,end])

    const [selectedAlgorithm, setAlgo] = useState(0);

    const [path, setPath] = useState([]);
    const pathRef = useRef(path);
    pathRef.current = path;

    const [running, setRunning] = useState(false);
    const runningRef = useRef(running);
    runningRef.current = running;

    const handleClickTest = () => {
        const first = graph.getVertex(0);
        const visitedOrder = graph.bfs2(first);
        setPath(visitedOrder);
    }

    const runSimulation = useCallback(visitList => {
        if (!runningRef.current || pathRef.current.length === 0) {
            setRunning(false);
            return;
        }
        //simulate.
        let idx = pathRef.current[0];
        const newGrid = produce(gridRef.current, gridCopy => {
            gridCopy[idx] = 1;
            
        });
        setGrid(newGrid);
        setPath(pathRef.current.slice(1));
        setTimeout(runSimulation, 100);
    }, []);


    const runClick = () => {
        setRunning(!running);
        if (!running) {
            runningRef.current = true;
            runSimulation();
        }
    }
    const handleDFS = () => {
        let first = graph.getVertex(0);
        const visitedPath = graph.dfs2(first);
        setPath(visitedPath);
    }
    
    const addWall = (e) => {
        let clickedVal = parseInt(e.target.getAttribute('value'));

        //Modify grid
        const newGrid = produce(grid, gridCopy => {
            gridCopy[clickedVal] === "WALL" ? gridCopy[clickedVal] = 0 : gridCopy[clickedVal] =  "WALL";
        });
        setGrid(newGrid);

        //Modify graph
        if (grid[clickedVal] === 0) {
            graph.removeVertex(clickedVal);
            //TODO: Recalculate path with selected algo.
        }
        else if (grid[clickedVal] === "WALL") {
            graph.addVertex(clickedVal);
            restoreEdge(graph, clickedVal);
        }
    }

    const handleClear = () => {
        const newGraph = generateGraph();
        setGraph(newGraph);
        setGrid(new Array(rows*cols).fill(0))
    }

    const runAlgo = () => {
        let startNode = graph.getVertex(start);
        setPath(graph.getAlgo(selectedAlgorithm)(startNode));
    }

    const handleDropdownChange = e => {
        setAlgo(e.target.value);
        runAlgo();
        console.log(path)
    }

    const generateClassName = (value) => {
        console.log(value);
        if (value === 1) {
            return 'node-visited';
        }
        else if (value === "WALL") {
            return 'node-wall'
        }
        else if (value === "START") {
            return 'node-start'; 
        }
        else if (value === "END") {
            return 'node-end';
        }
        else {
            return ''
        }
    }

    return (
        <div className="container">
            <div className="grid">
                {grid.map((cell, idx) => (
                    <div value={idx}
                    onClick={(e) => addWall(e)}
                        key={idx} className={`node ${generateClassName(cell)}`}>
                    </div>
                ))}
            </div>
            <div>
                <select onChange={(e) => handleDropdownChange(e)} name="" id="">
                    <option value="0">BFS</option>
                    <option value="1">DFS</option>
                </select>
            </div>
            <div className="buttons">
                <button onClick={() => console.log(graph.printConnections())}>graph</button>
                <button onClick={() => console.log(grid)}>grid</button>
                <button onClick={() => console.log(path)}>Show path</button>
                <button onClick={() => runClick()}>{running ? 'stop' : 'start'}</button>
                <button onClick={() => handleClear()}>Clear</button>
                <button onClick={() => runAlgo()}>Run algo</button>
            </div>

            <div className="info">
                <pre>{graph.getConnections()}</pre>
            </div>
        </div>
    )
}

export default Pathfinder;

