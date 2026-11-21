<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DirectDemo from '@/components/docs/demos/snackbar/direct.vue'
import ActionDemo from '@/components/docs/demos/snackbar/action.vue'
import ProviderDemo from '@/components/docs/demos/snackbar/provider.vue'

const snackbarProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: '受控可见状态。关闭动作发出 update:modelValue 请求后，父级接受才会真正关闭。' },
  { name: 'message', type: 'string', default: "''", description: '默认纯文本消息；默认插槽会替代它。' },
  { name: 'action', type: 'MdvSnackbarAction', description: '可选操作标签及同步/异步 onClick 回调。包含操作时默认常驻。' },
  { name: 'duration', type: 'number', description: '毫秒；无操作时默认 4000，有操作时默认 0。负数按 0 处理，非有限值表示常驻。' },
  { name: 'closable', type: 'boolean', description: '默认常驻消息显示关闭按钮，定时消息不显示。' },
  { name: 'closeLabel', type: 'string', default: "'关闭通知'", description: '关闭按钮的可访问名称；请按应用语言覆盖。' },
  { name: 'actionLayout', type: "'auto' | 'inline' | 'stacked'", default: "'auto'", description: '允许操作换行、保持同行或独占一行。' },
  { name: 'placement', type: "'bottom' | 'bottom-start'", default: "'bottom'", description: '底部居中或逻辑起始侧，并随 RTL 镜像。' },
  { name: 'offset', type: 'number', default: '16', description: '在底部安全区上方增加的距离，单位为 px。' },
  { name: 'pauseOnHover', type: 'boolean', default: 'true', description: '指针停留时暂停倒计时。' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: '仅当焦点位于消息内部时，Escape 才请求关闭。' },
  { name: 'focusShortcut', type: 'string | false', default: "'Alt+G'", description: '将焦点移入可见消息的精确组合键；false 禁用快捷键。' },
  { name: 'color', type: 'MdvSnackbarColor', description: '可选主题色、语义色或种子色；省略时使用 inverse surface 颜色角色。' },
]
const snackbarSlots: SlotTableItem[] = [
  { name: 'default', description: '替换消息内容，收到 { close }。请保持简短，不要在正文中嵌入控件。' },
  { name: 'action', description: '替换内置操作控件，收到 { close, pending }；待处理时应禁用操作。' },
]
</script>

# Snackbar

`MdvSnackbar` 用于宣布简短、非模态的消息，并可提供一个相关操作。本页对应 **MDV 0.1.5**。Snackbar 用于反馈，不应用于要求用户作出决定的场景；需要用户回应后才能继续时应使用 Dialog。

## 受控消息与关闭原因

在应用外壳附近挂载组件，并用 `v-model` 管理可见状态。关闭按钮、操作、Escape 或计时结束都会请求将模型设为 `false`；父组件可接受或拒绝。事件详情包含关闭原因，并区分关闭开始和退场完成。

<DemoBlock>
  <DirectDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvSnackbar } from '@mdv-ui/mdv'
import type { MdvSnackbarCloseDetail, MdvSnackbarPlacement } from '@mdv-ui/mdv'

const visible = ref(false)
const placement = ref<MdvSnackbarPlacement>('bottom')
const result = ref('No message has been shown.')
function togglePlacement() {
  placement.value = placement.value === 'bottom' ? 'bottom-start' : 'bottom'
}
function undo() { result.value = 'Undo action completed.' }
function closed(detail: MdvSnackbarCloseDetail) { result.value = `Closed: ${detail.reason}.` }
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvButton @click="visible = true">Show message</MdvButton>
      <MdvButton variant="outlined" @click="togglePlacement">Placement: {{ placement }}</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvSnackbar v-model="visible" message="Draft deleted." :action="{ label: 'Undo', onClick: undo }" :placement="placement" :duration="0" close-label="Close message" focus-shortcut="Alt+G" />
  </div>
