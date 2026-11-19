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

`MdvDialog` 通过模态打断当前任务，处理聚焦的决策或简短交互，提供标题、可选图标、正文及操作区。全屏对话框由独立组件提供，普通款没有全屏切换或内置 X 按钮。

## 基本确认与结果

绑定 `v-model`，通过 `#actions` 提供业务操作。使用插槽的 `close()` 返回结果，同时保留标准关闭生命周期。

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

组件不会自动添加按钮或推断确认的业务含义，实际业务操作及结果处理由应用实现。操作按钮通常使用 `variant="text"`，DOM 顺序先取消、后确认。空间不足时，MDV 可以将确认显示在取消上方，同时保留原键盘顺序。

普通对话框使用 280–560px 容器、28px 圆角、24px 内容留白、`surface-container-high` 表面及 32% 遮罩，顶部图标为 24px，配色继承所在的 MDV 主题。

---

## 关闭策略与内容保留

Escape 和遮罩关闭可分别设置，禁用任一路径时应保留明确操作。受控父级也可以拒绝 `update:modelValue=false`，弹窗会继续保持打开。

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

可以输入临时笔记，关闭后再打开。默认保留内容，打开前开启 `destroy-on-close` 则会在退出后卸载，让字段内部值重置；它不会清空保存在父级的模型，例如后文表单示例的绑定字段。

拒绝关闭开关位于弹窗内部，用户可以重新允许退出。KeepAlive 停用和卸载会释放模态资源及滚动锁，重新激活时遵循当前模型。

## 异步关闭拦截

`before-close` 接收只读 `{ reason, returnValue }`，返回 `false` 阻止退出，其他正常返回允许退出。Promise 可以等待检查，同一期间重复关闭请求共用进行中的结果。

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

示例模拟 600ms 检查，并在等待时禁用操作。按钮 `loading` 本身不会阻止重复业务操作，应显式管理等待状态并禁用或拦截操作。拦截器抛错或 Promise 拒绝时会记录错误，并保留弹窗。

Escape、遮罩、`close()` 和原生对话框表单均经过拦截。父级直接将模型设为 `false` 会跳过它；后续外部关闭、重开或卸载会使旧结果失效。保存、删除或服务端校验仍需由业务自行实现。

---

## 表单与原生校验

复杂表单应显式使用 `role="dialog"`，默认角色为 `alertdialog`。普通表单保留原生必填及输入类型校验，操作区的提交按钮通过唯一表单 ID 关联正文表单。

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

打开时优先聚焦内部 `autofocus` 元素，然后是首个可用控件，最后是弹窗容器。Enter 不会被全局映射为确认，而是遵循焦点控件和原生表单规则。表单数据与提交由父级管理，关闭重开后保留绑定值，除非应用主动清空。

### 原生对话框表单

使用 `method="dialog"` 的表单，或设置 `formmethod="dialog"` 的提交按钮，会请求经过拦截的关闭，提交按钮的 `value` 成为关闭结果。除非按钮设置 `formnovalidate`，否则仍会执行必填校验。

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

应用的 `@submit.prevent` 会阻止默认关闭。程序化提交使用 `requestSubmit()`，保留校验及 submit 事件；关闭时使用组件 `close()` 或模型，避免直接调用原生 `dialog.close()`、`form.submit()` 绕过正常生命周期。

## 长正文与尺寸

长正文独立滚动，标题和操作区保持可用，溢出的正文也可通过键盘聚焦。可用 `--mdv-dialog-width`、`--mdv-dialog-max-width` 在视口约束内调整可见容器。

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

真实内容应提供简洁标题及有意义的章节结构。对话框是模态的，关闭完成前底层页面不可操作；任务需要更多空间时，应选择适合的页面或全屏流程。

## 嵌套对话框与局部主题

对话框保留原 DOM 位置，通过原生 top layer 展示，从而继承局部主题令牌。嵌套 MDV 弹窗共享焦点及滚动锁协调，Escape 由最上层弹窗处理。

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

示例即使在浅色页面中也使用局部深色主题。打开书签确认、退出后可继续编辑集合设置，焦点会返回触发嵌套弹窗的控件；全部弹窗关闭后页面才解除滚动锁。每一层都应提供明确操作，不能只依赖背景退出。

---

## 无障碍与动效

- 默认角色为 `alertdialog`，表单及长内容使用 `role="dialog"`。可见标题自动通过 `aria-labelledby` 关联，简单 `description` 自动通过 `aria-describedby` 关联，显式 ARIA 命名优先。没有可见标题时应提供 `aria-label` 或 `aria-labelledby`。
- 自定义默认插槽不会被自动整体播报为说明，需要时显式关联简短描述，让用户正常浏览结构化正文。
- Tab/Shift+Tab 保持在最上层弹窗内，禁用、隐藏及嵌套弹窗控件不会成为不合适的焦点目标。关闭时在尊重剩余模态栈的前提下恢复先前可用控件。
- 遮罩关闭要求指针按下和抬起都位于外侧，避免从正文拖出时误关；IME 组合输入期间 Escape 不关闭。
- MDV 分别动画处理表面、遮罩及内容，不缩放文字，支持快速反向并遵循减少动态效果设置。`close()` 的接受结果与退出完成分开，需要等待清理时监听 `closed`。
- 使用支持原生 dialog 的现代浏览器。服务端输出关闭节点，初始模型为 true 时在 hydration 后建立模态；`open`、`closedby`、`tabindex` 由组件管理。

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
