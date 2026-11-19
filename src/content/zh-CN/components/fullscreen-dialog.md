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
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: '控制模态打开状态。关闭请求需要父级接受 update:modelValue=false。' },
  { name: 'title', type: 'string', default: "''", description: '顶栏可见标题，同时作为自动可访问名称来源，可由 title 插槽或显式 ARIA 覆盖。' },
  { name: 'description', type: 'string', default: "''", description: '简单正文与自动可访问描述。默认插槽会替换该内容，并取消这项自动描述关联。' },
  { name: 'closable', type: 'boolean', default: 'true', description: '显示内置顶栏关闭按钮，不会因此禁用 Escape 或业务操作。' },
  { name: 'closeLabel', type: 'string', default: "'关闭对话框'", description: '内置关闭操作的可访问名称，请按应用语言设置。' },
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

`MdvFullscreenDialog` 为表单或较长任务提供独立的模态工作区。它在桌面和手机上都占满视口，需要按任务明确选择，不会在宽屏自动切换为普通[对话框](/zh-CN/components/dialog)。

## 顶栏、底栏与关闭结果

绑定 `v-model`，提供标题，将主要操作放在 `#actions`。可选的 `#footer` 位于滚动正文之外，两个操作插槽都能使用 `close()`。

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

组件提供顶栏 X，批准、保存等业务逻辑仍由应用处理。传给 `close('approved')` 的结果会出现在关闭事件的 `returnValue` 中；X 和 Escape 各有对应的关闭原因。

表面使用 `surface-container-high`，没有圆角和阴影。顶栏、底栏最小高度均为 56px，正文内边距为 24px，并兼顾设备安全区。手机上应保持操作文字简短，为标题留出空间。

## 原生表单与顶栏提交

顶栏按钮可以通过原生 `form` 属性提交正文中的表单。为每个表单生成唯一 ID，并明确设置 `type="submit"`，必填校验仍正常生效。

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

可以先尝试保存空名称，再输入内容重试。`autofocus` 会将初始焦点放到输入框。示例使用 `@submit.prevent` 执行本地保存后，通过组件实例请求关闭；组件不会将所有 Enter 都解释为确认。

也支持原生 `method="dialog"` 与提交按钮的 `formmethod="dialog"`：提交经过关闭拦截和退出动画，提交按钮的 `value` 成为 `returnValue`。表单上的 `@submit.prevent` 会取消这条原生关闭路径。程序化提交应使用 `requestSubmit()`，不要通过 `form.submit()` 绕过校验。

## 关闭策略与内容生命周期

`closable` 控制顶栏 X，`close-on-esc` 控制 Escape。全屏表面覆盖视口，因此没有 `close-on-scrim` 属性。隐藏 X 或禁用 Escape 时，仍需保留明确的退出操作。

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

拒绝关闭的开关位于对话框内，方便重新允许退出。受控父级不接受 `update:modelValue=false` 时，模态会继续保持打开。可以编辑 Temporary note 后关闭、重开：默认保留内部状态；启用 `destroy-on-close` 后，在退出结束时卸载内容，内部输入框随之重置，但父级绑定状态不会被清空。

## 异步保存与失败处理

保存失败时保留草稿，成功后再关闭。加载指示器不会自动阻止重复操作，示例明确禁用提交，并在保存期间拒绝关闭请求。

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

先在启用失败模拟时发布，再取消失败模拟后重试。定时器仅模拟本地请求，卸载时会清理；真实应用同样需要自行处理请求取消、错误和成功结果。父级直接将模型设为 `false` 会跳过 `before-close`，应只用于明确的父级决策。

## 长内容、主题与方向

正文独立滚动，顶栏和底栏持续可用。长正文可以获得用于键盘滚动的 Tab 停靠点。对话框从原 DOM 位置进入原生顶层，因此仍能继承局部 MDV 主题。

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

示例默认使用局部深色主题，即使页面为浅色也保留深色，同时展示标题插槽和 RTL 布局。标题插槽保留已有标题的可访问关联，无需为了命名再套一个外部标题。

## 未保存内容确认

`before-close` 收到只读的 `{ reason, returnValue }`。返回 `false` 拒绝，正常返回允许，也可以返回 Promise，等待普通 Dialog 的确认结果。

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

修改名称后尝试 X、Escape 或 Cancel。Keep editing 和确认框中的 Escape 都会保留草稿；Discard 则允许正在等待的外层关闭。示例在确认框 `closed` 后才返回决定，先完成其模态资源清理。Save changes 直接接受本地草稿，不再询问是否放弃。

重复关闭会共用正在等待的拦截结果。拦截器抛错或 Promise 拒绝时保留对话框并记录错误；父级关闭、重开或卸载会使旧请求失效，应用自身持有的待确认状态也需要清理。

## 无障碍与动效

- 默认角色为 `dialog`，带有 `aria-modal="true"`。可见标题自动关联；没有自定义默认插槽时，简单 `description` 自动关联。显式 ARIA 名称优先；没有可见标题时提供 `aria-label` 或 `aria-labelledby`。
- 初始焦点优先内部 `autofocus`，其次为可操作控件，最后回退到对话框或正文。Tab/Shift+Tab 在最上层模态内循环。嵌套对话框协调焦点和滚动锁，关闭后恢复到适当的可用入口。
- 内置关闭名称默认为中文，英文演示明确传入 `close-label`。隐藏关闭操作后，仍需要可用的退出路径。
- 进入从底部滑入，持续 300ms；退出为 200ms，遮罩独立渐变，不缩放文字。MDV 处理快速反向和减少动态效果偏好。
- `close()` 返回状态接受情况，不代表动画完成。需要等待退出与清理时使用 `closed`；KeepAlive 停用和卸载会释放模态资源。
- 需要支持原生 dialog 的现代浏览器。SSR 输出关闭节点，初始模型为 true 时在 hydration 后建立模态。`open`、`closedby`、`tabindex` 由 MDV 管理。

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
