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
  { name: 'contentAttrs', type: 'HTMLAttributes', description: 'Native attributes and events for the content scroll region. Its default role is region and its tabindex is 0; no accessible name is generated automatically. Use aria-label or aria-labelledby when the region needs a name.' },
]
const scaffoldSlots: SlotTableItem[] = [
  { name: 'appbar', description: 'One MdvAppBar, optionally through a wrapper component. Automatically follows this Scaffold content scroll area.' },
  { name: 'default', description: 'Content. Does not automatically add a main landmark or content padding. The scroll region has no implicit accessible name.' },
]
</script>
# App Bar

Use `MdvAppBar` for a page title, navigation control, and common actions.

## Basic usage

Set `title` and put navigation in `#leading` and other actions in `#actions`. Name any icon-only buttons.

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

## Sizes

Use `variant` to choose `small`, `medium`, or `large`. Medium and large can collapse to the small height on scroll.

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

## Appearance

Use `appearance="elevated"` for a scroll shadow or `bordered` for a divider. The `scrolled` prop changes appearance only, not layout or scroll position.

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

## Title alignment

Use `title-alignment="center"` to center the title across the whole bar.

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

## Brand image

Use `#image` for branding above a medium or large title. For a small bar, use `#title`.

## Scrolling and Scaffold

Place the bar in `MdvAppBarScaffold`’s `#appbar` slot and the page in its default slot. Give the scaffold a definite height so the bar can follow its content scroll area.

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

For a standalone bar that follows a local scroll area, set `scroll-target`.

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
