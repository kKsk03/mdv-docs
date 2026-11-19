<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FabMenuBasicDemo from '@/components/docs/demos/fabMenu/basic.vue'
import FabMenuAppearanceDemo from '@/components/docs/demos/fabMenu/appearance.vue'
import FabMenuSelectionDemo from '@/components/docs/demos/fabMenu/selection.vue'
import FabMenuControlledDemo from '@/components/docs/demos/fabMenu/controlled.vue'
import FabMenuDialogDemo from '@/components/docs/demos/fabMenu/dialog.vue'

const menuProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false (internal)', description: 'Omit for internal open state. With a bound boolean, the parent must accept update:modelValue requests.' },
  { name: 'variant', type: "'expressive' | 'baseline'", default: "'expressive'", description: 'Expressive presents separate action pills; baseline uses an ordinary MdvMenu above the trigger.' },
  { name: 'color', type: 'MdvFabMenuColor', default: "'primary-container'", description: 'primary-container, secondary-container, tertiary-container, primary, secondary, or tertiary. surface is not supported.' },
  { name: 'size', type: "'regular' | 'medium' | 'large'", default: "'regular'", description: '56, 80, or 96px trigger. Expressive close action is always 56px. There is no small size.' },
  { name: 'elevated', type: 'boolean', default: 'true', description: 'Enables trigger/close shadows and expressive pill hover elevation. Baseline menu elevation still belongs to MdvMenu.' },
  { name: 'position', type: "'static' | 'absolute' | 'fixed'", default: "'static'", description: 'Normal-flow trigger or bottom-end positioning relative to a containing block/viewport. No placement prop.' },
  { name: 'offset', type: 'number', default: '16 / 24', description: 'Edge offset in pixels: 16 by default, 24 at viewport widths of 1200px and above. An explicit non-negative value overrides this; safe areas are additional.' },
  { name: 'label', type: 'string (required)', description: 'Accessible name describing the available actions. Also labels the expressive action group or baseline menu.' },
  { name: 'closeLabel', type: 'string', default: "'关闭菜单'", description: 'Accessible name of the opened expressive close action. Set explicitly for the language of the application.' },
  { name: 'triggerAttrs', type: 'MdvFabMenuTriggerAttrs', description: 'Native button attributes/listeners plus an optional function or Vue ref for the trigger. The component retains its managed trigger semantics.' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', default: "''", description: 'Action label when the default slot is not supplied.' },
  { name: 'icon', type: 'MdvIconData', description: 'Decorative leading icon data; a leading slot takes priority.' },
  { name: 'value', type: 'string | number', description: 'Action identifier in select.detail.value. Zero is a valid value.' },
  { name: 'href', type: 'string', description: 'Renders a native anchor action. Native link attributes are forwarded.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents action callbacks, selection, and navigation. It does not close the menu.' },
  { name: 'keepOpen', type: 'boolean', default: 'false', description: 'Suppresses automatic closing after a non-cancelled selection. Does not create a selected state.' },
]
const menuSlots: SlotTableItem[] = [
  { name: 'default', description: 'Action list built from MdvFabMenuItem. No parameters.' },
  { name: 'icon', description: 'Decorative trigger icon, replacing the default plus. The expressive close X is managed by the component. No parameters.' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: 'Action text, replacing label. No public slot parameters.' },
  { name: 'leading', description: 'Decorative leading icon, taking priority over icon data. No public slot parameters.' },
]
</script>

# FAB Menu

`MdvFabMenu` opens a small set of related primary actions from one floating entry point. Place `MdvFabMenuItem` children inside it. Choose `expressive` for separate action pills, or `baseline` for an ordinary menu attached to the FAB.

## Expressive and baseline

Both presentations share the action data, but have different semantics and keyboard behavior. This example intentionally shows both for comparison.

<DemoBlock>
  <FabMenuBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvFabMenu, MdvFabMenuItem } from '@mdv-ui/mdv'
