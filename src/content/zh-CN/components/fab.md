<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FabBasicDemo from '@/components/docs/demos/fab/basic.vue'
import FabSizeDemo from '@/components/docs/demos/fab/size.vue'
import FabColorDemo from '@/components/docs/demos/fab/color.vue'
import FabExtendedDemo from '@/components/docs/demos/fab/extended.vue'
import FabPlacementDemo from '@/components/docs/demos/fab/placement.vue'
import FabScrollDemo from '@/components/docs/demos/fab/scroll.vue'
import FabFormDemo from '@/components/docs/demos/fab/form.vue'

const sharedProps: ApiTableItem[] = [
  { name: 'color', type: 'MdvFabColor', default: "'primary-container'", description: '支持 primary-container、secondary-container、tertiary-container、primary、secondary、tertiary、surface。浮动工具栏中的图标 FAB 可以获得上下文默认色。' },
  { name: 'elevated', type: 'boolean', default: 'true', description: '启用 FAB 阴影和悬停时的阴影变化。关闭后仍保留色彩和状态层。' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: '未设置 href 时的原生按钮类型，不会为链接添加按钮行为。' },
  { name: 'href', type: 'string', description: '提供时渲染原生 a 元素。可继续透传 target、rel、download 等链接属性。' },
  { name: 'position', type: "'static' | 'absolute' | 'fixed'", default: "'static'", description: '分别参与普通布局、相对定位容器定位、相对视口定位。absolute 需要宿主建立正确的包含块。' },
  { name: 'placement', type: "'bottom-start' | 'bottom-center' | 'bottom-end'", default: "'bottom-end'", description: 'absolute/fixed 模式的底部逻辑对齐位置，start/end 跟随书写方向。' },
  { name: 'offset', type: 'number', default: '16', description: '距离边缘的非负像素值，设备安全区另计。' },
]
const fabProps: ApiTableItem[] = [
  { name: 'size', type: "'small' | 'regular' | 'medium' | 'large'", default: "'regular'", description: '可见表面依次为 40、56、80、96px。旧版 small FAB 保留 48px 的原生交互目标。' },
  ...sharedProps,
]
const extendedFabProps: ApiTableItem[] = [
  { name: 'size', type: "'small' | 'medium' | 'large'", default: "'small'", description: '高度依次为 56、80、96px。扩展 FAB 没有 regular 尺寸。' },
  ...sharedProps,
  { name: 'expanded', type: 'boolean', default: 'true（内部状态）', description: '省略时内部管理，传入布尔值后为受控状态。只有带 leading 图标时才允许收合。' },
  { name: 'scrollBehavior', type: "'none' | 'collapse'", default: "'none'", description: '可选的滚动收合行为：向下滚动收起文字，向上滚动展开文字。' },
  { name: 'scrollTarget', type: 'MdvFabScrollTarget', default: 'window', description: 'Window、HTMLElement、选择器或返回目标的函数。显式指定但不存在的目标不会回退到 window。' },
  { name: 'scrollThreshold', type: 'number', default: '40', description: '同方向累计滚动达到该像素值后请求展开或收合，反向滚动会重新累计。' },
]
const fabSlots: SlotTableItem[] = [
  { name: 'default', description: '装饰图标。图标容器带 aria-hidden 和 inert，需在 FAB 根节点提供可访问名称。无参数。' },
]
const extendedFabSlots: SlotTableItem[] = [
  { name: 'default', description: '简短的操作文字。视觉收合后仍保留为可访问名称。无参数。' },
  { name: 'leading', description: '可选的装饰图标，对辅助技术隐藏且不可交互。需要收合时必须提供。无参数。' },
]
</script>

# 浮动操作按钮

浮动操作按钮用于突出当前页面的主要操作。`MdvFab` 使用图标，`MdvExtendedFab` 则提供简短文字。根据操作的辨识度选择呈现方式，同一页面通常保留一个主要浮动操作。下面的对比用于展示可选方案，不代表推荐同时放置多个主要操作。

## 图标与扩展按钮

纯图标 FAB 需要明确的 `aria-label` 或 `aria-labelledby`。扩展 FAB 通常直接使用可见文字作为名称，需要紧凑形态时再通过 `#leading` 提供图标。

