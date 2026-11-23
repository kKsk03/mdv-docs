<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import AppearanceDemo from '@/components/docs/demos/textField/appearance.vue'
import ModelsDemo from '@/components/docs/demos/textField/models.vue'
import ActionsDemo from '@/components/docs/demos/textField/actions.vue'
import FormDemo from '@/components/docs/demos/textField/form.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvTextFieldValue', default: "''", description: 'Text or numeric model. The native control still edits a string.' },
  { name: 'modelModifiers', type: 'MdvTextFieldModelModifiers', default: '{}', description: 'Vue supplies trim, number, and lazy when used with v-model.' },
  { name: 'variant', type: 'MdvTextFieldVariant', default: "'outlined'", description: "'outlined' or 'filled'." },
  { name: 'type', type: 'MdvTextFieldType', default: "'text'", description: "Single-line type: 'text', 'password', 'email', 'tel', 'url', 'search', or 'number'." },
  { name: 'label', type: 'string', default: "''", description: 'Visible floating label, associated with the native control.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Native input hint, not an accessible name.' },
  { name: 'supportingText', type: 'string', default: "''", description: 'Description below the control.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Application error state, independent of native validity.' },
  { name: 'errorText', type: 'string', default: "''", description: 'Preferred description when an error is shown; does not enable the error state by itself.' },
  { name: 'prefixText', type: 'string', default: "''", description: 'Decorative prefix; not part of the model or submitted value.' },
  { name: 'suffixText', type: 'string', default: "''", description: 'Decorative suffix; not part of the model or submitted value.' },
  { name: 'multiline', type: 'boolean', default: 'false', description: 'Uses a textarea instead of a single-line input.' },
  { name: 'rows', type: 'number', default: '3', description: 'Initial textarea rows.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables focus, editing, and form submission for this field.' },
  { name: 'readonly', type: 'boolean', default: 'false', description: 'Disallows editing but preserves focus and submission.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Enables the native required constraint.' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Offers a clear action when there is editable text and no active composition.' },
  { name: 'clearLabel', type: 'string', description: 'Accessible name of the built-in clear action.' },
  { name: 'passwordToggle', type: 'boolean', default: 'false', description: 'Offers visibility control for a single-line password.' },
  { name: 'showPasswordLabel', type: 'string', description: 'Accessible name of the action that reveals the password.' },
  { name: 'hidePasswordLabel', type: 'string', description: 'Accessible name of the action that hides the password.' },
  { name: 'showCount', type: 'boolean', description: 'Shows the UTF-16 length. When omitted, a valid maxlength enables the count.' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Fills the available width; otherwise the default width is 280px, capped by the container.' },
]
const slots: SlotTableItem[] = [
  { name: 'leading', description: 'Decorative icon or a caller-owned action before the input.' },
  { name: 'trailing', description: 'Replaces the whole trailing area, including built-in clear and password actions.' },
]
</script>
# Text Field

Use `MdvTextField` to collect text or numbers. Use [Select](./select) when the user must choose from fixed options.

## Appearance and multiline input

Bind the value with `v-model`. Use `variant` for filled or outlined appearance; set `multiline` to render a textarea.

<DemoBlock>
  <AppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvTextField } from '@mdv-ui/mdv'

const budget = ref('42.00')
const notes = ref('Leave the box at the front desk.')
</script>

<template>
  <div class="grid min-w-0 gap-4 sm:grid-cols-2">
    <MdvTextField
      v-model="budget"
      label="Budget (USD)"
      inputmode="decimal"
      prefix-text="$"
      supporting-text="Enter an amount in US dollars."
      full-width
    />
    <MdvTextField
      v-model="notes"
      variant="filled"
      label="Delivery instructions"
      supporting-text="Include only information the courier needs."
      multiline
      :rows="3"
      :maxlength="80"
      full-width
    />
  </div>
