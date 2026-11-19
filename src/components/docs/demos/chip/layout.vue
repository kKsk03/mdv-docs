<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvChip, MdvChipSet } from '@mdv-ui/mdv'
import type { MdvChipSetModelValue } from '@mdv-ui/mdv'

const scrollable = ref(false)
const disabled = ref(false)
const selected = ref<MdvChipSetModelValue>(['Design'])
const topics = ['Design', 'Research', 'Engineering', 'Accessibility', 'Typography', 'Motion', 'Color', 'Layouts']
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="scrollable" label="Keep chips on one scrollable line" />
      <MdvCheckbox v-model="disabled" label="Disable the set" />
    </div>
    <MdvChipSet v-model="selected" selection="multiple" label="Browse topics" :scrollable="scrollable" :disabled="disabled">
      <MdvChip v-for="topic in topics" :key="topic" variant="filter" :value="topic" :label="topic" />
    </MdvChipSet>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Topics: {{ JSON.stringify(selected) }}</p>
  </div>
</template>
