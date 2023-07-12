//input will be a 2d array, with row and columns
//passed in will be the start and end point
//passed in will also be the location of the walls

//https://javascript.info/object-copy

export function dijkstra(startRow, startColumn, endRow, endColumn, wallList, verticalCount, horizontalCount){
    const grid = getGrid(verticalCount, horizontalCount, startRow, startColumn, endRow, endColumn, wallList);
    //here, we find the start node and set it's distance to 0
    grid[startRow][startColumn].distance = 0;
    //we begin with an empty array, for the nodes visited in order 
    
    const visitedNodesinOrder = [];
    //next, we initialise an array of the possible, unvisited nodes
    const unvisitedNodes = getGridList(grid); 
    while (!!unvisitedNodes){
	    sortUnvisitedNodes(unvisitedNodes);
        const currentNode = unvisitedNodes.shift()
        //if the currentNode is a wall, ignore
        if (currentNode.isWallNode){
            continue;
        }
        //if the nearest node is at a distance of infinity, its trapped and hence should stop
        if (currentNode.distance === Infinity){
            return visitedNodesinOrder;
        }
        //if we got to this point, we can be said to have visited the node
        currentNode.isVisited = true;
        visitedNodesinOrder.push(currentNode);
        if (currentNode.isEndNode){
            return visitedNodesinOrder;
        }
        //lastly, if this is a normal node and it hasnt concluded, we need to update the adjacent nodes with their new distances from the start node, and then state who their closest neighbour is
        updateUnvisitedNodes(currentNode, grid);
    }
}

//function makes a grid for us to play with
function getGrid(verticalCount, horizontalCount, startRow, startColumn, endRow, endColumn, wallList){
    const grid = [];
    for (var row = 0; row < verticalCount; row++){
        for (var column = 0; column < horizontalCount; column++){
            // here, 4 options: normal node, start node, end node, wall node
            if (row === startRow && column === startColumn){
                grid.push({row, column, previousNode: null, distance: Infinity, isStartNode: true , isEndNode: false, isWallNode: false, isVisited: false});
            }
            else if (row === endRow && column === endColumn){
                grid.push({row, column, previousNode: null, distance: Infinity, isStartNode: false , isEndNode: true, isWallNode: false, isVisited: false});
            }
            else if (isWallNode(wallList, row, column)){
		        grid.push({row, column, previousNode: null, distance: Infinity, isStartNode: false , isEndNode: false, isWallNode: true, isVisited: false});
            }
	        else{
		        grid.push({row, column, previousNode: null, distance: Infinity, isStartNode: false , isEndNode: false, isWallNode: false, isVisited: false});
	        }
        }
    }
    return grid;
}

//helper function to check if the node is a Wall Node, when generating the grid to be used in the algorithm
function isWallNode(wallList, row, column){
    for (var entry = 0; entry < wallList.length; entry++){
        if (wallList[entry][0] === row && wallList[entry][1] === column){
            return true;
        }
    }
    return false;
}

//creates an 1d array of existing node
function getGridList(grid){
    const gridList = [];
    for (var row = 0; row < grid.length; row++){
        for (var column = 0; column < row.length; column++){
            gridList.push(grid[row][column]);
        }
    }
    return gridList;
}

//sorting list of Unvisited Nodes
function sortUnvisitedNodes(unvisitedNodes){
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
}

function updateUnvisitedNodes(currentNode, grid){
    //here, we need to update the adjacent unvisited nodes. We of course first need to retrieve them.
    const unvisitedNeighbours = getUnvisitedNeighbours(currentNode, grid);
    for (const neighbour of unvisitedNeighbours){
        if (neighbour.distance > (currentNode.distance + 1)){
            neighbour.distance = currentNode.distance + 1;
            neighbour.previousNode = currentNode; 
        }
    } 
}

function getUnvisitedNeighbours(currentNode, grid){
    const unvisitedNodes = [];
    const {col, row} = currentNode;
    if (row > 0) unvisitedNodes.push(grid[row - 1][col]);
    if (row < grid.length - 1) unvisitedNodes.push(grid[row + 1][col]);
    if (col > 0) unvisitedNodes.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) unvisitedNodes.push(grid[row][col + 1]);
    return unvisitedNodes.filter(node => !node.isVisited);
}


export function getShortestPath(visitedNodesinOrder){
    const finalNode = visitedNodesinOrder.pop();
    const shortestPath = [];
    const currentNode = finalNode;
    while (currentNode){
        shortestPath.unshift(currentNode);
        currentNode = currentNode.previousNode; 
    }
    return shortestPath;
}