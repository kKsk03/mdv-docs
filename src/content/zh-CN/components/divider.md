<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import DividerBasicDemo from '@/components/docs/demos/divider/basic.vue'
import DividerVerticalDemo from '@/components/docs/demos/divider/vertical.vue'
import DividerSemanticsDemo from '@/components/docs/demos/divider/semantics.vue'
import DividerThemeDemo from '@/components/docs/demos/divider/theme.vue'

const dividerProps: ApiTableItem[] = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '分割线方向。竖线在 flex 或 grid 布局中默认沿交叉轴拉伸，也可以显式设置高度。' },
  { name: 'variant', type: "'full-width' | 'inset' | 'middle-inset'", default: "'full-width'", description: '分别为无缩进、起始端缩进 16px、两端各缩进 16px。竖线将缩进映射到顶部和底部。' },
  { name: 'decorative', type: 'boolean', default: 'true', description: '默认从辅助技术中隐藏。设为 false 时提供 separator 语义和方向信息。' },
]
</script>

# 分割线

`MdvDivider` 用细线区分相邻的内容或操作。优先通过留白建立层次，需要更清晰的边界时再加入分割线。组件本身没有交互，也不额外提供周围的间距。

## 水平分割线

默认分割线占满可用宽度。`inset` 在逻辑起始端留出 16px，`middle-inset` 在两端各留出 16px。适合放在内容分区之间，无需在每个简短条目后都加一条线。

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

设置 `orientation="vertical"`，即可分隔并排的操作或栏目。在横向 flex 布局中，竖线默认拉伸到可用高度；需要短一些时可显式指定高度。普通 block 容器可能需要明确高度才能确定竖线长度。

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

工具栏中第二条竖线设置了 `h-8 self-center`，第一条自然拉伸。分割线周围的空间由容器的 `gap` 管理。它不是操作控件，因此没有最小触摸目标。

## 装饰与语义

分割线默认只起装饰作用：根节点带有 `aria-hidden="true"`，不提供 separator 角色。如果这条边界能够帮助理解操作组或内容结构，可以设置 `:decorative="false"`。

<DemoBlock>
  <DividerSemanticsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDivider } from '@mdv-ui/mdv'

const semantic = ref(true)
const message = ref('Tab moves between the actions, skipping the divider.')
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="semantic" label="Expose a semantic separator" />
    <div class="grid justify-items-start gap-4 rounded-xl bg-mdv-surface-container-low p-4">
      <MdvButton variant="outlined" @click="message = 'Previous action selected.'">Previous action</MdvButton>
      <MdvDivider class="w-full" :decorative="!semantic" aria-label="Reading and actions" />
      <MdvButton variant="outlined" @click="message = 'Next action selected.'">Next action</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

语义分割线会提供 `role="separator"` 和 `aria-orientation`，但仍不会进入 Tab 顺序。它不支持拖动调节尺寸、焦点管理或数值属性，不能直接用作可拖拽的分栏控制器。

## 主题、尺寸与 RTL

分割线继承 `outline-variant` 色彩，默认厚度为 1px，两端无圆角。下面对比局部浅色、深色主题，以及逻辑缩进和显式色彩、厚度覆盖。

<DemoBlock>
  <DividerThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDivider } from '@mdv-ui/mdv'

const rtl = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
    <div class="grid gap-4 sm:grid-cols-2" :dir="rtl ? 'rtl' : 'ltr'">
      <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid gap-4 rounded-xl bg-mdv-surface-container-low py-4 text-mdv-on-surface">
        <p class="px-4 font-medium">{{ theme }} · logical start inset</p>
        <MdvDivider variant="inset" />
        <p class="px-4 text-sm">The 16px inset follows the text direction.</p>
      </div>
    </div>
    <div class="grid gap-4 rounded-xl bg-mdv-surface-container-low py-4" style="--mdv-sys-color-outline-variant: var(--mdv-sys-color-primary)">
      <p class="px-4 text-sm">A local color role and a 2px line</p>
      <MdvDivider variant="middle-inset" style="height: 2px" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

水平 `inset` 跟随书写方向：LTR 时留白在左侧，RTL 时在右侧。对于竖线，MDV 将单端缩进映射到顶部，双端缩进映射到顶部和底部；这是 MDV 的 API 约定。

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

可以按设计需要加粗线条，但这不会使组件具备交互能力。按照当前 Tailwind 层级配置，工具类可以覆盖普通组件样式。

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
