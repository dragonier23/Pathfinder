<script setup>
import { ref, defineProps} from 'vue'

const squareClass = ref('square')
const props = defineProps({
    row: number,
    column: number
})
</script>

<template>
    <div :class="squareClass">
    </div>
    <p>HELLO</p>
</template>

<style>
    .square{
        width: 40px;
        height: 40px;
        outline: 1px solid grey;
        
    }
</style>