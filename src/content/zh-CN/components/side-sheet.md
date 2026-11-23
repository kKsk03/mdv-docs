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
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: '受控可见状态，父级需接受 update:modelValue，内置关闭操作才会生效。' },
  { name: 'title', type: 'string', default: "''", description: '面板标题和默认无障碍名称，header 插槽替换标题区域。' },
  { name: 'description', type: 'string', default: "''", description: '没有面板正文插槽时显示的兜底文本，并关联为无障碍说明。' },
  { name: 'width', type: 'string', default: "'256px'", description: 'CSS 面板宽度，受 400px 及可用容器限制；分离式边距会减少面板可用空间。' },
  { name: 'placement', type: "'start' | 'end'", default: "'end'", description: '逻辑方向，RTL 时镜像；不会自动选择 Standard 或 Modal。' },
  { name: 'detached', type: 'boolean', default: 'false', description: '增加四周 16px 边距，并使用四角 16px 圆角。' },
  { name: 'showBack', type: 'boolean', default: 'false', description: '显示返回操作，只发出 back，具体行为由应用决定。' },
  { name: 'backLabel', type: 'string', description: '启用 showBack 时返回按钮的无障碍名称。' },
  { name: 'closeLabel', type: 'string', description: '关闭按钮的无障碍名称。' },
  { name: 'dividers', type: 'boolean', default: 'false', description: '标题下方和操作区上方的水平分隔线。' },
  { name: 'beforeClose', type: 'MdvSideSheetBeforeClose', description: '同步或异步关闭守卫。false、Promise 拒绝或异常均保留面板；父级直接修改模型不经过守卫。' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: '退出完成后销毁面板内容，默认保留子组件状态和滚动位置。' },
]
const modalProps: ApiTableItem[] = [
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: '允许最上层模态面板通过 Escape 请求关闭。' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: '允许激活遮罩请求关闭。' },
  { name: 'closeOnSwipe', type: 'boolean', default: 'true', description: '启用朝向主内容的 12px 边缘滑动关闭，正文纵向滚动保持原生行为。' },
]
const scaffoldProps: ApiTableItem[] = [{ name: 'showDivider', type: 'boolean', default: 'true', description: '贴边面板与主内容之间的竖直分隔线，分离式不显示。' }]
const modalSlots: SlotTableItem[] = [
  { name: 'default', description: '面板正文，接收 { close }，替换 description 兜底内容。' },
  { name: 'header', description: '标题区域，接收 { close }，保留内置关闭与返回操作。' },
  { name: 'actions', description: '面板操作，接收 { close }，按钮保持自然宽度并可换行。' },
]
const scaffoldSlots: SlotTableItem[] = [
  { name: 'default', description: '相邻主内容，无插槽参数。' },
  { name: 'sheet', description: '面板正文，接收 { close }，替换 description 兜底内容。' },
  { name: 'header', description: '标题区域，接收 { close }，保留内置操作。' },
  { name: 'actions', description: '面板操作，接收 { close }。' },
]
</script>
# 侧边面板

侧边面板用于显示与当前页面相关的详情或操作。`MdvSideSheet` 打开模态面板，`MdvSideSheetScaffold` 在正文旁为标准面板预留空间。

## 模态面板

用 `v-model` 控制模态面板。通过 `placement` 选用 `start` 或 `end`，用 `detached` 添加面板外边距。请为面板提供标题或无障碍名称。

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

## 标准面板

将正文放在默认插槽中，面板放在 `#sheet`。给 Scaffold 设置明确的高度，让正文与面板各自滚动。

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

## 关闭前确认

用 `before-close` 确认未保存的修改。返回 `false` 会阻止关闭，也可以返回 Promise 等待用户决定。直接把模型设为 `false` 会绕过拦截。

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

## 对话框表单

模态面板中的表单可使用 `method="dialog"`，先通过原生校验，再请求关闭。提交按钮的 `value` 成为 `returnValue`；需要保留此行为时，不要阻止提交事件。

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

### 共用属性

<ApiTable :items="commonProps" />

### MdvSideSheet

<ApiTable :items="modalProps" />

<SlotsTable :items="modalSlots" />

Modal 的 `class` 和普通样式作用于面板；CSS 自定义属性也会传给原生 dialog，使局部令牌影响遮罩和面板。ARIA、`dir` 及普通 dialog 属性作用于 dialog 根节点。不要通过移出主题范围来处理面板布局。

### MdvSideSheetScaffold

<ApiTable :items="scaffoldProps" />

<SlotsTable :items="scaffoldSlots" />

Scaffold 的 `class`、`style`、`dir` 作用于布局根节点，`aria-*` 作用于面板且不包含 `aria-modal`。根节点角色及 tabindex 由实现管理。默认插槽是主内容，因此只有面板相关插槽收到 `close`。

### 事件与关闭原因

<DocsTable label="侧边面板事件">

| 事件 | 参数 | 含义 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 请求可见状态变更，由父级决定是否接受。 |
| `open` / `opened` | 无 | 开始打开 / 打开完成。 |
| `close` / `closed` | `MdvSideSheetCloseDetail` | 已接受的关闭开始 / 完成，包含 reason 和 returnValue。 |
| `back` | 无 | 返回操作激活，应用导航由业务处理。 |

</DocsTable>

Modal 原因包括 `model`、`escape`、`scrim`、`close-button`、`action`、`form`、`swipe`；Standard 发出 `model`、`close-button` 或 `action`。守卫详情只读，close/closed 携带已接受的结果。模型驱动关闭的返回值通常为空，原生 dialog 处理提供返回值的情况除外。

### 插槽与公开方法

面板插槽提供 `close(returnValue?: string): Promise<boolean>`；两种实例也公开相同的 `close`，以及 `focus(): void`。false 表示拦截、拒绝、请求过期或当前无法关闭；true 表示父级接受，不代表动画结束。Modal 聚焦 autofocus 或首个可用控件，Standard 聚焦面板容器本身。

### 公共类型

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
