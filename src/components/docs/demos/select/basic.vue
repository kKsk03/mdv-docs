<script setup lang="ts">
import { ref } from 'vue'
import { MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const sizes: MdvSelectOption[] = [
  { value: 'small', label: 'Small', supportingText: 'For personal projects' },
  { value: 'medium', label: 'Medium', supportingText: 'For a growing team' },
  { value: 'large', label: 'Large', supportingText: 'Currently unavailable', disabled: true },
]
const typedOptions: MdvSelectOption[] = [{ value: 1, label: 'Number 1' }, { value: '1', label: 'String 1' }]
const outlined = ref<MdvSelectValue | null>('small')
const filled = ref<MdvSelectValue | null>(null)
const typed = ref<MdvSelectValue | null>(1)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <MdvSelect v-model="outlined" label="Outlined size" :options="sizes" full-width />
      <MdvSelect v-model="filled" label="Filled size" variant="filled" placeholder="Choose a size" :options="sizes" full-width />
    </div>
    <MdvSelect v-model="typed" label="Strict value types" :options="typedOptions" full-width />
    <MdvSelect
      label="Archived projects"
      :options="[]"
      no-options-text="No archived projects"
      full-width
    />
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Outlined: {{ JSON.stringify(outlined) }} · Filled: {{ JSON.stringify(filled) }} · Typed: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
