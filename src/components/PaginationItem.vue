<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  currentPage: number,
  totalPages: number,
  maxVisibleButtons: number,
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 10,
  maxVisibleButtons: 3,
});

const emits = defineEmits(['pagechanged']);

const isInFirstPage = computed(() => props.currentPage === 1);
const isInLastPage = computed(() => props.currentPage === props.totalPages);

const onClickFirstPage = () => {
  emits('pagechanged', (1));
};

const onClickPreviousPage = () => {
  emits('pagechanged', (props.currentPage - 1));
};

const onClickPage = (page: number) => {
  emits('pagechanged', (page));
};

const onClickNextPage = () => {
  emits('pagechanged', (props.currentPage + 1));
};

const onClickLastPage = () => {
  emits('pagechanged', (props.totalPages));
};
// calculate pagenumber to start with
const startPage = computed(() => {
  // currentpage === start
  if (props.currentPage === 1) {
    return 1;
  }
  // currentpage === end
  if (props.currentPage === props.totalPages) {
    return props.totalPages - props.maxVisibleButtons + 1;
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
        <button class="page-link" type="button" @click="onClickFirstPage" :disabled="isInFirstPage">First
        </button>
      </li>

      <li class="page-item">
        <button class="page-link" type="button" @click="onClickPreviousPage" :disabled="isInFirstPage">
          &lt
        </button>
      </li>

      <!-- Visible Buttons Start -->

      <li class="page-item" v-for="page in pages" :key="page.name">
        <button class="page-link" :class="{ active: page.isDisabled }" type="button" @click="onClickPage(page.name)"
          :disabled="page.isDisabled">
          {{ page.name }}
        </button>
      </li>

      <!-- Visible Buttons End -->
        <li class="page-item">
        <button class="page-link" type="button" @click="onClickNextPage" :disabled="isInLastPage">
          &gt
        </button>
      </li>
      <li class="page-item"><button class="page-link" type="button" @click="onClickLastPage" :disabled="isInLastPage"> Last
        </button>
      </li>
    </ul>
  </nav>

</template>