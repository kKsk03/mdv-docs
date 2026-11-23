<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BasicDemo from '@/components/docs/demos/select/basic.vue'
import MenusDemo from '@/components/docs/demos/select/menus.vue'
import StateDemo from '@/components/docs/demos/select/state.vue'
import FormDemo from '@/components/docs/demos/select/form.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string | number | null', default: 'Internal null', description: 'Selected option value. Omit for internal state; bind to control acceptance. Value comparison uses Object.is.' },
  { name: 'options', type: 'readonly MdvSelectOption[]', default: 'Required', description: 'Options with unique typed values and visible labels; supports supportingText and disabled.' },
  { name: 'noOptionsText', type: 'string', description: 'Optional message shown in an empty listbox.' },
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

Use `MdvSelect` to choose one value from predefined options. For search or free text, use [Autocomplete](./autocomplete).

## Fields and options

Bind `v-model` and supply `options` with a `value` and `label` for each choice. Use `null` for no selection; numeric and string values are distinct.

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
    <MdvSelect
      label="Archived projects"
      :options="[]"
      no-options-text="No archived projects"
      full-width
    />
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Outlined: {{ JSON.stringify(outlined) }} · Filled: {{ JSON.stringify(filled) }} · Typed: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Menu and custom options

Set `variant` for the field and `menu-variant` for the popup. Use the `option` slot for custom content; `active` is the highlighted option, while `selected` reflects the model.

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

## Field states and clearing

Set `disabled` on the field or on individual options. Assign `null` to clear a selection. Use `error` and `error-text` for messages; use native validation when the error must also block submission.

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

## Forms and validation

Set `name` to submit the selected value. `required` checks for a nonempty value, not whether it still exists in `options`. Clear a stale model yourself when replacing options.

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

Use `no-options-text` to describe an empty list. Open the Archived projects field above to see an example. For asynchronous options, manage loading, errors, and retry in the application.

---

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
