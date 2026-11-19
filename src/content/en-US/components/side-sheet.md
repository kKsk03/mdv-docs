<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ModalDemo from '@/components/docs/demos/sideSheet/modal.vue'
import StandardDemo from '@/components/docs/demos/sideSheet/standard.vue'
import PolicyDemo from '@/components/docs/demos/sideSheet/policy.vue'
import GuardDemo from '@/components/docs/demos/sideSheet/guard.vue'
import FormDemo from '@/components/docs/demos/sideSheet/form.vue'
import CompositionDemo from '@/components/docs/demos/sideSheet/composition.vue'

const commonProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: 'Controlled visibility. The parent must accept update:modelValue requests for built-in close actions to take effect.' },
  { name: 'title', type: 'string', default: "''", description: 'Panel title and default accessible name. The header slot replaces the title area.' },
  { name: 'description', type: 'string', default: "''", description: 'Fallback body text and accessible description when no panel-content slot is supplied.' },
  { name: 'width', type: 'string', default: "'256px'", description: 'CSS panel width, capped at 400px and the available container. Detached margins reduce the available panel width.' },
  { name: 'placement', type: "'start' | 'end'", default: "'end'", description: 'Logical side, mirrored in RTL. Does not choose Standard versus Modal automatically.' },
  { name: 'detached', type: 'boolean', default: 'false', description: 'Adds 16px surrounding margins and four rounded 16px corners.' },
  { name: 'showBack', type: 'boolean', default: 'false', description: 'Shows a back action. It only emits back; the application decides what changes.' },
  { name: 'backLabel', type: 'string', default: "'返回'", description: 'Accessible back-action name. Override for the application language.' },
  { name: 'closeLabel', type: 'string', default: "'关闭面板'", description: 'Accessible name of the always-present close action. Override for the application language.' },
  { name: 'dividers', type: 'boolean', default: 'false', description: 'Horizontal separators below the header and above actions.' },
  { name: 'beforeClose', type: 'MdvSideSheetBeforeClose', description: 'Synchronous/asynchronous request guard. False, rejected promises, or exceptions keep the sheet open; direct parent model changes bypass it.' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: 'Destroys panel content after exit completes. Defaults to retaining child state and scroll position.' },
]
const modalProps: ApiTableItem[] = [
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Allows the topmost modal sheet to request closure from Escape.' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: 'Allows scrim activation to request closure.' },
  { name: 'closeOnSwipe', type: 'boolean', default: 'true', description: 'Enables dismissal from the 12px edge facing the main content. Vertical body scrolling stays native.' },
]
const scaffoldProps: ApiTableItem[] = [{ name: 'showDivider', type: 'boolean', default: 'true', description: 'Vertical divider between the attached panel and main area. Detached panels do not show it.' }]
const modalSlots: SlotTableItem[] = [
  { name: 'default', description: 'Panel body; receives { close }. Replaces the description fallback.' },
  { name: 'header', description: 'Title-area content; receives { close }. Keeps the built-in close/back controls.' },
  { name: 'actions', description: 'Panel actions; receives { close }. Buttons retain natural widths and can wrap.' },
]
const scaffoldSlots: SlotTableItem[] = [
  { name: 'default', description: 'Adjacent main content. No slot arguments.' },
  { name: 'sheet', description: 'Panel body; receives { close }. Replaces the description fallback.' },
  { name: 'header', description: 'Title-area content; receives { close }. Keeps built-in controls.' },
  { name: 'actions', description: 'Panel actions; receives { close }.' },
]
</script>

# Side Sheet

`MdvSideSheet` presents supplemental content in a modal panel. `MdvSideSheetScaffold` reserves space alongside main content for a Standard panel. This page describes **MDV 0.1.5**. Use Navigation Drawer for destinations and Side Sheet for details or tasks related to the current page.

## Modal appearance, placement, and back actions

Modal sheets use the native dialog top layer, a scrim, and focus containment. `placement` follows logical start/end and mirrors in RTL. Attached panels round the edge facing the content; `detached` adds margins and rounds every corner. The default width is 256px and the maximum is 400px, constrained by the available area.

