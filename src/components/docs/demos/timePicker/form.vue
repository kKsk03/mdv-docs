<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvTimePicker } from '@mdv-ui/mdv'
import type { MdvTimePickerExpose, MdvTimeValue } from '@mdv-ui/mdv'
import { englishTimePickerLabels } from './labels'

const formId = `time-booking-${useId()}`
const picker = useTemplateRef<MdvTimePickerExpose>('picker')
const time = ref<MdvTimeValue>('09:00')
const result = ref('No booking submitted.')

function submit(event: SubmitEvent) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = `Submitted ${JSON.stringify([...data])}`
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvTimePicker
      ref="picker"
      v-model="time"
      :form="formId"
      :labels="englishTimePickerLabels"
      :minute-step="15"
      name="appointment"
      label="Appointment"
      min="09:00"
      max="17:00"
      locale="en-US"
      hour-cycle="h23"
      initial-view="input"
      required
      clearable
    />
    <form :id="formId" class="flex flex-wrap items-center gap-2" @submit.prevent="submit" @reset="result = 'Form reset.'">
      <MdvButton type="submit">Book</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
      <MdvButton variant="text" @click="picker?.reportValidity()">Check time</MdvButton>
    </form>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
