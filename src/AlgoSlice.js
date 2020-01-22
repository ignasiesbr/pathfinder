import {createSlice} from '@reduxjs/toolkit';
import {generateEmptyGrid} from './utils/helpersGrid';
import {cols, rows} from './utils/constants';


const initialState = {
    selectedAlgorithm: 2,
    visitPath: [],
    foundPath: [],
    grid: generateEmptyGrid(),
    start: "243",
    end: "262",
    isDragging: false,
    addingWall: false,
    latestDrag: null,
    itemDragging: null,
    graphChange: {type:"", value:""}
};

console.log((Math.floor(rows/2) + Math.floor(cols/4)*cols),(Math.floor(rows/2)*3 + Math.floor(cols/4)*cols) )

const algoSlice = createSlice({
    name:'algo',
    initialState: initialState,
    reducers: {
        setStart: {
            reducer(state, action) {
                state.start = action.payload.start
            },
            prepare(newStart) {
                return { payload: {start:newStart}}
            }
        },
        setEnd: {
            reducer(state, action) {
                state.end = action.payload.end
            },
            prepare(newEnd) {
                return { payload: {end:newEnd}}
            }
        },
        setGrid: {
            reducer(state, action) {
                state.grid[action.payload.index] = action.payload.value
            },
            prepare(index, value) {
                return {payload: {index: index, value: value}}
            }
        },
        clearGrid(state) {
            state.grid = generateEmptyGrid()
        },
        setSelected: {
            reducer(state, action) {
                state.selectedAlgorithm = action.payload.value
            },
            prepare(val) {
                return {payload: {value: val}}
            }
        },
        setVisitPath: {
            reducer(state,action) {
                state.visitPath = action.payload.visitPath;
            },
            prepare(path) {
                return {payload: {visitPath: path}}
            }
        },
        setFoundPath(state, action) {
            state.foundPath = action.payload.foundPath
        },
        setDragging: {
            reducer(state, action) {
                state.isDragging = action.payload.isDragging
            },
            prepare(b) {
                return {payload: {isDragging:b}}
            }
        },
        setAddingWall: {
            reducer(state,action) {
                state.addingWall = action.payload.isAdding
            },
            prepare(b) {
                return {payload: {isAdding: b}}
            }
        },
        setLatestDrag: {
            reducer(state, action) {
                state.latestDrag = action.payload.latest
            },
            prepare(newCell) {
                return {payload: {latest: newCell}}
            }
        },
        setItemDragging: {
            reducer(state, action) {
                state.itemDragging = action.payload.item
            },
            prepare(item) {
                return {payload: {item: item}}
            }
        },
        setGraphChange: {
            reducer(state, action) {
                state.graphChange = {type: action.payload.type, value: action.payload.value}
            },
            prepare(action) {
                return {payload: {type: action.type, value:action.value}}
            }
        }
        
    }
});

export const {setStart, setEnd, setGrid, setSelected, setVisitPath, setFoundPath, 
    clearGrid, setDragging, setAddingWall, setLatestDrag, setItemDragging, setGraphChange} = algoSlice.actions;

export default algoSlice.reducer;