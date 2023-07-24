//make recursion maze

//function will return the wallList, and this will be assigned to the ref wallList
export function generateMaze(horizontalCount, verticalCount, solveDiagonal) {
  const wallList = []
  //set the walls for the maze
  for (var row = 0; row < verticalCount; row++) {
    if (row === 0 || row === verticalCount - 1) {
      for (var column = 0; column < horizontalCount; column++) {
        wallList.push([row, column])
      }
    } else {
      wallList.push([row, 0])
      wallList.push([row, horizontalCount - 1])
    }
  }
  rescursiveMaze(1, 1, verticalCount - 2, horizontalCount - 2, wallList, solveDiagonal)
  //const wallObject = {wallList: wallList}
  return wallList //wallObject.wallList
}

//recursive maze generating function
//given a space, it chooses a random row/column to split the space with walls, then it runs the same
//algorithm on the 2 smaller spaces.
//we note here, since the first row has already been used, we do not use 0-indexing; instead, we count from 1

//this space should both be odd
function rescursiveMaze(startRow, startCol, endRow, endCol, wallList, solveDiagonal) {
  //end the generation is theres a row/column with only width one
  if (startRow === endRow || startCol === endCol) {
    return
  }
  //decide if the divide is vertical or horizontal (if horizontal width < vertical width, cut horizontally)
  if (endRow - startRow >= endCol - startCol) {
    // divide horizontally
    //choose a random even number to cut the grid
    const lowerBound = (startRow - 1) / 2 + 1 //these numbers are odd, cause the width of each space will always be odd
    const upperBound = (endRow - 1) / 2
    const wallRow = (Math.floor(Math.random() * (upperBound - lowerBound)) + lowerBound) * 2
    var avoidCol
    //add row to the wallList - but first, select a random square to not be selected
    //choose point based off whether we want the maze to be solvable with or without diagonals
    if (solveDiagonal) {
      avoidCol = Math.floor(Math.random() * (endCol - startCol) + startCol)
    } else {
      avoidCol = Math.floor(Math.random() * (endCol / 2 - startCol / 2) + startCol / 2) * 2 + 1
    }
    for (var col = startCol; col <= endCol; col++) {
      //choose a random square to not be selected
      if (col === avoidCol) {
        continue
      } else {
        wallList.push([wallRow, col])
      }
    }
    rescursiveMaze(startRow, startCol, wallRow - 1, endCol, wallList, solveDiagonal)
    rescursiveMaze(wallRow + 1, startCol, endRow, endCol, wallList, solveDiagonal)
  } else {
    //divide vertically
    //choose a random even number to cut the grid
    const lowerBound = (startCol - 1) / 2 + 1
    const upperBound = (endCol - 1) / 2
    const wallCol = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound) * 2
    //add col to the wallList - but first, select a random square to not be selected
    var avoidRow
    if (solveDiagonal) {
      avoidRow = Math.floor(Math.random() * (endRow - startRow) + startRow)
    } else {
      avoidRow = Math.floor(Math.random() * (endRow / 2 - startRow / 2) + startRow / 2) * 2 + 1
    }
    for (var row = startRow; row <= endRow; row++) {
      if (row === avoidRow) {
        continue
      } else {
        wallList.push([row, wallCol])
      }
    }
    rescursiveMaze(startRow, startCol, endRow, wallCol - 1, wallList, solveDiagonal)
    rescursiveMaze(startRow, wallCol + 1, endRow, endCol, wallList, solveDiagonal)
  }
}
