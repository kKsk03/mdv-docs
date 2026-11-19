<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ModalDemo from '@/components/docs/demos/sideSheet/modal.vue'
import StandardDemo from '@/components/docs/demos/sideSheet/standard.vue'
import PolicyDemo from '@/components/docs/demos/sideSheet/policy.vue'
import GuardDemo from '@/components/docs/demos/sideSheet/guard.vue'
import FormDemo from '@/components/docs/demos/sideSheet/form.vue'
import CompositionDemo from '@/components/docs/demos/sideSheet/composition.vue'

const commonProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: '受控可见状态，父级需接受 update:modelValue，内置关闭操作才会生效。' },
  { name: 'title', type: 'string', default: "''", description: '面板标题和默认无障碍名称，header 插槽替换标题区域。' },
  { name: 'description', type: 'string', default: "''", description: '没有面板正文插槽时显示的兜底文本，并关联为无障碍说明。' },
  { name: 'width', type: 'string', default: "'256px'", description: 'CSS 面板宽度，受 400px 及可用容器限制；分离式边距会减少面板可用空间。' },
  { name: 'placement', type: "'start' | 'end'", default: "'end'", description: '逻辑方向，RTL 时镜像；不会自动选择 Standard 或 Modal。' },
  { name: 'detached', type: 'boolean', default: 'false', description: '增加四周 16px 边距，并使用四角 16px 圆角。' },
  { name: 'showBack', type: 'boolean', default: 'false', description: '显示返回操作，只发出 back，具体行为由应用决定。' },
  { name: 'backLabel', type: 'string', default: "'返回'", description: '返回操作的无障碍名称，按应用语言覆盖。' },
  { name: 'closeLabel', type: 'string', default: "'关闭面板'", description: '始终存在的关闭操作的无障碍名称，按应用语言覆盖。' },
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

`MdvSideSheet` 以模态面板显示补充内容，`MdvSideSheetScaffold` 为 Standard 面板在主内容旁预留空间。本文对应 **MDV 0.1.5**。导航目的地适合 Navigation Drawer；与当前页面相关的详情或任务适合 Side Sheet。

## 模态外观、方向与返回

Modal 使用原生 dialog 顶层、遮罩及焦点约束。`placement` 表示逻辑起始或末尾方向，RTL 时镜像。贴边面板只在朝向内容一侧使用圆角，`detached` 增加四周边距并将四角圆角化。默认宽度 256px，最大 400px，且不超出可用区域。

关闭操作始终存在。`show-back` 添加独立操作，只发出 `back`，不会自动关闭。示例用它从项目历史返回详情。英文界面请覆盖 `close-label`、`back-label`，因为组件默认文案为中文。

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

## Standard 布局与独立滚动

Scaffold 需要高度明确的父容器。默认插槽是主区域，`sheet` 是侧边正文。面板打开时真正缩小主内容宽度，关闭后恢复；两边独立滚动。`show-divider` 控制外侧竖直边界，`dividers` 控制内部水平分隔线。

示例使用容器相对长度约束自定义宽度，给窄屏嵌入式预览留出主内容空间。正式应用在主内容无法容纳时通常切换为 Modal。MDV 不会自动选择断点，也不会自动在两种组件间切换。

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

Standard 不进入模态状态：主内容仍可交互，打开不抢焦点，Tab 可以离开面板，也不全局拦截 Escape。实例 `focus()` 可明确聚焦面板容器。关闭时，仅当焦点仍在该面板内且没有嵌套模态占用焦点，才尝试恢复先前焦点。

## 关闭策略、受控接受与保留

Modal 可以分别关闭各入口策略，内置关闭按钮仍可用。实例及插槽 `close()` 都请求父级接受；返回 `true` 只表示父级接受，退出动画可能尚未结束。依赖完全关闭的逻辑应等待 `closed`。

`destroy-on-close` 在退出结束后移除子树，再打开时未绑定模型的子字段会重置，但父级保存的状态不受影响。父级直接把模型改为 false 是程序关闭，不经过 `before-close`。

<DemoBlock>
  <PolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSideSheet, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const sheet = useTemplateRef<InstanceType<typeof MdvSideSheet>>('sheet')
