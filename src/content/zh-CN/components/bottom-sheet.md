<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BottomSheetBasicDemo from '@/components/docs/demos/bottomSheet/basic.vue'
import BottomSheetClosePolicyDemo from '@/components/docs/demos/bottomSheet/closePolicy.vue'
import BottomSheetScaffoldDemo from '@/components/docs/demos/bottomSheet/scaffold.vue'
import BottomSheetAppearanceDemo from '@/components/docs/demos/bottomSheet/appearance.vue'

const appearanceProps: ApiTableItem[] = [
  { name: 'title', type: 'string', default: "''", description: '可见标题及可访问名称；自定义内容可使用 header 插槽。' },
  { name: 'description', type: 'string', default: "''", description: '未提供正文插槽时显示的默认正文。' },
  { name: 'maxHeight', type: 'string', description: '可选的 CSS 高度上限；默认根据响应式顶部留白及视口或 Scaffold 可用高度限制。' },
  { name: 'showHandle', type: 'boolean', default: 'true', description: '显示原生按钮手柄。隐藏后，仅在两个高度锚点可用时显示替代的展开/收起图标按钮。' },
  { name: 'draggable', type: 'boolean', default: 'true', description: '启用鼠标/触摸拖动；不影响手柄点击及显式操作。' },
  { name: 'expandLabel', type: 'string', description: '展开操作的无障碍名称。' },
  { name: 'collapseLabel', type: 'string', description: '收合操作的无障碍名称。' },
  { name: 'closeLabel', type: 'string', description: '手柄用于隐藏面板时的无障碍名称。' },
]
const modalProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: '受控的显示状态；接收 update:modelValue 才会完成用户关闭请求。' },
  { name: 'expanded', attribute: 'v-model:expanded', type: 'boolean', default: 'false', description: '初始展开状态；省略时内部管理，传入后受控。每次打开根据当前 prop 重置。' },
  { name: 'partial', type: 'boolean | number', default: 'true', description: 'true 为可见视口的一半，数字为限制到 0–1 的高度比例；false 移除半展开锚点并直接展开。' },
  ...appearanceProps,
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: '允许 Escape 通过 beforeClose 请求关闭。' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: '允许点击遮罩通过 beforeClose 请求关闭。' },
  { name: 'closeOnSwipe', type: 'boolean', default: 'true', description: '允许拖动到隐藏锚点；不会禁止点击手柄关闭。' },
  { name: 'beforeClose', type: 'MdvBottomSheetBeforeClose', description: '同步或异步关闭守卫；返回 false 或抛出异常会保留面板。直接修改显示模型不会经过守卫。' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: '退出动画结束后卸载面板内容；外部模型状态仍由应用管理。' },
]
const scaffoldProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: "'hidden' | 'partial' | 'expanded'", default: "'partial'", description: '高度状态；省略时内部管理，传入后受控。' },
  { name: 'peekHeight', type: 'number', default: '56', description: '半展开时可见高度，单位 px。这是 MDV 默认约定，并非 Material 固定尺寸。' },
  { name: 'hideable', type: 'boolean', default: 'false', description: '允许用户通过拖动或手柄隐藏；false 时程序设置 hidden 和调用 close() 仍有效。' },
  ...appearanceProps,
]
const modalSlots: SlotTableItem[] = [
  { name: 'default', description: '公共内容滚动区中的正文，替代 description；接收公共面板插槽参数。' },
  { name: 'header', description: '替代标题头部；接收公共面板插槽参数。' },
  { name: 'actions', description: '正文之后的操作，与标题、正文一起滚动；接收公共面板插槽参数。' },
]
const scaffoldSlots: SlotTableItem[] = [
  { name: 'default', description: '保持交互的主页面，不提供插槽参数。' },
  { name: 'sheet', description: '可滚动面板正文，替代 description；接收公共面板插槽参数。' },
  { name: 'header', description: '面板标题头部；接收公共面板插槽参数。' },
  { name: 'actions', description: '公共滚动区中位于正文之后的操作；接收公共面板插槽参数。' },
]
</script>
# 底部面板

底部面板从屏幕底边显示内容或操作。模态面板用 `MdvBottomSheet`，页面内的面板用 `MdvBottomSheetScaffold`。

