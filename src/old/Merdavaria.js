// when removing wall
graph.addVertex(clickedVal);
            console.log(grid[clickedVal - 1], grid[clickedVal + 1], grid[clickedVal - 5], grid[clickedVal + 5]);
            //[left, right, top, bottom]
            let adjacents = [grid[clickedVal - 1], grid[clickedVal + 1], grid[clickedVal - 5], grid[clickedVal + 5]];
            adjacents.forEach((adj,idx) => {
                if (!(adj === "WALL" )) {
                    switch(idx) {
                        case 0:
                            if (!(clickedVal % cols === 0)) {
                                graph.addEdge(clickedVal, clickedVal-1);
                            }
                        case 1: 
                            if (!((clickedVal+1)%cols === 0)) {
                                graph.addEdge(clickedVal, clickedVal+1);
                            }
                        case 2: 
                            if (clickedVal >= cols) {
                                graph.addEdge(clickedVal, clickedVal-5)
                            }
                        case 3:
                            if (clickedVal+cols <= (cols*rows - 1)) {
                                graph.addEdge(clickedVal, clickedVal+5)
                            }
                    }
                }   
            })
            