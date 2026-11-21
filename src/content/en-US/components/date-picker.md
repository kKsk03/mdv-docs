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

Use `MdvDatePicker` to choose one date. The model is `YYYY-MM-DD` or `null`, without a time zone. For two dates, use [Date Range Picker](./date-range-picker).

## Basic usage

Bind `v-model`, label the field, and use the calendar button to open the picker. Confirm to commit the draft. With the panel closed, valid text commits on Enter or blur.

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

## Layout and entry view

Set `layout` to `auto` for a fullscreen picker below a 600px viewport and a docked picker otherwise. Choose `modal` or `fullscreen` explicitly when needed.

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

## Date limits

Set inclusive `min` and `max` dates, or use `disabled-date` to exclude individual dates. Use `readonly` when an existing value should be submitted without allowing edits.

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

## Locale and interface labels

Use `locale` for date formatting, and `labels` for button names, accessible names, and errors. Unspecified labels use the Chinese defaults.

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

## Native forms and validation

Set `name` to submit the accepted ISO date. Use `required` for a mandatory date and `form` to associate an external form.

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
