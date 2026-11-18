<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const project = ref<MdvSelectValue | null>('docs')
const options = [
  { value: 'library', label: 'Component library', supportingText: 'Shared Vue components' },
  { value: 'docs', label: 'Documentation', supportingText: 'Guides and live examples' },
]
</script>

<template>
  <MdvAutocomplete v-model="project" class="max-w-sm" label="Project" :options="options" no-options-text="No projects found." full-width>
    <template #option="{ option, selected }">
      <span class="grid gap-1">
        <span class="font-medium">{{ option.label }}{{ selected ? ' · Selected' : '' }}</span>
        <span class="text-sm text-mdv-on-surface-variant">{{ option.supportingText }}</span>
      </span>
    </template>
  </MdvAutocomplete>
</template>