The close action always exists. `show-back` adds a separate action that emits `back` without automatically closing. The example uses it to return from project history to details. Supply English `close-label`/`back-label` in English interfaces because their library defaults are Chinese.

<DemoBlock>
  <ModalDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvSideSheet, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const detached = ref(false)
const start = ref(false)
const dividers = ref(false)
const detail = ref(false)
const name = ref('Design system')
const message = ref('No sheet closed yet.')
function closed(event: MdvSideSheetCloseDetail) { message.value = `Closed: ${event.reason} · Result: ${event.returnValue || '(empty)'}` }
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="detached" label="Detached" />
      <MdvCheckbox v-model="start" label="Place at start" />
      <MdvCheckbox v-model="dividers" label="Internal dividers" />
    </div>
    <div><MdvButton @click="open = true">Open project details</MdvButton></div>
    <MdvSideSheet v-model="open" :title="detail ? 'Project history' : 'Project details'" width="360px" :placement="start ? 'start' : 'end'" :detached="detached" :dividers="dividers" :show-back="detail" back-label="Back to project details" close-label="Close project details" @back="detail = false" @closed="closed">
      <div v-if="!detail" class="grid gap-4">
        <MdvTextField v-model="name" label="Project name" autofocus full-width />
        <p>Supplement the current page without replacing its content.</p>
        <MdvButton variant="outlined" @click="detail = true">View history</MdvButton>
      </div>
      <ol v-else class="grid gap-4">
        <li v-for="entry in 16" :key="entry">Revision {{ entry }} — component guidance and implementation notes.</li>
      </ol>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" @click="close('done')">Done</MdvButton>
      </template>
    </MdvSideSheet>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Standard layout and independent scrolling

Scaffold needs a bounded-height parent. Its default slot is the main area; `sheet` is the side panel. Opening the panel genuinely reduces the main area's width and closing restores it. Each area scrolls independently. `show-divider` controls the outer vertical boundary; `dividers` controls the internal horizontal separators.

The example caps its custom widths with container-relative lengths to leave usable main content in a narrow embedded preview. Applications normally switch to Modal when the main content can no longer fit. MDV does not choose a breakpoint or switch between these components automatically.

<DemoBlock>
  <StandardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSideSheetScaffold } from '@mdv-ui/mdv'
