<script setup lang="ts">
import { defineProps, computed, ref, defineEmits, type PropType } from 'vue';
import { type User } from '../views/ListPersons/listPersonsView.vue'

interface TableColum {
  label: string,
  key: string
}

const props = defineProps({
  users: {
    type: Array as PropType<User[]>,
    default: () => [],
  },
  tableColumns: {
    type: Array as PropType<TableColum[]>, 
    default: () => [],
  },
});

const emits = defineEmits();

// Use a ref to store the current sorting order
const sortOrder = ref('asc');

// Use a ref to store the index of the sorted column
const sortColumnIndex = ref(0);

// Create a computed property to sort the users based on the sorting order and column
const sortedUsers = computed(() => {
  const usersCopy = [...props.users];
  if (sortColumnIndex.value !== null) {
    const columnKey = props.tableColumns[sortColumnIndex.value].key;
    
    if (sortOrder.value === 'asc') {
      return usersCopy.sort((a:any, b:any) => {
        // Use localeCompare for string values, and subtraction for numeric values
        if (typeof a[columnKey] === 'string' && typeof b[columnKey] === 'string') {
          return a[columnKey].localeCompare(b[columnKey]);
        } else if (typeof a[columnKey] === 'number' && typeof b[columnKey] === 'number') {
          return a[columnKey] - b[columnKey];
        }
        // If types don't match
        return 0; // Handle this case as needed
      });
    } else if (sortOrder.value === 'desc') {
      return usersCopy.sort((a: any, b: any) => {
        if (typeof a[columnKey] === 'string' && typeof b[columnKey] === 'string') {
          return b[columnKey].localeCompare(a[columnKey]);
        } else if (typeof a[columnKey] === 'number' && typeof b[columnKey] === 'number') {
          return b[columnKey] - a[columnKey];
        }
        return 0;
      });
    }
  }
  return usersCopy;
});


// Method to toggle the sorting order for a specific column
const sortColumn = (column: TableColum) => {
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
const emitUserId = (userId: number) => {
  emits('user-clicked', userId);
};
</script>

<template>

  <table class="table">
    <thead class="table-warning">
      <tr>
        <th scope="col"></th>
        <th
          scope="col"
          v-for="(column, columnIndex) in props.tableColumns"
          :key="columnIndex"
          @click="sortColumn(column)"
        >
          <span style="font-weight: bold">{{ column.label }}</span>
          <span v-if="sortColumnIndex === columnIndex && sortOrder === 'asc'">
            <i class="bi bi-arrow-up"></i>
          </span>
          <span v-if="sortColumnIndex === columnIndex && sortOrder === 'desc'">
            <i class="bi bi-arrow-down"></i>
          </span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="user in sortedUsers" :key="user.id" @click="emitUserId(user.id)">
        <th scope="row">{{ user.id }}</th>
        <td v-for="(column, columnIndex) in props.tableColumns" :key="columnIndex">
          <!-- @vue-skip -->
          {{ user[column.key] }}
        </td>
      </tr>
    </tbody>
  </table>

</template>
