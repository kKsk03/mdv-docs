<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import CircularProgressBasicDemo from '@/components/docs/demos/circularProgress/basic.vue'
import CircularProgressVariantDemo from '@/components/docs/demos/circularProgress/variant.vue'
import CircularProgressModeDemo from '@/components/docs/demos/circularProgress/mode.vue'
import CircularProgressSizeDemo from '@/components/docs/demos/circularProgress/size.vue'
import CircularProgressThemeDemo from '@/components/docs/demos/circularProgress/theme.vue'

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

`MdvCircularProgress` 以圆形指示器展示任务进度。任务完成量可以测量时使用确定进度，未知时使用不确定进度。平直和波浪外观都支持这两种模式。

## 确定进度

通过 `value` 和可选的 `max` 传入任务的实际单位。示例直接记录已传输的 MB，无需先换算成百分比。读出的数值需要包含单位或上下文时，可以补充 `aria-valuetext`。

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

数值会限制在 `0…max` 范围内；无效 `value` 按 `0` 处理，无效或非正数 `max` 回退为 `100`，小数仍会保留。达到 `max` 不会自动隐藏指示器，也不会自动播报完成结果。示例通过单独的状态文字反馈业务结果。

---

## 平直与波浪外观

设置 `variant="wavy"` 使用波浪外观，或保留默认的 `flat` 平直描边。两种外观都支持确定与不确定进度。

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

确定进度从顶部开始顺时针推进，RTL 布局中也保持顺时针。确定模式的波浪描边会在 10% 至 95% 之间展开，在两端回归平直描边，外部尺寸保持稳定。平直不确定模式不绘制底环，波浪不确定模式则保留轨道。

## 切换进度模式

任务尚未产生可测量结果时使用 `indeterminate`，获得实际进度后将其设为 `false` 并传入数值。不要用虚构百分比代替未知进度。

<DemoBlock>
  <CircularProgressModeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvCircularProgress } from '@mdv-ui/mdv'

const unknown = ref(true)
const value = ref(25)

function complete() {
  unknown.value = false
  value.value = 100
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="unknown" label="Progress is unknown" />
    <MdvCircularProgress :value="value" :indeterminate="unknown" variant="wavy" label="Processing files" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="unknown || value === 100" @click="value = Math.min(100, value + 5)">Advance 5%</MdvButton>
      <MdvButton variant="outlined" @click="complete">Complete</MdvButton>
      <MdvButton variant="text" @click="value = 0; unknown = true">Start over</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ unknown ? 'Waiting for a measurable result…' : value === 100 ? 'Processing complete.' : `Processed ${value}%.` }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

`indeterminate` 与 `value` 独立。开启时进度条省略 `aria-valuenow`，关闭后恢复规范化的当前值。任务取消、重试、错误信息、完成反馈及指示器的显示时机由应用决定。

---

## 尺寸与描边

`size` 控制直径，`thickness` 控制描边宽度，单位均为 CSS px。平直外观默认 40px，波浪默认 48px，描边均为 4px。切换外观时若要保持相同直径，请显式设置统一尺寸。

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

为文字与图形保留足够空间。进度指示器用于显示状态，不是操作控件，因此不会创建按钮点击区域，也不会进入 Tab 顺序。

## 主题与配色

活动描边默认使用 `primary`，轨道使用 `secondary-container`。局部浅色/深色区域会继承 MDV 的主题令牌。组件没有 `color` 属性，需要其他语义颜色时使用专用 CSS 变量。

<DemoBlock>
  <CircularProgressThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvCircularProgress } from '@mdv-ui/mdv'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="flex flex-wrap items-center gap-6 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
      <MdvCircularProgress :value="60" :label="`${theme}: primary`" />
      <MdvCircularProgress
        :value="60"
        variant="wavy"
        :label="`${theme}: tertiary`"
        style="--mdv-progress-active-color: var(--mdv-sys-color-tertiary); --mdv-progress-track-color: var(--mdv-sys-color-tertiary-container)"
      />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="圆形进度配色变量" min-width="28rem">

| 变量 | 默认颜色角色 |
| --- | --- |
| `--mdv-progress-active-color` | `--mdv-sys-color-primary` |
| `--mdv-progress-track-color` | `--mdv-sys-color-secondary-container` |

</DocsTable>

不要只靠颜色表达完成或失败。在强制颜色模式下，指示器使用系统 `Highlight` 和 `GrayText` 颜色。

## 无障碍与动效

- 使用 `label`、`aria-label` 或 `aria-labelledby` 提供可访问名称。`label` 同时显示为可见文字；显式 `aria-label` 优先，存在 `aria-labelledby` 时不会再添加默认标签名称。
- 根元素提供 `role="progressbar"`、`aria-valuemin="0"` 及规范化的 `aria-valuemax`。确定模式还会立即提供真实 `aria-valuenow`，不会等待视觉插值结束。
- 装饰 SVG 对辅助技术隐藏且不能聚焦。任务说明应放在图形之外，需要时通过 `aria-describedby` 建立关联。
- 进度条不是实时播报区域。重要的完成或错误变化需要应用单独提供状态信息，避免逐动画帧播报或不断更新未知任务的文字。
- 数值和波形过渡约为 500ms。减少动态效果开启后，确定进度直接更新，不确定模式使用静态的未知进度图形。页面或指示器不可见、以及所属 KeepAlive 视图停用时，会暂停持续动画。

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
