<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import AppBarBasicDemo from '@/components/docs/demos/appBar/basic.vue'
import AppBarVariantDemo from '@/components/docs/demos/appBar/variant.vue'
import AppBarAppearanceDemo from '@/components/docs/demos/appBar/appearance.vue'
import AppBarAlignmentDemo from '@/components/docs/demos/appBar/alignment.vue'
import AppBarImageDemo from '@/components/docs/demos/appBar/image.vue'
import AppBarScrollDemo from '@/components/docs/demos/appBar/scroll.vue'

const appBarProps: ApiTableItem[] = [
  { name: 'variant', type: "'small' | 'medium' | 'large'", default: "'small'", description: '应用栏尺寸。medium 和 large 为可收合的 Flexible 款。' },
  { name: 'appearance', type: "'default' | 'elevated' | 'bordered'", default: "'default'", description: 'default 无阴影和边框；elevated 随滚动渐显阴影；bordered 显示底部分隔线。' },
  { name: 'title', type: 'string', description: '默认标题，title 插槽可替换其内容。' },
  { name: 'subtitle', type: 'string', description: '默认副标题，subtitle 插槽可替换其内容。' },
  { name: 'collapsedTitle', type: 'string', description: 'Small 或收合后的简短标题。仅对默认标题生效，完整标题仍保留为可访问名称。' },
  { name: 'titleAlignment', type: "'start' | 'center'", default: "'start'", description: '按起始侧或整栏中心对齐标题，为两侧不对称操作预留空间。' },
  { name: 'headingLevel', type: '1 | 2 | 3 | 4 | 5 | 6', default: '1', description: '标题使用的原生标题等级。嵌入文章的演示应采用合适的较低等级。' },
  { name: 'scrollBehavior', type: 'MdvAppBarScrollBehavior', default: "'none'", description: 'none、pinned、exit-until-collapsed 或 enter-always，决定固定、收合与隐藏行为。' },
  { name: 'scrollTarget', type: 'MdvAppBarScrollTarget', description: 'Window、HTMLElement、选择器或返回目标的 getter。省略时关联当前 Scaffold 正文，否则使用 Window；显式目标未找到时不回退。' },
  { name: 'scrolled', type: 'boolean', description: '省略时自动推导。显式 false/true 固定滚动配色和可选阴影的起止状态，不改变收合、隐藏或滚动位置。' },
  { name: 'transparentOnScroll', type: 'boolean', default: 'false', description: '随滚动逐步透明，并淡出可选阴影；bordered 的底部分隔线保留。' },
]
const appBarSlots: SlotTableItem[] = [
  { name: 'leading', description: '起始侧操作，例如返回或导航图标按钮。接收 { scrolled, collapsed }。' },
  { name: 'title', description: '替换标题内容。接收 { scrolled, collapsed }，可根据收合状态调整内容。' },
  { name: 'subtitle', description: '替换副标题内容。接收 { scrolled, collapsed }。' },
  { name: 'actions', description: '尾部操作，可放图标按钮、文字按钮或菜单。接收 { scrolled, collapsed }。' },
  { name: 'image', description: '中、大款标题上方的品牌图像。接收 { scrolled, collapsed }；Small 不显示此插槽。' },
]
const scaffoldProps: ApiTableItem[] = [
  { name: 'contentAttrs', type: 'HTMLAttributes', description: '传给正文滚动元素的原生属性和事件，例如 aria-label、id、tabindex 和 onScroll。默认 role 为 region、aria-label 为正文、tabindex 为 0，可覆盖。' },
]
const scaffoldSlots: SlotTableItem[] = [
  { name: 'appbar', description: '放置一个 MdvAppBar，可经过包装组件。自动关联当前 Scaffold 的正文滚动区。' },
  { name: 'default', description: '正文内容。不会自动添加 main 地标或正文 padding。' },
]
</script>

# 应用栏

