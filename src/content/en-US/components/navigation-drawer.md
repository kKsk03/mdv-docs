<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DrawerBasicDemo from '@/components/docs/demos/navigationDrawer/basic.vue'
import DrawerGroupsDemo from '@/components/docs/demos/navigationDrawer/groups.vue'
import DrawerModalDemo from '@/components/docs/demos/navigationDrawer/modal.vue'
import DrawerResponsiveDemo from '@/components/docs/demos/navigationDrawer/responsive.vue'

const drawerProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'true / false', description: 'Open state. Standard defaults to true; Modal defaults to false. Bind a model to accept update requests; omitting it does not create internally managed open state.' },
  { name: 'title', type: 'string', default: "''", description: 'Header text, also used for accessible naming unless explicitly overridden. The header slot replaces it.' },
  { name: 'width', type: 'string', default: "'360px'", description: 'CSS length for the panel width, constrained by available parent space for Standard and viewport space for Modal.' },
  { name: 'beforeClose', type: '(detail: Readonly<MdvNavigationDrawerCloseDetail>) => boolean | void | Promise<boolean | void>', description: 'Optional synchronous/asynchronous close guard. false blocks closing; other successful results allow a model update request. Direct model changes bypass it.' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: 'Unmounts slot content after the closing transition. Retaining content preserves its internal state; destroying it does not reset models held by the parent.' },
]
const modalProps: ApiTableItem[] = [
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Requests closing the topmost drawer with Escape.' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: 'Requests closing on a completed scrim click.' },
  { name: 'closeOnSelect', type: 'boolean', default: 'true', description: 'Requests closing after an ordinary enabled destination activation. Prevented clicks and native new-window/download gestures do not dismiss it.' },
  { name: 'closeOnSwipe', type: 'boolean', default: 'true', description: 'Allows dismissing toward the logical starting edge. Rejected or incomplete gestures spring back.' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', required: true, description: 'Destination text. Long labels are visually ellipsized while retaining their full accessible text.' },
  { name: 'href', type: 'string', description: 'Renders a native anchor instead of a button. Disabled links omit href.' },
  { name: 'active', type: 'boolean', default: 'false', description: 'Current destination styling and aria-current="page". The application supplies router or view state.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks activation and excludes the destination from keyboard navigation. Does not disable neighboring destinations.' },
  { name: 'badge', type: 'string | number', description: 'Trailing text, including numeric 0. The badge slot takes priority; this prop does not create an MdvBadge instance.' },
]
const groupProps: ApiTableItem[] = [
  { name: 'label', type: 'string', required: true, description: 'Static section heading or collapsible disclosure label.' },
  { name: 'collapsible', type: 'boolean', default: 'false', description: 'false creates a static section heading. true creates a disclosure button that shows/hides its descendants.' },
  { name: 'expanded', attribute: 'v-model:expanded', type: 'boolean', default: 'undefined', description: 'Disclosure state. Omit for internal state, initially expanded. An explicit boolean requires the parent to accept update:expanded.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables only the disclosure control. Does not recursively disable destinations inside the group.' },
  { name: 'divider', type: 'boolean', default: 'false', description: 'Adds the native divider before this group.' },
]
const drawerSlots: SlotTableItem[] = [
  { name: 'default', description: 'NavigationDrawerItem and NavigationDrawerGroup content. Receives { close }, where close(): Promise<boolean> requests a guarded action close.' },
  { name: 'header', description: 'Replaces the title region. Receives { close }. Keep a useful accessible drawer name when customizing it.' },
  { name: 'footer', description: 'Content outside the scrolling destination list, such as an explicit close action. Receives { close }.' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'icon', description: 'Decorative leading icon. Receives { active }; use it to select filled/outlined data when needed.' },
  { name: 'badge', description: 'Trailing text or an MdvBadge; replaces the badge prop. Receives { active }. Include significant notification information in the accessible destination name.' },
]
const groupSlots: SlotTableItem[] = [
  { name: 'default', description: 'Grouped destinations or nested groups. Receives { expanded }.' },
  { name: 'label', description: 'Replaces the visible section/disclosure label. Receives { expanded }; preserve a useful text name.' },
  { name: 'icon', description: 'Decorative icon for the section heading or disclosure. Receives { expanded }.' },
]
</script>
# Navigation Drawer

Use a Navigation Drawer for a larger set of destinations. `MdvNavigationDrawer` reserves space beside the page; `MdvModalNavigationDrawer` overlays it. Both share `MdvNavigationDrawerItem` and `MdvNavigationDrawerGroup`.

## Standard drawer

Place the standard drawer before the main content in a flex layout with a definite height. Use `min-width: 0` on the content so it can shrink, and mark the current destination with `active`.

<DemoBlock>
  <DrawerBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvIcon, MdvNavigationDrawer, MdvNavigationDrawerItem, MdvSelect } from '@mdv-ui/mdv'
