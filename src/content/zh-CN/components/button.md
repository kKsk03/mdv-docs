<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ButtonVariantDemo from '@/components/docs/demos/button/variant.vue'
import ButtonSizeDemo from '@/components/docs/demos/button/size.vue'
import ButtonShapeDemo from '@/components/docs/demos/button/shape.vue'
import ButtonColorDemo from '@/components/docs/demos/button/color.vue'
import ButtonColorVariantDemo from '@/components/docs/demos/button/colorVariant.vue'
import ButtonColorCustomDemo from '@/components/docs/demos/button/colorCustom.vue'
import ButtonIconDemo from '@/components/docs/demos/button/icon.vue'
import ButtonDisabledDemo from '@/components/docs/demos/button/disabled.vue'
import ButtonLoadingDemo from '@/components/docs/demos/button/loading.vue'
import ButtonLinkDemo from '@/components/docs/demos/button/link.vue'
import ButtonFullWidthDemo from '@/components/docs/demos/button/fullWidth.vue'
import ButtonHoverShadowDemo from '@/components/docs/demos/button/hoverShadow.vue'

const buttonProps: ApiTableItem[] = [
  {
    name: 'variant',
    type: "'filled' | 'tonal' | 'outlined' | 'elevated' | 'text' | 'link'",
    default: "'filled'",
  },
  {
    name: 'color',
    type: 'MdvButtonColor',
  },
  {
    name: 'size',
    type: "'xs' | 's' | 'm' | 'l' | 'xl'",
    default: "'s'",
    description: '按钮尺寸，调整高度、留白、文字与图标大小。',
  },
  {
    name: 'shape',
    type: "'round' | 'square'",
    default: "'round'",
    description: '按钮形状。round 为胶囊形，square 为矩形圆角。',
  },
  {
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
    default: "'button'",
    description: '原生按钮类型。仅在未提供 href、根元素为 button 时生效。',
  },
  {
    name: 'href',
    type: 'string',
    description: '提供后渲染为原生链接，与 variant 无关。target、rel、download 等原生属性可直接传入。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: '是否禁用。按钮使用原生禁用行为，链接会移除 href 并阻止激活。',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: '显示加载指示器并隐藏前后图标，不会自动阻止点击、导航或提交。需要防止重复操作时，同时设置 disabled。',
  },
  {
    name: 'loadingText',
    type: 'string',
    description: '加载期间的替代文字。未提供时保留原标签；空字符串表示仅显示指示器，此时需提供 aria-label 等可访问名称。',
  },
  {
    name: 'hoverShadow',
    type: 'boolean',
    default: 'false',
    description: '开启 filled、tonal 的悬停阴影，或增强 elevated 已有的阴影。不影响 outlined、text 和 link。',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    description: '是否占满父容器的可用宽度。',
  },
]

const buttonSlots: SlotTableItem[] = [
  { name: 'default', description: '按钮的文字内容。' },
  { name: 'leading', description: '前置图标。图标作为装饰内容处理，不参与按钮的可访问名称。' },
  { name: 'trailing', description: '后置图标。图标作为装饰内容处理，不参与按钮的可访问名称。' },
]
</script>

# 按钮

按钮用于触发单击或轻触即可完成的操作，例如打开菜单、发送评论等。

## 基本用法

导入 `MdvButton`，通过默认插槽设置按钮文字。

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <MdvButton>Save</MdvButton>
</template>
```

---

## 变体

通过 `variant` 设置按钮的变体。

<DemoBlock>
  <ButtonVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton variant="filled">filled</MdvButton>
    <MdvButton variant="tonal">tonal</MdvButton>
    <MdvButton variant="outlined">outlined</MdvButton>
    <MdvButton variant="elevated">elevated</MdvButton>
    <MdvButton variant="text">text</MdvButton>
    <MdvButton variant="link" href="https://www.google.com" target="_blank">link</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 尺寸

通过 `size` 设置按钮尺寸。

<DemoBlock>
  <ButtonSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton size="xs">XS</MdvButton>
    <MdvButton size="s">S</MdvButton>
    <MdvButton size="m">M</MdvButton>
    <MdvButton size="l">L</MdvButton>
    <MdvButton size="xl">XL</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 形状

通过 `shape` 设置按钮形状。

<DemoBlock>
  <ButtonShapeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton shape="round">round</MdvButton>
    <MdvButton shape="square">square</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 颜色

通过 `color` 设置按钮使用的色系。

<DemoBlock>
  <ButtonColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton color="primary">primary</MdvButton>
    <MdvButton color="secondary">secondary</MdvButton>
    <MdvButton color="tertiary">tertiary</MdvButton>
    <MdvButton color="success">success</MdvButton>
    <MdvButton color="warning">warning</MdvButton>
    <MdvButton color="error">error</MdvButton>
    <MdvButton color="info">info</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

### 与变体搭配

当使用不同变体时，设置 `color` 会有不同的效果。  
不设置 `color` 时则会使用其自身的默认颜色。  

<DemoBlock>
  <ButtonColorVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton variant="tonal">tonal & default</MdvButton>
    <MdvButton variant="tonal" color="primary">tonal & primary</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

### 自定义颜色

`color` 也支持 `#RGB` 或 `#RRGGBB` 格式的十六进制颜色。  

