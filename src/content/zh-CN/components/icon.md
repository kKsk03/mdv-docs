<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import IconBasicDemo from '@/components/docs/demos/icon/basic.vue'
import IconStyleDemo from '@/components/docs/demos/icon/style.vue'
import IconSizeColorDemo from '@/components/docs/demos/icon/sizeColor.vue'
import IconSemanticsDemo from '@/components/docs/demos/icon/semantics.vue'
import IconCustomDemo from '@/components/docs/demos/icon/custom.vue'

const iconProps: ApiTableItem[] = [
  { name: 'icon', type: 'MdvIconData（必填）', description: '包含字符串 body 的本地 Iconify SVG 数据。传入导入的数据对象，不接收字符串图标名称。' },
  { name: 'size', type: 'MdvIconSize = number | string', default: '24px / 跟随容器', description: '数字按像素处理，字符串支持 1em、2rem、var(--icon-size) 等 CSS 长度。在支持的按钮插槽内省略时，跟随其图标容器。' },
  { name: 'color', type: 'string', default: 'currentColor', description: '直接使用 CSS 颜色，包括 MDV 色彩变量，不会将输入转换为种子色方案。' },
]
</script>

# 图标

`MdvIcon` 通过 MDV 自带的 `@iconify/vue/offline` 渲染本地 SVG 数据，同步显示，不请求图标 API 或字体 CDN。它可以表达装饰或独立含义；纯图标操作应使用[图标按钮](/zh-CN/components/icon-button)。

## 安装数据包与按需导入

应用需要使用 Material Symbols 图形时，安装其数据包：

```sh
pnpm add @iconify-icons/material-symbols
```

每个图标从自己的子路径导入，如下所示。安装数据包会将其放入本地依赖，但不会因此把整套图标打入站点产物；构建工具按实际导入的模块处理。MDV 不会为了 `MdvIcon` 导入或注册完整图标集。

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

保持静态的单图标导入。导入整个集合、注册全部数据，或动态匹配所有图标文件，都可能让这些数据进入构建依赖，增大产物。其他 MDV 组件内置使用的图标已由组件提供；应用自行导入 Material Symbols 数据时才需要安装这个数据包。

`icon` 接收 `homeIcon` 这样的对象，不接收 `'material-symbols:home'` 这类名称。无效输入保留空图标盒子，并在开发环境提示，不会联网补取。

## 风格与填充

Material Symbols 的风格、空心和实心均由导入的 SVG 数据决定。MDV 推荐以 Outlined 400 为基线，Rounded、Sharp 则使用各自的子路径。

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

<DocsTable label="Material Symbols 单图标导入名称" min-width="29rem">

| 风格 | 空心图形 | 实心图形 |
| --- | --- | --- |
| Outlined | `favorite-outline` | `favorite` |
| Rounded | `favorite-outline-rounded` | `favorite-rounded` |
| Sharp | `favorite-outline-sharp` | `favorite-sharp` |

</DocsTable>

这些名称均接在 `@iconify-icons/material-symbols/` 后。切换数据即可更换图形；组件没有可变字体的 `FILL`、`wght`、`GRAD`、`opsz` 属性，也不会随尺寸自动切换光学轮廓。

## 尺寸、颜色与按钮组合

独立图标默认为 24 × 24px。数字使用像素，CSS 字符串可以跟随字号或局部变量。未显式设置颜色时继承 `currentColor`。

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

第一个图标继承 primary 文字色，第二个使用 error 令牌，第三个直接使用 CSS 色值。`MdvIcon` 不会把 `success` 解释为 MDV 语义角色，也不会将十六进制值作为主题种子；需要跟随主题的语义色时，传入 `var(--mdv-sys-color-success)` 等变量。

在 Button、IconButton 中省略 `size`，即可跟随按钮尺寸。显式设置仅改变 SVG，不会扩大外层按钮或额外预留空间。`style` 优先于尺寸、颜色 prop，接受 Vue 常用的对象、字符串和数组形式。

## 装饰图标与独立含义

默认图标带有 `aria-hidden="true"` 和 `focusable="false"`。相邻文字已经表达同一信息时，保留装饰语义即可。独立状态可以使用 `aria-label`，或通过 `aria-labelledby` 引用已有文字。

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

非空名称会解除默认隐藏，保留图像语义。显式 `aria-hidden` 优先，引用的标签元素由应用保证存在。给图标命名不会使其进入 Tab 顺序或成为操作；原生 `title` 也不能替代可访问名称或 MDV Tooltip。

操作名称应提供给按钮，内部图标保持装饰。需要按钮键盘、焦点、禁用、表单行为时，不要仅为独立 SVG 添加点击监听器。

## 其他本地图形

也可以使用其他图标集，或符合 Iconify 格式的可信本地图形。必须提供字符串 `body`，通过原始宽高保留图形坐标系。

<DemoBlock>
  <IconCustomDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton, MdvIcon } from '@mdv-ui/mdv'
import type { MdvIconData } from '@mdv-ui/mdv'

// Trusted local artwork in Iconify's data format; no icon-data package is needed.
const diamond: MdvIconData = {
  width: 24,
  height: 24,
  body: '<path fill="currentColor" d="M12 2 22 12 12 22 2 12Z"/>',
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <span class="inline-flex items-center gap-2 text-mdv-primary"><MdvIcon :icon="diamond" :size="32" />Local artwork</span>
    <MdvButton variant="tonal"><template #leading><MdvIcon :icon="diamond" /></template>Explore collection</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

这个示例不需要外部图标数据包。MDV 会渲染传入的 SVG 数据，不负责清洗。纯路径 Material Symbols 可以在 SSR 中同步输出；自定义渐变、裁剪路径、内部 ID 则需要额外检查 SSR 与 hydration。

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
