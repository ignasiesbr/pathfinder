import React, {useState, useCallback, useRef, useEffect} from 'react'
import produce from 'immer';
import Graph from '../DataStructures/Graph';

const rows = 5;
const cols = 8;

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

const addWeight = (graph, node, weight) => {
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

const generateGraph = () => {
    const graph = new Graph(Graph.UNDIRECTED);
    let total = rows*cols;
    for (let count = 0; count<total; count++) {
        addEdge(graph, count);
    }
    return graph;
}

const getPredList = (node, start) => {
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

const getFoundBfsDfs = (start, end, path) => {
    let index1 = path.indexOf(parseInt(start));
    let index2 = path.indexOf(parseInt(end));
    let res = path.slice(index1,index2+1);
    console.log(res);
    return res

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
        return "" + (Math.floor(rows/2) + Math.floor(cols/4)*cols)
    });
    const [end, setEnd] = useState(() => {
        return "" + (Math.floor(rows/2)*3 + Math.floor(cols/4)*cols)
    });
    const [isDraggin, setIsDraggin] = useState({start:false, end:false});
    const [addingWall, setAddingWall] = useState(true);

    useEffect(() => {
        const newGrid = produce(grid, gridCopy => {
            gridCopy[start] = "START";
            gridCopy[end] = "END";
        });
        setGrid(newGrid);
    }, [start,end, graph])

    const [selectedAlgorithm, setAlgo] = useState(0);

    const [path, setPath] = useState([]);
    const pathRef = useRef(path);
    pathRef.current = path;

    const [foundPath, setFoundPath] = useState([]);
    const foundPathRef = useRef(foundPath);
    foundPathRef.current = foundPath;

    const [running, setRunning] = useState(false);
    const runningRef = useRef(running);
    runningRef.current = running;

    const [runningFound, setRunningFound] = useState(false);

    const runSimulation = useCallback(() => {
        if (!runningRef.current || pathRef.current.length === 0) {
            setRunning(false);
            return;
        }
        //simulate.
        let idx = pathRef.current[0];
        if (idx == end) {
            setRunning(false);
            setRunningFound(true);
            runFoundAnimation();
        }
        else {
            const newGrid = produce(gridRef.current, gridCopy => {
                gridCopy[idx] = 1;
                
            });
            setGrid(newGrid);
            setPath(pathRef.current.slice(1));
            setTimeout(runSimulation, 100);
        }
    }, []);


    const runFoundAnimation = () => {
        if (foundPathRef.current.length === 0) {
            setRunningFound(false);
            return;
        }
        let idx = foundPathRef.current[0];
        const newGrid = produce(gridRef.current, gridCopy => {
            gridCopy[idx] = "FOUND";
        });
        setGrid(newGrid);
        setFoundPath(foundPathRef.current.slice(1));
        setTimeout(runFoundAnimation, 100);
    }

    const runClick = () => {
        setRunning(!running);
        if (!running) {
            runningRef.current = true;
            runSimulation();
        }
    }
    
    const handleClickDiv = (e) => {
        let clickedVal = parseInt(e.target.getAttribute('value'));
        if (clickedVal == start || clickedVal == end) {
            return;
        }
        if (addingWall) {
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

        //Add weight
        else if (grid[clickedVal] == 0){
            let weight = 10;
            addWeight(graph, clickedVal,weight);
            const newGrid = produce(grid, gridCopy => {
                gridCopy[clickedVal] === "WEIGHT" ? gridCopy[clickedVal] = 0 : gridCopy[clickedVal] =  "WEIGHT";
            });
            setGrid(newGrid);
        }

        else if(grid[clickedVal] === "WEIGHT") {
            let weight = 1;
            addWeight(graph, clickedVal,weight);
            const newGrid = produce(grid, gridCopy => {
                gridCopy[clickedVal] === "WEIGHT" ? gridCopy[clickedVal] = 0 : gridCopy[clickedVal] =  "WEIGHT";
            });
            setGrid(newGrid);
        }
    }

    const handleClear = () => {
        const newGraph = generateGraph();
        setGraph(newGraph);
        setGrid(new Array(rows*cols).fill(0));
    }

    const runAlgo = (algo) => {
        let startNode = graph.getVertex(parseInt(start));
        let path = graph.getAlgo(algo).bind(graph)(startNode);
        setPath(path);
        return path;
    }


    const generateClassName = (value) => {
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
        else if (value === "WEIGHT") {
            return 'node-weight';
        }
        else if (value === "FOUND") {
            return 'node-found';
        }
        else {
            return ''
        }
    }

    //HANDLE ALGORITHM DROPDOWN
    const handleDropdownChange = e => {
        setAlgo(e.target.value);
        let p = runAlgo(e.target.value);
        setFoundPath(getFoundBfsDfs(start, end, p));
        // setGraph(generateGraph());
    }

    // DRAG HANDLING
    //______________
    const handleDragStart =  e => {
        if (e.target.getAttribute('value') == start ) {
            setIsDraggin({start:true, end: false});
        }
        if (e.target.getAttribute('value') == end) {
            setIsDraggin({start:false, end:true});
        }
    }
    const handleDrag = e => {
        let isDragginStart = isDraggin.start;
        let isDragginEnd = isDraggin.end;
        
        if (!isDragginStart && !isDragginEnd) {
            return;
        }
        if (isDragginStart) {
            let newCell = e.target.getAttribute("value");
            if (newCell !== start) {
                let newGrid = produce(grid, gridCopy => {
                    gridCopy[start] = 0;
                });
                setGrid(newGrid);
                setStart(newCell);
            }
        }
        
        if (isDragginEnd) {
            let newCell = e.target.getAttribute("value");
            if (newCell !== end) {
                let newGrid = produce(grid, gridCopy => {
                    gridCopy[end] = 0;
                });
                setGrid(newGrid);
                setEnd(newCell);
            }
        }
    };
    const handleDragEnd = () => {
        setIsDraggin(false);
        runAlgo(selectedAlgorithm);
    }



    const test = () => {
        console.log(start, end);
        runAlgo(2);
        console.log(end);
        let endNode = graph.getVertex(parseInt(end));
        console.log(endNode);
        let resList = getPredList(endNode, parseInt(start));
        setFoundPath(resList);
        console.log(resList);
        runFoundAnimation();
    }
    return (
        <div className="container">
            <div className="grid">
                {grid.map((cell, idx) => (
                    <div 
                        draggable
                        onDragEnd={() => handleDragEnd()}
                        onDragStart={e => handleDragStart(e)}
                        onDragOver={e => handleDrag(e)}
                        value={idx}
                        onClick={(e) => handleClickDiv(e)}
                        key={idx} className={`node ${generateClassName(cell)}`}>
                    </div>
                ))}
            </div>
            <div>
                <select onChange={(e) => handleDropdownChange(e)} name="" id="">
                    <option value="0">BFS</option>
                    <option value="1">DFS</option>
                    <option value="2">Dijkstra</option>
                </select>
            </div>
            <div className="buttons">
                <button onClick={() => console.log(graph.printConnections())}>graph</button>
                <button onClick={() => console.log(grid)}>grid</button>
                <button onClick={() => console.log(path)}>Show path</button>
                <button onClick={() => runClick()}>{running ? 'stop' : 'start'}</button>
                <button onClick={() => handleClear()}>Clear</button>
                <button onClick={() => runAlgo(selectedAlgorithm)}>Run algo</button>
                <button onClick={() => setAddingWall(!addingWall)}>{addingWall ? "Adding Wall" : "Adding weight"}</button>
                <button onClick={() => test()}>show start and end</button>
                <button onClick={() => console.log(foundPath)}>Show found path</button>
            </div>

            <div className="info">
                <pre>{graph.getConnections()}</pre>
            </div>
        </div>
    )
}

export default Pathfinder;