import type { MdvFabMenuVariant } from '@mdv-ui/mdv'
import noteIcon from '@iconify-icons/material-symbols/note-add-outline'
import photoIcon from '@iconify-icons/material-symbols/add-photo-alternate-outline'
import folderIcon from '@iconify-icons/material-symbols/create-new-folder-outline'

const variants: MdvFabMenuVariant[] = ['expressive', 'baseline']
const message = ref('Choose an action in either presentation.')
const actions = [
  { value: 'document', label: 'New document', icon: noteIcon },
  { value: 'photo', label: 'Add photo', icon: photoIcon },
  { value: 'folder', label: 'New folder', icon: folderIcon },
]
</script>

<template>
  <div class="grid gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="variant in variants" :key="variant" class="relative min-h-72 rounded-xl bg-mdv-surface-container-low p-5 pb-24">
        <p class="font-medium">{{ variant }}</p>
        <p class="mt-3 text-sm text-mdv-on-surface-variant">{{ variant === 'expressive' ? 'Use Tab to visit actions.' : 'Use arrow keys to visit actions.' }}</p>
        <MdvFabMenu :variant="variant" :label="`Create content, ${variant}`" close-label="Close create menu" position="absolute" :offset="16">
          <MdvFabMenuItem v-for="action in actions" :key="action.value" v-bind="action" @select="message = `${variant}: ${$event.detail.value}`" />
        </MdvFabMenu>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Expressive keeps focus on the same trigger when it becomes the close action. The action list is a non-modal `group`: Tab enters its first action and continues in normal order. It does not use menu arrow navigation or trap focus.

Baseline uses `MdvMenu` with `variant="baseline"`, `placement="top-end"`, and a 4px offset. It focuses a menu item on opening and follows the ordinary menu's arrow, Home/End, typeahead, Escape, and Tab behavior. Positioning can flip or shift to fit the viewport.

## Appearance, direction, and local themes

The closed trigger supports 56/80/96px sizes and six colors. Opened expressive menus use a 56px close action aligned to the original trigger's top/end corner while retaining its original layout space.

<DemoBlock>
  <FabMenuAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFabMenu, MdvFabMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvFabMenuColor, MdvFabMenuSize } from '@mdv-ui/mdv'

const size = ref<MdvFabMenuSize>('regular')
const color = ref<MdvFabMenuColor>('primary-container')
const elevated = ref(true)
const disabled = ref(false)
const rtl = ref(false)
const dark = ref(false)
const sizes = ['regular', 'medium', 'large'].map(value => ({ value, label: value }))
const colors = ['primary-container', 'secondary-container', 'tertiary-container', 'primary', 'secondary', 'tertiary'].map(value => ({ value, label: value }))
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4">
      <MdvSelect :model-value="size" :options="sizes" label="Trigger size" @update:model-value="size = $event as MdvFabMenuSize" />
      <MdvSelect :model-value="color" :options="colors" label="Trigger color" @update:model-value="color = $event as MdvFabMenuColor" />
    </div>
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="elevated" label="Elevated surfaces" />
      <MdvCheckbox v-model="disabled" label="Disable trigger" />
      <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
      <MdvCheckbox v-model="dark" label="Local dark theme" />
    </div>
    <div :dir="rtl ? 'rtl' : 'ltr'" :data-mdv-theme="dark ? 'dark' : undefined" class="relative min-h-80 rounded-xl bg-mdv-surface-container-low p-5 pb-32 text-mdv-on-surface">
      <p class="text-sm">Large triggers keep their original layout space while the close action becomes 56px.</p>
      <MdvFabMenu :size="size" :color="color" :elevated="elevated" :trigger-attrs="{ disabled }" label="More creation options" close-label="Close creation options" position="absolute" :offset="16">
        <MdvFabMenuItem label="New note" />
        <MdvFabMenuItem label="Create a shared project folder with a longer label" />
        <MdvFabMenuItem label="Import a template" />
      </MdvFabMenu>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

