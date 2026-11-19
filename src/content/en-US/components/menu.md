<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import MenuAppearanceDemo from '@/components/docs/demos/menu/appearance.vue'
import MenuSelectionDemo from '@/components/docs/demos/menu/selection.vue'
import MenuActionsDemo from '@/components/docs/demos/menu/actions.vue'
import MenuNestedDemo from '@/components/docs/demos/menu/nested.vue'
import MenuControlledDemo from '@/components/docs/demos/menu/controlled.vue'
import MenuContextDemo from '@/components/docs/demos/menu/context.vue'
import MenuBoundaryDemo from '@/components/docs/demos/menu/boundary.vue'
import MenuDialogDemo from '@/components/docs/demos/menu/dialog.vue'

const menuProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'undefined', description: 'Open state. Omit for internal state, initially closed. When bound, the parent must accept each update request.' },
  { name: 'variant', type: "'expressive' | 'baseline'", default: "'expressive'", description: 'Visual variant. Baseline always resolves to standard color scheme and layout.' },
  { name: 'colorScheme', type: "'standard' | 'vibrant'", default: "'standard'", description: 'Expressive surface and selection colors. Ignored by Baseline.' },
  { name: 'layout', type: "'standard' | 'grouped'", default: "'standard'", description: 'Grouped Expressive menus display direct MenuGroup children as separate surfaces when space allows; scrolling uses a continuous surface instead.' },
  { name: 'submenuMode', type: "'flyout' | 'push'", default: "'flyout'", description: 'Places child panels beside their parent or at the same location with a Back item. Push is an MDV extension.' },
  { name: 'placement', type: 'MdvMenuPlacement', default: "'bottom-start'", description: 'Preferred root placement. Each of top/bottom/left/right also accepts -start or -end. Available viewport space may flip or shift it.' },
  { name: 'offset', type: 'number', default: '4', description: 'Nonnegative placement gap in CSS pixels. Negative values clamp to 0; nonfinite values fall back to 4.' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', default: "''", description: 'Visible action label and typeahead text. The default slot replaces its display.' },
  { name: 'supportingText', type: 'string', default: "''", description: 'Additional text, automatically associated through aria-describedby.' },
  { name: 'trailingText', type: 'string', default: "''", description: 'Decorative trailing text, such as a shortcut hint. Does not register a shortcut.' },
  { name: 'value', type: 'string | number', description: 'Selection value for an ordinary, nonlink item in a selection group. Submenu triggers do not participate in selection.' },
  { name: 'icon', type: 'MdvIconData', description: 'Local leading icon data. A selected choice replaces this area with the built-in check.' },
  { name: 'trailingIcon', type: 'MdvIconData', description: 'Local trailing icon data. A children slot takes priority over trailing content.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks action, selection, and link activation while retaining arrow-key focusability.' },
  { name: 'href', type: 'string', description: 'Creates a native anchor, unless children supplies a submenu. Disabled links omit href.' },
  { name: 'keepOpen', type: 'boolean', default: 'undefined', description: 'Overrides automatic dismissal. Resolved default: true for multiple choices; false for actions, links, and single choices.' },
]
const groupProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvMenuModelValue', default: 'undefined', description: 'Selection state, independent of root open state. Omit for internal state: null for single/none, [] for multiple.' },
  { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Action group, radio-style choice, or checkbox-style choices. Selectable items require a value.' },
  { name: 'label', type: 'string', default: "''", description: 'Visible group heading and accessible group name. The label slot replaces the heading.' },
]
const menuSlots: SlotTableItem[] = [
  { name: 'trigger', description: 'Receives { triggerProps, open, close }. Bind all triggerProps to one native element or a component with one native control root. open is a boolean; close() requests closing.' },
  { name: 'default', description: 'MenuItem, MenuGroup, and Divider content. Receives { open, close }. The panel remains at this DOM location.' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: 'Replaces label. Receives { selected, disabled, expanded }; keep a clear text name for the action.' },
  { name: 'leading', description: 'Replaces the leading icon when not selected; selected items show the built-in check. Receives item state. Decorative, not a place for an independent control.' },
  { name: 'supporting', description: 'Replaces supportingText while preserving its description ID. Receives item state.' },
  { name: 'trailing', description: 'Replaces trailing text/icon, for example with Badge. Receives item state. Hidden from assistive technology; include important counts in the action name.' },
  { name: 'children', description: 'Nested MenuItem/MenuGroup content. No parameters. The item becomes a submenu trigger, taking priority over href, group selection, and trailing content.' },
]
const groupSlots: SlotTableItem[] = [
  { name: 'default', description: 'Items in this group. No parameters.' },
  { name: 'label', description: 'Replaces the visible heading and retains the group naming association. No parameters.' },
]
</script>

