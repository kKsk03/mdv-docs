<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import NavigationBarBasicDemo from '@/components/docs/demos/navigationBar/basic.vue'
import NavigationBarOrientationDemo from '@/components/docs/demos/navigationBar/orientation.vue'
import NavigationBarLinksDemo from '@/components/docs/demos/navigationBar/links.vue'
import NavigationBarThemeDemo from '@/components/docs/demos/navigationBar/theme.vue'

const barProps: ApiTableItem[] = [
  { name: 'orientation', type: "'auto' | 'vertical' | 'horizontal'", default: "'auto'", description: 'Arrangement of each item’s icon and label. Auto uses vertical below a 600px bar container width and horizontal at 600px or above. The bar itself remains at the bottom.' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', default: 'required', description: 'Always-visible destination name and default accessible name.' },
  { name: 'href', type: 'string', description: 'Uses a native anchor when provided, including an empty string. Omit for a type=button action.' },
  { name: 'active', type: 'boolean', default: 'false', description: 'Current destination, owned by the application. Adds the selection indicator and aria-current=page; does not navigate by itself.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables a native button, or removes a link’s href and excludes it from Tab with aria-disabled=true.' },
]
const barSlots: SlotTableItem[] = [
  { name: 'default', description: 'NavigationBarItem destinations. No parameters.' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'icon', description: 'Destination icon. Receives { active } for switching outlined/filled artwork. Hidden from assistive technology; label supplies the name.' },
  { name: 'badge', description: 'Optional Badge or count content positioned near the icon. Receives { active }. Include important notification information in the destination’s accessible name.' },
]
</script>

# Navigation Bar

`MdvNavigationBar` provides a fixed bottom navigation surface. Each `MdvNavigationBarItem` represents a top-level destination with an always-visible label and an icon. Prefer 3–5 short destinations. For many destinations or a wider persistent sidebar, choose another navigation component in application layout code.

## Destinations, active icons, and badges

The application owns the current destination. Update `active` after navigation succeeds; neither the bar nor its items have a selection `v-model`. The icon slot receives `active` so it can switch artwork without moving the label or badge.

<DemoBlock>
  <NavigationBarBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvIcon, MdvNavigationBar, MdvNavigationBarItem } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import activeHomeIcon from '@iconify-icons/material-symbols/home'
import exploreIcon from '@iconify-icons/material-symbols/explore-outline'
import activeExploreIcon from '@iconify-icons/material-symbols/explore'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import activeBookmarkIcon from '@iconify-icons/material-symbols/bookmark'

const current = ref('home')
const destinations = [
  { id: 'home', label: 'Home', icon: homeIcon, activeIcon: activeHomeIcon },
  { id: 'explore', label: 'Explore', icon: exploreIcon, activeIcon: activeExploreIcon, badge: '3' },
  { id: 'saved', label: 'Saved', icon: bookmarkIcon, activeIcon: activeBookmarkIcon },
]
</script>

<template>
  <div class="relative isolate h-64 overflow-hidden rounded-xl bg-mdv-surface-container-low [contain:layout]">
    <div class="p-6 pb-28">
      <p class="font-medium">My library</p>
      <p class="mt-3 text-sm text-mdv-on-surface-variant" role="status">Current destination: {{ current }}</p>
    </div>
    <MdvNavigationBar aria-label="Library destinations">
      <MdvNavigationBarItem v-for="destination in destinations" :key="destination.id" :label="destination.label" :active="current === destination.id" :aria-label="destination.badge ? `${destination.label}, ${destination.badge} unread updates` : undefined" @click="current = destination.id">
        <template #icon="{ active }"><MdvIcon :icon="active ? destination.activeIcon : destination.icon" /></template>
        <template v-if="destination.badge" #badge><MdvBadge variant="large" :content="destination.badge" /></template>
      </MdvNavigationBarItem>
    </MdvNavigationBar>
  </div>
