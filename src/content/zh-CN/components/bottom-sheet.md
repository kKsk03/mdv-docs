<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BottomSheetBasicDemo from '@/components/docs/demos/bottomSheet/basic.vue'
import BottomSheetStateDemo from '@/components/docs/demos/bottomSheet/state.vue'
import BottomSheetClosePolicyDemo from '@/components/docs/demos/bottomSheet/closePolicy.vue'
import BottomSheetFormDemo from '@/components/docs/demos/bottomSheet/form.vue'
import BottomSheetScaffoldDemo from '@/components/docs/demos/bottomSheet/scaffold.vue'
import BottomSheetAppearanceDemo from '@/components/docs/demos/bottomSheet/appearance.vue'

const appearanceProps: ApiTableItem[] = [
  { name: 'title', type: 'string', default: "''", description: '可见标题及可访问名称；自定义内容可使用 header 插槽。' },
  { name: 'description', type: 'string', default: "''", description: '未提供正文插槽时显示的默认正文。' },
  { name: 'maxHeight', type: 'string', description: '可选的 CSS 高度上限；默认根据响应式顶部留白及视口或 Scaffold 可用高度限制。' },
  { name: 'showHandle', type: 'boolean', default: 'true', description: '显示原生按钮手柄。隐藏后，仅在两个高度锚点可用时显示替代的展开/收起图标按钮。' },
  { name: 'draggable', type: 'boolean', default: 'true', description: '启用鼠标/触摸拖动；不影响手柄点击及显式操作。' },
  { name: 'expandLabel', type: 'string', default: "'展开面板'", description: '展开操作的可访问名称，按应用语言设置。' },
  { name: 'collapseLabel', type: 'string', default: "'收起面板'", description: '收起操作的可访问名称，按应用语言设置。' },
  { name: 'closeLabel', type: 'string', default: "'关闭面板'", description: '通过手柄隐藏时的可访问名称，按应用语言设置。' },
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

底部面板从表面下方展示相关操作或辅助内容。`MdvBottomSheet` 是阻止背景交互的模态面板；`MdvBottomSheetScaffold` 将标准面板放在页面内部，主页面仍可操作。

## 模态面板

使用 `v-model` 绑定显示状态，提供标题，在 `actions` 插槽中关闭并返回可选结果。短内容按自然高度展示，不会为了半展开而强制占满半屏。

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

模态面板使用浏览器顶层的原生 `<dialog>`，保留原始 DOM 位置以继承局部主题。它会管理焦点限制、关闭后焦点恢复及背景滚动锁。

### 高度状态与滚动

通过 `partial` 设置半展开高度；需要在应用中控制展开时，绑定 `v-model:expanded`。可以拖动手柄，也可以使用示例中的按钮。标题、正文和操作共用手柄下方的滚动区，长内容需要向下滚动才能到达底部操作。

<DemoBlock>
  <BottomSheetStateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvBottomSheetChangeDetail } from '@mdv-ui/mdv'

const open = ref(false)
const expanded = ref(false)
const status = ref('Open the sheet to inspect its height states.')

function onChange(detail: MdvBottomSheetChangeDetail) {
  status.value = `${detail.previousState} → ${detail.state} (${detail.reason})`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="expanded" label="Start expanded" />
    <MdvButton @click="open = true">Browse destinations</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ status }}</p>
    <MdvBottomSheet
      v-model="open"
      v-model:expanded="expanded"
      :partial="0.45"
      title="Plan your next trip"
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
      @change="onChange"
    >
      <div class="grid gap-5">
        <p>Drag the handle upward, or use the buttons below. The list scrolls inside the sheet.</p>
        <div v-for="city in ['London', 'Paris', 'Tokyo', 'Seoul', 'Singapore', 'Sydney', 'Lisbon', 'Oslo', 'Rome', 'Helsinki', 'Vienna', 'Prague']" :key="city">
          <p class="font-medium">{{ city }}</p>
          <p class="text-sm text-mdv-on-surface-variant">Explore local museums, parks, and independent cafés.</p>
        </div>
      </div>
      <template #actions="{ expand, collapse, close, expanded: isExpanded }">
        <MdvButton variant="text" @click="isExpanded ? collapse() : expand()">
          {{ isExpanded ? 'Collapse' : 'Expand' }}
        </MdvButton>
        <MdvButton @click="close()">Done</MdvButton>
      </template>
    </MdvBottomSheet>
  </div>
