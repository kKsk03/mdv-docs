<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BasicDemo from '@/components/docs/demos/segmentedButton/basic.vue'
import SelectionDemo from '@/components/docs/demos/segmentedButton/selection.vue'
import AppearanceDemo from '@/components/docs/demos/segmentedButton/appearance.vue'
import IconsDemo from '@/components/docs/demos/segmentedButton/icons.vue'
import ControlledDemo from '@/components/docs/demos/segmentedButton/controlled.vue'
import FormDemo from '@/components/docs/demos/segmentedButton/form.vue'

const groupProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvSegmentedButtonModelValue', default: 'null', description: 'Single selection uses a string, number, or null; multiple selection uses an array. Initialize the model to select an item on first render.' },
  { name: 'selection', type: "'single' | 'multiple'", default: "'single'", description: 'Selects native radio or checkbox semantics. When changing modes, the application must also supply the corresponding model shape.' },
  { name: 'selectionRequired', type: 'boolean', default: 'single: true; multiple: false', description: 'Prevents users from deselecting the last selected value. Does not select a default, repair external values, or add native required validation.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all segments. Native disabled ancestor fieldsets also apply.' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Fills the available width with equal-width segments. Overflow stays inside the group.' },
  { name: 'density', type: '0 | -1 | -2 | -3', default: '0', description: 'Visible surface heights of 40, 36, 32, and 28px. The actual interaction area remains at least 48px tall.' },
  { name: 'showSelectedIcon', type: 'boolean', default: 'true', description: 'Shows the built-in check or the selected-icon slot. Disabling it removes the selected-icon area.' },
  { name: 'name', type: 'string', description: 'Shared native input name. Multiple selected values submit multiple entries with the same name; unnamed groups submit nothing.' },
  { name: 'form', type: 'string', description: 'ID of an external native form, inherited by every segment input.' },
]
const itemProps: ApiTableItem[] = [
  { name: 'value', type: 'string | number', default: 'Required', description: 'Unique option value. Comparison uses Object.is, so the number 1 and string 1 remain distinct.' },
  { name: 'label', type: 'string', default: "''", description: 'Visible label, replaced by the default slot. Icon-only items need an accessible name.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this item. It cannot override a disabled group or native fieldset.' },
]
const groupSlots: SlotTableItem[] = [{ name: 'default', description: 'MdvSegmentedButtonItem children. No slot arguments. Keep items together without unrelated DOM siblings.' }]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: 'Replaces label text; receives { selected: boolean }.' },
  { name: 'leading', description: 'Decorative leading icon; receives { selected: boolean }. Supply an accessible name on an icon-only item.' },
  { name: 'selected-icon', description: 'Replaces the built-in check; receives { selected: boolean }. Hidden when showSelectedIcon is false.' },
]
</script>

# Segmented Button

`MdvSegmentedButton` groups a small set of related choices using the classic Material Design 3 segmented treatment. `MdvSegmentedButtonItem` represents each choice. This page describes **MDV 0.1.5**. For the Expressive connected-button treatment, see [Button Group](./button-group).

## Single and multiple selection

Put the model on the group and give each item a unique string or numeric `value`. Single selection replaces the current value; multiple selection creates a new array. Items do not have independent models. Two to five short related options work best; use Select or Autocomplete for longer lists.

<DemoBlock>
  <BasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const period = ref<MdvSegmentedButtonModelValue>('week')