const open = ref(false)
const acceptClose = ref(true)
const escape = ref(true)
const scrim = ref(true)
const swipe = ref(true)
const destroy = ref(false)
const message = ref('No close request yet.')
function update(value: boolean) {
  if (value || acceptClose.value) open.value = value
  else message.value = 'Parent rejected closing.'
}
async function requestClose() { message.value = `close() accepted: ${await sheet.value?.close('requested')}` }
function closed(event: MdvSideSheetCloseDetail) { message.value = `Closed: ${event.reason} · Result: ${event.returnValue || '(empty)'}` }
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="escape" label="Escape closes" />
      <MdvCheckbox v-model="scrim" label="Scrim closes" />
      <MdvCheckbox v-model="swipe" label="Edge swipe closes" />
      <MdvCheckbox v-model="destroy" label="Destroy content on close" />
    </div>
    <div><MdvButton @click="open = true">Open close policy</MdvButton></div>
    <MdvSideSheet ref="sheet" :model-value="open" title="Close policy" width="360px" :close-on-esc="escape" :close-on-scrim="scrim" :close-on-swipe="swipe" :destroy-on-close="destroy" close-label="Request policy close" @update:model-value="update" @closed="closed">
      <div class="grid gap-4">
        <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
        <MdvTextField label="Local draft" placeholder="Close and reopen to compare retention" full-width />
        <MdvButton variant="outlined" @click="requestClose">Request close()</MdvButton>
        <MdvButton variant="text" @click="open = false">Close directly</MdvButton>
        <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
      </div>
    </MdvSideSheet>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 异步处理未保存内容

`before-close` 接收只读关闭详情，可以返回 Promise。并发关闭请求共用当前决定，返回 false 会保留面板。示例在活动面板内展示确认，Keep/Discard 后完成决定，外部关闭或卸载时取消等待；Save 先保存草稿，再请求关闭。

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

同步策略可以直接返回 `false`。异常或拒绝的 Promise 会保留面板，并由 MDV 记录错误，不应把异常当成普通取消方式。

## 原生 dialog 表单

Modal 内的 `form method="dialog"` 先遵循原生字段校验，通过后的提交由 MDV 处理，以 `form` 原因请求关闭。提交按钮的 `value` 成为 `returnValue`。在 submit 监听中读取 FormData；希望走内置 dialog 表单关闭流程时，不要添加 `.prevent`。取消按钮可以使用 `formnovalidate`。

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

Standard 没有原生模态 dialog，不拦截 dialog 表单提交。请使用普通表单，由应用处理提交，并在保存成功后调用插槽 `close('saved')`。

## 局部主题、RTL 与嵌套浮层

面板保留在原始 DOM 树中，继承局部 MDV 主题变量和方向。示例把 Side Sheet 嵌入 Dialog，再在面板中打开 Select 列表框。应先关闭当前弹层或模态，再关闭父级，并确保关闭操作有名称且可访问。

<DemoBlock>
  <CompositionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvSelect, MdvSideSheet } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const dialogOpen = ref(false)
const sheetOpen = ref(false)
const dark = ref(false)
const rtl = ref(false)
const access = ref<MdvSelectValue | null>('team')
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="rounded-xl bg-mdv-surface p-4 text-mdv-on-surface">
      <MdvButton @click="dialogOpen = true">Open document dialog</MdvButton>
      <MdvDialog v-model="dialogOpen" title="Shared document">
        <div class="grid gap-4">
          <p>Open supplemental settings, then dismiss the topmost overlay first.</p>
          <MdvButton variant="outlined" @click="sheetOpen = true">Edit access settings</MdvButton>
          <MdvSideSheet v-model="sheetOpen" title="Access settings" width="360px" detached placement="end" close-label="Close access settings">
            <MdvSelect v-model="access" label="Who can read" :options="[{ value: 'team', label: 'Team members' }, { value: 'public', label: 'Anyone with the link' }]" full-width />
            <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Apply access</MdvButton></template>
          </MdvSideSheet>
          <p role="status">Access: {{ access }}</p>
        </div>
        <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Done</MdvButton></template>
      </MdvDialog>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 无障碍、手势与动画

Modal 使用 `dialog` 和 `aria-modal=true`，约束焦点、锁定背景滚动，并在关闭后恢复焦点。Standard 使用布局内的非模态 `section role="dialog"`。标题或 header 提供面板名称；否则传入 `aria-label` 或 `aria-labelledby`。仅在没有正文插槽时，默认 description 自动关联为说明。

<DocsTable label="侧边面板交互">

| 交互 | Modal | Standard |
| --- | --- | --- |
| Tab / Shift+Tab | 保留在当前活动模态内。 | 在面板、主内容和外围界面间正常移动。 |
| Escape | 启用时请求关闭最上层面板。 | 不提供全局 Escape 关闭。 |
| 关闭操作 | 经过守卫的 close-button 请求。 | 经过守卫的 close-button 请求。 |
| 返回操作 | 发出 back，不自动关闭。 | 发出 back，不自动关闭。 |
| 边缘滑动 | 默认启用，遵循守卫与父级拒绝。 | 不提供。 |

</DocsTable>

Modal 朝向内容的 12px 内边缘可接受横向拖动，向隐藏方向松手即可请求关闭，方向结合 placement 与 RTL 计算。距离不足、取消或拒绝会回弹；纵向滚动及普通正文交互保留原生行为。拖动用于关闭，不是改变宽度；需要调整尺寸时，由应用修改 `width`。

面板横移、Standard 占位宽度和遮罩分别执行，不缩放正文。减少动态效果时直接定位到已接受状态。真实触摸与滑动、嵌套焦点和 Escape、读屏、强制颜色及最终响应式布局仍需独立验证。

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
