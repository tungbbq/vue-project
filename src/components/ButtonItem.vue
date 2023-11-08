<script setup lang="ts">

export interface Button {
  id: number;
  type: 'submit' | 'reset' | 'button';
  name: string;
  function: string
}

defineProps<{
  buttons?: Button[]
}>()

defineEmits(['buttonClick'])

</script>
<template>
    <div class="text-center mt-3 d-grid gap-2" >
        <button v-for="button of buttons" :key="button.id" @click="$emit('buttonClick', button.function)" :type="button.type" class="btn btn-secondary">{{ button.name }}</button>
    </div>
</template>