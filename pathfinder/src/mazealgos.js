//make recursion maze

//function will return the wallList, and this will be assigned to the ref wallList
export function generateMaze(horizontalCount, verticalCount) {
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
  rescursiveMaze(1, 1, verticalCount, horizontalCount, wallList)
  //const wallObject = {wallList: wallList}
  return wallList //wallObject.wallList
}

//recursive maze generating function
//given a space, it chooses a random row/column to split the space with walls, then it runs the same
//algorithm on the 2 smaller spaces.

//this space should both be odd
function rescursiveMaze(startRow, startCol, endRow, endCol, wallList) {
  console.log(startRow, startCol, endRow, endCol, wallList)
  //end the generation is theres a row/column with only width one
  if (startRow === endRow || startCol === endCol) {
    console.log("aborted")
    return
  }
  //decide if the divide is vertical or horizontal (if random < 0.5, horizontal)
  if (Math.random() < 0.5) {
    // divide horizontally
    //choose a random odd number to cut the grid
    const lowerBound = (startRow - 1) / 2 + 1
    const upperBound = (endRow - 1) / 2
    const wallRow = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound) * 2
    //add row to the wallList - but first, select a random square to not be selected 
    const avoidCol = Math.floor(Math.random(endCol - startCol) + startCol);
    for (var col = startCol; col <= endCol; col++){
      //choose a random square to not be selected
      if (col === avoidCol){
        continue
      }
      else{
        wallList.push([wallRow, col])
      }
    }
    rescursiveMaze(startRow, startCol, wallRow - 1, endCol, wallList)
    rescursiveMaze(wallRow + 1, startCol, endRow, endCol, wallList)
  } else {
    //divide vertically
    //choose a random odd number to cut the grid
    const lowerBound = (startCol - 1) / 2 + 1
    const upperBound = (endCol - 1) / 2
    const wallCol = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound) * 2
    //add col to the wallList - but first, select a random square to not be selected 
    const avoidRow = Math.floor(Math.random(endRow - startRow) + startRow);
    for (var row = startRow; row <= endRow; row++) {
      if (row === avoidRow){
        continue
      }
      else{
        wallList.push([row, wallCol])
      }
    }
    rescursiveMaze(startRow, startCol, endRow, wallCol - 1, wallList)
    rescursiveMaze(startRow, wallCol - 1, endRow, endCol, wallList)
  }
}
