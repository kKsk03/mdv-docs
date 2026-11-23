<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FabMenuBasicDemo from '@/components/docs/demos/fabMenu/basic.vue'
import FabMenuSelectionDemo from '@/components/docs/demos/fabMenu/selection.vue'
import FabMenuControlledDemo from '@/components/docs/demos/fabMenu/controlled.vue'

const menuProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false (internal)', description: 'Omit for internal open state. With a bound boolean, the parent must accept update:modelValue requests.' },
  { name: 'variant', type: "'expressive' | 'baseline'", default: "'expressive'", description: 'Expressive presents separate action pills; baseline uses an ordinary MdvMenu above the trigger.' },
  { name: 'color', type: 'MdvFabMenuColor', default: "'primary-container'", description: 'primary-container, secondary-container, tertiary-container, primary, secondary, or tertiary. surface is not supported.' },
  { name: 'size', type: "'regular' | 'medium' | 'large'", default: "'regular'", description: '56, 80, or 96px trigger. Expressive close action is always 56px. There is no small size.' },
  { name: 'elevated', type: 'boolean', default: 'true', description: 'Enables trigger/close shadows and expressive pill hover elevation. Baseline menu elevation still belongs to MdvMenu.' },
  { name: 'position', type: "'static' | 'absolute' | 'fixed'", default: "'static'", description: 'Normal-flow trigger or bottom-end positioning relative to a containing block/viewport. No placement prop.' },
  { name: 'offset', type: 'number', default: '16 / 24', description: 'Edge offset in pixels: 16 by default, 24 at viewport widths of 1200px and above. An explicit non-negative value overrides this; safe areas are additional.' },
  { name: 'label', type: 'string', description: 'Accessible name describing the available actions. Also labels the expressive action group or baseline menu.' },
  { name: 'closeLabel', type: 'string', description: 'Accessible name of the close action in the expanded Expressive menu.' },
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

Use `MdvFabMenu` to reveal related actions from a floating action button. Render each action with `MdvFabMenuItem`.

## Expressive and baseline

Use `variant="expressive"` for an expanding action list or `baseline` for a conventional menu. Use `label` to name the trigger and `close-label` to name its close action in the expanded Expressive menu.

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

## Action selection

Handle `select` and read `event.detail.value` to identify the action. Use `keep-open` for repeated actions or call `preventDefault()` to cancel selection.

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

## Open state and trigger attributes

Use `v-model` to control whether the menu is open. Pass native attributes, such as `disabled`, to the built-in button through `trigger-attrs`.

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

---

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
