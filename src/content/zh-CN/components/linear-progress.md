<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import LinearProgressBasicDemo from '@/components/docs/demos/linearProgress/basic.vue'
import LinearProgressVariantDemo from '@/components/docs/demos/linearProgress/variant.vue'
import LinearProgressTaskDemo from '@/components/docs/demos/linearProgress/task.vue'
import LinearProgressSizeDemo from '@/components/docs/demos/linearProgress/size.vue'

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

用 `MdvLinearProgress` 在区域内显示任务进度。需要紧凑的指示器时，请用[环形进度条](./circular-progress)。

## 确定进度

使用任务本身的单位设置 `value` 和 `max`。为进度条提供无障碍名称，需要包含单位时用 `aria-valuetext`。

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

## 平直与波浪外观

用 `variant="wavy"` 显示波浪描边。直线和波浪外观都可以用 `indeterminate` 表示未知进度。

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

## 未知进度

任务总量未知时设置 `indeterminate`。完成或出错时使用独立的状态文本，进度条不会自动播报这些状态。

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

## 宽度与描边

进度条填满容器。用布局样式控制宽度，用 `thickness` 设置描边宽度。

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

## 颜色

用以下 CSS 变量修改进度描边和轨道颜色。

<DocsTable label="线性进度颜色变量" min-width="28rem">

| 变量 | 默认角色 |
| --- | --- |
| `--mdv-progress-active-color` | `--mdv-sys-color-primary` |
| `--mdv-progress-track-color` | `--mdv-sys-color-secondary-container` |

</DocsTable>

---

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
