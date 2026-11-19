<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import LoadingAppearanceDemo from '@/components/docs/demos/loadingIndicator/appearance.vue'
import LoadingSizeDemo from '@/components/docs/demos/loadingIndicator/size.vue'
import LoadingPauseDemo from '@/components/docs/demos/loadingIndicator/pause.vue'
import LoadingTaskDemo from '@/components/docs/demos/loadingIndicator/task.vue'
import LoadingButtonDemo from '@/components/docs/demos/loadingIndicator/button.vue'

const indicatorProps: ApiTableItem[] = [
  { name: 'contained', type: 'boolean', default: 'false', description: '增加圆形 primary-container 背景，图形使用 on-primary-container。' },
  { name: 'size', type: 'number', default: '48', description: '整体 CSS 像素尺寸。有限值限制在 24–240，非有限数值回退到 48。' },
  { name: 'label', type: 'string', default: "'加载中'", description: '仅作为可访问名称，不显示文字。纯空白标签回退到默认中文名称，请按应用语言显式设置。' },
  { name: 'paused', type: 'boolean', default: 'false', description: '冻结当前动画相位，恢复后继续，不代表任务已经完成。' },
  { name: 'decorative', type: 'boolean', default: 'false', description: '当所属控件已说明加载状态时，移除指示器的角色、名称和描述，并对辅助技术隐藏。' },
]
</script>

# 加载指示器

`MdvLoadingIndicator` 通过连续变换的形状表达短暂且进度未知的等待。Material 指南建议用于约 200ms–5s 的等待。耗时更长或需要度量完成量时，使用[线性进度指示器](/zh-CN/components/linear-progress)或[圆形进度指示器](/zh-CN/components/circular-progress)。

组件不会判断请求耗时、延迟自身出现、检测完成，也不接受百分比。加载状态与挂载时机由业务控制。

## 默认与容器外观

默认图形使用 `primary`，不绘制背景。`contained` 增加圆形 `primary-container` 表面，图形改用 `on-primary-container`。两者均继承 MDV 全局或局部主题。

<DemoBlock>
  <LoadingAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvLoadingIndicator } from '@mdv-ui/mdv'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid justify-items-center gap-4 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
      <span class="text-sm font-medium">{{ theme }}</span>
      <div class="flex flex-wrap justify-center gap-8">
        <div class="grid justify-items-center gap-3">
          <MdvLoadingIndicator :label="`${theme}: loading preview`" />
          <span class="text-sm">Default</span>
        </div>
        <div class="grid justify-items-center gap-3">
          <MdvLoadingIndicator contained :label="`${theme}: loading contained preview`" />
          <span class="text-sm">Contained</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

需要在内容上提供背景对比时，可以使用容器外观。SVG 在旋转过程中循环变换七种形状；当前局部 SVG 几何是对 MD3 形状与动效的近似实现，没有移植 Android 多边形数据。

## 整体尺寸

`size` 接收 CSS 像素数值，默认为 `48`。两种外观中的 SVG 均占整体盒子的 `38/48`，动画过程中保留布局空间。

<DemoBlock>
  <LoadingSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const contained = ref(true)
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="contained" label="Use contained indicators" />
    <div class="flex flex-wrap items-center gap-6">
      <div v-for="size in [24, 48, 96, 240]" :key="size" class="grid justify-items-center gap-3">
        <MdvLoadingIndicator :size="size" :contained="contained" :label="`Loading at ${size}px`" />
        <span class="text-sm">{{ size }}px</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

有限输入限制在 `24…240`，`NaN` 与无穷值回退到 `48`。容器应为所选尺寸预留足够空间。`label` 只向辅助技术提供名称，不会生成可见说明，示例中的尺寸文字是另外添加的。

## 暂停、恢复与可见性

`paused` 冻结当前形状和旋转相位，恢复后继续播放；暂停不改变未知进度的语义。

<DemoBlock>
  <LoadingPauseDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const paused = ref(false)
const visible = ref(true)
</script>

<template>
  <div class="grid justify-items-start gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="paused" label="Pause the animation" />
      <MdvCheckbox v-model="visible" label="Show the indicator" />
    </div>
    <div class="grid min-h-24 min-w-24 place-items-center">
      <MdvLoadingIndicator v-show="visible" :paused="paused || !visible" :size="96" contained label="Loading the preview" />
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ !visible ? 'Hidden and paused.' : paused ? 'Paused at the current frame. Loading is still in progress.' : 'Animating while the indicator is visible.' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

示例将 `v-show` 与 `paused || !visible` 组合，手动隐藏节点时立即停止帧循环。任务完成后需要卸载指示器时，可以使用 `v-if`。

页面隐藏、可用的 IntersectionObserver 判断图形离开视口、所属 KeepAlive 页面停用时，MDV 也会暂停帧循环。减少动态效果时显示稳定首帧并保留加载角色，关闭该偏好后继续保存的动画相位。卸载时会清理动画帧、观察器和监听器。

## 内容加载、失败与重试

在真正加载的内容区域设置 `aria-busy`，将有意义的完成或错误状态放在繁忙区域之外，由业务通知变化。

<DemoBlock>
  <LoadingTaskDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const phase = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const fail = ref(false)