import type { MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const sheet = useTemplateRef<InstanceType<typeof MdvSideSheetScaffold>>('sheet')
const open = ref(false)
const detached = ref(false)
const start = ref(false)
const wider = ref(false)
const divider = ref(true)
const rtl = ref(false)
const message = ref('The main area is available while the sheet is open.')
function closed(event: MdvSideSheetCloseDetail) { message.value = `Closed: ${event.reason} · Result: ${event.returnValue || '(empty)'}` }
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="detached" label="Detached" />
      <MdvCheckbox v-model="start" label="Place at start" />
      <MdvCheckbox v-model="wider" label="Wider sheet" />
      <MdvCheckbox v-model="divider" label="Outer divider" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div class="h-[400px] min-w-0 overflow-hidden rounded-xl border border-mdv-outline-variant">
      <MdvSideSheetScaffold ref="sheet" v-model="open" title="Details" :width="wider ? 'min(320px, 65cqw)' : 'clamp(180px, 45cqw, 256px)'" :placement="start ? 'start' : 'end'" :detached="detached" :show-divider="divider" :dir="rtl ? 'rtl' : 'ltr'" close-label="Close standard details" @closed="closed">
        <div class="grid min-w-0 gap-4 p-3 break-words">
          <div class="flex flex-wrap gap-2">
            <MdvButton variant="tonal" @click="open = !open">{{ open ? 'Hide' : 'Open' }}</MdvButton>
            <MdvButton v-if="open" variant="text" @click="sheet?.focus()">Focus</MdvButton>
          </div>
          <p v-for="row in 10" :key="row">Document {{ row }}. The main area resizes and scrolls independently.</p>
        </div>
        <template #sheet>
          <div class="grid gap-4"><p v-for="row in 12" :key="row">Property {{ row }}: supplemental project information.</p></div>
        </template>
        <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Done</MdvButton></template>
      </MdvSideSheetScaffold>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Standard is nonmodal: the main area remains interactive, opening does not steal focus, Tab can leave the panel, and Escape is not captured globally. The instance `focus()` explicitly focuses its dialog container. Closing restores earlier focus only when focus is still inside that panel and no nested modal owns it.

## Close policy, controlled acceptance, and retention

Disable individual Modal close policies as needed; the built-in close button remains available. `close()` and slot `close()` request parent acceptance. A result of `true` means the parent accepted the request, while the exit animation may still be running. Wait for `closed` when work requires the final closed state.

`destroy-on-close` removes the child subtree after exit, resetting unbound child fields when reopened. It does not reset state stored by the parent. Directly setting the parent model to false is a programmatic close and bypasses `before-close`.

<DemoBlock>
  <PolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSideSheet, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const sheet = useTemplateRef<InstanceType<typeof MdvSideSheet>>('sheet')
const open = ref(false)
const acceptClose = ref(true)
const escape = ref(true)
const scrim = ref(true)
const swipe = ref(true)
const destroy = ref(false)
const message = ref('No close request yet.')
function update(value: boolean) {
  if (value || acceptClose.value) open.value = value
  else message.value = 'Parent rejected closing.'
}
async function requestClose() { message.value = `close() accepted: ${await sheet.value?.close('requested')}` }
function closed(event: MdvSideSheetCloseDetail) { message.value = `Closed: ${event.reason} · Result: ${event.returnValue || '(empty)'}` }
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="escape" label="Escape closes" />
      <MdvCheckbox v-model="scrim" label="Scrim closes" />
      <MdvCheckbox v-model="swipe" label="Edge swipe closes" />
      <MdvCheckbox v-model="destroy" label="Destroy content on close" />
    </div>
    <div><MdvButton @click="open = true">Open close policy</MdvButton></div>
    <MdvSideSheet ref="sheet" :model-value="open" title="Close policy" width="360px" :close-on-esc="escape" :close-on-scrim="scrim" :close-on-swipe="swipe" :destroy-on-close="destroy" close-label="Request policy close" @update:model-value="update" @closed="closed">
      <div class="grid gap-4">
        <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
        <MdvTextField label="Local draft" placeholder="Close and reopen to compare retention" full-width />
        <MdvButton variant="outlined" @click="requestClose">Request close()</MdvButton>
        <MdvButton variant="text" @click="open = false">Close directly</MdvButton>
        <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
      </div>
    </MdvSideSheet>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Asynchronous unsaved-change decisions

`before-close` receives readonly close details and may return a promise. Concurrent close requests share the pending decision. Returning false keeps the sheet open. The example keeps the decision inside the active panel, resolves it on Keep/Discard, and cancels pending decisions on external close or unmount. Save records the draft before requesting closure.

<DemoBlock>
  <GuardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { MdvButton, MdvSideSheet, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSideSheetBeforeClose, MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const saved = ref('')
const note = ref('')
const dirty = computed(() => note.value !== saved.value)
const pendingReason = ref('')
const message = ref('No notes saved.')
let decision: ((allowed: boolean) => void) | undefined
const beforeClose: MdvSideSheetBeforeClose = detail => {
  if (!dirty.value) return true
  pendingReason.value = detail.reason
  return new Promise<boolean>(resolve => { decision = resolve })
}
function decide(discard: boolean) {
  const resolve = decision
  decision = undefined
  pendingReason.value = ''
  if (discard) note.value = saved.value
  resolve?.(discard)
}
function closed(detail: MdvSideSheetCloseDetail) { message.value = `Closed: ${detail.reason} · Result: ${detail.returnValue || '(empty)'}` }
watch(open, value => { if (!value) decide(false) })
onBeforeUnmount(() => decide(false))
</script>

<template>
  <div class="grid gap-3">
    <div><MdvButton @click="open = true">Edit guarded note</MdvButton></div>
    <MdvSideSheet v-model="open" title="Project note" width="360px" :before-close="beforeClose" close-label="Close project note" @closed="closed">
      <div class="grid gap-4">
        <MdvTextField v-model="note" label="Unsaved note" autofocus full-width />
        <div v-if="pendingReason" role="alert" class="grid gap-3 rounded-xl bg-mdv-secondary-container p-4 text-mdv-on-secondary-container">
          <p>Discard your changes? Close reason: {{ pendingReason }}</p>
          <div class="flex flex-wrap gap-2">
            <MdvButton variant="text" @click="decide(false)">Keep editing</MdvButton>
            <MdvButton variant="text" @click="decide(true)">Discard changes</MdvButton>
          </div>
        </div>
      </div>
      <template #actions="{ close }">
        <MdvButton variant="text" :disabled="!!pendingReason" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" :disabled="!!pendingReason" @click="saved = note; close('save')">Save note</MdvButton>
      </template>
    </MdvSideSheet>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Saved: {{ JSON.stringify(saved) }} · Unsaved: {{ dirty }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

For a synchronous policy, return `false` directly. Exceptions or rejected guards keep the panel open and are logged by MDV; do not use exceptions as ordinary cancellation.

## Native dialog forms

A Modal `form method="dialog"` follows native field validation before MDV handles the accepted submit and requests closure with reason `form`. The submit button's `value` becomes `returnValue`. Capture FormData in the submit handler; do not add `.prevent` if you want the built-in dialog-form close path. A cancel submitter can use `formnovalidate`.

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvSideSheet, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const submitted = ref('No form submitted.')
const result = ref('No close result.')
function submit(event: Event) {
  const form = event.target as HTMLFormElement
  submitted.value = `Form data: ${JSON.stringify([...new FormData(form)])}`
}
function closed(detail: MdvSideSheetCloseDetail) { result.value = `Closed: ${detail.reason} · Result: ${detail.returnValue || '(empty)'}` }
</script>

<template>
  <div class="grid gap-3">
    <div><MdvButton @click="open = true">Open native dialog form</MdvButton></div>
    <MdvSideSheet v-model="open" title="Create a collection" width="360px" detached close-label="Close collection form" @closed="closed">
      <form method="dialog" class="grid gap-4" @submit="submit">
        <MdvTextField name="collection" label="Collection name" required autofocus full-width />
        <div class="flex flex-wrap gap-2">
          <MdvButton type="submit" value="create">Create collection</MdvButton>
          <MdvButton type="submit" value="cancel" variant="text" formnovalidate>Cancel creation</MdvButton>
        </div>
      </form>
    </MdvSideSheet>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ submitted }} · {{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Standard does not intercept dialog-form submission because it has no native modal dialog. Use an ordinary form, handle its submission in the application, and call the scoped `close('saved')` only after saving successfully.

## Local themes, RTL, and nested overlays

Sheets remain in their original DOM tree and inherit local MDV theme variables and direction. This example nests a Side Sheet inside a Dialog and opens a Select listbox in the sheet. Dismiss the current popup/modal before its parent, and keep the close controls named and reachable.

<DemoBlock>
  <CompositionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvSelect, MdvSideSheet } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const dialogOpen = ref(false)
const sheetOpen = ref(false)
const dark = ref(false)
const rtl = ref(false)
const access = ref<MdvSelectValue | null>('team')
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="rounded-xl bg-mdv-surface p-4 text-mdv-on-surface">
      <MdvButton @click="dialogOpen = true">Open document dialog</MdvButton>
      <MdvDialog v-model="dialogOpen" title="Shared document">
        <div class="grid gap-4">
          <p>Open supplemental settings, then dismiss the topmost overlay first.</p>
          <MdvButton variant="outlined" @click="sheetOpen = true">Edit access settings</MdvButton>
          <MdvSideSheet v-model="sheetOpen" title="Access settings" width="360px" detached placement="end" close-label="Close access settings">
            <MdvSelect v-model="access" label="Who can read" :options="[{ value: 'team', label: 'Team members' }, { value: 'public', label: 'Anyone with the link' }]" full-width />
            <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Apply access</MdvButton></template>
          </MdvSideSheet>
          <p role="status">Access: {{ access }}</p>
        </div>
        <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Done</MdvButton></template>
      </MdvDialog>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Accessibility, gestures, and motion

Modal uses `dialog` with `aria-modal=true`, confines focus, locks background scrolling, and restores focus when closed. Standard uses a nonmodal `section role="dialog"` within the layout. Title or header content supplies the panel name; otherwise provide `aria-label` or `aria-labelledby`. The description fallback is associated automatically only when the body slot is absent.

<DocsTable label="Side Sheet interaction">

| Interaction | Modal | Standard |
| --- | --- | --- |
| Tab / Shift+Tab | Stays within the active modal. | Moves normally between panel, main content, and surrounding UI. |
| Escape | Requests closure of the topmost sheet when enabled. | No global Escape dismissal. |
| Close action | Guarded close-button request. | Guarded close-button request. |
| Back action | Emits back without closing. | Emits back without closing. |
| Edge swipe | Enabled by default; respects guards and parent rejection. | Not provided. |

</DocsTable>

Modal's 12px inner edge accepts a horizontal drag toward the hidden side. Direction combines placement and RTL. Short/cancelled/rejected gestures rebound; vertical scrolling and ordinary content interactions stay native. Dragging does not resize the panel; change `width` through application state if needed.

Panel translation, Standard reserved width, and scrim motion run separately without scaling body text. Reduced motion jumps to the accepted state. Test real touch/swipe, nested focus and Escape, screen readers, forced colors, and your final responsive layout separately.

## API

### Shared props

<ApiTable :items="commonProps" />

### MdvSideSheet

<ApiTable :items="modalProps" />

<SlotsTable :items="modalSlots" />

Modal `class` and ordinary styles apply to the panel. CSS custom properties also reach the native dialog so scoped tokens can affect the scrim and panel. ARIA, `dir`, and ordinary dialog attributes apply to the dialog root. Do not move the panel outside its theme scope to solve layout issues.

### MdvSideSheetScaffold

<ApiTable :items="scaffoldProps" />

<SlotsTable :items="scaffoldSlots" />

Scaffold `class`, `style`, and `dir` apply to the layout root; `aria-*` attributes apply to the panel, with `aria-modal` excluded. Root role/tabindex are managed by the implementation. The default slot is main content, so only panel slots receive `close`.

### Events and close reasons

<DocsTable label="Side Sheet events">

| Event | Payload | Meaning |
| --- | --- | --- |
| `update:modelValue` | `boolean` | Requests a visibility change; the parent decides whether to accept. |
| `open` / `opened` | None | Opening begins / finishes. |
| `close` / `closed` | `MdvSideSheetCloseDetail` | Accepted closure begins / finishes, including reason and returnValue. |
| `back` | None | Back control activated; application navigation is separate. |

</DocsTable>

Modal reasons are `model`, `escape`, `scrim`, `close-button`, `action`, `form`, and `swipe`. Standard emits `model`, `close-button`, or `action`. Guard details are readonly; close/closed carry the accepted result. Model-driven closes have an empty return value unless native dialog handling supplied one.

### Slots and exposed methods

Panel slots receive `close(returnValue?: string): Promise<boolean>`. Both instances expose the same `close` and `focus(): void`. False means blocked, rejected, stale, or not currently closable; true reports parent acceptance rather than animation completion. Modal focus follows autofocus/first available control; Standard focus targets the panel itself.

### Public types

```ts
import type {
  MdvSideSheetProps,
  MdvSideSheetScaffoldProps,
  MdvSideSheetPlacement,   // 'start' | 'end'
  MdvSideSheetCloseReason,
  MdvSideSheetCloseDetail, // { reason, returnValue: string }
  MdvSideSheetBeforeClose,
  MdvSideSheetSlotProps,   // { close }
} from '@mdv-ui/mdv'
```
