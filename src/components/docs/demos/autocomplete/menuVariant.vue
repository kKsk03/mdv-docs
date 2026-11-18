<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const expressive = ref<MdvSelectValue | null>('paris')
const baseline = ref<MdvSelectValue | null>('paris')
const options = [
  { value: 'london', label: 'London' },
  { value: 'paris', label: 'Paris' },
  { value: 'tokyo', label: 'Tokyo' },
]
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <MdvAutocomplete v-model="expressive" label="Expressive menu" menu-variant="expressive" :options="options" no-options-text="No cities found." full-width />
    <MdvAutocomplete v-model="baseline" label="Baseline menu" menu-variant="baseline" :options="options" no-options-text="No cities found." full-width />
  </div>
</template>
