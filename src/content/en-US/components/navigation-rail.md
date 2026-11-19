<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import RailBasicDemo from '@/components/docs/demos/navigationRail/basic.vue'
import RailLinksDemo from '@/components/docs/demos/navigationRail/links.vue'
import RailModalDemo from '@/components/docs/demos/navigationRail/modal.vue'
import RailPolicyDemo from '@/components/docs/demos/navigationRail/policy.vue'
import RailThemeDemo from '@/components/docs/demos/navigationRail/theme.vue'

const railProps: ApiTableItem[] = [
  { name: 'expanded', attribute: 'v-model:expanded', type: 'boolean', default: 'false', description: 'Controlled expansion state. Accept update:expanded in the parent; omitting the binding does not create internal expansion state.' },
  { name: 'alignment', type: "'top' | 'center'", default: "'top'", description: 'Positions destinations within the scrolling area. Menu and FAB remain above it.' },
  { name: 'expandedWidth', type: 'string', default: 'Content measurement', description: 'CSS length. Expanded width is constrained to 220–360px and available space; without a value it is measured from labels and badges.' },
  { name: 'transparent', type: 'boolean', default: 'false', description: 'Makes the rail surface transparent. Does not remove a modal scrim.' },
  { name: 'showDivider', type: 'boolean', default: 'false', description: 'Adds a divider on the logical content edge.' },
]
const modalProps: ApiTableItem[] = [
  { name: 'hideOnCollapse', type: 'boolean', default: 'false', description: 'Hides the collapsed 96px rail and its layout space. Supply a reachable external trigger to reopen navigation.' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Escape requests closing the topmost modal.' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: 'A completed scrim click requests closing.' },
  { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Ordinary enabled destination activation requests closing. Cancelled clicks and new-window/download gestures do not.' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: 'Unmounts expanded modal content after closing. The collapsed rail remains mounted unless hideOnCollapse is true.' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', default: 'Required', description: 'Visible and accessible destination text. Long labels can wrap and increase item height.' },
  { name: 'href', type: 'string', description: 'Creates a native anchor instead of a button. Supports target, rel, and download through native attributes.' },
  { name: 'active', type: 'boolean', default: 'false', description: 'Current destination indicator and aria-current="page". Routing and destination changes belong to the application.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks activation listeners, removes a link href, and excludes the item from rail keyboard navigation.' },
]
const railSlots: SlotTableItem[] = [
  { name: 'default', description: 'Destinations and optional expanded-only content. Receives { expanded, toggle, menuAttrs }.' },
  { name: 'menu', description: 'Menu action above destinations. Receives { expanded, toggle, menuAttrs }; bind menuAttrs once to the action button.' },
  { name: 'fab', description: 'Optional creation action above destinations. Receives the same rail state; supply a named Button, IconButton, or appropriate FAB.' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'icon', description: 'Decorative destination icon. Receives { active, expanded } for filled/outlined or expanded-specific rendering.' },
  { name: 'badge', description: 'Trailing notification content. Receives { active, expanded }. Supply MdvBadge when a badge surface is wanted; the rail does not clear it on selection.' },
]
</script>

# Navigation Rail

`MdvNavigationRail` provides persistent primary destinations beside application content. `MdvModalNavigationRail` expands over content, and both use `MdvNavigationRailItem` for destinations. This page describes the installed **MDV 0.1.5** API.

Use a collapsed rail for a small set of primary destinations, usually 3–7. Keep labels meaningful; expansion can reveal secondary destinations. The rail does not choose a responsive breakpoint or switch itself into a drawer or navigation bar.

## Standard layout and expansion

Give the surrounding flex/grid layout a definite height and its content `min-width: 0`. A collapsed rail occupies 96px. Standard expansion changes its real width, allowing adjacent content to resize. This preview hides its secondary explanatory pane on small screens while expanded so the live rail stays usable.

The `menuAttrs` slot object contains `aria-controls`, `aria-expanded`, and `onClick`. Bind it to the menu button once. Adding a second `@click="toggle"` would toggle twice. The FAB slot owns no creation behavior; this example counts draft actions in the application.

<DemoBlock>
  <RailBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvNavigationRail, MdvNavigationRailItem, MdvSelect } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home'
import homeOutlineIcon from '@iconify-icons/material-symbols/home-outline'
import exploreIcon from '@iconify-icons/material-symbols/explore-outline'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import menuIcon from '@iconify-icons/material-symbols/menu'
import editIcon from '@iconify-icons/material-symbols/edit'
import settingsIcon from '@iconify-icons/material-symbols/settings'

