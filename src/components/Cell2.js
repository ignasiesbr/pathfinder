import React, {useRef} from 'react'
import { connect } from 'react-redux';
import {setStart, setGrid, setLatestDrag, setDragging, setItemDragging, setGraphChange} from '../AlgoSlice';

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

const Cell2 = React.memo(({value, cellVal, setLatestDrag, setDragging, setItemDragging, addingWall, setGrid, setGraphChange}) => {

    const handleClick = () => {
        let newVal;
        //ADDING WALL
        if (addingWall) {
            newVal = cellVal === "WALL" ? 0 : "WALL";
            setGrid(value, newVal);
            let obj = {type: `${newVal === 0 ? "REMOVE_WALL" : "ADD_WALL"}` , value: value}
            setGraphChange(obj);
        }

        //ADDING WEIGHT
        else {
            newVal = cellVal === "WEIGHT" ? 0 : "WEIGHT";
            setGrid(value, newVal);
            let obj = {type: `${newVal === 0 ? "REMOVE_WEIGHT" : "ADD_WEIGHT"}` , value: value}
            setGraphChange(obj);
        }
    }

    return (
        <div
            draggable
            onDragStart={() => {
                if (cellVal === "START") {
                    setItemDragging("START");
                    setDragging(true);
                }
                else if (cellVal === "END") {
                    setItemDragging("END");
                    setDragging(true);
                }
            }}
            onDragOver={(e) => setLatestDrag(e.target.getAttribute('value'))}
            onDragEnd={() => {
                setDragging(false);
            }}
            onClick={() => handleClick()}
            value={value}
            className={`node ${generateClassName(cellVal)}`}>
        </div>
    )
})

const mapStateToProps = state => ({
    addingWall: state.addingWall
})

const mapDispatch = {setStart, setGrid, setLatestDrag, setDragging, setItemDragging, setGraphChange}

export default connect(mapStateToProps, mapDispatch)(Cell2);
