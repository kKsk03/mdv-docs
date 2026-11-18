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
import ButtonGroupStatesDemo from '@/components/docs/demos/buttonGroup/states.vue'
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

`MdvButtonGroup` arranges related `MdvButtonGroupItem` controls in a single row. Standard groups work well for related actions; connected groups visually combine choices. Selection is configured separately from appearance.

## Standard actions

The default `standard` layout uses `selection="none"`. Each item owns its native action and may have a different appearance. Pressing an item can expand its width by borrowing safe space from its immediate neighbors while keeping the group's overall width stable.

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

Use `MdvButtonGroupItem` rather than placing ordinary `MdvButton` controls inside the group. An ordinary action can use `href` to render a native link; toggle items always remain buttons and ignore `href`.

### Connected single selection

Connected groups default to single selection and full width. Bind the accepted value with `v-model` and give every item a unique `value`.

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

Without `selection-required`, clicking the selected item clears it to `null`. The option only prevents clearing the last selected item; it does not select an item automatically, make an empty initial value valid, or implement HTML `required` validation. Initialize the model when a choice must already be present.

### Multiple selection

Set `selection="multiple"` and use an array model. Add a `selected` slot when you want a checkmark; MDV does not insert one automatically.

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

Values are strings or numbers; `0` and `'0'` are different choices. Updates use a new array rather than modifying the supplied array in place. Selection can also be enabled in a standard group by setting `selection` explicitly.

---

## Independent toggles and icons

For controls with independent boolean models, keep `selection="none"` and bind each item's `v-model:selected`. Provide accessible names for icon-only buttons. Do not combine independent `selected` models with the group's single/multiple selection.

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

An icon-only item supports `width="narrow"`, `"default"`, or `"wide"`. Its `default`, `leading`, `trailing`, and `selected` slots receive `{ selected }`. Keep slot content decorative; do not put interactive controls inside a button.

---

## Sizes, shapes, and density

Five sizes share the Button scale. Standard items can override the group's `size` and `shape`; connected items inherit both so their joined geometry stays consistent. Toggle Square shape and Density -2 to compare their effect.

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

<DocsTable label="Button group size and spacing">

| Size | Default visual height | Standard gap |
| --- | --- | --- |
| `xs` | 32px | 18px |
| `s` | 40px | 12px |
| `m` | 56px | 8px |
| `l` | 96px | 8px |
| `xl` | 136px | 8px |

</DocsTable>

Connected gaps stay at 2px. Density values `0`, `-1`, `-2`, `-3` reduce visual height by 4px per step while preserving at least 48px interaction targets. Text scaling can increase natural height.

Groups remain in one row and scroll internally when space is insufficient. Prefer short labels or an explicit menu composition for long action lists. `full-width` defaults to `false` for standard and `true` for connected groups; it can be overridden.

## Disabled, loading, and colors

Use group-level `disabled` for the whole group or item-level `disabled` for one action. Loading is visual only; this example binds `disabled` as well to prevent duplicate publishing while showing the spinner.

<DemoBlock>
  <ButtonGroupStatesDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvCheckbox } from '@mdv-ui/mdv'

const loading = ref(false)
const disabled = ref(false)
const message = ref('Toggle the states, then try the available actions.')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="loading" label="Show loading" />
      <MdvCheckbox v-model="disabled" label="Disable group" />
    </div>
    <MdvButtonGroup :disabled="disabled" aria-label="Publishing actions">
      <MdvButtonGroupItem :loading="loading" :disabled="loading" loading-text="Publishing…" @click="message = 'Published.'">
        Publish
      </MdvButtonGroupItem>
      <MdvButtonGroupItem variant="elevated" color="tertiary" @click="message = 'Preview opened.'">Preview</MdvButtonGroupItem>
      <MdvButtonGroupItem disabled variant="outlined">Unavailable</MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Item `color` supports the same seven named roles and local hexadecimal seeds as Button. Omitted color uses the item's variant defaults. Selected shape/color changes, state layers, focus outlines, spring motion, theme inheritance, RTL, and reduced motion are handled by MDV.

---

## Native forms

Set `name` on the group to submit accepted selections. Multiple choices become repeated hidden fields with the same name; read them using `FormData.getAll()`.

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

The Vue model retains number/string types; native form values become strings. `selection="none"` does not submit group selections. `form` can associate with an external form. Reset requests the model captured at creation; controlled parents must still accept the update, and cancelling the native reset preserves the current state. Disabled groups/fieldsets follow native form disabling rules.

## Keyboard and controlled state

- The container is a named `role="group"`, not a tablist or radio group. Use `aria-label` or `aria-labelledby` to describe its purpose.
- Tab and Shift+Tab visit each available native control. Arrow keys move focus, Home/End move to the first/last available item, and navigation wraps while skipping disabled, hidden, and inert items. Horizontal movement mirrors in RTL.
- Moving focus does not select. Enter/Space activate buttons; links retain native Enter behavior. Toggle buttons expose `aria-pressed`.
- A bound model is authoritative. The parent may reject `update:modelValue`; visuals and `aria-pressed` keep the accepted value. Calling `preventDefault()` on an item's native click cancels its selection change.

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