<DemoBlock>
  <FabBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvExtendedFab, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const notes = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap items-center gap-6">
      <MdvFab aria-label="Write a note" @click="notes++"><MdvIcon :icon="editIcon" /></MdvFab>
      <MdvExtendedFab @click="notes++">
        <template #leading><MdvIcon :icon="editIcon" /></template>
        Write a note
      </MdvExtendedFab>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Notes created: {{ notes }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

图标插槽仅用于装饰，不要在 FAB 内再嵌套按钮、输入框或链接。点击扩展 FAB 执行业务操作，不会自动切换展开状态。

## 尺寸

图标 FAB 有四种尺寸，扩展 FAB 有三种高度，不支持 `regular` 值。

<DemoBlock>
  <FabSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvExtendedFab, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import type { MdvExtendedFabSize, MdvFabSize } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const sizes: MdvFabSize[] = ['small', 'regular', 'medium', 'large']
const extendedSizes: MdvExtendedFabSize[] = ['small', 'medium', 'large']
</script>

<template>
  <div class="grid gap-7">
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in sizes" :key="size" class="grid justify-items-center gap-3">
        <MdvFab :size="size" :aria-label="`Create item, ${size}`"><MdvIcon :icon="addIcon" /></MdvFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      </div>
    </div>
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in extendedSizes" :key="size" class="grid justify-items-center gap-3">
        <MdvExtendedFab :size="size"><template #leading><MdvIcon :icon="addIcon" /></template>Create</MdvExtendedFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="FAB 尺寸" min-width="33rem">

| 组件与尺寸 | 可见表面 | 圆角 | 图标 |
| --- | --- | --- | --- |
| Fab small | 40 × 40px；交互目标为 48px | 12px | 24px |
| Fab regular | 56 × 56px | 16px | 24px |
| Fab medium | 80 × 80px | 20px | 28px |
| Fab large | 96 × 96px | 28px | 36px |
| ExtendedFab small | 高度 56px | 16px | 24px |
| ExtendedFab medium | 高度 80px | 20px | 28px |
| ExtendedFab large | 高度 96px | 28px | 36px |

</DocsTable>

扩展 FAB 的水平内边距依次为 16/26/28px，图文间距为 8/12/16px。没有图标时不会预留图标空隙。文字保持单行，不截断、不缩放；窄容器应使用简短文案，而不能依赖自动换行。

## 色彩与阴影

常规的柔和表面可以使用容器色，更强的强调可以使用 primary、secondary、tertiary 实色，也可以根据布局使用 `surface`。`elevated` 只控制阴影，不切换色彩家族。

<DemoBlock>
  <FabColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import type { MdvFabColor } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const elevated = ref(true)
const colors: MdvFabColor[] = ['primary-container', 'secondary-container', 'tertiary-container', 'primary', 'secondary', 'tertiary', 'surface']
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="elevated" label="Elevated surfaces" />
    <div class="flex flex-wrap gap-x-6 gap-y-7">
      <div v-for="color in colors" :key="color" class="grid justify-items-center gap-3">
        <MdvFab :color="color" :elevated="elevated" :aria-label="`Edit with ${color}`"><MdvIcon :icon="editIcon" /></MdvFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ color }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

`surface` 使用 `surface-container-high` 表面和 primary 内容色。启用阴影后默认采用第 3 级，悬停时升至第 4 级。浅深色、8% 悬停状态层、10% 焦点与按下状态层，以及键盘焦点轮廓均来自继承的主题。

## 受控展开与收合

省略 `expanded` 时由 ExtendedFab 管理文字状态；`v-model:expanded` 可以直接接受请求，也可以绑定 `:expanded` 并自行决定是否接受 `update:expanded`。

<DemoBlock>
  <FabExtendedDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvExtendedFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const fab = useTemplateRef<InstanceType<typeof MdvExtendedFab>>('fab')
const expanded = ref(true)
const accept = ref(false)
const withIcon = ref(true)
const message = ref('Requests are rejected until you allow them.')
const notes = ref(0)

function update(value: boolean) {
  message.value = `Requested ${value ? 'expanded' : 'collapsed'}: ${accept.value ? 'accepted' : 'rejected'}.`
  if (accept.value) expanded.value = value
}

async function request(action: 'expand' | 'collapse' | 'toggle') {
  const accepted = await fab.value?.[action]()
  message.value = `${action}() ${accepted ? 'accepted' : 'not accepted'}.`
}
</script>

