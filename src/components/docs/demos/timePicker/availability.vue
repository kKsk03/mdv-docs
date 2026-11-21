<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvTimePicker } from '@mdv-ui/mdv'
import type { MdvTimeValue } from '@mdv-ui/mdv'
import clockIcon from '@iconify-icons/material-symbols/schedule'
import { englishTimePickerLabels } from './labels'

const time = ref<MdvTimeValue>('22:00')
const open = ref(false)
const blockAll = ref(false)
const reject = ref(false)
const result = ref('No change requested.')

function disabledTime(value: string) {
  return blockAll.value || (value > '02:00' && value < '22:00')
}

function requestTime(value: MdvTimeValue) {
  if (reject.value) {
    result.value = `Kept ${time.value ?? 'no time'} instead of ${value ?? 'no time'}.`
    return
  }
  time.value = value
  result.value = `Accepted ${value ?? 'no time'}.`
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <MdvCheckbox v-model="blockAll" label="Block all times" />
      <MdvCheckbox v-model="reject" label="Decline changes" />
    </div>
    <MdvTimePicker
      v-model:open="open"
      :model-value="time"
      :disabled-time="disabledTime"
      :labels="englishTimePickerLabels"
      :minute-step="15"
      label="Maintenance starts at"
      supporting-text="From 22:00 to 02:00, in 15-minute steps."
      locale="en-US"
      hour-cycle="h23"
      initial-view="input"
      @update:model-value="requestTime"
    >
      <template #title>Schedule overnight maintenance</template>
      <template #trigger="{ triggerProps }">
        <MdvIconButton v-bind="triggerProps" variant="standard">
          <MdvIcon :icon="clockIcon" />
        </MdvIconButton>
      </template>
    </MdvTimePicker>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ result }} Picker: {{ open ? 'open' : 'closed' }}.
    </p>
  </div>
</template>
