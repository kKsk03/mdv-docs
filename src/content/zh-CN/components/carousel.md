<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CarouselBasicDemo from '@/components/docs/demos/carousel/basic.vue'
import CarouselVariantDemo from '@/components/docs/demos/carousel/variant.vue'
import CarouselFullScreenDemo from '@/components/docs/demos/carousel/fullScreen.vue'
import CarouselContentDemo from '@/components/docs/demos/carousel/content.vue'

const carouselProps: ApiTableItem[] = [
  { name: 'items', type: 'readonly T[]', description: '必填的条目数组，T extends object；每项必须具有有效、唯一且稳定的 key。' },
  { name: 'modelValue', attribute: 'v-model', type: 'MdvCarouselKey | null', description: '浏览锚点 key。省略时内部管理，初始指向首项；null 明确表示无锚点。' },
  { name: 'itemKey', type: 'keyof T | ((item: T) => MdvCarouselKey)', default: "'key'", description: 'key 字段或解析函数。缺失、重复、非有限数字等无效 key 会抛出 TypeError，不会回退为索引。' },
  { name: 'variant', type: "'multi-browse' | 'uncontained' | 'hero' | 'full-screen'", default: "'multi-browse'", description: '横向浏览布局，或竖向全屏布局。' },
  { name: 'alignment', type: "'start' | 'center'", default: 'hero: center; others: start', description: '横向布局对齐方式；窄容器及少量条目时关键线位置会适当调整。' },
  { name: 'itemSize', type: 'number', default: '186；hero: 可用宽度', description: 'Multi-browse/Hero 的首选大项宽度，或 Uncontained 的固定基础宽度；布局随可用空间调整。' },
  { name: 'height', type: 'number | string', default: '205px；full-screen: 容器高度', description: '视口高度，数字按 px，也可使用 CSS 长度；Full-screen 需要有明确高度的宿主。' },
  { name: 'gap', type: 'number', default: '8；full-screen: 16', description: '非负项间距，单位 px。' },
  { name: 'flingBehavior', type: "'auto' | 'single-advance' | 'multi-browse' | 'no-snap'", default: "'auto'", description: '拖动/滚轮结束后的停靠策略。Auto 在 Uncontained 使用 no-snap，其余使用 single-advance。自由滚动仅 Uncontained 可用；Full-screen 始终 single-advance。' },
  { name: 'userScrollEnabled', type: 'boolean', default: 'true', description: '开启拖动和滚轮。false 时仍保留键盘、条目激活、外部控制和程序定位。' },
  { name: 'showControls', type: 'boolean', default: '横向: true；full-screen: false', description: '显示视口下方的控制区；自定义 controls 插槽也需要此值为 true。' },
  { name: 'labels', type: 'Partial<MdvCarouselLabels>', default: '中文标签', description: '覆盖 carousel、slide、previous、next、skip、empty 和 item(index, count)；请按应用语言配置。' },
]
const carouselSlots: SlotTableItem[] = [
  { name: 'item', description: '自定义条目内容，接收 { item, index, active }。自行负责原生控件、名称、禁用和业务操作。' },
  { name: 'header', description: '视口上方内容，接收公共控制插槽参数。' },
  { name: 'controls', description: '替代视口下方的上一项/序号/下一项控件；接收公共控制插槽参数，需要 showControls=true。' },
  { name: 'empty', description: 'items 为空数组时的内容，无插槽参数。' },
]
</script>
# 轮播

用 `MdvCarousel` 浏览一组图像或相关内容。

## 基本用法

为每项设置唯一、稳定的 `key`，用 `v-model` 绑定当前项。用 `aria-label` 为轮播命名，用 `labels` 本地化控件文案。

<DemoBlock>
  <CarouselBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCarousel } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const current = ref<MdvCarouselKey | null>('lake')