</template>
```

  </template>
</DemoBlock>

无操作的消息默认显示四秒；包含操作时默认常驻，以便用户有时间执行操作。请明确设置 `duration`、`closable`，并本地化 `closeLabel`。

## 异步操作与计时

操作可返回 Promise。等待期间 MDV 会禁用内置操作并暂停计时。成功后会请求关闭，除非监听 `action` 时同步调用了 `preventDefault()`；失败时发出 `actionError` 并保持消息打开。Provider API 不转发 `actionError`；使用调用式 API 时，请在应用操作回调中自行捕获业务错误。

<DemoBlock>
  <ActionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvSnackbar } from '@mdv-ui/mdv'
import type { MdvSnackbarCloseDetail } from '@mdv-ui/mdv'

const visible = ref(false)
const fail = ref(false)
const result = ref('The action result will appear here.')
const snackbar = useTemplateRef<InstanceType<typeof MdvSnackbar>>('snackbar')
function runAction() {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => fail.value ? reject(new Error('The simulated request failed.')) : resolve(), 300)
  })
}
function closed(detail: MdvSnackbarCloseDetail) { result.value = `Closed: ${detail.reason}.` }
function actionError(error: unknown) { result.value = error instanceof Error ? error.message : 'The action failed.' }
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvButton @click="visible = true">Show async action</MdvButton>
      <MdvButton variant="outlined" @click="fail = !fail">Next action: {{ fail ? 'fail' : 'succeed' }}</MdvButton>
      <MdvButton variant="text" @click="snackbar?.pause()">Pause timer</MdvButton>
      <MdvButton variant="text" @click="snackbar?.resume()">Resume timer</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvSnackbar ref="snackbar" v-model="visible" message="Sync the latest draft?" :action="{ label: 'Sync', onClick: runAction }" :duration="1500" closable close-label="Close sync message" @closed="closed" @action-error="actionError" />
  </div>
</template>
```

  </template>
</DemoBlock>

计时从消息入场后开始。指针悬停、消息内部焦点、页面隐藏、手动暂停、MDV Dialog 遮挡、KeepAlive 停用及内置异步操作期间都会暂停并保留剩余时间。消息、操作标签或持续时长变化后会重新计时。

## Provider 队列与组合式函数

在应用中相对稳定的区域放置一个 `MdvSnackbarProvider`，再从其后代组件的 `setup` 中调用 `useSnackbar()`。Provider 维护独立的 FIFO 队列；排队消息在真正显示前不会开始计时。除非应用显式协调，否则请避免多个 Provider 或独立 Snackbar 同时显示。

<DemoBlock>
  <ProviderDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { MdvButton, MdvSnackbarProvider, useSnackbar } from '@mdv-ui/mdv'

const ProviderControls = defineComponent({
  name: 'ProviderControls',
  setup() {
    const snackbar = useSnackbar()
    const result = ref('No provider messages yet.')
    let activeId: string | undefined
    let queuedId: string | undefined
    function showFirst() {
      activeId = snackbar.show({ message: 'Draft saved.', key: 'draft', duration: 0, closable: true })
      result.value = `Active message id: ${activeId}`
    }
    function queueSecond() {
      queuedId = snackbar.show({ message: 'Ready to sync.', duration: 0, closable: true })
      result.value = `Queued message id: ${queuedId}`
    }
    function updateFirst() {
      result.value = `Update accepted: ${activeId ? snackbar.update(activeId, { message: 'Draft saved. Ready to review.' }) : false}`
    }
    function closeFirst() {
      result.value = `Close accepted: ${activeId ? snackbar.close(activeId) : false}`
    }
    function clearAll() {
      snackbar.clear()
      activeId = undefined
      queuedId = undefined
      result.value = 'Provider queue cleared.'
    }
    return () => h('div', { class: 'grid min-w-0 gap-4' }, [
      h('div', { class: 'flex flex-wrap gap-3' }, [
        h(MdvButton, { onClick: showFirst }, { default: () => 'Show first' }),
        h(MdvButton, { variant: 'tonal', onClick: queueSecond }, { default: () => 'Queue second' }),
        h(MdvButton, { variant: 'outlined', onClick: updateFirst }, { default: () => 'Update first' }),
        h(MdvButton, { variant: 'outlined', onClick: closeFirst }, { default: () => 'Close first' }),
        h(MdvButton, { variant: 'text', onClick: clearAll }, { default: () => 'Clear queue' }),
      ]),
      h('p', { class: 'break-words text-sm text-mdv-on-surface-variant', role: 'status' }, result.value),
    ])
  },
})
</script>

