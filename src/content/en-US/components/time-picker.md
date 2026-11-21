<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import AvailabilityDemo from '@/components/docs/demos/timePicker/availability.vue'
import FormDemo from '@/components/docs/demos/timePicker/form.vue'
import ModesDemo from '@/components/docs/demos/timePicker/modes.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvTimeValue', default: 'null', description: "Committed ASCII 'HH:mm' or null." },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: 'false', description: 'Controls the modal separately from the committed time. Omit for internal ownership.' },
  { name: 'initialView', type: 'MdvTimePickerView', default: "'auto'", description: "'dial', 'input', or 'auto' (input for a fine primary pointer, dial otherwise)." },
  { name: 'orientation', type: 'MdvTimePickerOrientation', default: "'auto'", description: "Dial layout: 'auto', 'vertical', or 'horizontal'. Falls back to input if it does not fit." },
  { name: 'hourCycle', type: 'MdvTimePickerHourCycle', default: "'auto'", description: "'h12', 'h23', or the locale's preference with 'auto'." },
  { name: 'locale', type: 'string', default: "'zh-CN'", description: 'Intl locale for digits, time formatting, and day-period markers, not interface strings.' },
  { name: 'min', type: 'string', description: 'Inclusive earliest time in HH:mm format, within the same day.' },
  { name: 'max', type: 'string', description: 'Inclusive latest time in HH:mm format, within the same day.' },
  { name: 'disabledTime', type: '(time: string) => boolean', description: 'Return true to exclude a canonical HH:mm value.' },
  { name: 'minuteStep', type: 'number', default: '1', description: 'Positive integer divisor of 60, measured from minute 00 of each hour.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input, picker trigger, and native form entry.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Prevents editing or opening without excluding the value from submission.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Requires a valid, available time.' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Shows a clear action on a nonempty editable field, even when required.' },
  { name: 'label', type: 'string', description: 'Visible input label. Falls back to labels.time.' },
  { name: 'supportingText', type: 'string', description: 'Replaces the default format hint below the input.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Reports an application error and blocks confirmation and native validity.' },
  { name: 'errorText', type: 'string', description: 'Application error message. Falls back to labels.invalidTime when error is true.' },
  { name: 'name', type: 'string', description: 'Name of the hidden native field carrying the committed value.' },
  { name: 'labels', type: 'Partial<MdvTimePickerLabels>', description: 'Overrides Chinese interface and validation strings one key at a time.' },
]
const slots: SlotTableItem[] = [
  { name: 'trigger', description: 'Replaces the trailing clock button. Receives { open, close, triggerProps }; bind triggerProps to a single real button or a component that forwards them to a button.' },
  { name: 'title', description: 'Replaces the modal title and supplies its accessible name.' },
]
</script>
# Time Picker

Use `MdvTimePicker` to select a time of day. The model is a 24-hour `HH:mm` string or `null`, with no date or time zone.

## Dial and text entry

Open the picker with the clock button. Switch between the dial and text entry without losing the draft. Confirm to commit the time or dismiss to discard the draft.

<DemoBlock>
  <ModesDemo />
  <template #source>

```vue:line-numbers
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
```

  </template>
</DemoBlock>

## Available times

Set inclusive same-day `min` and `max` bounds. For a window across midnight, use `disabled-time` instead of reversing the bounds. `minute-step` must divide 60.

<DemoBlock>
  <AvailabilityDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvTimePicker } from '@mdv-ui/mdv'
import type { MdvTimeValue } from '@mdv-ui/mdv'
import clockIcon from '@iconify-icons/material-symbols/schedule'
import { englishTimePickerLabels } from './labels'

const time = ref<MdvTimeValue>('22:00')
const open = ref(false)
const blockAll = ref(false)
const reject = ref(false)
const result = ref('No change requested.')

function disabledTime(value: string) {
  return blockAll.value || (value > '02:00' && value < '22:00')
}

