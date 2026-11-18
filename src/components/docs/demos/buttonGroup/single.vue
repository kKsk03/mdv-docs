<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvButtonGroupModelValue } from '@mdv-ui/mdv'

const view = ref<MdvButtonGroupModelValue>('week')
const required = ref(true)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="required" label="Keep one option selected" />
    <MdvButtonGroup v-model="view" variant="connected" :selection-required="required" aria-label="Calendar view">
      <MdvButtonGroupItem value="day">Day</MdvButtonGroupItem>
      <MdvButtonGroupItem value="week">Week</MdvButtonGroupItem>
      <MdvButtonGroupItem value="month">Month</MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="text-sm text-mdv-on-surface-variant" role="status">View: {{ view ?? '(none)' }}</p>
  </div>
</template>
