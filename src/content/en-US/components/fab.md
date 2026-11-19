<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FabBasicDemo from '@/components/docs/demos/fab/basic.vue'
import FabSizeDemo from '@/components/docs/demos/fab/size.vue'
import FabColorDemo from '@/components/docs/demos/fab/color.vue'
import FabExtendedDemo from '@/components/docs/demos/fab/extended.vue'
import FabPlacementDemo from '@/components/docs/demos/fab/placement.vue'
import FabScrollDemo from '@/components/docs/demos/fab/scroll.vue'
import FabFormDemo from '@/components/docs/demos/fab/form.vue'

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

A floating action button represents the primary action on a screen. `MdvFab` uses an icon; `MdvExtendedFab` adds a short label. Choose the presentation that makes the action clear and keep one primary floating action per screen. The comparisons below show alternatives, rather than a suggested collection of simultaneous primary actions.

## Icon and extended actions

Give an icon-only FAB a clear `aria-label` or `aria-labelledby`. An extended FAB normally takes its name from its visible text. Supply an icon through `#leading` when a compact presentation is useful.

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

The icon slots are decorative. Do not place another button, input, or link inside either FAB. Clicking an extended FAB performs its business action; it does not toggle expansion automatically.

## Sizes

The icon FAB supports four sizes. Extended FAB has three heights and no `regular` value.

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

<DocsTable label="FAB dimensions" min-width="33rem">

| Component and size | Surface | Corner radius | Icon |
| --- | --- | --- | --- |
| Fab small | 40 × 40px; 48px interaction target | 12px | 24px |
| Fab regular | 56 × 56px | 16px | 24px |
| Fab medium | 80 × 80px | 20px | 28px |
| Fab large | 96 × 96px | 28px | 36px |
| ExtendedFab small | 56px high | 16px | 24px |
| ExtendedFab medium | 80px high | 20px | 28px |
| ExtendedFab large | 96px high | 28px | 36px |

</DocsTable>

Extended FAB horizontal padding is 16/26/28px and icon-to-label spacing is 8/12/16px. Without an icon it does not reserve an empty icon gap. Labels stay on one line without truncation or text scaling; use concise text and check narrow containers instead of relying on wrapping.

## Colors and elevation

Use a container color for the usual tonal surface, a solid primary/secondary/tertiary color for stronger emphasis, or `surface` when that role fits the composition. `elevated` controls shadow, not the color family.

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

The `surface` option uses `surface-container-high` with primary content. Enabled elevation uses level 3 and rises to level 4 on hover. The inherited theme supplies light/dark colors, an 8% hover state layer, 10% focus/pressed layers, and the focus-visible outline.

## Controlled expansion

Omit `expanded` to let ExtendedFab manage its own label state, use `v-model:expanded` to accept requests, or bind `:expanded` and decide whether to accept `update:expanded`.

<DemoBlock>
  <FabExtendedDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvExtendedFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const fab = useTemplateRef<InstanceType<typeof MdvExtendedFab>>('fab')
const expanded = ref(true)
const accept = ref(false)
const withIcon = ref(true)
const message = ref('Requests are rejected until you allow them.')
const notes = ref(0)

function update(value: boolean) {
  message.value = `Requested ${value ? 'expanded' : 'collapsed'}: ${accept.value ? 'accepted' : 'rejected'}.`
  if (accept.value) expanded.value = value
}

async function request(action: 'expand' | 'collapse' | 'toggle') {
  const accepted = await fab.value?.[action]()
  message.value = `${action}() ${accepted ? 'accepted' : 'not accepted'}.`
}
</script>

<template>
  <div class="grid justify-items-start gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="accept" label="Accept expansion requests" />
      <MdvCheckbox v-model="withIcon" label="Include a leading icon" />
    </div>
    <MdvExtendedFab ref="fab" :expanded="expanded" @update:expanded="update" @click="notes++">
      <template v-if="withIcon" #leading><MdvIcon :icon="editIcon" /></template>
      Write note
    </MdvExtendedFab>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="request('expand')">Request expand</MdvButton>
      <MdvButton variant="tonal" @click="request('collapse')">Request collapse</MdvButton>
      <MdvButton variant="outlined" @click="request('toggle')">Request toggle</MdvButton>
      <MdvButton variant="text" @click="fab?.focus()">Focus action</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }} · Notes: {{ notes }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Try requesting collapse before and after enabling acceptance. `expand()`, `collapse()`, and `toggle()` resolve to whether the requested state was accepted; they do not wait for the visual transition. Without a leading icon the component keeps its label visible, even when a parent asks for a collapsed presentation.

Expansion changes the presentation of the same action. The label stays available to assistive technology when hidden visually, and the button does not receive `aria-expanded` because it is not disclosing a panel. The stable DOM and width transition support rapid reversals without shrinking the text.

## Placement and reading direction

The default `position="static"` participates in normal layout. Use `absolute` inside an intentional positioned container, or `fixed` for a viewport action. Logical `placement` follows `dir`.

<DemoBlock>
  <FabPlacementDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon, MdvSelect } from '@mdv-ui/mdv'