import inboxIcon from '@iconify-icons/material-symbols/inbox'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import archiveIcon from '@iconify-icons/material-symbols/archive-outline'

const id = `standard-example-${useId()}`
const open = ref(true)
const current = ref('Inbox')
const width = ref('280px')
const widths = ['240px', '280px', '360px'].map(value => ({ value, label: value }))
const destinations = [{ label: 'Inbox', icon: inboxIcon }, { label: 'Saved', icon: bookmarkIcon }, { label: 'Archive', icon: archiveIcon }]
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <MdvButton :aria-controls="id" :aria-expanded="open" @click="open = !open">Toggle standard drawer</MdvButton>
      <MdvSelect :model-value="width" :options="widths" label="Drawer width" @update:model-value="width = String($event)" />
    </div>
    <div class="flex h-80 min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationDrawer :id="id" v-model="open" title="Library" :width="width">
        <MdvNavigationDrawerItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" @click="current = destination.label">
          <template #icon><MdvIcon :icon="destination.icon" /></template>
        </MdvNavigationDrawerItem>
        <template #footer="{ close }"><MdvButton variant="text" @click="close()">Close standard drawer</MdvButton></template>
      </MdvNavigationDrawer>
      <div class="min-w-0 flex-1 overflow-auto p-4" :class="open ? 'hidden sm:block' : ''">
        <p class="font-medium">{{ current }}</p>
        <p class="mt-3 text-sm text-mdv-on-surface-variant">The drawer reserves layout space. Selecting a destination keeps it open.</p>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current destination: {{ current }} · Open: {{ open }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Groups and badges

Use a group for a section heading. Add `collapsible` for an expandable group, `divider` for a separator, or an item’s `badge` slot for a count or short status.

<DemoBlock>
  <DrawerGroupsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox, MdvIcon, MdvNavigationDrawer, MdvNavigationDrawerGroup, MdvNavigationDrawerItem } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const drawer = useTemplateRef<InstanceType<typeof MdvNavigationDrawer>>('drawer')
const expanded = ref(true)
const accept = ref(true)
const current = ref('Design')
const message = ref('Group changes are accepted.')
function requestExpanded(value: boolean) {
  if (accept.value) expanded.value = value
  message.value = `Expanded ${value}: ${accept.value ? 'accepted' : 'rejected'}.`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="accept" label="Accept project group changes" />
    <MdvButton variant="outlined" @click="drawer?.focus()">Focus current destination</MdvButton>
    <div class="h-96 w-full max-w-90 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationDrawer ref="drawer" title="Workspace">
        <MdvNavigationDrawerGroup label="Mail">
          <MdvNavigationDrawerItem label="Inbox" :badge="0" :active="current === 'Inbox'" @click="current = 'Inbox'" />
          <MdvNavigationDrawerItem label="Unavailable mailbox" disabled />
        </MdvNavigationDrawerGroup>
        <MdvNavigationDrawerGroup label="Projects" collapsible divider :expanded="expanded" @update:expanded="requestExpanded">
          <template #icon><MdvIcon :icon="folderIcon" /></template>
          <MdvNavigationDrawerItem label="Design" :active="current === 'Design'" aria-label="Design, 3 updates" @click="current = 'Design'">
            <template #badge><MdvBadge variant="large" content="3" /></template>
          </MdvNavigationDrawerItem>
          <MdvNavigationDrawerGroup label="Archive" collapsible>
            <MdvNavigationDrawerItem label="Research" :active="current === 'Research'" @click="current = 'Research'" />
          </MdvNavigationDrawerGroup>
        </MdvNavigationDrawerGroup>
        <MdvNavigationDrawerGroup label="Administration" collapsible disabled divider>
          <MdvNavigationDrawerItem label="Read-only audit log" :active="current === 'Read-only audit log'" @click="current = 'Read-only audit log'" />
        </MdvNavigationDrawerGroup>
      </MdvNavigationDrawer>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Modal drawer

Open the modal drawer with a named button. Provide a close action if readers need one inside the drawer, and give the drawer an accessible name. Bind the model so dismissal requests can close it.

<DemoBlock>
  <DrawerModalDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvIcon, MdvModalNavigationDrawer, MdvNavigationDrawerGroup, MdvNavigationDrawerItem } from '@mdv-ui/mdv'
