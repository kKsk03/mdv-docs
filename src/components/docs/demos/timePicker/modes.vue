<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvTimePicker } from '@mdv-ui/mdv'
import type { MdvTimeValue } from '@mdv-ui/mdv'
import { englishTimePickerLabels } from './labels'

const time = ref<MdvTimeValue>('13:05')
const use12Hours = ref(false)
const horizontal = ref(false)
const result = ref('No dialog action yet.')
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <MdvCheckbox v-model="use12Hours" label="Use a 12-hour clock" />
      <MdvCheckbox v-model="horizontal" label="Prefer a horizontal dial" />
    </div>
    <MdvTimePicker
      v-model="time"
      label="Reminder time"
      locale="en-US"
      :labels="englishTimePickerLabels"
      :hour-cycle="use12Hours ? 'h12' : 'h23'"
      :orientation="horizontal ? 'horizontal' : 'auto'"
      initial-view="dial"
      @confirm="result = `Confirmed: ${$event ?? 'none'}.`"
      @cancel="result = `Closed without saving (${ $event.reason }).`"
    />
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Committed: {{ time ?? 'none' }}. {{ result }}
    </p>
  </div>
</template>
