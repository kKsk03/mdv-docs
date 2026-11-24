<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CarouselBasicDemo from '@/components/docs/demos/carousel/basic.vue'
import CarouselVariantDemo from '@/components/docs/demos/carousel/variant.vue'
import CarouselFullScreenDemo from '@/components/docs/demos/carousel/fullScreen.vue'
import CarouselContentDemo from '@/components/docs/demos/carousel/content.vue'
import CarouselItemsDemo from '@/components/docs/demos/carousel/items.vue'

const carouselProps: ApiTableItem[] = [
  { name: 'items', type: 'readonly T[]', description: 'Required item array. T extends object; every item needs a valid, unique stable key.' },
  { name: 'modelValue', attribute: 'v-model', type: 'MdvCarouselKey | null', description: 'Browsing anchor key. Omitted uses internal state initially pointing at the first item; null explicitly represents no anchor.' },
  { name: 'itemKey', type: 'keyof T | ((item: T) => MdvCarouselKey)', default: "'key'", description: 'Key field or resolver. Missing, duplicate, nonfinite, or otherwise invalid keys throw TypeError; indexes are not used as a fallback.' },
  { name: 'variant', type: "'multi-browse' | 'uncontained' | 'hero' | 'full-screen'", default: "'multi-browse'", description: 'Horizontal browsing layouts or vertical full-screen layout.' },
  { name: 'alignment', type: "'start' | 'center'", default: 'hero: center; others: start', description: 'Alignment of the horizontal layout. Narrow containers and small item counts may adjust keyline placement.' },
  { name: 'itemSize', type: 'number', default: '186; hero: available width', description: 'Preferred large-item width in multi-browse/hero; fixed base width in uncontained. Layout responds to available space.' },
  { name: 'height', type: 'number | string', default: '205px; full-screen: container height', description: 'Viewport height, using pixels for numbers or a CSS length. Full-screen needs a host with a defined height.' },
  { name: 'gap', type: 'number', default: '8; full-screen: 16', description: 'Nonnegative gap between items, in pixels.' },
  { name: 'flingBehavior', type: "'auto' | 'single-advance' | 'multi-browse' | 'no-snap'", default: "'auto'", description: 'Settling behavior for dragging/wheel. Auto uses no-snap for uncontained, otherwise single-advance. Free scrolling is only available in uncontained; full-screen always uses single-advance.' },
  { name: 'userScrollEnabled', type: 'boolean', default: 'true', description: 'Enables dragging and wheel input. Keyboard, item activation, external controls, and programmatic navigation remain available when false.' },
  { name: 'showControls', type: 'boolean', default: 'horizontal: true; full-screen: false', description: 'Shows the control region below the viewport. Must be true to render a custom controls slot.' },
  { name: 'labels', type: 'Partial<MdvCarouselLabels>', description: 'Optional copy for carousel, slide, previous, next, skip, empty, and item(index, count). Each entry is supplied by the application.' },
]
const carouselSlots: SlotTableItem[] = [
  { name: 'item', description: 'Custom item content, receiving { item, index, active }. Owns its native controls, names, disabling, and business actions.' },
  { name: 'header', description: 'Content above the viewport. Receives the shared controls slot props.' },
  { name: 'controls', description: 'Replaces the default previous/position/next controls below the viewport. Receives the shared controls slot props; needs showControls=true.' },
  { name: 'empty', description: 'Replaces the empty-state content and receives { text?: string } sourced from labels.empty. The empty-state container remains when items is empty.' },
]
</script>
# Carousel

Use `MdvCarousel` to browse a collection of images or related content.

## Basic usage

Give each item a unique, stable `key` and bind the active key with `v-model`. Name the region with `aria-label`. Supply `labels.previous`, `labels.next`, and `labels.skip` to show the matching controls. A `controls` slot can provide custom navigation.

<DemoBlock>
  <CarouselBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCarousel } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const current = ref<MdvCarouselKey | null>('lake')