Expressive action pills are at least 56px high, with 24px icons, 24px horizontal padding, and an 8px icon gap. Adjacent actions have 4px gaps, with 8px before the close action. Long labels can wrap and increase the pill height; a short viewport can scroll the action list while keeping the close control available.

Pills use the selected color family's container/on-container pair, and the close action uses the solid family color/on-color pair. `elevated` affects the trigger, close control, and pill hover shadow. It does not remove the ordinary baseline menu surface's own elevation. Unlike Fab, FabMenu has no `surface` color or `small` size.

## Selection, keeping open, and cancellation

Handle `@select` on an item to perform its action. `event.detail.value` identifies the item; there is no selected-value model. `keep-open` allows repeated actions without closing.

<DemoBlock>
  <FabMenuSelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvFabMenu, MdvFabMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvFabMenuSelectEvent, MdvFabMenuVariant } from '@mdv-ui/mdv'

const variant = ref<MdvFabMenuVariant>('expressive')
const added = ref(0)
const message = ref('Try keeping the menu open or cancelling a link action.')
const variants = ['expressive', 'baseline'].map(value => ({ value, label: value }))

function cancel(event: MdvFabMenuSelectEvent) {
  event.preventDefault()
  message.value = 'Link selection cancelled; navigation and automatic closing were prevented.'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="variant" :options="variants" label="Action presentation" @update:model-value="variant = $event as MdvFabMenuVariant" />
    <div class="relative min-h-88 rounded-xl bg-mdv-surface-container-low p-5 pb-24">
      <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }} · Items added: {{ added }}</p>
      <MdvFabMenu :variant="variant" label="Try selection rules" close-label="Close selection menu" position="absolute" :offset="16">
        <MdvFabMenuItem label="Run and close" value="finish" @select="message = `Selected ${$event.detail.value}.`" />
        <MdvFabMenuItem label="Add another" :value="0" keep-open @select="added++; message = 'Added an item; menu remains open.'" />
        <MdvFabMenuItem label="Cancel link action" href="#cancelled-fab-action" @select="cancel" />
        <MdvFabMenuItem label="Unavailable export" href="#unavailable-fab-action" disabled @select="message = 'This must not run.'" />
      </MdvFabMenu>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

Switch presentations and try Add another, Cancel link action, and Unavailable export. The first keeps the menu open and preserves the numeric value `0`. The second calls `event.preventDefault()` synchronously, cancelling both native link navigation and automatic menu closing. The disabled action cannot invoke its callbacks or navigate.

The event is a cancelable `CustomEvent`, with `{ value, selected: false, originalEvent }` in `detail`. Call `preventDefault()` before an asynchronous boundary if cancellation is needed. Preventing the original click also prevents selection. `keep-open` only changes closing behavior; it does not mark the action selected.

## Controlled state and trigger attributes

Without a model the menu manages opening internally. A controlled parent may accept or reject open/close requests. This example rejects opening until enabled, and can reject one closing request before allowing another attempt.

<DemoBlock>
  <FabMenuControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, shallowRef, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvFabMenu, MdvFabMenuItem } from '@mdv-ui/mdv'
import type { MdvFabMenuTriggerAttrs } from '@mdv-ui/mdv'

const menu = useTemplateRef<InstanceType<typeof MdvFabMenu>>('menu')
const trigger = shallowRef<HTMLButtonElement | null>(null)
const triggerAttrs: MdvFabMenuTriggerAttrs = { ref: trigger, title: 'Create a preview item' }
const open = ref(false)
const allowOpen = ref(false)
const rejectNextClose = ref(false)
const message = ref('Allow opening before requesting the menu.')
const closeReason = ref('(none)')

