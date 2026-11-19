<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import DividerBasicDemo from '@/components/docs/demos/divider/basic.vue'
import DividerVerticalDemo from '@/components/docs/demos/divider/vertical.vue'
import DividerSemanticsDemo from '@/components/docs/demos/divider/semantics.vue'
import DividerThemeDemo from '@/components/docs/demos/divider/theme.vue'

const dividerProps: ApiTableItem[] = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the line. A vertical divider stretches across its flex or grid cross-axis unless given an explicit height.' },
  { name: 'variant', type: "'full-width' | 'inset' | 'middle-inset'", default: "'full-width'", description: 'No inset, a 16px start inset, or 16px at both ends. Vertical lines map these insets to the top and bottom.' },
  { name: 'decorative', type: 'boolean', default: 'true', description: 'Hides the line from assistive technology. Set false to expose a separator with its orientation.' },
]
</script>

# Divider

`MdvDivider` separates related content or actions with a thin line. Use spacing first, then add a divider where readers need a clearer boundary. It has no interaction or built-in surrounding padding.

## Horizontal dividers

The default line fills the available width. `inset` leaves 16px at the logical start; `middle-inset` leaves 16px at both ends. Place it between sections rather than adding a line after every short item.

<DemoBlock>
  <DividerBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvDivider } from '@mdv-ui/mdv'
import type { MdvDividerVariant } from '@mdv-ui/mdv'

const variants: MdvDividerVariant[] = ['full-width', 'inset', 'middle-inset']
</script>

<template>
  <div class="grid gap-5">
    <div v-for="variant in variants" :key="variant" class="rounded-xl bg-mdv-surface-container-low">
      <p class="p-4 font-medium">{{ variant }}</p>
      <MdvDivider :variant="variant" />
      <p class="p-4 text-sm text-mdv-on-surface-variant">Related content stays together; the line separates the next group.</p>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Vertical dividers

Use `orientation="vertical"` between adjacent actions or columns. In a horizontal flex layout it stretches to the available height; an explicit height works for a shorter line. A plain block container may need an explicit height to establish its length.

<DemoBlock>
  <DividerVerticalDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvDivider, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import boldIcon from '@iconify-icons/material-symbols/format-bold'
import italicIcon from '@iconify-icons/material-symbols/format-italic'
import underlineIcon from '@iconify-icons/material-symbols/format-underlined'

const bold = ref(false)
const italic = ref(false)
const underline = ref(false)
</script>

<template>
  <div class="grid gap-5">
    <div role="group" aria-label="Text formatting" class="flex h-16 items-center gap-2 rounded-xl bg-mdv-surface-container-low px-3">
      <MdvIconButton v-model:selected="bold" aria-label="Bold"><MdvIcon :icon="boldIcon" /></MdvIconButton>
      <MdvDivider orientation="vertical" />
      <MdvIconButton v-model:selected="italic" aria-label="Italic"><MdvIcon :icon="italicIcon" /></MdvIconButton>
      <MdvDivider orientation="vertical" class="h-8 self-center" />
      <MdvIconButton v-model:selected="underline" aria-label="Underline"><MdvIcon :icon="underlineIcon" /></MdvIconButton>
    </div>
    <p :class="{ 'font-bold': bold, italic, underline }">A line separates actions without becoming another Tab stop.</p>
    <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 rounded-xl bg-mdv-surface-container-low p-4">
      <p>Short note</p>
      <MdvDivider orientation="vertical" variant="middle-inset" />
      <p class="text-sm text-mdv-on-surface-variant">The divider stretches with this grid row, even when one side contains more text.</p>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

The second toolbar line has `h-8 self-center`; the first stretches naturally. Container `gap` controls the space around each line. MDV does not add a minimum touch target because a divider is not an action.

## Decorative and semantic separators

Dividers are decorative by default: the root has `aria-hidden="true"` and no separator role. Set `:decorative="false"` when the boundary conveys useful structure between groups of controls or content.

<DemoBlock>
  <DividerSemanticsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDivider } from '@mdv-ui/mdv'

const semantic = ref(true)
const message = ref('Tab moves between the actions, skipping the divider.')
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="semantic" label="Expose a semantic separator" />
    <div class="grid justify-items-start gap-4 rounded-xl bg-mdv-surface-container-low p-4">
      <MdvButton variant="outlined" @click="message = 'Previous action selected.'">Previous action</MdvButton>
      <MdvDivider class="w-full" :decorative="!semantic" aria-label="Reading and actions" />
      <MdvButton variant="outlined" @click="message = 'Next action selected.'">Next action</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

A semantic divider receives `role="separator"` and `aria-orientation`. It remains outside the Tab sequence. Do not use this component as a draggable splitter; it has no resize behavior, focus handling, or value attributes.

## Theme, dimensions, and RTL

The line uses the inherited `outline-variant` color, a 1px thickness, and square ends. The examples below compare local light/dark themes, logical insets, and an explicit token/thickness override.

<DemoBlock>
  <DividerThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDivider } from '@mdv-ui/mdv'

const rtl = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
    <div class="grid gap-4 sm:grid-cols-2" :dir="rtl ? 'rtl' : 'ltr'">
      <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid gap-4 rounded-xl bg-mdv-surface-container-low py-4 text-mdv-on-surface">
        <p class="px-4 font-medium">{{ theme }} · logical start inset</p>
        <MdvDivider variant="inset" />
        <p class="px-4 text-sm">The 16px inset follows the text direction.</p>
      </div>
    </div>
    <div class="grid gap-4 rounded-xl bg-mdv-surface-container-low py-4" style="--mdv-sys-color-outline-variant: var(--mdv-sys-color-primary)">
      <p class="px-4 text-sm">A local color role and a 2px line</p>
      <MdvDivider variant="middle-inset" style="height: 2px" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

Horizontal `inset` follows the writing direction: left in LTR and right in RTL. For a vertical line, MDV maps the single inset to the top and the double inset to both top and bottom. Those vertical insets are an MDV API convention.

<DocsTable label="Divider layout and customization" min-width="31rem">

| Concern | Behavior |
| --- | --- |
| Thickness | Default 1px. Use height for a horizontal line and width for a vertical line. |
| Length | Determined by the container, insets, and any explicit width/height. |
| Spacing | Set surrounding padding or gap on the composition. |
| Color | Inherits `--mdv-sys-color-outline-variant`; local MDV theme tokens can override it. |
| Interaction | No hover, pressed, selected, or disabled state; no component motion. |
| Forced colors | Uses the system `CanvasText` color. |

</DocsTable>

Keep overrides intentional: a thicker line can work as a visual section boundary, but does not make the component interactive. Utility classes may override ordinary component styles through the configured Tailwind layers.

## API

### Props

<ApiTable :items="dividerProps" />

### Attributes and semantics

The component renders one `div`; ordinary attributes such as `class`, `style`, `id`, and `dir` reach it. The component manages `role`, `aria-hidden`, and `aria-orientation` according to `decorative` and `orientation`. Use those props to change semantics rather than trying to override the managed attributes.

There are no content slots, custom events, or additional exposed methods. Native DOM listeners can still be forwarded, but do not turn the visual separator into a usable control.

### Public types

```ts
import type { MdvDividerOrientation, MdvDividerVariant } from '@mdv-ui/mdv'
```

MDV does not export a separate `MdvDividerProps` type.
