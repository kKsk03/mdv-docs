<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BottomSheetBasicDemo from '@/components/docs/demos/bottomSheet/basic.vue'
import BottomSheetClosePolicyDemo from '@/components/docs/demos/bottomSheet/closePolicy.vue'
import BottomSheetScaffoldDemo from '@/components/docs/demos/bottomSheet/scaffold.vue'
import BottomSheetAppearanceDemo from '@/components/docs/demos/bottomSheet/appearance.vue'

const appearanceProps: ApiTableItem[] = [
  { name: 'title', type: 'string', default: "''", description: 'Visible title and accessible name. Use the header slot for custom content.' },
  { name: 'description', type: 'string', default: "''", description: 'Default body text when the body slot is absent.' },
  { name: 'maxHeight', type: 'string', description: 'Optional CSS height limit. The default follows the responsive top gap and available viewport or scaffold height.' },
  { name: 'showHandle', type: 'boolean', default: 'true', description: 'Displays the native button handle. If hidden, an expand/collapse icon button appears only when two height anchors are available.' },
  { name: 'draggable', type: 'boolean', default: 'true', description: 'Enables pointer/touch dragging. Does not disable handle clicks or explicit actions.' },
  { name: 'expandLabel', type: 'string', default: "'展开面板'", description: 'Accessible name for expanding. Set this for the application locale.' },
  { name: 'collapseLabel', type: 'string', default: "'收起面板'", description: 'Accessible name for collapsing. Set this for the application locale.' },
  { name: 'closeLabel', type: 'string', default: "'关闭面板'", description: 'Accessible name for hiding with the handle. Set this for the application locale.' },
]
const modalProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: 'Controlled visibility. Accept update:modelValue to complete user close requests.' },
  { name: 'expanded', attribute: 'v-model:expanded', type: 'boolean', default: 'false', description: 'Initial expanded state, internally managed when omitted and controlled when supplied. Each opening resets to the current prop.' },
  { name: 'partial', type: 'boolean | number', default: 'true', description: 'True uses half the visible viewport; a number uses a ratio clamped to 0–1. False removes the partial anchor and opens expanded.' },
  ...appearanceProps,
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Allows Escape to request closing through beforeClose.' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: 'Allows scrim clicks to request closing through beforeClose.' },
  { name: 'closeOnSwipe', type: 'boolean', default: 'true', description: 'Allows dragging to the hidden anchor. Does not disable handle-click closing.' },
  { name: 'beforeClose', type: 'MdvBottomSheetBeforeClose', description: 'Synchronous or asynchronous close guard. Returning false or throwing keeps the sheet open. Directly changing the visibility model bypasses the guard.' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: 'Unmounts sheet content after the exit animation. External model state still belongs to the application.' },
]
const scaffoldProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: "'hidden' | 'partial' | 'expanded'", default: "'partial'", description: 'Height state. Internally managed when omitted; controlled when supplied.' },
  { name: 'peekHeight', type: 'number', default: '56', description: 'Visible height in pixels at the partial anchor. This is an MDV default, not a fixed Material requirement.' },
  { name: 'hideable', type: 'boolean', default: 'false', description: 'Allows users to hide via dragging or the handle. Programmatic hidden state and close() remain available when false.' },
  ...appearanceProps,
]
const modalSlots: SlotTableItem[] = [
  { name: 'default', description: 'Body in the shared content scroll area. Replaces description. Receives the shared sheet slot props.' },
  { name: 'header', description: 'Replaces the title header. Receives the shared sheet slot props.' },
  { name: 'actions', description: 'Actions after the body, scrolling with the header and body. Receives the shared sheet slot props.' },
]
const scaffoldSlots: SlotTableItem[] = [
  { name: 'default', description: 'Main page, which stays interactive. This slot has no parameters.' },
  { name: 'sheet', description: 'Scrollable sheet body. Replaces description and receives the shared sheet slot props.' },
  { name: 'header', description: 'Sheet title header. Receives the shared sheet slot props.' },
  { name: 'actions', description: 'Sheet actions after the body, in the shared scroll area. Receives the shared sheet slot props.' },
]
</script>
# Bottom Sheet

