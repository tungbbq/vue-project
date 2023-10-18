<template>
  <table class="table">
    <thead>
      <tr>
        <th scope="col"></th>
        <th
          scope="col"
          v-for="(column, columnIndex) in props.tableColumns"
          :key="columnIndex"
          @click="sortColumn(column)"
        >
          {{ column.label }}
          <span
            v-if="sortColumnIndex === columnIndex && sortOrder === 'asc'"
          >
            <i class="bi bi-arrow-up"></i>
          </span>
          <span
            v-if="sortColumnIndex === columnIndex && sortOrder === 'desc'"
          >
            <i class="bi bi-arrow-down"></i>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in sortedUsers" :key="user.id" @click="emitUserId(user.id)">
        <th scope="row">{{ user.id }}</th>
        <td v-for="(column, columnIndex) in props.tableColumns" :key="columnIndex">
          {{ user[column.key] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { defineProps, computed, ref, defineEmits } from 'vue';

const props = defineProps({
  users: Array,
  tableColumns: Array,
});

const emits = defineEmits();

// Use a ref to store the current sorting order
const sortOrder = ref('asc');

// Use a ref to store the index of the sorted column
const sortColumnIndex = ref(null);

// Create a computed property to sort the users based on the sorting order and column
const sortedUsers = computed(() => {
  const usersCopy = [...props.users];
  if (sortColumnIndex.value !== null) {
    const columnKey = props.tableColumns[sortColumnIndex.value].key;
    if (sortOrder.value === 'asc') {
      return usersCopy.sort((a, b) => a[columnKey].localeCompare(b[columnKey]));
    } else if (sortOrder.value === 'desc') {
      return usersCopy.sort((a, b) => b[columnKey].localeCompare(a[columnKey]));
    }
  }
  return usersCopy;
});

// Method to toggle the sorting order for a specific column
const sortColumn = (column) => {
  if (sortColumnIndex.value === props.tableColumns.indexOf(column)) {
    // Toggle the sorting order if the same column is clicked again
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    // Set the sorting order to 'asc' and update the sorted column index
    sortOrder.value = 'asc';
    sortColumnIndex.value = props.tableColumns.indexOf(column);
  }
};

// Emit the user ID when a row is clicked
const emitUserId = (userId) => {
  emits('user-clicked', userId);
};
</script>