<template>
  <div class="grid justify-items-start gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="accept" label="Accept expansion requests" />
      <MdvCheckbox v-model="withIcon" label="Include a leading icon" />
    </div>
    <MdvExtendedFab ref="fab" :expanded="expanded" @update:expanded="update" @click="notes++">
      <template v-if="withIcon" #leading><MdvIcon :icon="editIcon" /></template>
      Write note
    </MdvExtendedFab>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="request('expand')">Request expand</MdvButton>
      <MdvButton variant="tonal" @click="request('collapse')">Request collapse</MdvButton>
      <MdvButton variant="outlined" @click="request('toggle')">Request toggle</MdvButton>
      <MdvButton variant="text" @click="fab?.focus()">Focus action</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }} · Notes: {{ notes }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

先尝试请求收合，再启用接受请求进行对比。`expand()`、`collapse()`、`toggle()` 的 Promise 结果表示请求是否被接受，不表示视觉动画已经结束。没有 leading 图标时，组件始终保留文字，即使父级要求收合也是如此。

展开与收合只改变同一个操作的呈现。文字在视觉隐藏时仍保留可访问名称；组件不会添加 `aria-expanded`，因为它不是在展开额外面板。稳定的 DOM 和宽度过渡允许快速反向切换，不会把文字缩小。

## 定位与书写方向

默认 `position="static"` 参与普通布局。需要局部悬浮时，在明确的定位容器中使用 `absolute`；需要相对视口定位时使用 `fixed`。逻辑位置 `placement` 跟随 `dir`。

<DemoBlock>
  <FabPlacementDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon, MdvSelect } from '@mdv-ui/mdv'
import type { MdvFabPlacement } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const placement = ref<MdvFabPlacement>('bottom-end')
const rtl = ref(false)
const count = ref(0)
const placements = ['bottom-start', 'bottom-center', 'bottom-end'].map(value => ({ value, label: value }))
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <MdvSelect :model-value="placement" :options="placements" label="Action placement" @update:model-value="placement = $event as MdvFabPlacement" />
      <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
    </div>
    <div :dir="rtl ? 'rtl' : 'ltr'" class="relative min-h-60 rounded-xl bg-mdv-surface-container-low p-5 pb-28">
      <p class="font-medium">An action anchored to this preview</p>
      <p class="mt-3 text-sm text-mdv-on-surface-variant" role="status">Items created: {{ count }}</p>
      <MdvFab position="absolute" :placement="placement" :offset="20" aria-label="Create in preview" @click="count++"><MdvIcon :icon="addIcon" /></MdvFab>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

`offset` 控制贴边距离，设备安全区另计。布局中应预留空间，避免按钮遮挡最后一段内容或重要控件。底部导航、工具栏、Snackbar 与其他浮层之间的避让由宿主安排，FAB 不会自动检测这些碰撞。

图标 FAB 放入浮动 `MdvToolbar` 的 `fab` 插槽时，工具栏会管理其位置，并在工具栏收起时将其从 56px 调整至 80px。默认颜色在 standard 工具栏中为 secondary-container，在 vibrant 工具栏中为 tertiary-container。ExtendedFab 不参与这套工具栏专属联动。

## 跟随真实滚动容器收合

设置 `scroll-behavior="collapse"`，并将 `scroll-target` 指向实际滚动的元素。下面显式使用演示 Scaffold 的 `contentElement`，与当前文档页面的滚动相互独立。

<DemoBlock>
  <FabScrollDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvExtendedFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const scaffold = useTemplateRef<InstanceType<typeof MdvAppBarScaffold>>('scaffold')
const expanded = ref(true)
const collapseOnScroll = ref(true)
const notes = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="collapseOnScroll" label="Collapse on downward scroll" />
    <div class="relative h-88 overflow-hidden rounded-xl border border-mdv-outline-variant bg-mdv-surface-container-low">
      <MdvAppBarScaffold ref="scaffold" class="h-full" :content-attrs="{ 'aria-label': 'Scrollable field notes', tabindex: 0 }">
        <template #appbar><MdvAppBar title="Field notes" variant="small" /></template>
        <div class="grid gap-6 p-5 pb-28">
          <p v-for="index in 18" :key="index" class="text-sm">Note {{ index }}: scroll this preview down to collapse the action, then scroll up to show its label.</p>
        </div>
      </MdvAppBarScaffold>
      <MdvExtendedFab v-model:expanded="expanded" position="absolute" :scroll-behavior="collapseOnScroll ? 'collapse' : 'none'" :scroll-target="() => scaffold?.contentElement" @click="notes++">
        <template #leading><MdvIcon :icon="editIcon" /></template>
        Write note
      </MdvExtendedFab>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Label: {{ expanded ? 'expanded' : 'collapsed' }} · Notes: {{ notes }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

在演示内部滚动：向下累计到阈值后收合，向上累计后展开，默认阈值为同方向 40px。滚动到顶部或底部边界时会展开。操作自身持有焦点、正在按压或关联菜单处于活动状态时，会暂停自动收合。

不传目标时监听 `window`。显式提供的选择器或函数未找到目标时，不会悄悄切换到其他滚动区。目标稍后出现，或者外部布局、字体变化需要重新测量时，可以调用 `refresh()`。组件也会响应自身观察到的内容变化，并在停用或卸载时清理资源。减少动态效果偏好会取消展开收合动画。

## 原生表单与链接

FAB 默认是 `type="button"`。用于原生提交或重置时，需要明确设置 `submit` 或 `reset`，必填校验仍正常生效。提供 `href` 后渲染真正的链接，保留原生新窗口和下载行为。

<DemoBlock>
  <FabFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvExtendedFab, MdvFab, MdvIcon, MdvTextField } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save-outline'
