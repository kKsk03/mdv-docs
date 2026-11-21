<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ActionsDemo from '@/components/docs/demos/toolbar/actions.vue'
import ExpansionDemo from '@/components/docs/demos/toolbar/expansion.vue'
import ScrollDemo from '@/components/docs/demos/toolbar/scroll.vue'

const props: ApiTableItem[] = [
  { name: 'variant', type: 'MdvToolbarVariant', default: "'docked'", description: 'docked 填满可用宽度，floating 使用独立圆角表面。' },
  { name: 'color', type: 'MdvToolbarColor', default: "'standard'", description: 'standard 使用中性表面颜色，vibrant 使用主色容器角色。' },
  { name: 'orientation', type: 'MdvToolbarOrientation', default: "'horizontal'", description: '仅浮动款支持 vertical 竖向排列。' },
  { name: 'align', type: 'MdvToolbarAlignment', default: "'center'", description: '沿主轴排列，可选 start、center、end、between。' },
  { name: 'elevated', type: 'boolean', description: '浮动款默认为 true，停靠款默认为 false；可显式覆盖。' },
  { name: 'position', type: 'MdvToolbarPosition', default: "'static'", description: 'static 保留正常文档流，absolute 相对定位祖先，fixed 通常相对视口。' },
  { name: 'placement', type: 'MdvToolbarPlacement', default: "'bottom'", description: '绝对或固定定位的贴边位置：bottom、逻辑 start 或逻辑 end。停靠款只用 bottom。' },
  { name: 'fabPosition', type: 'MdvToolbarFabPosition', default: "'end'", description: '配套 FAB 沿主轴放在逻辑 start 或 end。' },
  { name: 'expanded', attribute: 'v-model:expanded', type: 'boolean', description: '浮动款展开状态；省略时内部管理，初始展开。' },
  { name: 'scrollBehavior', type: 'MdvToolbarScrollBehavior', default: "'none'", description: 'hide 移出整条工具栏，collapse 只适用于可收合的浮动款。' },
  { name: 'scrollTarget', type: 'MdvToolbarScrollTarget', description: 'Window、元素、CSS 选择器或取值函数。省略时监听 window；显式目标不存在时不回退。' },
  { name: 'scrollThreshold', type: 'number', default: '40', description: '同一方向累计多少像素后请求改变状态。' },
  { name: 'expandLabel', type: 'string', default: "'展开工具栏'", description: '收合后展开按钮的无障碍名称。' },
  { name: 'collapseLabel', type: 'string', default: "'收起工具栏'", description: '展开后收合按钮的无障碍名称。' },
]
const slots: SlotTableItem[] = [
  { name: 'default', description: '主要操作。不配套 FAB 时，收合后仍可使用。' },
  { name: 'leading', description: '主要操作前的次要分组；收合时不可交互。' },
  { name: 'trailing', description: '主要操作后的次要分组；收合时不可交互。' },
  { name: 'fab', description: '在浮动款放入一个 MdvFab；操作区收合后 FAB 仍可使用。' },
  { name: 'toggle', description: '替换展开／收合按钮；须将 toggleProps 绑定到实际可交互的控件。' },
]
</script>
# 工具栏

用 `MdvToolbar` 集中呈现当前视图的操作。贴靠工具栏占满容器，浮动工具栏使用独立的表面。

## 贴靠工具栏

通过 `aria-label` 描述工具栏用途。方向键沿工具栏的排列方向在操作之间移动焦点。

<DemoBlock>
  <ActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvToolbar } from '@mdv-ui/mdv'
import boldIcon from '@iconify-icons/material-symbols/format-bold'
import italicIcon from '@iconify-icons/material-symbols/format-italic'
import underlineIcon from '@iconify-icons/material-symbols/format-underlined'

const bold = ref(false)
const italic = ref(false)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvToolbar align="between" aria-label="Text formatting">
      <MdvIconButton v-model:selected="bold" variant="standard" aria-label="Bold">
        <MdvIcon :icon="boldIcon" />
      </MdvIconButton>
      <MdvIconButton variant="standard" aria-label="Underline" disabled>
        <MdvIcon :icon="underlineIcon" />
      </MdvIconButton>
      <MdvIconButton v-model:selected="italic" variant="standard" aria-label="Italic">
        <MdvIcon :icon="italicIcon" />
      </MdvIconButton>
    </MdvToolbar>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Bold: {{ bold ? 'on' : 'off' }}; italic: {{ italic ? 'on' : 'off' }}.
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 浮动工具栏与 FAB

浮动工具栏可以收起 `leading` 和 `trailing` 操作组。在 `#fab` 中放置 `MdvFab` 时，收起的是整个操作组。使用自定义开关时，请绑定 `toggleProps`。

<DemoBlock>
  <ExpansionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon, MdvIconButton, MdvToolbar } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'
import editIcon from '@iconify-icons/material-symbols/edit-outline'
import moreIcon from '@iconify-icons/material-symbols/expand-more'
import lessIcon from '@iconify-icons/material-symbols/expand-less'
import pinIcon from '@iconify-icons/material-symbols/push-pin-outline'

const paired = ref(false)
const expanded = ref(true)
const pinned = ref(false)
const result = ref('No action yet.')
</script>

