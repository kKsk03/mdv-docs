<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CardVariantDemo from '@/components/docs/demos/card/variant.vue'
import CardContentDemo from '@/components/docs/demos/card/content.vue'
import CardInteractiveDemo from '@/components/docs/demos/card/interactive.vue'

const cardProps: ApiTableItem[] = [
  { name: 'variant', type: "'outlined' | 'filled' | 'elevated'", default: "'outlined'", description: '卡片表面、边框与阴影外观。' },
  { name: 'title', type: 'string', default: "''", description: '默认标题，渲染为段落。使用默认头部时，自动作为整卡操作的可访问名称。' },
  { name: 'subtitle', type: 'string', default: "''", description: '默认标题下方的辅助文字。' },
  { name: 'clickable', type: 'boolean', default: 'false', description: '开启覆盖整卡的原生按钮主操作。仅添加 click 监听不会开启此行为。' },
  { name: 'href', type: 'string', description: '开启原生链接主操作，优先于 clickable；空字符串也会启用链接模式。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '仅禁用整卡主操作，不会禁用静态卡片内的独立控件。' },
  { name: 'dragged', type: 'boolean', default: 'false', description: '由外部控制的拖动中外观，不实现拖动、排序或原生 draggable 属性。' },
]
const cardSlots: SlotTableItem[] = [
  { name: 'header', description: '替代 title/subtitle 的自定义头部。可操作卡片使用自定义头部时需显式提供可访问名称。' },
  { name: 'media', description: '图片、视频等媒体，自行提供尺寸及合适的文字替代。位于卡片边缘时自动适配圆角。' },
  { name: 'default', description: '正文内容；静态卡片可包含独立交互控件。' },
  { name: 'actions', description: '底部操作，默认向逻辑末端对齐。在这里放按钮或链接时应使用静态卡片。' },
]
</script>
# 卡片

用 `MdvCard` 将同一项目的信息和相关操作集中展示。

## 外观变体

用 `variant` 选择 `outlined`、`filled` 或 `elevated`。

<DemoBlock>
  <CardVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvCard } from '@mdv-ui/mdv'
import type { MdvCardVariant } from '@mdv-ui/mdv'

const variants: MdvCardVariant[] = ['outlined', 'filled', 'elevated']
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-3">
    <MdvCard v-for="variant in variants" :key="variant" :variant="variant" :title="variant.charAt(0).toUpperCase() + variant.slice(1)" subtitle="Collection">
      <p class="text-sm">Keep related information together in one surface.</p>
    </MdvCard>
  </div>
</template>
```

  </template>
</DemoBlock>

## 内容与独立操作

用 `title`、`subtitle`、`#media` 和默认插槽组织内容。将独立的按钮或链接放在 `#actions`，让卡片本身保持不可交互。

<DemoBlock>
  <CardContentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCard } from '@mdv-ui/mdv'

const saved = ref(false)
const message = ref('Discover a quiet place along the water.')
</script>

<template>
  <MdvCard class="max-w-md" variant="filled" title="A day by the river" subtitle="Travel journal · 5 min read">
    <template #media>
      <svg viewBox="0 0 480 200" class="w-full bg-mdv-secondary-container text-mdv-secondary" role="img" aria-label="Abstract hills and a river">
        <circle cx="360" cy="50" r="26" fill="currentColor" opacity=".35" />
        <path d="M0 155 100 65 220 145 330 90 480 160V200H0Z" fill="currentColor" opacity=".3" />
        <path d="M0 185Q120 115 240 175T480 155V200H0Z" fill="currentColor" opacity=".6" />
      </svg>
    </template>
    <p class="text-sm" role="status">{{ message }}</p>
    <template #actions>
      <MdvButton variant="text" @click="message = 'The riverside walk is 4 km long and open all year.'">Details</MdvButton>
      <MdvButton variant="tonal" @click="saved = !saved">{{ saved ? 'Saved' : 'Save article' }}</MdvButton>
    </template>
  </MdvCard>
</template>
```

  </template>
</DemoBlock>

## 整卡操作与链接

用 `clickable` 让整张卡片触发一个操作，或用 `href` 将其作为链接。为该操作提供名称，不要在其中嵌套其他按钮或链接。

<DemoBlock>
  <CardInteractiveDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCard, MdvCheckbox } from '@mdv-ui/mdv'

const disabled = ref(false)
const opened = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disabled" label="Disable card actions" />
    <div class="grid gap-5 sm:grid-cols-2">
      <MdvCard clickable :disabled="disabled" title="Open collection" subtitle="Whole-card button" @click="opened++">
        <p class="text-sm">Click anywhere on the card, or focus it and press Enter or Space.</p>
      </MdvCard>
      <MdvCard href="https://m3.material.io/components/cards/overview" target="_blank" rel="noreferrer" :disabled="disabled" title="Card design guidance" subtitle="Opens in a new tab">
        <p class="text-sm">A native link supports browser navigation and opening in a new tab.</p>
      </MdvCard>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Collection opened {{ opened }} times.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### 属性

<ApiTable :items="cardProps" />

### 插槽

<SlotsTable :items="cardSlots" />

### 事件与方法

卡片没有额外组件事件和模型，可监听原生 `click`、指针及键盘事件。可操作卡片的操作监听透传到主按钮/链接，静态卡片则应用于外层容器。

<DocsTable label="卡片暴露方法">

| 方法 | 返回值 | 说明 |
| --- | --- | --- |
| `focus(options?: FocusOptions)` | `void` | 聚焦可用主操作；静态或禁用卡片不移动焦点。 |
| `blur()` | `void` | 主操作当前有焦点时移除焦点。 |

</DocsTable>

### 原生属性与类型

静态卡片的原生属性透传到外层 `<div>`。可操作卡片的 `id`、`class`、`style`、`dir`、`lang`、`hidden`、`inert`、`data-*` 保留在外层；ARIA、原生操作事件、适用的 `target`、`rel`、`download` 等链接属性应用于主控件。传入 `type` 不会改变固定的按钮类型。

```ts
import type { MdvCardVariant } from '@mdv-ui/mdv'
```

`MdvCardVariant` 为 `'outlined' | 'filled' | 'elevated'`；当前包未导出独立的 `MdvCardProps` 接口。
