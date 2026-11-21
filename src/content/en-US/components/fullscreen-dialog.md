<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FullscreenBasicDemo from '@/components/docs/demos/fullscreenDialog/basic.vue'
import FullscreenFormDemo from '@/components/docs/demos/fullscreenDialog/form.vue'
import FullscreenAsyncDemo from '@/components/docs/demos/fullscreenDialog/async.vue'
import FullscreenGuardDemo from '@/components/docs/demos/fullscreenDialog/guard.vue'

const dialogProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: 'Controls the modal. A requested close needs the parent to accept update:modelValue=false.' },
  { name: 'title', type: 'string', default: "''", description: 'Visible header title and automatic accessible naming source unless overridden by the title slot or explicit ARIA.' },
  { name: 'description', type: 'string', default: "''", description: 'Simple body text and automatic accessible description. The default slot replaces this content and its automatic description association.' },
  { name: 'closable', type: 'boolean', default: 'true', description: 'Shows the built-in header close button. Does not disable Escape or application actions.' },
  { name: 'closeLabel', type: 'string', default: "'关闭对话框'", description: 'Accessible name of the built-in close action. Set explicitly for the application language.' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Allows the top dialog to request Escape dismissal, excluding IME composition.' },
  { name: 'beforeClose', type: 'MdvDialogBeforeClose', description: 'Synchronous/asynchronous close guard. false rejects closing; direct parent model changes bypass the guard.' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: 'Unmounts rendered content after exit completes. Otherwise internal content is retained; external models are not cleared.' },
]
const dialogSlots: SlotTableItem[] = [
  { name: 'title', description: 'Custom content in the existing header heading, retaining its ID and accessible association. No parameters.' },
  { name: 'default', description: 'Structured body or form replacing description. Complex content is not automatically announced as one description. No parameters.' },
  { name: 'actions', description: 'Header end actions, usually a concise Save or Done action. Receives { close }, where close(returnValue?: string): Promise<boolean>.' },
  { name: 'footer', description: 'Optional bottom action area outside the scrolling body. Receives the same { close } callback.' },
]
</script>
# Fullscreen Dialog

Use `MdvFullscreenDialog` for a task that needs the entire screen, such as editing a form.

## Header and footer

Bind `v-model`, provide a title, and put the main action in `#actions`. Use `#footer` for controls that should stay outside the scrolling body.

<DemoBlock>
  <FullscreenBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvFullscreenDialog } from '@mdv-ui/mdv'

const open = ref(false)
const result = ref('No result yet.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Review workspace</MdvButton>
    <MdvFullscreenDialog v-model="open" title="Review workspace" description="Review your workspace before continuing. This dialog fills the viewport on desktop and mobile." close-label="Close workspace review" @closed="result = `${$event.reason} · ${$event.returnValue || '(no result)'}`">
      <template #actions="{ close }"><MdvButton variant="text" @click="close('approved')">Approve</MdvButton></template>
      <template #footer="{ close }"><MdvButton variant="text" @click="close('cancelled')">Cancel</MdvButton></template>
    </MdvFullscreenDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Submit a form

Give the body form an ID. Set `type="submit"` and `form` on the header action to submit it with native validation.

<DemoBlock>
  <FullscreenFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvFullscreenDialog, MdvTextField } from '@mdv-ui/mdv'

const dialog = useTemplateRef<InstanceType<typeof MdvFullscreenDialog>>('dialog')
const formId = `workspace-form-${useId()}`
const open = ref(false)
const name = ref('')
const result = ref('Create a workspace to see its saved name.')

async function save() {
  if (await dialog.value?.close('saved')) result.value = `Saved: ${name.value}`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Create workspace</MdvButton>
    <MdvFullscreenDialog ref="dialog" v-model="open" title="New workspace" close-label="Close new workspace">
      <form :id="formId" class="mx-auto grid max-w-2xl gap-5" @submit.prevent="save">
        <MdvTextField v-model="name" label="Workspace name" name="workspace" required full-width autofocus />
        <p class="text-sm">The Save button lives in the header and submits this form through its form attribute.</p>
      </form>
      <template #actions><MdvButton variant="text" type="submit" :form="formId">Save</MdvButton></template>
      <template #footer="{ close }"><MdvButton variant="text" @click="close('cancelled')">Cancel</MdvButton></template>
    </MdvFullscreenDialog>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Async saving

Keep the draft and show an error if saving fails. Disable the save action while pending and close only after success.

<DemoBlock>
  <FullscreenAsyncDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvFullscreenDialog, MdvTextField } from '@mdv-ui/mdv'

const dialog = useTemplateRef<InstanceType<typeof MdvFullscreenDialog>>('dialog')
const formId = `publish-form-${useId()}`
const open = ref(false)
const title = ref('Field notes')
const fail = ref(true)
const saving = ref(false)
const message = ref('The first save can simulate a failure.')
let timer: ReturnType<typeof setTimeout> | undefined

