import React from 'react'
import { connect } from 'react-redux';
import {setSelected} from '../AlgoSlice';



const Header = ({setSelected}) => {

    const handleDropdownChange = e => {
        setSelected(parseInt(e.target.value));
    }

    return (
        <div className="header">
            <div className="logo">
                Pathfinder visualizer
            </div>
            <span className="select-name">Selected algorithm:</span>
            <select defaultValue={2} className="select" onChange={(e) => handleDropdownChange(e)} name="" id="">
                    <option value={0}>BFS</option>
                    <option value={1}>DFS</option>
                    <option value={2}>Dijkstra</option>
                    <option value={3}>A*</option>
            </select>
        </div>
    )
}

const mapStateToProps = state => ({
    selected: state.selectedAlgorithm
})
const mapDispatchToProps = {setSelected}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
