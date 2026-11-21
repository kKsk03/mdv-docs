<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DialogBasicDemo from '@/components/docs/demos/dialog/basic.vue'
import DialogGuardDemo from '@/components/docs/demos/dialog/guard.vue'
import DialogFormDemo from '@/components/docs/demos/dialog/form.vue'

const dialogProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: 'Controls opening. The parent must accept update:modelValue=false for a requested close to proceed.' },
  { name: 'title', type: 'string', default: "''", description: 'Visible title and automatic accessible naming source, unless the title slot or explicit ARIA overrides it.' },
  { name: 'description', type: 'string', default: "''", description: 'Simple body text and automatic accessible description. The default slot replaces this content and its automatic description association.' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Allows the top dialog to request closing on Escape. IME composition does not trigger dismissal.' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: 'Allows closing when both pointer press and release are outside the visible container.' },
  { name: 'beforeClose', type: 'MdvDialogBeforeClose', description: 'Synchronous/asynchronous guard for close requests. false blocks, other normal results allow; direct parent model changes bypass it.' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: 'Unmounts rendered content after exit completes. External bound values are not cleared; otherwise internal content state is retained.' },
]
const dialogSlots: SlotTableItem[] = [
  { name: 'icon', description: 'Decorative 24px icon above the title. Its presence centers the icon/title while body text stays start-aligned. No parameters.' },
  { name: 'title', description: 'Custom title content inside the existing heading, retaining its ID and accessible association. No parameters.' },
  { name: 'default', description: 'Custom body, form, or other content replacing description. Complex body content is not automatically assigned as one accessible description. No parameters.' },
  { name: 'actions', description: 'Application-owned actions. Receives { close }, with close(returnValue?: string): Promise<boolean>.' },
]
</script>
# Dialog

Use `MdvDialog` when users need to review information or make a decision before continuing.

## Confirmation

Bind `v-model` and provide a title. In `#actions`, use the supplied `close()` callback to dismiss the dialog with an optional result.

<DemoBlock>
  <DialogBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvIcon } from '@mdv-ui/mdv'
import info from '@iconify-icons/material-symbols/info-outline'

const open = ref(false)
const icon = ref(false)
const result = ref('No close result yet.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="icon" label="Show a header icon" />
    <MdvButton @click="open = true">Review changes</MdvButton>
    <MdvDialog v-model="open" title="Discard changes?" description="Your unsaved edits will be lost. You can keep editing instead." @closed="result = `${$event.reason} · ${$event.returnValue || '(no return value)'}`">
      <template v-if="icon" #icon><MdvIcon :icon="info" /></template>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close('keep-editing')">Keep editing</MdvButton>
        <MdvButton variant="text" @click="close('discard')">Discard</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Confirm before closing

Use `before-close` to block or delay dismissal. Return `false` to keep the dialog open or a promise to wait for a decision. Keep an explicit exit action if disabling Escape or scrim dismissal.

<DemoBlock>
  <DialogGuardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog } from '@mdv-ui/mdv'
import type { MdvDialogBeforeClose } from '@mdv-ui/mdv'

const open = ref(false)
const allow = ref(false)
const checking = ref(false)
const message = ref('Enable dismissal inside the dialog to allow the check to pass.')

const beforeClose: MdvDialogBeforeClose = async detail => {
  checking.value = true
  message.value = `Checking the ${detail.reason} request…`
  try {
    // Simulates an asynchronous check; no network request is made.
    await new Promise(resolve => setTimeout(resolve, 600))
    message.value = allow.value ? 'Dismissal allowed.' : 'Dismissal blocked. Enable it and try again.'
    return allow.value
  } finally {
    checking.value = false
  }
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Try an asynchronous guard</MdvButton>
    <MdvDialog v-model="open" title="Ready to leave?" role="dialog" :before-close="beforeClose">
      <div class="grid gap-4">
        <MdvCheckbox v-model="allow" :disabled="checking" label="Allow dismissal" />
        <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
      </div>
      <template #actions="{ close }">
        <MdvButton variant="text" :disabled="checking" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" :loading="checking" :disabled="checking" @click="close('reviewed')">Check and close</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Forms and native validation

Use `role="dialog"` for forms instead of the default `alertdialog`. An action-area submit button can target the form by ID.

<DemoBlock>
  <DialogFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvDialog, MdvTextField } from '@mdv-ui/mdv'

const dialog = useTemplateRef<InstanceType<typeof MdvDialog>>('dialog')
const formId = `contact-${useId()}`
const open = ref(false)
const name = ref('')
const email = ref('')
const result = ref('No contact saved.')

async function save() {
  if (await dialog.value?.close('saved')) result.value = `Saved ${name.value} · ${email.value}`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Add a contact</MdvButton>
    <MdvDialog ref="dialog" v-model="open" title="New contact" role="dialog">
      <form :id="formId" class="grid gap-4" @submit.prevent="save">
        <MdvTextField v-model="name" label="Contact name" name="name" required autofocus full-width />
        <MdvTextField v-model="email" label="Email address" name="email" type="email" required full-width />
      </form>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" type="submit" :form="formId">Save contact</MdvButton>
      </template>
    </MdvDialog>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Use `method="dialog"` when valid submission should close the dialog. The submitter’s `value` becomes `returnValue`.

## Long content and sizing

Long body content scrolls without moving the actions. Use `--mdv-dialog-width` and `--mdv-dialog-max-width` for custom sizing.

---

## API

### Props

<ApiTable :items="dialogProps" />

### Slots

<SlotsTable :items="dialogSlots" />

### Events and close details

<DocsTable label="Dialog events" min-width="34rem">

| Event | Payload and timing |
| --- | --- |
| `update:modelValue` | `false`; requests the parent to accept closing. |
| `open` | No payload; the native modal has opened, before entry motion. |
| `opened` | No payload; entry motion completed. |
| `close` | `{ reason, returnValue }`; parent accepted closing, before exit motion. |
| `closed` | `{ reason, returnValue }`; exit, native closing, and cleanup completed. |

</DocsTable>

<DocsTable label="Ordinary dialog close reasons" min-width="30rem">

| Reason | Source |
| --- | --- |
| `escape` | Escape/native cancel request when allowed. |
| `scrim` | Outside press/release when allowed. |
| `action` | The component or action slot's `close(returnValue?)`. |
| `form` | Native dialog-form submission, with the submitter's value. |
| `model` | Parent directly changes the model, or native state is externally changed. |

</DocsTable>

The shared `MdvDialogCloseReason` also contains `close-button` for FullscreenDialog; ordinary Dialog has no built-in close button. `returnValue` is a string and defaults to `''` when no result was supplied.

### Method and native attributes

The instance and action slot expose `close(returnValue?: string): Promise<boolean>`. `true` means the parent accepted closing; the exit animation may still be running. There is no separate public `open()` or `focus()` method: set the model to open and use native autofocus for initial focus.

`class` and ordinary `style` apply to the visible container. `id`, `dir`, `lang`, ARIA, `data-*`, and native listeners apply to the native dialog. CSS variables also reach the native root so its scrim inherits local tokens. Avoid overriding managed native opening attributes or using native methods to skip the request path.

### Public types

```ts
import type {
  MdvDialogProps,
  MdvDialogBeforeClose,
  MdvDialogCloseReason,
  MdvDialogCloseDetail,
  MdvDialogSlotProps,
} from '@mdv-ui/mdv'
```
