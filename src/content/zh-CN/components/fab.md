<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FabBasicDemo from '@/components/docs/demos/fab/basic.vue'
import FabSizeDemo from '@/components/docs/demos/fab/size.vue'
import FabColorDemo from '@/components/docs/demos/fab/color.vue'
import FabScrollDemo from '@/components/docs/demos/fab/scroll.vue'

const sharedProps: ApiTableItem[] = [
  { name: 'color', type: 'MdvFabColor', default: "'primary-container'", description: '支持 primary-container、secondary-container、tertiary-container、primary、secondary、tertiary、surface。浮动工具栏中的图标 FAB 可以获得上下文默认色。' },
  { name: 'elevated', type: 'boolean', default: 'true', description: '启用 FAB 阴影和悬停时的阴影变化。关闭后仍保留色彩和状态层。' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: '未设置 href 时的原生按钮类型，不会为链接添加按钮行为。' },
  { name: 'href', type: 'string', description: '提供时渲染原生 a 元素。可继续透传 target、rel、download 等链接属性。' },
  { name: 'position', type: "'static' | 'absolute' | 'fixed'", default: "'static'", description: '分别参与普通布局、相对定位容器定位、相对视口定位。absolute 需要宿主建立正确的包含块。' },
  { name: 'placement', type: "'bottom-start' | 'bottom-center' | 'bottom-end'", default: "'bottom-end'", description: 'absolute/fixed 模式的底部逻辑对齐位置，start/end 跟随书写方向。' },
  { name: 'offset', type: 'number', default: '16', description: '距离边缘的非负像素值，设备安全区另计。' },
]
const fabProps: ApiTableItem[] = [
  { name: 'size', type: "'small' | 'regular' | 'medium' | 'large'", default: "'regular'", description: '可见表面依次为 40、56、80、96px。旧版 small FAB 保留 48px 的原生交互目标。' },
  ...sharedProps,
]
const extendedFabProps: ApiTableItem[] = [
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'small'", description: '高度依次为 56、80、96px。扩展 FAB 没有 regular 尺寸。' },
  ...sharedProps,
  { name: 'expanded', type: 'boolean', default: 'true（内部状态）', description: '省略时内部管理，传入布尔值后为受控状态。只有带 leading 图标时才允许收合。' },
  { name: 'scrollBehavior', type: "'none' | 'collapse'", default: "'none'", description: '可选的滚动收合行为：向下滚动收起文字，向上滚动展开文字。' },
  { name: 'scrollTarget', type: 'MdvFabScrollTarget', default: 'window', description: 'Window、HTMLElement、选择器或返回目标的函数。显式指定但不存在的目标不会回退到 window。' },
  { name: 'scrollThreshold', type: 'number', default: '40', description: '同方向累计滚动达到该像素值后请求展开或收合，反向滚动会重新累计。' },
]
const fabSlots: SlotTableItem[] = [
  { name: 'default', description: '装饰图标。图标容器带 aria-hidden 和 inert，需在 FAB 根节点提供可访问名称。无参数。' },
]
const extendedFabSlots: SlotTableItem[] = [
  { name: 'default', description: '简短的操作文字。视觉收合后仍保留为可访问名称。无参数。' },
  { name: 'leading', description: '可选的装饰图标，对辅助技术隐藏且不可交互。需要收合时必须提供。无参数。' },
]
</script>
# 浮动操作按钮

用悬浮操作按钮承载视图的主要操作。图标按钮用 `MdvFab`，需要显示文字时用 `MdvExtendedFab`。

## 图标与扩展按钮

仅显示图标时，请提供无障碍名称。扩展 FAB 的标签放在默认插槽，图标放在 `#leading`。

<DemoBlock>
  <FabBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvExtendedFab, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const notes = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap items-center gap-6">
      <MdvFab aria-label="Write a note" @click="notes++"><MdvIcon :icon="editIcon" /></MdvFab>
      <MdvExtendedFab @click="notes++">
        <template #leading><MdvIcon :icon="editIcon" /></template>
        Write a note
      </MdvExtendedFab>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Notes created: {{ notes }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 尺寸

用 `size` 设置按钮高度。扩展 FAB 没有 `regular` 尺寸。

<DemoBlock>
  <FabSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvExtendedFab, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import type { MdvExtendedFabSize, MdvFabSize } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const sizes: MdvFabSize[] = ['small', 'regular', 'medium', 'large']
const extendedSizes: MdvExtendedFabSize[] = ['small', 'medium', 'large']
</script>

<template>
  <div class="grid gap-7">
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in sizes" :key="size" class="grid justify-items-center gap-3">
        <MdvFab :size="size" :aria-label="`Create item, ${size}`"><MdvIcon :icon="addIcon" /></MdvFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      </div>
    </div>
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in extendedSizes" :key="size" class="grid justify-items-center gap-3">
        <MdvExtendedFab :size="size"><template #leading><MdvIcon :icon="addIcon" /></template>Create</MdvExtendedFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 色彩与阴影

用 `color` 选择浅色容器或实色外观，用 `elevated` 设置阴影。

<DemoBlock>
  <FabColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import type { MdvFabColor } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const elevated = ref(true)
const colors: MdvFabColor[] = ['primary-container', 'secondary-container', 'tertiary-container', 'primary', 'secondary', 'tertiary', 'surface']
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="elevated" label="Elevated surfaces" />
    <div class="flex flex-wrap gap-x-6 gap-y-7">
      <div v-for="color in colors" :key="color" class="grid justify-items-center gap-3">
        <MdvFab :color="color" :elevated="elevated" :aria-label="`Edit with ${color}`"><MdvIcon :icon="editIcon" /></MdvFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ color }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 摆放位置

