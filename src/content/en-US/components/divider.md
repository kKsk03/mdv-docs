<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import DividerBasicDemo from '@/components/docs/demos/divider/basic.vue'
import DividerVerticalDemo from '@/components/docs/demos/divider/vertical.vue'

const dividerProps: ApiTableItem[] = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the line. A vertical divider stretches across its flex or grid cross-axis unless given an explicit height.' },
  { name: 'variant', type: "'full-width' | 'inset' | 'middle-inset'", default: "'full-width'", description: 'No inset, a 16px start inset, or 16px at both ends. Vertical lines map these insets to the top and bottom.' },
  { name: 'decorative', type: 'boolean', default: 'true', description: 'Hides the line from assistive technology. Set false to expose a separator with its orientation.' },
]
</script>
# Divider

Use `MdvDivider` to separate groups of content or controls.

## Horizontal dividers

A horizontal divider fills the available width. Use `inset` at the logical start or `middle-inset` at both ends.

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

Set `orientation="vertical"` between adjacent items. Give the line or its layout a height.

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

## Separator semantics

A divider is decorative by default. Set `:decorative="false"` to expose it as a semantic separator.

## Line styles

Use these CSS variables to customize the line. Insets follow the text direction.

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

---

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
