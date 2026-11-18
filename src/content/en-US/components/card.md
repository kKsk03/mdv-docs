<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CardVariantDemo from '@/components/docs/demos/card/variant.vue'
import CardContentDemo from '@/components/docs/demos/card/content.vue'
import CardHeaderDemo from '@/components/docs/demos/card/header.vue'
import CardInteractiveDemo from '@/components/docs/demos/card/interactive.vue'
import CardDraggedDemo from '@/components/docs/demos/card/dragged.vue'

const cardProps: ApiTableItem[] = [
  { name: 'variant', type: "'outlined' | 'filled' | 'elevated'", default: "'outlined'", description: 'Card surface, outline, and elevation appearance.' },
  { name: 'title', type: 'string', default: "''", description: 'Default title, rendered as a paragraph. Automatically labels a whole-card action when the default header is used.' },
  { name: 'subtitle', type: 'string', default: "''", description: 'Supporting text below the default title.' },
  { name: 'clickable', type: 'boolean', default: 'false', description: 'Enables a native button primary action covering the card. A click listener by itself does not enable this behavior.' },
  { name: 'href', type: 'string', description: 'Enables a native link primary action and takes precedence over clickable. An empty string also enables link mode.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the whole-card primary action only. Does not disable independent controls in a static card.' },
  { name: 'dragged', type: 'boolean', default: 'false', description: 'Externally controlled dragged appearance. Does not implement dragging, sorting, or the native draggable attribute.' },
]
const cardSlots: SlotTableItem[] = [
  { name: 'header', description: 'Custom header, replacing title/subtitle. An actionable card with a custom header needs an explicit accessible name.' },
  { name: 'media', description: 'Image, video, or other media. Supply dimensions and an appropriate text alternative. Media at the card edge follows its corners.' },
  { name: 'default', description: 'Body content. Independent interactive content is supported in static cards.' },
  { name: 'actions', description: 'Bottom actions, aligned to the logical end by default. Use a static card when adding buttons or links here.' },
]
</script>

# Card

`MdvCard` groups related content and actions in one surface. Choose a static card for independent actions, or enable one whole-card button/link for a single primary action.

## Variants

Cards support `outlined` (default), `filled`, and `elevated` variants. They use MDV surface roles, 12px default corners, 16px content padding, and natural content height. Their colors and elevation follow the current light, dark, local, or dynamic theme.

<DemoBlock>
  <CardVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvCard } from '@mdv-ui/mdv'
import type { MdvCardVariant } from '@mdv-ui/mdv'

const variants: MdvCardVariant[] = ['outlined', 'filled', 'elevated']
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-3">
    <MdvCard v-for="variant in variants" :key="variant" :variant="variant" :title="variant.charAt(0).toUpperCase() + variant.slice(1)" subtitle="Collection">
      <p class="text-sm">Keep related information together in one surface.</p>
    </MdvCard>
  </div>
</template>
```

  </template>
</DemoBlock>

The component does not set a fixed width or force equal heights. Use the surrounding grid, flex layout, or a `class` on the card to define the page layout.

---

## Content and independent actions

Compose `title`, `subtitle`, `#media`, body content, and `#actions` on a static card. The buttons below act independently; clicking the surrounding surface does nothing.

<DemoBlock>
  <CardContentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCard } from '@mdv-ui/mdv'

const saved = ref(false)
const message = ref('Discover a quiet place along the water.')
</script>

<template>
  <MdvCard class="max-w-md" variant="filled" title="A day by the river" subtitle="Travel journal · 5 min read">
    <template #media>
      <svg viewBox="0 0 480 200" class="w-full bg-mdv-secondary-container text-mdv-secondary" role="img" aria-label="Abstract hills and a river">
        <circle cx="360" cy="50" r="26" fill="currentColor" opacity=".35" />
        <path d="M0 155 100 65 220 145 330 90 480 160V200H0Z" fill="currentColor" opacity=".3" />
        <path d="M0 185Q120 115 240 175T480 155V200H0Z" fill="currentColor" opacity=".6" />
      </svg>
    </template>
    <p class="text-sm" role="status">{{ message }}</p>
    <template #actions>
      <MdvButton variant="text" @click="message = 'The riverside walk is 4 km long and open all year.'">Details</MdvButton>
      <MdvButton variant="tonal" @click="saved = !saved">{{ saved ? 'Saved' : 'Save article' }}</MdvButton>
    </template>
  </MdvCard>
</template>
```

  </template>
</DemoBlock>

Slots render in this order: **header → media → body → actions**. Empty sections are omitted. Images/videos need application-defined dimensions, crop behavior, loading strategy, and accessible alternatives. The self-contained illustration above avoids an external network dependency.

### Custom header

Use `#header` for an avatar, icon, or richer text. It replaces both `title` and `subtitle`. All card slots are ordinary slots without parameters.

<DemoBlock>
  <CardHeaderDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCard, MdvIcon } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const count = ref(12)
</script>

