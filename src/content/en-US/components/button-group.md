<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ButtonGroupActionsDemo from '@/components/docs/demos/buttonGroup/actions.vue'
import ButtonGroupSingleDemo from '@/components/docs/demos/buttonGroup/single.vue'
import ButtonGroupMultipleDemo from '@/components/docs/demos/buttonGroup/multiple.vue'
import ButtonGroupIndependentDemo from '@/components/docs/demos/buttonGroup/independent.vue'
import ButtonGroupSizeDemo from '@/components/docs/demos/buttonGroup/size.vue'
import ButtonGroupFormDemo from '@/components/docs/demos/buttonGroup/form.vue'

const groupProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvButtonGroupModelValue', default: 'null / []', description: 'Single value or null for single selection; an array for multiple selection. Internally managed when omitted; a controlled parent must accept updates.' },
  { name: 'variant', type: "'standard' | 'connected'", default: "'standard'", description: 'Separated buttons with press-width motion, or connected buttons with a fixed 2px gap.' },
  { name: 'size', type: "'xs' | 's' | 'm' | 'l' | 'xl'", default: "'s'", description: 'Shared size. Standard items may override it; connected items always inherit it.' },
  { name: 'shape', type: "'round' | 'square'", default: "'round'", description: 'Shared shape; follows the same inheritance rules as size.' },
  { name: 'selection', type: "'none' | 'single' | 'multiple'", default: 'standard: none; connected: single', description: 'Action-only, single selection, or multiple selection. Layout and selection can be configured independently.' },
  { name: 'selectionRequired', type: 'boolean', default: 'false', description: 'Prevents deselecting the last selected item. Does not create an initial selection or native required validation.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all items and group form fields.' },
  { name: 'density', type: '0 | -1 | -2 | -3', default: '0', description: 'Each negative step reduces visual height by 4px; interaction targets remain at least 48px.' },
  { name: 'fullWidth', type: 'boolean', default: 'standard: false; connected: true', description: 'Fills the available width. Icon-only items retain their own widths; text items share remaining space.' },
  { name: 'name', type: 'string', description: 'Name for hidden fields representing accepted group selections.' },
  { name: 'form', type: 'string', description: 'Optional external form id.' },
]
const itemProps: ApiTableItem[] = [
  { name: 'value', type: 'string | number', description: 'Unique selection value and native button value. Required in practice for grouped selection.' },
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'elevated'", default: "'filled'", description: 'Item appearance. Text and link variants are not supported; use href for an action link.' },
  { name: 'color', type: 'MdvButtonColor', description: 'Primary, secondary, tertiary, success, warning, error, info, or a #RGB/#RRGGBB local seed. Omitted uses the variant defaults.' },
  { name: 'size', type: 'MdvButtonSize', default: 'Inherited', description: 'Overrides group size only in standard layout; standalone default is s.' },
  { name: 'shape', type: 'MdvButtonShape', default: 'Inherited', description: 'Overrides group shape only in standard layout; standalone default is round.' },
  { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Icon-only item. Provide aria-label or aria-labelledby.' },
  { name: 'width', type: "'narrow' | 'default' | 'wide'", default: "'default'", description: 'Width of icon-only items.' },
  { name: 'selected', attribute: 'v-model:selected', type: 'boolean', description: 'Controlled independent toggle in selection=none. Omit it for ordinary actions and grouped selection.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this item, selection, and link navigation.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a progress indicator. Does not disable activation automatically.' },
  { name: 'loadingText', type: 'string', description: 'Temporary text while loading; omitted keeps the current label.' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native button type.' },
  { name: 'href', type: 'string', description: 'Renders an action as a native link. Ignored for grouped or independent toggles.' },
]
const groupSlots: SlotTableItem[] = [
  { name: 'default', description: 'MdvButtonGroupItem children. No slot parameters.' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: 'Text label or the icon for an icon-only item. Receives { selected }.' },
  { name: 'leading', description: 'Decorative leading content. Receives { selected }.' },
  { name: 'trailing', description: 'Decorative trailing content. Receives { selected }.' },
  { name: 'selected', description: 'Selected icon, replacing leading content or an icon-only default slot. Receives { selected }; no checkmark is inserted automatically.' },
]
</script>
# Button Group

Use `MdvButtonGroup` to present related actions or selections. Put one `MdvButtonGroupItem` in the group for each control.

## Standard actions

Keep `selection="none"` for standard actions. Handle each item’s click separately.

<DemoBlock>
  <ButtonGroupActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem } from '@mdv-ui/mdv'

const message = ref('Choose a document action.')
</script>

<template>
  <div class="grid gap-4">
    <MdvButtonGroup aria-label="Document actions">
      <MdvButtonGroupItem @click="message = 'Document saved.'">Save</MdvButtonGroupItem>
      <MdvButtonGroupItem variant="tonal" @click="message = 'A copy was created.'">Duplicate</MdvButtonGroupItem>
      <MdvButtonGroupItem variant="outlined" @click="message = 'Document archived.'">Archive</MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Connected choices

Use `layout="connected"` with `selection="single"` or `multiple` for related choices. Bind a single value for single selection or an array for multiple selection.

<DemoBlock>
  <ButtonGroupSingleDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvButtonGroupModelValue } from '@mdv-ui/mdv'

