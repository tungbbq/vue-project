<script setup lang="ts">
import Navbar from '@/components/NavbarItem.vue'
</script>

<template>
  <div class="row">
    <div class="bg-image bg-cover " style="
    background-image: url('src/assets/8562848_25501.jpg');
    height: 100vh;
  ">
      <Navbar />
      <div class="align-items-center h-75 row">
        <h1 class="display-4 text-center text-light">herzlich willkommen</h1>
      </div>
    </div>
  </div>
</template>

<style>
.bg-image {
  width: 100%;
  height: 600px;
  background-image: url('image/background-image.jpg');
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
</style>