<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DateRangePickerBasicDemo from '@/components/docs/demos/dateRangePicker/basic.vue'
import DateRangePickerLayoutDemo from '@/components/docs/demos/dateRangePicker/layout.vue'
import DateRangePickerConstraintsDemo from '@/components/docs/demos/dateRangePicker/constraints.vue'
import DateRangePickerInputDemo from '@/components/docs/demos/dateRangePicker/input.vue'
import DateRangePickerFormDemo from '@/components/docs/demos/dateRangePicker/form.vue'

const rangeProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvDateRangeValue', default: 'null', description: 'Accepted { start, end } ISO date pair, or null. Only complete valid ranges are committed. Unbound models are managed internally.' },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: 'false', description: 'Independent opening state; unbound state is managed internally.' },
  { name: 'layout', type: "'auto' | 'modal' | 'fullscreen'", default: "'auto'", description: 'Auto uses fullscreen below 600 CSS px and modal otherwise. Range selection has no docked layout.' },
  { name: 'initialView', type: "'calendar' | 'input'", default: "'calendar'", description: 'Calendar or text-input view used when opening the panel.' },
  { name: 'locale', type: 'string', default: "'zh-CN'", description: 'Date formatting, month/weekday names, entry order, and default week start. Uses Gregorian dates and Latin digits; does not translate labels.' },
  { name: 'firstDayOfWeek', type: '0 | 1 | 2 | 3 | 4 | 5 | 6', default: 'From locale', description: 'Explicit week start, with Sunday=0 and Saturday=6.' },
  { name: 'min', type: 'string', description: 'Inclusive earliest ISO date. Invalid or reversed bounds prevent committing.' },
  { name: 'max', type: 'string', description: 'Inclusive latest ISO date.' },
  { name: 'disabledDate', type: '(date: string) => boolean', description: 'Synchronous unavailable-date predicate. A blocked date anywhere inside the inclusive range invalidates the entire range.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both entries, clearing, and opening. Native disabled fieldsets are also respected.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents editing/opening while retaining accepted values for form submission.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Requires a complete valid range through native inputs and picker validation.' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Adds a clear action requesting null for the whole range.' },
  { name: 'startLabel', type: 'string', default: 'labels.startLabel', description: 'Visible label and accessible name of the start entry.' },
  { name: 'endLabel', type: 'string', default: 'labels.endLabel', description: 'Visible label and accessible name of the end entry.' },
  { name: 'startName', type: 'string', description: 'Form field name for the accepted start ISO date.' },
  { name: 'endName', type: 'string', description: 'Form field name for the accepted end ISO date.' },
  { name: 'placeholder', type: 'string', description: 'Optional placeholder shared by the entry fields and the panel text inputs.' },
  { name: 'supportingText', type: 'string', description: 'Supporting text below the input. When omitted, a format hint appears only if labels.formatHint is supplied.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'External entry error state, also used by native validity. Use constraints or parent acceptance logic for panel restrictions.' },
  { name: 'errorText', type: 'string', description: 'Application message for the error prop. Internal validation uses the corresponding entry in labels.' },
  { name: 'labels', type: 'Partial<MdvDatePickerLabels>', description: 'Optional application copy for panel titles, controls, accessible names, hints, and validation messages.' },
]
const rangeSlots: SlotTableItem[] = [
  { name: 'trigger', description: 'Replaces the calendar button in the end field. Receives { open, close, triggerProps }; bind the supplied props to a native button.' },
  { name: 'title', description: 'Replaces the panel title while preserving its heading and accessible naming. No parameters.' },
]
</script>
# Date Range Picker

Use `MdvDateRangePicker` to choose an inclusive start and end date. Use `{ start, end }` with `YYYY-MM-DD` strings, or `null` when no range is selected.

## Basic usage

Bind `v-model` and label both fields. Choose both endpoints before confirming; a same-day range is valid.

<DemoBlock>
  <DateRangePickerBasicDemo />
  <template #source>

```vue:line-numbers
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
```

  </template>
</DemoBlock>

## Modal and fullscreen layouts

Set `layout` to `modal` or `fullscreen`. `auto` uses fullscreen below a 600px viewport width and modal otherwise.

<DemoBlock>
  <DateRangePickerLayoutDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDateRangePicker, MdvSelect } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangePickerLayout, MdvDateRangeValue } from '@mdv-ui/mdv'

