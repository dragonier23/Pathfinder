<script setup>
import Node from './components/Node.vue'
import { ref, reactive } from 'vue'
import { dijkstra, getShortestPath, astar } from './pathfindingalgos'
import { generateMaze } from './mazealgos'

const verticalCount = 15 //Math.floor(window.innerHeight / 40) - 1
const horizontalCount = 35 //Math.floor(window.innerWidth / 40) - 2

//create grid
const grid = []
for (var row = 0; row < verticalCount; row++) {
  const rowGrid = []
  for (var column = 0; column < horizontalCount; column++) {
    rowGrid.push([])
  }
  grid.push(rowGrid)
}

//initiatilize some sort of control over the start and end
const startRow = ref(2)
const startColumn = ref(3)
const endRow = ref(13)
const endColumn = ref(15)

//log wall positions
const wallList = ref([])

//function to check if the node is or is not a wall
function checkWall(rowIndex, columnIndex) {
  const length = wallList.value.length
  for (var entry = 0; entry < length; entry++) {
    const wallEntry = wallList.value[entry]
    if (wallEntry[0] === rowIndex && wallEntry[1] === columnIndex) {
      return true
    }
  }
  return false
}

//so, first on mouse down: 1. this will trigger a function, that first decides:
// are we moving a start or end node - emitted event from child Node --> send if isStartNode or isEndNode is true + row and column number
// next it decides: are we setting it down, or picking it up
//so if picking up, we try to locate where the mouse is by listening to the hover event over the particular node, which does the same thing as the click event except it just keeps running
//if putting down, we take the click event, and use the emitted row and column thing to set the startRow/endRow to the newly chosen thing
//triggers the moving process
//help decide if is moving start or moving end
const moveStart = ref(false)
const moveEnd = ref(false)

function nodeClicked(isStartNode, isEndNode, isWallNode, row, column) {
  //first 2 help to move the start and end node
  if (isStartNode) {
    if (!moveStart.value) {
      moveStart.value = !moveStart.value
    } else {
      moveStart.value = !moveStart.value
      startRow.value = row
      startColumn.value = column
    }
  } else if (isEndNode) {
    if (!moveEnd.value) {
      moveEnd.value = !moveEnd.value
    } else {
      moveEnd.value = !moveEnd.value
      endRow.value = row
      endColumn.value = column
    }
  }
  // we want to add walls: so if we click a node, and it isnt a start or end node, we should turn
  //it into a wall node: --> this node needs to be added to a list of known walls, then the color needs to be changed
  else if (isWallNode) {
    //filter out the entry that we want to remove
    wallList.value = wallList.value.filter((currentValue, index, array) => {
      const wallEntry = wallList.value[index]
      if (wallEntry[0] === row && wallEntry[1] === column) {
        return false
      }
      return true
    })
  }
  // if not a wall node, clicking it turns it into a wallNode
  else {
    wallList.value.push([row, column])
  }
}

//during the moving process, if the mouse is hovering over a particular node, shade it the color of the currently moved node (green or red)
function nodeHover(row, column) {
  if (moveStart.value) {
    startRow.value = row
    startColumn.value = column
  } else if (moveEnd.value) {
    endRow.value = row
    endColumn.value = column
  }
}

//give control for which algorithm we are using
const pathfindingalgo = ref('djikstra')

//give ability to select if diagonals should be triggered
const pathfinderDiagonal = ref(false) //by default diagonals not allowed

//handle clicked event for button triggering the djikstra's algorithm
function runPathfindingAlgo() {
  var visitedNodesinOrder = []
  if (pathfindingalgo.value === 'djikstra') {
    visitedNodesinOrder = dijkstra(
      startRow.value,
      startColumn.value,
      endRow.value,
      endColumn.value,
      wallList.value,
      verticalCount,
      horizontalCount,
      pathfinderDiagonal.value
    )
  } else if (pathfindingalgo.value === 'astar') {
    visitedNodesinOrder = astar(
      startRow.value,
      startColumn.value,
      endRow.value,
      endColumn.value,
      wallList.value,
      verticalCount,
      horizontalCount,
      pathfinderDiagonal.value
    )
  }
  const shortestPath = getShortestPath(visitedNodesinOrder)
  animateVisit(visitedNodesinOrder, shortestPath)
}

//animate the visiting of nodes
const visitedList = ref([])
function animateVisit(visitedNodesinOrder, shortestPath) {
  //iterate through the visitedNodesinOrder, and change the color of the square
  visitedList.value = []
  shortestPathList.value = []
  for (var i = 0; i <= visitedNodesinOrder.length; i++) {
    if (i === visitedNodesinOrder.length) {
      setTimeout(animatedShortestPath(shortestPath), 5 * i)
    } else {
      const node = visitedNodesinOrder[i]
      setTimeout(() => {
        const { row, column } = node
        visitedList.value.push([row, column])
      }, 0.4)
    }
  }
}