## 模态面板

用 `v-model` 控制显示，并为面板设置标题。在 `#actions` 中可提供关闭操作，并按需返回结果。

<DemoBlock>
  <BottomSheetBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton } from '@mdv-ui/mdv'
import type { MdvBottomSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const result = ref('Choose an action in the sheet.')

function onClose(detail: MdvBottomSheetCloseDetail) {
  result.value = `Closed: ${detail.reason}; result: ${detail.returnValue || '(none)'}`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Open bottom sheet</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvBottomSheet
      v-model="open"
      title="Share this document"
      description="Choose how to share your latest notes."
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
      @close="onClose"
    >
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close()">Cancel</MdvButton>
        <MdvButton @click="close('shared')">Share</MdvButton>
      </template>
    </MdvBottomSheet>
  </div>
</template>
```

  </template>
</DemoBlock>

## 关闭策略

用 `before-close` 确认是否关闭。可以返回 `false` 阻止关闭，或返回 Promise 等待决定。直接修改模型关闭会绕过此拦截。

<DemoBlock>
  <BottomSheetClosePolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvBottomSheetBeforeClose } from '@mdv-ui/mdv'

const open = ref(false)
const allowClose = ref(false)
const message = ref('Enable closing before leaving this sheet.')

const beforeClose: MdvBottomSheetBeforeClose = (detail) => {
  if (allowClose.value) return true
  message.value = `The ${detail.reason} request was blocked. Enable closing and try again.`
  return false
}
</script>

<template>
  <MdvButton @click="open = true">Try guarded closing</MdvButton>
  <MdvBottomSheet
    v-model="open"
    title="Review before closing"
    :before-close="beforeClose"
    :close-on-scrim="false"
    :close-on-swipe="false"
    expand-label="Expand sheet"
    collapse-label="Collapse sheet"
    close-label="Close sheet"
  >
    <div class="grid gap-4">
      <p>Scrim clicks and downward dismissal are disabled. Escape, the handle, and Close still use the guard.</p>
      <MdvCheckbox v-model="allowClose" label="Allow this sheet to close" />
      <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
    </div>
    <template #actions="{ close }">
      <MdvButton @click="close('reviewed')">Close</MdvButton>
    </template>
  </MdvBottomSheet>
</template>
```

  </template>
</DemoBlock>

## Scaffold 标准面板

给 Scaffold 设置明确的高度。页面放在默认插槽，面板放在 `#sheet`；收起时会为其保留 `peek-height` 高度。

<DemoBlock>
  <BottomSheetScaffoldDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheetScaffold, MdvButton } from '@mdv-ui/mdv'
import type { MdvBottomSheetState } from '@mdv-ui/mdv'

const state = ref<MdvBottomSheetState>('partial')
const visits = ref(0)
</script>

<template>
  <div class="h-[480px] overflow-hidden rounded-xl border border-mdv-outline-variant bg-mdv-surface">
    <MdvBottomSheetScaffold
      v-model="state"
      title="Nearby places"
      :peek-height="88"
      hideable
      expand-label="Expand places"
      collapse-label="Collapse places"
      close-label="Hide places"
    >
      <div class="grid justify-items-start gap-4 p-5">
        <p class="text-lg font-medium">Explore your neighborhood</p>
        <p class="text-sm text-mdv-on-surface-variant" role="status">Sheet: {{ state }} · Visits: {{ visits }}</p>
        <div class="flex flex-wrap gap-3">
          <MdvButton variant="tonal" @click="visits++">Visit a place</MdvButton>
          <MdvButton variant="outlined" @click="state = 'expanded'">Show places</MdvButton>
        </div>
        <p class="text-sm">The main page remains interactive while this standard sheet is open.</p>
      </div>
      <template #sheet>
        <div class="grid gap-4">
          <p v-for="place in ['Riverside park', 'Community library', 'Art museum', 'Botanical garden', 'Coffee house', 'City market']" :key="place">
            {{ place }}
          </p>
        </div>
      </template>
      <template #actions="{ collapse, close }">
        <MdvButton variant="text" @click="collapse()">Collapse</MdvButton>
        <MdvButton variant="text" @click="close()">Hide</MdvButton>
      </template>
    </MdvBottomSheetScaffold>
  </div>
</template>
```

  </template>
</DemoBlock>

## 手柄与尺寸

用 `show-handle` 控制拖动手柄的显示，用 `draggable` 单独控制是否可拖动。对不应触发拖动的自定义控件，可添加 `data-mdv-sheet-no-drag`。

<DemoBlock>
  <BottomSheetAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'

const open = ref(false)
const showHandle = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="showHandle" label="Show drag handle" />
    <MdvButton @click="open = true">Open reading sheet</MdvButton>
    <MdvBottomSheet
      v-model="open"
      title="Reading list"
      :show-handle="showHandle"
      :draggable="false"
      :partial="0.35"
      max-height="70dvh"
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
    >
      <div class="grid gap-4">
        <p>Dragging is disabled. Without a handle, a separate expand/collapse action appears when two height states are available.</p>
        <p v-for="index in 10" :key="index">Reading note {{ index }}: leave room to think and revisit ideas.</p>
      </div>
      <template #actions="{ close }">
        <MdvButton @click="close()">Close reading list</MdvButton>
      </template>
    </MdvBottomSheet>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### MdvBottomSheet 属性

<ApiTable :items="modalProps" />

### MdvBottomSheet 插槽

<SlotsTable :items="modalSlots" />

### MdvBottomSheetScaffold 属性

<ApiTable :items="scaffoldProps" />

### MdvBottomSheetScaffold 插槽

<SlotsTable :items="scaffoldSlots" />

面板插槽统一接收 `{ state, expanded, close, expand, collapse }`。`state` 为实际高度状态，`expanded` 为对应的布尔值。Scaffold 主页面的默认插槽不提供参数。

### 事件

<DocsTable label="底部面板事件" min-width="38rem">

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` / `MdvBottomSheetState` | 模态显示请求，或 Scaffold 高度状态请求。 |
| `update:expanded` | `boolean` | 仅模态提供的展开状态请求。 |
| `open` / `opened` | — | 开始打开 / 打开动画完成。 |
| `close` / `closed` | `MdvBottomSheetCloseDetail` | 已接受关闭请求，开始退出 / 退出动画完成。 |
| `change` | `MdvBottomSheetChangeDetail` | 实际高度状态变化，包括尺寸重新计算导致的变化。 |

</DocsTable>

关闭详情包含 `reason` 和 `returnValue`。模态原因类型为 `'escape' | 'scrim' | 'close-button' | 'action' | 'form' | 'model' | 'handle' | 'swipe'`（公共类型包含 `close-button`，但面板不内置关闭按钮）。Scaffold 使用 `'model' | 'handle' | 'swipe' | 'action'`，返回值始终为空字符串。状态变化详情为 `{ state, previousState, reason }`，其中原因是 `'model' | 'handle' | 'swipe' | 'action' | 'resize'`。

### 方法

<DocsTable label="底部面板暴露方法" min-width="32rem">

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `close(returnValue?: string)` | `Promise<boolean>` | 请求隐藏。模态使用守卫及返回值；Scaffold 忽略返回值参数。 |
| `expand()` | `Promise<boolean>` | 请求展开锚点。 |
| `collapse()` | `Promise<boolean>` | 半展开锚点可用时请求收起。 |
| `focus()` | `void` | 聚焦模态，或可见标准面板的手柄/面板。 |

</DocsTable>

Promise 的布尔值表示父级是否已接受请求，不代表动画结束。需要确认进出动画完成时使用 `opened` / `closed`。

### 原生属性与类型

模态的 `class`、`style` 应用于面板，CSS 自定义属性同时传到 dialog 根节点，原生 ARIA 与 `dir` 应用于 dialog。Scaffold 的普通属性透传到外层根节点。表单属性应放在实际表单和控件上。

```ts
import type {
  MdvBottomSheetState,
  MdvBottomSheetCloseReason,
  MdvBottomSheetChangeReason,
  MdvBottomSheetCloseDetail,
  MdvBottomSheetChangeDetail,
  MdvBottomSheetBeforeClose,
  MdvBottomSheetProps,
  MdvBottomSheetScaffoldProps,
  MdvBottomSheetSlotProps,
} from '@mdv-ui/mdv'
```
