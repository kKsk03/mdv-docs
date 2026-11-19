<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CarouselBasicDemo from '@/components/docs/demos/carousel/basic.vue'
import CarouselVariantDemo from '@/components/docs/demos/carousel/variant.vue'
import CarouselFullScreenDemo from '@/components/docs/demos/carousel/fullScreen.vue'
import CarouselControlledDemo from '@/components/docs/demos/carousel/controlled.vue'
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
  { name: 'labels', type: 'Partial<MdvCarouselLabels>', default: 'Chinese labels', description: 'Overrides carousel, slide, previous, next, skip, empty, and item(index, count). Configure all needed labels for the application locale.' },
]
const carouselSlots: SlotTableItem[] = [
  { name: 'item', description: 'Custom item content, receiving { item, index, active }. Owns its native controls, names, disabling, and business actions.' },
  { name: 'header', description: 'Content above the viewport. Receives the shared controls slot props.' },
  { name: 'controls', description: 'Replaces the default previous/position/next controls below the viewport. Receives the shared controls slot props; needs showControls=true.' },
  { name: 'empty', description: 'Content shown for an empty items array. No slot parameters.' },
]
</script>

# Carousel

`MdvCarousel` presents a browsable collection with responsive item masks and media. It supports horizontal multi-browse, uncontained, and hero layouts, plus a vertical full-screen layout. Browsing is controlled by stable item keys.

## Basic usage

Supply `items` with unique `key` values and bind the current browsing anchor with `v-model`. The example uses self-contained SVG illustrations, default image items, and English interface labels.

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

The model is a browsing position, not a form selection or a DOM focus value. Default item activation emits `item-click`; the application owns the actual business action. A default item with `href` is a native link, while an item without it is a native button. Synchronously call `originalEvent.preventDefault()` in `item-click` to cancel link navigation and automatic item positioning.

### Stable keys

Keys must be unique strings or finite numbers. The default field is `key`; for another data shape, set `item-key="id"` or pass a resolver such as `:item-key="item => item.id"`. Missing or duplicate keys throw an error instead of silently using array indexes. String and numeric keys remain distinct.

---

## Horizontal layouts

Multi-browse emphasizes larger items alongside smaller previews. Hero emphasizes a large centered item by default. Uncontained uses a common media height and permits items to pass through the viewport edges; `aspectRatio` can vary their widths.

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

<DocsTable label="Carousel layout defaults" min-width="32rem">

| Variant | Default alignment | Default gesture settling |
| --- | --- | --- |
| `multi-browse` | `start` | `single-advance` |
| `uncontained` | `start` | `no-snap` |
| `hero` | `center` | `single-advance` |
| `full-screen` | Vertical pages | Always `single-advance` |

</DocsTable>

### Sizing and gestures

`item-size` is a preferred large width for multi-browse/hero and the base width for uncontained. It defaults to 186px; Hero fills the available width when it is omitted. Ordinary viewport height defaults to 205px, with an 8px gap. These are MDV defaults, not fixed Material requirements. Narrow containers and small collections adapt their item arrangement automatically.

Use `alignment="start"` or `"center"` to choose a horizontal alignment. `fling-behavior="single-advance"` limits a fast fling to one neighboring anchor; slow long drags still follow distance. `multi-browse` permits traveling farther. `no-snap` is available only for uncontained; accepted free-scroll positions stay unsnapped.

Mouse/touch dragging, horizontal trackpad input, and Shift+wheel can browse horizontal layouts. Ordinary vertical wheel movement stays available for page scrolling. Keep an alternative to horizontal gestures: the default controls are below the media, and custom controls belong there as well.

## Vertical full-screen layout

`variant="full-screen"` fills an explicitly sized host and browses vertically one page at a time. This example enables controls so it also works without a swipe or wheel gesture.

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

Full-screen means an immersive region within the host. It does not invoke the browser Fullscreen API, create an overlay, or lock the surrounding page. Its default gap is 16px, outer corners are square, and controls are hidden unless enabled. Use another layout when the application changes to an unsuitable landscape presentation.

There is no autoplay, infinite loop, video playback manager, or automatic data loading. The application owns those behaviors and should not assume they are provided.

---

## Controlled navigation

In controlled mode, the parent decides whether to accept each requested key. Try Next while requests are rejected, then unlock navigation. Disabling dragging/wheel does not disable the remaining navigation methods.