应用栏展示页面标题、导航入口和常用操作。`MdvAppBar` 提供 Small、Medium flexible 和 Large flexible，并可配合 `MdvAppBarScaffold` 管理独立的正文滚动区。

## 基本用法

通过 `title` 设置标题，用 `leading` 和 `actions` 插槽组合操作。应用栏不会自动生成导航按钮或处理路由，点击逻辑由使用方提供。

<DemoBlock>
  <AppBarBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvAppBar, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import menu from '@iconify-icons/material-symbols/menu'
import favorite from '@iconify-icons/material-symbols/favorite-outline'

const message = ref('Choose an action.')
</script>

<template>
  <div class="grid gap-3">
    <MdvAppBar title="My library" :heading-level="3">
      <template #leading>
        <MdvIconButton variant="standard" aria-label="Open navigation" @click="message = 'Navigation requested.'">
          <MdvIcon :icon="menu" />
        </MdvIconButton>
      </template>
      <template #actions>
        <MdvIconButton variant="standard" aria-label="Show favorites" @click="message = 'Favorites requested.'">
          <MdvIcon :icon="favorite" />
        </MdvIconButton>
      </template>
    </MdvAppBar>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 尺寸

`variant` 支持 `small`、`medium` 和 `large`。中、大款可随滚动收合为 Small；默认 Small 也可以通过 `title-alignment="center"` 获得居中标题。

<DemoBlock>
  <AppBarVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvAppBar } from '@mdv-ui/mdv'
import type { MdvAppBarVariant } from '@mdv-ui/mdv'

const variants: MdvAppBarVariant[] = ['small', 'medium', 'large']
</script>

<template>
  <div class="grid gap-5">
    <div v-for="variant in variants" :key="variant" class="grid gap-2">
      <p class="text-sm text-mdv-on-surface-variant">{{ variant }}</p>
      <MdvAppBar :variant="variant" title="Weekend plans" subtitle="Make time for something new" :heading-level="3" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="应用栏高度">

| 尺寸 | 无副标题 | 有副标题 |
| --- | --- | --- |
| Small | 64px | 64px |
| Medium flexible | 112px | 136px |
| Large flexible | 120px | 152px |

</DocsTable>

这些是标准单行标题的默认高度。中、大款会根据长标题、图片和字体重新测量；建议标题控制在两行以内。Small 和收合状态使用单行省略，可通过 `collapsed-title` 提供简短标题。

---

## 外观

`default` 无阴影或边框；`elevated` 随滚动逐步显示阴影；`bordered` 显示底部分隔线。下面用 `scrolled` 展示完整滚动配色和阴影端点。

<DemoBlock>
  <AppBarAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvAppBar } from '@mdv-ui/mdv'
import type { MdvAppBarAppearance } from '@mdv-ui/mdv'

const appearances: MdvAppBarAppearance[] = ['default', 'elevated', 'bordered']
</script>

<template>
  <div class="grid gap-6">
    <div v-for="appearance in appearances" :key="appearance" class="grid gap-2">
      <p class="text-sm text-mdv-on-surface-variant">{{ appearance }}</p>
      <MdvAppBar :appearance="appearance" title="My library" :scrolled="true" :heading-level="3" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

`scrolled` 只覆盖外观，不会让应用栏收合或改变正文滚动位置。未设置时，配色随实际滚动进度连续变化。

---

## 标题对齐

通过 `title-alignment` 设置起始侧或居中对齐。居中以整个应用栏为基准，不会因仅有前置按钮而偏向一侧。

<DemoBlock>
  <AppBarAlignmentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvAppBar, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvAppBarTitleAlignment } from '@mdv-ui/mdv'
import arrowBack from '@iconify-icons/material-symbols/arrow-back'

const alignments: MdvAppBarTitleAlignment[] = ['start', 'center']
</script>

