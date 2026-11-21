<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CardVariantDemo from '@/components/docs/demos/card/variant.vue'
import CardContentDemo from '@/components/docs/demos/card/content.vue'
import CardInteractiveDemo from '@/components/docs/demos/card/interactive.vue'

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

Use `MdvCard` to group information and related actions about one item.

## Variants

Use `variant` to choose `outlined`, `filled`, or `elevated`.

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

## Content and independent actions

Use `title`, `subtitle`, `#media`, and the default slot for content. Put independent buttons or links in `#actions` and leave the card itself noninteractive.

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

## Whole-card actions and links

Use `clickable` for one button action or `href` for a link. Name the card action and do not place independent buttons or links inside it.

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

---

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
