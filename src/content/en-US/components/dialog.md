<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DialogBasicDemo from '@/components/docs/demos/dialog/basic.vue'
import DialogPolicyDemo from '@/components/docs/demos/dialog/policy.vue'
import DialogGuardDemo from '@/components/docs/demos/dialog/guard.vue'
import DialogFormDemo from '@/components/docs/demos/dialog/form.vue'
import DialogNativeFormDemo from '@/components/docs/demos/dialog/nativeForm.vue'
import DialogScrollDemo from '@/components/docs/demos/dialog/scroll.vue'
import DialogNestedDemo from '@/components/docs/demos/dialog/nested.vue'

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

`MdvDialog` interrupts the current task with a focused modal decision or short interaction. It provides a title, optional icon, body, and action area. Fullscreen dialogs are a separate component; this component has no fullscreen switch or built-in X button.

## Basic confirmation and results

Bind `v-model` and supply application actions through `#actions`. Use the supplied `close()` callback to return a value and keep the standard closing lifecycle.

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

The component does not add buttons or infer what confirmation means. Perform the business action explicitly and handle the result as appropriate. Action buttons commonly use `variant="text"`, with Cancel followed by Confirm in DOM order. When space is insufficient, MDV can display Confirm above Cancel while preserving that keyboard order.

The ordinary dialog uses a 280–560px container, 28px corners, 24px content spacing, `surface-container-high`, and a 32% scrim. A header icon is 24px. These styles follow the inherited MDV theme.

---

## Closing policy and retained content

Escape and scrim dismissal are independently configurable. Keep explicit actions available when disabling either route. A controlled parent may also reject `update:modelValue=false`; the dialog then remains open.

<DemoBlock>
  <DialogPolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvTextField } from '@mdv-ui/mdv'

const open = ref(false)
const escape = ref(true)
const scrim = ref(true)
const destroy = ref(false)
const reject = ref(false)
const result = ref('The parent normally accepts closing requests.')

function update(value: boolean) {
  result.value = reject.value ? 'The parent rejected closing.' : 'The parent accepted closing.'
  if (!reject.value) open.value = value
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="escape" label="Close on Escape" />
      <MdvCheckbox v-model="scrim" label="Close on scrim" />
      <MdvCheckbox v-model="destroy" label="Destroy content after closing" />
    </div>
    <MdvButton class="justify-self-start" @click="open = true">Try close policy</MdvButton>
    <MdvDialog :model-value="open" title="Close policy" role="dialog" :close-on-esc="escape" :close-on-scrim="scrim" :destroy-on-close="destroy" @update:model-value="update">
      <div class="grid gap-4">
        <MdvTextField label="Temporary note" autofocus />
        <MdvCheckbox v-model="reject" label="Reject closing requests" />
        <p class="text-sm">This note is managed inside the field. Reopen to check whether it was retained.</p>
        <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
      </div>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" @click="close('done')">Done</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Try typing a temporary note, closing, and reopening. Content is retained by default. Enable `destroy-on-close` before opening to unmount it after exit; this resets the field's internal value. It does not clear models stored in the parent, such as the bound fields in the form example below.

The rejection switch is inside the dialog so the user can re-enable dismissal. KeepAlive deactivation and unmount release modal resources and scroll locks; reactivation follows the current model.

## Asynchronous close guard

`before-close` receives a read-only `{ reason, returnValue }`. Return `false` to prevent dismissal, or return normally to allow it. A Promise can wait for a check; repeated close requests share the in-flight result.

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

The example simulates a 600ms check and disables its actions while pending. Button `loading` alone does not prevent repeated business actions: track pending work and disable/guard the operation explicitly. A thrown error or rejected Promise is logged and leaves the dialog open.

Escape, scrim, `close()`, and native dialog-form submission go through the guard. Directly setting the parent model to `false` bypasses it. A later external close, reopen, or unmount invalidates an older guard result. The guard does not implement saving, deletion, or server validation by itself.

---

## Forms and native validation

For a complex form, set `role="dialog"` explicitly; the default role is `alertdialog`. Ordinary forms retain native required/type validation. Associate an action-area submit button with the form's unique ID.

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

Opening prioritizes an internal `autofocus` element, then the first available control, then the dialog container. Enter is not globally mapped to a confirmation action; it follows the focused control and native form rules. The parent owns form data and submission. Closing and reopening preserves these bound values unless the application clears them.

### Native dialog forms

A form using `method="dialog"`, or a submit button using `formmethod="dialog"`, requests a guarded close. The submitter's `value` becomes the close result. Required validation still runs unless the submitter uses `formnovalidate`.

<DemoBlock>
  <DialogNativeFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvDialog, MdvTextField } from '@mdv-ui/mdv'

