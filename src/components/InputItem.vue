<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate';
import { toRefs, computed, watch, ref } from 'vue';

export interface Input {
        id: string,
        icon: string,
        type: string,
        name: string,
        disabled: boolean,
        value: string | number 
}

// get input values from parent via props
const props = defineProps<{ inputs: Input[] }>();

const emits = defineEmits(['input']);

// Emit input updates (event) to parent component
const handleInputUpdate = (inputId: string, newValue: string) => { 
  emits('input', { inputId, newValue }); 
};


</script>

<template>
  <div class="input-group mb-3" v-for="input of inputs" :key="input.id">
    <span class="input-group-text" :id="input.name" v-html="input.icon"></span>
    <Field
      :name="input.id"
      :type="input.type"
      v-model="input.value"
      class="form-control"
      :placeholder="input.name"
      @input="handleInputUpdate(input.id, $event.target.value)"
      :disabled="input.disabled"
    />
    <ErrorMessage 
    class='form-control is-invalid' 
    :name="input.id" />
  </div>
</template>
