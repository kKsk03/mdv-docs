<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CheckboxBasicDemo from '@/components/docs/demos/checkbox/basic.vue'
import CheckboxGroupDemo from '@/components/docs/demos/checkbox/group.vue'
import CheckboxIndeterminateDemo from '@/components/docs/demos/checkbox/indeterminate.vue'
import CheckboxSelectAllDemo from '@/components/docs/demos/checkbox/selectAll.vue'
import CheckboxLabelDemo from '@/components/docs/demos/checkbox/label.vue'
import CheckboxColorDemo from '@/components/docs/demos/checkbox/color.vue'
import CheckboxColorCustomDemo from '@/components/docs/demos/checkbox/colorCustom.vue'
import CheckboxDisabledDemo from '@/components/docs/demos/checkbox/disabled.vue'
import CheckboxErrorDemo from '@/components/docs/demos/checkbox/error.vue'
import CheckboxFormDemo from '@/components/docs/demos/checkbox/form.vue'

const checkboxProps: ApiTableItem[] = [
  {
    name: 'modelValue',
    attribute: 'v-model',
    type: 'boolean | (string | number)[]',
    default: 'false',
    description: 'Selection state. Use a boolean for one option or an array for multiple options. With an array, selection depends on whether it contains value.',
  },
  {
    name: 'value',
    type: 'string | number',
    default: "'on'",
    description: 'The array member and native form submission value. Numbers and strings are distinct, so the number 1 does not match the string 1.',
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    default: 'false',
    description: 'Shows the mixed-state dash. Supports v-model:indeterminate. Activating a mixed checkbox clears this state and selects the checkbox.',
  },
  {
    name: 'label',
    type: 'string',
    default: "''",
    description: 'Clickable label text. The default slot takes precedence when provided.',
  },
  {
    name: 'supportingText',
    type: 'string',
    default: "''",
    description: 'Supporting text below the label, outside the toggle area. Automatically associated with the input through aria-describedby.',
  },
  {
    name: 'error',
    type: 'boolean',
    default: 'false',
    description: 'An external application error. Sets aria-invalid but does not independently block native form submission.',
  },
  {
    name: 'errorText',
    type: 'string',
    default: "''",
    description: 'Preferred message for an application error or a reported native validation error. Providing this text alone does not activate an error.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables interaction. An ancestor fieldset can also disable the input. Disabled options are excluded from form submission.',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: 'Requires this individual option to be selected, using native constraint validation. It does not mean at least one option in a group.',
  },
  {
    name: 'color',
    type: 'MdvCheckboxColor',
    default: "'primary'",
    description: 'Accepts primary, secondary, tertiary, success, warning, error, info, or a local seed color in #RGB or #RRGGBB format.',
  },
]

const checkboxSlots: SlotTableItem[] = [
  { name: 'default', description: 'Custom label content, replacing label. Can contain emphasis or links; interactive elements retain their own behavior.' },
]
</script>

# Checkbox

Checkboxes let users select one or more options or toggle an independent choice. `MdvCheckbox` uses a native `input[type="checkbox"]` and supports keyboard interaction, form validation, and reset.

## Basic usage

Import `MdvCheckbox` and bind a boolean with `v-model`. Clicking either the box or its label toggles the selection.

<DemoBlock>
  <CheckboxBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'

const checked = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-2">
    <MdvCheckbox v-model="checked" label="Enable notifications" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Checked: {{ checked }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## Multiple selection

Bind several checkboxes to the same array and give each option a `value`. Selecting adds its value; deselecting removes it. Each update produces a new array.

Use `fieldset` and `legend` to name a related group. Values can be strings or numbers; the number `1` and the string `'1'` identify different options.

<DemoBlock>
  <CheckboxGroupDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxValue } from '@mdv-ui/mdv'

const selected = ref<MdvCheckboxValue[]>(['email'])
</script>

