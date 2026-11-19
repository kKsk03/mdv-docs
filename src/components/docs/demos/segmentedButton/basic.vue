<script setup lang="ts">
import { ref } from 'vue'
import { MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const period = ref<MdvSegmentedButtonModelValue>('week')
const details = ref<MdvSegmentedButtonModelValue>(['summary'])
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSegmentedButton v-model="period" aria-label="Report period">
      <MdvSegmentedButtonItem value="day" label="Day" />
      <MdvSegmentedButtonItem value="week" label="Week" />
      <MdvSegmentedButtonItem value="month" label="Month" />
    </MdvSegmentedButton>
    <MdvSegmentedButton v-model="details" selection="multiple" aria-label="Report details">
      <MdvSegmentedButtonItem value="summary" label="Summary" />
      <MdvSegmentedButtonItem value="images" label="Images" />
      <MdvSegmentedButtonItem value="dates" label="Dates" />
    </MdvSegmentedButton>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Period: {{ period }} · Details: {{ JSON.stringify(details) }}</p>
  </div>
</template>
