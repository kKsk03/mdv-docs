<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BadgeBasicDemo from '@/components/docs/demos/badge/basic.vue'
import BadgeContentDemo from '@/components/docs/demos/badge/content.vue'
import BadgeVisibilityDemo from '@/components/docs/demos/badge/visibility.vue'
import BadgeCountDemo from '@/components/docs/demos/badge/count.vue'

const badgeProps: ApiTableItem[] = [
  { name: 'variant', type: "'small' | 'large'", default: "'small'", description: 'small 显示圆点，large 显示数字或短文本。' },
  { name: 'content', type: 'string | number', description: 'Large 的展示内容，原样显示。数字 0 有效；未设置或空字符串时不渲染 Large 指示器。Small 忽略此值。' },
  { name: 'visible', type: 'boolean', default: 'true', description: '是否渲染指示器，不影响默认插槽中被包裹内容的挂载和交互。' },
]
const badgeSlots: SlotTableItem[] = [
  { name: 'default', description: '被包裹的按钮、图标或其他内容。指示器定位在该包装区域的逻辑右上角。' },
]
</script>

# 徽标

徽标为按钮、图标或其他内容附加简短状态，例如未读提示和消息数量。`MdvBadge` 是状态指示器，操作仍由被包裹的控件负责。

## 基本用法

将内容放入默认插槽。默认 `small` 显示 6px 圆点；`large` 显示数字或短文本，最小高度为 16px。

<DemoBlock>
  <BadgeBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvBadge, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import notifications from '@iconify-icons/material-symbols/notifications-outline'
import mail from '@iconify-icons/material-symbols/mail-outline'
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <MdvBadge>
      <MdvIconButton variant="standard" aria-label="Notifications, new updates available">
        <MdvIcon :icon="notifications" />
      </MdvIconButton>
    </MdvBadge>
    <MdvBadge variant="large" :content="3">
      <MdvIconButton variant="standard" aria-label="Mail, 3 unread messages">
        <MdvIcon :icon="mail" />
      </MdvIconButton>
    </MdvBadge>
  </div>
</template>
```

  </template>
</DemoBlock>

指示器使用主题的 `error` 与 `on-error` 配色，跟随深浅色、局部主题和动态配色。颜色表示徽标的视觉角色，不要求内容本身是错误。

---

## 数字与文字

通过 `content` 设置 Large 内容。值会原样显示，数字 `0` 也是有效内容。未提供内容或传入空字符串时，不渲染 Large 指示器。

<DemoBlock>
  <BadgeContentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvBadge, MdvButton } from '@mdv-ui/mdv'

const values = [0, 7, 99, '99+', 'New']
</script>

<template>
  <div class="flex flex-wrap items-center gap-8 py-2">
    <MdvBadge v-for="value in values" :key="value" variant="large" :content="value" :aria-label="`Status: ${value}`">
      <MdvButton variant="tonal">Inbox</MdvButton>
    </MdvBadge>
  </div>
</template>
```

  </template>
</DemoBlock>

`99+` 是使用方提供的文字，组件不会自动截断数字。保持内容简短，避免长文本遮挡相邻控件。Small 不需要 `content`。

---

## 显示与隐藏

通过 `visible` 控制指示器。隐藏时，被包裹内容保持挂载，焦点和交互不被替换；可以在切换前后点击按钮核对状态。

<DemoBlock>
  <BadgeVisibilityDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'

const visible = ref(true)
const clicks = ref(0)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="visible" label="Show badge" />
    <MdvBadge :visible="visible" aria-label="New updates available">
      <MdvButton variant="tonal" @click="clicks++">Open updates</MdvButton>
    </MdvBadge>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Opened {{ clicks }} times.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

`visible` 不管理已读状态。需要在零条消息时隐藏、读取后清空或定时显示，由使用方绑定业务状态。

### 与消息状态组合

下面显式实现超过 99 时显示 `99+`、零条时隐藏、点击邮箱后清空，以及按钮可访问名称随数量变化。

<DemoBlock>
  <BadgeCountDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import mail from '@iconify-icons/material-symbols/mail-outline'

const unread = ref(3)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <MdvBadge variant="large" :content="unread > 99 ? '99+' : unread" :visible="unread > 0">
        <MdvIconButton variant="tonal" :aria-label="`Read mail, ${unread} unread messages`" @click="unread = 0">
          <MdvIcon :icon="mail" />
        </MdvIconButton>
      </MdvBadge>
      <MdvButton variant="outlined" @click="unread++">Add message</MdvButton>
      <MdvButton variant="outlined" @click="unread += 100">Add 100</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Unread: {{ unread }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 定位与布局

徽标根节点为相对定位的 `inline-flex` 包装器，指示器定位在逻辑 top-end。`dir="rtl"` 时自动镜像，仍跟随内容的逻辑末端。

```vue
<div dir="rtl">
  <MdvBadge variant="large" content="New">
    <MdvButton variant="tonal" aria-label="Inbox, new messages">Inbox</MdvButton>
  </MdvBadge>
</div>
```

为徽标与相邻控件预留空间。父容器的 `overflow: hidden` 可能裁剪超出内容边界的指示器；需要裁剪页面时，应在布局层留出足够的内边距。

组件没有四角定位、`max`、`showZero` 或 `color` 属性，计数规则由 `content` 和 `visible` 组合实现。

---

## 无障碍与交互

指示器不拦截指针事件、不进入 Tab 顺序、不管理焦点。包裹的按钮或链接仍需提供自己的可访问名称。

- 没有 `aria-label` 时，指示器使用 `aria-hidden="true"`。可在按钮名称中包含状态，如基本示例中的未读数量。
- 提供非空 `aria-label` 时，该名称放到指示器上，并设置 `role="img"`。它不会替代被包裹按钮的名称。
- 动态徽标不会自动成为 live region。需要主动播报更新时，由应用提供独立的状态说明，并避免重复播报。

徽标没有独立的选中、禁用、加载或点击事件状态。点击、禁用与键盘操作由默认插槽中的实际控件负责。

---

## API

### 属性

<ApiTable :items="badgeProps" />

### Slots

<SlotsTable :items="badgeSlots" />

### 原生属性与类型

`class`、`style`、`id`、`dir`、`lang`、`data-*` 及其他原生属性透传到包装器；`aria-label` 特殊地作用于指示器。没有额外的组件事件、模型或暴露方法。

```ts
import type { MdvBadgeVariant, MdvBadgeContent } from '@mdv-ui/mdv'
```

`MdvBadgeVariant` 为 `'small' | 'large'`，`MdvBadgeContent` 为 `string | number`。
