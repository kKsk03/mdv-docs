<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ActionsDemo from '@/components/docs/demos/toolbar/actions.vue'
import ExpansionDemo from '@/components/docs/demos/toolbar/expansion.vue'
import ScrollDemo from '@/components/docs/demos/toolbar/scroll.vue'

const props: ApiTableItem[] = [
  { name: 'variant', type: 'MdvToolbarVariant', default: "'docked'", description: "'docked' for a full-width bar; 'floating' for a separate rounded surface." },
  { name: 'color', type: 'MdvToolbarColor', default: "'standard'", description: "'standard' uses neutral surface roles; 'vibrant' uses primary container roles." },
  { name: 'orientation', type: 'MdvToolbarOrientation', default: "'horizontal'", description: "'vertical' is supported only by the floating variant." },
  { name: 'align', type: 'MdvToolbarAlignment', default: "'center'", description: "Main-axis alignment: 'start', 'center', 'end', or 'between'." },
  { name: 'elevated', type: 'boolean', description: 'Defaults to true for floating and false for docked. Set explicitly to override.' },
  { name: 'position', type: 'MdvToolbarPosition', default: "'static'", description: "'static' stays in normal flow, 'absolute' anchors in a positioned ancestor, and 'fixed' normally anchors to the viewport." },
  { name: 'placement', type: 'MdvToolbarPlacement', default: "'bottom'", description: "Edge for absolute or fixed positioning: 'bottom', logical 'start', or logical 'end'. Docked uses only bottom." },
  { name: 'fabPosition', type: 'MdvToolbarFabPosition', default: "'end'", description: "Paired FAB position on the main axis: logical 'start' or 'end'." },
  { name: 'expanded', attribute: 'v-model:expanded', type: 'boolean', description: 'Floating expansion state. Omit for internal state, initially expanded.' },
  { name: 'scrollBehavior', type: 'MdvToolbarScrollBehavior', default: "'none'", description: "'hide' moves the entire bar; 'collapse' is only for a collapsible floating toolbar." },
  { name: 'scrollTarget', type: 'MdvToolbarScrollTarget', description: 'Window, element, CSS selector, or getter. Omit to follow window; an unresolved explicit target does not fall back.' },
  { name: 'scrollThreshold', type: 'number', default: '40', description: 'Accumulated scroll distance in pixels in one direction before a change is requested.' },
  { name: 'expandLabel', type: 'string', description: 'Accessible name for the toggle when the toolbar is collapsed.' },
  { name: 'collapseLabel', type: 'string', description: 'Accessible name for the toggle when the toolbar is expanded.' },
]
const slots: SlotTableItem[] = [
  { name: 'default', description: 'Primary actions. Stay reachable on collapse unless a FAB is paired.' },
  { name: 'leading', description: 'Secondary actions before the primary group. Inert while collapsed.' },
  { name: 'trailing', description: 'Secondary actions after the primary group. Inert while collapsed.' },
  { name: 'fab', description: 'One MdvFab in the floating variant; stays reachable while the action group collapses.' },
  { name: 'toggle', description: 'Replaces the expand/collapse button. Bind toggleProps to a real interactive control.' },
]
</script>
# Toolbar

Use `MdvToolbar` to group actions for the current view. Choose a docked toolbar for a full-width row or a floating toolbar for a separate surface.

## Docked toolbar

Give the toolbar a specific `aria-label`. Arrow keys move among the actions along the toolbar’s orientation.

<DemoBlock>
  <ActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvToolbar } from '@mdv-ui/mdv'
import boldIcon from '@iconify-icons/material-symbols/format-bold'
import italicIcon from '@iconify-icons/material-symbols/format-italic'
import underlineIcon from '@iconify-icons/material-symbols/format-underlined'

const bold = ref(false)
const italic = ref(false)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvToolbar align="between" aria-label="Text formatting">
      <MdvIconButton v-model:selected="bold" variant="standard" aria-label="Bold">
        <MdvIcon :icon="boldIcon" />
      </MdvIconButton>
      <MdvIconButton variant="standard" aria-label="Underline" disabled>
        <MdvIcon :icon="underlineIcon" />
      </MdvIconButton>
      <MdvIconButton v-model:selected="italic" variant="standard" aria-label="Italic">
        <MdvIcon :icon="italicIcon" />
      </MdvIconButton>
    </MdvToolbar>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Bold: {{ bold ? 'on' : 'off' }}; italic: {{ italic ? 'on' : 'off' }}.
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Floating toolbar and FAB

A floating toolbar can collapse its `leading` and `trailing` groups. With an `MdvFab` in `#fab`, it collapses the action group instead. Bind `toggleProps` when supplying a custom toggle.

<DemoBlock>
  <ExpansionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon, MdvIconButton, MdvToolbar } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'
import editIcon from '@iconify-icons/material-symbols/edit-outline'
import moreIcon from '@iconify-icons/material-symbols/expand-more'
import lessIcon from '@iconify-icons/material-symbols/expand-less'
import pinIcon from '@iconify-icons/material-symbols/push-pin-outline'

const paired = ref(false)
const expanded = ref(true)
const pinned = ref(false)
const result = ref('No action yet.')
</script>

