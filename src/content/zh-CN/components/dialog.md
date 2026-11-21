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
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: '控制打开状态。关闭请求需要父级接受 update:modelValue=false 才会继续。' },
  { name: 'title', type: 'string', default: "''", description: '可见标题和默认可访问命名来源，可由 title 插槽或显式 ARIA 覆盖。' },
  { name: 'description', type: 'string', default: "''", description: '简单正文及默认可访问说明；默认插槽会替代其内容和自动说明关联。' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: '允许最上层弹窗通过 Escape 请求关闭，IME 组合输入时不触发。' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: '指针按下与抬起都在可见容器之外时允许关闭。' },
  { name: 'beforeClose', type: 'MdvDialogBeforeClose', description: '同步/异步关闭拦截器，false 阻止，其他正常结果允许；父级直接修改模型会跳过。' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: '退出完成后卸载内容，不清空外部绑定值；默认保留内部内容状态。' },
]
const dialogSlots: SlotTableItem[] = [
  { name: 'icon', description: '标题上方的 24px 装饰图标，存在时图标和标题居中，正文仍保持起始对齐。无参数。' },
  { name: 'title', description: '现有标题元素中的自定义内容，保留 ID 及可访问关联。无参数。' },
  { name: 'default', description: '替代 description 的正文、表单等内容。复杂正文不会自动整体关联为可访问说明。无参数。' },
  { name: 'actions', description: '由应用提供操作，接收 { close }，其中 close(returnValue?: string): Promise<boolean>。' },
]
</script>
# 对话框

用 `MdvDialog` 在用户继续操作前展示需要阅读的信息或确认事项。

## 确认操作

绑定 `v-model` 并提供标题。在 `#actions` 中，通过插槽提供的 `close()` 关闭对话框，并按需返回结果。

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

## 关闭前确认

用 `before-close` 阻止或延迟关闭。返回 `false` 可保留对话框，返回 Promise 可等待决定。如果禁用了 Escape 或点击遮罩关闭，请保留明确的退出操作。

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

## 表单与原生校验

表单对话框使用 `role="dialog"`，而不是默认的 `alertdialog`。操作区的提交按钮可以通过 ID 关联表单。

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

需要在表单校验成功后关闭对话框时，使用 `method="dialog"`。提交按钮的 `value` 会成为 `returnValue`。

## 长内容与尺寸

正文过长时可单独滚动，不会带走操作区。需要自定义尺寸时，设置 `--mdv-dialog-width` 和 `--mdv-dialog-max-width`。

---

## API

### 属性

<ApiTable :items="dialogProps" />

### 插槽

<SlotsTable :items="dialogSlots" />

### 事件与关闭详情

<DocsTable label="对话框事件" min-width="34rem">

| 事件 | 参数及时机 |
| --- | --- |
| `update:modelValue` | `false`，请求父级接受关闭。 |
| `open` | 无参数，原生模态已打开、入场动效开始前。 |
| `opened` | 无参数，入场动效完成。 |
| `close` | `{ reason, returnValue }`，父级已接受关闭、退出动效开始前。 |
| `closed` | `{ reason, returnValue }`，退出、原生关闭及清理完成。 |

</DocsTable>

<DocsTable label="普通对话框关闭原因" min-width="30rem">

| 原因 | 来源 |
| --- | --- |
| `escape` | 允许时的 Escape/原生 cancel 请求。 |
| `scrim` | 允许时在外侧按下并抬起。 |
| `action` | 组件或操作插槽的 `close(returnValue?)`。 |
| `form` | 原生对话框表单提交，携带提交按钮的值。 |
| `model` | 父级直接修改模型，或外部改变原生状态。 |

</DocsTable>

共用 `MdvDialogCloseReason` 还包含供 FullscreenDialog 使用的 `close-button`，普通 Dialog 没有内置关闭按钮。`returnValue` 为字符串，未提供结果时为 `''`。

### 方法与原生属性

实例及操作插槽暴露 `close(returnValue?: string): Promise<boolean>`，`true` 表示父级已接受关闭，退出动画可能仍在进行。没有独立的公开 `open()` 或 `focus()` 方法，打开请修改模型，初始焦点使用原生 autofocus。

`class` 及普通 `style` 应用于可见容器，`id`、`dir`、`lang`、ARIA、`data-*` 及原生监听器应用到原生 dialog。CSS 变量同时作用于原生根节点，让遮罩继承局部令牌。不要覆盖托管的原生打开属性或使用原生方法绕过请求流程。

### 公开类型

```ts
import type {
  MdvDialogProps,
  MdvDialogBeforeClose,
  MdvDialogCloseReason,
  MdvDialogCloseDetail,
  MdvDialogSlotProps,
} from '@mdv-ui/mdv'
```
