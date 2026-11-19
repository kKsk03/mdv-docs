<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import LinearProgressBasicDemo from '@/components/docs/demos/linearProgress/basic.vue'
import LinearProgressVariantDemo from '@/components/docs/demos/linearProgress/variant.vue'
import LinearProgressTaskDemo from '@/components/docs/demos/linearProgress/task.vue'
import LinearProgressSizeDemo from '@/components/docs/demos/linearProgress/size.vue'
import LinearProgressThemeDemo from '@/components/docs/demos/linearProgress/theme.vue'

const progressProps: ApiTableItem[] = [
  { name: 'value', type: 'number', default: '0', description: '当前任务值，限制在 0–max 内。非有限数值回退到 0，保留小数。' },
  { name: 'max', type: 'number', default: '100', description: '正的有限上限，无效或非正数回退到 100。' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: '显式表示未知进度，省略 aria-valuenow，不根据 value 推断模式。' },
  { name: 'variant', type: "'flat' | 'wavy'", default: "'flat'", description: '平直或富有表现力的波浪线条，两者均支持确定与不确定进度。' },
  { name: 'thickness', type: 'number', default: '4', description: '线宽，单位为 CSS px。无效、非有限或非正数回退到 4。' },
  { name: 'label', type: 'string', description: '图形上方的可见文字，同时提供可访问名称；显式 ARIA 命名优先。' },
]
</script>

# 线性进度指示器

`MdvLinearProgress` 沿可用宽度展示任务进度。已知完成量时使用确定进度，未知时使用不确定进度。需要紧凑圆形展示时，参阅[圆形进度指示器](/zh-CN/components/circular-progress)；短暂等待且不展示百分比时，参阅[加载指示器](/zh-CN/components/loading-indicator)。

## 确定进度与任务单位

`value` 与 `max` 可以直接使用业务单位。下面的传输通过 `aria-valuetext` 说明兆字节，不必先将公开数值换算为百分比。

<DemoBlock>
  <LinearProgressBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvLinearProgress } from '@mdv-ui/mdv'

const transferred = ref(128)
const total = 256
</script>

<template>
  <div class="grid gap-5">
    <MdvLinearProgress :value="transferred" :max="total" label="File transfer" :aria-valuetext="`${transferred} of ${total} MB`" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="transferred === total" @click="transferred = Math.min(total, transferred + 32)">Add 32 MB</MdvButton>
      <MdvButton variant="outlined" :disabled="transferred === 0" @click="transferred = Math.max(0, transferred - 32)">Subtract 32 MB</MdvButton>
      <MdvButton variant="text" @click="transferred = 0">Reset transfer</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ transferred }} / {{ total }} MB{{ transferred === total ? ' · Complete' : '' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

默认范围为 `0…100`。超出范围的值会被限制，无效值回退到 `0`，无效上限回退到 `100`。完成后指示器仍然可见，由业务决定隐藏时机并提供完成状态。

## 平直与波浪外观

使用 `variant="wavy"` 开启波浪外观，默认使用 `flat`。未知进度需要显式设置 `indeterminate`。

<DemoBlock>
  <LinearProgressVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvLinearProgress } from '@mdv-ui/mdv'
import type { MdvProgressVariant } from '@mdv-ui/mdv'

const variants: MdvProgressVariant[] = ['flat', 'wavy']
</script>

<template>
  <div class="grid gap-7">
    <div v-for="variant in variants" :key="variant" class="grid gap-4">
      <MdvLinearProgress :variant="variant" :value="55" :label="`${variant}: determinate`" />
      <MdvLinearProgress :variant="variant" indeterminate :label="`${variant}: indeterminate`" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

波浪确定进度在不超过 `10%` 或达到 `95%` 时收回为平直，收放期间图形高度保持稳定。不确定波浪进度持续保留波形。圆形端点、轨道间隔和确定进度末端标记由 MDV 绘制；默认标记为 4px，并在接近完成时收起。

## 未知进度、完成与失败

任务状态由业务维护。启动示例后，可以确认总量、推进进度或模拟失败。这些操作只在本地切换状态，不会上传文件。

<DemoBlock>
  <LinearProgressTaskDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvButton, MdvLinearProgress } from '@mdv-ui/mdv'

const phase = ref<'idle' | 'connecting' | 'uploading' | 'complete' | 'error'>('idle')
const transferred = ref(0)
const total = 256
const busy = computed(() => phase.value === 'connecting' || phase.value === 'uploading')
const message = computed(() => {
  if (phase.value === 'connecting') return 'Connecting. The total progress is not known yet.'
  if (phase.value === 'uploading') return `Uploading: ${transferred.value} of ${total} MB.`
  if (phase.value === 'complete') return 'Report uploaded. The completed indicator stays visible.'
  if (phase.value === 'error') return 'Upload failed. Start again to retry.'
  return 'Start an upload to try the task states.'
})

function advance() {
  transferred.value = Math.min(total, transferred.value + 64)
  if (transferred.value === total) phase.value = 'complete'
}
</script>