const view = ref<MdvButtonGroupModelValue>('week')
const required = ref(true)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="required" label="Keep one option selected" />
    <MdvButtonGroup v-model="view" variant="connected" :selection-required="required" aria-label="Calendar view">
      <MdvButtonGroupItem value="day">Day</MdvButtonGroupItem>
      <MdvButtonGroupItem value="week">Week</MdvButtonGroupItem>
      <MdvButtonGroupItem value="month">Month</MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="text-sm text-mdv-on-surface-variant" role="status">View: {{ view ?? '(none)' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

<DemoBlock>
  <ButtonGroupMultipleDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvIcon } from '@mdv-ui/mdv'
import type { MdvButtonGroupModelValue } from '@mdv-ui/mdv'
import check from '@iconify-icons/material-symbols/check'

const filters = ref<MdvButtonGroupModelValue>(['photos'])
</script>

<template>
  <div class="grid gap-4">
    <MdvButtonGroup v-model="filters" variant="connected" selection="multiple" aria-label="File filters">
      <MdvButtonGroupItem v-for="item in ['photos', 'videos', 'audio']" :key="item" :value="item" variant="tonal">
        {{ item.charAt(0).toUpperCase() + item.slice(1) }}
        <template #selected><MdvIcon :icon="check" /></template>
      </MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Filters: {{ JSON.stringify(filters) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Independent toggles

With `selection="none"`, use `v-model:selected` on individual items for independent toggles. Give each icon-only item an accessible name.

<DemoBlock>
  <ButtonGroupIndependentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvIcon } from '@mdv-ui/mdv'
import boldIcon from '@iconify-icons/material-symbols/format-bold'
import italicIcon from '@iconify-icons/material-symbols/format-italic'
import underlineIcon from '@iconify-icons/material-symbols/format-underlined'

const bold = ref(false)
const italic = ref(false)
const underline = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvButtonGroup selection="none" aria-label="Text formatting">
      <MdvButtonGroupItem v-model:selected="bold" icon-only variant="tonal" aria-label="Bold">
        <MdvIcon :icon="boldIcon" />
      </MdvButtonGroupItem>
      <MdvButtonGroupItem v-model:selected="italic" icon-only variant="tonal" aria-label="Italic">
        <MdvIcon :icon="italicIcon" />
      </MdvButtonGroupItem>
      <MdvButtonGroupItem v-model:selected="underline" icon-only variant="tonal" aria-label="Underline">
        <MdvIcon :icon="underlineIcon" />
      </MdvButtonGroupItem>
    </MdvButtonGroup>
    <p :class="{ 'font-bold': bold, italic, underline }">A short note with independent formatting.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Sizes and shapes

Set `size` and `shape` on the group for a consistent appearance. Standard items can override those values; connected items inherit them.

<DemoBlock>
  <ButtonGroupSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvButtonSize } from '@mdv-ui/mdv'

const sizes: MdvButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const square = ref(false)
const dense = ref(false)
const message = ref('Choose a size example.')
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="square" label="Square shape" />
      <MdvCheckbox v-model="dense" label="Density -2" />
    </div>
    <div v-for="size in sizes" :key="size" class="grid min-w-0 gap-2">
      <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      <MdvButtonGroup :size="size" :shape="square ? 'square' : 'round'" :density="dense ? -2 : 0" :aria-label="`${size} actions`">
        <MdvButtonGroupItem @click="message = `Selected ${size} start.`">Start</MdvButtonGroupItem>
        <MdvButtonGroupItem variant="tonal" @click="message = `Selected ${size} stop.`">Stop</MdvButtonGroupItem>
      </MdvButtonGroup>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Native forms

Set `name` on the group to submit its selection. Multiple selections are submitted as repeated fields with the same name.

<DemoBlock>
  <ButtonGroupFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvButtonGroup, MdvButtonGroupItem } from '@mdv-ui/mdv'
