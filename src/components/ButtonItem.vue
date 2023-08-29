<script setup lang="ts">

interface Button {
  id: number;
  type: string;
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