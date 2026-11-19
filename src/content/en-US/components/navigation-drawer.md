<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DrawerBasicDemo from '@/components/docs/demos/navigationDrawer/basic.vue'
import DrawerGroupsDemo from '@/components/docs/demos/navigationDrawer/groups.vue'
import DrawerModalDemo from '@/components/docs/demos/navigationDrawer/modal.vue'
import DrawerPolicyDemo from '@/components/docs/demos/navigationDrawer/policy.vue'
import DrawerGuardDemo from '@/components/docs/demos/navigationDrawer/guard.vue'
import DrawerResponsiveDemo from '@/components/docs/demos/navigationDrawer/responsive.vue'
import DrawerCompositionDemo from '@/components/docs/demos/navigationDrawer/composition.vue'

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

`MdvNavigationDrawer` reserves space beside application content. `MdvModalNavigationDrawer` overlays content with a scrim and modal focus management. Both share `MdvNavigationDrawerItem` and `MdvNavigationDrawerGroup`.

These are the classic Material Design 3 drawers. Use them for destinations in a larger hierarchy; an expanded Navigation Rail is another option for an Expressive application. Choosing the navigation pattern and its responsive breakpoints belongs to the application.

## Standard layout and width

Place the standard drawer before a `min-width: 0` content sibling in a flex layout with a defined height. It contributes its panel width while open and zero width after closing, without locking background scrolling or taking focus on opening.

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

The default width is `360px`, constrained by the parent's available space. Pass another CSS length with `width`. Ordinary destination activation keeps a standard drawer open. `active` is presentation and current-page state; the application owns destination changes.

Root open state is controlled: bind `v-model` to support closing and reopening. Without a binding, Standard remains at its default open state and Modal remains closed. This differs from a group's optional internally managed expansion.

## Section headings, disclosures, and badges

A group with `collapsible` omitted is a static section heading. Add `collapsible` for an expandable submenu; `divider` adds a separator before the group. Use the item's `badge` slot for a visual badge or localized trailing text.

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

Toggle acceptance to distinguish an expansion request from an accepted state change. Collapsed descendants remain mounted but become inert and hidden from accessibility APIs. If focus was inside a collapsing group, MDV returns it to the disclosure button. Nested collapsible groups add 12px of logical indentation per level; static sections do not add another depth.

Disabling a group disables its disclosure, not its children. The enabled audit-log destination above remains available. Disable individual items when their actions must be unavailable. Numeric `badge="0"` is not discarded. Important counts need an accessible name, such as `aria-label="Design, 3 updates"`, in addition to their visual badge.

## Modal navigation

Open the modal drawer with a named button. There is no built-in close icon; provide one in a slot when needed. The native dialog enters the top layer, locks document scrolling, and keeps focus within the topmost modal. An `autofocus` control is preferred; otherwise the first available control receives focus.

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

An ordinary destination selection requests closing with reason `select`. A group disclosure only expands or collapses. Disabled items, `@click.prevent`, modified clicks, links with a new-window target, and downloads do not cause normal automatic dismissal. Cancelling a click also cancels native navigation; it does not undo state changes your own handler already made.

Supply a distinct title, `aria-label`, or `aria-labelledby`. If none is provided, the fallback navigation name is `主导航`; name English instances explicitly. After closing, focus returns to a usable opening control when appropriate, without overriding a newer modal or an intentional external focus destination.

## Closing policy, state retention, and parent acceptance

Modal closing controls are independent and enabled by default. The slot/exposed `close()` returns a promise telling you whether the parent accepted closing; `true` does not mean the exit animation has finished. Listen to `closed` for that point.

<DemoBlock>
  <DrawerPolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvCheckbox, MdvModalNavigationDrawer, MdvNavigationDrawerItem, MdvTextField } from '@mdv-ui/mdv'
import type { MdvNavigationDrawerCloseDetail } from '@mdv-ui/mdv'

