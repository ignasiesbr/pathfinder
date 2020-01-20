import React, {useState, useCallback, useRef, useEffect} from 'react'
import {connect} from 'react-redux';
import {restoreEdge, addWeight, generateGraph ,getPredList} from '../utils/helpersGraph';

import {setStart, setEnd, setItemDragging} from '../AlgoSlice';
import {setGrid, clearGrid, setVisitPath, setDragging, setAddingWall}  from '../AlgoSlice';
import Cell2 from './Cell2';


const Pathfinder = ({start, end, setStart, setEnd, grid, setGrid, clearGrid, 
    selectedAlgorithm, isDraggin, setVisitPath, setAddingWall, addingWall, latestDrag,itemDragging, setItemDragging, graphChange}) => {

    const [graph, setGraph] = useState(() => {  
       return generateGraph();
    });


    const gridRef = useRef(grid);
    gridRef.current = grid;

    //SETTING START AND END IN THE GRID.
    useEffect(() => {
        setGrid(parseInt(start),"START");
        setGrid(parseInt(end),"END");
    }, [start,end, graph]);

    const [running, setRunning] = useState(false);
    const runningRef = useRef(running);
    runningRef.current = running;

    // Ref for end to useCallback in runSimulation
    const endRef = useRef(parseInt(end));
    endRef.current = parseInt(end);
    const startRef = useRef(parseInt(start));
    startRef.current = parseInt(start);
    const selectedRef = useRef(selectedAlgorithm);
    selectedRef.current = selectedAlgorithm;

    const isDraggingRef = useRef(isDraggin);
    isDraggingRef.current = isDraggin;

    const runSimulation = useCallback((visited, found=[], val=1) => {
        let tmp = visited.map(n =>n);

        const helper = async () => {
            if (!runningRef.current || tmp.length === 0 ) {
                setRunning(false);
                return;
            }
            let idx = tmp[0];
            if (idx === parseInt(endRef.current)) {
                runSimulation(found, [],"FOUND");
            }
            else {
                setGrid(idx, val);
                tmp = tmp.splice(1);
                setTimeout(helper, 1);
            }
        };
        helper();
    }, []);

    const runClick = useCallback(() => {
        setRunning(!runningRef.current);
        runningRef.current = (!runningRef.current);
        if (!running) {
            let startNode = graph.getVertex(parseInt(startRef.current));
            let endNode = graph.getVertex(parseInt(endRef.current));
            let resList;
            switch(selectedRef.current) {
                //DFS and BFS
                case 0:
                case 1:
                case 2:
                    let path = graph.getAlgo(selectedRef.current).bind(graph)(startNode);
                    setVisitPath(path)
                    resList = getPredList(endNode, parseInt(startRef.current));
                    runSimulation(path, resList);
                    break;
                case 3:
                    let paths = graph.getAlgo(selectedRef.current).bind(graph)(startNode, endNode);
                    setVisitPath(paths[1]);
                    runSimulation(paths[1], paths[0]);
            }
        }
    }, [graph]);

    const handleClear = () => {
        const newGraph = generateGraph();
        setGraph(newGraph);
        clearGrid();
    }

    const removeOthers = () => {
        grid.map((cell, idx) => {
            if (cell !== 0) {
                if (idx === start || idx === end) {

                }
                else {
                    setGrid(idx, 0);
                }
            }
        }
        ) 
    }

    //Drag handler
    useEffect(() => {
        if (latestDrag && !isDraggin) {
            if (itemDragging === "START") {
                setStart(latestDrag);
                removeOthers();
                setItemDragging(null);
            }
            else if (itemDragging === "END") {
                setEnd(latestDrag)
                removeOthers();
                setItemDragging(null)
            }
        }
    }, [latestDrag, isDraggin]);

    useEffect(() => {
        let value = graphChange.value;
        let type = graphChange.type;
        let weight;
        switch(type) {
            case "ADD_WALL":
                graph.removeVertex(value);
                break;
            case "REMOVE_WALL":
                graph.addVertex(value);
                restoreEdge(graph, value);
                break;
            case "ADD_WEIGHT":
                weight = 10;
                addWeight(graph, value,weight);
                break;
            case "REMOVE_WEIGHT":
                weight = 1;
                addWeight(graph, value,weight);
                break;
        }
    }, [graphChange]);

    return (
        <div className="container">
            <div className="grid">
                {grid.map((cell, idx) =>
                <Cell2 value={idx} cellVal={cell} key={idx} />
                )}  
            </div>
            <div>
            </div>    
            <div className="buttons">
                <button onClick={() => runClick()}>{running ? 'STOP' : 'START'}</button>
                <button onClick={() => handleClear()}>Clear</button>
                <button onClick={() => setAddingWall(!addingWall)}>{addingWall ? "Adding Wall" : "Adding weight"}</button>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    start: state.start,
    end: state.end,
    grid: state.grid,
    path: state.visitPath,
    selectedAlgorithm: state.selectedAlgorithm,
    isDraggin: state.isDragging,
    addingWall: state.addingWall,
    latestDrag: state.latestDrag,
    itemDragging: state.itemDragging,
    graphChange: state.graphChange
})

const mapDispatchToProps = {setStart, setEnd, setGrid, clearGrid, setVisitPath, setDragging, setAddingWall, setItemDragging}

export default connect(mapStateToProps, mapDispatchToProps)(Pathfinder);