# Menu

`MdvMenu` presents temporary actions and small sets of choices. `MdvContextMenu` provides a context-menu trigger; both use `MdvMenuItem` and `MdvMenuGroup`. Use a Select or Autocomplete for a form field, and navigation components for persistent destinations.

## Appearances and trigger binding

Bind the complete `triggerProps` object, including its ref, ID, ARIA attributes, and listeners. The trigger slot's `open` is a boolean, not an opening function. MDV Button and IconButton can receive the object directly; name an icon-only trigger with `aria-label`.

<DemoBlock>
  <MenuAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDivider, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'
import undoIcon from '@iconify-icons/material-symbols/undo'
import copyIcon from '@iconify-icons/material-symbols/content-copy-outline'

const appearances = [
  { variant: 'expressive', colorScheme: 'standard' },
  { variant: 'expressive', colorScheme: 'vibrant' },
  { variant: 'baseline', colorScheme: 'standard' },
] as const
const message = ref('Choose a document action.')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvMenu v-for="appearance in appearances" :key="`${appearance.variant}-${appearance.colorScheme}`" v-bind="appearance">
        <template #trigger="{ triggerProps }">
          <MdvButton v-bind="triggerProps" variant="tonal">{{ appearance.variant }} / {{ appearance.colorScheme }}</MdvButton>
        </template>
        <MdvMenuItem label="Undo" :icon="undoIcon" trailing-text="Ctrl+Z" @select="message = 'Undo requested.'" />
        <MdvMenuItem label="Redo" trailing-text="Ctrl+Y" disabled />
        <MdvDivider />
        <MdvMenuItem label="Duplicate document" supporting-text="Keep the original document." :icon="copyIcon" @select="message = 'A duplicate was created locally.'" />
      </MdvMenu>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Expressive uses a 16px container radius and 20px icons; Baseline uses 4px and 24px. Both retain elevation and at least a 48px action height. Supporting text and long labels can increase the height. Baseline ignores `vibrant` and `grouped`.

## Groups, single choice, and multiple choices

Root `v-model` controls opening. Each group's separate `v-model` controls its choices. Values retain their string/number types. A single choice closes the menu by default; a multiple choice stays open.

<DemoBlock>
  <MenuSelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuModelValue } from '@mdv-ui/mdv'

