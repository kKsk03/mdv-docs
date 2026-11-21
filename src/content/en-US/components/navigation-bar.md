<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import NavigationBarBasicDemo from '@/components/docs/demos/navigationBar/basic.vue'
import NavigationBarOrientationDemo from '@/components/docs/demos/navigationBar/orientation.vue'
import NavigationBarLinksDemo from '@/components/docs/demos/navigationBar/links.vue'

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

Use `MdvNavigationBar` for a small set of primary destinations at the bottom of the viewport. Place one `MdvNavigationBarItem` per destination.

## Destinations and badges

Set `active` from the current destination. Use the icon slot’s `active` value to switch artwork and the `badge` slot for a count or status. Give the bar a distinct accessible name.

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

## Icon and label layout

`orientation` sets the icon and label arrangement. `auto` stacks them below a 600px container width and places them side by side at 600px or above. Reserve space in page content for the fixed bar.

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

## Links and routing

Use `href` for links. With Vue Router, get `href`, `isExactActive`, and `navigate` from a custom `RouterLink` slot instead of nesting a link. Guard custom click callbacks yourself: `disabled` removes native navigation but does not stop the callback.

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

---

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
