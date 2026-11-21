<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import RadioBasicDemo from '@/components/docs/demos/radio/basic.vue'
import RadioStandaloneDemo from '@/components/docs/demos/radio/standalone.vue'
import RadioStateDemo from '@/components/docs/demos/radio/state.vue'
import RadioFormDemo from '@/components/docs/demos/radio/form.vue'

const radioProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string | number | null', default: 'null', description: 'Standalone selection model. Inside MdvRadioGroup, the group model determines selection instead.' },
  { name: 'value', type: 'string | number', default: 'Required', description: 'This option and its native submission value. Comparison uses Object.is; numeric 1 and string 1 differ.' },
  { name: 'label', type: 'string', default: "''", description: 'Clickable label. The default slot replaces its text.' },
  { name: 'supportingText', type: 'string', default: "''", description: 'Associated supporting text. Inside a group, this remains the individual option description.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'External visual/ARIA error. A group error also affects its options. Does not set native custom validity by itself.' },
  { name: 'errorText', type: 'string', default: "''", description: 'Standalone error message after an external or reported native error. For grouped errors, put the message on the group.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this input. A disabled group or ancestor fieldset cannot be re-enabled by a child.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Standalone native required constraint. Inside a group, the group required policy controls the inputs.' },
  { name: 'color', type: 'MdvRadioColor', default: "Group color or 'primary'", description: 'Theme/semantic role or a #RGB/#RRGGBB seed. An explicit option color overrides the group color; error styling takes precedence.' },
]
const groupProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string | number | null', default: 'null', description: 'One shared selected value. Omit the model for internal state or bind it to control acceptance.' },
  { name: 'name', type: 'string', description: 'Inherited native input name. Omit to avoid unnamed options being included in FormData; no hidden field is generated.' },
  { name: 'label', type: 'string', default: "''", description: 'Group name rendered in legend; the label slot takes precedence. Supply an accessible name if omitting visible text.' },
  { name: 'supportingText', type: 'string', default: "''", description: 'Shared supporting message associated with all options.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'External error for the fieldset and its options. Does not independently block native submission.' },
  { name: 'errorText', type: 'string', default: "''", description: 'Preferred shared message when error or reported native invalidity is active.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the native fieldset, its option interactions, validation, and submission.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Requires an enabled selected option. The group manages which input carries the native required constraint.' },
  { name: 'color', type: 'MdvRadioColor', description: 'Default color inherited by child radios unless overridden; children otherwise use primary.' },
  { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Vertical list or wrapping horizontal layout. Both support the same directional selection keys.' },
]
const radioSlots: SlotTableItem[] = [{ name: 'default', description: 'Replaces the clickable option label. No slot arguments. Avoid nested interactive controls inside the label.' }]
const groupSlots: SlotTableItem[] = [
  { name: 'default', description: 'Radio options. No slot arguments. Their selected state comes from the group.' },
  { name: 'label', description: 'Replaces the legend content. No slot arguments; preserve a meaningful group name.' },
]
</script>
# Radio

Use `MdvRadioGroup` and `MdvRadio` when users can select one option from a set. For independent choices, use [Checkbox](./checkbox).

## Radio groups

Bind `v-model` on the group and give each option a distinct `value`. Strings and numbers are compared without conversion; use `null` for no selection. Label the group with `label` or the `label` slot.

<DemoBlock>
  <RadioBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const plan = ref<MdvRadioModelValue>('basic')
const delivery = ref<MdvRadioModelValue>('email')
const typed = ref<MdvRadioModelValue>(1)
</script>

<template>
  <div class="grid gap-5">
    <MdvRadioGroup v-model="plan" label="Plan" supporting-text="Choose one plan. Arrow keys select the next available option.">
      <MdvRadio value="basic" label="Basic" />
      <MdvRadio value="pro" label="Pro" supporting-text="Includes shared workspaces." />
      <MdvRadio value="enterprise" label="Enterprise (unavailable)" disabled />
    </MdvRadioGroup>
    <MdvRadioGroup v-model="delivery" orientation="horizontal" label="Notifications">
      <MdvRadio value="email" label="Email" /><MdvRadio value="sms" label="SMS" /><MdvRadio value="push" label="Push" />
    </MdvRadioGroup>
    <MdvRadioGroup v-model="typed" orientation="horizontal" label="Strict values">
      <MdvRadio :value="1" label="Number 1" /><MdvRadio value="1" label="String 1" />
    </MdvRadioGroup>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Plan: {{ plan }} · Delivery: {{ delivery }} · Typed value: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Standalone radios

Outside a group, bind the radios to the same model and use the same native `name`. Use a different `name` for each independent set.

<DemoBlock>
  <RadioStandaloneDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvRadio } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const name = `standalone-format-${useId()}`
