<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const outlined = ref<MdvSelectValue | null>(null)
const filled = ref<MdvSelectValue | null>(null)
const options = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
]
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <MdvAutocomplete v-model="outlined" label="Outlined" variant="outlined" :options="options" no-options-text="No matches." full-width />
    <MdvAutocomplete v-model="filled" label="Filled" variant="filled" :options="options" no-options-text="No matches." full-width />
  </div>
</template>