<template>
  <div class="grid gap-5">
    <div v-for="alignment in alignments" :key="alignment" class="grid gap-2">
      <p class="text-sm text-mdv-on-surface-variant">{{ alignment }}</p>
      <MdvAppBar title="My library" :title-alignment="alignment" :heading-level="3">
        <template #leading>
          <MdvIconButton variant="standard" aria-label="Go back">
            <MdvIcon :icon="arrowBack" />
          </MdvIconButton>
        </template>
      </MdvAppBar>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

`title`、`subtitle` 插槽可替换默认文字。所有应用栏插槽都接收 `{ scrolled, collapsed }`：`scrolled` 表示滚动目标已离开顶部，`collapsed` 表示中、大款已收合到 Small。

---

## 品牌图像

中、大款可通过 `image` 插槽在标题上方放置品牌图像。Small 的品牌标识应放入 `title` 插槽，并提供合适的可访问名称。

<DemoBlock>
  <AppBarImageDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvAppBar } from '@mdv-ui/mdv'
</script>

<template>
  <MdvAppBar variant="large" title="Explore new places" subtitle="A little inspiration for your next trip" :heading-level="3">
    <template #image>
      <svg width="96" height="32" viewBox="0 0 96 32" role="img" aria-label="Explore brand">
        <path d="M16 0 32 16 16 32 0 16Z" fill="currentColor" />
        <text x="40" y="23" font-size="20" fill="currentColor">MDV</text>
      </svg>
    </template>
  </MdvAppBar>
</template>
```

  </template>
</DemoBlock>

---

## 滚动与 Scaffold

应用布局推荐使用 `MdvAppBarScaffold`：应用栏放入 `appbar` 插槽，正文放入默认插槽。Scaffold 自动关联滚动目标，只让正文区域滚动。

在下面的独立区域滚动，切换不同的 `scroll-behavior`；可同时观察简短标题、自定义操作和透明外观。

<DemoBlock>
  <AppBarScrollDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const behavior = ref<MdvSelectValue | null>('exit-until-collapsed')
const transparent = ref(false)
const scaffold = useTemplateRef<InstanceType<typeof MdvAppBarScaffold>>('scaffold')
const behaviors = [
  { value: 'none', label: 'None' },
  { value: 'pinned', label: 'Pinned' },
  { value: 'exit-until-collapsed', label: 'Exit until collapsed' },
  { value: 'enter-always', label: 'Enter always' },
]
const scrollBehaviors = ['none', 'pinned', 'exit-until-collapsed', 'enter-always'] as const
const scrollBehavior = () => scrollBehaviors.find(value => value === behavior.value) ?? 'none'

function backToTop() {
  scaffold.value?.contentElement?.scrollTo({
    top: 0,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  })
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <MdvSelect v-model="behavior" label="Scroll behavior" :options="behaviors" />
      <MdvCheckbox v-model="transparent" label="Transparent on scroll" />
      <MdvButton variant="outlined" @click="backToTop">Back to top</MdvButton>
    </div>
    <MdvAppBarScaffold
      ref="scaffold"
      class="h-80 rounded-mdv-large border border-mdv-outline-variant bg-mdv-surface-container-low"
      :content-attrs="{ 'aria-label': 'App Bar demo content' }"
    >
      <template #appbar>
        <MdvAppBar
          variant="large"
          appearance="elevated"
          title="Weekend adventures"
          collapsed-title="Adventures"
          subtitle="Scroll the content below"
          :heading-level="3"
          :scroll-behavior="scrollBehavior()"
          :transparent-on-scroll="transparent"
        >
          <template #actions="{ collapsed }">
            <MdvButton variant="text" @click="backToTop">{{ collapsed ? 'Top' : 'Back to top' }}</MdvButton>
          </template>
        </MdvAppBar>
      </template>
      <div class="grid gap-4 p-4">
        <div v-for="index in 12" :key="index" class="rounded-mdv-medium bg-mdv-surface p-4">
          <p class="font-medium">Destination {{ index }}</p>
          <p class="mt-2 text-sm text-mdv-on-surface-variant">Scroll here to explore the App Bar behavior.</p>
        </div>
      </div>
    </MdvAppBarScaffold>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="应用栏滚动行为">

| 行为 | 说明 |
| --- | --- |
| `none` | 独立使用时保持普通文档布局；在 Scaffold 中仍位于正文上方，不收合、不隐藏。 |
| `pinned` | 固定在当前滚动区域顶部，保持可见。 |
| `exit-until-collapsed` | 中、大款随正文滚动收合为 Small，只有正文回到顶部附近才展开。 |
| `enter-always` | 向下滚动先收合再隐藏，反向滚动立即出现，静止时吸附到相近端点。 |

</DocsTable>

### 布局要求

Scaffold 需要确定的可用高度，例如示例中的 `h-80`，或在已有高度的布局中使用 `h-full`、`flex-1 min-h-0`。默认插槽不生成 `main`，也不添加 padding，正文语义和留白由使用方决定。

Scaffold 的正文背景透明。可在共同布局容器上设置 `bg-mdv-surface-container-low`；应用栏和导航保留各自的表面配色。

与标准抽屉组合时，让 `MdvNavigationDrawer` 紧邻并位于 Scaffold 之前，作为同一外层容器的兄弟节点。Scaffold 会将应用栏背景延伸到抽屉圆角后方。Modal Drawer 使用独立浮层。

Vue `Transition` 或路由视图可以放在默认插槽内，对正文自行添加页面切换动画，保留应用栏和正文滚动节点。

### 独立滚动目标

独立使用时默认跟随 `window`。监听局部容器可传入 `scroll-target`，例如返回模板引用的 getter：

```vue
<MdvAppBar
  title="My library"
  scroll-behavior="pinned"
  :scroll-target="() => scrollContainer"
