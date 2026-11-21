<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BasicDemo from '@/components/docs/demos/segmentedButton/basic.vue'
import AppearanceDemo from '@/components/docs/demos/segmentedButton/appearance.vue'
import IconsDemo from '@/components/docs/demos/segmentedButton/icons.vue'
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

Use `MdvSegmentedButton` for a short set of related choices, with one `MdvSegmentedButtonItem` per option. For the Expressive connected style, see [Button Group](./button-group).

## Selecting options

Bind a single value for `selection="single"` or an array for `selection="multiple"`. Give each item a distinct `value`. In single mode, set `:selection-required="false"` to let users deselect the active item.

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

## Density and width

Use `density` to adjust height and `full-width` to fill the container. Keep labels short; use a different control when choices no longer fit comfortably.

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

## Icons

Use the `leading` and `selected-icon` slots to customize item icons. Give icon-only items an accessible name.

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

## Forms and reset

Set `name` to submit the selected values; multiple selections use repeated entries. Use `form` for an external form. Native reset restores the initial selection.

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

---

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

Type template refs with `InstanceType<typeof MdvSegmentedButton>` or the corresponding item component type.