import type { MdvButtonGroupModelValue } from '@mdv-ui/mdv'

const channels = ref<MdvButtonGroupModelValue>(['email'])
const result = ref('Submit to inspect all selected channels.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ channel: data.getAll('channel') })
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="result = 'Form reset.'">
    <MdvButtonGroup v-model="channels" name="channel" variant="connected" selection="multiple" aria-label="Notification channels">
      <MdvButtonGroupItem value="email">Email</MdvButtonGroupItem>
      <MdvButtonGroupItem value="sms">SMS</MdvButtonGroupItem>
      <MdvButtonGroupItem value="push">Push</MdvButtonGroupItem>
    </MdvButtonGroup>
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

---

## API

### MdvButtonGroup props

<ApiTable :items="groupProps" />

### MdvButtonGroup slots

<SlotsTable :items="groupSlots" />

### MdvButtonGroupItem props

<ApiTable :items="itemProps" />

### MdvButtonGroupItem slots

<SlotsTable :items="itemSlots" />

### Events and methods

<DocsTable label="Button group events" min-width="32rem">

| Component | Event | Payload |
| --- | --- | --- |
| Group | `update:modelValue` | `MdvButtonGroupModelValue`; grouped selection/reset request. |
| Item | `update:selected` | `boolean`; independent toggle request in none mode. |
| Item | Native `click`, keyboard and pointer events | Native event, forwarded to its real button or link. |

</DocsTable>

The group exposes `element`, `focus(options?: FocusOptions)`, `blur()`, and `refresh()`. `focus()` targets the first available item; `blur()` clears focus only when it is inside the group. `refresh()` remeasures members when application-driven changes require it. Normal member/font/size changes are observed automatically. Items expose `element`, `focus(options?)`, and `blur()`.

### Native attributes and types

Group `class`, `style`, ARIA, `dir`, and other ordinary attributes apply to its outer group; the root is not a Tab stop. Item attributes and events apply to its single native button/link, including applicable `name`, `form`, `target`, `rel`, and `download`. Loading does not replace this node or automatically block actions.

```ts
import type {
  MdvButtonGroupVariant,
  MdvButtonGroupSelection,
  MdvButtonGroupValue,
  MdvButtonGroupModelValue,
  MdvButtonGroupDensity,
  MdvButtonGroupItemVariant,
  MdvButtonGroupProps,
  MdvButtonGroupItemProps,
  MdvButtonGroupItemSlotProps,
} from '@mdv-ui/mdv'
```

`MdvButtonGroupValue` is `string | number`; `MdvButtonGroupModelValue` is that value, an array of values, or `null`. Shared size, shape, color, type, and icon-width types are `MdvButtonSize`, `MdvButtonShape`, `MdvButtonColor`, `MdvButtonType`, and `MdvIconButtonWidth`.
