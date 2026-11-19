<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FullscreenBasicDemo from '@/components/docs/demos/fullscreenDialog/basic.vue'
import FullscreenFormDemo from '@/components/docs/demos/fullscreenDialog/form.vue'
import FullscreenPolicyDemo from '@/components/docs/demos/fullscreenDialog/policy.vue'
import FullscreenAsyncDemo from '@/components/docs/demos/fullscreenDialog/async.vue'
import FullscreenScrollDemo from '@/components/docs/demos/fullscreenDialog/scroll.vue'
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

`MdvFullscreenDialog` provides a focused modal workspace for forms or longer tasks. It always fills the viewport, including on desktop. Choose it explicitly for the task; it does not automatically become an ordinary [Dialog](/en-US/components/dialog) at wider widths.

## Header actions, footer, and results

Bind `v-model`, provide a title, and place the main action in `#actions`. The optional `#footer` stays outside the scrolling body. Both slots receive `close()`.

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

The component provides the header X, but the application owns approval, saving, and other business actions. A result passed to `close('approved')` appears in the closing event's `returnValue`; the X and Escape have their own close reasons.

The surface uses `surface-container-high` with no rounded corners or shadow. Header and footer are each at least 56px high. The body has 24px padding with device safe-area accommodation. Keep header labels concise so the title and action fit on mobile.

## Native forms and header submission

A header button can submit a body form using its native `form` attribute. Give each form a unique ID and set `type="submit"` explicitly; required-field validation still applies.

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

Try Save with an empty name, then enter a name and retry. The field receives initial focus through `autofocus`. This example uses `@submit.prevent` and requests closing through the instance after the local save action; the component does not reinterpret every Enter key as confirmation.

Native `method="dialog"` and a submitter's `formmethod="dialog"` are also supported: submission goes through the close guard and exit animation, and the submitter's `value` becomes `returnValue`. A form's `@submit.prevent` cancels that native closing path. Use `requestSubmit()` for programmatic submission rather than bypassing validation with `form.submit()`.

## Close policy and content lifetime

`closable` controls the header X, while `close-on-esc` controls Escape. FullscreenDialog has no `close-on-scrim` prop because the visible surface covers the viewport. Keep an explicit exit action available when hiding the X or disabling Escape.

<DemoBlock>
  <FullscreenPolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvFullscreenDialog, MdvTextField } from '@mdv-ui/mdv'

const open = ref(false)
const closable = ref(true)
const escape = ref(true)
const destroy = ref(false)
const reject = ref(false)
const message = ref('Closing requests are accepted.')

function update(value: boolean) {
  message.value = reject.value ? 'The parent rejected closing.' : 'The parent accepted closing.'
  if (!reject.value) open.value = value
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="closable" label="Show the close action" />
      <MdvCheckbox v-model="escape" label="Close on Escape" />
      <MdvCheckbox v-model="destroy" label="Destroy content after closing" />
    </div>
    <MdvButton variant="tonal" @click="open = true">Try fullscreen policy</MdvButton>
    <MdvFullscreenDialog :model-value="open" title="Close policy" close-label="Close policy preview" :closable="closable" :close-on-esc="escape" :destroy-on-close="destroy" @update:model-value="update">
      <div class="mx-auto grid max-w-2xl gap-5">
        <MdvTextField label="Temporary note" full-width autofocus />
        <MdvCheckbox v-model="reject" label="Reject closing requests" />
        <p class="text-sm" role="status">{{ message }}</p>
      </div>
      <template #footer="{ close }"><MdvButton variant="text" @click="close('done')">Done</MdvButton></template>
    </MdvFullscreenDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

The rejection switch stays inside the dialog so closing can be re-enabled. A controlled parent that rejects `update:modelValue=false` keeps the modal open. Try editing Temporary note, closing, and reopening: internal state is retained by default. Enabling `destroy-on-close` unmounts it after exit and resets that internal field, without clearing state bound in the parent.

## Asynchronous saving and failure

Keep the draft available when a save fails, and close only after success. A loading indicator does not automatically prevent repeated activation; this example explicitly disables submission and rejects close requests during saving.

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

Publish first with failure enabled, then disable failure and retry. The timeout only simulates a local request and is cleaned up on unmount. A real application should similarly own request cancellation, errors, and success handling. Directly setting the bound model to `false` bypasses `before-close`; reserve that path for deliberate parent decisions.

## Long content, themes, and direction

The header and footer remain available while the body scrolls. Long bodies can receive a Tab stop for keyboard scrolling. The dialog enters the native top layer from its existing DOM location, preserving local MDV theme inheritance.

<DemoBlock>
  <FullscreenScrollDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvFullscreenDialog } from '@mdv-ui/mdv'

const open = ref(false)
const dark = ref(true)
const rtl = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'">
      <MdvButton @click="open = true">Read long content</MdvButton>
      <MdvFullscreenDialog v-model="open" close-label="Close reading view" :dir="rtl ? 'rtl' : 'ltr'">
        <template #title>Workspace review and reading notes</template>
        <div class="mx-auto grid max-w-3xl gap-6">
          <p v-for="index in 30" :key="index">Section {{ index }}: the body scrolls independently while the header and footer remain available. Keep real content structured with useful headings and concise paragraphs.</p>
        </div>
        <template #actions="{ close }"><MdvButton variant="text" @click="close('finished')">Finish</MdvButton></template>
        <template #footer="{ close }"><MdvButton variant="text" @click="close('back')">Back</MdvButton></template>
      </MdvFullscreenDialog>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

This example defaults to a local dark theme even on a light page. It also demonstrates the title slot and RTL layout. The title slot keeps its generated heading association; do not add a second outer heading just to name the dialog.

## Confirming unsaved changes

`before-close` receives a read-only `{ reason, returnValue }`. Return `false` to reject, return normally to allow, or return a Promise while an ordinary Dialog asks for confirmation.

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

Change the name and try X, Escape, or Cancel. Keep editing and Escape from the confirmation preserve the draft; Discard allows the pending outer close. The example resolves the pending decision after the confirmation's `closed` event, so its modal cleanup finishes first. Save changes accepts the local draft without asking to discard it.

Repeated close attempts share the in-flight guard result. A thrown/rejected guard leaves the dialog open and logs the failure. Parent closure, reopening, or unmount invalidates obsolete requests; clean up any application-owned pending confirmation too.

## Accessibility and motion

- The default role is `dialog`, with `aria-modal="true"`. The visible title is associated automatically; a simple `description` is associated when no custom default slot replaces it. Explicit ARIA naming takes priority. Without a visible title, provide `aria-label` or `aria-labelledby`.
- Initial focus prefers internal `autofocus`, then an available control, then the dialog/content fallback. Tab/Shift+Tab stay in the top modal. Nested dialogs coordinate focus and scroll locking; closing restores the appropriate available opener.
- The built-in close label defaults to Chinese; the English demos supply `close-label`. Hiding the close action does not remove the need for an available exit route.
- Entry slides from below over 300ms and exit takes 200ms, with a separate scrim fade. Text is not scaled. Quick reversals and reduced-motion preferences are handled by MDV.
- `close()` reports accepted state, not completed motion. Use `closed` for exit completion and cleanup. KeepAlive deactivation and unmount release modal resources.
- Use a modern browser with native dialog support. SSR outputs a closed node; an initially true model establishes the modal after hydration. `open`, `closedby`, and `tabindex` are managed by MDV.

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