import type { MdvFabPlacement } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const placement = ref<MdvFabPlacement>('bottom-end')
const rtl = ref(false)
const count = ref(0)
const placements = ['bottom-start', 'bottom-center', 'bottom-end'].map(value => ({ value, label: value }))
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <MdvSelect :model-value="placement" :options="placements" label="Action placement" @update:model-value="placement = $event as MdvFabPlacement" />
      <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
    </div>
    <div :dir="rtl ? 'rtl' : 'ltr'" class="relative min-h-60 rounded-xl bg-mdv-surface-container-low p-5 pb-28">
      <p class="font-medium">An action anchored to this preview</p>
      <p class="mt-3 text-sm text-mdv-on-surface-variant" role="status">Items created: {{ count }}</p>
      <MdvFab position="absolute" :placement="placement" :offset="20" aria-label="Create in preview" @click="count++"><MdvIcon :icon="addIcon" /></MdvFab>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

`offset` adds an edge distance, with safe-area insets applied separately. Reserve room for the action so it cannot cover the last content or important controls. Navigation bars, toolbars, snackbars, and other floating layers need deliberate spacing in the host layout; the FAB does not detect those collisions.

When an icon FAB is placed in the `fab` slot of a floating `MdvToolbar`, that toolbar manages its placement and adapts it from 56px to 80px as the toolbar collapses. Its default color becomes secondary-container in the standard toolbar and tertiary-container in the vibrant toolbar. ExtendedFab does not use that special toolbar context.

## Collapse on a real scroll container

Set `scroll-behavior="collapse"` and point `scroll-target` at the element that actually scrolls. This example explicitly uses the preview scaffold's `contentElement`, independently of the documentation page's scroll position.

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

Scroll inside the preview: downward scrolling accumulates toward collapse and upward scrolling toward expansion. The default threshold is 40px in the same direction. The label expands at the top and bottom boundaries. Auto-collapse pauses while the action has focus, is being pressed, or has an associated active menu.

Omitting the target follows `window`. An explicitly supplied selector/getter that does not resolve does not silently follow another scroll area. Use `refresh()` after a target becomes available or when an external layout/font change needs remeasurement. MDV also responds to its observed content changes and cleans up on deactivation/unmount. Reduced motion removes the expansion animation.

## Native forms and links

FABs default to `type="button"`. Choose `submit` or `reset` explicitly for native form actions; normal required-field validation still applies. Supplying `href` renders an actual anchor, including native target and download behavior.

<DemoBlock>
  <FabFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvExtendedFab, MdvFab, MdvIcon, MdvTextField } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save-outline'
import resetIcon from '@iconify-icons/material-symbols/restart-alt'

const title = ref('')
const result = ref('Enter a title before saving.')
</script>

<template>
  <div class="grid gap-5">
    <form class="grid gap-4" @submit.prevent="result = `Saved: ${title}`" @reset="title = ''; result = 'Draft reset.'">
      <MdvTextField v-model="title" label="Note title" name="title" required full-width />
      <div class="flex flex-wrap items-center gap-5">
        <MdvExtendedFab type="submit"><template #leading><MdvIcon :icon="saveIcon" /></template>Save note</MdvExtendedFab>
        <MdvFab type="reset" color="secondary-container" aria-label="Reset draft"><MdvIcon :icon="resetIcon" /></MdvFab>
      </div>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvExtendedFab class="justify-self-start" href="https://m3.material.io/components/floating-action-button/overview" target="_blank" rel="noopener noreferrer">Design guide</MdvExtendedFab>
  </div>
</template>
```

  </template>
</DemoBlock>

Try saving an empty title, then entering a title and saving or resetting. The Design guide is a real external link. Link FABs follow native Enter activation and do not acquire button-style Space activation.

There is no dedicated disabled or loading design variant in this API. Prefer hiding an unavailable primary action when appropriate. A native `disabled` attribute can still disable a button, but `aria-disabled` alone does not prevent an anchor from navigating; implement any link restriction explicitly.

## Accessibility and motion

- Provide an accessible action name, especially for icon-only FABs. Avoid an ARIA name that contradicts the visible extended label.
- Use native button/link semantics, preserve focus-visible feedback, and keep interactive children out of the icon/label slots.
- Check short labels at all intended sizes and widths. Positioning and safe areas do not automatically prevent content overlap.
- Expansion preserves the action's identity and label while animating its width. Focus, press, scroll direction, and reduced-motion preferences affect automatic collapse as described above.
- The examples inherit the page's MDV theme. Use local `data-mdv-theme` or theme tokens when a specific preview needs a different appearance.

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