const loading = computed(() => phase.value === 'loading')
const message = computed(() => ({
  idle: 'Load recommendations to try the preview.',
  loading: 'Loading recommendations…',
  success: 'Recommendations are ready.',
  error: 'Loading failed. Disable the simulated failure and retry.',
})[phase.value])
let timer: ReturnType<typeof setTimeout> | undefined

function load() {
  if (loading.value) return
  phase.value = 'loading'
  // Simulate a local request; no network request is made.
  timer = setTimeout(() => {
    timer = undefined
    phase.value = fail.value ? 'error' : 'success'
  }, 1200)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap items-center gap-4">
      <MdvButton :disabled="loading" @click="load">Load recommendations</MdvButton>
      <MdvCheckbox v-model="fail" label="Simulate a loading failure" :disabled="loading" />
    </div>
    <section :aria-busy="loading" aria-label="Recommendations" class="grid min-h-40 place-items-center rounded-xl bg-mdv-surface-container-low p-5">
      <MdvLoadingIndicator v-if="loading" label="Loading recommendations" />
      <div v-else-if="phase === 'success'" class="grid gap-2">
        <p class="font-medium">Your reading list</p>
        <p class="text-sm">Designing useful interfaces · Choosing meaningful motion</p>
      </div>
      <p v-else class="text-sm text-mdv-on-surface-variant">{{ phase === 'error' ? 'Nothing loaded. You can retry.' : 'Recommendations will appear here.' }}</p>
    </section>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

示例模拟 1.2 秒的本地请求，卸载时清理计时器。指示器只在加载时挂载。可以模拟失败后重试，两种结果都不由指示器推断。真实业务还应负责请求取消和错误处理。

## 按钮中的装饰用法

按钮名称已经说明正在保存时，将内部指示器设为装饰内容，避免额外的进度角色播报。按钮的 `aria-busy` 和禁用行为也需要显式控制。

<DemoBlock>
  <LoadingButtonDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvIcon, MdvLoadingIndicator } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save'

const saving = ref(false)
const saves = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined

function save() {
  if (saving.value) return
  saving.value = true
  timer = setTimeout(() => {
    timer = undefined
    saves.value++
    saving.value = false
  }, 900)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-busy="saving" :disabled="saving" style="--mdv-button-icon-size: 24px" @click="save">
      <template #leading>
        <MdvLoadingIndicator v-if="saving" :size="24" decorative style="--mdv-loading-indicator-active-color: currentColor" />
        <MdvIcon v-else :icon="saveIcon" />
      </template>
      {{ saving ? 'Saving draft…' : 'Save draft' }}
    </MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ saving ? 'Saving the draft.' : `Saved ${saves} times.` }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

这是通过 Button 前置插槽完成的业务组合。24px 指示器使用 `currentColor` 跟随按钮前景，不改变 Button 现有的 `loading` 实现。示例计时器在卸载时清理。

## 颜色变量

局部覆盖时使用 MDV 色彩角色，让颜色跟随主题。组件没有 `color` 属性。

```vue
<MdvLoadingIndicator
  contained
  label="Loading preview"
  style="--mdv-loading-indicator-active-color: var(--mdv-sys-color-on-tertiary-container); --mdv-loading-indicator-container-color: var(--mdv-sys-color-tertiary-container)"
/>
```

<DocsTable label="加载指示器颜色变量" min-width="31rem">

| 变量 | 默认外观 | 容器外观 |
| --- | --- | --- |
| `--mdv-loading-indicator-active-color` | `primary` | `on-primary-container` |
| `--mdv-loading-indicator-container-color` | 不绘制容器 | `primary-container` |

</DocsTable>

保持图形与背景至少 3:1 的对比。强制颜色模式使用系统 `CanvasText`，容器外观还使用 `Canvas` 背景和描边。

## 无障碍

- 默认根节点是不可聚焦的 `span`，带有 `role="progressbar"`。使用任务名称对应的 `label`、`aria-label` 或 `aria-labelledby`；内置标签默认为中文，内部 SVG 为装饰内容。
- 显式 `aria-label` 或 `aria-labelledby` 优先于 `label`，这些名称均不会生成可见文字。读者需要说明时，在旁边添加可见文本。
- 未知进度不设置 `aria-valuemin`、`aria-valuemax`、`aria-valuenow` 或 `aria-valuetext`，MDV 也会移除透传的这些属性。需要数值时使用进度组件。
- `decorative` 移除角色、名称及描述，设置 `aria-hidden="true"`，需要确保所属控件已经说明加载状态。
- 指示器不转移焦点，也不创建实时播报区域。繁忙状态、错误说明、完成反馈和播报均由外围任务负责，动画不会反复播报进度。

SSR 输出稳定且非空的初始 SVG，客户端复用图形节点。如果应用要求 SSR 或特定辅助技术支持，仍需验证自己的组合。

## API

### Props

<ApiTable :items="indicatorProps" />

### 插槽、事件、方法与属性透传

没有插槽、自定义组件事件、`v-model` 或公开方法。外观通过 `contained` 切换，没有 `variant`、`value`、`max`、`loading` 或请求耗时属性。

原生属性、监听器、`class` 和 `style` 进入根节点 span。MDV 管理加载角色与装饰语义，并移除数值进度的 ARIA 属性。组件不会提交表单值，也不创建遮罩层。

### 公开类型

```ts
import type { MdvLoadingIndicatorProps } from '@mdv-ui/mdv'
```