const id = `policy-example-${useId()}`
const open = ref(false)
const closeOnEsc = ref(true)
const closeOnScrim = ref(true)
const closeOnSelect = ref(true)
const closeOnSwipe = ref(true)
const destroy = ref(false)
const blockClose = ref(false)
const acceptClose = ref(true)
const message = ref('No close requested.')
function beforeClose(detail: Readonly<MdvNavigationDrawerCloseDetail>) {
  message.value = `Guard ${detail.reason}: ${blockClose.value ? 'blocked' : 'allowed'}.`
  return !blockClose.value
}
function update(value: boolean) {
  if (value || acceptClose.value) open.value = value
  else message.value = 'The parent rejected the close request.'
}
async function closeDrawer(close: () => Promise<boolean>) {
  message.value = `Close accepted: ${await close()}.`
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="closeOnEsc" label="Close on Escape" />
      <MdvCheckbox v-model="closeOnScrim" label="Close on scrim" />
      <MdvCheckbox v-model="closeOnSelect" label="Close on selection" />
      <MdvCheckbox v-model="closeOnSwipe" label="Close on swipe" />
      <MdvCheckbox v-model="destroy" label="Destroy closed content" />
      <MdvCheckbox v-model="blockClose" label="Block guarded closes" />
      <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
    </div>
    <div><MdvButton :aria-controls="id" :aria-expanded="open" @click="open = true">Open policy drawer</MdvButton></div>
    <MdvModalNavigationDrawer :id="id" :model-value="open" title="Drawer close policy" :close-on-esc="closeOnEsc" :close-on-scrim="closeOnScrim" :close-on-select="closeOnSelect" :close-on-swipe="closeOnSwipe" :destroy-on-close="destroy" :before-close="beforeClose" @update:model-value="update">
      <MdvNavigationDrawerItem label="Choose this destination" />
      <template #footer="{ close }">
        <div class="grid gap-3">
          <MdvTextField label="Retained navigation note" placeholder="Type, close, and reopen" full-width />
          <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
          <div class="flex flex-wrap gap-2">
            <MdvButton variant="text" @click="closeDrawer(close)">Request guarded close</MdvButton>
            <MdvButton variant="text" @click="open = false">Close by model</MdvButton>
          </div>
        </div>
      </template>
    </MdvModalNavigationDrawer>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Try blocking guarded closes, then rejecting model requests. Both keep the drawer open. Assigning the model to `false` directly closes with reason `model`, bypassing `beforeClose`. Concurrent close requests are coalesced, and an obsolete asynchronous result cannot close a newer drawer session.

Content is retained by default. Type into the uncontrolled note field, close, and reopen to compare it with `destroy-on-close`. Destroying content occurs after exit and resets that field's internal state, while application-owned models remain the application's responsibility.

Swipe dismissal starts on eligible drawer content and moves toward the logical starting edge, reversing in RTL. Passing half the panel width or exceeding a closing velocity of 400px/s can commit the gesture. Incomplete, cancelled, guarded, or parent-rejected swipes return to the open position. Vertical scrolling and editable controls retain their native interactions. Use real touch input to validate your application's gesture composition.

## Asynchronous unsaved-content confirmation

Return a promise from `beforeClose` when leaving requires confirmation. Keep the confirmation dialog as a sibling rather than mounting it inside content that is about to disappear. Resolve the promise on every decision and on teardown.

<DemoBlock>
  <DrawerGuardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref, useId } from 'vue'
import { MdvButton, MdvDialog, MdvModalNavigationDrawer, MdvNavigationDrawerItem, MdvTextField } from '@mdv-ui/mdv'

const id = `guard-example-${useId()}`
const open = ref(false)
const confirming = ref(false)
const note = ref('')
const message = ref('Type a note in the drawer, then try closing it.')
let resolveClose: ((allowed: boolean) => void) | undefined
function beforeClose() {
  if (!note.value.trim()) return true
  confirming.value = true
  return new Promise<boolean>(resolve => { resolveClose = resolve })
}
function answer(allowed: boolean) {
  confirming.value = false
  if (allowed) note.value = ''
  message.value = allowed ? 'The note was discarded.' : 'Keep editing the note.'
  resolveClose?.(allowed)
  resolveClose = undefined
}
onBeforeUnmount(() => resolveClose?.(false))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-controls="id" :aria-expanded="open" @click="open = true">Open guarded drawer</MdvButton>
    <MdvModalNavigationDrawer :id="id" v-model="open" title="Draft workspace" :before-close="beforeClose">
      <MdvNavigationDrawerItem label="Draft destination" active />
      <template #footer="{ close }">
        <div class="grid gap-3">
          <MdvTextField v-model="note" label="Unsaved navigation note" full-width />
          <MdvButton variant="text" @click="close()">Leave draft workspace</MdvButton>
        </div>
      </template>
    </MdvModalNavigationDrawer>
    <MdvDialog :model-value="confirming" title="Discard navigation note?" role="dialog" description="This local note has not been saved." @update:model-value="answer(false)">
      <template #actions>
        <MdvButton variant="text" @click="answer(false)">Keep editing</MdvButton>
        <MdvButton variant="text" @click="answer(true)">Discard and close</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

The local note has no persistence service: Discard clears it and permits the original close, while Keep editing rejects that close. A thrown/rejected guard reports an error and keeps the drawer open. A guard controls dismissal, not destination state: defer your own routing or active-state changes as well when they require approval.