<template>
  <div class="grid min-w-0 justify-items-start gap-4">
    <MdvCheckbox v-model="paired" label="Pair with a floating action button" />
    <MdvToolbar
      v-model:expanded="expanded"
      variant="floating"
      color="vibrant"
      aria-label="Note actions"
      expand-label="Expand note actions"
      collapse-label="Collapse note actions"
    >
      <template #leading>
        <MdvIconButton v-model:selected="pinned" variant="standard" aria-label="Pin note">
          <MdvIcon :icon="pinIcon" />
        </MdvIconButton>
      </template>
      <MdvIconButton variant="filled" aria-label="Edit note" @click="result = 'Edited the note.'">
        <MdvIcon :icon="editIcon" />
      </MdvIconButton>
      <template v-if="paired" #fab>
        <MdvFab aria-label="Add note" @click="result = 'Added a note.'">
          <MdvIcon :icon="addIcon" />
        </MdvFab>
      </template>
      <template #toggle="{ expanded: isExpanded, toggleProps }">
        <MdvIconButton v-bind="toggleProps" variant="standard">
          <MdvIcon :icon="isExpanded ? lessIcon : moreIcon" />
        </MdvIconButton>
      </template>
    </MdvToolbar>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ expanded ? 'Expanded' : 'Collapsed' }}. {{ pinned ? 'Pinned' : 'Not pinned' }}. {{ result }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Placement and scrolling

Set `scroll-target` for a local scroll area. Use `scroll-behavior="collapse"` to collapse secondary actions or `hide` to hide the bar. Absolute and fixed placement do not reserve space for the toolbar.

<DemoBlock>
  <ScrollDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvIcon, MdvIconButton, MdvToolbar } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'
import saveIcon from '@iconify-icons/material-symbols/save'

const scrollArea = useTemplateRef<HTMLElement>('scrollArea')
const expanded = ref(true)
const result = ref('No action yet.')
const notes = [
  'Set up the workspace before inviting reviewers.',
  'Outline the first draft and identify open questions.',
  'Collect feedback from the pilot group.',
  'Review the navigation and common actions.',
  'Check the preview on a narrow viewport.',
  'Prepare a short summary for the next meeting.',
  'Review the final changes before sharing.',
  'Archive the previous draft after approval.',
]
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="relative h-80 overflow-hidden rounded-2xl border border-mdv-outline-variant">
      <div
        ref="scrollArea"
        role="region"
        aria-label="Scrollable draft notes"
        tabindex="0"
        class="h-full overflow-y-auto py-4 ps-4 pe-28 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mdv-primary"
      >
        <ol class="grid list-decimal gap-4 ps-5">
          <li v-for="note in notes" :key="note" class="rounded-lg bg-mdv-surface-container-low p-3 text-sm">
            {{ note }}
          </li>
        </ol>
      </div>
      <MdvToolbar
        v-model:expanded="expanded"
        variant="floating"
        orientation="vertical"
        position="absolute"
        placement="end"
        scroll-behavior="collapse"
        :scroll-target="() => scrollArea"
        aria-label="Draft editing"
        expand-label="Expand draft actions"
        collapse-label="Collapse draft actions"
      >
        <template #leading>
          <MdvIconButton variant="standard" aria-label="Edit draft" @click="result = 'Edited the draft.'">
            <MdvIcon :icon="editIcon" />
          </MdvIconButton>
        </template>
        <MdvIconButton variant="filled" aria-label="Save draft" @click="result = 'Saved the draft.'">
          <MdvIcon :icon="saveIcon" />
        </MdvIconButton>
      </MdvToolbar>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ expanded ? 'Expanded' : 'Collapsed' }}. {{ result }}
    </p>
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

All slots receive `{ expanded, expand, collapse, toggle, toggleProps }`. The button binding includes `aria-expanded`, `aria-controls`, and `onClick`. The optional `aria-label` comes from `expandLabel` or `collapseLabel`. A default toggle appears only when there is a collapsible group or paired FAB.

### Events, attributes, and exposed methods

- `update:expanded(boolean)` requests expansion or collapse; in controlled use, only the parent's accepted value applies.
- A template ref exposes `element`, `expand()`, `collapse()`, `toggle()`, and `refresh()`. The three state methods resolve to `Promise<boolean>` indicating acceptance. `refresh()` remeasures the groups and resolves the current scroll target again.
- Native attributes, classes, styles, and listeners are applied to the root toolbar. For wrapped or custom controls, the color roles are available as `--mdv-toolbar-container`, `--mdv-toolbar-content`, `--mdv-toolbar-selected-container`, and `--mdv-toolbar-selected-content`. Use `--mdv-toolbar-gap` and `--mdv-toolbar-margin` for explicit spacing adjustments.

### Public types

```ts
import type {
  MdvToolbarVariant,
  MdvToolbarColor,
  MdvToolbarOrientation,
  MdvToolbarAlignment,
  MdvToolbarPosition,
  MdvToolbarPlacement,
  MdvToolbarFabPosition,
  MdvToolbarScrollBehavior,
  MdvToolbarScrollTarget,
  MdvToolbarProps,
  MdvToolbarToggleProps,
  MdvToolbarSlotProps,
} from '@mdv-ui/mdv'
```
