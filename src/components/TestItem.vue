<template>
    <ul>
      <li>
        <button
          type="button"
          @click="onClickFirstPage"
          :disabled="isInFirstPage"
        >
          First
        </button>
      </li>
  
      <li>
        <button
          type="button"
          @click="onClickPreviousPage"
          :disabled="isInFirstPage"
        >
          Previous
        </button>
      </li>
  
      <!-- Visible Buttons Start -->
  
      <li
        v-for="page in pages"
        :key="page.name"
      >
        <button
          type="button"
          @click="onClickPage(page.name)"
          :disabled="page.isDisabled"
        >
          {{ page.name }}
        </button>
      </li>
  
      <!-- Visible Buttons End -->
  
      <li>
        <button
          type="button"
          @click="onClickNextPage"
          :disabled="isInLastPage"
        >
          Next
        </button>
      </li>
  
      <li>
        <button
          type="button"
          @click="onClickLastPage"
          :disabled="isInLastPage"
        >
          Last
        </button>
      </li>
    </ul>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  maxVisibleButtons: Number,
});

const emits = defineEmits(['pagechanged']);

const isInFirstPage = ref(props.currentPage === 1);
const isInLastPage = ref(props.currentPage === props.totalPages);

const onClickFirstPage = () => {
  emits('pagechanged', (1));
};

const onClickPreviousPage = () => {
  emits('pagechanged', (props.currentPage - 1));
};

const onClickPage = (page) => {
  emits('pagechanged', (page));
};

const onClickNextPage = () => {
  emits('pagechanged', (props.currentPage + 1));
};

const onClickLastPage = () => {
  emits('pagechanged', (props.totalPages));
};

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
  // You can add computed properties or methods here if needed
  </script>
  