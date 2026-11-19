<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import IconButtonVariantDemo from '@/components/docs/demos/iconButton/variant.vue'
import IconButtonSizeDemo from '@/components/docs/demos/iconButton/size.vue'
import IconButtonShapeDemo from '@/components/docs/demos/iconButton/shape.vue'
import IconButtonControlledDemo from '@/components/docs/demos/iconButton/controlled.vue'
import IconButtonColorDemo from '@/components/docs/demos/iconButton/color.vue'
import IconButtonStateDemo from '@/components/docs/demos/iconButton/state.vue'
import IconButtonFormDemo from '@/components/docs/demos/iconButton/form.vue'
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

`MdvIconButton` 通过图标提供紧凑操作或状态切换，默认使用 `filled`、`s`、默认宽度、圆形。始终在按钮上提供 `aria-label` 或 `aria-labelledby` 描述动作。示例中的[图标](/zh-CN/components/icon)数据均按单个文件导入。

## 外观与切换模式

Filled、tonal 提供可见容器，outlined 提供描边，standard 使用透明表面。省略 `selected` 为普通操作，传入布尔值后启用切换。

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

切换按钮发出 `update:selected`，父级接受后才改变状态，通常使用 `v-model:selected`。布尔 false 应写成 `:selected="false"`，不要写成字符串 `selected="false"`。

普通操作通常使用实心图形，切换操作可以从空心变为实心，避免仅依赖色彩表示状态。MDV 不会把任意 SVG 自动转为实心版本，应提供 `#selected`，或读取默认插槽的 `selected` 参数。

## 尺寸、宽度与交互目标

尺寸控制可见高度、图标大小、描边厚度和圆角；宽度则提供 narrow、default、wide 三档可见表面。

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

<DocsTable label="图标按钮可见尺寸" min-width="42rem">

| 尺寸 | 高度 | 图标 | Narrow 宽 | Default 宽 | Wide 宽 | Square 圆角 | 描边 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `xs` | 32px | 20px | 28px | 32px | 40px | 12px | 1px |
| `s` | 40px | 24px | 32px | 40px | 52px | 12px | 1px |
| `m` | 56px | 24px | 48px | 56px | 72px | 16px | 1px |
| `l` | 96px | 32px | 64px | 96px | 128px | 28px | 2px |
| `xl` | 136px | 40px | 104px | 136px | 184px | 28px | 3px |

</DocsTable>

根节点交互目标至少为 48 × 48px，并真实占据布局空间。例如 `s/default` 的可见表面为 40 × 40px，原生按钮仍占 48 × 48px，不依赖向相邻控件延伸的隐形命中区域。换行布局需要为实际使用的最大宽度预留空间。

## 形状与状态反馈

`shape` 表示未选中的基础形状。切换选中后 round 变为 square，square 变为 round，取消选中恢复。单纯按压或长按普通按钮不会额外改变圆角。

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

Round 使用完整圆角，square 使用当前尺寸的圆角值。四种外观均无阴影，悬停状态层为 8%，焦点与按下为 10%，另有独立涟漪与键盘焦点反馈。减少动态效果时关闭旋转、涟漪并缩短形状过渡；强制颜色模式使用系统色。

## 受控接受与取消点击

原生 `@click` 监听器先于内部切换请求执行，调用 `event.preventDefault()` 可取消该次请求。父级也可以保持 `selected` 不变，独立拒绝请求。

<DemoBlock>
  <IconButtonControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark'
import bookmarkOutlineIcon from '@iconify-icons/material-symbols/bookmark-outline'

const selected = ref(false)
const accept = ref(false)
const cancel = ref(false)
const message = ref('The parent currently rejects selection changes.')

function update(value: boolean) {
  message.value = `Requested ${value}: ${accept.value ? 'accepted' : 'rejected'}.`
  if (accept.value) selected.value = value
}

function click(event: MouseEvent) {
  if (cancel.value) {
    event.preventDefault()
    message.value = 'Click cancelled before a selection request.'
  }
}
</script>