const details = ref<MdvSegmentedButtonModelValue>(['summary'])
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSegmentedButton v-model="period" aria-label="Report period">
      <MdvSegmentedButtonItem value="day" label="Day" />
      <MdvSegmentedButtonItem value="week" label="Week" />
      <MdvSegmentedButtonItem value="month" label="Month" />
    </MdvSegmentedButton>
    <MdvSegmentedButton v-model="details" selection="multiple" aria-label="Report details">
      <MdvSegmentedButtonItem value="summary" label="Summary" />
      <MdvSegmentedButtonItem value="images" label="Images" />
      <MdvSegmentedButtonItem value="dates" label="Dates" />
    </MdvSegmentedButton>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Period: {{ period }} · Details: {{ JSON.stringify(details) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Optional selection and value types

Single selection defaults to `selectionRequired=true`. Set it to `false` to clear the value to `null` by activating the selected segment again. Multiple selection allows an empty array by default; `selection-required` prevents removing its last selected value.

This is an interaction rule, not HTML `required`. An empty external model stays empty, even when selection is required. Changing selection mode, removing options, and cleaning up stale values remain application responsibilities. A numeric value and its string representation are distinct in the model.

<DemoBlock>
  <SelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const optional = ref<MdvSegmentedButtonModelValue>(null)
const required = ref<MdvSegmentedButtonModelValue>(['email'])
const typed = ref<MdvSegmentedButtonModelValue>(1)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="grid gap-1">
      <p class="text-sm text-mdv-on-surface-variant">Optional single selection: activate again to clear.</p>
      <MdvSegmentedButton v-model="optional" :selection-required="false" aria-label="Optional alignment">
        <MdvSegmentedButtonItem value="left" label="Left" />
        <MdvSegmentedButtonItem value="center" label="Center" />
        <MdvSegmentedButtonItem value="right" label="Right" />
      </MdvSegmentedButton>
    </div>
    <div class="grid gap-1">
      <p class="text-sm text-mdv-on-surface-variant">Keep at least one channel selected.</p>
      <MdvSegmentedButton v-model="required" selection="multiple" selection-required aria-label="Notification channels">
        <MdvSegmentedButtonItem value="email" label="Email" />
        <MdvSegmentedButtonItem value="push" label="Push" />
        <MdvSegmentedButtonItem value="sms" label="SMS" disabled />
      </MdvSegmentedButton>
    </div>
    <MdvSegmentedButton v-model="typed" aria-label="Strict value types">
      <MdvSegmentedButtonItem :value="1" label="Number 1" />
      <MdvSegmentedButtonItem value="1" label="String 1" />
    </MdvSegmentedButton>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Optional: {{ JSON.stringify(optional) }} · Channels: {{ JSON.stringify(required) }} · Typed: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Density, full width, and overflow

Density changes the visible surface while preserving the interaction area. `full-width` makes equal segments fill their container. Long labels remain on one line and scroll within the group rather than squeezing into several lines. Keep the surrounding layout flexible with `min-width: 0`.

Colors follow the current MDV theme: selected segments use `secondary-container` and `on-secondary-container`; outlines use `outline`. This component has no `color`, `variant`, `size`, or vertical-orientation prop. Local theme scopes, RTL, reduced motion, and forced-color styles come from MDV.

<DemoBlock>
  <AppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonDensity, MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const densities: MdvSegmentedButtonDensity[] = [0, -1, -2, -3]
const value = ref<MdvSegmentedButtonModelValue>('week')
const disabled = ref(false)
const dark = ref(false)
const rtl = ref(false)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="disabled" label="Disable all segments" />
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="grid min-w-0 gap-4 rounded-xl bg-mdv-surface p-4 text-mdv-on-surface">
      <div v-for="density in densities" :key="density" class="grid min-w-0 gap-1">
        <p class="text-sm">Density {{ density }} · Surface {{ 40 + density * 4 }}px</p>
        <MdvSegmentedButton v-model="value" :density="density" :disabled="disabled" :aria-label="`Period at density ${density}`" full-width>
          <MdvSegmentedButtonItem value="day" label="Day" />
          <MdvSegmentedButtonItem value="week" label="Week" />
          <MdvSegmentedButtonItem value="month" label="Month" />
        </MdvSegmentedButton>
      </div>
      <div class="w-full max-w-[240px] min-w-0">
        <MdvSegmentedButton :disabled="disabled" aria-label="Scrollable long labels" full-width>
          <MdvSegmentedButtonItem value="workspace" label="Shared workspace" />
          <MdvSegmentedButtonItem value="library" label="Personal library" />
          <MdvSegmentedButtonItem value="archive" label="Archived projects" />
        </MdvSegmentedButton>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Leading and selected icons

Text-only segments reveal a check when selected. With a leading icon and text, the check replaces the icon in the same area. Icon-only segments retain the original icon and add the check beside it. The slot receives `selected` for content that needs to reflect state.

Use individual icon-data imports for custom icons; the built-in check needs no consumer icon-data package. Name icon-only inputs with `aria-label` or `aria-labelledby`. Keep slot content noninteractive because the whole segment is a native input label.

<DemoBlock>
  <IconsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'
import listIcon from '@iconify-icons/material-symbols/view-list-outline'
import gridIcon from '@iconify-icons/material-symbols/grid-view-outline'
import doneIcon from '@iconify-icons/material-symbols/done-all'

const view = ref<MdvSegmentedButtonModelValue>('list')
const compact = ref<MdvSegmentedButtonModelValue>('grid')
const showSelectedIcon = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvCheckbox v-model="showSelectedIcon" label="Show selected icons" />
    <MdvSegmentedButton v-model="view" :show-selected-icon="showSelectedIcon" aria-label="Content view">
      <MdvSegmentedButtonItem value="list" label="List">
        <template #leading><MdvIcon :icon="listIcon" /></template>
        <template #selected-icon><MdvIcon :icon="doneIcon" /></template>
      </MdvSegmentedButtonItem>
      <MdvSegmentedButtonItem value="grid">
        <template #default="{ selected }">{{ selected ? 'Grid view' : 'Grid' }}</template>
        <template #leading><MdvIcon :icon="gridIcon" /></template>
      </MdvSegmentedButtonItem>
    </MdvSegmentedButton>
    <MdvSegmentedButton v-model="compact" :show-selected-icon="showSelectedIcon" aria-label="Icon-only content view">
      <MdvSegmentedButtonItem value="list" aria-label="List view"><template #leading><MdvIcon :icon="listIcon" /></template></MdvSegmentedButtonItem>
      <MdvSegmentedButtonItem value="grid" aria-label="Grid view"><template #leading><MdvIcon :icon="gridIcon" /></template></MdvSegmentedButtonItem>
    </MdvSegmentedButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## Controlled requests and cancellation

`update:modelValue` requests a change; the parent decides whether to accept it. If rejected, native checked state returns to the accepted model. Programmatic model changes do not synthesize native input/change events. A native `click.prevent` cancels activation, as shown by Cancelled below.

<DemoBlock>
  <ControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const value = ref<MdvSegmentedButtonModelValue>('draft')
const requested = ref<MdvSegmentedButtonModelValue>(null)
const accept = ref(false)
function update(next: MdvSegmentedButtonModelValue) {
  requested.value = next
  if (accept.value) value.value = next
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvCheckbox v-model="accept" label="Accept selection requests" />
    <MdvSegmentedButton :model-value="value" aria-label="Controlled publication state" @update:model-value="update">
      <MdvSegmentedButtonItem value="draft" label="Draft" />
      <MdvSegmentedButtonItem value="published" label="Published" />
      <MdvSegmentedButtonItem value="blocked" label="Cancelled" @click.prevent />
    </MdvSegmentedButton>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Accepted: {{ value }} · Requested: {{ requested ?? 'none' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Native forms and reset

The group passes `name` and `form` to its actual radio/checkbox inputs. FormData contains only selected enabled inputs and serializes values to strings. Multiple selection submits repeated names; the application model keeps its original number/string types. Omitting `name` produces no generated form entry.

Native reset restores the model snapshot captured when the component was created. Array snapshots are independent copies. Reset does not emit input/change, and cancelling the reset event preserves the selection. `selectionRequired` does not make an empty group invalid; implement any submission validation explicitly.

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const formId = `segmented-export-${useId()}`
const group = useTemplateRef<InstanceType<typeof MdvSegmentedButton>>('group')
const period = ref<MdvSegmentedButtonModelValue>('week')
const formats = ref<MdvSegmentedButtonModelValue>(['pdf'])
const disabled = ref(false)
const submitted = ref('Not submitted.')
function submit(event: Event) {
  submitted.value = JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvCheckbox v-model="disabled" label="Disable export fields" />
    <fieldset :disabled="disabled" class="grid min-w-0 gap-3">
      <legend class="mb-2 text-sm">Export options</legend>
      <MdvSegmentedButton ref="group" v-model="period" :form="formId" name="period" aria-label="Export period">
        <MdvSegmentedButtonItem value="week" label="Week" />
        <MdvSegmentedButtonItem value="month" label="Month" />
      </MdvSegmentedButton>
      <MdvSegmentedButton v-model="formats" :form="formId" selection="multiple" name="format" aria-label="Export formats">
        <MdvSegmentedButtonItem value="pdf" label="PDF" />
        <MdvSegmentedButtonItem value="html" label="HTML" />
        <MdvSegmentedButtonItem value="csv" label="CSV" disabled />
      </MdvSegmentedButton>
    </fieldset>
    <form :id="formId" class="flex flex-wrap gap-2" @submit.prevent="submit" @reset="submitted = 'Reset to the initial values.'">
      <MdvButton type="submit">Submit export</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset export</MdvButton>
      <MdvButton variant="text" @click="group?.focus()">Focus period</MdvButton>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Period: {{ period }} · Formats: {{ JSON.stringify(formats) }} · {{ submitted }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Accessibility and keyboard interaction

Single selection uses `role="radiogroup"` with native radio inputs; multiple selection uses `role="group"` with native checkboxes. Supply an accessible group name. MDV's Tab behavior deliberately visits individual segments rather than treating the whole group as one tab stop.

<DocsTable label="Segmented Button keyboard interaction">

| Key | Behavior |
| --- | --- |
| Tab / Shift+Tab | Initially enters the first available item, then moves through available items in DOM order; exits normally at the boundary. Does not select. |
| Arrow Right / Arrow Left | Moves focus, wrapping and reversing direction in RTL. Single selection also selects; multiple selection only moves focus. |
| Arrow Down / Arrow Up | Moves forward/backward with the same selection rules. |
| Home / End | Focuses the first/last available item, selecting it in single mode. |
| Space / Enter | Activates the focused item, respecting disabled and selection-required rules. |

</DocsTable>

Navigation skips disabled, hidden, and inert items and scrolls the target into view. Removing the focused item prefers the next available item, then the preceding one, while respecting focus already moved by the application. Check real touch, screen readers, and your final container's focus-ring clipping in the browser.

## API

### MdvSegmentedButton

<ApiTable :items="groupProps" />

<SlotsTable :items="groupSlots" />

Native attributes/listeners, `class`, and `style` apply to the group root. The component owns its group role and tab behavior. Use it for selection, rather than putting ordinary action buttons inside it.

### MdvSegmentedButtonItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

Items require a SegmentedButton parent. `class`, `style`, `dir`, `lang`, and `hidden` apply to the outer label. Other native attributes/listeners, including `id`, ARIA, `data-*`, click, input, change, key, and focus events, apply to the input. The group manages `name`, `form`, type, checked state, value, and tab index. Do not override them on individual items.

### Events and methods

The group emits `update:modelValue(value: MdvSegmentedButtonModelValue)`. There is no custom select event. Native input/change come from actual item activation; cancelling a clearable selected radio is completed by the component with one input/change pair.

Both components expose `focus(options?: FocusOptions)` and `blur()`. Group focus enters its current available focus entry; group blur only affects focus within that group. Item methods affect only its own input. Neither component submits a form or exposes native validity helper methods.

### Public types

```ts
import type {
  MdvSegmentedButtonValue,      // string | number
  MdvSegmentedButtonModelValue, // value | value[] | null
  MdvSegmentedButtonSelection,  // 'single' | 'multiple'
  MdvSegmentedButtonDensity,    // 0 | -1 | -2 | -3
} from '@mdv-ui/mdv'
```

MDV 0.1.5 does not export separate SegmentedButton/Item props interfaces. Type template refs with `InstanceType<typeof MdvSegmentedButton>` or the Item component.