function update(value: boolean) {
  if (value && !allowOpen.value) message.value = 'Opening rejected.'
  else if (!value && rejectNextClose.value) {
    rejectNextClose.value = false
    message.value = 'Closing rejected once. Try again.'
  } else {
    open.value = value
    message.value = `${value ? 'Opening' : 'Closing'} accepted.`
  }
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="allowOpen" label="Allow opening" />
      <MdvCheckbox v-model="rejectNextClose" label="Reject the next close request" />
    </div>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="menu?.open()">Request open</MdvButton>
      <MdvButton variant="outlined" @click="menu?.close()">Request close</MdvButton>
      <MdvButton variant="text" @click="menu?.toggle()">Toggle menu</MdvButton>
      <MdvButton variant="text" @click="menu?.focus()">Focus trigger</MdvButton>
    </div>
    <div class="relative min-h-64 rounded-xl bg-mdv-surface-container-low p-5 pb-24">
      <p class="text-sm text-mdv-on-surface-variant" role="status">Open: {{ open }} · {{ message }} · Last close: {{ closeReason }}</p>
      <MdvFabMenu ref="menu" :model-value="open" :trigger-attrs="triggerAttrs" label="Controlled creation" close-label="Close controlled creation" position="absolute" :offset="16" @update:model-value="update" @closed="closeReason = $event.reason">
        <MdvFabMenuItem label="Create note" />
        <MdvFabMenuItem label="Create collection" />
      </MdvFabMenu>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

`open()`, `close()`, and `toggle()` request state changes and return `void`. They do not report acceptance or wait for animation; observe the bound model and lifecycle events instead. `focus()` targets the real trigger.

Put trigger-specific native attributes and listeners in `trigger-attrs`. Its `ref` accepts a function or Vue ref and receives the native button; string refs are not supported. Root `class`, `style`, `id`, and `dir` belong to the wrapper. MDV manages the trigger's button type, ID, accessible name, expanded state, and control relationship.

Native `disabled`, `aria-disabled="true"`, and a disabled fieldset prevent trigger activation. A supplied click/keydown listener can prevent its event's default action to stop the corresponding internal activation path.

## Composition inside a dialog

The expressive layer uses the browser's native Popover top layer without teleporting away from its DOM parent. Local themes remain inherited, and the menu can participate in a containing MDV dialog's focus handling.

<DemoBlock>
  <FabMenuDialogDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvFabMenu, MdvFabMenuItem, MdvIcon, MdvTextField } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/create-new-folder-outline'
import noteIcon from '@iconify-icons/material-symbols/note-add-outline'