const expanded = ref(false)
const current = ref('Home')
const centered = ref(false)
const transparent = ref(false)
const divider = ref(true)
const width = ref('auto')
const drafts = ref(0)
const widths = ['auto', '280px', '360px'].map(value => ({ value, label: value }))
const destinations = [{ label: 'Home', icon: homeOutlineIcon }, { label: 'Explore', icon: exploreIcon }, { label: 'Saved', icon: bookmarkIcon }]
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <MdvCheckbox v-model="centered" label="Center items" />
      <MdvCheckbox v-model="transparent" label="Transparent" />
      <MdvCheckbox v-model="divider" label="Divider" />
      <MdvSelect :model-value="width" :options="widths" label="Expanded width" @update:model-value="width = String($event)" />
    </div>
    <div class="flex h-[34rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationRail v-model:expanded="expanded" :alignment="centered ? 'center' : 'top'" :expanded-width="width === 'auto' ? undefined : width" :transparent="transparent" :show-divider="divider" aria-label="Workspace navigation">
        <template #menu="{ menuAttrs, expanded: isExpanded }">
          <MdvIconButton v-bind="menuAttrs" variant="standard" :aria-label="isExpanded ? 'Collapse rail' : 'Expand rail'"><MdvIcon :icon="menuIcon" /></MdvIconButton>
        </template>
        <template #fab>
          <MdvIconButton variant="tonal" size="m" shape="square" aria-label="Create draft" @click="drafts++"><MdvIcon :icon="editIcon" /></MdvIconButton>
        </template>
        <template #default="{ expanded: isExpanded }">
          <MdvNavigationRailItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" @click="current = destination.label">
            <template #icon="{ active }"><MdvIcon :icon="active && destination.label === 'Home' ? homeIcon : destination.icon" /></template>
            <template v-if="destination.label === 'Explore'" #badge><MdvBadge variant="large" content="3" aria-label="3 new discoveries" /></template>
          </MdvNavigationRailItem>
          <MdvNavigationRailItem v-if="isExpanded" label="Settings" :active="current === 'Settings'" @click="current = 'Settings'">
            <template #icon><MdvIcon :icon="settingsIcon" /></template>
          </MdvNavigationRailItem>
        </template>
      </MdvNavigationRail>
      <div class="min-w-0 flex-1 overflow-auto p-4" :class="expanded ? 'hidden sm:block' : ''">
        <p class="font-medium">{{ current }}</p>
        <p class="mt-3 text-sm text-mdv-on-surface-variant">Standard expansion reserves real layout space. Selection stays under application control.</p>
        <MdvButton class="mt-4" variant="text" @click="expanded = !expanded">Toggle rail</MdvButton>
      </div>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Destination: {{ current }} · Drafts created: {{ drafts }} · Expanded: {{ expanded }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Controlled requests, links, and keyboard focus

`expanded` is controlled: accepting `update:expanded` is what changes the rail. Item `active` is also application state. Focus movement does not select a destination, and selection does not automatically change `active`.

An item with `href` renders an anchor. Native modified clicks, `target`, `rel`, and downloads keep their browser behavior. Synchronous `preventDefault()` cancels navigation and selection dismissal. Disabled items block activation callbacks. For Vue Router, bind an appropriate `href` and navigation handler from a custom `RouterLink` slot and derive `active` from the route; do not replace links with unrelated click-only elements.

<DemoBlock>
  <RailLinksDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvNavigationRail, MdvNavigationRailItem } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import bookIcon from '@iconify-icons/material-symbols/menu-book'
import lockIcon from '@iconify-icons/material-symbols/lock-outline'