const format = ref<MdvRadioModelValue>('pdf')
const submitted = ref('Not submitted.')
function submit(event: Event) {
  const value = new FormData(event.currentTarget as HTMLFormElement).get(name)
  submitted.value = `Submitted format: ${value}`
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit">
    <fieldset class="min-w-0 border-0 p-0">
      <legend class="mb-2 text-sm font-medium">Export format</legend>
      <div class="flex flex-wrap gap-3">
        <MdvRadio v-model="format" :name="name" value="pdf" label="PDF" />
        <MdvRadio v-model="format" :name="name" value="html" label="HTML" />
        <MdvRadio v-model="format" :name="name" value="text" label="Plain text" />
      </div>
    </fieldset>
    <div class="flex flex-wrap gap-3"><MdvButton type="submit">Read form data</MdvButton><MdvButton type="reset" variant="outlined">Reset format</MdvButton></div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Model: {{ format }} · {{ submitted }}</p>
  </form>
</template>
```

  </template>
</DemoBlock>

## Labels and states

Use `supporting-text` for a hint and `disabled` for unavailable options. Set `error` and `error-text` on the group for a shared message.

<DemoBlock>
  <RadioStateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const disabled = ref(false)
const error = ref(false)
const value = ref<MdvRadioModelValue>('standard')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="disabled" label="Disable the group" /><MdvCheckbox v-model="error" label="Show server error" /></div>
    <MdvRadioGroup v-model="value" :disabled="disabled" :error="error" label="Delivery service" supporting-text="All prices include delivery." error-text="This delivery option is temporarily unavailable.">
      <template #label><span class="font-medium">Delivery service</span> <span class="text-mdv-on-surface-variant">(one option)</span></template>
      <MdvRadio value="standard" label="Standard delivery" supporting-text="Arrives in 3–5 working days." />
      <MdvRadio value="express" supporting-text="Available on working days.">Express delivery <span class="text-sm text-mdv-on-surface-variant">— includes tracking and a scheduled delivery window</span></MdvRadio>
      <MdvRadio value="overnight" label="Overnight delivery (unavailable)" disabled />
    </MdvRadioGroup>
    <MdvRadio model-value="blocked" value="blocked" label="Standalone error" error error-text="Please review this choice." />
  </div>
</template>
```

  </template>
</DemoBlock>

## Forms and validation

Set `name` to submit the selected, enabled option. Use `required` to require a choice and `form` to associate the group with an external form. Native reset restores the initial selection.

<DemoBlock>
  <RadioFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const id = `radio-form-${useId()}`
const group = useTemplateRef<InstanceType<typeof MdvRadioGroup>>('group')
const delivery = ref<MdvRadioModelValue>(null)
const disabled = ref(false)
const message = ref('Not submitted.')
function submit(event: Event) {
  message.value = `Submitted: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
function validate() { message.value = group.value?.reportValidity() ? 'Valid selection.' : 'Please choose a delivery option.' }
function serverError() {
  group.value?.setCustomValidity('This service is temporarily unavailable.')
  validate()
}
function reset(event: Event) {
  if (event.defaultPrevented) return
  group.value?.setCustomValidity('')
  message.value = 'Form reset to no selection.'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disabled" label="Disable delivery group" />
    <MdvRadioGroup ref="group" v-model="delivery" :form="id" name="delivery" label="Required delivery" supporting-text="Only the selected enabled radio is submitted." error-text="Choose an available delivery service." :disabled="disabled" required>
      <MdvRadio value="standard" label="Standard" /><MdvRadio value="express" label="Express" /><MdvRadio value="overnight" label="Overnight (unavailable)" disabled />
    </MdvRadioGroup>
    <form :id="id" class="flex flex-wrap gap-3" @submit.prevent="submit" @reset="reset">
      <MdvButton type="submit">Submit delivery</MdvButton><MdvButton type="reset" variant="outlined">Reset delivery</MdvButton>
    </form>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="text" @click="validate">Report validity</MdvButton>
      <MdvButton variant="text" @click="serverError">Set custom error</MdvButton>
      <MdvButton variant="text" @click="group?.setCustomValidity('')">Clear custom error</MdvButton>
      <MdvButton variant="text" @click="group?.focus({ preventScroll: true })">Focus selection</MdvButton>
    </div>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Model: {{ delivery ?? 'null' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

After a required-field error, the previously invalid option can still appear invalid even when the new selection passes native validation.

---

## API

### MdvRadio

<ApiTable :items="radioProps" />

<SlotsTable :items="radioSlots" />

`class`/`style` apply to the outer wrapper; `dir`/`lang` also reach it. Other native attributes and listeners go to the input, including `id`, `name`, `form`, ARIA, and native validation events. The component owns input type, checked state, value, and applicable group tab/required rules.

### MdvRadioGroup

<ApiTable :items="groupProps" />

<SlotsTable :items="groupSlots" />

The current implementation applies native attributes/listeners to the fieldset and consumes a `form` attribute for child association. Its own classes and style are applied explicitly; a supplied group `class` is currently not merged into the fieldset. Put layout classes on a surrounding container. This differs from Radio's wrapper forwarding and should not be used to override component internals.

### Models, events, and methods

Both components emit `update:modelValue(value: MdvRadioModelValue)` when their own model changes. Inside a group, selection updates the **Group** model; do not expect each child's standalone model to mirror it. There is no custom `select` event or value-bearing custom `change` event.

<DocsTable label="Radio and Radio Group exposed methods">

| Method | Radio | Radio Group |
| --- | --- | --- |
| `focus(options?: FocusOptions)` | Focuses its input. | Focuses the selected available option or the first enabled option. |
| `blur()` | Blurs its input. | Blurs the current active HTMLElement. |
| `checkValidity(): boolean` | Runs native input validity checking. | Checks registered inputs; native invalid events can report errors. |
| `reportValidity(): boolean` | Reports native validity. | Reports registered inputs and activates shared error feedback. |
| `setCustomValidity(message: string)` | Sets the input's native custom error. | Places the custom error on the first enabled option and coordinates validity. |

</DocsTable>

An empty message clears a custom error. Calling `checkValidity()` may also dispatch native `invalid` events; it is not a silent visual-only check. Group `blur()` currently acts on `document.activeElement`, so call it only when the group owns focus.

### Public types

```ts
import type {
  MdvRadioValue,        // string | number
  MdvRadioModelValue,   // MdvRadioValue | null
  MdvRadioColor,        // MdvButtonColor
  MdvRadioOrientation,  // 'vertical' | 'horizontal'
} from '@mdv-ui/mdv'
```
