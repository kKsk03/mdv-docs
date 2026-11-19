<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const examples = [
  { id: 'expressive-standard', variant: 'expressive', layout: 'standard' },
  { id: 'expressive-segmented', variant: 'expressive', layout: 'segmented' },
  { id: 'baseline-standard', variant: 'baseline', layout: 'standard' },
  { id: 'baseline-segmented', variant: 'baseline', layout: 'segmented' },
] as const
const selected = ref<Record<string, MdvListModelValue>>(Object.fromEntries(examples.map(example => [example.id, 'projects'])))
const destinations = ['workspace', 'projects', 'archive']
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <div v-for="example in examples" :key="example.id" class="min-w-0 rounded-xl bg-mdv-surface-container-lowest p-2">
      <p class="px-3 py-2 text-sm font-medium">{{ example.variant }} · {{ example.layout }}</p>
      <MdvList v-model="selected[example.id]" :variant="example.variant" :layout="example.layout" selection-mode="single" :aria-label="example.id">
        <MdvListItem v-for="destination in destinations" :key="destination" :value="destination" :headline="destination" :icon="folderIcon" />
      </MdvList>
    </div>
  </div>
</template>