<template>
  <div class="grid min-w-0 justify-items-start gap-4">
    <MdvCheckbox v-model="paired" label="Pair with a floating action button" />
    <MdvToolbar
      v-model:expanded="expanded"
      variant="floating"
      color="vibrant"
      aria-label="Note actions"
      expand-label="Expand note actions"
      collapse-label="Collapse note actions"
    >
      <template #leading>
        <MdvIconButton v-model:selected="pinned" variant="standard" aria-label="Pin note">
          <MdvIcon :icon="pinIcon" />
        </MdvIconButton>
      </template>
      <MdvIconButton variant="filled" aria-label="Edit note" @click="result = 'Edited the note.'">
        <MdvIcon :icon="editIcon" />
      </MdvIconButton>
      <template v-if="paired" #fab>
        <MdvFab aria-label="Add note" @click="result = 'Added a note.'">
          <MdvIcon :icon="addIcon" />
        </MdvFab>
      </template>
      <template #toggle="{ expanded: isExpanded, toggleProps }">
        <MdvIconButton v-bind="toggleProps" variant="standard">
          <MdvIcon :icon="isExpanded ? lessIcon : moreIcon" />
        </MdvIconButton>
      </template>
    </MdvToolbar>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ expanded ? 'Expanded' : 'Collapsed' }}. {{ pinned ? 'Pinned' : 'Not pinned' }}. {{ result }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 定位与滚动

使用 `scroll-target` 指定局部滚动区域。用 `scroll-behavior="collapse"` 收起次要操作，或用 `hide` 隐藏整条工具栏。绝对定位和固定定位不会为工具栏预留空间。

<DemoBlock>
  <ScrollDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvIcon, MdvIconButton, MdvToolbar } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'
import saveIcon from '@iconify-icons/material-symbols/save'

const scrollArea = useTemplateRef<HTMLElement>('scrollArea')
const expanded = ref(true)
const result = ref('No action yet.')
const notes = [
  'Set up the workspace before inviting reviewers.',
  'Outline the first draft and identify open questions.',
  'Collect feedback from the pilot group.',
  'Review the navigation and common actions.',
  'Check the preview on a narrow viewport.',
  'Prepare a short summary for the next meeting.',
  'Review the final changes before sharing.',
  'Archive the previous draft after approval.',
]
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="relative h-80 overflow-hidden rounded-2xl border border-mdv-outline-variant">
      <div
        ref="scrollArea"
        role="region"
        aria-label="Scrollable draft notes"
        tabindex="0"
        class="h-full overflow-y-auto py-4 ps-4 pe-28 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-mdv-primary"
      >
        <ol class="grid list-decimal gap-4 ps-5">
          <li v-for="note in notes" :key="note" class="rounded-lg bg-mdv-surface-container-low p-3 text-sm">
            {{ note }}
          </li>
        </ol>
      </div>
      <MdvToolbar
        v-model:expanded="expanded"
        variant="floating"
        orientation="vertical"
        position="absolute"
        placement="end"
        scroll-behavior="collapse"
        :scroll-target="() => scrollArea"
        aria-label="Draft editing"
        expand-label="Expand draft actions"
        collapse-label="Collapse draft actions"
      >
        <template #leading>
          <MdvIconButton variant="standard" aria-label="Edit draft" @click="result = 'Edited the draft.'">
            <MdvIcon :icon="editIcon" />
          </MdvIconButton>
        </template>
        <MdvIconButton variant="filled" aria-label="Save draft" @click="result = 'Saved the draft.'">
          <MdvIcon :icon="saveIcon" />
        </MdvIconButton>
      </MdvToolbar>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ expanded ? 'Expanded' : 'Collapsed' }}. {{ result }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### 属性

<ApiTable :items="props" />

### 插槽

<SlotsTable :items="slots" />

所有插槽均收到 `{ expanded, expand, collapse, toggle, toggleProps }`。按钮绑定包含 `aria-expanded`、`aria-controls`、`aria-label` 与 `onClick`。存在可收合分组或配套 FAB 时才有默认切换按钮。

### 事件、原生属性与公开方法

- `update:expanded(boolean)` 请求展开或收合；受控模式只应用父级接受的值。
- 模板引用暴露 `element`、`expand()`、`collapse()`、`toggle()` 和 `refresh()`。三个状态方法返回 `Promise<boolean>`，表示请求是否被接受；`refresh()` 重新测量分组并查找当前滚动目标。
- 原生属性、类名、样式和监听器应用到工具栏根节点。自定义控件或包装层可使用 `--mdv-toolbar-container`、`--mdv-toolbar-content`、`--mdv-toolbar-selected-container` 和 `--mdv-toolbar-selected-content` 取得配色，使用 `--mdv-toolbar-gap` 和 `--mdv-toolbar-margin` 调整间距。

### 公开类型

```ts
import type {
  MdvToolbarVariant,
  MdvToolbarColor,
  MdvToolbarOrientation,
  MdvToolbarAlignment,
  MdvToolbarPosition,
  MdvToolbarPlacement,
  MdvToolbarFabPosition,
  MdvToolbarScrollBehavior,
  MdvToolbarScrollTarget,
  MdvToolbarProps,
  MdvToolbarToggleProps,
  MdvToolbarSlotProps,
} from '@mdv-ui/mdv'
```
