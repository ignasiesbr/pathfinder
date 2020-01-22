import React from 'react'
import { connect } from 'react-redux'

const algoList = ["Breadth first search", "Depth first search", "Dijkstra" ,"A*"]
const getInfo = selected => {
    switch(selected) {
        case 0:
            return "BFS gives us the shortest path for an unweighted undirected graph, it is used as a traversal graph algorithm."
        case 1:
            return "DFS does NOT give us the shortest path, it is used as a traversal graph algorithm"
        case 2:
            return "Dijkstra gives us the shortest path for weighted undirected or directed graphs. It is the most common shortest path algorithm"
        case 3:
            return "A* is a variation of the informed search graphs. It uses an heuristic to get the shortest path faster."

    }
}

const Info = ({selected, addingWall}) => {


    return (
        <div className="algo-info">
            <p className="info-text">
                You have selected the {algoList[selected]} algorithm. <br></br>
                {getInfo(selected)}. <br></br>
                You are currently {addingWall ? " adding wall" : " adding weight"} (press to any cell in the grid to add a {addingWall ? " wall" : " weight"}).
                {addingWall ? " Walls are impassable." : " Passing through a weight costs 10 times more than passing through a blank cell."}<br></br>
                Drag and drop either the green cell (start) or the orange one (end) to change the path.
            </p>
            <div className="legend">
                <p>
                    <span className="legend-color legend-color__start"></span> <span>Start</span>
                </p>
                <p>
                   <span className="legend-color legend-color__end"></span> <span>End</span>
                </p>
                <p>
                    <span className="legend-color legend-color__wall"></span> <span>Wall</span>
                </p>
                <p>
                    <span className="legend-color legend-color__weight"></span> <span>Weight</span>
                </p>
                <p>
                    <span className="legend-color legend-color__visited"></span> <span>Visited cell</span>
                </p>
                <p>
                    <span className="legend-color legend-color__found"></span> <span>Shortest path cell</span>
                </p>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    selected: state.selectedAlgorithm,
    addingWall: state.addingWall
})

export default connect(mapStateToProps,null)(Info);
