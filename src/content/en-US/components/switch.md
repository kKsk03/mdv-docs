<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import StatesDemo from '@/components/docs/demos/switch/states.vue'
import IconsDemo from '@/components/docs/demos/switch/icons.vue'
import FormDemo from '@/components/docs/demos/switch/form.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: 'Whether the setting is on.' },
  { name: 'label', type: 'string', default: "''", description: 'Clickable visible label; the default slot takes precedence.' },
  { name: 'labelPosition', type: 'MdvSwitchLabelPosition', default: "'end'", description: "Logical position of the label: 'start' or 'end'." },
  { name: 'supportingText', type: 'string', default: "''", description: 'Extra context linked to the input.' },
  { name: 'color', type: 'MdvSwitchColor', default: "'primary'", description: 'Theme or semantic color, or a #RGB/#RRGGBB seed.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables native activation and excludes the control from submission.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Requires a checked switch for native form validation.' },
  { name: 'value', type: 'string', default: "'on'", description: 'Submitted form value when checked; not the Vue model.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Marks an application error without changing native validity.' },
  { name: 'errorText', type: 'string', default: "''", description: 'Preferred message when an application or reported native error is shown.' },
]

const slots: SlotTableItem[] = [
  { name: 'default', description: 'Replaces the label text. Do not put separate interactive controls in the label.' },
  { name: 'selected-icon', description: 'Replaces the built-in check on the thumb; an explicit empty slot hides it.' },
  { name: 'unselected-icon', description: 'Optional decorative icon on the thumb when off.' },
]
</script>
# Switch

Use `MdvSwitch` to turn a setting on or off. Name the setting itself so its label stays the same in both states.

## Toggle a setting

Bind a boolean with `v-model`. Set `label-position="start"` to place the label before the track.

<DemoBlock>
  <StatesDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSwitch } from '@mdv-ui/mdv'

const notifications = ref(false)
const previews = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvSwitch
      v-model="notifications"
      label="Delivery notifications"
      supporting-text="Receive updates when a package is on its way."
    />
    <MdvSwitch
      v-model="previews"
      label="Show previews of upcoming scheduled messages in the activity feed"
      label-position="start"
    />
    <MdvSwitch :model-value="true" label="Organization audit log" disabled />
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Delivery notifications: {{ notifications ? 'on' : 'off' }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Icons, colors, and errors

The selected thumb shows a check by default. Use the `selected-icon` or `unselected-icon` slot to replace the icon for either state.

<DemoBlock>
  <IconsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import close from '@iconify-icons/material-symbols/close'
import { ref } from 'vue'
import { MdvIcon, MdvSwitch } from '@mdv-ui/mdv'

const sync = ref(false)
const quiet = ref(true)
const offline = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSwitch v-model="sync" label="Sync over Wi-Fi" color="#006C66">
      <template #unselected-icon><MdvIcon :icon="close" size="16" /></template>
    </MdvSwitch>
    <div
      data-mdv-theme="dark"
      dir="rtl"
      class="rounded-xl bg-mdv-surface-container p-4 text-mdv-on-surface"
    >
      <MdvSwitch v-model="quiet" label="Quiet hours" color="tertiary">
        <template #selected-icon></template>
      </MdvSwitch>
    </div>
    <MdvSwitch
      v-model="offline"
      label="Offline access"
      color="tertiary"
      :error="offline"
      error-text="Your organization does not allow offline access."
    />
  </div>
</template>
```

  </template>
</DemoBlock>

## Form submission and reset

A named switch submits its value only when checked and enabled. Use `required` if it must be on, and `form` to associate an external form. Reset restores the initial state.

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvSwitch } from '@mdv-ui/mdv'

const formId = useId()
const share = ref(false)
const result = ref('No submission yet.')

function submit(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  const value = new FormData(form).get('sharing')
  result.value = `Submitted: sharing=${value}.`
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSwitch
      v-model="share"
      :form="formId"
      name="sharing"
      value="enabled"
      label="Share this report with the project team"
      supporting-text="Enable team access before publishing."
      error-text="Enable team access to continue."
      required
    />
    <form
      :id="formId"
      class="flex flex-wrap gap-3"
      @submit.prevent="submit"
      @reset="result = 'Reset to the initial preference.'"
    >
      <MdvButton type="submit">Publish report</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
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

### Native attributes and events

`class`, `style`, `dir`, and `lang` go on the wrapper. `id`, `name`, `form`, ARIA and `data-*` attributes, and native listeners such as `input`, `change`, `focus`, `blur`, and `invalid` reach the checkbox. The component owns its type, role, and checked state. Set the state through `v-model`, not `checked` or `defaultChecked`.

`update:modelValue` carries the proposed boolean after native activation; `@change` receives the native event. Canceling `click` with `preventDefault()` prevents native activation. Directly setting the model does not fire synthetic native events.

### Exposed methods and types

Call `focus(options?: FocusOptions)`, `blur()`, `checkValidity(): boolean`, `reportValidity(): boolean`, or `setCustomValidity(message: string)` on a component template ref. The validity methods use the native checkbox; pass an empty string to remove a custom error.

```ts
import type { MdvSwitchColor, MdvSwitchLabelPosition } from '@mdv-ui/mdv'
```
