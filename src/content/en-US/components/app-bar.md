<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import AppBarBasicDemo from '@/components/docs/demos/appBar/basic.vue'
import AppBarVariantDemo from '@/components/docs/demos/appBar/variant.vue'
import AppBarAppearanceDemo from '@/components/docs/demos/appBar/appearance.vue'
import AppBarAlignmentDemo from '@/components/docs/demos/appBar/alignment.vue'
import AppBarImageDemo from '@/components/docs/demos/appBar/image.vue'
import AppBarScrollDemo from '@/components/docs/demos/appBar/scroll.vue'

const appBarProps: ApiTableItem[] = [
  { name: 'variant', type: "'small' | 'medium' | 'large'", default: "'small'", description: 'App Bar size. Medium and large are the collapsible Flexible variants.' },
  { name: 'appearance', type: "'default' | 'elevated' | 'bordered'", default: "'default'", description: 'Default has no shadow or border; elevated gradually adds a shadow on scroll; bordered adds a bottom divider.' },
  { name: 'title', type: 'string', description: 'Default title, replaceable through the title slot.' },
  { name: 'subtitle', type: 'string', description: 'Default subtitle, replaceable through the subtitle slot.' },
  { name: 'collapsedTitle', type: 'string', description: 'Short title for Small or the collapsed state. Applies to the default title only; the full title remains its accessible name.' },
  { name: 'titleAlignment', type: "'start' | 'center'", default: "'start'", description: 'Aligns the title to the start or the center of the entire bar, reserving space for asymmetric actions.' },
  { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: 'Native heading level. Embedded examples should choose a suitable lower level.' },
  { name: 'scrollBehavior', type: 'MdvAppBarScrollBehavior', default: "'none'", description: 'One of none, pinned, exit-until-collapsed, or enter-always. Controls pinning, collapse, and hiding.' },
  { name: 'scrollTarget', type: 'MdvAppBarScrollTarget', description: 'Window, HTMLElement, selector, or target getter. Defaults to the containing Scaffold content, otherwise Window. An unresolved explicit target has no fallback.' },
  { name: 'scrolled', type: 'boolean', description: 'Automatic when omitted. Explicit false/true fixes the starting/ending color and optional shadow, without changing collapse, hiding, or scroll position.' },
  { name: 'transparentOnScroll', type: 'boolean', default: 'false', description: 'Gradually makes the surface and optional shadow transparent on scroll. A bordered bottom divider remains visible.' },
]
const appBarSlots: SlotTableItem[] = [
  { name: 'leading', description: 'Start-side actions such as a back or navigation icon button. Receives { scrolled, collapsed }.' },
  { name: 'title', description: 'Replaces the title. Receives { scrolled, collapsed } for content that responds to collapse.' },
  { name: 'subtitle', description: 'Replaces the subtitle. Receives { scrolled, collapsed }.' },
  { name: 'actions', description: 'End-side content such as icon buttons, text buttons, or menus. Receives { scrolled, collapsed }.' },
  { name: 'image', description: 'Brand image above the medium/large title. Receives { scrolled, collapsed }; not shown in Small.' },
]
const scaffoldProps: ApiTableItem[] = [
  { name: 'contentAttrs', type: 'HTMLAttributes', description: 'Native attributes and events for the content scroll element, such as aria-label, id, tabindex, and onScroll. Defaults to role region, aria-label 正文, and tabindex 0; these can be overridden.' },
]
const scaffoldSlots: SlotTableItem[] = [
  { name: 'appbar', description: 'One MdvAppBar, optionally through a wrapper component. Automatically follows this Scaffold content scroll area.' },
  { name: 'default', description: 'Content. Does not automatically add a main landmark or content padding.' },
]
</script>

# App Bar

App Bars display a page title, navigation entry, and common actions. `MdvAppBar` provides Small, Medium flexible, and Large flexible layouts. Pair it with `MdvAppBarScaffold` for a separate scrolling content area.

## Basic usage

Set `title` and compose actions through the `leading` and `actions` slots. Supply navigation buttons and their routing or click handlers in your application.

<DemoBlock>
  <AppBarBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvAppBar, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import menu from '@iconify-icons/material-symbols/menu'
import favorite from '@iconify-icons/material-symbols/favorite-outline'

const message = ref('Choose an action.')
</script>

<template>
  <div class="grid gap-3">
    <MdvAppBar title="My library" :heading-level="3">
      <template #leading>
        <MdvIconButton variant="standard" aria-label="Open navigation" @click="message = 'Navigation requested.'">
          <MdvIcon :icon="menu" />
        </MdvIconButton>
      </template>
      <template #actions>
        <MdvIconButton variant="standard" aria-label="Show favorites" @click="message = 'Favorites requested.'">
          <MdvIcon :icon="favorite" />
        </MdvIconButton>
      </template>
    </MdvAppBar>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## Sizes

`variant` accepts `small`, `medium`, and `large`. Medium and large can collapse to Small on scroll. Small also supports a centered title through `title-alignment="center"`.

