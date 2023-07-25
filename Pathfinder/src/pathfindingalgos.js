//input will be a 2d array, with row and columns
//passed in will be the start and end point
//passed in will also be the location of the walls

//https://javascript.info/object-copy

export function astar(
    startRow,
    startColumn,
    endRow,
    endColumn,
    wallList,
    verticalCount,
    horizontalCount,
    isDiagonal
  ) {
    const grid = getGrid(
      verticalCount,
      horizontalCount,
      startRow,
      startColumn,
      endRow,
      endColumn,
      wallList
    )
    //here, we find the start node and set it's distance to 0
    grid[startRow][startColumn].distance = 0
    grid[startRow][startColumn].heuristicDistance = 0
    //we begin with an empty array, for the nodes visited in order
    console.log(isDiagonal)
    const visitedNodesinOrder = []
    //next, we initialise an array of the possible, unvisited nodes
    const unvisitedNodes = getGridList(grid)
    while (!!unvisitedNodes) {
      sortUnvisitedNodesAStar(unvisitedNodes)
      const currentNode = unvisitedNodes.shift()
      //if the currentNode is a wall, ignore
      if (currentNode.isWallNode) {
        continue
      }
      //if the nearest node is at a distance of infinity, its trapped and hence should stop
      if (currentNode.distance === Infinity) {
        return visitedNodesinOrder
      }
      //if we got to this point, we can be said to have visited the node
      currentNode.isVisited = true
      visitedNodesinOrder.push(currentNode)
      if (currentNode.isEndNode) {
        return visitedNodesinOrder
      }
      //lastly, if this is a normal node and it hasnt concluded, we need to update the adjacent nodes with their new distances from the start node, and then state who their closest neighbour is
      updateUnvisitedNodes(currentNode, grid, endRow, endColumn, isDiagonal)
    }
  }
  
  function sortUnvisitedNodesAStar(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.heuristicDistance - nodeB.heuristicDistance)
  }
  
  export function dijkstra(
    startRow,
    startColumn,
    endRow,
    endColumn,
    wallList,
    verticalCount,
    horizontalCount,
    isDiagonal
  ) {
    const grid = getGrid(
      verticalCount,
      horizontalCount,
      startRow,
      startColumn,
      endRow,
      endColumn,
      wallList
    )
    //here, we find the start node and set it's distance to 0
    grid[startRow][startColumn].distance = 0
    //we begin with an empty array, for the nodes visited in order
  
    const visitedNodesinOrder = []
    //next, we initialise an array of the possible, unvisited nodes
    const unvisitedNodes = getGridList(grid)
    while (!!unvisitedNodes) {
      sortUnvisitedNodesDijkstra(unvisitedNodes)
      const currentNode = unvisitedNodes.shift()
      //if the currentNode is a wall, ignore
      if (currentNode.isWallNode) {
        continue
      }
      //if the nearest node is at a distance of infinity, its trapped and hence should stop
      if (currentNode.distance === Infinity) {
        return visitedNodesinOrder
      }
      //if we got to this point, we can be said to have visited the node
      currentNode.isVisited = true
      visitedNodesinOrder.push(currentNode)
      if (currentNode.isEndNode) {
        return visitedNodesinOrder
      }
      //lastly, if this is a normal node and it hasnt concluded, we need to update the adjacent nodes with their new distances from the start node, and then state who their closest neighbour is
      updateUnvisitedNodes(currentNode, grid, endRow, endColumn, isDiagonal)
    }
  }
  
  //function makes a grid for us to play with
  function getGrid(
    verticalCount,
    horizontalCount,
    startRow,
    startColumn,
    endRow,
    endColumn,
    wallList
  ) {
    const grid = []
    for (var row = 0; row < verticalCount; row++) {
      const rowEntry = []
      for (var column = 0; column < horizontalCount; column++) {
        // here, 4 options: normal node, start node, end node, wall node
        if (row === startRow && column === startColumn) {
          rowEntry.push({
            row,
            column,
            previousNode: null,
            distance: Infinity,
            heuristicDistance: Infinity,
            isStartNode: true,
            isEndNode: false,
            isWallNode: false,
            isVisited: false
          })
        } else if (row === endRow && column === endColumn) {
          rowEntry.push({
            row,
            column,
            previousNode: null,
            distance: Infinity,
            heuristicDistance: Infinity,
            isStartNode: false,
            isEndNode: true,
            isWallNode: false,
            isVisited: false
          })
        } else if (isWallNode(wallList, row, column)) {
          rowEntry.push({
            row,
            column,
            previousNode: null,
            distance: Infinity,
            heuristicDistance: Infinity,
            isStartNode: false,
            isEndNode: false,
            isWallNode: true,
            isVisited: false
          })
        } else {
          rowEntry.push({
            row,
            column,
            previousNode: null,
            distance: Infinity,
            heuristicDistance: Infinity,
            isStartNode: false,
            isEndNode: false,
            isWallNode: false,
            isVisited: false
          })
        }
      }
      grid.push(rowEntry)
    }
    return grid
  }
  
  //helper function to check if the node is a Wall Node, when generating the grid to be used in the algorithm
  function isWallNode(wallList, row, column) {
    for (var entry = 0; entry < wallList.length; entry++) {
      if (wallList[entry][0] === row && wallList[entry][1] === column) {
        return true
      }
    }
    return false
  }
  
  //creates an 1d array of existing node
  function getGridList(grid) {
    const gridList = []
    for (var row = 0; row < grid.length; row++) {
      for (var column = 0; column < grid[row].length; column++) {
        gridList.push(grid[row][column])
      }
    }
    return gridList
  }
  
  //sorting list of Unvisited Nodes
  function sortUnvisitedNodesDijkstra(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance)
  }
  
  function updateUnvisitedNodes(currentNode, grid, endRow, endColumn, isDiagonal) {
    //here, we need to update the adjacent unvisited nodes. We of course first need to retrieve them.
    const unvisitedHorizontalNeighbours = getUnvisitedHorizontalNeighbours(currentNode, grid)
    for (const neighbour of unvisitedHorizontalNeighbours) {
      //following 2 lines only apply to astar, not djikstra's
      const { row, column } = neighbour
      const estimateToGo = Math.abs(row - endRow) + Math.abs(column - endColumn)
      if (neighbour.distance > currentNode.distance + 1) {
        neighbour.distance = currentNode.distance + 1
        //following line only apply to astar, not djikstra's
        neighbour.heuristicDistance = currentNode.distance + 1 + estimateToGo
        neighbour.previousNode = currentNode
      }
    }
    if (isDiagonal) {
      const unvisitedDiagonalNeighbours = getUnvisitedDiagonalNeighbours(currentNode, grid)
      for (const neighbour of unvisitedDiagonalNeighbours) {
        //following 2 lines only apply to astar, not djikstra's
        const { row, column } = neighbour
        const estimateToGo = Math.abs(row - endRow) + Math.abs(column - endColumn)
        if (neighbour.distance > currentNode.distance + 1.4142135624) {
          neighbour.distance = currentNode.distance + 1.4142135624
          //following line only apply to astar, not djikstra's
          neighbour.heuristicDistance = currentNode.distance + 1.4142135624 + estimateToGo
          neighbour.previousNode = currentNode
        }
      }
    }
  }
  
  function getUnvisitedHorizontalNeighbours(currentNode, grid) {
    const unvisitedNodes = []
    const { column, row } = currentNode
    if (row > 0) unvisitedNodes.push(grid[row - 1][column])
    if (row < grid.length - 1) unvisitedNodes.push(grid[row + 1][column])
    if (column > 0) unvisitedNodes.push(grid[row][column - 1])
    if (column < grid[0].length - 1) unvisitedNodes.push(grid[row][column + 1])
    return unvisitedNodes.filter((node) => !node.isVisited)
  }
  
  function getUnvisitedDiagonalNeighbours(currentNode, grid) {
    const unvisitedNodes = []
    const { column, row } = currentNode
    if (row > 0 && column > 0) unvisitedNodes.push(grid[row - 1][column - 1])
    if (row > 0 && column < grid[0].length - 1) unvisitedNodes.push(grid[row - 1][column + 1])
    if (row < grid.length - 1 && column > 1) unvisitedNodes.push(grid[row + 1][column - 1])
    if (row < grid.length - 1 && column < grid[0].length - 1)
      unvisitedNodes.push(grid[row + 1][column + 1])
    return unvisitedNodes.filter((node) => !node.isVisited)
  }
  
  export function getShortestPath(visitedNodesinOrder) {
    const finalNode = visitedNodesinOrder.pop()
    const shortestPath = []
    var currentNode = finalNode
    while (currentNode) {
      shortestPath.unshift(currentNode)
      currentNode = currentNode.previousNode
    }
    return shortestPath
  }  