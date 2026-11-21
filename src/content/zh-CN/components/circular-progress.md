<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import CircularProgressBasicDemo from '@/components/docs/demos/circularProgress/basic.vue'
import CircularProgressVariantDemo from '@/components/docs/demos/circularProgress/variant.vue'
import CircularProgressSizeDemo from '@/components/docs/demos/circularProgress/size.vue'

const progressProps: ApiTableItem[] = [
  { name: 'value', type: 'number', default: '0', description: '0–max 范围内的当前值。有限值会限制在范围内，非有限值按 0 处理，支持小数。' },
  { name: 'max', type: 'number', default: '100', description: '有限正数上限；无效值回退为 100。' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: '显示未知进度并省略 aria-valuenow。需要显式设置，不会根据 value 推断模式。' },
  { name: 'variant', type: "'flat' | 'wavy'", default: "'flat'", description: '平直或富有表现力的波浪描边，两种进度模式都支持。' },
  { name: 'size', type: 'number', default: 'flat: 40; wavy: 48', description: '直径，单位为 CSS px。非正数或非有限值使用当前变体的默认值。' },
  { name: 'thickness', type: 'number', default: '4', description: '描边宽度，单位为 CSS px。无效值回退为 4，圆形描边最多为直径的一半。' },
  { name: 'label', type: 'string', description: '显示在图形上方的可选文字；未提供显式 ARIA 名称时也作为可访问名称。' },
]
</script>
# 圆形进度指示器

用 `MdvCircularProgress` 以紧凑圆环显示任务进度。

## 确定进度

使用任务本身的单位设置 `value` 和 `max`。用 `label` 或 `aria-label` 为指示器命名；需要播报单位时用 `aria-valuetext`。

<DemoBlock>
  <CircularProgressBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCircularProgress } from '@mdv-ui/mdv'

const transferred = ref(128)
const total = 256
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCircularProgress :value="transferred" :max="total" label="File transfer" :aria-valuetext="`${transferred} of ${total} MB`" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="transferred === total" @click="transferred = Math.min(total, transferred + 32)">Add 32 MB</MdvButton>
      <MdvButton variant="outlined" :disabled="transferred === 0" @click="transferred = Math.max(0, transferred - 32)">Subtract 32 MB</MdvButton>
      <MdvButton variant="text" @click="transferred = 0">Reset</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ transferred }} / {{ total }} MB{{ transferred === total ? ' · Complete' : '' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 平直与波浪外观

用 `variant="wavy"` 显示波浪描边。无法计算已完成量时设置 `indeterminate`。

<DemoBlock>
  <CircularProgressVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvCircularProgress } from '@mdv-ui/mdv'
import type { MdvProgressVariant } from '@mdv-ui/mdv'

const variants: MdvProgressVariant[] = ['flat', 'wavy']
</script>

<template>
  <div class="grid gap-6">
    <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-center gap-8">
      <MdvCircularProgress :value="60" :variant="variant" :label="`${variant}: 60%`" />
      <MdvCircularProgress indeterminate :variant="variant" :label="`${variant}: waiting`" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 尺寸与描边

用 `size` 设置直径，用 `thickness` 设置描边宽度，单位都是 CSS 像素。

<DemoBlock>
  <CircularProgressSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvCircularProgress } from '@mdv-ui/mdv'

const thick = ref(false)
const sizes = [24, 40, 64, 96]
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="thick" label="Use an 8px stroke" />
    <div class="flex flex-wrap items-center gap-6">
      <MdvCircularProgress v-for="size in sizes" :key="size" :size="size" :thickness="thick ? 8 : 4" :value="65" :label="`${size}px`" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 颜色

如需覆盖进度描边或轨道颜色，可在指示器上设置这些 CSS 变量。完成或出错时请另行显示文本。

<DocsTable label="圆形进度配色变量" min-width="28rem">

| 变量 | 默认颜色角色 |
| --- | --- |
| `--mdv-progress-active-color` | `--mdv-sys-color-primary` |
| `--mdv-progress-track-color` | `--mdv-sys-color-secondary-container` |

</DocsTable>

---

## API

### 属性

<ApiTable :items="progressProps" />

### 插槽、事件与原生属性

组件没有公开插槽、模型、组件事件或暴露方法。请根据应用任务状态设置 `value` 和 `indeterminate`，也没有 `loading`、`disabled` 或 `error` 属性。

原生 `id`、`class`、`style`、`dir`、ARIA 说明/数值文字及事件监听器应用到根元素。进度条角色与数值属性由组件管理，请使用 props 修改进度语义。显式可访问名称不会修改可见的 `label` 文字。

### 公开类型

```ts
import type {
  MdvProgressVariant,
  MdvProgressProps,
  MdvCircularProgressProps,
} from '@mdv-ui/mdv'
```

`MdvCircularProgressProps` 在公共进度属性基础上增加 `size`，`MdvProgressVariant` 为 `'flat' | 'wavy'`。
