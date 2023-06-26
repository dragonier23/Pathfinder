<script setup>
    import Node from './components/Node.vue'
    import { ref } from 'vue'

    const widthCount = (window.innerWidth / 40) - 2;
    const heightCount = (window.innerHeight / 40) - 1;


    const gridArray = [];
    for (let row = 0; row < heightCount; row++){
        const currentRow = [];
        for (let column = 0; column < widthCount; column++){
            currentRow.push([]);
        }
        gridArray.push(currentRow);
    }
    const grid = ref(gridArray);
</script>

<template>
    <div v-for="(row, rowIndex) of grid" class="row">
        <Node v-for="(column, columnIndex) of row" :row="rowIndex" :column="columnIndex"/>
    </div>
</template>

<style scoped>
.row{
    margin-top: 0px;
}
</style>