</template>
```

  </template>
</DemoBlock>

## Model modifiers

Use model modifiers such as `.trim` or `.number` when the stored value needs conversion. Use `.lazy` to update on `change` rather than `input`.

<DemoBlock>
  <ModelsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvTextField } from '@mdv-ui/mdv'
import type { MdvTextFieldValue } from '@mdv-ui/mdv'

const displayName = ref<MdvTextFieldValue>('')
const quantity = ref<MdvTextFieldValue>('')
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvTextField
      v-model.trim="displayName"
      label="Display name"
      supporting-text="Try adding spaces or entering text with an IME."
      full-width
    />
    <MdvTextField
      v-model.lazy.number="quantity"
      type="number"
      label="Quantity"
      min="0"
      step="1"
      supporting-text="Commit a numeric value when the input changes, not on every keystroke."
      full-width
    />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">
      Name: {{ JSON.stringify(displayName) }} · Quantity: {{ JSON.stringify(quantity) }}
      ({{ typeof quantity }})
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Icons and input actions

Use `leading` and `trailing` for custom content. `clearable` adds a clear action; `password-toggle` adds a visibility toggle for password input.

<DemoBlock>
  <ActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import edit from '@iconify-icons/material-symbols/edit-outline'
import search from '@iconify-icons/material-symbols/search'
import { ref, useTemplateRef } from 'vue'
import { MdvIcon, MdvIconButton, MdvTextField } from '@mdv-ui/mdv'

const query = ref('Packaging')
const password = ref('demo-only')
const projectCode = ref('')
const codeField = useTemplateRef<InstanceType<typeof MdvTextField>>('codeField')

function fillProjectCode() {
  projectCode.value = 'PROJECT-01'
  codeField.value?.focus()
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvTextField v-model="query" type="search" label="Search examples" clearable clear-label="Clear search examples" full-width>
      <template #leading><MdvIcon :icon="search" /></template>
    </MdvTextField>
    <MdvTextField
      v-model="password"
      type="password"
      label="Demo password"
      autocomplete="new-password"
      supporting-text="Use sample text, not a real password."
      password-toggle
      show-password-label="Show demo password"
      hide-password-label="Hide demo password"
      full-width
    />
    <MdvTextField ref="codeField" v-model="projectCode" label="Project code" full-width>
      <template #trailing>
        <MdvIconButton
          type="button"
          variant="standard"
          aria-label="Use suggested project code"
          @click="fillProjectCode"
        >
          <MdvIcon :icon="edit" />
        </MdvIconButton>
      </template>
    </MdvTextField>
  </div>
</template>
```

  </template>
</DemoBlock>

Name the built-in buttons with `clear-label`, `show-password-label`, and `hide-password-label`. The `trailing` slot replaces both actions when you need custom controls.

## Native forms and validation

Set `name` to submit the field. Use native constraints such as `required` or `type="email"`; use `setCustomValidity()` for a custom error and clear it with an empty string.

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvTextField } from '@mdv-ui/mdv'

const email = ref('')
const result = ref('No submission yet.')
const emailHint = useId()
const emailField = useTemplateRef<InstanceType<typeof MdvTextField>>('emailField')

function submit(event: SubmitEvent) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify([...data.entries()])
}

function reportDuplicate() {
  emailField.value?.setCustomValidity('This email address is already in use.')
  emailField.value?.reportValidity()
}

function clearCustomError() {
  emailField.value?.setCustomValidity('')
}

function reset() {
  clearCustomError()
  result.value = 'Reset to the initial values.'
}
</script>

<template>
  <form class="grid min-w-0 gap-4" @submit.prevent="submit" @reset="reset">
    <p :id="emailHint" class="text-sm text-mdv-on-surface-variant">Use an example address.</p>
    <MdvTextField
      ref="emailField"
      v-model="email"
      :aria-describedby="emailHint"
      type="email"
      name="email"
      label="Contact email"
      supporting-text="We send a copy of the report to this address."
      autocomplete="email"
      required
      full-width
      @input="clearCustomError"
    />
    <MdvTextField label="Plan" name="plan" model-value="Starter" readonly full-width />
    <MdvTextField label="Region (unavailable)" name="region" model-value="West" disabled full-width />
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit example</MdvButton>
      <MdvButton variant="tonal" @click="reportDuplicate">Report duplicate email</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-all text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
```

  </template>
</DemoBlock>

---

## API

### Props

<ApiTable :items="props" />

### Slots

<SlotsTable :items="slots" />

### Native attributes and methods

`id`, `name`, `form`, `autocomplete`, `inputmode`, native constraints, ARIA/data attributes, and native listeners reach the actual control. `class` and `style` apply to the outer wrapper; `dir` and `lang` also reach the input. Autofill and password-manager behavior still warrant testing in the browsers you support.

Use a component template ref to call:

- `focus(options?: FocusOptions)` and `blur()` to manage focus on the input or textarea.
- `select()` to select the text where the native input type supports it.
- `checkValidity(): boolean` to run native checks, and `reportValidity(): boolean` to also request browser feedback.
- `setCustomValidity(message: string)` to add or clear a native validation constraint; pass `''` to clear it.

### Public types

```ts
import type {
  MdvTextFieldValue,
  MdvTextFieldModelModifiers,
  MdvTextFieldType,
  MdvTextFieldVariant,
} from '@mdv-ui/mdv'
```
