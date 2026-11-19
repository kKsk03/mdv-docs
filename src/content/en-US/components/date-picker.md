<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DatePickerBasicDemo from '@/components/docs/demos/datePicker/basic.vue'
import DatePickerLayoutDemo from '@/components/docs/demos/datePicker/layout.vue'
import DatePickerConstraintsDemo from '@/components/docs/demos/datePicker/constraints.vue'
import DatePickerLocaleDemo from '@/components/docs/demos/datePicker/locale.vue'
import DatePickerFormDemo from '@/components/docs/demos/datePicker/form.vue'
import DatePickerControlledDemo from '@/components/docs/demos/datePicker/controlled.vue'

const pickerProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvDateValue', default: 'null', description: 'Accepted YYYY-MM-DD date or null. Unbound models are managed internally; panel edits remain drafts until confirmation.' },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: 'false', description: 'Independent controlled opening state. Unbound opening state is managed internally.' },
  { name: 'layout', type: "'auto' | 'docked' | 'modal' | 'fullscreen'", default: "'auto'", description: 'Auto uses fullscreen below 600 CSS px and docked at wider viewport widths. Explicit layouts retain their requested presentation.' },
  { name: 'initialView', type: "'calendar' | 'input'", default: "'calendar'", description: 'View used when opening a modal/fullscreen picker. Docked always shows the calendar.' },
  { name: 'locale', type: 'string', default: "'zh-CN'", description: 'Date formatting, month/weekday names, entry order, and default week start. Uses the Gregorian calendar and Latin digits; does not translate operation/error labels.' },
  { name: 'firstDayOfWeek', type: '0 | 1 | 2 | 3 | 4 | 5 | 6', default: 'From locale', description: 'Overrides the week start: 0 is Sunday and 6 is Saturday.' },
  { name: 'min', type: 'string', description: 'Inclusive earliest ISO date. Invalid or reversed bounds prevent committing.' },
  { name: 'max', type: 'string', description: 'Inclusive latest ISO date.' },
  { name: 'disabledDate', type: '(date: string) => boolean', description: 'Synchronous predicate receiving YYYY-MM-DD. Return true to make the date unavailable.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables entry, clearing, and opening. Native disabled fieldsets are also respected.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents editing/opening; the accepted value can still be submitted.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Requires a valid date through the visible native input and picker validation.' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Adds an entry-field clear action requesting null. Required validation still applies.' },
  { name: 'label', type: 'string', default: 'labels.dateLabel', description: 'Visible entry label and native input name for assistive technology.' },
  { name: 'name', type: 'string', description: 'Form field name for the accepted ISO value. The formatted display text is not submitted a second time.' },
  { name: 'supportingText', type: 'string', default: 'Localized format hint', description: 'Supporting text below the entry. An empty value falls back to the date-format hint.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'External entry error state, also used by native entry validity. It does not replace panel date constraints or a parent acceptance policy.' },
  { name: 'errorText', type: 'string', description: 'External error message; an error without a message uses labels.invalidDate.' },
  { name: 'labels', type: 'Partial<MdvDatePickerLabels>', default: 'Chinese labels', description: 'Overrides operation names, panel headings, date-state descriptions, keyboard hints, and validation messages.' },
]
const pickerSlots: SlotTableItem[] = [
  { name: 'trigger', description: 'Replaces the calendar button inside the field, not the complete entry. Receives { open, close, triggerProps }; bind triggerProps to a real button.' },
  { name: 'title', description: 'Replaces the panel title inside its existing heading. In docked layout this heading is visually hidden but still names the dialog. No parameters.' },
]
</script>

# Date Picker

`MdvDatePicker` chooses one Gregorian calendar date through a text field and a docked, modal, or fullscreen calendar. The model is a pure date string in `YYYY-MM-DD` format, or `null`; it contains no time or time zone. For two endpoints, use [Date Range Picker](./date-range-picker).

## Basic usage

Bind `v-model`, provide a field label, and open the calendar with its separate icon button. Focusing or typing in the field does not open it automatically. The shared examples use English labels in both article languages.

<DemoBlock>
  <DatePickerBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvDatePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'

const date = ref<MdvDateValue>('2026-11-19')
const message = ref('Open the calendar to edit a draft, then confirm or cancel.')
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
    <MdvDatePicker v-model="date" label="Appointment date" locale="en-US" :labels="labels" clearable @confirm="message = `Confirmed ${$event ?? '(none)'}.`" @cancel="message = `Draft discarded: ${$event.reason}.`" />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Committed: {{ date ?? '(none)' }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

### Drafts and accepted values

Calendar selection edits a draft. Confirm writes a valid, parent-accepted value and requests closing; Cancel, Escape, an outside interaction, or external closing discards the panel draft. Clearing the entry requests `null` directly.

With the panel closed, Enter or leaving the text field validates and commits its text separately. Those entry changes do not emit the panel's `confirm` event. Invalid text stays available for correction instead of replacing the accepted model.

Dates support years `0001`–`9999`. Keep them as pure dates in application data; converting them to local timestamps can change their meaning across time zones.

---

## Layout and entry view

Use `auto` for a responsive picker, or choose an explicit layout. Change the initial view, then reopen the picker to try calendar versus text entry.

<DemoBlock>
  <DatePickerLayoutDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDatePicker, MdvSelect } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDatePickerLayout, MdvDateValue } from '@mdv-ui/mdv'

