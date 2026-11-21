<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import VariantsDemo from '@/components/docs/demos/slider/variants.vue'
import SizesDemo from '@/components/docs/demos/slider/sizes.vue'
import FormDemo from '@/components/docs/demos/slider/form.vue'

const sliderProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvSliderModelValue', description: 'standard/centered 使用 number，range 使用 [start, end] 元组。省略时分别取 min、centerValue 或 [min, max]。' },
  { name: 'variant', type: "'standard' | 'centered' | 'range'", default: "'standard'", description: '单值滑块、带中心基准的滑块或双手柄范围滑块。' },
  { name: 'min', type: 'number', default: '0', description: '有限下界；无效值回退至 0。' },
  { name: 'max', type: 'number', default: '100', description: '有限上界，并规范化为不小于 min。' },
  { name: 'step', type: 'number', default: '1', description: '以 min 为基准的正步长，支持小数。即使范围无法被步长整除，max 仍可选。' },
  { name: 'centerValue', type: 'number', default: '0', description: 'centered 的中心基准，并限制在有效边界内。' },
  { name: 'stops', type: 'boolean', default: 'false', description: '显示有效步长刻度；不会改变可选数值集合。' },
  { name: 'size', type: 'MdvSliderSize', default: "'xs'", description: "可选 'xs'、's'、'm'、'l'、'xl'，控制轨道及手柄几何尺寸，不控制数值步长。" },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: '竖向滑块从下向上增加；默认整体高度为 240px，可按需指定高度。' },
  { name: 'valueIndicator', type: 'boolean', default: 'false', description: '拖动及键盘聚焦时显示数值提示；有刻度时，指针操作需拖动或短暂停留后显示。' },
  { name: 'formatValue', type: '(value: number) => string', description: '格式化数值提示和无障碍数值文本；需要时应包含单位。' },
  { name: 'label', type: 'string', default: "''", description: '可见标签；默认插槽优先。' },
  { name: 'supportingText', type: 'string', default: "''", description: '可见辅助说明，会关联到底层原生输入。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用交互，并从表单数据中排除原生 range 输入。' },
  { name: 'color', type: 'MdvSliderColor', default: "'primary'", description: '主题色、语义色或 #RGB/#RRGGBB 种子色。' },
  { name: 'startAriaLabel / endAriaLabel', type: 'string', description: '分别命名 range 的两个手柄；本地化应用请显式提供。' },
]
const sliderSlots: SlotTableItem[] = [
  { name: 'default', description: '替换可见标签。' },
  { name: 'leading / trailing', description: '显示在轨道旁的内容；交互控件需要自行提供可访问名称。' },
  { name: 'inset-icon', description: '仅 standard 且尺寸为 m、l、xl 时可显示的装饰图标，收到 { value }；可使用 MdvIcon 和本地图标数据。' },
]
</script>
# Slider

用 `MdvSlider` 选择数值或数值范围。

## 滑块变体

标准和居中滑块绑定单个数值，范围滑块绑定由两个数值组成的元组。单滑块用 `label` 或 `aria-label` 命名，范围两端用 `start-aria-label` 和 `end-aria-label` 分别命名。

<DemoBlock>
  <VariantsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSlider } from '@mdv-ui/mdv'
import type { MdvSliderModelValue } from '@mdv-ui/mdv'

const volume = ref<MdvSliderModelValue>(42)
const exposure = ref<MdvSliderModelValue>(-10)
const price = ref<MdvSliderModelValue>([20, 80])
const inputCount = ref(0)
const changeCount = ref(0)
const percent = (value: number) => `${value}%`
const celsius = (value: number) => `${value} °C`
function recordInput() { inputCount.value++ }
function recordChange() { changeCount.value++ }
</script>

<template>
  <div class="grid min-w-0 gap-6">
    <MdvSlider v-model="volume" label="Volume" value-indicator :format-value="percent" @input="recordInput" @change="recordChange" />
    <MdvSlider v-model="exposure" variant="centered" :min="-100" :max="100" :step="5" :center-value="0" label="Exposure" value-indicator :format-value="celsius" />
    <MdvSlider v-model="price" variant="range" :min="0" :max="100" :step="5" label="Price range" start-aria-label="Minimum price" end-aria-label="Maximum price" value-indicator :format-value="value => `$${value}`" />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Volume: {{ volume }}% · input {{ inputCount }} · change {{ changeCount }} · Exposure: {{ exposure }} · Price: {{ JSON.stringify(price) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 尺寸与刻度

用 `size` 设置尺寸，`step` 设置步长，`stops` 显示刻度。用 `disabled` 禁止修改。

<DemoBlock>
  <SizesDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { MdvCheckbox, MdvSlider } from '@mdv-ui/mdv'
import type { MdvSliderSize } from '@mdv-ui/mdv'

const sizes: MdvSliderSize[] = ['xs', 's', 'm', 'l', 'xl']
const values = reactive<Record<MdvSliderSize, number>>({ xs: 30, s: 30, m: 30, l: 30, xl: 30 })
const disabled = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-5">
    <MdvSlider v-for="size in sizes" :key="size" v-model="values[size]" :size="size" :stops="true" :step="10" :label="`Size ${size}`" />
    <MdvCheckbox v-model="disabled" label="Disable the example slider" />
    <MdvSlider :model-value="45" label="Disabled example" :disabled="disabled" supporting-text="Disabled sliders are omitted from form submission." />
  </div>
</template>
```

  </template>
</DemoBlock>

## 表单与重置

设置 `name` 后，表单会提交滑块数值。范围会以同名字段提交两个值。原生重置会恢复初始模型。

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvSlider } from '@mdv-ui/mdv'
import type { MdvSliderModelValue } from '@mdv-ui/mdv'

const volume = ref<MdvSliderModelValue>(30)
const range = ref<MdvSliderModelValue>([20, 80])
const submission = ref('Submit to inspect FormData.')
function submit(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  submission.value = JSON.stringify([...new FormData(form).entries()])
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSlider v-model="volume" name="volume" form="settings-form" label="Volume" />
    <MdvSlider v-model="range" variant="range" :step="5" name="price" form="settings-form" label="Price range" start-aria-label="Minimum price" end-aria-label="Maximum price" />
    <form id="settings-form" class="flex flex-wrap gap-3" @submit.prevent="submit">
      <MdvButton type="submit">Submit values</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset to initial values</MdvButton>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Volume: {{ volume }} · Range: {{ JSON.stringify(range) }} · {{ submission }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### 属性

<ApiTable :items="sliderProps" />

### 插槽

<SlotsTable :items="sliderSlots" />

### 原生属性、事件与方法

`class`、`style`、`dir`、`lang` 作用于外层容器；`id`、`name`、`form`、ARIA/data 属性及原生输入监听器会转发到真实 range 控件。range 的第二个输入 ID 为首个 ID 加上 `-end`。组件管理原生 `type`、value、边界和 step，不要传入冲突属性。

`update:modelValue` 报告用户选择的有效数值。实例公开 `focus(options?: FocusOptions, thumb?: 'start' | 'end')` 和 `blur()`；非 range 变体会忽略 `end`。

### 公共类型

```ts
import type {
  MdvSliderModelValue, // number | [number, number]
  MdvSliderVariant,
  MdvSliderSize,
  MdvSliderOrientation,
  MdvSliderColor,
  MdvSliderThumb,
} from '@mdv-ui/mdv'
```