import inboxIcon from '@iconify-icons/material-symbols/inbox'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const id = `modal-example-${useId()}`
const open = ref(false)
const current = ref('Inbox')
const lastClose = ref('none')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-controls="id" :aria-expanded="open" @click="open = true">Open modal drawer</MdvButton>
    <MdvModalNavigationDrawer :id="id" v-model="open" title="Mail destinations" @closed="lastClose = $event.reason">
      <MdvNavigationDrawerItem label="Inbox" :active="current === 'Inbox'" :badge="12" @click="current = 'Inbox'">
        <template #icon><MdvIcon :icon="inboxIcon" /></template>
      </MdvNavigationDrawerItem>
      <MdvNavigationDrawerItem label="Saved" :active="current === 'Saved'" @click="current = 'Saved'">
        <template #icon><MdvIcon :icon="bookmarkIcon" /></template>
      </MdvNavigationDrawerItem>
      <MdvNavigationDrawerGroup label="Folders" collapsible divider>
        <MdvNavigationDrawerItem label="Reports" :active="current === 'Reports'" @click="current = 'Reports'" />
        <MdvNavigationDrawerItem label="Unavailable folder" disabled />
        <MdvNavigationDrawerItem label="Cancelled navigation" href="#cancelled-navigation" @click.prevent />
        <MdvNavigationDrawerItem label="Open design guide in a new tab" href="https://m3.material.io/components/navigation-drawer/overview" target="_blank" rel="noopener noreferrer" />
      </MdvNavigationDrawerGroup>
      <template #footer="{ close }"><MdvButton variant="text" @click="close()">Close modal drawer</MdvButton></template>
    </MdvModalNavigationDrawer>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · Last close: {{ lastClose }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Responsive layout

MDV does not switch between standard and modal drawers automatically. Choose a breakpoint in your layout and share the active destination between the two presentations.

<DemoBlock>
  <DrawerResponsiveDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvIcon, MdvIconButton, MdvModalNavigationDrawer, MdvNavigationDrawer, MdvNavigationDrawerItem } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'