const message = ref('Choose a destination or use the controls.')
const items: MdvCarouselItem[] = [
  { key: 'lake', label: 'Lake', alt: 'Green hills beside a lake', colors: ['#c5dfce', '#396452'] },
  { key: 'coast', label: 'Coast', alt: 'Blue hills beside the coast', colors: ['#c8e4ef', '#426b91'] },
  { key: 'desert', label: 'Desert', alt: 'Warm dunes under the sun', colors: ['#f0d4bb', '#a65e45'] },
  { key: 'alpine', label: 'Alpine', alt: 'Violet mountains at sunrise', colors: ['#ded6ee', '#787094'] },
].map(({ colors, ...item }) => ({
  ...item,
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><path fill="${colors[0]}" d="M0 0h600v400H0z"/><circle cx="450" cy="90" r="45" fill="#fff0b6"/><path d="M0 340 180 100 380 340 500 180 600 320V400H0Z" fill="${colors[1]}"/></svg>`)}`,
}))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No destinations.',
  item: (index, count) => `Slide ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCarousel
      v-model="current"
      :items="items"
      :labels="labels"
      aria-label="Travel destinations"
      @item-click="message = `Opened ${$event.item.label}.`"
    />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Dynamic items and empty state

Removing and restoring items keeps the browsing key attached to the same item. The optional empty label is passed to the slot, while the empty-state container stays mounted.

<DemoBlock>
  <CarouselItemsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCarousel } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const initial: MdvCarouselItem[] = [
  { key: 'design', label: 'Design' },
  { key: 'research', label: 'Research' },
  { key: 'drafts', label: 'Drafts', disabled: true },
  { key: 'archive', label: 'Archive' },
]
const items = ref([...initial])
const current = ref<MdvCarouselKey | null>('design')
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No collections left. Restore them to continue.',
  item: (index, count) => `Collection ${index + 1} of ${count}`,
}

function rotate() {
  if (items.value.length) items.value = [...items.value.slice(1), items.value[0]!]
}

function reset() {
  items.value = [...initial]
  current.value = 'design'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCarousel v-model="current" :items="items" :labels="labels" :height="150" aria-label="Dynamic collections">
      <template #empty="{ text }"><p>{{ text }}</p></template>
    </MdvCarousel>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="!items.length" @click="rotate">Move first to end</MdvButton>
      <MdvButton variant="outlined" :disabled="current === null" @click="items = items.filter(item => item.key !== current)">Remove current</MdvButton>
      <MdvButton variant="text" :disabled="!items.length" @click="items = []">Clear</MdvButton>
      <MdvButton variant="text" @click="reset">Restore</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current ?? '(none)' }} · {{ items.length }} collections</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Horizontal layouts

Use Multi-browse for prominent items alongside previews, Hero for a large featured item, or Uncontained for cards of different widths.

<DemoBlock>
  <CarouselVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCarousel, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselLabels, MdvCarouselVariant } from '@mdv-ui/mdv'

const snap = ref(false)
const variants: MdvCarouselVariant[] = ['multi-browse', 'uncontained', 'hero']
const items: MdvCarouselItem[] = ['#54745c', '#527f9e', '#b07854', '#827096', '#507e7a'].map((color, index) => ({
  key: index,
  label: `Journey ${index + 1}`,
  alt: `Abstract landscape ${index + 1}`,
  aspectRatio: [16 / 9, 3 / 4, 1, 9 / 16, 4 / 3][index],
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><path fill="${color}" d="M0 0h600v400H0z"/><circle cx="430" cy="100" r="48" fill="#fff0c6"/><path d="M0 350 200 150 370 320 500 210 600 340V400H0Z" fill="#fff" opacity=".25"/></svg>`)}`,
}))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No journeys.',
  item: (index, count) => `Slide ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-6">
    <MdvCheckbox v-model="snap" label="Snap uncontained items" />
    <div v-for="variant in variants" :key="variant" class="grid min-w-0 gap-2">
      <p class="font-medium">{{ variant }}</p>
      <MdvCarousel
        :items="items"
        :variant="variant"
        :height="180"
        :fling-behavior="variant === 'uncontained' && snap ? 'single-advance' : 'auto'"
        :labels="labels"
        :aria-label="`${variant} journeys`"
      />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Vertical carousel

Set `variant="full-screen"` for vertical browsing. Give the parent a definite height and include controls so navigation does not require a swipe.

<DemoBlock>
  <CarouselFullScreenDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCarousel } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const current = ref<MdvCarouselKey | null>('morning')
const items: MdvCarouselItem[] = [
  { key: 'morning', label: 'Morning', color: '#557867' },
  { key: 'afternoon', label: 'Afternoon', color: '#9b7057' },
  { key: 'evening', label: 'Evening', color: '#655d85' },
].map(({ color, ...item }) => ({
  ...item,
  alt: `${item.label} sky above layered hills`,
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><path fill="${color}" d="M0 0h400v600H0z"/><circle cx="290" cy="150" r="45" fill="#ffefba"/><path d="M0 460 150 300 320 470 400 350V600H0Z" fill="#fff" opacity=".25"/></svg>`)}`,
}))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No scenes.',
  item: (index, count) => `Scene ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-4">
    <div class="h-[400px]">
      <MdvCarousel v-model="current" :items="items" variant="full-screen" :labels="labels" show-controls aria-label="A day outdoors" />
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Scene: {{ current }}. Use Up/Down or the controls to browse vertically.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Custom content and controls

Use the `item` slot for richer content. It receives the item, index, and active state. Keep interactive controls accessible without a drag gesture.

<DemoBlock>
  <CarouselContentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { MdvButton, MdvCarousel, MdvTextField } from '@mdv-ui/mdv'
import type { MdvCarouselLabels } from '@mdv-ui/mdv'

const items = [
  { id: 'weekend', title: 'Weekend plans' },
  { id: 'reading', title: 'Reading list' },
  { id: 'ideas', title: 'New ideas' },
]
const notes = reactive<Record<string, string>>({ weekend: 'Visit the park', reading: '', ideas: '' })
const result = ref('Notes stay mounted while you browse.')
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No notebooks.',
  item: (index, count) => `Notebook ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCarousel :items="items" item-key="id" variant="uncontained" :item-size="280" :height="240" :labels="labels" aria-label="Personal notebooks">
      <template #header="{ index, count }">
        <p class="font-medium">Notebook {{ index + 1 }} of {{ count }}</p>
      </template>
      <template #item="{ item }">
        <div class="grid h-full content-start gap-4 bg-mdv-tertiary-container p-5 text-mdv-on-tertiary-container">
          <p class="font-medium">{{ item.title }}</p>
          <div data-mdv-carousel-no-drag>
            <MdvTextField v-model="notes[item.id]" :label="`${item.title} note`" full-width />
          </div>
          <MdvButton variant="tonal" @click="result = `Saved ${item.title}: ${notes[item.id] || '(empty)'}`">Save note</MdvButton>
        </div>
      </template>
      <template #controls="{ previous, next, canPrevious, canNext }">
        <MdvButton variant="text" :disabled="!canPrevious" @click="previous()">Previous notebook</MdvButton>
        <MdvButton variant="text" :disabled="!canNext" @click="next()">Next notebook</MdvButton>
      </template>
    </MdvCarousel>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### Props

