import React, {useState} from 'react'

const Node = ({x, y}) => {

    const [pos, setPos] = useState({x:x, y:y});
    const [adjacents, setAdjacents] = useState([]);
    const [visited, setVisited] = useState(false);

    const addAdjacent = (node) => {
        setAdjacents(adjacents.push(node));
    };

    const removeAdjacent = (node) => {
        const index = adjacents.indexOf(node);
        if (index > -1) {
            setAdjacents(adjacents.splice(index, 1));
            return node;
        }
    }

    const getAdjacents = () => adjacents;

    const isAdjacent = (node) => {
        return adjacents.indexOf(node) > -1;
    }

    const handleClick = () => {
        setVisited(!visited);
        console.log(pos);
    }
    return (
        <div className={`node ${visited ? `node-visited` : ""}`} onClick={() => handleClick()}></div>
    )
}

export default Node