<DemoBlock>
  <CarouselControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCarousel, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCarouselExpose, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const carousel = useTemplateRef<MdvCarouselExpose>('carousel')
const current = ref<MdvCarouselKey | null>('first')
const locked = ref(true)
const gestures = ref(true)
const result = ref('Unlock navigation to accept a different key.')
const items = ['first', 'second', 'third', 'fourth'].map((key, index) => ({ key, label: `Chapter ${index + 1}` }))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No chapters.',
  item: (index, count) => `Chapter ${index + 1} of ${count}`,
}

function update(key: MdvCarouselKey | null) {
  result.value = `Requested ${key}: ${locked.value ? 'rejected' : 'accepted'}.`
  if (!locked.value) current.value = key
}

async function jump() {
  const accepted = await carousel.value?.scrollTo('fourth', { animate: false, focus: true })
  result.value = accepted ? 'Jump accepted and the chapter was focused.' : 'Jump rejected; the accepted chapter is unchanged.'
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="locked" label="Reject navigation requests" />
      <MdvCheckbox v-model="gestures" label="Enable dragging and wheel" />
    </div>
    <MdvCarousel ref="carousel" :model-value="current" :items="items" :labels="labels" :height="140" :user-scroll-enabled="gestures" aria-label="Controlled chapters" @update:model-value="update" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="jump">Jump to chapter 4</MdvButton>
      <MdvButton variant="outlined" @click="carousel?.focus()">Focus current chapter</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · {{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

A rejected request returns to the accepted anchor without emitting a successful `change`. Programmatic methods return `Promise<boolean>` reporting acceptance; they do not wait for motion to finish. `{ focus: true }` reveals and focuses the target immediately so focus is not left in a clipped item.

`null` explicitly represents no anchor. An invalid controlled key does not create a replacement active value. Direct parent model changes do not emit another update request.

## Custom content and controls

The item slot receives the original item, its zero-based index, and whether its key is active. Uncontained is useful for richer content with text and independent controls. The header and controls remain outside the masked items.

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

Custom slots own their actions, accessible names, links, and disabled states. Inputs and media keep their own editing/playback gestures. `data-mdv-carousel-no-drag` reserves a custom area's dragging, wheel, and arrow-key behavior for that area. Item state is retained across geometry updates and browsing; the carousel does not manage or reset business input values.

`header` and `controls` receive `{ key, index, count, canPrevious, canNext, previous, next }`. `previous()` and `next()` request control navigation and return `Promise<boolean>`. Bind their availability flags to actual disabled controls. Set `show-controls` when using a controls slot with full-screen.

## Changing the collection

Stable keys preserve item identity when reordering. Removing the active item requests a nearby key; clearing the collection requests `null`. A disabled default item remains part of the browsable collection but cannot activate its action.

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
  skip: 'Skip carousel', empty: 'No collections.',
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
      <template #empty><p>No collections left. Restore them to continue.</p></template>
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

Accept the requested model when removing items in a controlled collection. If the parent rejects the replacement, the carousel does not invent an active item. Use `#empty` to provide application-specific recovery actions or guidance.

---

## Accessibility, themes, and motion

- Name the region with `aria-label` or `aria-labelledby`. The `labels` object localizes slide descriptions, controls, skip link, empty state, and zero-based `item(index, count)` formatting; defaults are Chinese.
- Arrow keys and Home/End browse while focus is in an item; horizontal arrows mirror in RTL, and full-screen uses Up/Down. This navigation updates the browsing anchor and focus. Inputs retain their editing keys.
- Tab moves through native controls. Leaving one item's final control reveals the next item; leaving the final item exits normally. Offscreen items leave the Tab order and accessibility tree; navigation reveals targets before focusing them.
- A keyboard-visible skip link moves past the carousel. Mounting and resizing do not intentionally steal focus.
- Reduced motion removes parallax and dynamic width expansion, using stable item sizes; full-screen retains page positioning. Local themes and forced colors follow MDV tokens.

The component supports `--mdv-carousel-radius`, `--mdv-carousel-background`, and `--mdv-carousel-foreground` overrides. Item content can read `--mdv-carousel-mask-start`, `--mdv-carousel-mask-size`, and `--mdv-carousel-label-opacity` for mask-aware presentation without rerendering every animation frame. Avoid recreating the library's mask geometry in documentation CSS.

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
| `label` | `string` | Visible overlay text and primary accessible name. Falls back to `alt` or the localized item position. |
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