const expanded = ref(false)
const accept = ref(true)
const current = ref('Overview')
const message = ref('No navigation requested.')
function update(value: boolean) {
  message.value = `Expansion requested: ${value}${accept.value ? '' : ' (rejected)'}`
  if (accept.value) expanded.value = value
}
function cancel(event: MouseEvent) {
  event.preventDefault()
  message.value = 'Navigation cancelled; the destination is unchanged.'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="accept" label="Accept expansion requests" />
    <div class="flex h-[30rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationRail :expanded="expanded" show-divider aria-label="Controlled destinations" @update:expanded="update">
        <template #menu="{ menuAttrs }"><MdvIconButton v-bind="menuAttrs" variant="standard" aria-label="Toggle controlled rail"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
        <MdvNavigationRailItem label="Overview" :active="current === 'Overview'" @click="current = 'Overview'">
          <template #icon><MdvIcon :icon="homeIcon" /></template>
        </MdvNavigationRailItem>
        <MdvNavigationRailItem label="Material guide" href="https://m3.material.io/components/navigation-rail/overview" target="_blank" rel="noopener noreferrer">
          <template #icon><MdvIcon :icon="bookIcon" /></template>
        </MdvNavigationRailItem>
        <MdvNavigationRailItem label="Cancelled link" href="https://example.com" @click="cancel">
          <template #icon><MdvIcon :icon="bookIcon" /></template>
        </MdvNavigationRailItem>
        <MdvNavigationRailItem label="Unavailable" href="https://example.com" disabled @click="message = 'This must not run.'">
          <template #icon><MdvIcon :icon="lockIcon" /></template>
        </MdvNavigationRailItem>
      </MdvNavigationRail>
      <p class="min-w-0 flex-1 overflow-auto p-4 text-sm text-mdv-on-surface-variant" :class="expanded ? 'hidden sm:block' : ''">Arrow keys move focus without changing the current destination. The external guide opens in a new tab.</p>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }} · Current: {{ current }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Modal expansion and immersive presentation

Modal expansion leaves the collapsed 96px layout space unchanged while the expanded panel enters the native dialog top layer. Its scrim, modal focus containment, Escape handling, and focus restoration are provided by MDV. Name each navigation with `aria-label` or `aria-labelledby`; the built-in fallback is Chinese.

`hide-on-collapse` removes the collapsed rail and its reserved space. Keep an accessible external menu button with matching `aria-controls` and `aria-expanded`. The example's external button works in either presentation.

Modal slots normally render twice: once for the collapsed rail and once for the expanded panel, receiving different `expanded` values. Avoid fixed duplicate IDs or duplicated independent overlays inside those slots. Declare the nested Dialog outside the rail, as shown here.

<DemoBlock>
  <RailModalDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox, MdvDialog, MdvIcon, MdvIconButton, MdvModalNavigationRail, MdvNavigationRailItem } from '@mdv-ui/mdv'
import type { MdvNavigationRailCloseDetail } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import editIcon from '@iconify-icons/material-symbols/edit'

const id = `modal-rail-${useId()}`
const expanded = ref(false)
const immersive = ref(false)
const compose = ref(false)
const current = ref('Home')
const reason = ref('Not closed yet')
function closed(detail: MdvNavigationRailCloseDetail) { reason.value = detail.reason }
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="immersive" label="Hide the collapsed rail" />
    <div class="flex h-[28rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvModalNavigationRail :id="id" v-model:expanded="expanded" :hide-on-collapse="immersive" aria-label="Modal workspace navigation" @closed="closed">
        <template #menu="{ menuAttrs, expanded: isExpanded }"><MdvIconButton v-bind="menuAttrs" variant="standard" :aria-label="isExpanded ? 'Close modal rail' : 'Expand modal rail'"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
        <template #fab><MdvIconButton variant="tonal" size="m" shape="square" aria-label="Compose from rail" @click="compose = true"><MdvIcon :icon="editIcon" /></MdvIconButton></template>
        <MdvNavigationRailItem label="Home" :active="current === 'Home'" @click="current = 'Home'"><template #icon><MdvIcon :icon="homeIcon" /></template></MdvNavigationRailItem>
        <MdvNavigationRailItem label="Saved" :active="current === 'Saved'" @click="current = 'Saved'">
          <template #icon><MdvIcon :icon="bookmarkIcon" /></template>
          <template #badge><MdvBadge variant="large" content="5" aria-label="5 saved updates" /></template>
        </MdvNavigationRailItem>
      </MdvModalNavigationRail>
      <div class="min-w-0 flex-1 overflow-auto p-4">
        <MdvButton :aria-controls="id" :aria-expanded="expanded" @click="expanded = true">Open modal rail</MdvButton>
        <p class="mt-4 text-sm text-mdv-on-surface-variant">Modal expansion overlays the page. The external trigger also works when the collapsed rail is hidden.</p>
      </div>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Destination: {{ current }} · Last close: {{ reason }}</p>
    <MdvDialog v-model="compose" title="New draft" description="This dialog is declared outside the rail slots so only one instance exists.">
      <template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template>
    </MdvDialog>
  </div>
