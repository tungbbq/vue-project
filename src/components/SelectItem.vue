<script setup lang="ts">

export interface Select {
  id: number;
  type: 'submit' | 'reset' | 'button';
  name: string;
  function: string
}

defineProps<{
  selects?: Select[]
}>()

// defineEmits(['buttonClick'])

</script>
<template>
    <div class="text-center mt-3 d-grid gap-2" >
        <select class="form-select" id="floatingSelect" aria-label="Floating label select example">
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
        </select>
    </div>
</template>