const formId = `project-${useId()}`
const open = ref(false)
const result = ref('No form result yet.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Try method="dialog"</MdvButton>
    <MdvDialog v-model="open" title="Create project" role="dialog" @closed="result = `${$event.reason} · ${$event.returnValue || '(empty)'}`">
      <form :id="formId" method="dialog">
        <MdvTextField label="Project title" name="title" required autofocus full-width />
      </form>
      <template #actions>
        <MdvButton variant="text" type="submit" :form="formId" value="cancelled" formnovalidate>Cancel creation</MdvButton>
        <MdvButton variant="text" type="submit" :form="formId" value="created">Create project</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

An application `@submit.prevent` prevents this default close. Use `requestSubmit()` for programmatic submission so validation and submit events still run. For closing, use the component's `close()` method or model rather than directly calling native `dialog.close()` or `form.submit()` around the lifecycle.

## Long content and sizing

Long body content scrolls independently while the header and actions remain available. The overflowing body becomes keyboard-focusable. Use `--mdv-dialog-width` and `--mdv-dialog-max-width` to adjust the visible container within the viewport constraints.

<DemoBlock>
  <DialogScrollDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog } from '@mdv-ui/mdv'

const open = ref(false)
</script>

<template>
  <MdvButton @click="open = true">Read workspace guidelines</MdvButton>
  <MdvDialog v-model="open" title="Workspace guidelines" role="dialog" style="--mdv-dialog-width: 560px">
    <div class="space-y-5">
      <p v-for="index in 18" :key="index">Section {{ index }}. Keep shared project notes clear, record decisions where the team can find them, and review changes before publishing. This extended example lets you check scrolling while the title and actions remain visible.</p>
    </div>
    <template #actions="{ close }">
      <MdvButton variant="text" @click="close('back')">Back</MdvButton>
      <MdvButton variant="text" @click="close('acknowledged')">I understand</MdvButton>
    </template>
  </MdvDialog>
</template>
```

  </template>
</DemoBlock>

Provide a concise title and meaningful section structure in real content. The dialog is modal: the underlying page remains unavailable until closing finishes. Use an appropriate page or fullscreen flow when a task needs more room than an ordinary dialog provides.

## Nested dialogs and local themes

Dialogs remain in their original DOM position and enter the native top layer, preserving local theme tokens. Nested MDV dialogs coordinate focus and scroll locking; Escape belongs to the topmost dialog.

<DemoBlock>
  <DialogNestedDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvTextField } from '@mdv-ui/mdv'
import type { MdvDialogSlotProps } from '@mdv-ui/mdv'

const open = ref(false)
const confirmation = ref(false)
const removed = ref(false)
const name = ref('Weekend reading')

async function remove(close: MdvDialogSlotProps['close']) {
  if (await close('removed')) removed.value = true
}
</script>

<template>
  <div data-mdv-theme="dark" class="rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
    <MdvButton @click="open = true">Open collection settings</MdvButton>
    <MdvDialog v-model="open" role="dialog">
      <template #title>Collection settings</template>
      <div class="grid gap-4">
        <MdvTextField v-model="name" label="Collection name" full-width />
        <MdvButton class="justify-self-start" variant="outlined" :disabled="removed" @click="confirmation = true">Remove bookmark</MdvButton>
        <p class="text-sm" role="status">{{ removed ? 'Bookmark removed.' : 'One bookmark in this collection.' }}</p>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Done with settings</MdvButton></template>
      <MdvDialog v-model="confirmation" title="Remove this bookmark?" description="The collection will remain available.">
        <template #actions="{ close }">
          <MdvButton variant="text" @click="close('cancel')">Keep bookmark</MdvButton>
          <MdvButton variant="text" @click="remove(close)">Remove it</MdvButton>
        </template>
      </MdvDialog>
    </MdvDialog>
  </div>
</template>
```

  </template>
</DemoBlock>

This example uses a local dark theme even in a light page. Open the bookmark confirmation, dismiss it, and continue editing collection settings. Focus returns to the control that opened the nested dialog; the page unlocks only after all dialogs close. Put explicit actions in each layer rather than relying on a backdrop alone.

---

## Accessibility and motion

- The default role is `alertdialog`; use `role="dialog"` for forms and longer content. A visible title is automatically linked with `aria-labelledby`, and a simple `description` with `aria-describedby`. Explicit ARIA naming takes precedence. Without a visible title, supply `aria-label` or `aria-labelledby`.
- The custom default slot is not automatically announced as a single description. Reference a concise description explicitly when needed, and let readers navigate structured content normally.
- Tab/Shift+Tab stay within the top dialog. Disabled, hidden, and nested-dialog controls do not become inappropriate focus targets. Closing restores the prior available control while respecting the remaining modal stack.
- Scrim dismissal requires both pointer press and release outside, avoiding accidental dismissal after dragging out of content. Escape during IME composition does not close the dialog.
- MDV animates the surface, scrim, and content separately without scaling text, supports quick reversals, and honors reduced motion. `close()` acceptance is separate from exit completion; listen to `closed` to wait for cleanup.
- Use a modern browser with native dialog support. Server rendering outputs a closed node; an initially true model establishes the modal after hydration. `open`, `closedby`, and `tabindex` are managed by the component.

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