<ApiTable :items="carouselProps" />

### Default item fields

These are `MdvCarouselItem` object fields inside `items`, not separate component props. Custom data can use another shape with `item-key` and `#item`.

<DocsTable label="Carousel item fields" min-width="34rem">

| Field | Type | Description |
| --- | --- | --- |
| `key` | `string \| number` | Stable unique key for the default `itemKey` field. Numbers must be finite. |
| `src` | `string` | Optional image URL for the default renderer. |
| `alt` | `string` | Meaningful image text alternative, or an empty string for decorative images. |
| `label` | `string` | Optional visible overlay text and primary accessible name. When omitted, the item name uses `alt` or caller-supplied `labels.item(index, count)`; no position label is generated. |
| `href` | `string` | Makes the default action a native link; otherwise it is a `type="button"` button. |
| `target` | `string` | Native link target. `_blank` receives a safe default `rel` when omitted. |
| `rel` | `string` | Explicit native link relationship. |
| `disabled` | `boolean` | Disables default activation/navigation while keeping the item browsable. Custom controls handle their own disabling. |
| `aspectRatio` | `number` | Uncontained width/height ratio, constrained to 9:16–16:9. Omit to use the shared width; other variants ignore it. |

</DocsTable>

### Slots

<SlotsTable :items="carouselSlots" />

### Events

<DocsTable label="Carousel events" min-width="38rem">

| Event | Payload | Meaning |
| --- | --- | --- |
| `update:modelValue` | `MdvCarouselKey \| null` | Requests a browsing anchor after navigation or item changes. Not emitted for every drag frame. |
| `change` | `{ key, index, item, reason }` | An anchor change was accepted. Empty lists report index `-1` and item `undefined`. |
| `itemClick` (`@item-click`) | `{ key, index, item, originalEvent }` | Default item activation; custom slot actions are managed by the application. |

</DocsTable>

`reason` is `'drag' | 'wheel' | 'keyboard' | 'control' | 'item' | 'programmatic' | 'items'`. Event indexes are zero-based. `change` reports accepted anchor changes rather than animation completion; there are no `opened`/`closed` events.

### Methods and native attributes

<DocsTable label="Carousel exposed methods" min-width="32rem">

| Member | Result | Meaning |
| --- | --- | --- |
| `scrollTo(key, options?)` | `Promise<boolean>` | Requests the item with that key. |
| `next(options?)` / `prev(options?)` | `Promise<boolean>` | Requests the neighboring item. Does not wrap at the ends. |
| `focus(options?: FocusOptions)` | `void` | Reveals and focuses the current item or the first item when no anchor exists. |
| `element` | `HTMLElement \| null` | Outer region element. |

</DocsTable>

Navigation options are `{ animate?: boolean, focus?: boolean }`. Ordinary `id`, `class`, `style`, `dir`, ARIA, and native listeners apply to the outer section. Put custom item-control attributes on the controls themselves. The component does not generate form fields.

### Public types

```ts
import type {
  MdvCarouselKey,
  MdvCarouselVariant,
  MdvCarouselAlignment,
  MdvCarouselFlingBehavior,
  MdvCarouselChangeReason,
  MdvCarouselItem,
  MdvCarouselLabels,
  MdvCarouselProps,
  MdvCarouselNavigateOptions,
  MdvCarouselChangeDetail,
  MdvCarouselControlsSlotProps,
  MdvCarouselItemSlotProps,
  MdvCarouselSlots,
  MdvCarouselExpose,
} from '@mdv-ui/mdv'
```