const message = ref('Choose a destination or use the controls.')
const items: MdvCarouselItem[] = [
  { key: 'lake', label: 'Lake', alt: 'Green hills beside a lake', colors: ['#c5dfce', '#396452'] },
  { key: 'coast', label: 'Coast', alt: 'Blue hills beside the coast', colors: ['#c8e4ef', '#426b91'] },
  { key: 'desert', label: 'Desert', alt: 'Warm dunes under the sun', colors: ['#f0d4bb', '#a65e45'] },
  { key: 'alpine', label: 'Alpine', alt: 'Violet mountains at sunrise', colors: ['#ded6ee', '#787094'] },
].map(({ colors, ...item }) => ({
  ...item,
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><path fill="${colors[0]}" d="M0 0h600v400H0z"/><circle cx="450" cy="90" r="45" fill="#fff0b6"/><path d="M0 340 180 100 380 340 500 180 600 320V400H0Z" fill="${colors[1]}"/></svg>`)}`,
}))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No destinations.',
  item: (index, count) => `Slide ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCarousel
      v-model="current"
      :items="items"
      :labels="labels"
      aria-label="Travel destinations"
      @item-click="message = `Opened ${$event.item.label}.`"
    />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 横向布局

需要同时展示大项目与预览时用 Multi-browse，突出单个大项目时用 Hero，卡片宽度不同时用 Uncontained。

<DemoBlock>
  <CarouselVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCarousel, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselLabels, MdvCarouselVariant } from '@mdv-ui/mdv'

const snap = ref(false)
const variants: MdvCarouselVariant[] = ['multi-browse', 'uncontained', 'hero']
const items: MdvCarouselItem[] = ['#54745c', '#527f9e', '#b07854', '#827096', '#507e7a'].map((color, index) => ({
  key: index,
  label: `Journey ${index + 1}`,
  alt: `Abstract landscape ${index + 1}`,
  aspectRatio: [16 / 9, 3 / 4, 1, 9 / 16, 4 / 3][index],
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><path fill="${color}" d="M0 0h600v400H0z"/><circle cx="430" cy="100" r="48" fill="#fff0c6"/><path d="M0 350 200 150 370 320 500 210 600 340V400H0Z" fill="#fff" opacity=".25"/></svg>`)}`,
}))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No journeys.',
  item: (index, count) => `Slide ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-6">
    <MdvCheckbox v-model="snap" label="Snap uncontained items" />
    <div v-for="variant in variants" :key="variant" class="grid min-w-0 gap-2">
      <p class="font-medium">{{ variant }}</p>
      <MdvCarousel
        :items="items"
        :variant="variant"
        :height="180"
        :fling-behavior="variant === 'uncontained' && snap ? 'single-advance' : 'auto'"
        :labels="labels"
        :aria-label="`${variant} journeys`"
      />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 纵向轮播

使用 `variant="full-screen"` 纵向浏览。给父容器设置明确的高度，并提供控件，让用户不必依赖滑动手势。

<DemoBlock>
  <CarouselFullScreenDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCarousel } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const current = ref<MdvCarouselKey | null>('morning')
const items: MdvCarouselItem[] = [
  { key: 'morning', label: 'Morning', color: '#557867' },
  { key: 'afternoon', label: 'Afternoon', color: '#9b7057' },
  { key: 'evening', label: 'Evening', color: '#655d85' },
].map(({ color, ...item }) => ({
  ...item,
  alt: `${item.label} sky above layered hills`,
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><path fill="${color}" d="M0 0h400v600H0z"/><circle cx="290" cy="150" r="45" fill="#ffefba"/><path d="M0 460 150 300 320 470 400 350V600H0Z" fill="#fff" opacity=".25"/></svg>`)}`,
}))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No scenes.',
  item: (index, count) => `Scene ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-4">
    <div class="h-[400px]">
      <MdvCarousel v-model="current" :items="items" variant="full-screen" :labels="labels" show-controls aria-label="A day outdoors" />
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Scene: {{ current }}. Use Up/Down or the controls to browse vertically.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 自定义内容与控制

用 `item` 插槽展示更丰富的内容。插槽提供当前条目、索引和激活状态。操作控件应可在不拖动的情况下使用。

<DemoBlock>
  <CarouselContentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { MdvButton, MdvCarousel, MdvTextField } from '@mdv-ui/mdv'
import type { MdvCarouselLabels } from '@mdv-ui/mdv'

const items = [
  { id: 'weekend', title: 'Weekend plans' },
  { id: 'reading', title: 'Reading list' },
  { id: 'ideas', title: 'New ideas' },
]
const notes = reactive<Record<string, string>>({ weekend: 'Visit the park', reading: '', ideas: '' })
const result = ref('Notes stay mounted while you browse.')
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No notebooks.',
  item: (index, count) => `Notebook ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCarousel :items="items" item-key="id" variant="uncontained" :item-size="280" :height="240" :labels="labels" aria-label="Personal notebooks">
      <template #header="{ index, count }">
        <p class="font-medium">Notebook {{ index + 1 }} of {{ count }}</p>
      </template>
      <template #item="{ item }">
        <div class="grid h-full content-start gap-4 bg-mdv-tertiary-container p-5 text-mdv-on-tertiary-container">
          <p class="font-medium">{{ item.title }}</p>
          <div data-mdv-carousel-no-drag>
            <MdvTextField v-model="notes[item.id]" :label="`${item.title} note`" full-width />
          </div>
          <MdvButton variant="tonal" @click="result = `Saved ${item.title}: ${notes[item.id] || '(empty)'}`">Save note</MdvButton>
        </div>
      </template>
      <template #controls="{ previous, next, canPrevious, canNext }">
        <MdvButton variant="text" :disabled="!canPrevious" @click="previous()">Previous notebook</MdvButton>
        <MdvButton variant="text" :disabled="!canNext" @click="next()">Next notebook</MdvButton>
      </template>
    </MdvCarousel>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### 属性

