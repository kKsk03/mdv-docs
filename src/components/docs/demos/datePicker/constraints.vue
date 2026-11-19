<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDatePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'

const date = ref<MdvDateValue>('2026-11-19')
const disabled = ref(false)
const readonly = ref(false)
const error = ref(false)
const unavailable = (value: string) => value === '2026-11-20'
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
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="disabled" label="Disabled" />
      <MdvCheckbox v-model="readonly" label="Read only" />
      <MdvCheckbox v-model="error" label="External error" />
    </div>
    <MdvDatePicker
      v-model="date"
      label="Available appointment"
      locale="en-US"
      :labels="labels"
      min="2026-11-01"
      max="2026-12-31"
      :disabled-date="unavailable"
      :disabled="disabled"
      :readonly="readonly"
      :error="error"
      error-text="This appointment needs approval."
      supporting-text="November–December 2026; November 20 is unavailable."
      clearable
    />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Committed: {{ date ?? '(none)' }}</p>
  </div>
</template>
