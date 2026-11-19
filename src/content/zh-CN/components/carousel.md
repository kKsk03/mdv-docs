<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CarouselBasicDemo from '@/components/docs/demos/carousel/basic.vue'
import CarouselVariantDemo from '@/components/docs/demos/carousel/variant.vue'
import CarouselFullScreenDemo from '@/components/docs/demos/carousel/fullScreen.vue'
import CarouselControlledDemo from '@/components/docs/demos/carousel/controlled.vue'
import CarouselContentDemo from '@/components/docs/demos/carousel/content.vue'
import CarouselItemsDemo from '@/components/docs/demos/carousel/items.vue'

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

`MdvCarousel` 通过响应式条目遮罩及媒体展示可浏览集合，支持横向 Multi-browse、Uncontained、Hero，以及竖向 Full-screen。浏览位置通过稳定条目 key 管理。

## 基本用法

为 `items` 提供唯一 `key`，使用 `v-model` 绑定当前浏览锚点。本例使用内嵌 SVG 插画、默认图片条目及英文界面标签。

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

模型表示浏览位置，不是表单选中值或 DOM 焦点。默认条目激活时发出 `item-click`，实际业务操作由应用处理。提供 `href` 时默认条目是原生链接，否则是原生按钮。可在 `item-click` 中同步调用 `originalEvent.preventDefault()`，取消链接导航与自动定位。

### 稳定 key

Key 必须是唯一字符串或有限数字。默认字段是 `key`；其他数据结构可以指定 `item-key="id"` 或 `:item-key="item => item.id"`。缺失、重复 key 会直接抛出错误，不会悄悄使用数组索引。字符串与数字 key 严格区分。

---

## 横向布局

Multi-browse 同时展示较大条目与较小预览；Hero 默认强调居中的大条目；Uncontained 使用公共媒体高度，允许条目经过视口边缘，并通过 `aspectRatio` 改变宽度。

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

<DocsTable label="轮播布局默认配置" min-width="32rem">

| 布局 | 默认对齐 | 默认手势停靠 |
| --- | --- | --- |
| `multi-browse` | `start` | `single-advance` |
| `uncontained` | `start` | `no-snap` |
| `hero` | `center` | `single-advance` |
| `full-screen` | 竖向整页 | 始终 `single-advance` |

</DocsTable>

### 尺寸与手势

`item-size` 是 Multi-browse/Hero 的首选大项宽度，或 Uncontained 的基础项宽。默认 186px，Hero 省略时尽量填满可用宽度。普通视口默认高 205px、间距 8px。这些是 MDV 默认值，并非 Material 强制尺寸。窄容器及少量条目会自动调整排列。

通过 `alignment="start"` 或 `"center"` 设置横向对齐。`fling-behavior="single-advance"` 将快速甩动限制到相邻锚点，低速长拖动仍按距离定位；`multi-browse` 可以跨越更多项。`no-snap` 仅 Uncontained 可用，接受的自由滚动位置不会再次被强制吸附。

横向布局可使用鼠标/触摸拖动、横向触控板或 Shift+滚轮，普通竖向滚轮保留给页面滚动。应保留无需横向手势的替代入口：默认控制在媒体下方，自定义控件也应放在那里。

## 竖向全屏布局

`variant="full-screen"` 填充明确高度的宿主，并按竖向整页浏览。本例主动显示控制，因此不用滑动或滚轮也能操作。

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

这里的全屏指宿主内部的沉浸式区域，不调用浏览器 Fullscreen API、不创建浮层，也不锁定周围页面。默认页间距 16px、外部直角，控制默认隐藏，需要时显式开启。应用转为不适合的横屏布局时，应选择其他布局。

组件没有自动播放、无限循环、视频播放管理或自动数据加载。这些由应用负责，不应假定组件已经提供。

---

## 受控导航

受控模式由父级决定是否接受请求的 key。可以先在拒绝状态尝试 Next，再解锁导航。关闭拖动/滚轮不会关闭其他导航方式。

<DemoBlock>
  <CarouselControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCarousel, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCarouselExpose, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const carousel = useTemplateRef<MdvCarouselExpose>('carousel')
const current = ref<MdvCarouselKey | null>('first')
const locked = ref(true)
const gestures = ref(true)
const result = ref('Unlock navigation to accept a different key.')
const items = ['first', 'second', 'third', 'fourth'].map((key, index) => ({ key, label: `Chapter ${index + 1}` }))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No chapters.',
  item: (index, count) => `Chapter ${index + 1} of ${count}`,
}

function update(key: MdvCarouselKey | null) {
  result.value = `Requested ${key}: ${locked.value ? 'rejected' : 'accepted'}.`
  if (!locked.value) current.value = key
}