<DemoBlock>
  <ButtonColorCustomDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton color="#6750A4">#6750A4</MdvButton>
    <MdvButton color="#00796B">#00796B</MdvButton>
    <MdvButton color="#00ACC1">#00ACC1</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 图标

通过 `leading` 或 `trailing` 插槽添加图标。

<DemoBlock>
  <ButtonIconDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton, MdvIcon } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'
import arrowForwardIcon from '@iconify-icons/material-symbols/arrow-forward'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton>
      <template #leading>
        <MdvIcon :icon="addIcon" />
      </template>
      Add
    </MdvButton>

    <MdvButton variant="tonal">
      Next
      <template #trailing>
        <MdvIcon :icon="arrowForwardIcon" />
      </template>
    </MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## 禁用状态

设置 `disabled` 以禁用按钮。

<DemoBlock>
  <ButtonDisabledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton :disabled="true">disabled</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## 加载状态

设置 `loading` 显示加载指示器。加载期间会隐藏前后图标，默认保留按钮文字。  
使用时可适当与 `disabled` 搭配使用以防止重复操作。  

可使用 `loading-text` 自定义加载时所显示的文字。  

<DemoBlock>
  <ButtonLoadingDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton :loading="true">loading</MdvButton>
    <MdvButton :disabled="true" :loading="true">disabled & loading</MdvButton>
    <MdvButton :disabled="true" :loading="true" loading-text="Loading...">disabled & loading</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## 链接按钮

提供 `href` 后，组件会渲染为原生链接，并保留当前变体的外观。  
`variant` 只控制外观，设置为 `link` 可使用链接样式；`href` 决定是否渲染为链接。

<DemoBlock>
  <ButtonLinkDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton variant="link" href="/en-US/getting-started/setup">Setup</MdvButton>

    <MdvButton
      variant="link"
      href="https://www.google.com"
      target="_blank"
    >
      Google
    </MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## 表单操作

按钮默认使用 `type="button"`，不会自动提交表单。提交或重置表单时，需要显式设置 `type`。

```vue:line-numbers
<template>
  <form>
    <div class="flex flex-wrap items-center gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="text">Reset</MdvButton>
    </div>
  </form>
</template>
```

## 占满容器宽度

设置 `full-width` 让按钮占满父容器的可用宽度。

<DemoBlock>
  <ButtonFullWidthDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <MdvButton :full-width="true">Continue</MdvButton>
</template>
```

  </template>
</DemoBlock>

## 悬停阴影

设置 `hover-shadow` 为支持的变体开启悬停阴影。

<DemoBlock>
  <ButtonHoverShadowDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton hover-shadow>Button</MdvButton>
    <MdvButton variant="tonal" hover-shadow>Tonal</MdvButton>
    <MdvButton variant="elevated" hover-shadow>Elevated</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### 属性

<ApiTable :items="buttonProps">
<template #description-variant>

按钮的外观，可选值包括：

- `filled`：填充按钮，用于主要操作。
- `tonal`：色调按钮，用于适度强调的操作。
- `outlined`：描边按钮，用于次要操作。
- `elevated`：凸起按钮，通过阴影与背景区分。
- `text`：文本按钮，用于较低强调程度的操作。
- `link`：MDV 扩展的链接外观，是否导航仍由 `href` 决定。

</template>
<template #description-color>

支持主题色 `primary`、`secondary`、`tertiary`，以及语义色 `success`、`warning`、`error`、`info`。

也支持 `#RGB` 或 `#RRGGBB` 格式的局部种子色。种子色用于生成适配浅深色模式的配色，最终背景不保证与输入值相同。省略时使用当前变体的默认配色。

</template>
</ApiTable>

### Slot

<SlotsTable :items="buttonSlots" />
