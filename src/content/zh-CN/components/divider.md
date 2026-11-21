<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import DividerBasicDemo from '@/components/docs/demos/divider/basic.vue'
import DividerVerticalDemo from '@/components/docs/demos/divider/vertical.vue'

const dividerProps: ApiTableItem[] = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '分割线方向。竖线在 flex 或 grid 布局中默认沿交叉轴拉伸，也可以显式设置高度。' },
  { name: 'variant', type: "'full-width' | 'inset' | 'middle-inset'", default: "'full-width'", description: '分别为无缩进、起始端缩进 16px、两端各缩进 16px。竖线将缩进映射到顶部和底部。' },
  { name: 'decorative', type: 'boolean', default: 'true', description: '默认从辅助技术中隐藏。设为 false 时提供 separator 语义和方向信息。' },
]
</script>
# 分割线

用 `MdvDivider` 分隔成组的内容或控件。

## 水平分割线

水平分隔线填满可用宽度。用 `inset` 在逻辑起始端留白，或用 `middle-inset` 在两端留白。

<DemoBlock>
  <DividerBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvDivider } from '@mdv-ui/mdv'
import type { MdvDividerVariant } from '@mdv-ui/mdv'

const variants: MdvDividerVariant[] = ['full-width', 'inset', 'middle-inset']
</script>

<template>
  <div class="grid gap-5">
    <div v-for="variant in variants" :key="variant" class="rounded-xl bg-mdv-surface-container-low">
      <p class="p-4 font-medium">{{ variant }}</p>
      <MdvDivider :variant="variant" />
      <p class="p-4 text-sm text-mdv-on-surface-variant">Related content stays together; the line separates the next group.</p>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 垂直分割线

相邻条目之间可用 `orientation="vertical"`。请为分隔线或其所在布局设置高度。

<DemoBlock>
  <DividerVerticalDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvDivider, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import boldIcon from '@iconify-icons/material-symbols/format-bold'
import italicIcon from '@iconify-icons/material-symbols/format-italic'
import underlineIcon from '@iconify-icons/material-symbols/format-underlined'

const bold = ref(false)
const italic = ref(false)
const underline = ref(false)
</script>

<template>
  <div class="grid gap-5">
    <div role="group" aria-label="Text formatting" class="flex h-16 items-center gap-2 rounded-xl bg-mdv-surface-container-low px-3">
      <MdvIconButton v-model:selected="bold" aria-label="Bold"><MdvIcon :icon="boldIcon" /></MdvIconButton>
      <MdvDivider orientation="vertical" />
      <MdvIconButton v-model:selected="italic" aria-label="Italic"><MdvIcon :icon="italicIcon" /></MdvIconButton>
      <MdvDivider orientation="vertical" class="h-8 self-center" />
      <MdvIconButton v-model:selected="underline" aria-label="Underline"><MdvIcon :icon="underlineIcon" /></MdvIconButton>
    </div>
    <p :class="{ 'font-bold': bold, italic, underline }">A line separates actions without becoming another Tab stop.</p>
    <div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 rounded-xl bg-mdv-surface-container-low p-4">
      <p>Short note</p>
      <MdvDivider orientation="vertical" variant="middle-inset" />
      <p class="text-sm text-mdv-on-surface-variant">The divider stretches with this grid row, even when one side contains more text.</p>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 分隔语义

分隔线默认是装饰内容。需要提供分隔语义时，设置 `:decorative="false"`。

## 线条样式

用以下 CSS 变量自定义分隔线。留白方向随文字方向变化。

<DocsTable label="分割线布局与定制" min-width="31rem">

| 项目 | 行为 |
| --- | --- |
| 厚度 | 默认为 1px。水平线通过高度调整，垂直线通过宽度调整。 |
| 长度 | 由容器、缩进以及显式宽高共同决定。 |
| 间距 | 在组合布局上设置 padding 或 gap。 |
| 颜色 | 继承 `--mdv-sys-color-outline-variant`，可通过局部 MDV 主题令牌覆盖。 |
| 交互 | 没有悬停、按下、选中、禁用状态，也没有组件自身的动画。 |
| 强制颜色模式 | 使用系统 `CanvasText` 色彩。 |

</DocsTable>

---

## API

### Props

<ApiTable :items="dividerProps" />

### 透传属性与语义

组件渲染单个 `div`，`class`、`style`、`id`、`dir` 等普通属性会透传到它上面。`role`、`aria-hidden`、`aria-orientation` 由组件根据 `decorative` 和 `orientation` 管理，需要改变语义时请使用这两个 prop。

组件没有内容插槽、自定义事件或额外公开方法。虽然可以透传原生 DOM 事件，但仅添加监听器并不能把视觉分割线变成可用的交互控件。

### 公开类型

```ts
import type { MdvDividerOrientation, MdvDividerVariant } from '@mdv-ui/mdv'
```

MDV 没有单独导出 `MdvDividerProps` 类型。