const scale = ref<MdvMenuModelValue>(1)
const styles = ref<MdvMenuModelValue>(['bold'])
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu layout="grouped">
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Text preferences</MdvButton></template>
      <MdvMenuGroup v-model="scale" selection-mode="single" label="Display scale">
        <MdvMenuItem :value="1" label="Numeric value 1" />
        <MdvMenuItem value="1" label="Text value 1" />
        <MdvMenuItem :value="2" label="Double scale" />
      </MdvMenuGroup>
      <MdvMenuGroup v-model="styles" selection-mode="multiple" label="Text styles">
        <MdvMenuItem value="bold" label="Bold" />
        <MdvMenuItem value="italic" label="Italic" />
        <MdvMenuItem value="underline" label="Underline" disabled />
      </MdvMenuGroup>
    </MdvMenu>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Scale: {{ typeof scale }} {{ JSON.stringify(scale) }} · Styles: {{ JSON.stringify(styles) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Use unique values inside each group. Links and submenu triggers remain actions even inside a selection group. Each submenu starts a new group scope: put a `MdvMenuGroup` inside its `#children` when that level needs selection.

`layout="grouped"` expects direct `MdvMenuGroup` children. Short Expressive menus use 2px gaps and 8px group corners; when height constraints require scrolling, MDV switches to a continuous surface with separators.

## Actions, cancellation, and native links

`@select` receives a cancelable `MdvMenuSelectEvent`. Call `event.preventDefault()` synchronously to cancel selection, native navigation, and automatic dismissal together. For asynchronous permission checks, cancel first and then manage the result and open model in the application.

<DemoBlock>
  <MenuActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuSelectEvent } from '@mdv-ui/mdv'

const count = ref(0)
const message = ref('No action has run.')
function cancel(event: MdvMenuSelectEvent) {
  event.preventDefault()
  message.value = 'The action was cancelled; the menu stays open.'
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="outlined">Document actions</MdvButton></template>
      <MdvMenuItem label="Increment preview counter" keep-open @select="count++" />
      <MdvMenuItem label="Cancel this action" @select="cancel" />
      <MdvMenuItem label="Notifications, 3 unread" @select="message = 'Notifications requested.'">
        <template #trailing><MdvBadge variant="large" content="3" /></template>
      </MdvMenuItem>
      <MdvMenuItem label="Read the menu design guide" href="https://m3.material.io/components/menus/overview" target="_blank" rel="noopener noreferrer" />
      <MdvMenuItem label="Unavailable guide" href="https://m3.material.io/" disabled />
      <MdvMenuItem label="Finish" @select="message = 'Finished.'" />
    </MdvMenu>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Counter: {{ count }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

`event.detail` contains `{ value, selected, originalEvent }`. `selected` is the proposed choice state, not confirmation that a controlled parent accepted it; ordinary actions report `false`. Native `@click.prevent` also cancels built-in activation.

Trailing labels, icons, and badges are decorative. The notification example includes its count in the action label. Shortcut text such as `Ctrl+Z` does not install a keyboard shortcut. Keep independent buttons and form controls outside menu-item slots.

## Nested panels and compact navigation

Place the next level in `#children`. `flyout` supports mouse hover, click, and logical forward/backward arrow keys; `push` places the child at the same position and adds a focusable return row. The return row uses the parent label, falling back to `返回` when empty.

<DemoBlock>
  <MenuNestedDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvMenu, MdvMenuGroup, MdvMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvMenuModelValue, MdvMenuSubmenuMode } from '@mdv-ui/mdv'

const mode = ref<MdvMenuSubmenuMode>('flyout')
const rtl = ref(false)
const font = ref<MdvMenuModelValue>('roboto')
const message = ref('Choose a nested action.')
const modes = [{ value: 'flyout', label: 'flyout' }, { value: 'push', label: 'push' }]
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="mode" :options="modes" label="Submenu mode" @update:model-value="mode = $event as MdvMenuSubmenuMode" />
    <MdvCheckbox v-model="rtl" label="Use right-to-left menus" />
    <div :dir="rtl ? 'rtl' : 'ltr'">
      <MdvMenu :submenu-mode="mode" style="width: 240px">
        <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Formatting</MdvButton></template>
        <MdvMenuItem label="Text">
          <template #children>
            <MdvMenuItem label="Font">
              <template #children>
                <MdvMenuGroup v-model="font" selection-mode="single" label="Font family">
                  <MdvMenuItem value="roboto" label="Roboto" />
                  <MdvMenuItem value="system" label="System default" />
                </MdvMenuGroup>
              </template>
            </MdvMenuItem>
            <MdvMenuItem label="Reset formatting" @select="message = 'Formatting reset.'" />
          </template>
        </MdvMenuItem>
        <MdvMenuItem label="Insert table" @select="message = 'Table requested.'" />
      </MdvMenu>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Font: {{ font }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Choose compact behavior in application code; MDV does not automatically switch submenu mode at a breakpoint. Under RTL, left/right navigation and chevrons reverse. A submenu inherits the tree's appearance and theme, but has its own group context.

## Controlled requests and lifecycle

An explicit boolean model is authoritative. Rejecting an open/close request leaves the state unchanged. Group update events are independent: rejecting a choice does not automatically prevent normal item dismissal, so this example uses `keep-open` for its choices.

<DemoBlock>
  <MenuControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuModelValue } from '@mdv-ui/mdv'

const menu = useTemplateRef<InstanceType<typeof MdvMenu>>('menu')
const open = ref(false)
const acceptOpen = ref(true)
const acceptClose = ref(true)
const acceptChoice = ref(false)
const choice = ref<MdvMenuModelValue>('draft')
const message = ref('Choice changes are initially rejected.')
const lifecycle = ref<string[]>([])
function requestOpen(value: boolean) {
  const accepted = value ? acceptOpen.value : acceptClose.value
  if (accepted) open.value = value
  message.value = `Open ${value}: ${accepted ? 'accepted' : 'rejected'}.`
}
function requestChoice(value: MdvMenuModelValue) {
  if (acceptChoice.value) choice.value = value
  message.value = `Choice ${value}: ${acceptChoice.value ? 'accepted' : 'rejected'}.`
}
function record(event: string) {
  lifecycle.value = [...lifecycle.value, event].slice(-6)
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
      <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
      <MdvCheckbox v-model="acceptChoice" label="Accept choice requests" />
    </div>
    <div class="flex flex-wrap gap-3">
      <MdvMenu ref="menu" :model-value="open" @update:model-value="requestOpen" @open="record('open')" @opened="record('opened')" @close="record(`close: ${$event.reason}`)" @closed="record(`closed: ${$event.reason}`)">
        <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Controlled menu</MdvButton></template>
        <MdvMenuGroup :model-value="choice" selection-mode="single" label="Document stage" @update:model-value="requestChoice">
          <MdvMenuItem value="draft" label="Draft" keep-open />
          <MdvMenuItem value="review" label="Review" keep-open />
        </MdvMenuGroup>
        <MdvMenuItem label="Close controlled menu" />
      </MdvMenu>
      <MdvButton variant="outlined" @click="menu?.open('last')">Open at last item</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Open: {{ open }} · Stage: {{ choice }} · {{ message }}</p>
    <p class="break-words text-xs text-mdv-on-surface-variant">Lifecycle: {{ lifecycle.join(' → ') || 'none' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

`MdvMenuGroup` emits both `update:modelValue` and `change` with the requested next value, including when a parent rejects that proposal. It does not wait for acceptance. An accepted root transition emits `open`/`close`; `opened`/`closed` wait for the corresponding motion to finish. Interrupted transitions do not emit their completion event.

## Context-menu access

The context trigger opens at a mouse right-click position, or below the focused trigger for Shift+F10 and the ContextMenu key. Make a noninteractive trigger focusable yourself. A normal click does not open `MdvContextMenu`.

<DemoBlock>
  <MenuContextDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvContextMenu, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'

const message = ref('No context action selected.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvContextMenu>
      <template #trigger="{ triggerProps }">
        <div v-bind="triggerProps" tabindex="0" class="w-full rounded-xl border border-dashed border-mdv-outline bg-mdv-surface-container p-6 text-sm">
          Right-click this document, or focus here and press Shift+F10.
        </div>
      </template>
      <MdvMenuItem label="Inspect document" @select="message = 'Document details requested.'" />
      <MdvMenuItem label="Archive document" @select="message = 'Document archived locally.'" />
    </MdvContextMenu>
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="outlined">Document options</MdvButton></template>
      <MdvMenuItem label="Inspect document" @select="message = 'Document details requested.'" />
      <MdvMenuItem label="Archive document" @select="message = 'Document archived locally.'" />
    </MdvMenu>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

There is no touch long-press implementation or automatic sheet fallback. Keep a visible ordinary menu entry for touch users and other users who cannot invoke a context menu. Both entries above perform the same local actions.

## Available space, scrolling, and local themes

Set `width`, `max-width`, or `--mdv-menu-max-height` on the root. Floating UI keeps placement within available viewport space, flips/shifts when needed, and updates on scrolling/resizing. An overflowing menu scrolls internally and keeps the focused row visible.

<DemoBlock>
  <MenuBoundaryDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'

const selected = ref('No recent document selected.')
</script>

<template>
  <div class="grid gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="min-w-0 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
        <MdvMenu layout="grouped" placement="bottom-end" :offset="8" style="width: 260px; --mdv-menu-max-height: 220px">
          <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="tonal">{{ theme }} recent files</MdvButton></template>
          <MdvMenuGroup label="Recent documents">
            <MdvMenuItem v-for="number in 8" :key="number" :label="`Document ${number}: a longer project description`" supporting-text="ArchiveExportWithALongUnbrokenSupportingValue" @select="selected = `Document ${number} selected.`" />
          </MdvMenuGroup>
          <MdvMenuGroup label="Workspace"><MdvMenuItem label="Create a document" @select="selected = 'New document requested.'" /></MdvMenuGroup>
        </MdvMenu>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ selected }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Panels use the native manual Popover top layer at their existing DOM location, preserving local MDV themes and direction. They are not teleported to `body`, and do not lock page scrolling. A browser with the Popover API is required. Theme roles supply colors; there is no general `color` prop.

## Dialog composition and focus

A menu can open a dialog, and a menu can live inside a dialog. Keep the owner in charge of focus and avoid manually focusing its trigger after opening a new modal.

<DemoBlock>
  <MenuDialogDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'

const open = ref(false)
const message = ref('No workspace action selected.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Workspace menu</MdvButton></template>
      <MdvMenuItem label="Open workspace dialog" @select="open = true" />
    </MdvMenu>
    <MdvDialog v-model="open" title="Workspace settings" role="dialog" description="Escape closes the topmost menu before closing this dialog.">
      <div class="flex flex-wrap gap-3">
        <MdvMenu>
          <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="tonal">Settings actions</MdvButton></template>
          <MdvMenuItem label="Reset workspace" @select="message = 'Workspace reset locally.'" />
          <MdvMenuItem label="Preview changes" keep-open @select="message = 'Preview requested.'" />
        </MdvMenu>
        <MdvButton variant="text" @click="message = 'Focus continued after the menu.'">After the menu</MdvButton>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Escape closes the deepest menu level first; a menu inside a dialog handles Escape before that dialog. Tab leaves the menu and continues from its trigger's position, staying within the current dialog when applicable. Selecting an action that opens a dialog does not steal focus from the new modal.

## Keyboard and accessibility

<DocsTable label="Menu keyboard behavior" min-width="32rem">

| Input | Behavior |
| --- | --- |
| Trigger click, Enter, Space, ArrowDown | Opens the ordinary menu at its first item |
| Trigger ArrowUp | Opens at its last item |
| ArrowUp / ArrowDown | Cycles through visible items; disabled actions remain focusable but cannot run |
| Home / End | First / last item; headings and separators are excluded |
| Printable prefix | Typeahead over action labels; repeated letters cycle matches |
| Logical forward / backward | Enters / leaves a submenu; directions reverse in RTL |
| Escape | Closes the deepest submenu, then the root |
| Tab / Shift+Tab | Closes the tree and continues outside it; no menu Tab loop |

</DocsTable>

The panel is `role="menu"`; choices are `menuitemradio` or `menuitemcheckbox` with `aria-checked`, while ordinary actions and submenu entries are `menuitem`. Groups have accessible heading associations. Supporting text contributes a description. Disabled items expose `aria-disabled`, rather than losing keyboard discoverability.

Selection, Escape, and programmatic dismissal restore a usable trigger when appropriate. Outside pointer/focus movement and business code that moved focus retain their new target. Reduced motion shortens/removes menu motion. Unmounting and KeepAlive deactivation dispose panels, positioning, timers, and listeners. SSR renders closed panels; an initially true model opens after client mounting.

## API

### MdvMenu and MdvContextMenu

The two roots share the same props, slots, events, and methods; only trigger behavior differs.

<ApiTable :items="menuProps" />

<SlotsTable :items="menuSlots" />

<DocsTable label="Menu root events" min-width="32rem">

| Event | Payload and timing |
| --- | --- |
| `update:modelValue` | Proposed open boolean |
| `open` / `opened` | No arguments; entering starts / finishes |
| `close` / `closed` | `MdvMenuCloseDetail`; exiting starts / finishes |

</DocsTable>

Close reasons: `escape`, `outside`, `focus-out`, `tab`, `select`, `trigger`, `model`, `programmatic`. Child-panel transitions do not repeat root events.

<DocsTable label="Menu root methods" min-width="32rem">

| Method | Behavior |
| --- | --- |
| `open(edge?: 'first' \| 'last')` | Requests opening, defaulting to the first item; needs a bound trigger |
| `close()` | Requests programmatic closing |
| `toggle()` | Requests the opposite open state |
| `focus(edge?: 'first' \| 'last')` | Focuses an item in the existing root panel; does not open it |

</DocsTable>

These methods return no acceptance promise. Other native attributes, classes, styles, and listeners apply to the root menu panel, not its trigger. Explicit `aria-label`/`aria-labelledby` can replace the automatic trigger naming; bind trigger attributes through its slot.

### MdvMenuItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

The `select` event carries `MdvMenuSelectEvent`. Exposed methods: `focus()` and `blur()`. Native attributes and listeners reach the actual button/anchor. Actions are `type="button"` and do not submit forms. Links retain `target`, `rel`, and `download`; disabled actions suppress activation listeners. Children take priority over links and selection.

### MdvMenuGroup

<ApiTable :items="groupProps" />

<SlotsTable :items="groupSlots" />

Events: `update:modelValue(value)` and `change(value)`, both carrying `MdvMenuModelValue`. No exposed methods. Other attributes fall through to the `role="group"` wrapper. None mode emits no selection updates. No hidden form fields are generated.

### Public types and limits

```ts
import type {
  MdvMenuProps, MdvMenuVariant, MdvMenuColorScheme, MdvMenuLayout,
  MdvMenuSubmenuMode, MdvMenuPlacement, MdvMenuSelectionMode,
  MdvMenuValue, MdvMenuModelValue, MdvMenuCloseReason, MdvMenuCloseDetail,
  MdvMenuSelectDetail, MdvMenuSelectEvent, MdvMenuSlotProps,
  MdvMenuTriggerProps, MdvMenuTriggerSlotProps, MdvMenuItemSlotProps,
} from '@mdv-ui/mdv'
```

`MdvMenuProps` also types ContextMenu. There are no separately exported ContextMenu, MenuItem, or MenuGroup props interfaces. Menus do not provide form validation, asynchronous action orchestration, a router, global keyboard shortcuts, or a mobile sheet replacement.