</template>
```

  </template>
</DemoBlock>

The live previews use a containing block to keep the real fixed-position bar inside their example viewport. This is preview framing, not a Navigation Bar positioning prop. In an application, the bar is normally fixed to the actual viewport.

The example announces the Explore badge through its destination name. A count by itself should not become an unrelated keyboard target or replace the destination's visible label.

## Automatic and explicit orientation

`orientation` describes icon/label arrangement within each destination, not the physical placement of the bar. `auto` uses its named container's width: below 600px is vertical; 600px and above is horizontal. Explicit `vertical` and `horizontal` force that arrangement.

<DemoBlock>
  <NavigationBarOrientationDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvNavigationBar, MdvNavigationBarItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvNavigationBarOrientation } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import searchIcon from '@iconify-icons/material-symbols/search'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const orientation = ref<MdvNavigationBarOrientation>('auto')
const wide = ref(false)
const current = ref('Home')
const options = ['auto', 'vertical', 'horizontal'].map(value => ({ value, label: value }))
const destinations = [{ label: 'Home', icon: homeIcon }, { label: 'Search', icon: searchIcon }, { label: 'Saved', icon: bookmarkIcon }]
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="orientation" :options="options" label="Item orientation" @update:model-value="orientation = $event as MdvNavigationBarOrientation" />
    <MdvCheckbox v-model="wide" label="Use a 720px preview" />
    <div class="overflow-x-auto rounded-xl" role="region" aria-label="Navigation bar width preview" tabindex="0">
      <div class="relative isolate h-56 overflow-hidden bg-mdv-surface-container-low [contain:layout]" :style="{ inlineSize: wide ? '720px' : 'min(100%, 360px)' }">
        <p class="p-6 pb-28 text-sm text-mdv-on-surface-variant">{{ orientation }} · {{ wide ? '720px' : 'up to 360px' }}</p>
        <MdvNavigationBar :orientation="orientation" aria-label="Orientation example destinations">
          <MdvNavigationBarItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" @click="current = destination.label">
            <template #icon><MdvIcon :icon="destination.icon" /></template>
          </MdvNavigationBarItem>
        </MdvNavigationBar>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

Enable the 720px preview to inspect the medium layout, scrolling the example horizontally when necessary. MDV does not automatically replace the bar with a Rail or Drawer at larger widths.

<DocsTable label="Navigation bar dimensions" min-width="32rem">

| Arrangement | Minimum bar height | Minimum item height | Indicator |
| --- | --- | --- | --- |
| Vertical | 80px | 56px | 64 × 32px icon capsule |
| Horizontal | 64px | 48px | Capsule behind icon and label |

</DocsTable>

These are minimums; wrapped labels and larger text can increase the height. Horizontal items have a 168px maximum width and the item collection is capped at 840px. Safe-area bottom insets are handled by MDV. Reserve space in the page content for the actual bar height and safe area so its final content is not covered; the fixed anchor adds no layout space.

## Native links and router integration

Use `href` for a real destination. Native navigation, modified clicks, and link semantics remain available. With Vue Router, its custom RouterLink slot supplies `href`, `isExactActive`, and `navigate`; bind those to the item instead of nesting an anchor inside another interactive element.

<DemoBlock>
  <NavigationBarLinksDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MdvCheckbox, MdvIcon, MdvNavigationBar, MdvNavigationBarItem } from '@mdv-ui/mdv'
import bookIcon from '@iconify-icons/material-symbols/menu-book'
import settingsIcon from '@iconify-icons/material-symbols/settings'
import navigationIcon from '@iconify-icons/material-symbols/navigation-outline'

const route = useRoute()
const disableSetup = ref(false)
const locale = computed(() => route.meta.locale === 'zh-CN' ? 'zh-CN' : 'en-US')
const destinations = [
  { slug: 'getting-started/introduction', label: 'Intro', icon: bookIcon },
  { slug: 'getting-started/setup', label: 'Setup', icon: settingsIcon },
  { slug: 'components/navigation-bar', label: 'Navigation', icon: navigationIcon },
]
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disableSetup" label="Disable the Setup destination" />
    <div class="relative isolate h-56 overflow-hidden rounded-xl bg-mdv-surface-container-low [contain:layout]">
      <p class="p-6 pb-28 text-sm text-mdv-on-surface-variant">These links navigate to real documentation pages.</p>
      <MdvNavigationBar aria-label="Documentation example destinations">
        <RouterLink v-for="destination in destinations" :key="destination.slug" :to="`/${locale}/${destination.slug}`" custom v-slot="{ href, isExactActive, navigate }">
          <MdvNavigationBarItem :href="href" :label="destination.label" :active="isExactActive" :disabled="disableSetup && destination.label === 'Setup'" @click="disableSetup && destination.label === 'Setup' ? $event.preventDefault() : navigate($event)">
            <template #icon><MdvIcon :icon="destination.icon" /></template>
          </MdvNavigationBarItem>
        </RouterLink>
      </MdvNavigationBar>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

These are live documentation links. Intro and Setup leave this article; Navigation points to this page. The example follows the current documentation locale while keeping demonstration labels in English.

Use the router's active state rather than immediately changing a separate active model before navigation guards finish. A disabled link omits its `href`, sets `aria-disabled="true"`, and has `tabindex="-1"`. No URL is generated by the component itself.

In MDV 0.1.5, disabling a link removes native navigation but does not suppress an application-provided click callback. The example checks the disabled state before calling RouterLink's `navigate`; keep this check for custom navigation callbacks. This library integration issue is tracked in the documentation roadmap.

## Local themes, direction, and longer labels

Theme scopes supply surface and indicator roles. RTL follows logical layout direction, and labels remain visible even when they need to wrap. Keep top-level labels concise rather than hiding them to make room.

<DemoBlock>
  <NavigationBarThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvCheckbox, MdvIcon, MdvNavigationBar, MdvNavigationBarItem } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import mailIcon from '@iconify-icons/material-symbols/mail-outline'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const rtl = ref(false)
const current = ref('Inbox')
const destinations = [{ label: 'Home', icon: homeIcon }, { label: 'Inbox', icon: mailIcon }, { label: 'Recently saved', icon: bookmarkIcon }]
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="rtl" label="Use right-to-left navigation bars" />
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" :dir="rtl ? 'rtl' : 'ltr'" class="relative isolate h-56 min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low text-mdv-on-surface [contain:layout]">
        <p class="p-5 pb-32 text-sm">{{ theme }} · {{ current }}</p>
        <MdvNavigationBar orientation="vertical" :aria-label="`${theme} example destinations`">
          <MdvNavigationBarItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" :aria-label="destination.label === 'Inbox' ? 'Inbox, more than 9 unread messages' : undefined" @click="current = destination.label">
            <template #icon><MdvIcon :icon="destination.icon" /></template>
            <template v-if="destination.label === 'Inbox'" #badge><MdvBadge variant="large" content="9+" /></template>
          </MdvNavigationBarItem>
        </MdvNavigationBar>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

The active indicator uses `secondary-container`; the active icon uses `on-secondary-container`. Other text/icons use `on-surface-variant`. On hover, an inactive capsule grows from its center in 200ms; selected items retain their indicator, and focus/pressed states add their state layer. Reduced motion shortens transitions; forced colors use system borders and focus colors. There is no public color or hidden-label prop.

## Keyboard, semantics, and layout ownership

The root is a native navigation landmark. Give it a distinct `aria-label` or `aria-labelledby`, especially when a page also has a drawer or an article outline. Items retain button/link semantics and the current destination exposes `aria-current="page"`.

All enabled destinations participate in normal Tab order. Buttons activate with native Enter/Space, links follow native anchor rules, and disabled destinations are excluded from Tab. There is no roving tab stop, arrow-key selection, tablist/panel relationship, or swipe navigation.

The application decides responsive breakpoints, routing, active destination, and content padding. The bar does not couple itself to AppBarScaffold, manage document scroll, or create content panels. Avoid placing a fixed bar inside an ancestor with `transform` or layout containment unless that ancestor is deliberately its containing viewport, as in these demos.

## API

### MdvNavigationBar

<ApiTable :items="barProps" />

<SlotsTable :items="barSlots" />

No component events, model, or additional exposed methods. A nonsemantic wrapper provides the fixed anchor and named size container; attributes such as `class`, `style`, `id`, `dir`, `aria-label`, and native listeners reach the inner `nav`. The navigation role is retained rather than accepting a different `role`.

### MdvNavigationBarItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

No component events, model, default slot, or additional exposed methods. Native `click` and other attributes reach the actual button/anchor. Button `type` is managed as `button`, so placing an item in a form does not make it submit. Link `target`, `rel`, and `download` remain native. MDV manages `role`, disabled state, Tab state, and current-page ARIA.

### Public types

```ts
import type {
  MdvNavigationBarOrientation,
  MdvNavigationBarProps,
  MdvNavigationBarItemProps,
  MdvNavigationBarItemSlotProps,
} from '@mdv-ui/mdv'
```

There are no icon-data props or color/size/position models: use the icon/badge slots, inherited theme, and the supported orientation. MDV does not enforce the suggested destination count or bundle a router.