const range = ref<MdvDateRangeValue>({ start: '2026-11-19', end: '2026-11-23' })
const layout = ref<MdvDateRangePickerLayout>('auto')
const inputView = ref(false)
const layouts = ['auto', 'modal', 'fullscreen'].map(value => ({ value, label: value }))
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
      <MdvSelect :model-value="layout" :options="layouts" label="Range layout" @update:model-value="layout = $event as MdvDateRangePickerLayout" />
      <MdvCheckbox v-model="inputView" label="Start with text input" />
    </div>
    <MdvDateRangePicker v-model="range" :layout="layout" :initial-view="inputView ? 'input' : 'calendar'" start-label="First day" end-label="Last day" locale="en-US" :labels="labels" />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Layout: {{ layout }} · Committed: {{ JSON.stringify(range) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Date limits

Set inclusive `min` and `max` bounds and use `disabled-date` to exclude unavailable dates. Any excluded date inside the interval makes the range invalid.

<DemoBlock>
  <DateRangePickerConstraintsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDateRangePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangeValue } from '@mdv-ui/mdv'

const range = ref<MdvDateRangeValue>({ start: '2026-11-19', end: '2026-11-19' })
const readonly = ref(false)
const unavailable = (date: string) => date === '2026-11-20'
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
    <MdvCheckbox v-model="readonly" label="Read only" />
    <MdvDateRangePicker
      v-model="range"
      start-label="Booking start"
      end-label="Booking end"
      locale="en-US"
      :labels="labels"
      min="2026-11-01"
      max="2026-12-31"
      :disabled-date="unavailable"
      :readonly="readonly"
      supporting-text="November–December 2026; the entire range must avoid November 20."
      clearable
    />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Committed: {{ JSON.stringify(range) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Text input and validation

With the panel closed, Enter or leaving both fields validates the typed range. Reversed or incomplete ranges cannot be saved even without an error message. Use `locale` to set the date format and supply the messages your application needs through `labels`. [Date Picker label reference](./date-picker#locale-and-interface-labels)

<DemoBlock>
  <DateRangePickerInputDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvDateRangePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangeValue } from '@mdv-ui/mdv'

const range = ref<MdvDateRangeValue>(null)
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
    <MdvDateRangePicker v-model="range" initial-view="input" start-label="Course start" end-label="Course end" locale="en-GB" :labels="labels" required supporting-text="Use DD/MM/YYYY or YYYY-MM-DD. End must not precede start." />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Complete ISO range: {{ JSON.stringify(range) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Forms and reset

Set `start-name` and `end-name` to submit the two accepted ISO dates as separate fields. Native reset restores the initial model.

<DemoBlock>
  <DateRangePickerFormDemo />
  <template #source>

```vue:line-numbers
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
```

  </template>
</DemoBlock>

---

## API

### Props

<ApiTable :items="rangeProps" />

### Range value

These are `MdvDateRange` object fields inside the model, not separate component props.

<DocsTable label="Date range value fields" min-width="28rem">

| Field | Type | Meaning |
| --- | --- | --- |
| `start` | `string` | Required valid Gregorian `YYYY-MM-DD` start date. |
| `end` | `string` | Required valid Gregorian `YYYY-MM-DD` end date, not before start. |

</DocsTable>

`MdvDateRangeValue` is that complete object or `null`. Keep both endpoints as pure dates when storing or transmitting the model.

### Slots

<SlotsTable :items="rangeSlots" />

### Events

<DocsTable label="Date range picker events" min-width="34rem">

| Event | Payload and timing |
| --- | --- |
| `update:modelValue` | `MdvDateRangeValue`; requests a complete range or `null`. |
| `update:open` | `boolean`; independent opening/closing request. |
| `confirm` | Accepted valid `MdvDateRangeValue` after panel confirmation; entry edits and clearing do not emit it. |
| `cancel` | `{ reason }`; an actual close other than confirmation, including external model/disabled changes, discards the panel draft. |
| `open` / `opened` | No payload; opening begins / motion completes. |
| `close` / `closed` | `{ reason }`; closing begins / motion and cleanup complete. |

</DocsTable>

The shared reason type contains `confirm`, `cancel`, `escape`, `scrim`, `outside`, `blur`, `model`, `programmatic`, and `disabled`; individual reasons depend on the layout and close path. Layout migration does not produce false cancel/open events. Date acceptance and close acceptance are separate, so `confirm` does not guarantee that a controlled parent closed the panel.

### Methods and native attributes

<DocsTable label="Date range picker exposed methods" min-width="32rem">

| Method | Result | Purpose |
| --- | --- | --- |
| `open(event?)` / `close()` | `Promise<boolean>` | Reports parent acceptance, not animation completion. `close()` uses `programmatic`. |
| `focus(options?)` | `void` | Focuses the start entry without opening. |
| `checkValidity()` / `reportValidity()` | `boolean` | Checks both entry fields; reporting also reveals feedback. |
| `setCustomValidity(message)` | `void` | Sets the shared custom entry validity; use `''` to clear. |

</DocsTable>

`class`/`style` target the wrapper, and `dir`/`lang` also reach the fields. Other native attributes/listeners generally target the start input; the end input retains its own label and does not duplicate those listeners, ARIA naming, autofocus, or placeholder. `form` associates both visible fields and hidden model fields with an external form. Use `start-name`/`end-name` rather than a generic `name` attribute.

### Public types

```ts
import type {
  MdvDateRange,
  MdvDateRangeValue,
  MdvDateRangePickerProps,
  MdvDateRangePickerLayout,
  MdvDatePickerCommonProps,
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