<DemoBlock>
  <AppBarVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvAppBar } from '@mdv-ui/mdv'
import type { MdvAppBarVariant } from '@mdv-ui/mdv'

const variants: MdvAppBarVariant[] = ['small', 'medium', 'large']
</script>

<template>
  <div class="grid gap-5">
    <div v-for="variant in variants" :key="variant" class="grid gap-2">
      <p class="text-sm text-mdv-on-surface-variant">{{ variant }}</p>
      <MdvAppBar :variant="variant" title="Weekend plans" subtitle="Make time for something new" :heading-level="3" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="App Bar heights">

| Size | Without subtitle | With subtitle |
| --- | --- | --- |
| Small | 64px | 64px |
| Medium flexible | 112px | 136px |
| Large flexible | 120px | 152px |

</DocsTable>

These are the default heights for a standard single-line title. Medium and large remeasure long titles, images, and fonts; keep titles within two lines where possible. Small and collapsed titles use single-line truncation. Supply a shorter `collapsed-title` when needed.

---

## Appearance

`default` has no shadow or border, `elevated` gradually shows a shadow on scroll, and `bordered` adds a bottom divider. These examples use `scrolled` to display the ending color and shadow.

<DemoBlock>
  <AppBarAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvAppBar } from '@mdv-ui/mdv'
import type { MdvAppBarAppearance } from '@mdv-ui/mdv'

const appearances: MdvAppBarAppearance[] = ['default', 'elevated', 'bordered']
</script>

<template>
  <div class="grid gap-6">
    <div v-for="appearance in appearances" :key="appearance" class="grid gap-2">
      <p class="text-sm text-mdv-on-surface-variant">{{ appearance }}</p>
      <MdvAppBar :appearance="appearance" title="My library" :scrolled="true" :heading-level="3" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

`scrolled` overrides appearance only. It does not collapse the bar or change the content scroll position. When omitted, colors follow actual scroll progress continuously.

---

## Title alignment

Use `title-alignment` for start or center alignment. Centering uses the entire bar, so a leading button alone does not offset the title.

<DemoBlock>
  <AppBarAlignmentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvAppBar, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvAppBarTitleAlignment } from '@mdv-ui/mdv'
import arrowBack from '@iconify-icons/material-symbols/arrow-back'

const alignments: MdvAppBarTitleAlignment[] = ['start', 'center']
</script>

<template>
  <div class="grid gap-5">
    <div v-for="alignment in alignments" :key="alignment" class="grid gap-2">
      <p class="text-sm text-mdv-on-surface-variant">{{ alignment }}</p>
      <MdvAppBar title="My library" :title-alignment="alignment" :heading-level="3">
        <template #leading>
          <MdvIconButton variant="standard" aria-label="Go back">
            <MdvIcon :icon="arrowBack" />
          </MdvIconButton>
        </template>
      </MdvAppBar>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

The `title` and `subtitle` slots replace their default text. Every App Bar slot receives `{ scrolled, collapsed }`: `scrolled` indicates the target has left the top, while `collapsed` indicates medium or large has reached Small.

---

## Brand image

Use the `image` slot to place branding above a medium or large title. For Small, put branding in the `title` slot and provide an appropriate accessible name.

<DemoBlock>
  <AppBarImageDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvAppBar } from '@mdv-ui/mdv'
</script>

<template>
  <MdvAppBar variant="large" title="Explore new places" subtitle="A little inspiration for your next trip" :heading-level="3">
    <template #image>
      <svg width="96" height="32" viewBox="0 0 96 32" role="img" aria-label="Explore brand">
        <path d="M16 0 32 16 16 32 0 16Z" fill="currentColor" />
        <text x="40" y="23" font-size="20" fill="currentColor">MDV</text>
      </svg>
    </template>
  </MdvAppBar>