/>
```

将应用栏放在对应滚动容器内，以便 sticky 边界与滚动目标一致。显式选择器或 getter 未找到目标时，不会回退；外部稍后创建目标时可调用 `refresh()`。使用 Scaffold 时通常无需传入此属性。

---

## 键盘与无障碍

- 通过 `heading-level` 使标题等级符合页面结构；示例使用 3，避免与文章主标题竞争。
- 图标按钮需提供 `aria-label` 或 `aria-labelledby`，应用栏不会替它们补充名称。
- Tab、Shift+Tab 按原生顺序访问操作。键盘焦点进入应用栏时会恢复完整操作区，并在焦点停留期间保持可见。
- 收合只复用原有插槽节点；系统减少动态效果时关闭吸附补间，仍保留直接跟随滚动的效果。

---

## MdvAppBar API

### 属性

<ApiTable :items="appBarProps" />

### Slots

<SlotsTable :items="appBarSlots" />

### 方法与原生属性

模板引用暴露 `element`（`header` 元素）与 `refresh()`（重新解析滚动目标并测量布局）。没有额外的组件事件或模型；`class`、`style`、`id`、ARIA 和原生事件透传到 `header`。

## MdvAppBarScaffold API

### 属性

<ApiTable :items="scaffoldProps" />

### Slots

<SlotsTable :items="scaffoldSlots" />

### 暴露成员

- `element`：Scaffold 根元素，接收组件的 `class`、`style`、`id`、`dir` 等原生属性。
- `contentElement`：正文滚动元素，可调用原生 `scrollTo()`，并按减少动态效果偏好选择是否平滑滚动。

Scaffold 没有额外的组件事件或模型。正文原生事件通过 `content-attrs` 绑定。

## 类型

```ts
import type {
  MdvAppBarProps,
  MdvAppBarVariant,
  MdvAppBarAppearance,
  MdvAppBarTitleAlignment,
  MdvAppBarScrollBehavior,
  MdvAppBarScrollTarget,
  MdvAppBarSlotProps,
  MdvAppBarScaffoldProps,
} from '@mdv-ui/mdv'
```
