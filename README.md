# Pathfinder grid visualizer using React.

This educational project can be checked in action in <https://ignasiesbr.github.io/pathfinder-react/>

The algorithms implemented in this moment are:

1. BFS

   Graph traversal algorithm. Can find the shortest path in unweighted graphs.

2. DFS

   Graph traversal algorithm. It does not find the shortest path.

3. Dijkstra

   Main shortest path algorithm.

4. A * 

   Informed search algorithm. It uses a heuristic to speed up the search for the shortest path.

All the code in this repository uses the recent React feature *Hooks*.

To navigate through the project here is some guidance:

+ In the root of the *.src* folder we can find the *App.css*, *App.js*, *index.js* and finally the *AlgoSlice.js*. The three first files are self-explanatory. The *AlgoSlice.js* one is the one that takes care of creating the reducers and actions creators using the *@reduxjs/toolkit* that allows us to use Redux reducing its boilerplate.

+ In the *components* folder we can find the *Cell, Header, Info and Pathfinder* components. These are the ones that give the main functionality to the project. Specially the *Cell and Pathfinder* ones.

+ To calculate the various shortest paths the project creates a graph using the Data Structures found in the *DataStructures* folder inside the */src*.

Hope you like this small and quick project that I used to improve my knowledge in data structures and React.