</template>
```

  </template>
</DemoBlock>

---

## Scrolling and Scaffold

For application layouts, place the App Bar in the `appbar` slot of `MdvAppBarScaffold` and content in its default slot. The Scaffold associates the scroll target automatically and gives content its own scrollbar.

Scroll the independent area below and change `scroll-behavior`. It also demonstrates a short collapsed title, custom actions, and transparency.

<DemoBlock>
  <AppBarScrollDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const behavior = ref<MdvSelectValue | null>('exit-until-collapsed')
const transparent = ref(false)
const scaffold = useTemplateRef<InstanceType<typeof MdvAppBarScaffold>>('scaffold')
const behaviors = [
  { value: 'none', label: 'None' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'exit-until-collapsed', label: 'Exit until collapsed' },
  { value: 'enter-always', label: 'Enter always' },
]
const scrollBehaviors = ['none', 'pinned', 'exit-until-collapsed', 'enter-always'] as const
const scrollBehavior = () => scrollBehaviors.find(value => value === behavior.value) ?? 'none'

function backToTop() {
  scaffold.value?.contentElement?.scrollTo({
    top: 0,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <MdvSelect v-model="behavior" label="Scroll behavior" :options="behaviors" />
      <MdvCheckbox v-model="transparent" label="Transparent on scroll" />
      <MdvButton variant="outlined" @click="backToTop">Back to top</MdvButton>
    </div>
    <MdvAppBarScaffold
      ref="scaffold"
      class="h-80 rounded-mdv-large border border-mdv-outline-variant bg-mdv-surface-container-low"
      :content-attrs="{ 'aria-label': 'App Bar demo content' }"
    >
      <template #appbar>
        <MdvAppBar
          variant="large"
          appearance="elevated"
          title="Weekend adventures"
          collapsed-title="Adventures"
          subtitle="Scroll the content below"
          :heading-level="3"
          :scroll-behavior="scrollBehavior()"
          :transparent-on-scroll="transparent"
        >
          <template #actions="{ collapsed }">
            <MdvButton variant="text" @click="backToTop">{{ collapsed ? 'Top' : 'Back to top' }}</MdvButton>
          </template>
        </MdvAppBar>
      </template>
      <div class="grid gap-4 p-4">
        <div v-for="index in 12" :key="index" class="rounded-mdv-medium bg-mdv-surface p-4">
          <p class="font-medium">Destination {{ index }}</p>
          <p class="mt-2 text-sm text-mdv-on-surface-variant">Scroll here to explore the App Bar behavior.</p>
        </div>
      </div>
    </MdvAppBarScaffold>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="App Bar scroll behaviors">

| Behavior | Description |
| --- | --- |
| `none` | Uses ordinary document flow when standalone. Inside a Scaffold it stays above content without collapsing or hiding. |
| `pinned` | Stays visible at the top of the current scroll area. |
| `exit-until-collapsed` | Collapses medium/large to Small. Expands again only as content returns near the top. |
| `enter-always` | Collapses and then hides on downward scrolling. Returns immediately on reverse scrolling and snaps to a nearby endpoint when scrolling stops. |

</DocsTable>

### Layout requirements

Provide a definite available height, such as `h-80` in the example, or use `h-full` or `flex-1 min-h-0` inside an already sized layout. The default slot adds neither a `main` landmark nor padding; supply the semantics and spacing your page needs.

The Scaffold content background is transparent. Set `bg-mdv-surface-container-low` on the shared layout wrapper when desired; navigation and the App Bar retain their own surface colors.

For a standard drawer composition, place `MdvNavigationDrawer` immediately before the Scaffold as its sibling inside the same layout wrapper. The Scaffold extends the App Bar background behind the drawer corners. Modal drawers use a separate overlay.

Place Vue `Transition` or a router view inside the default slot to animate content changes while preserving the App Bar and content scroll element.

### Standalone scroll target

A standalone App Bar follows `window` by default. For a local scroll container, provide `scroll-target`, for example a getter returning a template ref:

```vue
<MdvAppBar
  title="My library"
  scroll-behavior="pinned"
  :scroll-target="() => scrollContainer"
/>
```

Keep the bar inside the corresponding scroll container so its sticky boundary matches the target. An unresolved explicit selector or getter has no fallback. Call `refresh()` if external code creates the target later. This prop is usually unnecessary with a Scaffold.

---

## Keyboard and accessibility

- Choose `heading-level` to match the page structure. Examples use 3 to avoid competing with the article title.
- Supply `aria-label` or `aria-labelledby` for icon buttons; the App Bar does not name them automatically.
- Tab and Shift+Tab follow native action order. Keyboard focus entering the bar restores the complete action area and keeps it visible while focus remains inside.
- Collapse reuses the original slot nodes. Reduced motion disables snap interpolation while retaining direct scroll tracking.

---

## MdvAppBar API

### Props

<ApiTable :items="appBarProps" />

### Slots

<SlotsTable :items="appBarSlots" />

### Methods and native attributes

A template ref exposes `element` (the `header`) and `refresh()` (re-resolves the target and measures layout). There are no additional component events or models. `class`, `style`, `id`, ARIA, and native listeners are forwarded to the `header`.

## MdvAppBarScaffold API

### Props

<ApiTable :items="scaffoldProps" />

### Slots

<SlotsTable :items="scaffoldSlots" />

### Exposed members

- `element`: Scaffold root, receiving native attributes such as `class`, `style`, `id`, and `dir`.
- `contentElement`: content scroll element. Use native `scrollTo()`, choosing smooth scrolling according to the reduced-motion preference.

The Scaffold has no additional component events or models. Bind content-native listeners through `content-attrs`.

## Types

```ts
import type {
  MdvAppBarProps,
  MdvAppBarVariant,
  MdvAppBarAppearance,
  MdvAppBarTitleAlignment,
  MdvAppBarScrollBehavior,
  MdvAppBarScrollTarget,
  MdvAppBarSlotProps,
  MdvAppBarScaffoldProps,
} from '@mdv-ui/mdv'
```
