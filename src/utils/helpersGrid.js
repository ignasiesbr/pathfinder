import {cols, rows} from './constants'

export const generateEmptyGrid = () => {
    return new Array(rows*cols).fill(0);
}