<ApiTable :items="carouselProps" />

### 默认条目字段

这些是 `items` 内 `MdvCarouselItem` 对象的字段，不是独立组件 prop。自定义数据可以配合 `item-key` 与 `#item` 使用其他结构。

<DocsTable label="轮播条目字段" min-width="34rem">

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `key` | `string \| number` | 默认 `itemKey` 字段所使用的唯一稳定 key，数字必须有限。 |
| `src` | `string` | 默认渲染器的可选图片地址。 |
| `alt` | `string` | 有意义的图片文字替代；装饰图片使用空字符串。 |
| `label` | `string` | 图片叠加文字及主要可访问名称，省略时回退为 `alt` 或已本地化的项序号。 |
| `href` | `string` | 将默认操作渲染为原生链接，否则为 `type="button"` 按钮。 |
| `target` | `string` | 原生链接目标；`_blank` 且未提供 `rel` 时使用安全默认值。 |
| `rel` | `string` | 显式原生链接关系。 |
| `disabled` | `boolean` | 禁用默认条目的激活及链接导航，但仍可浏览。自定义控件自行处理禁用。 |
| `aspectRatio` | `number` | 仅 Uncontained 使用的宽高比，限制在 9:16–16:9；省略时统一项宽，其余布局忽略。 |

</DocsTable>

### 插槽

<SlotsTable :items="carouselSlots" />

### 事件

<DocsTable label="轮播事件" min-width="38rem">

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `MdvCarouselKey \| null` | 导航或数据变化后的浏览锚点请求，不在拖动每一帧触发。 |
| `change` | `{ key, index, item, reason }` | 已接受的锚点变化；空列表的 index 为 `-1`，item 为 `undefined`。 |
| `itemClick` (`@item-click`) | `{ key, index, item, originalEvent }` | 默认条目激活；自定义插槽操作由应用管理。 |

</DocsTable>

`reason` 为 `'drag' | 'wheel' | 'keyboard' | 'control' | 'item' | 'programmatic' | 'items'`。事件索引从零开始。`change` 表示已接受锚点变化，不表示动画结束，没有 `opened`/`closed` 事件。

### 方法与原生属性

<DocsTable label="轮播暴露方法" min-width="32rem">

| 成员 | 返回值 | 说明 |
| --- | --- | --- |
| `scrollTo(key, options?)` | `Promise<boolean>` | 请求定位到指定 key。 |
| `next(options?)` / `prev(options?)` | `Promise<boolean>` | 请求相邻项，到首尾不会循环。 |
| `focus(options?: FocusOptions)` | `void` | 显露并聚焦当前项；无锚点时使用首项。 |
| `element` | `HTMLElement \| null` | 外层 region 元素。 |

</DocsTable>

导航选项为 `{ animate?: boolean, focus?: boolean }`。普通 `id`、`class`、`style`、`dir`、ARIA 及原生监听器应用于外层 section。自定义条目控件属性放在实际控件上。组件不生成表单字段。

### 公共类型

```ts
import type {
  MdvCarouselKey,
  MdvCarouselVariant,
  MdvCarouselAlignment,
  MdvCarouselFlingBehavior,
  MdvCarouselChangeReason,
  MdvCarouselItem,
  MdvCarouselLabels,
  MdvCarouselProps,
  MdvCarouselNavigateOptions,
  MdvCarouselChangeDetail,
  MdvCarouselControlsSlotProps,
  MdvCarouselItemSlotProps,
  MdvCarouselSlots,
  MdvCarouselExpose,
} from '@mdv-ui/mdv'
```
