<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BadgeBasicDemo from '@/components/docs/demos/badge/basic.vue'
import BadgeContentDemo from '@/components/docs/demos/badge/content.vue'
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

用 `MdvBadge` 在元素旁显示数量或简短状态。

## 基本用法

把目标元素放在默认插槽中。默认的 `small` 显示圆点，`large` 显示数量或短文本。

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

## 数字与文字

用 `content` 设置大徽标内容。`0` 会正常显示；不传值或传空字符串则隐藏徽标。

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

## 显示与隐藏

用 `visible` 仅隐藏徽标。如果徽标传达有意义的数量或状态，请也把该信息放在目标元素的无障碍名称或描述中。

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
