<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDateRangePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangeValue } from '@mdv-ui/mdv'

const stay = ref<MdvDateRangeValue>({ start: '2026-11-21', end: '2026-11-23' })
const disabled = ref(false)
const result = ref('Each endpoint is submitted as its own ISO field.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ arrival: data.get('arrival'), departure: data.get('departure') })
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
  <form class="grid gap-4" @submit.prevent="submit" @reset="disabled = false; result = 'Form reset to its initial range.'">
    <MdvCheckbox v-model="disabled" label="Disable the booking fieldset" />
    <fieldset :disabled="disabled" class="min-w-0 border-0 p-0">
      <legend class="mb-3 font-medium">Hotel booking</legend>
      <MdvDateRangePicker v-model="stay" start-label="Required arrival" end-label="Required departure" start-name="arrival" end-name="departure" locale="en-US" :labels="labels" required clearable />
    </fieldset>
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit booking</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset booking</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
