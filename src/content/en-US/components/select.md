<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BasicDemo from '@/components/docs/demos/select/basic.vue'
import MenusDemo from '@/components/docs/demos/select/menus.vue'
import StateDemo from '@/components/docs/demos/select/state.vue'
import ControlledDemo from '@/components/docs/demos/select/controlled.vue'
import AsyncDemo from '@/components/docs/demos/select/async.vue'
import FormDemo from '@/components/docs/demos/select/form.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string | number | null', default: 'Internal null', description: 'Selected option value. Omit for internal state; bind to control acceptance. Value comparison uses Object.is.' },
  { name: 'options', type: 'readonly MdvSelectOption[]', default: 'Required', description: 'Options with unique typed values and visible labels; supports supportingText and disabled.' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'outlined'", description: 'TextField appearance, independent of menuVariant.' },
  { name: 'menuVariant', type: "'expressive' | 'baseline'", default: "'expressive'", description: 'Listbox surface and option treatment. The popup is an independent combobox listbox, not MdvMenu.' },
  { name: 'label', type: 'string', default: "''", description: 'Visible field label and listbox name. Supply aria-label or aria-labelledby if omitting the visible label.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Hint when the displayed value is empty.' },
  { name: 'supportingText', type: 'string', default: "''", description: 'Supporting information associated with the field.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'External visual/ARIA error. Does not independently create a native validation failure.' },
  { name: 'errorText', type: 'string', default: "''", description: 'Preferred message for external or reported native errors.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction, native validation, and submission. Disabling requests that an open listbox close.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Requires a value other than null or an empty string, through a native validation proxy. Numeric zero is valid.' },
  { name: 'name', type: 'string', description: 'Name of the hidden submitted value. The visible readonly label input and validation proxy are unnamed.' },
  { name: 'form', type: 'string', description: 'External native form ID for the submitted value, validation proxy, and visible field.' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Fills the available container width.' },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: 'Internal false', description: 'Omit for internal opening state; bind to accept or reject update:open requests.' },
]
const slots: SlotTableItem[] = [{ name: 'option', description: 'Replaces the content of each option; receives { option: MdvSelectOption, selected: boolean, active: boolean }. The component retains the option role and interaction wrapper. Keep content noninteractive.' }]
</script>

# Select

`MdvSelect` chooses one value from predefined options using an outlined or filled field and a listbox popup. This page describes **MDV 0.1.5**. Use [Autocomplete](./autocomplete) when readers need editable queries or free-text values.

## Fields, options, and typed values

Each option has a unique `value` and `label`, with optional `supportingText` and `disabled`. The model stores the value, while the field displays the label. The number `1` and string `'1'` are distinct; disabled options stay visible but cannot be activated. The field itself is readonly because selection comes from the listbox.

<DemoBlock>
  <BasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const sizes: MdvSelectOption[] = [
  { value: 'small', label: 'Small', supportingText: 'For personal projects' },
  { value: 'medium', label: 'Medium', supportingText: 'For a growing team' },
  { value: 'large', label: 'Large', supportingText: 'Currently unavailable', disabled: true },
]
const typedOptions: MdvSelectOption[] = [{ value: 1, label: 'Number 1' }, { value: '1', label: 'String 1' }]
const outlined = ref<MdvSelectValue | null>('small')
const filled = ref<MdvSelectValue | null>(null)
const typed = ref<MdvSelectValue | null>(1)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <MdvSelect v-model="outlined" label="Outlined size" :options="sizes" full-width />
      <MdvSelect v-model="filled" label="Filled size" variant="filled" placeholder="Choose a size" :options="sizes" full-width />
    </div>
    <MdvSelect v-model="typed" label="Strict value types" :options="typedOptions" full-width />
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Outlined: {{ JSON.stringify(outlined) }} · Filled: {{ JSON.stringify(filled) }} · Typed: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Menu appearances and custom options

`variant` controls the field; `menu-variant` independently controls the listbox. Expressive is the default. The `option` slot receives the original option and separate selected/active states. `active` tracks keyboard or pointer navigation; it does not mean the model has accepted a selection.

Long lists scroll inside the popup. Modern browsers use the Popover top layer, with viewport flipping and shifting from Floating UI. The popup stays in the component's DOM and inherits local themes and direction. There is no virtual scrolling; keep option counts appropriate for a simple select.

<DemoBlock>
  <MenusDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'
import checkIcon from '@iconify-icons/material-symbols/check'

const expressive = ref<MdvSelectValue | null>('design')
const baseline = ref<MdvSelectValue | null>('design')
const dark = ref(false)
const rtl = ref(false)
const options: MdvSelectOption[] = [
  { value: 'design', label: 'Design system', supportingText: 'Shared components and foundations' },
  { value: 'website', label: 'Documentation website', supportingText: 'Guides, examples, and API reference' },
  { value: 'archive', label: 'Archived workspace', supportingText: 'Read-only access', disabled: true },
  ...Array.from({ length: 12 }, (_, index) => ({ value: `project-${index}`, label: `Research project ${index + 1}`, supportingText: 'A longer option label and supporting description for scrolling.' })),
]
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="grid gap-4 rounded-xl bg-mdv-surface p-4 text-mdv-on-surface sm:grid-cols-2">
      <MdvSelect v-model="expressive" label="Expressive menu" :options="options" full-width>
        <template #option="{ option, selected, active }">
          <div class="flex min-w-0 items-center gap-3">
            <MdvIcon :icon="selected ? checkIcon : folderIcon" />
            <span class="min-w-0 break-words">
              <span class="block" :class="active ? 'font-medium' : undefined">{{ option.label }}</span>
              <span class="block text-xs">{{ option.supportingText }}</span>
            </span>
          </div>
        </template>
      </MdvSelect>
      <MdvSelect v-model="baseline" label="Baseline menu" menu-variant="baseline" :options="options" full-width />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Disabled, errors, and clearing

Use `disabled` for unavailable fields and option-level `disabled` for unavailable choices. `error`/`error-text` present application feedback; use native constraints or `setCustomValidity()` when submission must also fail.

Clear the selection by assigning `null`. Select has no public `clearable` prop or clear slot. The separate action below respects the same disabled state. Clearing programmatically does not emit `select`; that event describes an activated option.

<DemoBlock>
  <StateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const value = ref<MdvSelectValue | null>('email')
const disabled = ref(false)
const error = ref(false)
const lastOption = ref('No option selected in this session.')
const options: MdvSelectOption[] = [{ value: 'email', label: 'Email' }, { value: 'push', label: 'Push notification' }, { value: 'sms', label: 'SMS', disabled: true }]
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="disabled" label="Disable channel" />
      <MdvCheckbox v-model="error" label="Show external error" />
    </div>
    <MdvSelect v-model="value" label="Notification channel" placeholder="Choose a channel" supporting-text="Only available channels can be selected." :options="options" :disabled="disabled" :error="error" error-text="This channel cannot be used for the current account." full-width @select="lastOption = `Selected option: ${$event.label}`" />
    <div><MdvButton variant="outlined" :disabled="disabled || value === null" @click="value = null">Clear channel</MdvButton></div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Model: {{ JSON.stringify(value) }} · {{ lastOption }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Controlled selection and opening

The value and open state are independent. Bind `v-model`/`v-model:open` for ordinary acceptance, or handle the update events explicitly to reject requests. Even when the parent rejects a chosen value, the component emits `select(option)` and requests popup closure. Do not treat `select` as confirmation that the parent stored the new value.

Instance `open()`/`close()` methods use the same controlled request path. Set the parent open state directly when the application owns an unconditional state change. `focus()` and `open()` are separate methods.

<DemoBlock>
  <ControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const field = useTemplateRef<InstanceType<typeof MdvSelect>>('field')
const value = ref<MdvSelectValue | null>('basic')
const open = ref(false)
const acceptValue = ref(false)
const acceptOpen = ref(true)
const requested = ref('none')
const options: MdvSelectOption[] = [{ value: 'basic', label: 'Basic' }, { value: 'pro', label: 'Pro' }]
function updateValue(next: MdvSelectValue | null) {
  requested.value = `value=${JSON.stringify(next)}`
  if (acceptValue.value) value.value = next
}
function updateOpen(next: boolean) {
  requested.value = `open=${next}`
  if (acceptOpen.value) open.value = next
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="acceptValue" label="Accept value requests" />
      <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
    </div>
    <MdvSelect ref="field" :model-value="value" :open="open" label="Controlled plan" :options="options" full-width @update:model-value="updateValue" @update:open="updateOpen" />
    <div class="flex flex-wrap gap-2">
      <MdvButton variant="outlined" @click="field?.focus(); field?.open()">Request open</MdvButton>
      <MdvButton variant="text" @click="field?.close()">Request close</MdvButton>
      <MdvButton variant="text" @click="open = false">Close directly</MdvButton>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Accepted: {{ value }} · Open: {{ open }} · Last request: {{ requested }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Application-managed option loading

The public Select API in 0.1.5 has no `loading`, `loadingText`, or `noOptionsText` props. Own loading, errors, cancellation, and retry outside the field. This simulated request disables selection until options are available, announces status, and cancels pending timers on restart, cancellation, or unmount. For query-driven remote suggestions, use Autocomplete.

<DemoBlock>
  <AsyncDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvLinearProgress, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const value = ref<MdvSelectValue | null>(null)
const options = ref<MdvSelectOption[]>([])
const loading = ref(false)
const failNext = ref(false)
const message = ref('Load projects to enable the field.')
let timer: ReturnType<typeof setTimeout> | undefined
function cancel() {
  clearTimeout(timer)
  loading.value = false
  message.value = 'Request cancelled.'
}
function load() {
  clearTimeout(timer)
  loading.value = true
  message.value = 'Loading projects…'
  const fail = failNext.value
  failNext.value = false
  timer = setTimeout(() => {
    loading.value = false
    if (fail) { message.value = 'The simulated service is unavailable. Try again.'; return }
    options.value = [{ value: 'design', label: 'Design system' }, { value: 'website', label: 'Documentation website' }]
    message.value = 'Projects loaded.'
  }, 450)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid min-w-0 gap-3" :aria-busy="loading">
    <MdvCheckbox v-model="failNext" label="Fail the next simulated request" />
    <div class="flex flex-wrap gap-2">
      <MdvButton @click="load">{{ loading ? 'Restart request' : 'Load projects' }}</MdvButton>
      <MdvButton variant="text" :disabled="!loading" @click="cancel">Cancel request</MdvButton>
    </div>
    <MdvLinearProgress v-if="loading" indeterminate aria-label="Loading project options" />
    <MdvSelect v-model="value" label="Project" placeholder="Choose a project" :options="options" :disabled="loading || options.length === 0" :supporting-text="message" full-width />
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }} Model: {{ JSON.stringify(value) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

If an empty Select listbox is opened, its current internal fallback message is Chinese. Localizing that message requires a library API review; it is not covered by the public Select props above. This demo uses explicit English application status instead of relying on the empty-popup fallback.

## Native forms, validation, and reset

The visible input displays the label and has no submitted name. A hidden input submits the actual selected value once; a separate unnamed native select provides required validation. `null` omits the named field, while `''` submits an empty value and fails `required`. Disabled fields are excluded. Numbers serialize as strings in FormData.

`required` checks emptiness, not membership in the current options. Removing or disabling an option does not clear an existing model; the parent owns that policy. An unknown model value is displayed as its string representation, so keep options and model consistent.

Native reset requests the model's initial value and closes the popup. Application custom errors need explicit cleanup with `setCustomValidity('')`, as shown below. `checkValidity()` can dispatch native invalid events; it is not a silent visual check.

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const formId = `select-delivery-${useId()}`
const field = useTemplateRef<InstanceType<typeof MdvSelect>>('field')
const value = ref<MdvSelectValue | null>(null)
const disabled = ref(false)
const message = ref('Not submitted.')
const options: MdvSelectOption[] = [{ value: '', label: 'Choose a method' }, { value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]
function submit(event: Event) {
  message.value = `Form data: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
function reset() {
  queueMicrotask(() => {
    field.value?.setCustomValidity('')
    message.value = 'Selection and application validation reset.'
  })
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvCheckbox v-model="disabled" label="Disable delivery field" />
    <MdvSelect ref="field" v-model="value" label="Delivery method" :options="options" :form="formId" name="delivery" required :disabled="disabled" full-width />
    <form :id="formId" class="flex flex-wrap gap-2" @submit.prevent="submit" @reset="reset">
      <MdvButton type="submit">Submit delivery</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset delivery</MdvButton>
      <MdvButton variant="text" @click="message = `Valid: ${field?.reportValidity()}`">Report validity</MdvButton>
      <MdvButton variant="text" @click="field?.setCustomValidity('Delivery is unavailable for this address.'); field?.reportValidity()">Set custom error</MdvButton>
      <MdvButton variant="text" @click="field?.setCustomValidity(''); message = `Valid: ${field?.checkValidity()}`">Clear custom error</MdvButton>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Model: {{ JSON.stringify(value) }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Accessibility and keyboard interaction

The input exposes combobox semantics with `aria-expanded`, `aria-controls`, and `aria-activedescendant`. Focus stays on the field while navigating; selected options expose `aria-selected`. Supply a visible label or an accessible name. Do not put links, inputs, or buttons in the option slot.

<DocsTable label="Select keyboard interaction">

| Key | Behavior |
| --- | --- |
| Enter / Space | Opens a closed listbox; commits the active enabled option when open. |
| Arrow Down / Arrow Up | Opens the listbox, then moves through enabled options without wrapping. |
| Home / End | Moves to the first/last enabled option; use while the listbox is open. |
| Printable characters | Searches option-label prefixes; a match is committed immediately. The typeahead buffer resets after 600ms. |
| Escape | Requests listbox closure. |
| Tab / blur / outside pointer | Normal focus movement; losing field focus or pressing outside requests closure. |

</DocsTable>

IME composition is not interpreted as selection shortcuts. Selection does not provide text editing or arbitrary free-text input. Verify screen readers, touch, native validation presentation, reduced motion, and popup placement in the final application.

## API

### Props

<ApiTable :items="props" />

`class` and `style` apply to the Select wrapper, as do `dir` and `lang`. Ordinary attributes/listeners reach its TextField input, including `id`, ARIA, and focus/keyboard events. The component manages readonly selection semantics, submitted names, and combobox ARIA. It has no public leading/trailing/clear slots; use the documented option slot.

### Slots

<SlotsTable :items="slots" />

### Events

<DocsTable label="Select events">

| Event | Payload | Meaning |
| --- | --- | --- |
| `update:modelValue` | `MdvSelectValue \| null` | Requests a selected value; also used by native reset. |
| `update:open` | `boolean` | Requests opening or closure, including controlled methods. |
| `select` | `MdvSelectOption` | An enabled option was chosen, including choosing the current value again. Parent acceptance is independent. |

</DocsTable>

Native field input/change events are DOM events, not typed selected-value events. Use `update:modelValue` and `select` for component selection. There is no Select `search` event.

### Methods

<DocsTable label="Select exposed methods">

| Method | Behavior |
| --- | --- |
| `focus(options?: FocusOptions)` / `blur()` | Focuses/blurs the visible field. |
| `open()` / `close()` | Requests popup state; returns no acceptance result. |
| `checkValidity(): boolean` | Checks the native validation proxy and visible input. |
| `reportValidity(): boolean` | Reports native validity and associated field feedback. |
| `setCustomValidity(message: string)` | Sets a native custom error; an empty string clears it. |

</DocsTable>

### Public types

```ts
import type {
  MdvSelectValue,           // string | number
  MdvSelectVariant,         // 'filled' | 'outlined'
  MdvSelectMenuVariant,     // 'expressive' | 'baseline'
  MdvSelectOption,          // value, label, supportingText?, disabled?
  MdvSelectOptionSlotProps, // option, selected, active
  MdvSelectBaseProps,
  MdvSelectProps,
} from '@mdv-ui/mdv'
```
