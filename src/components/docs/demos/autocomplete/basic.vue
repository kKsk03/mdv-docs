<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const city = ref<MdvSelectValue | null>(null)
const options: MdvSelectOption[] = [
  { value: 'london', label: 'London', supportingText: 'United Kingdom' },
  { value: 'paris', label: 'Paris', supportingText: 'France' },
  { value: 'tokyo', label: 'Tokyo', supportingText: 'Japan' },
  { value: 'oslo', label: 'Oslo', disabled: true },
]
</script>

<template>
  <div class="grid max-w-sm gap-3">
    <MdvAutocomplete
      v-model="city"
      label="Destination"
      placeholder="Type a city"
      :options="options"
      supporting-text="Choose a suggestion or enter your own city."
      no-options-text="No cities found."
      full-width
    />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Model: {{ JSON.stringify(city) }}</p>
  </div>
</template>
