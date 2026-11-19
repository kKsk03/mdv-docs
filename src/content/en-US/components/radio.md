<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import RadioBasicDemo from '@/components/docs/demos/radio/basic.vue'
import RadioStandaloneDemo from '@/components/docs/demos/radio/standalone.vue'
import RadioStateDemo from '@/components/docs/demos/radio/state.vue'
import RadioColorDemo from '@/components/docs/demos/radio/color.vue'
import RadioControlledDemo from '@/components/docs/demos/radio/controlled.vue'
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

`MdvRadio` selects one scalar value from mutually exclusive options. `MdvRadioGroup` supplies the shared model, accessible group, keyboard selection, and validation. This page describes **MDV 0.1.5**. Use Checkbox for independent choices and Switch for a setting that changes immediately.

## Groups, orientation, and strict values

Bind the model on the group and give every child a unique `value`. Do not put separate models on its children. Values are strings or numbers, with `null` representing no selection. The number `1` and text `'1'` select different options.

Horizontal options wrap when space is limited. Tab enters the selected available option or the first enabled option. Arrow keys both move focus and select, skipping disabled options. Clicking an already selected radio keeps it selected; offer a separate reset action if clearing is needed.

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

## Standalone radios and native names

Standalone radios can share one model and one native `name`. Use a unique name for each independent choice set so the browser does not accidentally group unrelated inputs on the same page. A semantic `fieldset` and `legend` supply the group context in this example. Prefer `MdvRadioGroup` when you need its coordinated keyboard, required, and validation behavior.

Native form values are strings even when application values are numbers. The example resets to the model value present when it mounted.

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

## Labels, disabled options, and errors

Use `label` for plain text or the default slot for rich label content. Supporting text is associated with the native input. A Radio default slot replaces its label; the Group `label` slot replaces its legend.

Group `disabled` and an ancestor disabled `fieldset` disable descendants through native semantics. An option can disable itself but cannot override a disabled ancestor. Group errors propagate to options; individual supporting text remains attached to each option, while the group shows its shared error message. Set group `error-text` for a group-level message.

`error` and `error-text` describe an application error. To block a native form submission, use a native constraint or `setCustomValidity()` as well. Merely supplying `error-text` does not activate error state.

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

## Colors, local themes, and RTL

Colors support `primary`, `secondary`, `tertiary`, `success`, `warning`, `error`, `info`, or a valid `#RGB`/`#RRGGBB` seed. A group provides the default color and an explicit child color overrides it. Error and disabled presentation follow MDV state rules. Custom colors participate in light/dark schemes rather than painting a fixed hex fill onto the control.

<DemoBlock>
  <RadioColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioColor, MdvRadioModelValue } from '@mdv-ui/mdv'

const selected = ref<MdvRadioModelValue>('primary')
const colors: MdvRadioColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', '#006c4c']
const preference = ref<MdvRadioModelValue>('inherited')
</script>

<template>
  <div class="grid gap-5">
    <MdvRadioGroup v-model="selected" label="Theme roles and seed colors" orientation="horizontal">
      <MdvRadio v-for="color in colors" :key="color" :value="color" :color="color" :label="color" />
    </MdvRadioGroup>
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="theme in ['light', 'dark'] as const" :key="theme" :data-mdv-theme="theme" :dir="theme === 'dark' ? 'rtl' : 'ltr'" class="rounded-xl bg-mdv-surface-container-low p-4 text-mdv-on-surface">
        <MdvRadioGroup v-model="preference" color="tertiary" :label="`${theme} theme${theme === 'dark' ? ' · RTL' : ''}`">
          <MdvRadio value="inherited" label="Inherited tertiary" />
          <MdvRadio value="override" color="#006c4c" label="Local seed override" />
          <MdvRadio value="disabled" label="Disabled" disabled />
        </MdvRadioGroup>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Parent-controlled acceptance

With an explicit model, the parent decides whether to accept `update:modelValue`. Rejected requests restore native checked state to the accepted model. Focus can still move to the attempted option; focused and selected are distinct states. The example starts with acceptance disabled.

<DemoBlock>
  <RadioControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const value = ref<MdvRadioModelValue>('basic')
const accept = ref(false)
const requested = ref<MdvRadioModelValue>(null)
function update(next: MdvRadioModelValue) {
  requested.value = next
  if (accept.value) value.value = next
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="accept" label="Accept selection requests" />
    <MdvRadioGroup :model-value="value" label="Controlled plan" @update:model-value="update">
      <MdvRadio value="basic" label="Basic plan" /><MdvRadio value="pro" label="Pro plan" />
    </MdvRadioGroup>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Accepted: {{ value }} · Requested: {{ requested ?? 'none' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Native forms, validation, and reset

Set the group's `name` to submit only its selected enabled input. No hidden surrogate field is created. Without a name, the group can still select and validate but is absent from `FormData`. Avoid overriding child names in a coordinated group; use a separate group for a separate choice.

`form` can associate the group with an external form: it is inherited by child inputs. Native input attributes such as `id`, `form`, ARIA, and event listeners can also be set on an individual Radio. An explicit child `name` or `form` takes precedence over the inherited value.

The example keeps options outside the form element, demonstrates required selection and a disabled group, reads real `FormData`, and exposes validation actions. A server error uses `setCustomValidity()`; clear it with an empty string. Reset restores the initial model and clears reported validation state. Native reset does not clear custom validity, so this example explicitly clears its own server error in the reset handler.

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

In MDV 0.1.5, reporting an empty required group and then selecting another valid option clears the group error, but can leave the originally invalid option red with `aria-invalid="true"` even though its native validity is now valid. This is a recorded library defect; the demo keeps the original styling so the integration behavior remains visible.

## Accessibility and keyboard interaction

<DocsTable label="Radio Group keyboard interaction">

| Key | Behavior |
| --- | --- |
| Tab / Shift+Tab | Enters/leaves the group at the selected enabled option or its first enabled option. |
| Arrow Right / Arrow Down | Selects and focuses the next enabled option, wrapping. |
| Arrow Left / Arrow Up | Selects and focuses the previous enabled option, wrapping. |
| Home / End | Selects and focuses the first/last enabled option. |
| Space | Selects the focused native radio. |

</DocsTable>

Radio renders an actual `input[type="radio"]` with a 48px minimum interaction area. Group renders `fieldset`, `legend`, and `role="radiogroup"`. If no visible label is provided, supply `aria-label` or `aria-labelledby`. Do not replace radio semantics with button or menu roles. Native `input`, `change`, `invalid`, focus, and blur events reach the input; component model updates carry the typed option value.

MDV handles reduced motion and forced-color styles. Screen-reader announcements, touch targets in your final layout, browser validation UI, and cross-browser form behavior still require application checks. Disabled ancestor fieldsets retain the browser's first-legend exception.

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

MDV 0.1.5 does not export `MdvRadioProps` or `MdvRadioGroupProps` interfaces. Use the actual component types when typing template refs.
