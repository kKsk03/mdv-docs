<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FabBasicDemo from '@/components/docs/demos/fab/basic.vue'
import FabSizeDemo from '@/components/docs/demos/fab/size.vue'
import FabColorDemo from '@/components/docs/demos/fab/color.vue'
import FabScrollDemo from '@/components/docs/demos/fab/scroll.vue'

const sharedProps: ApiTableItem[] = [
  { name: 'color', type: 'MdvFabColor', default: "'primary-container'", description: 'primary-container, secondary-container, tertiary-container, primary, secondary, tertiary, or surface. Icon FABs in a floating toolbar can receive a contextual default.' },
  { name: 'elevated', type: 'boolean', default: 'true', description: 'Enables the FAB shadow and elevated hover state. Turning it off preserves the color and state layer.' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native button type when href is absent. Does not assign button behavior to links.' },
  { name: 'href', type: 'string', description: 'When supplied, renders a native anchor instead of a button. Forward target, rel, or download as needed.' },
  { name: 'position', type: "'static' | 'absolute' | 'fixed'", default: "'static'", description: 'Normal flow, a positioned containing block, or the viewport. Establish the intended containing block for absolute placement.' },
  { name: 'placement', type: "'bottom-start' | 'bottom-center' | 'bottom-end'", default: "'bottom-end'", description: 'Logical bottom alignment for absolute/fixed placement; start and end follow the writing direction.' },
  { name: 'offset', type: 'number', default: '16', description: 'Non-negative edge distance in pixels. Device safe-area insets are added separately.' },
]
const fabProps: ApiTableItem[] = [
  { name: 'size', type: "'small' | 'regular' | 'medium' | 'large'", default: "'regular'", description: '40, 56, 80, or 96px visible surface. The legacy small FAB retains a 48px native interaction target.' },
  ...sharedProps,
]
const extendedFabProps: ApiTableItem[] = [
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'small'", description: '56, 80, or 96px height. Extended FAB has no regular size value.' },
  ...sharedProps,
  { name: 'expanded', type: 'boolean', default: 'true (internal)', description: 'Omit for internal state; supplying a boolean makes expansion controlled. Only FABs with a leading icon can collapse.' },
  { name: 'scrollBehavior', type: "'none' | 'collapse'", default: "'none'", description: 'Optionally collapses the label on downward scrolling and expands it on upward scrolling.' },
  { name: 'scrollTarget', type: 'MdvFabScrollTarget', default: 'window', description: 'Window, HTMLElement, selector, or getter returning a target. An explicit missing target does not fall back to window.' },
  { name: 'scrollThreshold', type: 'number', default: '40', description: 'Cumulative distance in pixels in one direction before requesting expansion or collapse. Reversing direction restarts accumulation.' },
]
const fabSlots: SlotTableItem[] = [
  { name: 'default', description: 'Decorative icon. The icon wrapper is aria-hidden and inert; give the FAB an accessible name on its root. No parameters.' },
]
const extendedFabSlots: SlotTableItem[] = [
  { name: 'default', description: 'Short action label. It remains the accessible name when visually collapsed. No parameters.' },
  { name: 'leading', description: 'Optional decorative icon, hidden from assistive technology and inert. Required for collapsing. No parameters.' },
]
</script>
# FAB

Use a floating action button for the primary action in a view. Choose `MdvFab` for an icon or `MdvExtendedFab` for an action with a visible label.

## Icon and extended actions

Give icon-only FABs an accessible name. For an Extended FAB, put the label in the default slot and the icon in `#leading`.

<DemoBlock>
  <FabBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvExtendedFab, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const notes = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap items-center gap-6">
      <MdvFab aria-label="Write a note" @click="notes++"><MdvIcon :icon="editIcon" /></MdvFab>
      <MdvExtendedFab @click="notes++">
        <template #leading><MdvIcon :icon="editIcon" /></template>
        Write a note
      </MdvExtendedFab>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Notes created: {{ notes }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Sizes

Set `size` for the button height. Extended FAB has no `regular` size.

<DemoBlock>
  <FabSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvExtendedFab, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import type { MdvExtendedFabSize, MdvFabSize } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const sizes: MdvFabSize[] = ['small', 'regular', 'medium', 'large']
const extendedSizes: MdvExtendedFabSize[] = ['small', 'medium', 'large']
</script>

<template>
  <div class="grid gap-7">
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in sizes" :key="size" class="grid justify-items-center gap-3">
        <MdvFab :size="size" :aria-label="`Create item, ${size}`"><MdvIcon :icon="addIcon" /></MdvFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      </div>
    </div>
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in extendedSizes" :key="size" class="grid justify-items-center gap-3">
        <MdvExtendedFab :size="size"><template #leading><MdvIcon :icon="addIcon" /></template>Create</MdvExtendedFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Colors and elevation

Use `color` to choose a tonal or solid surface. Set `elevated` for a shadow.

<DemoBlock>
  <FabColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import type { MdvFabColor } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const elevated = ref(true)
const colors: MdvFabColor[] = ['primary-container', 'secondary-container', 'tertiary-container', 'primary', 'secondary', 'tertiary', 'surface']
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="elevated" label="Elevated surfaces" />
    <div class="flex flex-wrap gap-x-6 gap-y-7">
      <div v-for="color in colors" :key="color" class="grid justify-items-center gap-3">
        <MdvFab :color="color" :elevated="elevated" :aria-label="`Edit with ${color}`"><MdvIcon :icon="editIcon" /></MdvFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ color }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Placement

`position="static"` stays in normal flow. Use `absolute` within a positioned parent or `fixed` relative to the viewport. `placement` follows the text direction.

## Collapse on scroll

Use `scroll-behavior="collapse"` to collapse the Extended FAB’s label on scroll. Set `scroll-target` to the actual scroll area, or use `v-model:expanded` to control the state yourself.

<DemoBlock>
  <FabScrollDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvExtendedFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const scaffold = useTemplateRef<InstanceType<typeof MdvAppBarScaffold>>('scaffold')
const expanded = ref(true)
const collapseOnScroll = ref(true)
const notes = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="collapseOnScroll" label="Collapse on downward scroll" />
    <div class="relative h-88 overflow-hidden rounded-xl border border-mdv-outline-variant bg-mdv-surface-container-low">
      <MdvAppBarScaffold ref="scaffold" class="h-full" :content-attrs="{ 'aria-label': 'Scrollable field notes', tabindex: 0 }">
        <template #appbar><MdvAppBar title="Field notes" variant="small" /></template>
        <div class="grid gap-6 p-5 pb-28">
          <p v-for="index in 18" :key="index" class="text-sm">Note {{ index }}: scroll this preview down to collapse the action, then scroll up to show its label.</p>
        </div>
      </MdvAppBarScaffold>
      <MdvExtendedFab v-model:expanded="expanded" position="absolute" :scroll-behavior="collapseOnScroll ? 'collapse' : 'none'" :scroll-target="() => scaffold?.contentElement" @click="notes++">
        <template #leading><MdvIcon :icon="editIcon" /></template>
        Write note
      </MdvExtendedFab>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Label: {{ expanded ? 'expanded' : 'collapsed' }} · Notes: {{ notes }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## MdvFab API

### Props

<ApiTable :items="fabProps" />

### Slots

<SlotsTable :items="fabSlots" />

### Native events and methods

Fab has no custom model or custom component events. Native `click`, `focus`, `blur`, pointer, and keyboard listeners reach the root control. Native form attributes such as `name`, `value`, `form`, and `formaction` remain available on the button; link attributes apply to anchors.

<DocsTable label="Shared FAB instance API" min-width="31rem">

| Member | Type and purpose |
| --- | --- |
| `element` | Current `HTMLButtonElement` or `HTMLAnchorElement`, or null before mount/after unmount. |
| `focus(options?)` | Focuses the native control with optional `FocusOptions`. |
| `blur()` | Removes focus from the native control. |

</DocsTable>

## MdvExtendedFab API

### Props

<ApiTable :items="extendedFabProps" />

### Slots

<SlotsTable :items="extendedFabSlots" />

### Events and methods

<DocsTable label="Extended FAB events" min-width="31rem">

| Event | Payload and meaning |
| --- | --- |
| `update:expanded` | Requested boolean label state. A controlled parent must accept it for the corresponding change to occur. |

</DocsTable>

ExtendedFab shares `element`, `focus()`, `blur()`, native events, and native attribute forwarding with Fab, and adds these methods:

<DocsTable label="Extended FAB expansion methods" min-width="31rem">

| Method | Return value and purpose |
| --- | --- |
| `expand()` | `Promise<boolean>`; requests the expanded label. |
| `collapse()` | `Promise<boolean>`; requests collapse when a leading icon exists. |
| `toggle()` | `Promise<boolean>`; requests the opposite presentation. |
| `refresh()` | `void`; refreshes measurements and the scroll target binding. |

</DocsTable>

The boolean reports acceptance, not animation completion. A label-only ExtendedFab cannot collapse.

### Public types

```ts
import type {
  MdvFabProps,
  MdvExtendedFabProps,
  MdvFabColor,
  MdvFabSize,
  MdvExtendedFabSize,
  MdvFabType,
  MdvFabPosition,
  MdvFabPlacement,
  MdvExtendedFabScrollBehavior,
  MdvFabScrollTarget,
} from '@mdv-ui/mdv'
```
