import React, {useState} from 'react'

const Node = ({visited}) => {
    // console.log('rendering node', x, y)
    // const [pos, setPos] = useState({x:x, y:y});
    const [isVisited, setV] = useState(visited);
    return (
        <div className={`node ${isVisited ? `node-visited` : ""}`}></div>
    )
}

export default Node
