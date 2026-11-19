<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'
import checkIcon from '@iconify-icons/material-symbols/check'

const expressive = ref<MdvSelectValue | null>('design')
const baseline = ref<MdvSelectValue | null>('design')
const dark = ref(false)
const rtl = ref(false)
const options: MdvSelectOption[] = [
  { value: 'design', label: 'Design system', supportingText: 'Shared components and foundations' },
  { value: 'website', label: 'Documentation website', supportingText: 'Guides, examples, and API reference' },
  { value: 'archive', label: 'Archived workspace', supportingText: 'Read-only access', disabled: true },
  ...Array.from({ length: 12 }, (_, index) => ({ value: `project-${index}`, label: `Research project ${index + 1}`, supportingText: 'A longer option label and supporting description for scrolling.' })),
]
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="grid gap-4 rounded-xl bg-mdv-surface p-4 text-mdv-on-surface sm:grid-cols-2">
      <MdvSelect v-model="expressive" label="Expressive menu" :options="options" full-width>
        <template #option="{ option, selected, active }">
          <div class="flex min-w-0 items-center gap-3">
            <MdvIcon :icon="selected ? checkIcon : folderIcon" />
            <span class="min-w-0 break-words">
              <span class="block" :class="active ? 'font-medium' : undefined">{{ option.label }}</span>
              <span class="block text-xs">{{ option.supportingText }}</span>
            </span>
          </div>
        </template>
      </MdvSelect>
      <MdvSelect v-model="baseline" label="Baseline menu" menu-variant="baseline" :options="options" full-width />
    </div>
  </div>
</template>