Use a Bottom Sheet to show content or actions from the bottom edge. Use `MdvBottomSheet` for a modal or `MdvBottomSheetScaffold` for an in-page sheet.

## Modal sheet

Bind visibility with `v-model` and give the sheet a title. Use `#actions` to provide a close action with an optional result.

<DemoBlock>
  <BottomSheetBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton } from '@mdv-ui/mdv'
import type { MdvBottomSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const result = ref('Choose an action in the sheet.')

function onClose(detail: MdvBottomSheetCloseDetail) {
  result.value = `Closed: ${detail.reason}; result: ${detail.returnValue || '(none)'}`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Open bottom sheet</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvBottomSheet
      v-model="open"
      title="Share this document"
      description="Choose how to share your latest notes."
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
      @close="onClose"
    >
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close()">Cancel</MdvButton>
        <MdvButton @click="close('shared')">Share</MdvButton>
      </template>
    </MdvBottomSheet>
  </div>
</template>
```

  </template>
</DemoBlock>

## Closing policy

Set `before-close` to confirm dismissal. Return `false` or a promise for the decision. Closing by changing the model directly bypasses this guard.

<DemoBlock>
  <BottomSheetClosePolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvBottomSheetBeforeClose } from '@mdv-ui/mdv'

const open = ref(false)
const allowClose = ref(false)
const message = ref('Enable closing before leaving this sheet.')

const beforeClose: MdvBottomSheetBeforeClose = (detail) => {
  if (allowClose.value) return true
  message.value = `The ${detail.reason} request was blocked. Enable closing and try again.`
  return false
}
</script>

<template>
  <MdvButton @click="open = true">Try guarded closing</MdvButton>
  <MdvBottomSheet
    v-model="open"
    title="Review before closing"
    :before-close="beforeClose"
    :close-on-scrim="false"
    :close-on-swipe="false"
    expand-label="Expand sheet"
    collapse-label="Collapse sheet"
    close-label="Close sheet"
  >
    <div class="grid gap-4">
      <p>Scrim clicks and downward dismissal are disabled. Escape, the handle, and Close still use the guard.</p>
      <MdvCheckbox v-model="allowClose" label="Allow this sheet to close" />
      <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
    </div>
    <template #actions="{ close }">
      <MdvButton @click="close('reviewed')">Close</MdvButton>
    </template>
  </MdvBottomSheet>
</template>
```

  </template>
</DemoBlock>

## Standard sheet with Scaffold

Give the scaffold a definite height. Put the page in the default slot and the panel in `#sheet`; the collapsed sheet reserves `peek-height` in the layout.

<DemoBlock>
  <BottomSheetScaffoldDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheetScaffold, MdvButton } from '@mdv-ui/mdv'
import type { MdvBottomSheetState } from '@mdv-ui/mdv'

const state = ref<MdvBottomSheetState>('partial')
const visits = ref(0)
</script>

<template>
  <div class="h-[480px] overflow-hidden rounded-xl border border-mdv-outline-variant bg-mdv-surface">
    <MdvBottomSheetScaffold
      v-model="state"
      title="Nearby places"
      :peek-height="88"
      hideable
      expand-label="Expand places"
      collapse-label="Collapse places"
      close-label="Hide places"
    >
      <div class="grid justify-items-start gap-4 p-5">
        <p class="text-lg font-medium">Explore your neighborhood</p>
        <p class="text-sm text-mdv-on-surface-variant" role="status">Sheet: {{ state }} · Visits: {{ visits }}</p>
        <div class="flex flex-wrap gap-3">
          <MdvButton variant="tonal" @click="visits++">Visit a place</MdvButton>
          <MdvButton variant="outlined" @click="state = 'expanded'">Show places</MdvButton>
        </div>
        <p class="text-sm">The main page remains interactive while this standard sheet is open.</p>
      </div>
      <template #sheet>
        <div class="grid gap-4">
          <p v-for="place in ['Riverside park', 'Community library', 'Art museum', 'Botanical garden', 'Coffee house', 'City market']" :key="place">
            {{ place }}
          </p>
        </div>
      </template>
      <template #actions="{ collapse, close }">
        <MdvButton variant="text" @click="collapse()">Collapse</MdvButton>
        <MdvButton variant="text" @click="close()">Hide</MdvButton>
      </template>
    </MdvBottomSheetScaffold>
  </div>
</template>
```

  </template>
</DemoBlock>

## Handle and sizing

Use `show-handle` for the visible handle and `draggable` to control dragging separately. Add `data-mdv-sheet-no-drag` to custom controls that should not start a drag.

<DemoBlock>
  <BottomSheetAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'

const open = ref(false)
const showHandle = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="showHandle" label="Show drag handle" />
    <MdvButton @click="open = true">Open reading sheet</MdvButton>
    <MdvBottomSheet
      v-model="open"
      title="Reading list"
      :show-handle="showHandle"
      :draggable="false"
      :partial="0.35"
      max-height="70dvh"
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
    >
      <div class="grid gap-4">
        <p>Dragging is disabled. Without a handle, a separate expand/collapse action appears when two height states are available.</p>
        <p v-for="index in 10" :key="index">Reading note {{ index }}: leave room to think and revisit ideas.</p>
      </div>
      <template #actions="{ close }">
        <MdvButton @click="close()">Close reading list</MdvButton>
      </template>
    </MdvBottomSheet>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### MdvBottomSheet props

<ApiTable :items="modalProps" />

### MdvBottomSheet slots

<SlotsTable :items="modalSlots" />

### MdvBottomSheetScaffold props

<ApiTable :items="scaffoldProps" />

### MdvBottomSheetScaffold slots

<SlotsTable :items="scaffoldSlots" />

All panel slots receive `{ state, expanded, close, expand, collapse }`. `state` is the resolved height state; `expanded` is its boolean equivalent. Scaffold's main-page default slot has no slot props.

### Events

<DocsTable label="Bottom sheet events" min-width="38rem">

| Event | Payload | Meaning |
| --- | --- | --- |
| `update:modelValue` | `boolean` / `MdvBottomSheetState` | Visibility request for the modal; height-state request for Scaffold. |
| `update:expanded` | `boolean` | Modal expansion request only. |
| `open` / `opened` | — | Opening starts / opening motion completes. |
| `close` / `closed` | `MdvBottomSheetCloseDetail` | Accepted closing starts / exit motion completes. |
| `change` | `MdvBottomSheetChangeDetail` | Actual height state changes, including geometry changes. |

</DocsTable>

Close details contain `reason` and `returnValue`. Modal reasons are `'escape' | 'scrim' | 'close-button' | 'action' | 'form' | 'model' | 'handle' | 'swipe'` (the shared type includes `close-button`; there is no built-in close button). Scaffold reports `'model' | 'handle' | 'swipe' | 'action'` and always an empty return value. Change details are `{ state, previousState, reason }`, with reason `'model' | 'handle' | 'swipe' | 'action' | 'resize'`.

### Methods

<DocsTable label="Bottom sheet exposed methods" min-width="32rem">

| Method | Result | Meaning |
| --- | --- | --- |
| `close(returnValue?: string)` | `Promise<boolean>` | Requests hiding. The modal uses its guard and result; Scaffold ignores the result argument. |
| `expand()` | `Promise<boolean>` | Requests the expanded anchor. |
| `collapse()` | `Promise<boolean>` | Requests the partial anchor when available. |
| `focus()` | `void` | Focuses the modal or the visible standard sheet's handle/panel. |

</DocsTable>

The promise boolean reports whether the parent accepted the requested state, rather than waiting for the animation. Use `opened` / `closed` for completed enter/exit motion.

### Native attributes and types

For the modal, `class` and `style` customize the panel; CSS custom properties also reach the dialog root, while native ARIA and `dir` apply to the dialog. Scaffold forwards ordinary attributes to its outer root. Put form attributes on the actual form or controls.

```ts
import type {
  MdvBottomSheetState,
  MdvBottomSheetCloseReason,
  MdvBottomSheetChangeReason,
  MdvBottomSheetCloseDetail,
  MdvBottomSheetChangeDetail,
  MdvBottomSheetBeforeClose,
  MdvBottomSheetProps,
  MdvBottomSheetScaffoldProps,
  MdvBottomSheetSlotProps,
} from '@mdv-ui/mdv'
```
