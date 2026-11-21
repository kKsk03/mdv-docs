<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import IconBasicDemo from '@/components/docs/demos/icon/basic.vue'
import IconStyleDemo from '@/components/docs/demos/icon/style.vue'
import IconSizeColorDemo from '@/components/docs/demos/icon/sizeColor.vue'
import IconSemanticsDemo from '@/components/docs/demos/icon/semantics.vue'

const iconProps: ApiTableItem[] = [
  { name: 'icon', type: 'MdvIconData（必填）', description: '包含字符串 body 的本地 Iconify SVG 数据。传入导入的数据对象，不接收字符串图标名称。' },
  { name: 'size', type: 'MdvIconSize = number | string', default: '24px / 跟随容器', description: '数字按像素处理，字符串支持 1em、2rem、var(--icon-size) 等 CSS 长度。在支持的按钮插槽内省略时，跟随其图标容器。' },
  { name: 'color', type: 'string', default: 'currentColor', description: '直接使用 CSS 颜色，包括 MDV 色彩变量，不会将输入转换为种子色方案。' },
]
</script>
# 图标

用 `MdvIcon` 渲染 Iconify 图标数据，只导入实际使用的图标。

## Material Symbols

需要使用 Material Symbols 时，安装可选的图标数据包。逐个导入图标，再传给 `icon`。

```sh
pnpm add @iconify-icons/material-symbols
```

<DemoBlock>
  <IconBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvIcon } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import searchIcon from '@iconify-icons/material-symbols/search'
import settingsIcon from '@iconify-icons/material-symbols/settings'

const icons = [
  { name: 'home-outline', data: homeIcon },
  { name: 'search', data: searchIcon },
  { name: 'settings', data: settingsIcon },
]
</script>

<template>
  <div class="flex flex-wrap gap-6">
    <div v-for="icon in icons" :key="icon.name" class="grid justify-items-center gap-3 rounded-xl bg-mdv-surface-container-low p-4">
      <MdvIcon :icon="icon.data" />
      <span class="text-sm">{{ icon.name }}</span>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 图标风格

图标的描边、填充和风格由导入的图案决定，不是 `MdvIcon` 的运行时属性。

<DemoBlock>
  <IconStyleDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon } from '@mdv-ui/mdv'
import favorite from '@iconify-icons/material-symbols/favorite'
import favoriteOutline from '@iconify-icons/material-symbols/favorite-outline'
import favoriteRounded from '@iconify-icons/material-symbols/favorite-rounded'
import favoriteOutlineRounded from '@iconify-icons/material-symbols/favorite-outline-rounded'
import favoriteSharp from '@iconify-icons/material-symbols/favorite-sharp'
import favoriteOutlineSharp from '@iconify-icons/material-symbols/favorite-outline-sharp'

const filled = ref(false)
const styles = [
  { name: 'Outlined', outline: favoriteOutline, filled: favorite },
  { name: 'Rounded', outline: favoriteOutlineRounded, filled: favoriteRounded },
  { name: 'Sharp', outline: favoriteOutlineSharp, filled: favoriteSharp },
]
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="filled" label="Use filled artwork" />
    <div class="flex flex-wrap gap-6">
      <div v-for="style in styles" :key="style.name" class="grid min-w-24 justify-items-center gap-3">
        <MdvIcon :icon="filled ? style.filled : style.outline" :size="32" />
        <span class="text-sm">{{ style.name }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 尺寸与颜色

图标默认继承 `currentColor`。`size` 接受 CSS 长度或以像素计的数字。在按钮中使用图标时，请为按钮本身提供无障碍名称。

<DemoBlock>
  <IconSizeColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvIcon, MdvIconButton, MdvSelect } from '@mdv-ui/mdv'
import type { MdvIconSize } from '@mdv-ui/mdv'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'
import saveIcon from '@iconify-icons/material-symbols/save'

const size = ref<MdvIconSize>(32)
const sizes = [
  { value: 24, label: '24px (number)' },
  { value: 32, label: '32px (number)' },
  { value: '1em', label: '1em (font size)' },
  { value: '2rem', label: '2rem' },
  { value: 'var(--sample-icon-size)', label: 'CSS variable' },
]
</script>

<template>
  <div class="grid gap-6" style="--sample-icon-size: 40px">
    <MdvSelect :model-value="size" :options="sizes" label="Icon size" @update:model-value="size = $event as MdvIconSize" />
    <div class="flex min-h-16 flex-wrap items-center gap-6 text-2xl">
      <MdvIcon :icon="favoriteIcon" :size="size" class="text-mdv-primary" />
      <MdvIcon :icon="favoriteIcon" :size="size" color="var(--mdv-sys-color-error)" />
      <MdvIcon :icon="favoriteIcon" :size="size" color="#006c4c" />
    </div>
    <div class="flex flex-wrap items-center gap-5">
      <MdvButton><template #leading><MdvIcon :icon="saveIcon" /></template>Save draft</MdvButton>
      <MdvIconButton size="m" aria-label="Save draft"><MdvIcon :icon="saveIcon" /></MdvIconButton>
      <span class="text-sm text-mdv-on-surface-variant">Omit size inside buttons to follow their icon containers.</span>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 装饰图标与独立含义

旁边已有同义文本时，保留图标的装饰语义。单独传达信息的图标请用 `aria-label` 或 `aria-labelledby` 命名。

<DemoBlock>
  <IconSemanticsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvCheckbox, MdvIcon } from '@mdv-ui/mdv'
import checkIcon from '@iconify-icons/material-symbols/check-circle-outline'
import warningIcon from '@iconify-icons/material-symbols/warning-outline'

const labelId = `attention-label-${useId()}`
const expose = ref(true)
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="expose" label="Expose the standalone status" />
    <div class="flex flex-wrap items-center gap-8">
      <span class="inline-flex items-center gap-2"><MdvIcon :icon="checkIcon" />Saved (decorative icon)</span>
      <MdvIcon :icon="checkIcon" :aria-label="expose ? 'Ready to sync' : undefined" color="var(--mdv-sys-color-primary)" />
      <span class="inline-flex items-center gap-2">
        <MdvIcon :icon="warningIcon" :aria-labelledby="labelId" color="var(--mdv-sys-color-error)" />
        <span :id="labelId">Needs attention</span>
      </span>
    </div>
    <p class="text-sm text-mdv-on-surface-variant">The standalone status is {{ expose ? 'named and exposed as an image' : 'decorative and hidden' }}. None of these icons is an action.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 其他本地图形

也可以传入 Iconify 格式的可信本地图案。`MdvIcon` 不会清理 SVG 数据。

---

## API

### Props

<ApiTable :items="iconProps" />

### 原生属性与语义

`class`、`style`、`id`、ARIA、`data-*` 和原生监听器传到根 SVG。默认角色为 `img`，是否默认隐藏取决于 `aria-label`、`aria-labelledby` 是否提供名称。原始图形坐标保留在 `viewBox` 中。

组件没有内容插槽、自定义组件事件或额外公开方法。虽然可以透传 `@click`，但 SVG 不会因此获得按钮语义或原生表单行为。

### 公开类型

```ts
import type { MdvIconData, MdvIconSize } from '@mdv-ui/mdv'

// MdvIconData is Iconify's local SVG data type.
// MdvIconSize is number | string.
```

MDV 没有单独导出 `MdvIconProps`，也无需另外安装渲染器或开启在线图标服务。
