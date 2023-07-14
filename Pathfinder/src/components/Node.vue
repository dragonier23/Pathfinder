<script setup>
import { ref } from 'vue'

const squareClass = ref('square')

const emit = defineEmits(['nodeClick', 'nodeHover', 'nodeMouseDown', 'noseMouseUp'])

const props = defineProps({
  row: Number,
  column: Number,
  isStartNode: Boolean,
  isEndNode: Boolean,
  isWallNode: Boolean,
  isVisited: Boolean,
  isShortest: Boolean
})

//sends back whether it is the start or end node, and sends back the row and column associated with the node
const clickResponse = () => {
  emit('nodeClick', props.isStartNode, props.isEndNode, props.isWallNode, props.row, props.column)
}

const hoverResponse = () => {
  emit('nodeHover', props.row, props.column)
}
</script>

<template>
  <div
    :class="[
      squareClass,
      { startNode: isStartNode },
      { endNode: isEndNode },
      { wallNode: isWallNode },
      { visitedNode: isVisited },
      { shortestPath: isShortest }
    ]"
    @click="clickResponse"
    @mouseover="hoverResponse"
  ></div>
</template>

<style>
.square {
  height: 40px;
  width: 40px;
  display: inline-block;
  border: 1px solid grey;
}

.startNode {
  background-color: green;
}

.endNode {
  background-color: red;
}

.wallNode {
  background-color: black;
}

.visitedNode {
  background-color: #5dd1f5;
}

.shortestPath {
  background-color: yellow;
}
</style>
