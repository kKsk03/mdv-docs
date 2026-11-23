<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import AvailabilityDemo from '@/components/docs/demos/timePicker/availability.vue'
import FormDemo from '@/components/docs/demos/timePicker/form.vue'
import ModesDemo from '@/components/docs/demos/timePicker/modes.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvTimeValue', default: 'null', description: '已提交的 ASCII HH:mm 或 null。' },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: 'false', description: '独立于时间值控制模态窗口；省略时由组件管理。' },
  { name: 'initialView', type: 'MdvTimePickerView', default: "'auto'", description: '拨盘 dial、输入 input 或 auto；自动模式在主指针精细时优先输入，否则优先拨盘。' },
  { name: 'orientation', type: 'MdvTimePickerOrientation', default: "'auto'", description: '拨盘布局：auto、vertical 或 horizontal。空间不足时回退为输入模式。' },
  { name: 'hourCycle', type: 'MdvTimePickerHourCycle', default: "'auto'", description: 'h12、h23 或随地区偏好的 auto。' },
  { name: 'locale', type: 'string', default: "'zh-CN'", description: '控制 Intl 数字、时分格式和时段标记，不改变界面文案。' },
  { name: 'min', type: 'string', description: '当天最早时间，包含端点，格式为 HH:mm。' },
  { name: 'max', type: 'string', description: '当天最晚时间，包含端点，格式为 HH:mm。' },
  { name: 'disabledTime', type: '(time: string) => boolean', description: '收到标准 HH:mm；返回 true 时排除该分钟。' },
  { name: 'minuteStep', type: 'number', default: '1', description: '60 的正整数约数，从每小时第 00 分钟起计算。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用输入框、打开入口和原生表单项。' },
  { name: 'readonly', type: 'boolean', default: 'false', description: '禁止编辑和打开选择器，但仍可随表单提交。' },
  { name: 'required', type: 'boolean', default: 'false', description: '必须输入有效且可用的时间。' },
  { name: 'clearable', type: 'boolean', default: 'false', description: '非空且可编辑时提供清除操作，即使字段必填也可以清除。' },
  { name: 'label', type: 'string', description: '外部输入框的可见标签，默认使用 labels.time。' },
  { name: 'placeholder', type: 'string', description: '主时间输入框的可选占位提示。' },
  { name: 'supportingText', type: 'string', description: '输入框下方的辅助说明。省略后，只有传入 labels.formatHint 才会显示格式提示。' },
  { name: 'error', type: 'boolean', default: 'false', description: '设置业务错误，阻止弹窗确认并使原生校验失败。' },
  { name: 'errorText', type: 'string', description: 'error 状态下由应用提供的错误说明。组件内部校验使用 labels 中对应的文案。' },
  { name: 'name', type: 'string', description: '用于提交已确认值的隐藏表单字段名。' },
  { name: 'labels', type: 'Partial<MdvTimePickerLabels>', description: '由应用传入的可选文案，包括面板标题、操作文字、无障碍名称、提示和校验消息。' },
]
const slots: SlotTableItem[] = [
  { name: 'trigger', description: '替换尾部时钟按钮。获得 { open, close, triggerProps }，将 triggerProps 整体绑定到一个原生按钮或能透传到按钮的组件。' },
  { name: 'title', description: '替换模态窗口标题，并为其提供无障碍名称。' },
]
</script>
# 时间选择器

用 `MdvTimePicker` 选择一天中的时刻。模型为 24 小时制的 `HH:mm` 字符串或 `null`，不包含日期或时区。

## 拨盘与数字输入

用时钟按钮打开选择器。在表盘和文本输入之间切换时，会保留草稿。确认后才写入模型，直接关闭则丢弃草稿。

<DemoBlock>
  <ModesDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvTimePicker } from '@mdv-ui/mdv'
import type { MdvTimeValue } from '@mdv-ui/mdv'
import { englishTimePickerLabels } from './labels'

const time = ref<MdvTimeValue>('13:05')
const use12Hours = ref(false)
const horizontal = ref(false)
const result = ref('No dialog action yet.')
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <MdvCheckbox v-model="use12Hours" label="Use a 12-hour clock" />
      <MdvCheckbox v-model="horizontal" label="Prefer a horizontal dial" />
    </div>
    <MdvTimePicker
      v-model="time"
      label="Reminder time"
      locale="en-US"
      :labels="englishTimePickerLabels"
      :hour-cycle="use12Hours ? 'h12' : 'h23'"
      :orientation="horizontal ? 'horizontal' : 'auto'"
      initial-view="dial"
      @confirm="result = `Confirmed: ${$event ?? 'none'}.`"
      @cancel="result = `Closed without saving (${ $event.reason }).`"
    />
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Committed: {{ time ?? 'none' }}. {{ result }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 可选时段

用 `min` 和 `max` 设置包含边界的当天可选时段。跨午夜时使用 `disabled-time`，不要把起止值倒置。`minute-step` 必须能整除 60。

<DemoBlock>
  <AvailabilityDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvTimePicker } from '@mdv-ui/mdv'
import type { MdvTimeValue } from '@mdv-ui/mdv'
import clockIcon from '@iconify-icons/material-symbols/schedule'
import { englishTimePickerLabels } from './labels'

const time = ref<MdvTimeValue>('22:00')
const open = ref(false)
const blockAll = ref(false)
const reject = ref(false)
const result = ref('No change requested.')

function disabledTime(value: string) {
  return blockAll.value || (value > '02:00' && value < '22:00')
}