<template>
  <div class="grid gap-3">
    <fieldset class="min-w-0">
      <legend class="mb-2 font-medium">Notification channels</legend>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <MdvCheckbox v-model="selected" value="email" label="Email" />
        <MdvCheckbox v-model="selected" value="sms" label="SMS" />
        <MdvCheckbox v-model="selected" value="push" label="Push" />
      </div>
    </fieldset>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Selected: {{ selected.length ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## Indeterminate state

Use `v-model:indeterminate` to synchronize the mixed state. It displays a dash and exposes `mixed` to assistive technology.

The mixed state is independent of the checked value in `v-model`. Activating a mixed checkbox clears the mixed state and selects it. Activating it again deselects it; it does not cycle through three states.

<DemoBlock>
  <CheckboxIndeterminateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox } from '@mdv-ui/mdv'

const checked = ref(false)
const indeterminate = ref(true)
</script>

<template>
  <div class="grid justify-items-start gap-3">
    <MdvCheckbox v-model="checked" v-model:indeterminate="indeterminate" label="Partially selected" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Checked: {{ checked }} · Indeterminate: {{ indeterminate }}
    </p>
    <MdvButton variant="outlined" @click="indeterminate = true">Set indeterminate</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

### Select all

Derive a parent checkbox from its children: checked when all are selected, mixed when some are selected, and unchecked when none are selected.

<DemoBlock>
  <CheckboxSelectAllDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxModelValue, MdvCheckboxValue } from '@mdv-ui/mdv'

const options = ['Email', 'SMS', 'Push']
const selected = ref<MdvCheckboxValue[]>(['Email'])
const allSelected = computed(() => selected.value.length === options.length)
const partlySelected = computed(() => selected.value.length > 0 && !allSelected.value)

function selectAll(value: MdvCheckboxModelValue) {
  selected.value = value === true ? [...options] : []
}
</script>

