//input will be a 2d array, with row and columns
//passed in will be the start and end point
//passed in will also be the location of the walls

export function dijkstra(startRow, startColumn, endRow, endColumn, wallList, verticalCount, horizontalCount){
    return getGrid(verticalCount, horizontalCount, startRow, startColumn, endRow, endColumn, wallList);
}

//function makes a grid for us to play with
function getGrid(verticalCount, horizontalCount, startRow, startColumn, endRow, endColumn, wallList){
    const grid = [];
    for (var row = 0; row < verticalCount; row++){
        for (var column = 0; column < horizontalCount; column++){
            // here, 4 options: normal node, start node, end node, wall node
            if (row === startRow && column === startColumn){
                grid.push({row, column, distance: Infinity, isStartNode: true , isEndNode: false, isWallNode: false});
            }
            else if (row === endRow && column === endColumn){
                grid.push({row, column, distance: Infinity, isStartNode: false , isEndNode: true, isWallNode: false});
            }
            else{ //not a start or end node --> must be a wall node, or just a plain ol' node
                for (var entry = 0; entry < wallList.length; entry++){
                    if (wallList[entry][0] === row && wallList[entry][1] === column){
                        grid.push({row, column, distance: Infinity, isStartNode: false , isEndNode: false, isWallNode: true});
                    }
                }
            }
        }
    }
    return grid;
}