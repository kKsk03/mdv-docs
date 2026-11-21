<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import IconButtonVariantDemo from '@/components/docs/demos/iconButton/variant.vue'
import IconButtonSizeDemo from '@/components/docs/demos/iconButton/size.vue'
import IconButtonShapeDemo from '@/components/docs/demos/iconButton/shape.vue'
import IconButtonColorDemo from '@/components/docs/demos/iconButton/color.vue'
import IconButtonStateDemo from '@/components/docs/demos/iconButton/state.vue'
import IconButtonTooltipDemo from '@/components/docs/demos/iconButton/tooltip.vue'

const buttonProps: ApiTableItem[] = [
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'standard'", default: "'filled'", description: '视觉强调程度，普通操作、未选中切换、已选中切换分别采用对应的 MD3 色彩角色。' },
  { name: 'color', type: 'MdvIconButtonColor', description: 'primary、secondary、tertiary、success、warning、error、info 或 #RGB/#RRGGBB 种子色。省略时使用各变体默认角色。' },
  { name: 'size', type: "'xs' | 's' | 'm' | 'l' | 'xl'", default: "'s'", description: '可见高度依次为 32、40、56、96、136px。根节点交互目标的宽高至少为 48px。' },
  { name: 'width', type: "'narrow' | 'default' | 'wide'", default: "'default'", description: '当前尺寸的可见宽度，较小表面居中显示在原生交互目标内。' },
  { name: 'shape', type: "'round' | 'square'", default: "'round'", description: '未选中时的基础形状，选中时 round 与 square 互换，单纯按压不改变形状。' },
  { name: 'selected', attribute: 'v-model:selected', type: 'boolean', default: 'undefined', description: '省略为普通操作，传入任意布尔值后成为受控切换并带 aria-pressed，需要父级接受 update:selected。' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: '按钮根节点的原生类型，不改变链接的激活行为。' },
  { name: 'href', type: 'string', description: '普通模式下渲染原生链接，支持空地址。切换模式始终使用按钮并忽略 href。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '按钮使用原生 disabled。链接移除 href 和激活监听器，并设置 role=link、aria-disabled=true、tabindex=-1。' },
  { name: 'loading', type: 'boolean', default: 'false', description: '视觉上将图标替换为居中指示器并设置 aria-busy，不会自动禁用点击、切换或链接。' },
]
const buttonSlots: SlotTableItem[] = [
  { name: 'default', description: '普通或未选中状态的装饰图标，接收 { selected: boolean }；没有 selected 插槽时也负责选中图形。' },
  { name: 'selected', description: '选中状态的装饰图标，接收 { selected: true }；省略时回退到默认插槽。' },
]
</script>
# 图标按钮

用 `MdvIconButton` 提供以图标表示的紧凑操作。通过 `aria-label="Bookmark"` 等方式提供无障碍名称。

## 外观与切换模式

用 `variant` 设置外观。普通按钮不传 `selected`，切换按钮绑定 `v-model:selected`。

<DemoBlock>
  <IconButtonVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvIconButtonVariant } from '@mdv-ui/mdv'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'
import favoriteOutlineIcon from '@iconify-icons/material-symbols/favorite-outline'

const variants: MdvIconButtonVariant[] = ['filled', 'tonal', 'outlined', 'standard']
const selected = ref<Record<MdvIconButtonVariant, boolean>>({ filled: false, tonal: false, outlined: false, standard: false })
const actions = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="variant in variants" :key="variant" class="grid gap-3 rounded-xl bg-mdv-surface-container-low p-4">
        <p class="font-medium">{{ variant }}</p>
        <div class="flex flex-wrap gap-5">
          <div class="grid justify-items-center gap-2">
            <MdvIconButton :variant="variant" :aria-label="`Favorite action, ${variant}`" @click="actions++"><MdvIcon :icon="favoriteIcon" /></MdvIconButton>
            <span class="text-sm">Action</span>
          </div>
          <div class="grid justify-items-center gap-2">
            <MdvIconButton v-model:selected="selected[variant]" :variant="variant" :aria-label="`Favorite toggle, ${variant}`">
              <MdvIcon :icon="favoriteOutlineIcon" />
              <template #selected><MdvIcon :icon="favoriteIcon" /></template>
            </MdvIconButton>
            <span class="text-sm">Toggle</span>
          </div>
        </div>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Actions: {{ actions }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 尺寸与宽度

用 `size` 设置控件尺寸，用 `width` 选择窄版或宽版外观。

<DemoBlock>
  <IconButtonSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvSelect } from '@mdv-ui/mdv'
