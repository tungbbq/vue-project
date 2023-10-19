<script setup lang="ts">

export interface Button {
  id: number;
  type: 'submit' | 'reset' | 'button';
  name: string;
}

defineProps<{
  buttons?: Button[]
}>()

</script>
<template>
    <div class="text-center" v-for="button of buttons" :key="button.id">
        <button :type="button.type" class="btn btn-primary">{{ button.name }}</button>
    </div>
</template>