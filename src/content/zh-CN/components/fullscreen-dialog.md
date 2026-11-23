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
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: '控制模态打开状态。关闭请求需要父级接受 update:modelValue=false。' },
  { name: 'title', type: 'string', default: "''", description: '顶栏可见标题，同时作为自动可访问名称来源，可由 title 插槽或显式 ARIA 覆盖。' },
  { name: 'description', type: 'string', default: "''", description: '简单正文与自动可访问描述。默认插槽会替换该内容，并取消这项自动描述关联。' },
  { name: 'closable', type: 'boolean', default: 'true', description: '显示内置顶栏关闭按钮，不会因此禁用 Escape 或业务操作。' },
  { name: 'closeLabel', type: 'string', description: '启用 closable 时关闭按钮的无障碍名称。' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: '允许最上层对话框通过 Escape 请求关闭，输入法组合期间不触发。' },
  { name: 'beforeClose', type: 'MdvDialogBeforeClose', description: '同步或异步关闭拦截器，false 拒绝关闭；父级直接修改模型会跳过拦截。' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: '退出完成后卸载内容，否则保留内部状态；不会清空父级绑定的模型。' },
]
const dialogSlots: SlotTableItem[] = [
  { name: 'title', description: '顶栏现有标题元素的自定义内容，保留其 ID 和可访问关联。无参数。' },
  { name: 'default', description: '替换 description 的结构化正文或表单，复杂内容不会自动整体作为可访问描述。无参数。' },
  { name: 'actions', description: '顶栏末端操作，通常为简短的保存或完成。接收 { close }，其中 close(returnValue?: string): Promise<boolean>。' },
  { name: 'footer', description: '独立于滚动正文的可选底部操作栏，接收相同的 { close } 回调。' },
]
</script>
# 全屏对话框

用 `MdvFullscreenDialog` 承载需要整个屏幕的任务，例如编辑表单。

## 页头与页尾

绑定 `v-model`，设置标题，将主操作放在 `#actions`。需要固定在滚动正文之外的控件放在 `#footer`。

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

## 提交表单

为正文表单设置 ID。页头的提交操作设置 `type="submit"` 和 `form`，即可提交表单并进行原生校验。

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

## 异步保存

保存失败时保留草稿并显示错误。保存期间禁用提交操作，成功后再关闭。

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

## 关闭前确认

`before-close` 返回 `false` 可阻止关闭，也可返回 Promise 等待确认。若隐藏页头关闭按钮，请保留明确的退出操作。

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

### 插槽

<SlotsTable :items="dialogSlots" />

FullscreenDialog 没有 `icon` 插槽，顶栏使用标题与操作区域组合。

### 事件

<DocsTable label="全屏对话框事件" min-width="33rem">

| 事件 | 参数与时机 |
| --- | --- |
| `update:modelValue` | `false`；请求父级接受关闭。 |
| `open` | 无参数；原生模态已打开，进入动画开始前。 |
| `opened` | 无参数；进入动画完成。 |
| `close` | `{ reason, returnValue }`；已接受关闭，退出动画开始前。 |
| `closed` | `{ reason, returnValue }`；退出、原生关闭与清理完成。 |

</DocsTable>

<DocsTable label="全屏对话框关闭原因" min-width="31rem">

| 原因 | 来源 |
| --- | --- |
| `close-button` | 内置顶栏 X。 |
| `escape` | 启用时的 Escape 或原生 cancel 请求。 |
| `action` | 实例或插槽的 `close(returnValue?)`。 |
| `form` | 原生 dialog 表单提交。 |
| `model` | 父级直接修改模型，或原生状态被外部改变。 |

</DocsTable>

`returnValue` 为字符串，默认为 `''`。共用关闭原因类型还包含普通 Dialog 使用的 `scrim`，全屏款不提供遮罩关闭。

### 方法与原生属性

组件实例与两个操作插槽均提供 `close(returnValue?: string): Promise<boolean>`。`true` 表示父级接受关闭，此时动画可能仍在进行。通过修改模型打开，没有额外公开的 `open()` 或 `focus()` 方法。

`class` 和普通 `style` 作用于可见容器；`id`、`dir`、`lang`、ARIA、`data-*` 和原生监听器作用于原生 dialog。CSS 变量也会应用到根节点以保留主题继承。使用组件状态与方法，不要直接调用原生 `close()` 跳过正常流程。

### 公开类型

```ts
import type {
  MdvFullscreenDialogProps,
  MdvDialogBeforeClose,
  MdvDialogCloseReason,
  MdvDialogCloseDetail,
  MdvDialogSlotProps,
} from '@mdv-ui/mdv'
```