const open = ref(false)
const name = ref('Reading list')
const message = ref('No content added yet.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Open workspace</MdvButton>
    <MdvDialog v-model="open" title="Workspace actions" role="dialog">
      <div class="relative min-h-72 pb-24">
        <MdvTextField v-model="name" label="Workspace name" full-width autofocus />
        <p class="mt-4 text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
        <MdvFabMenu label="Add to workspace" close-label="Close workspace menu" position="absolute" :offset="0">
          <template #icon><MdvIcon :icon="folderIcon" /></template>
          <MdvFabMenuItem @select="message = `Note added to ${name}.`">
            <template #leading><MdvIcon :icon="noteIcon" /></template>
            Add a note
          </MdvFabMenuItem>
          <MdvFabMenuItem label="Add a collection" :icon="folderIcon" @select="message = `Collection added to ${name}.`" />
        </MdvFabMenu>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template>
    </MdvDialog>
  </div>
</template>
```

  </template>
</DemoBlock>

Open the workspace, enter a name, and choose an action. Escape first closes the active menu; the dialog remains available. This example also customizes the trigger through `#icon` and an action through `#leading`. Supply explicit English `close-label` text because the library's default close name is Chinese.

## Placement, focus, and motion

- `static` keeps the trigger in normal flow. `absolute` and `fixed` use the logical bottom-end position; establish a positioned container for `absolute`. Unlike Fab, FabMenu has no `placement` prop.
- When omitted, edge spacing is 16px below a 1200px viewport and 24px from 1200px upward, plus safe-area insets. An explicit `offset` overrides the responsive distance. Reserve enough space around the trigger and adjacent navigation.
- Expressive is non-modal, without a scrim or page scroll lock. Tab/Shift+Tab move through actions normally; arrow keys do not select actions. Disabled expressive actions are outside the Tab sequence. Baseline follows ordinary menu navigation, including its disabled-item semantics.
- Escape closes and returns focus to the trigger. Outside interaction and focus/Tab departure preserve the newly chosen focus destination. If a focused action disappears or becomes unavailable, the component restores an available trigger.
- Positioning follows scrolling and viewport changes. An anchor that leaves the visible viewport requests an outside close. A controlled parent can reject that request, so keep controlled acceptance policy deliberate.
- MDV supports rapid motion reversal and reduced-motion preferences. Use `opened`/`closed` for completion rather than assuming a method has waited. Native Popover support is required; validate the browser and assistive-technology combinations you support.

## MdvFabMenu API

### Props

<ApiTable :items="menuProps" />

### Slots

<SlotsTable :items="menuSlots" />

### Events

<DocsTable label="FAB menu events" min-width="32rem">

| Event | Payload and timing |
| --- | --- |
| `update:modelValue` | Requested boolean open state; a controlled parent must accept it. |
| `open` | No payload; accepted opening begins. |
| `opened` | No payload; entry motion completes. |
| `close` | `{ reason }`; accepted closing begins. |
| `closed` | `{ reason }`; exit motion completes and the layer is cleaned up. |

</DocsTable>

<DocsTable label="FAB menu close reasons" min-width="32rem">

| Reason | Source |
| --- | --- |
| `trigger` | Trigger/close control activation. |
| `escape` | Escape dismissal. |
| `outside` | Outside pointer interaction or anchor leaving the visible viewport. |
| `focus-out` | Focus leaves the menu interaction. |
| `tab` | Tab moves focus away from the menu interaction. |
| `select` | A non-cancelled item action that does not keep the menu open. |
| `model` | Parent directly changes the bound open state. |
| `programmatic` | An imperative close request. |

</DocsTable>

### Methods and trigger element

<DocsTable label="FAB menu instance API" min-width="31rem">

| Member | Type and purpose |
| --- | --- |
| `open()` | `void`; requests opening. |
| `close()` | `void`; requests closing. |
| `toggle()` | `void`; requests the opposite open state. |
| `focus(options?)` | `void`; focuses the trigger with optional `FocusOptions`. |
| `triggerElement` | Current `HTMLButtonElement`, or null before mount/after unmount. |

</DocsTable>

## MdvFabMenuItem API

### Props

<ApiTable :items="itemProps" />

### Slots

<SlotsTable :items="itemSlots" />

### Event, method, and native attributes

<DocsTable label="FAB menu item event and method" min-width="33rem">

| Member | Meaning |
| --- | --- |
| `select` event | Cancelable `MdvFabMenuSelectEvent`; `detail` contains `value`, `selected: false`, and `originalEvent`. |
| `focus(options?)` | Focuses the item's native action with optional `FocusOptions`. |

</DocsTable>

Items forward native attributes to their action. Expressive renders a native button by default (`type="button"`) or an anchor when `href` is provided. Baseline delegates to `MdvMenuItem`. Use native form and link attributes intentionally, keep the label meaningful, and avoid interactive children inside an action.

### Public types

```ts
import type {
  MdvFabMenuProps,
  MdvFabMenuItemProps,
  MdvFabMenuVariant,
  MdvFabMenuColor,
  MdvFabMenuSize,
  MdvFabMenuTriggerAttrs,
  MdvFabMenuCloseReason,
  MdvFabMenuCloseDetail,
  MdvFabMenuSelectEvent,
} from '@mdv-ui/mdv'
```