//function to help update the DOM for the visited nodes
function checkVisited(rowIndex, columnIndex) {
  const length = visitedList.value.length
  for (var entry = 0; entry < length; entry++) {
    const visitedEntry = visitedList.value[entry]
    if (visitedEntry[0] === rowIndex && visitedEntry[1] === columnIndex) {
      return true
    }
  }
  return false
}

//animate the shortest path
const shortestPathList = ref([])
function animatedShortestPath(shortestPath) {
  for (var i = 0; i < shortestPath.length; i++) {
    const node = shortestPath[i]
    setTimeout(() => {
      const { row, column } = node
      shortestPathList.value.push([row, column])
    }, 0.4)
  }
}
//function to help update the DOM for the visited nodes
function checkShortest(rowIndex, columnIndex) {
  const length = shortestPathList.value.length
  for (var entry = 0; entry < length; entry++) {
    const shortestPathEntry = shortestPathList.value[entry]
    if (shortestPathEntry[0] === rowIndex && shortestPathEntry[1] === columnIndex) {
      return true
    }
  }
  return false
}

const solveDiagonal = ref(false)
//function to help with generation of maze
function runMazeAlgo() {
  visitedList.value = []
  shortestPathList.value = []
  wallList.value = generateMaze(horizontalCount, verticalCount, solveDiagonal.value)
}
</script>

<template>
  <div>
    <div>
      <select v-model="pathfindingalgo">
        <option disabled value="">Please select one</option>
        <option value="djikstra">Djikstra</option>
        <option value="astar">A*</option>
      </select>
      <input type="checkbox" id="pathfinderDiagonalCheck" v-model="pathfinderDiagonal" />
      <label v-if="pathfinderDiagonal" for="pathfinderDiagonalCheck">Diagonals Allowed</label>
      <label v-else for="pathfinderDiagonalCheck">Diagonals Not Allowed</label>
      <div>
        <input type="checkbox" id="mazeDiagonalCheck" v-model="solveDiagonal" />
        <label v-if="solveDiagonal" for="mazeDiagonalCheck"
          >Maze may only be solved with diagonals allowed</label
        >
        <label v-else for="mazeDiagonalCheck">Maze is solvable without diagonals allowed</label>
      </div>
    </div>
    <button type="button" @click="runPathfindingAlgo">Trigger algorithm</button>
    <button type="button" @click="runMazeAlgo">Generate Maze</button>
  </div>
  <div class="centered">
    <div v-for="(row, rowIndex) in grid" :row="rowIndex" class="row">
      <template v-for="(column, columnIndex) in row">
        <Node
          v-if="rowIndex === startRow && columnIndex === startColumn"
          :row="rowIndex"
          :column="columnIndex"
          :isStartNode="true"
          :isEndNode="false"
          :isWallNode="false"
          :isVisited="false"
          :isShortest="false"
          @nodeClick="nodeClicked"
          @nodeHover="nodeHover"
        />
        <Node
          v-else-if="rowIndex === endRow && columnIndex === endColumn"
          :row="rowIndex"
          :column="columnIndex"
          :isStartNode="false"
          :isEndNode="true"
          :isWallNode="false"
          :isVisited="false"
          :isShortest="false"
          @nodeClick="nodeClicked"
          @nodeHover="nodeHover"
        />
        <Node
          v-else-if="checkWall(rowIndex, columnIndex)"
          :row="rowIndex"
          :column="columnIndex"
          :isStartNode="false"
          :isEndNode="false"
          :isWallNode="true"
          :isVisited="false"
          :isShortest="false"
          @nodeClick="nodeClicked"
          @nodeHover="nodeHover"
        />
        <Node
          v-else-if="checkShortest(rowIndex, columnIndex)"
          :row="rowIndex"
          :column="columnIndex"
          :isStartNode="false"
          :isEndNode="false"
          :isWallNode="false"
          :isVisited="false"
          :isShortest="true"
          @nodeClick="nodeClicked"
          @nodeHover="nodeHover"
        />
        <Node
          v-else-if="checkVisited(rowIndex, columnIndex)"
          :row="rowIndex"
          :column="columnIndex"
          :isStartNode="false"
          :isEndNode="false"
          :isWallNode="false"
          :isVisited="true"
          :isShortest="false"
          @nodeClick="nodeClicked"
          @nodeHover="nodeHover"
        />
        <Node
          v-else
          :row="rowIndex"
          :column="columnIndex"
          :isStartNode="false"
          :isEndNode="false"
          :isWallNode="false"
          :isVisited="false"
          :isShortest="false"
          @nodeClick="nodeClicked"
          @nodeHover="nodeHover"
        />
      </template>
    </div>
  </div>
</template>

<style>
.row {
  height: 40px;
}
.centered {
  margin: auto;
}
</style>