<template>
  <div class="grid justify-items-start gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="accept" label="Accept selection changes" />
      <MdvCheckbox v-model="cancel" label="Cancel the click" />
    </div>
    <MdvIconButton :selected="selected" aria-label="Bookmark note" @update:selected="update" @click="click">
      <MdvIcon :icon="bookmarkOutlineIcon" />
      <template #selected><MdvIcon :icon="bookmarkIcon" /></template>
    </MdvIconButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Selected: {{ selected }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

先点击，再启用接受状态变化，最后打开 Cancel the click 对比。动作名称始终为 Bookmark note，选中情况由 `aria-pressed` 表达。原生按钮的 Enter、空格激活只产生一次普通操作，不会重复发出额外的组件键盘事件。

## 默认角色与自定义色彩

未设置 `color` 时，各外观根据普通、未选中和已选中状态使用以下 MD3 角色：

<DocsTable label="图标按钮默认色彩角色" min-width="43rem">

| 外观 | 普通操作 | 未选中切换 | 已选中切换 |
| --- | --- | --- | --- |
| filled | primary / on-primary | surface-container / on-surface-variant | primary / on-primary |
| tonal | secondary-container / on-secondary-container | 同普通操作 | secondary / on-secondary |
| outlined | 透明、outline-variant 描边、on-surface-variant | 同普通操作 | inverse-surface / inverse-on-surface，无描边 |
| standard | 透明 / on-surface-variant | 同普通操作 | 透明 / primary |

</DocsTable>

显式 `color` 支持三种主要主题色、四种语义色或十六进制种子。种子生成局部浅深色角色，不是直接填充的背景色，也不会改变全局主题。

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

Filled 普通与已选中使用所选色系主色，未选中切换保持中性。Tonal 在普通、未选中时使用容器色，选中时使用主色。Outlined 在普通、未选中时使用该色系图标与描边，选中后使用无描边容器色。Standard 普通、已选中使用所选主色，未选中切换保持中性。

示例会先校验 `#RGB`、`#RRGGBB`，再应用种子。用户 `style` 可覆盖生成的局部色彩变量。禁用时使用中性角色：内容为 on-surface 的 38%，适用的容器为 on-surface 的 10%。

## 加载、禁用与链接

`loading` 保持图标挂载但视觉隐藏，显示居中指示器并设置 `aria-busy="true"`，名称和尺寸保留。需要阻止操作时同时传入 `disabled`。

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

打开加载后，可以继续点击 Refresh preview、Favorite preview；勾选 Disable all three actions 后才会禁止操作。设计指南是真实链接，禁用时移除 `href`、退出 Tab 顺序，并阻止激活回调和导航；重新启用后恢复地址。

普通模式中 `href` 决定是否使用原生链接，与外观无关。`target`、`rel`、`download` 等原生属性仍可使用，MDV 不会自动生成地址或打开方式。同时提供 `selected`、`href` 时保留按钮切换语义、忽略 `href`，并在开发环境提示。

## 原生表单

默认类型为 `button`，表单操作应明确指定 `submit` 或 `reset`，原生必填校验与重置继续生效。

<DemoBlock>
  <IconButtonFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvTextField } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save'
import resetIcon from '@iconify-icons/material-symbols/restart-alt'
import previewIcon from '@iconify-icons/material-symbols/visibility'

const title = ref('')
const result = ref('Enter a title before saving.')
</script>

<template>
  <div class="grid gap-4">
    <form class="grid gap-4" @submit.prevent="result = `Saved: ${title}`" @reset="title = ''; result = 'Draft reset.'">
      <MdvTextField v-model="title" label="Draft title" name="title" required full-width />
      <div class="flex flex-wrap gap-4">
        <MdvIconButton type="submit" aria-label="Save draft"><MdvIcon :icon="saveIcon" /></MdvIconButton>
        <MdvIconButton type="reset" variant="tonal" aria-label="Reset draft"><MdvIcon :icon="resetIcon" /></MdvIconButton>
        <MdvIconButton variant="standard" aria-label="Preview draft" @click="result = `Preview: ${title || '(empty)'}`"><MdvIcon :icon="previewIcon" /></MdvIconButton>
      </div>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Preview draft 演示默认按钮类型，不提交表单。`name`、`value`、`form` 等原生属性会继续透传。切换状态不会自动成为提交值，需要提交选中状态时请显式绑定相应字段。

## Tooltip 组合

Tooltip 帮助解释图标，但动作本身仍需可访问名称。将完整 `triggerProps` 绑定到按钮，使焦点、悬停和 ARIA 关系一起工作。

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

IconButton 不会自动内置 Tooltip。内部图标保持装饰，图标容器始终带有 `aria-hidden` 和 inert，加载时也如此。不要在任一图标插槽中嵌套可交互控件。

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