async function jump() {
  const accepted = await carousel.value?.scrollTo('fourth', { animate: false, focus: true })
  result.value = accepted ? 'Jump accepted and the chapter was focused.' : 'Jump rejected; the accepted chapter is unchanged.'
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="locked" label="Reject navigation requests" />
      <MdvCheckbox v-model="gestures" label="Enable dragging and wheel" />
    </div>
    <MdvCarousel ref="carousel" :model-value="current" :items="items" :labels="labels" :height="140" :user-scroll-enabled="gestures" aria-label="Controlled chapters" @update:model-value="update" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="jump">Jump to chapter 4</MdvButton>
      <MdvButton variant="outlined" @click="carousel?.focus()">Focus current chapter</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · {{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

拒绝请求后会恢复已接受锚点，不触发成功的 `change`。程序方法返回 `Promise<boolean>` 表示请求是否接受，不等待动画完成。`{ focus: true }` 会直接显露并聚焦目标，避免焦点留在被裁切的条目里。

`null` 明确表示无锚点。无效的受控 key 不会伪造替代 active 值。父级直接修改模型时，不再发出一次更新请求。

## 自定义内容与控制

条目插槽接收原始数据、从零开始的索引和 key 是否为当前 active。Uncontained 适合包含文字及独立控件的丰富内容；头部与控制位于条目遮罩之外。

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

自定义插槽自行负责操作、可访问名称、链接和禁用状态。输入框及媒体保留自身编辑/播放手势。`data-mdv-carousel-no-drag` 可将自定义区域的拖动、滚轮及方向键行为留给该区域。浏览和尺寸重算会保留条目状态，轮播不接管或重置业务输入值。

`header`、`controls` 接收 `{ key, index, count, canPrevious, canNext, previous, next }`。`previous()`、`next()` 发起控制导航并返回 `Promise<boolean>`，应将可用标志绑定到实际控件的 disabled。Full-screen 使用控制插槽时还需设置 `show-controls`。

## 修改集合

稳定 key 在重排时保留条目身份。删除当前项会请求相邻 key，清空集合会请求 `null`。禁用的默认条目仍保留在可浏览集合中，但不能激活操作。

<DemoBlock>
  <CarouselItemsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCarousel } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const initial: MdvCarouselItem[] = [
  { key: 'design', label: 'Design' },
  { key: 'research', label: 'Research' },
  { key: 'drafts', label: 'Drafts', disabled: true },
  { key: 'archive', label: 'Archive' },
]
const items = ref([...initial])
const current = ref<MdvCarouselKey | null>('design')
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No collections.',
  item: (index, count) => `Collection ${index + 1} of ${count}`,
}

function rotate() {
  if (items.value.length) items.value = [...items.value.slice(1), items.value[0]!]
}

function reset() {
  items.value = [...initial]
  current.value = 'design'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCarousel v-model="current" :items="items" :labels="labels" :height="150" aria-label="Dynamic collections">
      <template #empty><p>No collections left. Restore them to continue.</p></template>
    </MdvCarousel>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="!items.length" @click="rotate">Move first to end</MdvButton>
      <MdvButton variant="outlined" :disabled="current === null" @click="items = items.filter(item => item.key !== current)">Remove current</MdvButton>
      <MdvButton variant="text" :disabled="!items.length" @click="items = []">Clear</MdvButton>
      <MdvButton variant="text" @click="reset">Restore</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current ?? '(none)' }} · {{ items.length }} collections</p>
  </div>
</template>
```

  </template>
</DemoBlock>

受控集合删除条目时，请接受对应的模型请求；如果父级拒绝替代目标，轮播不会伪造活动项。可以用 `#empty` 提供业务恢复入口或提示。

---

## 无障碍、主题与动效

- 使用 `aria-label` 或 `aria-labelledby` 命名区域。`labels` 本地化条目说明、控制、跳过链接、空状态及从零开始的 `item(index, count)` 序号文案，默认值为中文。
- 焦点位于条目内时，方向键与 Home/End 浏览；水平键随 RTL 镜像，Full-screen 使用上/下键。此导航会同步浏览锚点与焦点，输入框保留编辑按键。
- Tab 按原生顺序经过控件；离开一项的最后控件时会显露下一项，最后一项可正常离开。不可见项退出 Tab 及无障碍树，聚焦目标前先显露它。
- 键盘可见的跳过链接可直接越过轮播。挂载和尺寸变化不会主动抢焦点。
- 减少动态效果时移除视差及动态宽度展开，使用稳定项宽；Full-screen 仍保持整页定位。局部主题与强制颜色使用 MDV 令牌。

支持 `--mdv-carousel-radius`、`--mdv-carousel-background`、`--mdv-carousel-foreground` 覆盖。条目内容可读取 `--mdv-carousel-mask-start`、`--mdv-carousel-mask-size`、`--mdv-carousel-label-opacity` 来适配遮罩，无需每个动画帧重新渲染。不要在文档站 CSS 中重新实现组件遮罩几何。

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
