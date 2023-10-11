import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useInputStore = defineStore('input', () => {
  const email = ref('')
  const name = ref('')
  const city = ref('')
  const zip = ref('')
  const telephone = ref('')


  return { email, name, city, zip, telephone }
})
