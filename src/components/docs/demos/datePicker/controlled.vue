<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvDatePicker, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvDatePickerExpose, MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'
import calendar from '@iconify-icons/material-symbols/calendar-month-outline'

const picker = useTemplateRef<MdvDatePickerExpose>('picker')
const date = ref<MdvDateValue>('2026-11-19')
const open = ref(false)
const rejectDate = ref(true)
const rejectClose = ref(false)
const result = ref('Date requests are rejected until you unlock them.')

function updateDate(value: MdvDateValue) {
  result.value = `Date ${value ?? '(none)'}: ${rejectDate.value ? 'rejected' : 'accepted'}.`
  if (!rejectDate.value) date.value = value
}

function updateOpen(value: boolean) {
  if (value || !rejectClose.value) open.value = value
  else {
    rejectClose.value = false
    result.value = 'Closing was rejected once. Try closing again.'
  }
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
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="rejectDate" label="Reject date updates" />
      <MdvCheckbox v-model="rejectClose" label="Reject the next closing request" />
    </div>
    <MdvDatePicker ref="picker" :model-value="date" :open="open" label="Studio booking" locale="en-US" :labels="labels" @update:model-value="updateDate" @update:open="updateOpen">
      <template #trigger="{ triggerProps }"><MdvIconButton v-bind="triggerProps"><MdvIcon :icon="calendar" /></MdvIconButton></template>
      <template #title>Book a studio</template>
    </MdvDatePicker>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="picker?.open()">Open picker</MdvButton>
      <MdvButton variant="outlined" @click="picker?.close()">Request close</MdvButton>
      <MdvButton variant="text" @click="picker?.focus()">Focus field</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Committed: {{ date }} · Open: {{ open }} · {{ result }}</p>
  </div>
</template>