## Responsive composition

Standard and Modal do not switch automatically. Observe the application's available width, preserve shared destination state, and mount the appropriate drawer. This example uses a **600px workspace breakpoint**, independent of the documentation site's own drawer breakpoint.

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

The preview can grow to 720px inside its own horizontal scroll region. On compact workspaces, the App Bar shows a menu action and destinations open in a modal; on expanded workspaces, Standard stays beside the content. Returning to expanded layout clears the modal model and disposes its overlay. The modal still covers the real browser viewport; it is not clipped to the preview.

## App Bar adjacency, scrolling, and local themes

Keep `MdvAppBarScaffold` as the **immediately following sibling** of Standard inside their shared flex container. MDV uses that adjacency to carry the App Bar's surface behind the drawer's content-side rounded corner, including during theme transitions.

<DemoBlock>
  <DrawerCompositionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvNavigationDrawer, MdvNavigationDrawerGroup, MdvNavigationDrawerItem } from '@mdv-ui/mdv'

const open = ref(true)
const dark = ref(false)
const rtl = ref(false)
const current = ref('Inbox')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="open" label="Show composed drawer" />
      <MdvCheckbox v-model="dark" label="Use a local dark theme" />
      <MdvCheckbox v-model="rtl" label="Use right-to-left composition" />
    </div>
    <div class="overflow-x-auto rounded-xl" role="region" aria-label="Drawer and app bar composition" tabindex="0">
      <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="flex h-80 min-w-0 overflow-hidden bg-mdv-surface-container-low text-mdv-on-surface" style="inline-size: max(100%, 640px)">
        <MdvNavigationDrawer v-model="open" title="Mail" width="240px">
          <MdvNavigationDrawerItem label="Inbox" :active="current === 'Inbox'" @click="current = 'Inbox'" />
          <MdvNavigationDrawerGroup label="Folders" divider>
            <MdvNavigationDrawerItem v-for="number in 12" :key="number" :label="`Project ${number}: a long destination label`" :active="current === `Project ${number}`" :badge="number" @click="current = `Project ${number}`" />
          </MdvNavigationDrawerGroup>
        </MdvNavigationDrawer>
        <MdvAppBarScaffold class="min-w-0 flex-1" :content-attrs="{ 'aria-label': 'Composed workspace content' }">
          <template #appbar><MdvAppBar :title="current" :heading-level="3" /></template>
          <div class="grid gap-4 p-5 text-sm">
            <p v-for="number in 8" :key="number">Workspace section {{ number }}. Scroll this content and compare the drawer corner with the app bar.</p>
          </div>
        </MdvAppBarScaffold>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

Use `surface-container-low` for the common composition background, while allowing the drawer and App Bar to keep their own surface roles. Do not apply one background to every panel to hide a mismatch. The destination list scrolls independently; headers and footers remain outside it. Scaffold content has its own scrolling area.

Switch the local theme and RTL controls and compare the corner while opening/closing. Standard uses `surface` without a shadow; Modal uses `surface-container-low`, elevation level 1, and a 32% scrim. Content-side corners are 16px; destination rows are at least 56px high with 24px icons. Active destinations use `secondary-container` and `on-secondary-container`.

## Routing, keyboard, and semantics

Use real `href` values for navigation. With Vue Router's custom `RouterLink` slot, bind `href` and `isExactActive` to an item and handle `click` with `navigate`; do not place another interactive anchor inside the item. MDV does not bundle a router, choose the active destination, or generate route URLs. With asynchronous route guards, decide whether to keep a modal open until navigation is accepted.

The surface is a navigation landmark with list semantics. Groups and destinations are not an ARIA menu, tree, or tablist. Give multiple navigation regions distinct names.

<DocsTable label="Drawer keyboard behavior" min-width="30rem">

| Input | Behavior |
| --- | --- |
| Tab / Shift+Tab | Visits enabled controls in normal order; Modal confines focus to the topmost dialog |
| ArrowUp / ArrowDown | Moves among visible enabled destinations and disclosure buttons without changing the active destination |
| Home / End | Focuses the first / last available navigation row |
| Enter / Space on a button | Activates its native action; a disclosure toggles expansion |
| Enter on a link | Follows native link navigation |
| Escape | Requests closing the topmost Modal when enabled; Standard stays open |

</DocsTable>

Text fields and other editing controls keep their own keyboard behavior. Disabled destinations and collapsed descendants are excluded from directional navigation. Reduced motion removes or shortens panel, width, disclosure, and state transitions. Validate actual layout, focus restoration, touch gestures, and larger text in the target browsers.

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
