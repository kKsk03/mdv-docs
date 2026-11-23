<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ModalDemo from '@/components/docs/demos/sideSheet/modal.vue'
import StandardDemo from '@/components/docs/demos/sideSheet/standard.vue'
import GuardDemo from '@/components/docs/demos/sideSheet/guard.vue'
import FormDemo from '@/components/docs/demos/sideSheet/form.vue'

const commonProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: 'Controlled visibility. The parent must accept update:modelValue requests for built-in close actions to take effect.' },
  { name: 'title', type: 'string', default: "''", description: 'Panel title and default accessible name. The header slot replaces the title area.' },
  { name: 'description', type: 'string', default: "''", description: 'Fallback body text and accessible description when no panel-content slot is supplied.' },
  { name: 'width', type: 'string', default: "'256px'", description: 'CSS panel width, capped at 400px and the available container. Detached margins reduce the available panel width.' },
  { name: 'placement', type: "'start' | 'end'", default: "'end'", description: 'Logical side, mirrored in RTL. Does not choose Standard versus Modal automatically.' },
  { name: 'detached', type: 'boolean', default: 'false', description: 'Adds 16px surrounding margins and four rounded 16px corners.' },
  { name: 'showBack', type: 'boolean', default: 'false', description: 'Shows a back action. It only emits back; the application decides what changes.' },
  { name: 'backLabel', type: 'string', description: 'Accessible name of the back action when showBack is enabled.' },
  { name: 'closeLabel', type: 'string', description: 'Accessible name of the close button.' },
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

Use a Side Sheet for details or actions related to the current page. `MdvSideSheet` opens a modal panel; `MdvSideSheetScaffold` reserves room for a standard panel beside the page.

## Modal sheet

Bind `v-model` to open the modal. Set `placement` to `start` or `end`, and use `detached` for a panel with margins. Give the panel a title or an accessible name.

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

## Standard sheet

Place the main content in the default slot and the panel in `#sheet`. Give the scaffold a definite height so the content and sheet can scroll independently.

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

## Confirm before closing

Use `before-close` to confirm unsaved edits. Return `false` to keep the panel open; a promise lets you wait for the decision. Setting the model to `false` directly bypasses the guard.

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

## Dialog forms

Inside a modal, use `method="dialog"` to validate the native form before requesting closure. The submitter’s `value` becomes `returnValue`; do not prevent the submit event if you want this built-in behavior.

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

---

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