import type { MdvIconButtonSize, MdvIconButtonWidth } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const sizes: MdvIconButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const width = ref<MdvIconButtonWidth>('default')
const widths = ['narrow', 'default', 'wide'].map(value => ({ value, label: value }))
</script>

<template>
  <div class="grid gap-6">
    <MdvSelect :model-value="width" :options="widths" label="Button width" @update:model-value="width = $event as MdvIconButtonWidth" />
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in sizes" :key="size" class="grid justify-items-center gap-3">
        <MdvIconButton :size="size" :width="width" :aria-label="`Add item, ${size}`"><MdvIcon :icon="addIcon" /></MdvIconButton>
        <span class="text-sm">{{ size }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 形状

将 `shape` 设为 `round` 或 `square`。切换按钮选中时会使用另一种形状。

<DemoBlock>
  <IconButtonShapeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvIconButtonShape } from '@mdv-ui/mdv'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark'
import bookmarkOutlineIcon from '@iconify-icons/material-symbols/bookmark-outline'

const shapes: MdvIconButtonShape[] = ['round', 'square']
const selected = ref<Record<MdvIconButtonShape, boolean>>({ round: false, square: false })
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <div v-for="shape in shapes" :key="shape" class="grid justify-items-center gap-3">
      <MdvIconButton v-model:selected="selected[shape]" :shape="shape" size="m" :aria-label="`Bookmark, ${shape} base shape`">
        <template #default="{ selected: active }"><MdvIcon :icon="active ? bookmarkIcon : bookmarkOutlineIcon" /></template>
      </MdvIconButton>
      <span class="text-sm">{{ shape }} → {{ selected[shape] ? 'selected' : 'unselected' }}</span>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 颜色

不设置 `color` 时使用变体的配色，也可指定主题色或十六进制种子色。

<DemoBlock>
  <IconButtonColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvSelect, MdvTextField } from '@mdv-ui/mdv'
import type { MdvIconButtonColor, MdvIconButtonVariant } from '@mdv-ui/mdv'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'

const variant = ref<MdvIconButtonVariant>('filled')
const dark = ref(false)
const seedDraft = ref('#006c4c')
const seed = ref<`#${string}`>('#006c4c')
const error = ref('')
const variants = ['filled', 'tonal', 'outlined', 'standard'].map(value => ({ value, label: value }))
const presets: MdvIconButtonColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info']
const colors = computed<{ label: string; value: MdvIconButtonColor | undefined }[]>(() => [
  { label: 'default', value: undefined },
  ...presets.map(value => ({ label: value, value })),
  { label: seed.value, value: seed.value },
])

function applySeed() {
  if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(seedDraft.value)) {
    error.value = 'Use #RGB or #RRGGBB, for example #06C or #006c4c.'
    return
  }
  seed.value = seedDraft.value as `#${string}`
  error.value = ''
}
</script>

