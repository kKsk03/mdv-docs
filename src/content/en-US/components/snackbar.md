<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DirectDemo from '@/components/docs/demos/snackbar/direct.vue'
import ActionDemo from '@/components/docs/demos/snackbar/action.vue'
import ProviderDemo from '@/components/docs/demos/snackbar/provider.vue'

const snackbarProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: 'Controlled visibility. The parent must accept update:modelValue requests for close actions to take effect.' },
  { name: 'message', type: 'string', default: "''", description: 'Default plain-text message. The default slot replaces it.' },
  { name: 'action', type: 'MdvSnackbarAction', description: 'Optional action label and sync/async onClick callback. An action defaults to a persistent message.' },
  { name: 'duration', type: 'number', description: 'Milliseconds; default is 4000 without an action and 0 with one. Negative values become 0; nonfinite values mean persistent.' },
  { name: 'closable', type: 'boolean', description: 'By default, persistent messages show a close button and timed messages do not.' },
  { name: 'closeLabel', type: 'string', default: "'关闭通知'", description: 'Accessible name for the close button; localize it in the application.' },
  { name: 'actionLayout', type: "'auto' | 'inline' | 'stacked'", default: "'auto'", description: 'Allows the action to wrap, stay inline, or occupy its own line.' },
  { name: 'placement', type: "'bottom' | 'bottom-start'", default: "'bottom'", description: 'Bottom center or logical start side, mirrored in RTL.' },
  { name: 'offset', type: 'number', default: '16', description: 'Additional distance above the bottom safe area in pixels.' },
  { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Pauses the countdown while the pointer is over the message.' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Escape requests closure only while focus is inside this message.' },
  { name: 'focusShortcut', type: 'string | false', default: "'Alt+G'", description: 'Exact modifier shortcut that moves focus into the visible message; false disables it.' },
  { name: 'color', type: 'MdvSnackbarColor', description: 'Optional theme/semantic color or seed color. Omitted uses inverse surface roles.' },
]
const snackbarSlots: SlotTableItem[] = [
  { name: 'default', description: 'Replaces the message content; receives { close }. Keep the message concise and avoid embedding controls.' },
  { name: 'action', description: 'Replaces the built-in action control; receives { close, pending } and should disable itself while pending.' },
]
</script>

# Snackbar

`MdvSnackbar` announces a brief, non-modal message and can provide one related action. This page describes **MDV 0.1.5**. Use a Snackbar for feedback rather than a decision; use a Dialog when the user must respond before continuing.

## Controlled messages and close reasons

Mount the component near the application shell and control visibility with `v-model`. A close button, action, Escape, or timeout requests `false`; the parent can accept or reject that request. The event detail identifies why an accepted close began and when its exit completed.

<DemoBlock>
  <DirectDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvSnackbar } from '@mdv-ui/mdv'
import type { MdvSnackbarCloseDetail, MdvSnackbarPlacement } from '@mdv-ui/mdv'

const visible = ref(false)
const placement = ref<MdvSnackbarPlacement>('bottom')
const result = ref('No message has been shown.')
function togglePlacement() {
  placement.value = placement.value === 'bottom' ? 'bottom-start' : 'bottom'
}
function undo() { result.value = 'Undo action completed.' }
function closed(detail: MdvSnackbarCloseDetail) { result.value = `Closed: ${detail.reason}.` }
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvButton @click="visible = true">Show message</MdvButton>
      <MdvButton variant="outlined" @click="togglePlacement">Placement: {{ placement }}</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvSnackbar v-model="visible" message="Draft deleted." :action="{ label: 'Undo', onClick: undo }" :placement="placement" :duration="0" close-label="Close message" focus-shortcut="Alt+G" />
  </div>
</template>
```

  </template>
</DemoBlock>

Messages without an action default to four seconds. A message with an action defaults to persistent so the user has time to act. Set `duration` and `closable` deliberately, and localize `closeLabel`.

## Async actions and timing

An action may return a Promise. While it is pending, MDV disables the built-in action and pauses its timer. Success requests close unless the `action` event was synchronously canceled with `preventDefault()`; rejection emits `actionError` and leaves the message open. Catch application-level failures inside the callback when using the Provider API, which does not forward `actionError`.

<DemoBlock>
  <ActionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvSnackbar } from '@mdv-ui/mdv'
import type { MdvSnackbarCloseDetail } from '@mdv-ui/mdv'

const visible = ref(false)
const fail = ref(false)
const result = ref('The action result will appear here.')
const snackbar = useTemplateRef<InstanceType<typeof MdvSnackbar>>('snackbar')
function runAction() {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => fail.value ? reject(new Error('The simulated request failed.')) : resolve(), 300)
  })
}
function closed(detail: MdvSnackbarCloseDetail) { result.value = `Closed: ${detail.reason}.` }
function actionError(error: unknown) { result.value = error instanceof Error ? error.message : 'The action failed.' }
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvButton @click="visible = true">Show async action</MdvButton>
      <MdvButton variant="outlined" @click="fail = !fail">Next action: {{ fail ? 'fail' : 'succeed' }}</MdvButton>
      <MdvButton variant="text" @click="snackbar?.pause()">Pause timer</MdvButton>
      <MdvButton variant="text" @click="snackbar?.resume()">Resume timer</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvSnackbar ref="snackbar" v-model="visible" message="Sync the latest draft?" :action="{ label: 'Sync', onClick: runAction }" :duration="1500" closable close-label="Close sync message" @closed="closed" @action-error="actionError" />
  </div>
</template>
```

  </template>
</DemoBlock>

The timer starts after the message enters. Hover, focus within the message, a hidden page, explicit pause, a visible MDV Dialog, and pending built-in actions suspend the countdown and retain remaining time. Changing the message, action label, or duration resets it.