<template>
  <MdvCard class="max-w-md">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="grid size-10 shrink-0 place-items-center rounded-full bg-mdv-tertiary-container text-mdv-on-tertiary-container">
          <MdvIcon :icon="folderIcon" />
        </span>
        <div>
          <p class="font-medium">Design resources</p>
          <p class="text-sm text-mdv-on-surface-variant">Shared workspace</p>
        </div>
      </div>
    </template>
    <p class="text-sm" role="status">{{ count }} resources in this collection.</p>
    <template #actions>
      <MdvButton variant="text" @click="count++">Add resource</MdvButton>
    </template>
  </MdvCard>
</template>
```

  </template>
</DemoBlock>

The default title is a `<p>`, not an automatic document heading. In a custom header, choose a heading level that fits your page. For a whole-card action with a custom header, add `aria-label` or `aria-labelledby` explicitly.

---

## Whole-card actions and links

Set `clickable` for a card with one button action; set `href` for a native link. `href` takes precedence when both are present. The default title supplies the accessible name. Toggle disabling and try keyboard activation on the first card.

<DemoBlock>
  <CardInteractiveDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCard, MdvCheckbox } from '@mdv-ui/mdv'

const disabled = ref(false)
const opened = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disabled" label="Disable card actions" />
    <div class="grid gap-5 sm:grid-cols-2">
      <MdvCard clickable :disabled="disabled" title="Open collection" subtitle="Whole-card button" @click="opened++">
        <p class="text-sm">Click anywhere on the card, or focus it and press Enter or Space.</p>
      </MdvCard>
      <MdvCard href="https://m3.material.io/components/cards/overview" target="_blank" rel="noreferrer" :disabled="disabled" title="Card design guidance" subtitle="Opens in a new tab">
        <p class="text-sm">A native link supports browser navigation and opening in a new tab.</p>
      </MdvCard>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Collection opened {{ opened }} times.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

A whole-card action is a native button/link positioned over the content as its sibling, preserving the surface's content structure. Its button type is always `button`, so placing the card in a form does not accidentally submit it. A link retains browser behavior such as Enter, opening in a new tab, and copying its address.

Do not put other buttons, links, inputs, or focusable controls inside an actionable card. Use a static card with independent actions instead. Development builds warn about conflicting interactive content and missing accessible names.

Attaching `@click` alone to a static card does not add button semantics, keyboard activation, or focus behavior. Enable `clickable` when the whole surface represents an action.

### Disabled and dragged appearance

`disabled` applies only to the primary whole-card action. It does not propagate to controls in a static card. `dragged` is a visual state for an application's drag implementation; toggling it does not make the card draggable.

<DemoBlock>
  <CardDraggedDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCard, MdvCheckbox } from '@mdv-ui/mdv'

const dragged = ref(false)
const disabled = ref(false)
const clicks = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="dragged" label="Show dragged appearance" />
      <MdvCheckbox v-model="disabled" label="Set card disabled" />
    </div>
    <MdvCard class="max-w-md" :dragged="dragged" :disabled="disabled" title="Static card with an action">
      <p class="text-sm">Dragged changes only the visual state. Disabled does not disable controls inside a static card.</p>
      <template #actions>
        <MdvButton variant="tonal" @click="clicks++">Independent action ({{ clicks }})</MdvButton>
      </template>
    </MdvCard>
  </div>
</template>
```

  </template>
</DemoBlock>

Disabled button cards use native disabling. Disabled link cards remove `href`, expose `aria-disabled="true"`, leave the Tab order, and block activation. To disable individual controls on a static card, set those controls' own `disabled` props.

---

## Accessibility and layout

- Choose the card's interaction model first. Static containers may contain independent controls; whole-card actions must have one action and one accessible name.
- A default `title` labels the primary action automatically. Custom headers, media-only cards, and title-free actions need explicit `aria-label` or `aria-labelledby`.
- Native buttons support Enter/Space; native links support Enter. Focus outlines, hover/pressed state layers, disabling, and reduced-motion preferences are handled by MDV.
- Use descriptive alt text for meaningful images and empty alt text for decorative images. Card text does not automatically become an image description.
- Keep card width responsive and let body text wrap. Media and long unbroken content still need a layout suitable for their container. There is no built-in selected, loading, error, or reorder model.

## API

### Props

<ApiTable :items="cardProps" />

### Slots

<SlotsTable :items="cardSlots" />

### Events and methods

There are no additional component events or models. Listen to native `click`, pointer, and keyboard events. For an interactive card, action listeners are forwarded to the primary button/link; for a static card they belong to the outer container.

<DocsTable label="Card exposed methods">

| Method | Result | Meaning |
| --- | --- | --- |
| `focus(options?: FocusOptions)` | `void` | Focuses the enabled primary action. Does nothing for a static or disabled card. |
| `blur()` | `void` | Removes focus when its primary action is focused. |

</DocsTable>

### Native attributes and types

For static cards, native attributes are forwarded to the outer `<div>`. For actionable cards, `id`, `class`, `style`, `dir`, `lang`, `hidden`, `inert`, and `data-*` stay on the outer container; ARIA, native action events, and applicable link attributes such as `target`, `rel`, and `download` apply to the primary control. A supplied `type` does not change the fixed button type.

```ts
import type { MdvCardVariant } from '@mdv-ui/mdv'
```

`MdvCardVariant` is `'outlined' | 'filled' | 'elevated'`. The current package does not export a separate `MdvCardProps` interface.