</template>
```

  </template>
</DemoBlock>

## Closing policy and content lifetime

`closeOnEsc`, `closeOnScrim`, and `closeOnSelect` control their respective requests. The menu action and exposed `close()` still request closing. The parent can refuse a request by keeping `expanded` unchanged; no accepted close lifecycle is emitted. Navigation Rail has **no `beforeClose` prop**. If an application needs confirmation, manage whether it accepts the update request.

`close(): Promise<boolean>` reports whether the parent accepted closing, rather than waiting for the animation to end. Observe `closed` for the finished transition. Calling it uses reason `menu`; setting the model directly closes with reason `model`.

The note below belongs to its TextField instance. It survives ordinary closing, but is recreated after closing with `destroy-on-close`. Models stored outside the rail are not reset by destruction. A “Close directly” button remains available inside the modal even when the parent refuses requested closes.

<DemoBlock>
  <RailPolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvModalNavigationRail, MdvNavigationRailItem, MdvTextField } from '@mdv-ui/mdv'
import type { MdvNavigationRailCloseDetail } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const id = `rail-policy-${useId()}`
const rail = useTemplateRef<InstanceType<typeof MdvModalNavigationRail>>('rail')
const expanded = ref(false)
const acceptClose = ref(true)
const closeOnEsc = ref(true)
const closeOnScrim = ref(true)
const closeOnSelect = ref(true)
const destroy = ref(false)
const message = ref('No close request yet.')
function update(value: boolean) {
  if (value || acceptClose.value) expanded.value = value
  else message.value = 'Parent rejected closing.'
}
async function close() { message.value = `close() accepted: ${await rail.value?.close()}` }
function closed(detail: MdvNavigationRailCloseDetail) { message.value = `Closed: ${detail.reason}` }
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="closeOnEsc" label="Escape closes" />
      <MdvCheckbox v-model="closeOnScrim" label="Scrim closes" />
      <MdvCheckbox v-model="closeOnSelect" label="Selection closes" />
      <MdvCheckbox v-model="destroy" label="Destroy expanded content on close" />
    </div>
    <MdvButton :aria-controls="id" :aria-expanded="expanded" @click="expanded = true">Open policy example</MdvButton>
    <MdvModalNavigationRail :id="id" ref="rail" :expanded="expanded" hide-on-collapse :close-on-esc="closeOnEsc" :close-on-scrim="closeOnScrim" :close-on-select="closeOnSelect" :destroy-on-close="destroy" aria-label="Rail close policy" @update:expanded="update" @closed="closed">
      <template #menu="{ menuAttrs }"><MdvIconButton v-bind="menuAttrs" variant="standard" aria-label="Request policy close"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
      <MdvNavigationRailItem label="Saved"><template #icon><MdvIcon :icon="bookmarkIcon" /></template></MdvNavigationRailItem>
      <div class="grid gap-3 px-5 py-4">
        <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
        <MdvTextField label="Local note" placeholder="Type, close, then reopen" />
        <MdvButton variant="outlined" @click="close">Request close()</MdvButton>
        <MdvButton variant="text" @click="expanded = false">Close directly</MdvButton>
        <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
      </div>
    </MdvModalNavigationRail>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Scrolling, long labels, local themes, and RTL

Labels wrap in both presentations. Expanded width is measured from labels and badges or from `expanded-width`, constrained by available space. Keep navigation height bounded so the item area can scroll independently of its menu and FAB. MDV handles theme roles, logical edges, focus rings, and reduced motion; the example changes only its local container theme and direction.

<DemoBlock>
  <RailThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvCheckbox, MdvIcon, MdvIconButton, MdvNavigationRail, MdvNavigationRailItem } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const expanded = ref(true)
const dark = ref(false)
const rtl = ref(false)
const current = ref('A shared workspace with a long destination label')
const labels = ['A shared workspace with a long destination label', 'Reading list', 'Project drafts', 'Notifications', 'Recent activity', 'Archive', 'Account settings']
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="dark" label="Local dark theme" /><MdvCheckbox v-model="rtl" label="Right to left" /></div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="flex h-[27rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low text-mdv-on-surface">
      <MdvNavigationRail v-model:expanded="expanded" expanded-width="280px" show-divider aria-label="Scrollable themed destinations">
        <template #menu="{ menuAttrs }"><MdvIconButton v-bind="menuAttrs" variant="standard" aria-label="Toggle themed rail"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
        <MdvNavigationRailItem v-for="(label, index) in labels" :key="label" :label="label" :active="current === label" @click="current = label">
          <template #icon><MdvIcon :icon="bookmarkIcon" /></template>
          <template v-if="index === 0" #badge><MdvBadge variant="large" content="99+" aria-label="More than 99 updates" /></template>
        </MdvNavigationRailItem>
      </MdvNavigationRail>
      <p class="min-w-0 flex-1 overflow-auto p-4 text-sm" :class="expanded ? 'hidden sm:block' : ''">Long labels wrap. Only the destinations scroll; the menu remains reachable.</p>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Accessibility and integration

<DocsTable label="Navigation Rail keyboard interaction">

| Key or action | Behavior |
| --- | --- |
| Tab / Shift+Tab | Visits enabled destinations and other ordinary controls. |
| Arrow Up / Arrow Down | Moves destination focus, wrapping and skipping disabled or hidden items; selection stays unchanged. |
| Home / End | Focuses the first/last available destination. |
| Enter / Space | Uses native button/link activation; Space activates buttons. |
| Escape in Modal | Requests closing when enabled; only the topmost modal handles it. |
| Exposed Standard `focus(options?)` | Focuses the active enabled item or the first available item. |

</DocsTable>

Use the provided accessible label rather than putting a second interactive link inside an item. Badge content should describe counts when that information matters. A router or view switch is responsible for updating destination state and moving focus into newly loaded content as needed. Rail resizing is separate from page transitions.

The component uses `nav` and native buttons/anchors rather than `menu` semantics. It does not add swipe gestures, hidden-label modes, density variants, or an automatic mobile replacement. Modal content inherits the surrounding theme and direction without requiring application Teleport code. Real touch, screen readers, forced colors, and SSR/hydration need application-level verification.

## API

### MdvNavigationRail

<ApiTable :items="railProps" />

<SlotsTable :items="railSlots" />

Emits `update:expanded(value: boolean)`. Exposes `focus(options?: FocusOptions): void`. Native `id`, `class`, `style`, direction, ARIA, and listeners are applied to the navigation surface. It has no open/close lifecycle events or exposed `close()`.

### MdvModalNavigationRail

Inherits the five Standard props and all rail slots, plus:

<ApiTable :items="modalProps" />

<DocsTable label="Modal Navigation Rail events and methods">

| Member | Payload or result | Meaning |
| --- | --- | --- |
| `update:expanded` | `boolean` | Requests an accepted model change. |
| `open` / `opened` | None | Opening accepted / opening animation finished. |
| `close` / `closed` | `MdvNavigationRailCloseDetail` | Closing accepted / closing animation finished. |
| `close()` | `Promise<boolean>` | Requests closing with reason `menu`. |
| `focus()` | `void` | Focuses autofocus content or the first available interaction inside the open modal. |

</DocsTable>

Close detail is `{ reason: 'menu' | 'escape' | 'scrim' | 'select' | 'model' }`. A prevented click, non-primary click, modified link, different target, or download does not trigger selection closing.

`class` and `style` belong to the layout host. `dir` and `data-mdv-theme` apply to both presentations. `id`, ARIA, and remaining native attributes/listeners belong to the native dialog; its inner navigation also receives the accessible name. Closing normally preserves expanded slot content; `destroyOnClose` affects that content after the animation.

### MdvNavigationRailItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

Forwards native attributes and listeners to its button/anchor while owning its interaction type, disabled semantics, tab navigation, and `aria-current`. Exposes `focus(options?: FocusOptions): void` and `blur(): void`. It has no custom selection event or model; use native `click` and application destination state.

### Public types

```ts
import type {
  MdvNavigationRailAlignment,
  MdvNavigationRailProps,
  MdvModalNavigationRailProps,
  MdvNavigationRailCloseReason,
  MdvNavigationRailCloseDetail,
  MdvNavigationRailSlotProps,
  MdvNavigationRailItemProps,
  MdvNavigationRailItemSlotProps,
} from '@mdv-ui/mdv'
```

`MdvNavigationRailSlotProps` is `{ expanded, toggle, menuAttrs }`; `toggle(): void` requests a change. Item slots receive `{ active, expanded }`. Import Iconify data individually when using icons, as described in [Setup](../getting-started/setup).
