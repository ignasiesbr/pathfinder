import React from 'react';
import withPropsChecker from './withPropsChecker'
const Cell = React.memo(({dragEnd, dragStart, dragOver, value, whenClick, cName}) => {

    const renders = React.useRef(0);

    {/* onDragOver={e => dragOver(e)} */}
    return (
        <div
            draggable
            onDragEnd={(e) => dragEnd(e)}
            onDragStart={e => dragStart(e)}
            value={value}
            onClick={(e) => {
                whenClick(e);
                }}
            className={cName}>{renders.current++}
        </div>
)}, (prevProps, nextProps) => {
    if (prevProps.value != nextProps.value || prevProps.cName != nextProps.cName) {
        return false;
    }
    return true;
});



export default (Cell);