import resetIcon from '@iconify-icons/material-symbols/restart-alt'

const title = ref('')
const result = ref('Enter a title before saving.')
</script>

<template>
  <div class="grid gap-5">
    <form class="grid gap-4" @submit.prevent="result = `Saved: ${title}`" @reset="title = ''; result = 'Draft reset.'">
      <MdvTextField v-model="title" label="Note title" name="title" required full-width />
      <div class="flex flex-wrap items-center gap-5">
        <MdvExtendedFab type="submit"><template #leading><MdvIcon :icon="saveIcon" /></template>Save note</MdvExtendedFab>
        <MdvFab type="reset" color="secondary-container" aria-label="Reset draft"><MdvIcon :icon="resetIcon" /></MdvFab>
      </div>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvExtendedFab class="justify-self-start" href="https://m3.material.io/components/floating-action-button/overview" target="_blank" rel="noopener noreferrer">Design guide</MdvExtendedFab>
  </div>
</template>
```

  </template>
</DemoBlock>

可以先尝试保存空标题，再输入内容保存或重置。Design guide 是真实的外部链接。链接 FAB 使用原生 Enter 激活规则，不会额外获得按钮的空格键激活行为。

当前 API 没有独立的禁用或加载设计变体。主要操作暂不可用时，可以根据场景选择隐藏。原生 `disabled` 仍可禁用按钮，但仅添加 `aria-disabled` 不会阻止链接导航，需要明确实现相应限制。

## 无障碍与动效

- 提供准确的操作名称，尤其是纯图标 FAB。扩展按钮的 ARIA 名称不应与可见文字矛盾。
- 保留原生按钮、链接语义与键盘焦点反馈，不要在图标或文字插槽中嵌套交互控件。
- 在实际尺寸和窄容器中检查短标签；定位与安全区处理不会自动解决内容遮挡。
- 展开动画保持操作身份与文字名称，通过宽度变化呈现。焦点、按压、滚动方向和减少动态效果偏好会影响自动收合行为。
- 演示默认继承页面的 MDV 主题，局部预览可以通过 `data-mdv-theme` 或主题令牌指定其他外观。

## MdvFab API

### Props

<ApiTable :items="fabProps" />

### 插槽

<SlotsTable :items="fabSlots" />

### 原生事件与方法

Fab 没有自定义模型或组件事件。`click`、`focus`、`blur`、指针与键盘等原生监听器会传给根控件。按钮可继续使用 `name`、`value`、`form`、`formaction` 等表单属性，链接则使用对应的原生链接属性。

<DocsTable label="FAB 共用实例 API" min-width="31rem">

| 成员 | 类型与作用 |
| --- | --- |
| `element` | 当前的 `HTMLButtonElement` 或 `HTMLAnchorElement`，挂载前、卸载后为 null。 |
| `focus(options?)` | 聚焦原生控件，接受可选的 `FocusOptions`。 |
| `blur()` | 移除原生控件上的焦点。 |

</DocsTable>

## MdvExtendedFab API

### Props

<ApiTable :items="extendedFabProps" />

### 插槽

<SlotsTable :items="extendedFabSlots" />

### 事件与方法

<DocsTable label="扩展 FAB 事件" min-width="31rem">

| 事件 | 参数与含义 |
| --- | --- |
| `update:expanded` | 请求的文字展开状态，类型为 boolean。受控父级接受后才会发生对应变化。 |

</DocsTable>

ExtendedFab 与 Fab 共用 `element`、`focus()`、`blur()`、原生事件和属性透传，并额外提供以下方法：

<DocsTable label="扩展 FAB 展开收合方法" min-width="31rem">

| 方法 | 返回值与作用 |
| --- | --- |
| `expand()` | `Promise<boolean>`；请求展开文字。 |
| `collapse()` | `Promise<boolean>`；存在 leading 图标时请求收合。 |
| `toggle()` | `Promise<boolean>`；请求切换为相反状态。 |
| `refresh()` | `void`；刷新尺寸测量与滚动目标绑定。 |

</DocsTable>

布尔结果表示接受情况，不表示动画结束。仅有文字的 ExtendedFab 无法收合。

### 公开类型

```ts
import type {
  MdvFabProps,
  MdvExtendedFabProps,
  MdvFabColor,
  MdvFabSize,
  MdvExtendedFabSize,
  MdvFabType,
  MdvFabPosition,
  MdvFabPlacement,
  MdvExtendedFabScrollBehavior,
  MdvFabScrollTarget,
} from '@mdv-ui/mdv'
```
