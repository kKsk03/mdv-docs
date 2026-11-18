<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const city = ref<MdvSelectValue | null>(null)
const options = ref<MdvSelectOption[]>([])
const loading = ref(false)
const query = ref('')
const cities: MdvSelectOption[] = [
  { value: 'london', label: 'London' },
  { value: 'los-angeles', label: 'Los Angeles' },
  { value: 'paris', label: 'Paris' },
  { value: 'tokyo', label: 'Tokyo' },
]
let timer: ReturnType<typeof setTimeout> | undefined

function search(value: string) {
  clearTimeout(timer)
  query.value = value
  options.value = []
  loading.value = true
  // Simulate a request; cancel the previous scheduled response.
  timer = setTimeout(() => {
    const keyword = value.trim().toLowerCase()
    options.value = cities.filter(option => option.label.toLowerCase().includes(keyword))
    loading.value = false
  }, 350)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid max-w-sm gap-3">
    <MdvAutocomplete
      v-model="city"
      label="Search cities"
      :options="options"
      filter-mode="external"
      :loading="loading"
      loading-text="Searching cities…"
      :no-options-text="query ? 'No cities found.' : 'Type to search cities.'"
      full-width
      @search="search"
    />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Query: {{ JSON.stringify(query) }} · Model: {{ JSON.stringify(city) }}</p>
  </div>
</template>
