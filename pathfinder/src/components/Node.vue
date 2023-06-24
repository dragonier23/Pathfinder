<script setup>
import { ref } from 'vue'

const squareClass = ref('square')
const props = defineProps({
    row: Number,
    column: Number,
})

</script>

<template>
<div :class="squareClass" row></div>
</template>

<style scoped>
.square{
    width:40px;
    height:40px;
    outline: 1px solid grey;
}
</style>
