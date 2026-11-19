<script setup lang="ts">
import { ref } from 'vue'
import { MdvDateRangePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangeValue } from '@mdv-ui/mdv'

const stay = ref<MdvDateRangeValue>({ start: '2026-11-19', end: '2026-11-23' })
const message = ref('Select both endpoints, then save the complete range.')
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
  <div class="grid gap-4">
    <MdvDateRangePicker v-model="stay" start-label="Arrival" end-label="Departure" locale="en-US" :labels="labels" clearable @confirm="message = 'Complete range confirmed.'" @cancel="message = `Draft discarded: ${$event.reason}.`" />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Committed: {{ JSON.stringify(stay) }} · {{ message }}</p>
  </div>
</template>