<template>
  <MdvSnackbarProvider>
    <ProviderControls />
  </MdvSnackbarProvider>
</template>
```

  </template>
</DemoBlock>

`show()` 接收字符串或选项并返回 ID；`update()` 更新当前或等待中的条目；`close()` 关闭当前项或移除等待项；`clear()` 清空等待项并请求关闭当前消息。传入 `key` 会复用并更新相同 key 的当前或排队消息，而不是重复入队。Provider 卸载时会清空队列。

## 无障碍、位置与主题

消息使用 polite `role="status"` 实时区域，打开时不会移动焦点或限制 Tab。默认快捷键 `Alt+G` 会聚焦到第一个可用控件；若没有控件则聚焦消息容器。只有焦点在 Snackbar 内部时，Escape 才会被处理，因此不会从其他位置关闭父级 Dialog。关闭时，仅当消息实际拥有焦点才尝试恢复原焦点。对于定时消失的提示，也应在触发操作的位置提供上下文反馈；实际读屏播报受浏览器和辅助技术组合影响。

位置遵循逻辑方向，考虑底部安全区并支持减少动态效果。`offset` 可用于避开应用自有导航或悬浮控件。默认颜色使用 inverse-surface 角色；显式主题色或种子色仅影响 Snackbar。支持 Popover API 的浏览器会将其置于原 DOM 位置对应的顶层，以保留局部主题继承；回退为 fixed 定位时，仍可能受祖先层叠上下文影响。

## API

### MdvSnackbar 属性

<ApiTable :items="snackbarProps" />

### 插槽

<SlotsTable :items="snackbarSlots" />

### 事件与公开方法

<DocsTable label="Snackbar 事件">

| 事件 | 参数 | 含义 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 可见状态请求；父级接受后才实际关闭。 |
| `open` / `opened` | 无 | 开始打开 / 入场完成。 |
| `close` / `closed` | `MdvSnackbarCloseDetail` | 已接受关闭的开始 / 退场完成；包含原因。 |
| `action` | `MouseEvent` | 内置操作被激活；同步阻止事件默认行为可保持消息打开。 |
| `actionError` | `unknown` | 内置操作回调抛错或 Promise 被拒绝。 |

</DocsTable>

关闭原因包括 `timeout`、`escape`、`close-button`、`action`、`programmatic` 和 `model`。实例公开 `close()`、`focus()`、`pause()`、`resume()`。

### Provider 与 `useSnackbar()`

`MdvSnackbarProvider` 的默认插槽用于应用内容；没有公开属性或组件事件。`useSnackbar()` 必须在后代 setup 注入上下文中调用，并返回 `MdvSnackbarProviderApi`：

<DocsTable label="Snackbar Provider 方法">

| 方法 | 返回结果 |
| --- | --- |
| `show(input: MdvSnackbarInput): string` | 新增或复用消息并返回 ID。 |
| `update(id, patch): boolean` | 更新匹配的当前或排队消息。 |
| `close(id): boolean` | 请求关闭或移除排队消息。 |
| `clear(): void` | 清空队列并关闭当前消息。 |

</DocsTable>

### 公共类型

```ts
import type {
  MdvSnackbarProps, MdvSnackbarOptions, MdvSnackbarInput, MdvSnackbarAction,
  MdvSnackbarColor, MdvSnackbarActionLayout, MdvSnackbarPlacement,
  MdvSnackbarCloseReason, MdvSnackbarCloseDetail, MdvSnackbarSlotProps,
  MdvSnackbarActionSlotProps, MdvSnackbarSlots, MdvSnackbarProviderApi,
} from '@mdv-ui/mdv'
```