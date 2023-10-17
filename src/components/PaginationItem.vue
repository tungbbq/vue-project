<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps({
    maxVisibleButtons: Number,
    totalPages: Number,
    perPages: Number,
    currentPage: Number
}) 

console.log(props)

const startPage = computed(() => {
  if (props.currentPage === 1) {
    return 1;
  }
  if (props.currentPage === props.totalPages) {
    return props.totalPages - props.maxVisibleButtons;
  }
  return props.currentPage - 1;
});

const pages = computed(() => {
  const range = [];

  for (let i = startPage.value; i <= Math.min(startPage.value + props.maxVisibleButtons - 1, props.totalPages); i++) {
    range.push({
      name: i,
      isDisabled: i === props.currentPage
    });
  }

  return range;
});

</script>

<template>
    <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
        <span class="sr-only"></span>
      </a>
    </li>
    <li v-for="page in pages" :key="page.name">
      <button :disabled="page.isDisabled">
        {{ page.name }}
      </button>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
        <span class="sr-only"></span>
      </a>
    </li>
  </ul>
</nav>
</template>