function requestTime(value: MdvTimeValue) {
  if (reject.value) {
    result.value = `Kept ${time.value ?? 'no time'} instead of ${value ?? 'no time'}.`
    return
  }
  time.value = value
  result.value = `Accepted ${value ?? 'no time'}.`
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <MdvCheckbox v-model="blockAll" label="Block all times" />
      <MdvCheckbox v-model="reject" label="Decline changes" />
    </div>
    <MdvTimePicker
      v-model:open="open"
      :model-value="time"
      :disabled-time="disabledTime"
      :labels="englishTimePickerLabels"
      :minute-step="15"
      label="Maintenance starts at"
      supporting-text="From 22:00 to 02:00, in 15-minute steps."
      locale="en-US"
      hour-cycle="h23"
      initial-view="input"
      @update:model-value="requestTime"
    >
      <template #title>Schedule overnight maintenance</template>
      <template #trigger="{ triggerProps }">
        <MdvIconButton v-bind="triggerProps" variant="standard">
          <MdvIcon :icon="clockIcon" />
        </MdvIconButton>
      </template>
    </MdvTimePicker>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ result }} Picker: {{ open ? 'open' : 'closed' }}.
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Native forms and validation

Valid text commits on blur or Enter. A named field submits the committed `HH:mm` value even if the display uses AM/PM. Use `required` to require a time.

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
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
```

  </template>
</DemoBlock>

## Localization

Use `locale` and `hour-cycle` for display and input format. Pass `labels` to translate interface text, which defaults to Chinese.

```ts:line-numbers
import type { MdvTimePickerLabels } from '@mdv-ui/mdv'

export const englishTimePickerLabels: MdvTimePickerLabels = {
  title: 'Choose a time',
  time: 'Time',
  hour: 'Hour',
  minute: 'Minute',
  period: 'AM or PM',
  open: 'Open time picker',
  dial: 'Switch to dial',
  input: 'Switch to text entry',
  cancel: 'Cancel',
  confirm: 'OK',
  clear: 'Clear time',
  formatHint: 'Time format',
  keyboardHint: 'Use arrow keys to change the value, Home or End to go to the first or last option, and Space or Enter to select.',
  invalidTime: 'Enter a valid time.',
  required: 'Choose a time.',
  outOfBounds: 'This time is outside the allowed range.',
  disabledTime: 'This time is unavailable.',
  invalidBounds: 'The earliest and latest times are invalid or out of order.',
  invalidStep: 'The minute step must be a positive divisor of 60.',
  stepMismatch: 'Use a time that matches the minute step.',
  noAvailableTime: 'There are no available times.',
}
```

---

## API

### Props

<ApiTable :items="props" />

### Slots

<SlotsTable :items="slots" />

### Events and exposed methods

- `update:modelValue(value)` requests a time change; `update:open(boolean)` requests modal visibility. `confirm(value)` is emitted only after the modal's draft is accepted. Closing without confirming emits `cancel(detail)`.
- `open` and `close(detail)` mark the start of opening and closing; `opened` and `closed(detail)` indicate that the transition finished. `detail.reason` is `confirm`, `cancel`, `escape`, `scrim`, `model`, `programmatic`, or `disabled`.
- A template ref provides `open(event?)` and `close()` returning `Promise<boolean>` for acceptance, not animation completion. It also provides `focus(options?)`, `checkValidity()`, `reportValidity()`, and `setCustomValidity(message)`; pass an empty string to clear a custom error.

`class`, `style`, `dir`, and `lang` may be set on the wrapper; ID, `form`, and applicable native input attributes and listeners are forwarded to the outer input. Use picker props for time bounds and steps rather than native `min`, `max`, or `step`. The native dialog keeps its original DOM ancestry and inherits a local theme.

### Public types

```ts
import type {
  MdvTimeValue,
  MdvTimePickerProps,
  MdvTimePickerView,
  MdvTimePickerOrientation,
  MdvTimePickerHourCycle,
  MdvTimePickerLabels,
  MdvTimePickerCloseReason,
  MdvTimePickerCloseDetail,
  MdvTimePickerTriggerProps,
  MdvTimePickerTriggerSlotProps,
  MdvTimePickerSlots,
  MdvTimePickerExpose,
} from '@mdv-ui/mdv'
```
