<script setup>
import Node from './components/Node.vue'
import { ref } from 'vue'

const verticalCount = window.innerHeight / 40 - 3
const horizontalCount = 12 //window.innerWidth / 40;

//initiatilize some sort of control over the start and end
const startRow = ref(2)
const startColumn = ref(3)
const endRow = ref(13)
const endColumn = ref(horizontalCount - 4)

//help decide if is moving start or moving end
const moveStart = ref(false)
const moveEnd = ref(false)

//create grid
const grid = []
for (var row = 0; row < verticalCount; row++) {
  const rowGrid = []
  for (var column = 0; column < horizontalCount; column++) {
    rowGrid.push([])
  }
  grid.push(rowGrid)
}

//so, first on mouse down: 1. this will trigger a function, that first decides:
// are we moving a start or end node - emitted event from child Node --> send if isStartNode or isEndNode is true + row and column number
// next it decides: are we setting it down, or picking it up

//so if picking up, we try to locate where the mouse is by listening to the hover event over the particular node, which does the same thing as the click event except it just keeps running

//if putting down, we take the click event, and use the emitted row and column thing to set the startRow/endRow to the newly chosen thing

//triggers the moving process
function nodeClicked(isStartNode, isEndNode, row, column) {
  if (moveEnd.value) {
    moveEnd.value = !moveEnd.value
    endRow.value = row
    endColumn.value = column
  } else if (!moveEnd.value) {
    if (isEndNode) {
      moveEnd.value = !moveEnd.value
    }
  } else if (moveStart.value) {
    moveStart.value = !moveStart.value
    startRow.value = row
    startColumn.value = column
  } else if (!moveStart.value) {
    if (isStartNode) {
      moveStart.value = !moveStart.value
    }
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
</script>

<template>
  <div class="centered">
    <div v-for="(row, rowIndex) in grid" :row="rowIndex" class="row">
      <template v-for="(column, columnIndex) in row">
        <Node
          v-if="rowIndex === startRow && columnIndex === startColumn"
          :row="rowIndex"
          :column="columnIndex"
          :isStartNode="true"
          :isEndNode="false"
          @nodeClick="nodeClicked"
          @nodeHover="nodeHover"
        />
        <Node
          v-else-if="rowIndex === endRow && columnIndex === endColumn"
          :row="rowIndex"
          :column="columnIndex"
          :isStartNode="false"
          :isEndNode="true"
          @nodeClick="nodeClicked"
          @nodeHover="nodeHover"
        />
        <Node
          v-else
          :row="rowIndex"
          :column="columnIndex"
          :isStartNode="false"
          :isEndNode="false"
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