function save() {
  if (saving.value) return
  saving.value = true
  message.value = 'Saving…'
  // A local simulation. No network request is made.
  timer = setTimeout(async () => {
    timer = undefined
    saving.value = false
    if (fail.value) message.value = 'Save failed. Your draft is still available; disable failure and retry.'
    else if (await dialog.value?.close('saved')) message.value = `Saved: ${title.value}`
  }, 600)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton variant="tonal" @click="open = true">Try asynchronous save</MdvButton>
    <MdvFullscreenDialog ref="dialog" v-model="open" title="Publish notes" close-label="Close publishing" :before-close="() => !saving">
      <form :id="formId" class="mx-auto grid max-w-2xl gap-5" @submit.prevent="save">
        <MdvTextField v-model="title" label="Document title" required full-width autofocus :disabled="saving" />
        <MdvCheckbox v-model="fail" label="Simulate a save failure" :disabled="saving" />
        <p class="text-sm" role="status">{{ message }}</p>
      </form>
      <template #actions><MdvButton variant="text" type="submit" :form="formId" :loading="saving" :disabled="saving" loading-text="Saving…">Publish</MdvButton></template>
      <template #footer="{ close }"><MdvButton variant="text" :disabled="saving" @click="close('cancelled')">Cancel</MdvButton></template>
    </MdvFullscreenDialog>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Confirm before closing

Return `false` from `before-close` to prevent dismissal, or a promise to wait for confirmation. Keep an explicit exit action if hiding the header close button.

<DemoBlock>
  <FullscreenGuardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvDialog, MdvFullscreenDialog, MdvTextField } from '@mdv-ui/mdv'
import type { MdvDialogBeforeClose, MdvDialogCloseDetail, MdvDialogSlotProps } from '@mdv-ui/mdv'

const open = ref(false)
const confirm = ref(false)
const saved = ref('Weekend reading')
const draft = ref(saved.value)
let answer: ((allowed: boolean) => void) | undefined

const beforeClose: MdvDialogBeforeClose = detail => {
  if (detail.returnValue === 'saved' || draft.value === saved.value) return true
  confirm.value = true
  return new Promise<boolean>(resolve => { answer = resolve })
}

function confirmed(detail: MdvDialogCloseDetail) {
  const resolve = answer
  answer = undefined
  resolve?.(detail.returnValue === 'discard')
}

async function save(close: MdvDialogSlotProps['close']) {
  if (await close('saved')) saved.value = draft.value
}

onBeforeUnmount(() => answer?.(false))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="draft = saved; open = true">Edit reading plan</MdvButton>
    <MdvFullscreenDialog v-model="open" title="Edit reading plan" close-label="Close reading plan" :before-close="beforeClose">
      <div class="mx-auto grid max-w-2xl gap-5">
        <MdvTextField v-model="draft" label="Plan name" full-width autofocus />
        <p class="text-sm">Change the name, then try the close action, Escape, or Cancel.</p>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="save(close)">Save changes</MdvButton></template>
      <template #footer="{ close }"><MdvButton variant="text" @click="close('cancelled')">Cancel</MdvButton></template>
      <MdvDialog v-model="confirm" title="Discard changes?" description="Your saved reading plan will stay unchanged." @closed="confirmed">
        <template #actions="{ close }">
          <MdvButton variant="text" @click="close('keep')">Keep editing</MdvButton>
          <MdvButton variant="text" @click="close('discard')">Discard</MdvButton>
        </template>
      </MdvDialog>
    </MdvFullscreenDialog>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Saved plan: {{ saved }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### Props

<ApiTable :items="dialogProps" />

### Slots

<SlotsTable :items="dialogSlots" />

FullscreenDialog does not have an `icon` slot; use the title and action areas for the supported header composition.

### Events

<DocsTable label="Fullscreen dialog events" min-width="33rem">

| Event | Payload and timing |
| --- | --- |
| `update:modelValue` | `false`; asks the parent to accept closing. |
| `open` | No payload; native modal opened, before entry motion. |
| `opened` | No payload; entry motion completed. |
| `close` | `{ reason, returnValue }`; accepted closing begins, before exit motion. |
| `closed` | `{ reason, returnValue }`; exit, native closing, and cleanup completed. |

</DocsTable>

<DocsTable label="Fullscreen dialog close reasons" min-width="31rem">

| Reason | Source |
| --- | --- |
| `close-button` | Built-in header X. |
| `escape` | Escape/native cancel request when enabled. |
| `action` | Instance or slot `close(returnValue?)`. |
| `form` | Native dialog-form submission. |
| `model` | Parent directly changes the model, or native state is externally changed. |

</DocsTable>

`returnValue` is a string, defaulting to `''`. The shared close-reason type also includes `scrim` for ordinary Dialog; FullscreenDialog does not expose scrim dismissal.

### Method and native attributes

The instance and both action slots expose `close(returnValue?: string): Promise<boolean>`. `true` means the parent accepted closing; it may still be animating. Open by changing the model. There are no additional public `open()` or `focus()` methods.

`class` and ordinary `style` affect the visible container. `id`, `dir`, `lang`, ARIA, `data-*`, and native listeners apply to the native dialog. CSS variables also reach its root for theme inheritance. Use component state and methods instead of calling the native `close()` directly.

### Public types

```ts
import type {
  MdvFullscreenDialogProps,
  MdvDialogBeforeClose,
  MdvDialogCloseReason,
  MdvDialogCloseDetail,
  MdvDialogSlotProps,
} from '@mdv-ui/mdv'
```