<template>
  <div class="grid gap-5">
    <section :aria-busy="busy" aria-label="Report upload" class="grid min-h-12 items-center">
      <MdvLinearProgress v-if="busy || phase === 'complete'" :indeterminate="phase === 'connecting'" :value="transferred" :max="total" variant="wavy" label="Report upload" :aria-valuetext="phase === 'connecting' ? undefined : `${transferred} of ${total} MB`" />
      <span v-else class="text-sm text-mdv-on-surface-variant">{{ phase === 'error' ? 'Ready to retry.' : 'No upload is running.' }}</span>
    </section>
    <div class="flex flex-wrap gap-3">
      <MdvButton :disabled="busy" @click="transferred = 0; phase = 'connecting'">Start upload</MdvButton>
      <MdvButton variant="tonal" :disabled="phase !== 'connecting'" @click="phase = 'uploading'">Progress is known</MdvButton>
      <MdvButton variant="outlined" :disabled="phase !== 'uploading'" @click="advance">Upload 64 MB</MdvButton>
      <MdvButton variant="text" :disabled="!busy" @click="phase = 'error'">Simulate failure</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

连接期间省略 `aria-valuenow` 和自定义数值说明；进度明确后使用真实的 `0…256` 范围。外围内容区负责 `aria-busy`，独立于繁忙区域的状态文字负责通知关键变化。失败后移除指示器并允许重试，成功后保留完成状态的指示器。

组件没有内置请求处理、错误状态、完成事件、自动隐藏或耗时估计。

## 宽度、线宽与方向

线性组件占满容器宽度，可以通过外层容器或根节点的 `class`、`style` 限制。通过 `thickness` 调整图形线宽，不要用根节点高度替代。

<DemoBlock>
  <LinearProgressSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvLinearProgress, MdvSelect } from '@mdv-ui/mdv'

const thickness = ref(4)
const narrow = ref(false)
const rtl = ref(false)
const options = [2, 4, 8, 12].map(value => ({ value, label: `${value}px` }))
</script>

<template>
  <div class="grid gap-5">
    <MdvSelect :model-value="thickness" :options="options" label="Stroke thickness" @update:model-value="thickness = Number($event)" />
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="narrow" label="Use a narrow container" />
      <MdvCheckbox v-model="rtl" label="Right-to-left progress" />
    </div>
    <div :dir="rtl ? 'rtl' : 'ltr'" class="grid w-full gap-6" :style="{ maxInlineSize: narrow ? '220px' : '100%' }">
      <MdvLinearProgress :value="55" :thickness="thickness" label="Flat stroke" />
      <MdvLinearProgress :value="55" :thickness="thickness" variant="wavy" label="Wavy stroke" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

平直图形高度等于 `thickness`，波浪图形额外预留 6px，默认分别为 4px 和 10px。可见标签还会增加文字高度和 4px 间隔。线性进度没有 `size` 属性。

继承 `dir="rtl"` 时，确定进度的增长方向与不确定进度的移动方向都会镜像，标签仍按正常逻辑方向排列。

## 局部主题与颜色

活动线条和末端标记使用 `primary`，轨道使用 `secondary-container`。局部主题继承相同角色；需要其他配色时覆盖专用变量。

<DemoBlock>
  <LinearProgressThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvLinearProgress } from '@mdv-ui/mdv'
</script>

<template>
  <div class="grid gap-4">
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid gap-6 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
      <MdvLinearProgress :value="60" :label="`${theme}: primary`" />
      <MdvLinearProgress :value="60" variant="wavy" :label="`${theme}: tertiary`" style="--mdv-progress-active-color: var(--mdv-sys-color-tertiary); --mdv-progress-track-color: var(--mdv-sys-color-tertiary-container)" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="线性进度颜色变量" min-width="28rem">

| 变量 | 默认角色 |
| --- | --- |
| `--mdv-progress-active-color` | `--mdv-sys-color-primary` |
| `--mdv-progress-track-color` | `--mdv-sys-color-secondary-container` |

</DocsTable>

组件没有 `color` 属性。保持图形与承载表面的对比，使用文字说明完成或失败，不要只依赖颜色。强制颜色模式使用系统 `Highlight` 和 `GrayText`。

## 无障碍与动效

- 使用可见 `label`、`aria-label` 或 `aria-labelledby` 提供名称。显式 ARIA 名称优先，但不会替换可见标签；补充说明可通过 `aria-describedby` 关联。
- 根节点是只读 `progressbar`，提供 `aria-valuemin="0"` 和规范化的上限。确定模式还提供真实当前值；ARIA 会立即更新，不等待视觉插值。
- SVG 为装饰内容，不增加 Tab 入口，也不转移焦点。进度指示器不是滑块或输入控件。
- 组件不创建实时播报区域。需要通知完成或失败时，由任务级状态文字负责，避免逐帧播报。
- 数值变化和波浪收放约为 500ms，打断更新后从当前显示帧继续。减少动态效果时，确定进度直接更新，不确定进度使用静态图形。
- 页面隐藏、图形离开视口或所属 KeepAlive 页面停用时暂停持续动画。SSR 输出稳定初始图形，浏览器挂载后再测量实际宽度。

## API

### Props

<ApiTable :items="progressProps" />

### 插槽、事件、方法与属性透传

没有公开插槽、组件事件、`v-model` 或额外公开方法。由业务更新 `value` 与 `indeterminate`。组件没有 `loading`、`disabled`、`error` 或 `paused` 属性。

`id`、`class`、`style`、`dir`、ARIA 描述及数值说明、原生监听器进入根节点。MDV 管理进度角色和范围属性，应通过组件属性修改进度语义。组件不会提交表单值。

### 公开类型

```ts
import type { MdvProgressProps, MdvProgressVariant } from '@mdv-ui/mdv'
```

`MdvProgressVariant` 为 `'flat' | 'wavy'`。线性进度使用共用的 `MdvProgressProps`，没有单独导出 `MdvLinearProgressProps`。