`position="static"` 保留在正常文档流中。要相对定位父容器时使用 `absolute`，相对视口时用 `fixed`。`placement` 随文字方向变化。

## 滚动时收起

用 `scroll-behavior="collapse"` 在滚动时收起扩展 FAB 的标签。通过 `scroll-target` 指定实际滚动区域，也可用 `v-model:expanded` 自行控制状态。

<DemoBlock>
  <FabScrollDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvExtendedFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const scaffold = useTemplateRef<InstanceType<typeof MdvAppBarScaffold>>('scaffold')
const expanded = ref(true)
const collapseOnScroll = ref(true)
const notes = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="collapseOnScroll" label="Collapse on downward scroll" />
    <div class="relative h-88 overflow-hidden rounded-xl border border-mdv-outline-variant bg-mdv-surface-container-low">
      <MdvAppBarScaffold ref="scaffold" class="h-full" :content-attrs="{ 'aria-label': 'Scrollable field notes', tabindex: 0 }">
        <template #appbar><MdvAppBar title="Field notes" variant="small" /></template>
        <div class="grid gap-6 p-5 pb-28">
          <p v-for="index in 18" :key="index" class="text-sm">Note {{ index }}: scroll this preview down to collapse the action, then scroll up to show its label.</p>
        </div>
      </MdvAppBarScaffold>
      <MdvExtendedFab v-model:expanded="expanded" position="absolute" :scroll-behavior="collapseOnScroll ? 'collapse' : 'none'" :scroll-target="() => scaffold?.contentElement" @click="notes++">
        <template #leading><MdvIcon :icon="editIcon" /></template>
        Write note
      </MdvExtendedFab>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Label: {{ expanded ? 'expanded' : 'collapsed' }} · Notes: {{ notes }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## MdvFab API

### Props

<ApiTable :items="fabProps" />

### 插槽

<SlotsTable :items="fabSlots" />

### 原生事件与方法

Fab 没有自定义模型或组件事件。`click`、`focus`、`blur`、指针与键盘等原生监听器会传给根控件。按钮可继续使用 `name`、`value`、`form`、`formaction` 等表单属性，链接则使用对应的原生链接属性。

<DocsTable label="FAB 共用实例 API" min-width="31rem">

| 成员 | 类型与作用 |
| --- | --- |
| `element` | 当前的 `HTMLButtonElement` 或 `HTMLAnchorElement`，挂载前、卸载后为 null。 |
| `focus(options?)` | 聚焦原生控件，接受可选的 `FocusOptions`。 |
| `blur()` | 移除原生控件上的焦点。 |

</DocsTable>

## MdvExtendedFab API

### Props

<ApiTable :items="extendedFabProps" />

### 插槽

<SlotsTable :items="extendedFabSlots" />

### 事件与方法

<DocsTable label="扩展 FAB 事件" min-width="31rem">

| 事件 | 参数与含义 |
| --- | --- |
| `update:expanded` | 请求的文字展开状态，类型为 boolean。受控父级接受后才会发生对应变化。 |

</DocsTable>

ExtendedFab 与 Fab 共用 `element`、`focus()`、`blur()`、原生事件和属性透传，并额外提供以下方法：

<DocsTable label="扩展 FAB 展开收合方法" min-width="31rem">

| 方法 | 返回值与作用 |
| --- | --- |
| `expand()` | `Promise<boolean>`；请求展开文字。 |
| `collapse()` | `Promise<boolean>`；存在 leading 图标时请求收合。 |
| `toggle()` | `Promise<boolean>`；请求切换为相反状态。 |
| `refresh()` | `void`；刷新尺寸测量与滚动目标绑定。 |

</DocsTable>

布尔结果表示接受情况，不表示动画结束。仅有文字的 ExtendedFab 无法收合。

### 公开类型

```ts
import type {
  MdvFabProps,
  MdvExtendedFabProps,
  MdvFabColor,
  MdvFabSize,
  MdvExtendedFabSize,
  MdvFabType,
  MdvFabPosition,
  MdvFabPlacement,
  MdvExtendedFabScrollBehavior,
  MdvFabScrollTarget,
} from '@mdv-ui/mdv'
```