</template>
```

  </template>
</DemoBlock>

`partial` 表示可见视口高度的 50%，其他比例请绑定数字，例如 `:partial="0.45"`。设置 `:partial="false"` 会移除半展开锚点，直接展开。展开仍受顶部留白和 `max-height` 限制，不等同于全屏。

内容过短而无法形成两个不同高度时，半展开与展开会合并。通过 `change` 或插槽的 `state` 读取实际状态。省略 `expanded` 时由内部管理，每次重新打开重置；传入后，父级必须接受 `update:expanded` 才会改变。

---

## 关闭策略

`close-on-esc`、`close-on-scrim`、`close-on-swipe` 分别控制关闭入口。守卫接收 `{ reason, returnValue }`，返回 `false` 或抛出异常/拒绝 Promise 会保留面板；也支持等待异步确认，例如确认对话框的结果。

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

Escape、遮罩、手柄、滑动、显式操作及 `method="dialog"` 表单关闭都会经过 `before-close`。直接设置 `open = false` 会绕过守卫。并发关闭请求复用等待中的结果，旧异步请求不会关闭重新打开的面板。

模态手柄在半展开时点击会展开，已经展开时再次点击会请求**关闭**。`:close-on-swipe="false"` 仅禁止滑动隐藏。限制手势或隐藏手柄时，应保留显式关闭按钮。

### 表单与状态保留

原生 `method="dialog"` 表单将提交按钮的 `value` 作为 `returnValue` 返回，关闭原因为 `form`。必填字段照常校验。本例把草稿模型放在面板外部，关闭后重新打开仍保留内容。

<DemoBlock>
  <BottomSheetFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvTextField } from '@mdv-ui/mdv'
import type { MdvBottomSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const draft = ref('Weekend reading')
const result = ref('The draft is preserved when the sheet closes.')

function onClose(detail: MdvBottomSheetCloseDetail) {
  result.value = detail.returnValue === 'save' ? `Saved: ${draft.value}` : 'Closed without saving.'
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Edit collection</MdvButton>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvBottomSheet
      v-model="open"
      title="Collection details"
      :partial="false"
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
      @close="onClose"
    >
      <form method="dialog" class="grid gap-5">
        <MdvTextField v-model="draft" label="Collection name" name="collection" required full-width />
        <div class="flex flex-wrap justify-end gap-3">
          <MdvButton type="submit" value="cancel" variant="text" formnovalidate>Cancel</MdvButton>
          <MdvButton type="submit" value="save">Save</MdvButton>
        </div>
      </form>
    </MdvBottomSheet>
  </div>
</template>
```

  </template>
</DemoBlock>

`destroy-on-close` 默认是 `false`，保留已挂载控件；开启后会在关闭动画结束时卸载内容，但不会清空外部 ref。需要向服务端提交时，使用普通提交处理，成功后再调用插槽的 `close()`。

---

## Scaffold 标准面板

为父容器设置明确高度，默认插槽放主页面，`#sheet` 放面板内容。半展开时主区预留 `peek-height`，展开时覆盖更多主页面区域，但不会变成模态。

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

Scaffold 使用有名称的 region，不限制焦点、不锁页面滚动，也不全局拦截 Escape。主页面控件保持可用。面板隐藏后需要由应用提供重新打开入口，例如上面的 Show places。

`hideable` 默认是 `false`，只限制用户通过拖动/手柄隐藏；设置模型为 `'hidden'` 或调用 `close()` 始终有效。未开启时，展开手柄会收起；开启后手柄可以隐藏面板。露出高度过小时，正文/操作可能暂时设为 inert，展开后恢复，手柄仍可使用。

---

## 手柄与尺寸

使用 `:show-handle="false"` 隐藏拖动手柄，通过 `:draggable="false"` 独立关闭拖动。两个高度锚点可用时会显示替代的展开/收起按钮；它不是自动添加的关闭按钮。

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

默认面板使用 `surface-container-low`、1 级阴影、28px 顶部圆角和 640px 最大宽度。模态的响应式顶部/侧边留白与安全区跟随视口，Scaffold 跟随容器。主题颜色及减少动态效果支持由 MDV 提供，文档站不覆盖面板样式。

## 手势与无障碍

- 鼠标从手柄发起拖动；触摸可从非交互正文发起。横向手势、文本选择和交互控件保留自身行为。
- 对不应触发面板拖动的自定义交互区域添加 `data-mdv-sheet-no-drag`。
- 手柄是原生按钮，支持 Enter 和 Space。显式展开/收起/关闭按钮可作为手势的替代入口。
- 提供可见 `title`，或为自定义模态内容设置可访问名称。三个操作标签都应按应用语言配置，组件默认值为中文。
- 模态负责焦点与嵌套浮层管理；Scaffold 由应用决定何时移动焦点，需要时再调用 `focus()`。

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
