<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';

interface Input {
  id: string;
  icon: string;
  type: string;
  name: string;
}

// get input structure plan vom parent via props
defineProps<{ inputs?: Input[] }>();
const emit = defineEmits(['input']);

// Emit input event to parent component
const handleInputUpdate = (inputId: string, newValue: string) => {
  emit('input', { inputId, newValue }); 
};

</script>

<template>
  <div class="input-group mb-3" v-for="input of inputs" :key="input.id">
    <span class="input-group-text" :id="input.name" v-html="input.icon"></span>
    <Field
      :name="input.id"
      :type="input.type"
      class="form-control"
      :placeholder="input.name"
      @input="handleInputUpdate(input.id, $event.target.value)"
    />
    <ErrorMessage 
    class='form-control is-invalid' 
    :name="input.id" />
  </div>
</template>
