<script setup lang="ts">
import {RouterView} from "vue-router"
</script>

<template>
    <RouterView :key="$route.fullPath"/>
</template>
<style>
body {
background-image: url('./assets/blue-sky-clouds.jpg'); 
background-size: cover;
background-repeat: no-repeat;
} 
</style>

