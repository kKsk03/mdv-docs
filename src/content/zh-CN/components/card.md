<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CardVariantDemo from '@/components/docs/demos/card/variant.vue'
import CardContentDemo from '@/components/docs/demos/card/content.vue'
import CardHeaderDemo from '@/components/docs/demos/card/header.vue'
import CardInteractiveDemo from '@/components/docs/demos/card/interactive.vue'
import CardDraggedDemo from '@/components/docs/demos/card/dragged.vue'

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

`MdvCard` 将相关内容及操作组织在一个表面中。独立操作使用静态卡片；整张卡片只对应一个主操作时，可以启用整卡按钮或链接。

## 外观变体

卡片支持 `outlined`（默认）、`filled`、`elevated` 三种外观，使用 MDV 表面颜色角色、默认 12px 圆角、16px 内容留白及自然高度。颜色和阴影跟随浅色、深色、局部主题及动态取色。

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

组件不固定宽度，也不强制等高。可通过外层 grid、flex 或卡片上的 `class` 决定页面布局。

---

## 内容与独立操作

在静态卡片中组合 `title`、`subtitle`、`#media`、正文与 `#actions`。下方按钮各自独立操作，点击周围表面不会执行操作。

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

插槽顺序为：**头部 → 媒体 → 正文 → 操作**，未提供的区域不会渲染。图片/视频的尺寸、裁切、加载策略及无障碍替代由应用提供。上面的内嵌插画不依赖外部网络资源。

### 自定义头部

使用 `#header` 放头像、图标或更丰富的文字，会替代 `title` 与 `subtitle`。卡片所有插槽都是无参数的普通插槽。

<DemoBlock>
  <CardHeaderDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCard, MdvIcon } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const count = ref(12)
</script>

<template>
  <MdvCard class="max-w-md">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="grid size-10 shrink-0 place-items-center rounded-full bg-mdv-tertiary-container text-mdv-on-tertiary-container">
          <MdvIcon :icon="folderIcon" />
        </span>
        <div>
          <p class="font-medium">Design resources</p>
          <p class="text-sm text-mdv-on-surface-variant">Shared workspace</p>
        </div>
      </div>
    </template>
    <p class="text-sm" role="status">{{ count }} resources in this collection.</p>
    <template #actions>
      <MdvButton variant="text" @click="count++">Add resource</MdvButton>
    </template>
  </MdvCard>
</template>
```

  </template>
</DemoBlock>

默认标题是 `<p>`，不会自动成为文档标题。自定义头部可根据页面结构选择标题级别。如果自定义头部用于整卡操作，必须显式添加 `aria-label` 或 `aria-labelledby`。

---

## 整卡操作与链接

使用 `clickable` 创建整卡按钮，使用 `href` 创建原生链接；两者同时提供时 `href` 优先。默认标题自动提供可访问名称。可切换禁用状态，并用键盘操作第一张卡片。

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

整卡操作是覆盖在内容上的原生按钮/链接，与内容节点互为兄弟，保留表面内容结构。按钮类型固定为 `button`，放在表单中也不会意外提交。链接保留 Enter、在新标签页打开、复制地址等浏览器行为。

不要在可操作卡片内部再放按钮、链接、输入框或其他可聚焦控件。需要多个操作时，使用静态卡片与独立操作。开发构建会提示交互冲突或缺少可访问名称。

仅给静态卡片添加 `@click` 不会赋予按钮语义、键盘激活或焦点行为。整张表面代表操作时，应明确开启 `clickable`。

### 禁用与拖动外观

`disabled` 只控制整卡主操作，不向静态卡片的内部控件传播。`dragged` 是应用拖动逻辑的视觉状态，切换它不会让卡片具有拖动能力。

<DemoBlock>
  <CardDraggedDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCard, MdvCheckbox } from '@mdv-ui/mdv'

const dragged = ref(false)
const disabled = ref(false)
const clicks = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="dragged" label="Show dragged appearance" />
      <MdvCheckbox v-model="disabled" label="Set card disabled" />
    </div>
    <MdvCard class="max-w-md" :dragged="dragged" :disabled="disabled" title="Static card with an action">
      <p class="text-sm">Dragged changes only the visual state. Disabled does not disable controls inside a static card.</p>
      <template #actions>
        <MdvButton variant="tonal" @click="clicks++">Independent action ({{ clicks }})</MdvButton>
      </template>
    </MdvCard>
  </div>
</template>
```

  </template>
</DemoBlock>

禁用的按钮卡片使用原生 disabled；禁用的链接卡片移除 `href`，设置 `aria-disabled="true"`，退出 Tab 顺序并阻止激活。需要禁用静态卡片中的控件时，请设置该控件自己的 `disabled`。

---

## 无障碍与布局

- 先确定交互方式：静态容器可放独立控件；整卡操作应只有一个操作和一个可访问名称。
- 默认 `title` 自动命名主操作。自定义头部、纯媒体或无标题的操作卡片需要显式 `aria-label` / `aria-labelledby`。
- 原生按钮支持 Enter/Space，原生链接支持 Enter。焦点框、悬停/按压状态层、禁用和减少动态效果由 MDV 处理。
- 有意义的图片提供描述性 alt，装饰图片提供空 alt；卡片文字不会自动成为图片描述。
- 卡片宽度应可响应，正文允许换行。媒体和不间断长内容仍需按容器安排布局。组件没有内置选中、加载、错误或排序模型。

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