const date = ref<MdvDateValue>('2026-11-19')
const layout = ref<MdvDatePickerLayout>('auto')
const inputView = ref(false)
const layouts = ['auto', 'docked', 'modal', 'fullscreen'].map(value => ({ value, label: value }))
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
    <div class="flex flex-wrap items-center gap-4">
      <MdvSelect :model-value="layout" :options="layouts" label="Picker layout" @update:model-value="layout = $event as MdvDatePickerLayout" />
      <MdvCheckbox v-model="inputView" label="Start with text input" />
    </div>
    <MdvDatePicker v-model="date" :layout="layout" :initial-view="inputView ? 'input' : 'calendar'" label="Travel date" locale="en-US" :labels="labels" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Layout: {{ layout }} · Committed: {{ date ?? '(none)' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="Single-date picker layouts" min-width="30rem">

| Layout | Behavior |
| --- | --- |
| `auto` | Fullscreen below a 600px viewport width; docked otherwise. |
| `docked` | Nonmodal popover 4px below the field, aligned to its logical start. Always shows the calendar. |
| `modal` | Centered modal with calendar/input switching and Cancel/Confirm actions. |
| `fullscreen` | Modal filling the viewport, with Close/Save actions. |

</DocsTable>

Docked has a fixed 360px panel width. It follows its anchor while scrolling and deliberately does not flip, shift, or shrink at viewport edges. An explicit docked layout can extend beyond a narrow viewport; use `auto` or fullscreen for those contexts. Auto responds to viewport width, not the field's container width.

Modal/fullscreen have a view-switch button. Changing layout while open preserves drafts and browsing state without confirming them. External model changes resynchronize the draft to the newly accepted value.

## Date limits and field states

Set inclusive ISO `min`/`max` bounds and a fast, side-effect-free `disabled-date` predicate. Dynamic constraint changes revalidate accepted values and drafts without silently rewriting the model.

<DemoBlock>
  <DatePickerConstraintsDemo />
  <template #source>

```vue:line-numbers
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
```

  </template>
</DemoBlock>

Invalid bounds prevent committing. Disabled or read-only fields cannot edit, clear, or open; switching to those states also releases an open layer. Read-only values remain available for form submission. `error`/`error-text` represent an external entry error; use actual date constraints or parent acceptance logic to restrict panel confirmation.

Calendar validation feedback is available to assistive technology, while text-input view also displays error text. An unavailable day remains readable with keyboard navigation but cannot be selected.

---

## Locale and interface labels

`locale` changes date formatting, weekday/month names, field-entry order, and the default week start. It does not translate the interface. Set `labels` for operations, errors, and accessible descriptions; omitted keys retain MDV's Chinese defaults.

<DemoBlock>
  <DatePickerLocaleDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDatePicker, MdvSelect } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'

const date = ref<MdvDateValue>('2026-11-19')
const locale = ref('en-US')
const monday = ref(false)
const locales = ['en-US', 'en-GB', 'de-DE'].map(value => ({ value, label: value }))
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
    <div class="flex flex-wrap items-center gap-4">
      <MdvSelect :model-value="locale" :options="locales" label="Date locale" @update:model-value="locale = $event as string" />
      <MdvCheckbox v-model="monday" label="Always start weeks on Monday" />
    </div>
    <MdvDatePicker v-model="date" label="Meeting date" :locale="locale" :first-day-of-week="monday ? 1 : undefined" :labels="labels" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Locale: {{ locale }} · ISO model: {{ date ?? '(none)' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

The locale affects display, while the model remains ISO. The picker uses Gregorian dates and Latin digits. Text entry accepts explicit ISO dates and locale-order dates separated by slashes, hyphens, dots, or spaces; month/day can use one digit. Undelimited text must contain eight digits in the locale's order. Two-digit years are not guessed, separators are not inserted while typing, and IME Enter does not commit.

<DocsTable label="Date picker label groups" min-width="32rem">

| Purpose | Keys in `MdvDatePickerLabels` |
| --- | --- |
| Panel headings | `title`, `rangeTitle`, `chooseDate`, `chooseRange` |
| Operations | `open`, `calendar`, `input`, `cancel`, `confirm`, `save`, `clear` |
| Calendar navigation | `previousMonth`, `nextMonth`, `previousYear`, `nextYear`, `month`, `year`, `previousYears`, `nextYears`, `earlierMonths`, `laterMonths` |
| Date descriptions | `today`, `selected`, `rangeStart`, `rangeEnd`, `inRange`, `unavailable` |
| Fields and hints | `startLabel`, `endLabel`, `dateLabel`, `formatHint`, `keyboardHint` |
| Validation | `invalidDate`, `required`, `incompleteRange`, `reversedRange`, `outOfBounds`, `disabledDate`, `blockedRange`, `invalidBounds` |

</DocsTable>

## Controlled state and custom trigger

The date model and `v-model:open` are independent. A parent can reject date updates or opening/closing requests. A rejected date leaves the panel open without emitting `confirm`. Closing is a separate request, so accepting a date does not force the parent to accept closing.

<DemoBlock>
  <DatePickerControlledDemo />
  <template #source>

```vue:line-numbers
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
```

  </template>
</DemoBlock>

This example can reject the next closing request once, then permits another attempt. Keep an available dismissal path when designing a controlled modal. The custom trigger binds `triggerProps` to an MDV icon button, retaining the native button type, accessible name, expanded state, target, disabled state, and click handler. `focus()` focuses the entry without opening it.

---

## Native forms and validation

Set `name` to serialize the accepted ISO value. `required`, reset, disabled fieldsets, and an external `form` association use native form behavior. The component exposes validation methods for application rules.

<DemoBlock>
  <DatePickerFormDemo />
  <template #source>

```vue:line-numbers
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
```

  </template>
</DemoBlock>

FormData contains the hidden accepted value, not the localized display text. An empty optional date submits an empty string under its configured name. Panel draft inputs are excluded from the outer form. Complete a text edit with Enter or blur before submitting; Enter commits the entry rather than automatically submitting the form.

Reset requests the initial model, clears custom validity and editing feedback, and remains subject to parent acceptance. A cancelled native reset is respected. If you use `setCustomValidity()`, clear its message once the application error is resolved.

## Keyboard, focus, and motion

- The grid has one Tab stop. Arrows move by day/week; Home/End move to the week's first/last day; PageUp/PageDown change month, and Shift changes year. Horizontal navigation mirrors in RTL.
- Space selects a draft; single-date Enter selects and confirms. Shift+M/Shift+Y focus the month/year control, or the combined month/year control in a modal single-date picker.
- Docked uses a nonmodal Popover. Modal/fullscreen use a native dialog, constrain Tab focus, and coordinate with other MDV overlays. Escape returns to the opener; outside click/blur preserves the reader's new target.
- Layers remain in their original DOM position and inherit local themes. Provide supported modern dialog/Popover APIs; rendering is not teleported to the document body. Server output stays closed and opening is established after mounting/hydration.
- Layout-specific motion honors reduced motion and supports quick reversals. The closing lifecycle completes after motion and resource release. Touch keyboards and screen-reader combinations still need application/device testing.

---

## API

### Props

<ApiTable :items="pickerProps" />

### Slots

<SlotsTable :items="pickerSlots" />

### Events

<DocsTable label="Date picker events" min-width="34rem">

| Event | Payload and timing |
| --- | --- |
| `update:modelValue` | `MdvDateValue`; requests an accepted date or `null`. |
| `update:open` | `boolean`; requests opening or closing. |
| `confirm` | Accepted valid `MdvDateValue` after panel confirmation; not emitted for an entry edit or clear action. |
| `cancel` | `{ reason }`; an actual close other than confirmation, including external model/disabled changes, discards the panel draft. |
| `open` / `opened` | No payload; opening starts / opening motion finishes. |
| `close` / `closed` | `{ reason }`; closing starts / motion and cleanup finish. |

</DocsTable>

Reasons are `confirm`, `cancel`, `escape`, `scrim`, `outside`, `blur`, `model`, `programmatic`, and `disabled`. Availability depends on the layout and close path. Layout migration does not emit a false cancel/open cycle.

### Methods and native attributes

<DocsTable label="Date picker exposed methods" min-width="32rem">

| Method | Result | Purpose |
| --- | --- | --- |
| `open(event?)` / `close()` | `Promise<boolean>` | Reports parent acceptance; does not await the final motion event. `close()` uses reason `programmatic`. |
| `focus(options?)` | `void` | Focuses the entry without opening. |
| `checkValidity()` / `reportValidity()` | `boolean` | Checks native constraints; reporting also reveals validation feedback. |
| `setCustomValidity(message)` | `void` | Sets a custom native validity message; use `''` to clear it. |

</DocsTable>

`class`/`style` apply to the outer wrapper; `dir`/`lang` also reach the field. Other native attributes and listeners target the entry input. `form` associates the text and hidden model field with that form. Use the picker props for date bounds and model values instead of overriding the managed input's `type`, `value`, or display name.

### Public types

```ts
import type {
  MdvDateValue,
  MdvDatePickerProps,
  MdvDatePickerCommonProps,
  MdvDatePickerLayout,
  MdvDatePickerView,
  MdvDatePickerLabels,
  MdvDatePickerCloseReason,
  MdvDatePickerCloseDetail,
  MdvDatePickerTriggerProps,
  MdvDatePickerTriggerSlotProps,
  MdvDatePickerSlots,
  MdvDatePickerExpose,
} from '@mdv-ui/mdv'
```