## Provider queue and composable

Use one `MdvSnackbarProvider` around a stable part of the application, then call `useSnackbar()` from a descendant component's `setup`. The Provider maintains an independent FIFO queue; queued messages do not start their timer until displayed. Avoid overlapping separate Providers or standalone Snackbars unless the application intentionally coordinates them.

<DemoBlock>
  <ProviderDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { MdvButton, MdvSnackbarProvider, useSnackbar } from '@mdv-ui/mdv'

const ProviderControls = defineComponent({
  name: 'ProviderControls',
  setup() {
    const snackbar = useSnackbar()
    const result = ref('No provider messages yet.')
    let activeId: string | undefined
    let queuedId: string | undefined
    function showFirst() {
      activeId = snackbar.show({ message: 'Draft saved.', key: 'draft', duration: 0, closable: true })
      result.value = `Active message id: ${activeId}`
    }
    function queueSecond() {
      queuedId = snackbar.show({ message: 'Ready to sync.', duration: 0, closable: true })
      result.value = `Queued message id: ${queuedId}`
    }
    function updateFirst() {
      result.value = `Update accepted: ${activeId ? snackbar.update(activeId, { message: 'Draft saved. Ready to review.' }) : false}`
    }
    function closeFirst() {
      result.value = `Close accepted: ${activeId ? snackbar.close(activeId) : false}`
    }
    function clearAll() {
      snackbar.clear()
      activeId = undefined
      queuedId = undefined
      result.value = 'Provider queue cleared.'
    }
    return () => h('div', { class: 'grid min-w-0 gap-4' }, [
      h('div', { class: 'flex flex-wrap gap-3' }, [
        h(MdvButton, { onClick: showFirst }, { default: () => 'Show first' }),
        h(MdvButton, { variant: 'tonal', onClick: queueSecond }, { default: () => 'Queue second' }),
        h(MdvButton, { variant: 'outlined', onClick: updateFirst }, { default: () => 'Update first' }),
        h(MdvButton, { variant: 'outlined', onClick: closeFirst }, { default: () => 'Close first' }),
        h(MdvButton, { variant: 'text', onClick: clearAll }, { default: () => 'Clear queue' }),
      ]),
      h('p', { class: 'break-words text-sm text-mdv-on-surface-variant', role: 'status' }, result.value),
    ])
  },
})
</script>

<template>
  <MdvSnackbarProvider>
    <ProviderControls />
  </MdvSnackbarProvider>
</template>
```

  </template>
</DemoBlock>

`show()` accepts a string or options and returns an ID. `update()` changes the active or queued entry; `close()` closes the active item or removes a queued one; `clear()` removes queued items and requests closure of the active message. A `key` reuses and updates a matching active or queued entry instead of adding another. Unmounting the Provider clears its queue.

## Accessibility, placement, and themes

The message uses a polite `role="status"` live region and does not move focus on open or trap Tab. The default `Alt+G` shortcut focuses its first available control (or the message container); Escape is handled only while focus is inside this Snackbar, so it does not close a parent Dialog from elsewhere. Focus is restored on close only when the message owned focus. Timed announcements should also be reflected in context at the point where the action occurred; actual screen-reader announcements depend on the browser/assistive-technology combination.

Placement follows logical direction, respects bottom safe areas, and supports reduced motion. `offset` can keep the message clear of application-owned navigation or floating controls. Default colors use inverse-surface roles; a supplied theme or seed color is local to the Snackbar. Browsers with the Popover API place it in the top layer at its original DOM location so local theme inheritance is retained; the fallback is fixed positioning and may remain subject to ancestor stacking contexts.

## API

### MdvSnackbar props

<ApiTable :items="snackbarProps" />

### Slots

<SlotsTable :items="snackbarSlots" />

### Events and exposed methods

<DocsTable label="Snackbar events">

| Event | Payload | Meaning |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Visibility request; parent acceptance controls the actual close. |
| `open` / `opened` | none | Opening starts / entrance completes. |
| `close` / `closed` | `MdvSnackbarCloseDetail` | Accepted close starts / exit completes; includes a reason. |
| `action` | `MouseEvent` | Built-in action was activated; synchronously prevent the event default to keep the message open. |
| `actionError` | `unknown` | The built-in action callback threw or rejected. |

</DocsTable>

Close reasons are `timeout`, `escape`, `close-button`, `action`, `programmatic`, and `model`. The instance exposes `close()`, `focus()`, `pause()`, and `resume()`.

### Provider and `useSnackbar()`

`MdvSnackbarProvider` has a default slot for application content. It exposes no props or component events. The `useSnackbar()` composable must run in a descendant setup context and returns `MdvSnackbarProviderApi`:

<DocsTable label="Snackbar Provider methods">

| Method | Result |
| --- | --- |
| `show(input: MdvSnackbarInput): string` | Adds or reuses a message and returns its ID. |
| `update(id, patch): boolean` | Updates a matching active/queued message. |
| `close(id): boolean` | Requests closure or removes a queued message. |
| `clear(): void` | Clears the queue and closes the active message. |

</DocsTable>

### Public types

```ts
import type {
  MdvSnackbarProps, MdvSnackbarOptions, MdvSnackbarInput, MdvSnackbarAction,
  MdvSnackbarColor, MdvSnackbarActionLayout, MdvSnackbarPlacement,
  MdvSnackbarCloseReason, MdvSnackbarCloseDetail, MdvSnackbarSlotProps,
  MdvSnackbarActionSlotProps, MdvSnackbarSlots, MdvSnackbarProviderApi,
} from '@mdv-ui/mdv'
```