const workspace = useTemplateRef<HTMLElement>('workspace')
const id = `responsive-example-${useId()}`
const wide = ref(false)
const compact = ref(true)
const modal = ref(false)
const current = ref('Inbox')
const destinations = ['Inbox', 'Saved', 'Archive']
let observer: ResizeObserver | undefined
onMounted(() => {
  const element = workspace.value
  if (!element) return
  const measure = () => { compact.value = element.clientWidth < 600 }
  measure()
  observer = new ResizeObserver(measure)
  observer.observe(element)
})
watch(compact, value => { if (!value) modal.value = false })
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="wide" label="Use a 720px workspace" />
    <div class="overflow-x-auto rounded-xl" role="region" aria-label="Responsive drawer workspace" tabindex="0">
      <div ref="workspace" class="relative isolate flex h-96 overflow-hidden bg-mdv-surface-container-low [contain:layout]" :style="{ inlineSize: wide ? '720px' : 'min(100%, 360px)' }">
        <MdvNavigationDrawer v-if="!compact" title="Mail" width="240px" aria-label="Expanded workspace destinations">
          <MdvNavigationDrawerItem v-for="destination in destinations" :key="destination" :label="destination" :active="current === destination" @click="current = destination" />
        </MdvNavigationDrawer>
        <MdvAppBarScaffold class="min-w-0 flex-1" :content-attrs="{ 'aria-label': 'Responsive workspace content' }">
          <template #appbar>
            <MdvAppBar :title="current" :heading-level="3">
              <template v-if="compact" #leading>
                <MdvIconButton variant="standard" aria-label="Open workspace navigation" :aria-controls="id" :aria-expanded="modal" @click="modal = true"><MdvIcon :icon="menuIcon" /></MdvIconButton>
              </template>
            </MdvAppBar>
          </template>
          <p class="p-5 text-sm text-mdv-on-surface-variant">{{ compact ? 'Compact: modal navigation.' : 'Expanded: standard navigation.' }}</p>
        </MdvAppBarScaffold>
        <MdvModalNavigationDrawer v-if="compact" :id="id" v-model="modal" title="Workspace destinations">
          <MdvNavigationDrawerItem v-for="destination in destinations" :key="destination" :label="destination" :active="current === destination" @click="current = destination" />
        </MdvModalNavigationDrawer>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current destination: {{ current }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## With an App Bar

Place `MdvAppBarScaffold` immediately after a standard drawer in the same flex container to continue the App Bar surface behind the drawer corner.

Use `href` for destinations and derive `active` from the current route when using Vue Router.

---

## API

### MdvNavigationDrawer

<ApiTable :items="drawerProps" />

<SlotsTable :items="drawerSlots" />

Attributes such as `id`, `dir`, `aria-label`, classes, styles, and native listeners reach the navigation surface; custom CSS properties also reach the width track. MDV manages navigation semantics, hidden state, and focusability. The parent supplies layout height; this component does not create a full application shell.

### MdvModalNavigationDrawer

Inherits the shared props above, with `modelValue` defaulting to `false`, and adds:

<ApiTable :items="modalProps" />

It shares the same three slots. `id`, `dir`, ARIA attributes, and native listeners reach the dialog; `class` and `style` reach the panel, with custom CSS properties available to the scrim. It requires native dialog support. The overlay enters the browser's top layer rather than participating in Standard's reserved layout.

### Shared events and methods

<DocsTable label="Drawer lifecycle events" min-width="32rem">

| Event | Payload and timing |
| --- | --- |
| `update:modelValue` | Requested next boolean after an allowed close |
| `open` / `opened` | No arguments; entering starts / finishes |
| `close` / `closed` | `MdvNavigationDrawerCloseDetail`; accepted exit starts / finishes |

</DocsTable>

`MdvNavigationDrawerCloseDetail` contains only `reason`. Standard uses `action` and `model`; Modal also uses `escape`, `scrim`, `select`, and `swipe`. Rejected guards/model requests do not emit an exit lifecycle. Interrupted transitions do not emit an obsolete completion.

<DocsTable label="Drawer exposed methods" min-width="30rem">

| Method | Behavior |
| --- | --- |
| `close(): Promise<boolean>` | Requests guarded action closing and resolves to parent acceptance |
| `focus(): void` | Focuses an available destination/control in the current surface; does not open it |

</DocsTable>

### MdvNavigationDrawerItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

No model or component events. Native attributes and listeners reach the actual button/anchor; buttons are `type="button"`. Link `target`, `rel`, and `download` remain native. Active destinations expose `aria-current="page"`; disabled links omit `href` and use `aria-disabled="true"` and `tabindex="-1"`. Exposed methods: `focus(options?: FocusOptions)` and `blur()`.

### MdvNavigationDrawerGroup

<ApiTable :items="groupProps" />

<SlotsTable :items="groupSlots" />

Event: `update:expanded(value: boolean)` requests a disclosure change. No additional exposed methods. Attributes apply to the outer group list item; native event listeners on collapsible groups reach their disclosure button. MDV owns the nested list, expansion ARIA, and collapsed content state. Use `collapsible`, rather than custom click handlers on a static heading, for expandable navigation.

### Public types

```ts
import type {
  MdvNavigationDrawerProps,
  MdvModalNavigationDrawerProps,
  MdvNavigationDrawerCloseReason,
  MdvNavigationDrawerCloseDetail,
  MdvNavigationDrawerSlotProps,
  MdvNavigationDrawerItemProps,
  MdvNavigationDrawerItemSlotProps,
  MdvNavigationDrawerGroupProps,
  MdvNavigationDrawerGroupSlotProps,
} from '@mdv-ui/mdv'
```

There are no drawer variants, automatic breakpoint props, router models, or recursive disable policies. Compose these explicitly from the supported components and application state.