<template>
  <div class="grid gap-5">
    <MdvSelect :model-value="variant" :options="variants" label="Color preview variant" @update:model-value="variant = $event as MdvIconButtonVariant" />
    <form class="flex flex-wrap items-start gap-3" novalidate @submit.prevent="applySeed">
      <MdvTextField v-model="seedDraft" label="Local seed color" :error="!!error" :error-text="error" />
      <MdvButton type="submit" variant="tonal">Apply seed</MdvButton>
    </form>
    <MdvCheckbox v-model="dark" label="Local dark theme" />
    <div :data-mdv-theme="dark ? 'dark' : undefined" class="flex flex-wrap gap-6 rounded-xl bg-mdv-surface-container-low p-5 text-mdv-on-surface">
      <div v-for="color in colors" :key="color.label" class="grid justify-items-center gap-2">
        <MdvIconButton :variant="variant" :color="color.value" :aria-label="`Favorite, ${color.label}`"><MdvIcon :icon="favoriteIcon" /></MdvIconButton>
        <span class="text-sm">{{ color.label }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 加载、禁用与链接

用 `loading` 显示加载指示器，用 `disabled` 防止重复触发。提供 `href` 可渲染为链接。

<DemoBlock>
  <IconButtonStateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import refreshIcon from '@iconify-icons/material-symbols/refresh'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'
import favoriteOutlineIcon from '@iconify-icons/material-symbols/favorite-outline'
import guideIcon from '@iconify-icons/material-symbols/open-in-new'

const loading = ref(false)
const disabled = ref(false)
const selected = ref(false)
const actions = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="loading" label="Show loading indicators" />
      <MdvCheckbox v-model="disabled" label="Disable all three actions" />
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <MdvIconButton :loading="loading" :disabled="disabled" aria-label="Refresh preview" @click="actions++"><MdvIcon :icon="refreshIcon" /></MdvIconButton>
      <MdvIconButton v-model:selected="selected" variant="tonal" :loading="loading" :disabled="disabled" aria-label="Favorite preview">
        <MdvIcon :icon="favoriteOutlineIcon" />
        <template #selected><MdvIcon :icon="favoriteIcon" /></template>
      </MdvIconButton>
      <MdvIconButton href="https://m3.material.io/components/icon-buttons/overview" target="_blank" rel="noopener noreferrer" variant="outlined" :loading="loading" :disabled="disabled" aria-label="Read icon button design guide"><MdvIcon :icon="guideIcon" /></MdvIconButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Refreshes: {{ actions }} · Favorite: {{ selected }}. Loading alone keeps actions enabled.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Tooltip 组合

绑定[提示气泡](./tooltip)的 `triggerProps` 来显示提示。图标按钮仍需自己的无障碍名称。

<DemoBlock>
  <IconButtonTooltipDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvTooltip } from '@mdv-ui/mdv'
import refreshIcon from '@iconify-icons/material-symbols/refresh'

const refreshes = ref(0)
</script>

<template>
  <div class="flex flex-wrap items-center gap-5">
    <MdvTooltip text="Refresh results" placement="top">
      <template #trigger="{ triggerProps }">
        <MdvIconButton v-bind="triggerProps" variant="standard" aria-label="Refresh results" @click="refreshes++"><MdvIcon :icon="refreshIcon" /></MdvIconButton>
      </template>
    </MdvTooltip>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Refreshed {{ refreshes }} times. Hover or focus the action to see its tooltip.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### Props

<ApiTable :items="buttonProps" />

### 插槽

<SlotsTable :items="buttonSlots" />

### 事件

<DocsTable label="图标按钮组件事件" min-width="31rem">

| 事件 | 参数与含义 |
| --- | --- |
| `update:selected` | 切换模式请求的 boolean 状态。普通操作、禁用激活、已取消的 click 不发出该请求。 |

</DocsTable>

`click`、focus、blur、指针和键盘事件均为传给根控件的原生监听器，没有额外自定义 click 事件。禁用时阻止激活监听器。按钮保留原生 Enter、空格和表单行为，链接保留原生 Enter 激活。

### 原生属性与尺寸覆盖

`class`、`style`、`id`、ARIA、`data-*` 和适用的按钮、链接属性均传到根节点。组件没有额外公开方法，需要时引用并聚焦底层原生控件，不要假设存在组件 `focus()` API。

确实需要自定义可见尺寸时，可一起调整局部变量：

```vue
<MdvIconButton
  aria-label="Favorite"
  :style="{
    '--mdv-icon-button-height': '64px',
    '--mdv-icon-button-width': '80px',
    '--mdv-icon-button-icon-size': '28px',
  }"
>
  <MdvIcon :icon="favoriteIcon" />
</MdvIconButton>
```

根节点 CSS 宽高改变的是包含留白的整个命中盒子，以上变量则控制可见表面。调整后仍需保留可用的交互目标和图标空间。

### 公开类型

```ts
import type {
  MdvIconButtonVariant,
  MdvIconButtonColor,
  MdvIconButtonSize,
  MdvIconButtonWidth,
  MdvIconButtonShape,
  MdvIconButtonType,
} from '@mdv-ui/mdv'
```

MDV 没有单独导出 `MdvIconButtonProps` 类型。