<template>
  <div class="grid gap-3">
    <fieldset class="min-w-0">
      <legend class="mb-2 font-medium">Notification channels</legend>
      <MdvCheckbox
        :model-value="allSelected"
        :indeterminate="partlySelected"
        label="Select all"
        @update:model-value="selectAll"
      />
      <div class="ms-6 grid justify-items-start">
        <MdvCheckbox
          v-for="option in options"
          :key="option"
          v-model="selected"
          :value="option"
          :label="option"
        />
      </div>
    </fieldset>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Selected: {{ selected.length ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## Labels and supporting text

Set the label with `label` and its description with `supporting-text`. Use the default slot to replace the label with content such as emphasis or links. Interactive elements retain their own behavior, and supporting text is outside the toggle area.

<DemoBlock>
  <CheckboxLabelDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'

const updates = ref(true)
const priority = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox
      v-model="updates"
      label="Product updates"
      supporting-text="Receive occasional news about new components."
    />
    <MdvCheckbox v-model="priority" supporting-text="The default slot replaces the label prop.">
      Include <strong>priority notifications</strong>
    </MdvCheckbox>
  </div>
</template>
```

  </template>
</DemoBlock>

When a checkbox has no visible label, provide an accessible name through `aria-label` or `aria-labelledby`:

```vue
<MdvCheckbox v-model="checked" aria-label="Select this item" />
```

---

## Colors

Set the selection color with `color`, which defaults to `primary`. Label text keeps the normal content color. Colors adapt to the current light or dark theme.

<DemoBlock>
  <CheckboxColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxColor, MdvCheckboxValue } from '@mdv-ui/mdv'

const colors: MdvCheckboxColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info']
const selected = ref<MdvCheckboxValue[]>([...colors])
</script>

<template>
  <div class="flex flex-wrap gap-x-6 gap-y-3">
    <MdvCheckbox
      v-for="color in colors"
      :key="color"
      v-model="selected"
      :value="color"
      :color="color"
      :label="color"
    />
  </div>
</template>
```

  </template>
</DemoBlock>

### Custom colors

`color` also accepts a local seed color in `#RGB` or `#RRGGBB` format. The seed generates colors for the current theme, so the selected fill may differ from the supplied hex value.

<DemoBlock>
  <CheckboxColorCustomDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxColor, MdvCheckboxValue } from '@mdv-ui/mdv'

const colors: MdvCheckboxColor[] = ['#6750A4', '#00796B', '#00ACC1']
const selected = ref<MdvCheckboxValue[]>([...colors])
</script>

<template>
  <div class="flex flex-wrap gap-x-6 gap-y-3">
    <MdvCheckbox
      v-for="color in colors"
      :key="color"
      v-model="selected"
      :value="color"
      :color="color"
      :label="color"
    />
  </div>
</template>
```

  </template>
</DemoBlock>

`color="error"` only selects an error color palette. To indicate a validation error, use [`error`](#error-state).

---

## Disabled state

Use `disabled` to prevent interaction. Unchecked, checked, and mixed states have disabled appearances. Disabled options are excluded from native form submission.

<DemoBlock>
  <CheckboxDisabledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvCheckbox } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap gap-x-6 gap-y-3">
    <MdvCheckbox label="Unchecked" disabled />
    <MdvCheckbox :model-value="true" label="Checked" disabled />
    <MdvCheckbox indeterminate label="Indeterminate" disabled />
  </div>
</template>
```

  </template>
</DemoBlock>

To disable a group of fields, set `disabled` on its surrounding `fieldset`.

---

## Error state

Use `error` for an application error and `error-text` for its message. Clearing the error restores `supporting-text`. Setting `error-text` alone does not activate an error.

<DemoBlock>
  <CheckboxErrorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'

const showError = ref(true)
const checked = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="showError" label="Show error" />
    <MdvCheckbox
      v-model="checked"
      :error="showError"
      label="Receive notifications"
      supporting-text="Choose whether to receive notifications."
      error-text="Notifications are currently unavailable."
    />
  </div>
</template>
```

  </template>
</DemoBlock>

Disabled styling takes precedence over errors, and errors take precedence over `color`. Error messages use `error-text`, then a reported native validation message, then `supporting-text`.

`error` does not independently block native form submission. Use `required` or `setCustomValidity()` when a native constraint should prevent submission.

---

## Forms and validation

Set `name` and `value` to participate in native form submission. `FormData` includes only named, checked, enabled controls. Read multiple values with the same name using `getAll()`.

The required option below does not show an error initially. Click Submit before selecting it to see validation feedback, select it and submit to inspect the values, then use Reset to restore the initial selection.

<DemoBlock>
  <CheckboxFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxValue } from '@mdv-ui/mdv'

const accepted = ref(false)
const channels = ref<MdvCheckboxValue[]>(['email'])
const result = ref('Submit to inspect the form values.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ terms: data.get('terms'), channels: data.getAll('channel') })
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="result = 'Form reset.'">
    <MdvCheckbox
      v-model="accepted"
      name="terms"
      value="accepted"
      label="Accept the terms"
      supporting-text="This option is required."
      error-text="Accept the terms to continue."
      required
    />
    <fieldset class="min-w-0">
      <legend class="mb-2 font-medium">Optional channels</legend>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <MdvCheckbox v-model="channels" name="channel" value="email" label="Email" />
        <MdvCheckbox v-model="channels" name="channel" value="sms" label="SMS" />
      </div>
    </fieldset>
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
```

  </template>
</DemoBlock>

`required` means **this individual option must be selected**. It does not validate that at least one option in a group is selected. The mixed state is visual; submission still depends on the underlying checked value. Numeric values become strings in form submission.

`form.reset()` restores the model and mixed state from component creation and synchronizes `v-model`. Programmatic updates do not change this reset baseline; await `nextTick()` before reading the restored Vue state. Reset clears reported native validation errors but does not clear an external `error` or custom validity message.

`id`, `name`, `form`, ARIA, `data-*`, and native event listeners are forwarded to the input. `class` and `style` apply to the outer component. Selection is model-driven: use `v-model` instead of competing `checked` or `defaultChecked` attributes.

---

## Keyboard and accessibility

- Move focus with Tab or Shift+Tab and toggle the selection with Space.
- Name related options with `fieldset` and `legend`, and provide an accessible name for any checkbox without a visible label.
- Supporting text and errors are automatically associated with the input. Dynamic descriptions use polite announcements. The component honors reduced-motion preferences.

---

## API

### Props

<ApiTable :items="checkboxProps" />

### Slots

<SlotsTable :items="checkboxSlots" />

### Events

- `update:modelValue(value: MdvCheckboxModelValue)`: requests a boolean or array model update, handled by `v-model`.
- `update:indeterminate(value: boolean)`: requests a mixed-state update, handled by `v-model:indeterminate`.
- `click`, `input`, `change`, `focus`, `blur`, `invalid`: native events from the actual input. Model assignments and form resets do not synthesize `input` or `change`.

### Methods

Call these methods through a component template ref:

- `focus(options?: FocusOptions)`: focuses the input, with support for `preventScroll`.
- `blur()`: removes focus from the input.
- `checkValidity(): boolean`: checks native constraints and triggers `invalid` on failure.
- `reportValidity(): boolean`: checks constraints and displays browser validation feedback.
- `setCustomValidity(message: string)`: sets a custom validity message; pass an empty string to clear it.

### Types

```ts
import type {
  MdvCheckboxValue,
  MdvCheckboxModelValue,
  MdvCheckboxColor,
} from '@mdv-ui/mdv'
```

`MdvCheckboxValue` is `string | number`; `MdvCheckboxModelValue` is `boolean | MdvCheckboxValue[]`; `MdvCheckboxColor` accepts supported theme colors, semantic colors, or a hex seed color.