function requestTime(value: MdvTimeValue) {
  if (reject.value) {
    result.value = `Kept ${time.value ?? 'no time'} instead of ${value ?? 'no time'}.`
    return
  }
  time.value = value
  result.value = `Accepted ${value ?? 'no time'}.`
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-1">
      <MdvCheckbox v-model="blockAll" label="Block all times" />
      <MdvCheckbox v-model="reject" label="Decline changes" />
    </div>
    <MdvTimePicker
      v-model:open="open"
      :model-value="time"
      :disabled-time="disabledTime"
      :labels="englishTimePickerLabels"
      :minute-step="15"
      label="Maintenance starts at"
      supporting-text="From 22:00 to 02:00, in 15-minute steps."
      locale="en-US"
      hour-cycle="h23"
      initial-view="input"
      @update:model-value="requestTime"
    >
      <template #title>Schedule overnight maintenance</template>
      <template #trigger="{ triggerProps }">
        <MdvIconButton v-bind="triggerProps" variant="standard">
          <MdvIcon :icon="clockIcon" />
        </MdvIconButton>
      </template>
    </MdvTimePicker>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ result }} Picker: {{ open ? 'open' : 'closed' }}.
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 原生表单与校验

格式有效的文本在失焦或按 Enter 时写入模型。设置 `name` 后，即使界面显示 AM/PM，表单仍提交已确认的 `HH:mm`。用 `required` 要求填写时间。

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvTimePicker } from '@mdv-ui/mdv'
import type { MdvTimePickerExpose, MdvTimeValue } from '@mdv-ui/mdv'
import { englishTimePickerLabels } from './labels'

const formId = `time-booking-${useId()}`
const picker = useTemplateRef<MdvTimePickerExpose>('picker')
const time = ref<MdvTimeValue>('09:00')
const result = ref('No booking submitted.')

function submit(event: SubmitEvent) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = `Submitted ${JSON.stringify([...data])}`
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvTimePicker
      ref="picker"
      v-model="time"
      :form="formId"
      :labels="englishTimePickerLabels"
      :minute-step="15"
      name="appointment"
      label="Appointment"
      min="09:00"
      max="17:00"
      locale="en-US"
      hour-cycle="h23"
      initial-view="input"
      required
      clearable
    />
    <form :id="formId" class="flex flex-wrap items-center gap-2" @submit.prevent="submit" @reset="result = 'Form reset.'">
      <MdvButton type="submit">Book</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
      <MdvButton variant="text" @click="picker?.reportValidity()">Check time</MdvButton>
    </form>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 本地化

通过 `locale` 和 `hour-cycle` 设置显示和输入格式，按需用 `labels` 传入应用文案。省略确认或取消文案时，对应操作显示图标。未提供对应消息时，无效时间仍无法通过校验。

```ts:line-numbers
import type { MdvTimePickerLabels } from '@mdv-ui/mdv'

export const englishTimePickerLabels: MdvTimePickerLabels = {
  title: 'Choose a time',
  time: 'Time',
  hour: 'Hour',
  minute: 'Minute',
  period: 'AM or PM',
  open: 'Open time picker',
  dial: 'Switch to dial',
  input: 'Switch to text entry',
  cancel: 'Cancel',
  confirm: 'OK',
  clear: 'Clear time',
  formatHint: 'Time format',
  keyboardHint: 'Use arrow keys to change the value, Home or End to go to the first or last option, and Space or Enter to select.',
  invalidTime: 'Enter a valid time.',
  required: 'Choose a time.',
  outOfBounds: 'This time is outside the allowed range.',
  disabledTime: 'This time is unavailable.',
  invalidBounds: 'The earliest and latest times are invalid or out of order.',
  invalidStep: 'The minute step must be a positive divisor of 60.',
  stepMismatch: 'Use a time that matches the minute step.',
  noAvailableTime: 'There are no available times.',
}
```

---

## API

### 属性

<ApiTable :items="props" />

### 插槽

<SlotsTable :items="slots" />

### 事件与公开方法

- `update:modelValue(value)` 请求更改时间，`update:open(boolean)` 请求改变模态窗口可见性。窗口草稿获父级接受后才会发出 `confirm(value)`；未确认就关闭时发出 `cancel(detail)`。
- `open` 与 `close(detail)` 表示开始打开和关闭，`opened` 与 `closed(detail)` 表示过渡结束。`detail.reason` 为 `confirm`、`cancel`、`escape`、`scrim`、`model`、`programmatic` 或 `disabled`。
- 模板引用提供 `open(event?)` 和 `close()`，以 `Promise<boolean>` 返回请求是否被接受，不等待动画结束。还提供 `focus(options?)`、`checkValidity()`、`reportValidity()` 和 `setCustomValidity(message)`；传入空字符串可清除自定义错误。

`class`、`style`、`dir` 和 `lang` 可设在外层；ID、`form` 以及适用的原生属性和事件会透传到外部输入框。使用选择器属性配置边界和步长，不依赖原生 `min`、`max` 或 `step`。原生模态窗口保留在原 DOM 层级并继承局部主题。

### 公开类型

```ts
import type {
  MdvTimeValue,
  MdvTimePickerProps,
  MdvTimePickerView,
  MdvTimePickerOrientation,
  MdvTimePickerHourCycle,
  MdvTimePickerLabels,
  MdvTimePickerCloseReason,
  MdvTimePickerCloseDetail,
  MdvTimePickerTriggerProps,
  MdvTimePickerTriggerSlotProps,
  MdvTimePickerSlots,
  MdvTimePickerExpose,
} from '@mdv-ui/mdv'
```
