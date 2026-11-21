<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import VariantsDemo from '@/components/docs/demos/slider/variants.vue'
import SizesDemo from '@/components/docs/demos/slider/sizes.vue'
import FormDemo from '@/components/docs/demos/slider/form.vue'

const sliderProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvSliderModelValue', description: 'A number for standard/centered variants or a [start, end] tuple for range. Omitted values resolve to min, centerValue, or [min, max] respectively.' },
  { name: 'variant', type: "'standard' | 'centered' | 'range'", default: "'standard'", description: 'Selects a one-ended slider, a highlighted center point, or two ordered handles.' },
  { name: 'min', type: 'number', default: '0', description: 'Finite lower bound; invalid values fall back to 0.' },
  { name: 'max', type: 'number', default: '100', description: 'Finite upper bound, normalized so it cannot be less than min.' },
  { name: 'step', type: 'number', default: '1', description: 'Positive interval based at min; decimal steps are supported. max remains selectable even when the span is not divisible by step.' },
  { name: 'centerValue', type: 'number', default: '0', description: 'Centered variant origin, clamped to the normalized bounds.' },
  { name: 'stops', type: 'boolean', default: 'false', description: 'Draws available step marks. It does not change the set of selectable values.' },
  { name: 'size', type: 'MdvSliderSize', default: "'xs'", description: "One of 'xs', 's', 'm', 'l', or 'xl'. Controls the track and handle geometry, not the numeric step." },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Vertical sliders grow upward; set an explicit height when the default 240px is not appropriate.' },
  { name: 'valueIndicator', type: 'boolean', default: 'false', description: 'Shows the active value during drag and keyboard focus. Stepped pointer interactions reveal it after a sustained drag/press.' },
  { name: 'formatValue', type: '(value: number) => string', description: 'Formats the value indicator and accessible value text. Include units when they are needed to understand the value.' },
  { name: 'label', type: 'string', default: "''", description: 'Visible label; the default slot takes precedence.' },
  { name: 'supportingText', type: 'string', default: "''", description: 'Visible description associated with the range input(s).' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction and excludes the native range input(s) from form data.' },
  { name: 'color', type: 'MdvSliderColor', default: "'primary'", description: 'Theme or semantic color, or a #RGB/#RRGGBB seed color.' },
  { name: 'startAriaLabel / endAriaLabel', type: 'string', description: 'Separate accessible names for range handles. Supply both when the application is localized.' },
]
const sliderSlots: SlotTableItem[] = [
  { name: 'default', description: 'Replaces the visible label.' },
  { name: 'leading / trailing', description: 'Content beside the track; interactive controls need their own accessible names.' },
  { name: 'inset-icon', description: 'An optional decorative icon for standard variant at sizes m, l, or xl. Receives { value }; use the local MdvIcon and icon data.' },
]
</script>
# Slider

Use `MdvSlider` to choose a number or a range of numbers.

## Slider variants

Bind a number for a standard or centered slider, or a two-number tuple for a range. Name a single handle with `label` or `aria-label`; name range handles with `start-aria-label` and `end-aria-label`.

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

## Sizes and stops

Use `size` for appearance, `step` for the increment, and `stops` to display tick marks. Set `disabled` to prevent changes.

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

## Forms and reset

Set `name` to submit the slider value. A range submits two entries with that name. Native reset restores the initial model.

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

### Props

<ApiTable :items="sliderProps" />

### Slots

<SlotsTable :items="sliderSlots" />

### Native attributes, events, and methods

`class`, `style`, `dir`, and `lang` apply to the wrapper. `id`, `name`, `form`, ARIA/data attributes, and native input listeners are forwarded to the actual range control. In range mode the second input ID is the first ID plus `-end`. The component owns the native `type`, value, bounds, and step; do not pass competing attributes for those fields.

`update:modelValue` reports accepted numeric values. The instance exposes `focus(options?: FocusOptions, thumb?: 'start' | 'end')` and `blur()`. The `end` thumb is ignored by non-range variants.

### Public types

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
