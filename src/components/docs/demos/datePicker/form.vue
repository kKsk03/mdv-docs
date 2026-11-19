<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { MdvButton, MdvCheckbox, MdvDatePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerExpose, MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'

const picker = useTemplateRef<MdvDatePickerExpose>('picker')
const date = ref<MdvDateValue>('2026-11-19')
const blocked = ref(false)
const result = ref('The form submits an ISO date, not its formatted display text.')
watch(blocked, value => picker.value?.setCustomValidity(value ? 'Resolve the booking conflict first.' : ''))

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ appointment: data.get('appointment') })
}

function reset() {
  blocked.value = false
  result.value = 'Form reset to its initial date.'
}
const labels: MdvDatePickerLabels = {
  title: "Select date",
  rangeTitle: "Select date range",
  chooseDate: "Choose a date",
  chooseRange: "Choose start and end dates",
  open: "Open date picker",
  calendar: "Switch to calendar",
  input: "Enter date",
  cancel: "Cancel",
  confirm: "Confirm",
  save: "Save",
  clear: "Clear date",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  previousYear: "Previous year",
  nextYear: "Next year",
  month: "Select month",
  year: "Select year",
  previousYears: "Earlier years",
  nextYears: "Later years",
  earlierMonths: "Earlier months",
  laterMonths: "Later months",
  today: "Today",
  selected: "Selected",
  rangeStart: "Range start",
  rangeEnd: "Range end",
  inRange: "In selected range",
  unavailable: "Unavailable",
  startLabel: "Start date",
  endLabel: "End date",
  dateLabel: "Date",
  formatHint: "Date format",
  keyboardHint: "Arrow keys move by day or week; Home/End move within the week. PageUp/PageDown change month; hold Shift to change year. Space selects. Single-date Enter selects and confirms. Shift+M/Shift+Y focus month or year.",
  invalidDate: "Enter a valid Gregorian date with a four-digit year.",
  required: "Choose a date.",
  incompleteRange: "Enter both start and end dates.",
  reversedRange: "End must not precede start.",
  outOfBounds: "Date is outside the allowed range.",
  disabledDate: "This date is unavailable.",
  blockedRange: "The range contains an unavailable date.",
  invalidBounds: "Date bounds are invalid.",
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="reset">
    <MdvCheckbox v-model="blocked" label="Add a custom validation error" />
    <MdvDatePicker ref="picker" v-model="date" name="appointment" label="Required appointment" locale="en-US" :labels="labels" required clearable />
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
      <MdvButton variant="text" @click="result = picker?.reportValidity() ? 'Date is valid.' : 'Date needs attention.'">Check validity</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
