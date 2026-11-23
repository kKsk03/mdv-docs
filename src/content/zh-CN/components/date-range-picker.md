<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DateRangePickerBasicDemo from '@/components/docs/demos/dateRangePicker/basic.vue'
import DateRangePickerLayoutDemo from '@/components/docs/demos/dateRangePicker/layout.vue'
import DateRangePickerConstraintsDemo from '@/components/docs/demos/dateRangePicker/constraints.vue'
import DateRangePickerInputDemo from '@/components/docs/demos/dateRangePicker/input.vue'
import DateRangePickerFormDemo from '@/components/docs/demos/dateRangePicker/form.vue'

const rangeProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvDateRangeValue', default: 'null', description: '已接受的 ISO 日期对 { start, end } 或 null，只提交完整有效范围；未绑定时内部管理。' },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: 'false', description: '独立打开状态，未绑定时内部管理。' },
  { name: 'layout', type: "'auto' | 'modal' | 'fullscreen'", default: "'auto'", description: 'Auto 在视口小于 600 CSS px 时全屏，其余使用 Modal；范围选择没有 Docked 布局。' },
  { name: 'initialView', type: "'calendar' | 'input'", default: "'calendar'", description: '面板打开时使用日历或文本输入视图。' },
  { name: 'locale', type: 'string', default: "'zh-CN'", description: '控制日期格式、月份/星期名称、输入顺序及默认周首日，使用公历和拉丁数字，不翻译界面文案。' },
  { name: 'firstDayOfWeek', type: '0 | 1 | 2 | 3 | 4 | 5 | 6', default: '由 locale 决定', description: '显式周首日，0 为周日，6 为周六。' },
  { name: 'min', type: 'string', description: '含端点的最早 ISO 日期，无效或倒序上下限会阻止提交。' },
  { name: 'max', type: 'string', description: '含端点的最晚 ISO 日期。' },
  { name: 'disabledDate', type: '(date: string) => boolean', description: '同步禁用日期谓词，含两端的整个范围中只要有一天不可选，范围即无效。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用两个字段、清除和打开，也遵循原生 fieldset 禁用。' },
  { name: 'readonly', type: 'boolean', default: 'false', description: '禁止编辑和打开，已接受的值仍参与表单提交。' },
  { name: 'required', type: 'boolean', default: 'false', description: '通过原生字段和选择器校验要求完整有效范围。' },
  { name: 'clearable', type: 'boolean', default: 'false', description: '添加清除操作，为整个范围请求 null。' },
  { name: 'startLabel', type: 'string', default: 'labels.startLabel', description: '开始字段的可见标签及可访问名称。' },
  { name: 'endLabel', type: 'string', default: 'labels.endLabel', description: '结束字段的可见标签及可访问名称。' },
  { name: 'startName', type: 'string', description: '已接受的开始 ISO 日期表单字段名。' },
  { name: 'endName', type: 'string', description: '已接受的结束 ISO 日期表单字段名。' },
  { name: 'placeholder', type: 'string', description: '字段与面板文本输入共用的可选占位提示。' },
  { name: 'supportingText', type: 'string', description: '输入框下方的辅助说明。省略后，只有传入 labels.formatHint 才会显示格式提示。' },
  { name: 'error', type: 'boolean', default: 'false', description: '外部字段错误状态，也参与原生校验。面板限制请使用日期约束或父级接受逻辑。' },
  { name: 'errorText', type: 'string', description: 'error 状态下由应用提供的错误说明。组件内部校验使用 labels 中对应的文案。' },
  { name: 'labels', type: 'Partial<MdvDatePickerLabels>', description: '由应用传入的可选文案，包括面板标题、操作文字、无障碍名称、提示和校验消息。' },
]
const rangeSlots: SlotTableItem[] = [
  { name: 'trigger', description: '替换结束字段内的日历按钮，接收 { open, close, triggerProps }；将提供的 props 绑定到原生按钮。' },
  { name: 'title', description: '替换面板标题并保留现有标题及可访问命名，无参数。' },
]
</script>
# 日期范围选择器

用 `MdvDateRangePicker` 选择包含起止日期的范围。模型为包含 `YYYY-MM-DD` 字符串的 `{ start, end }`，未选择时为 `null`。

## 基本用法

绑定 `v-model` 并为两个字段设置标签。选定起止日期后再确认；起止日期可以是同一天。

<DemoBlock>
  <DateRangePickerBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvDateRangePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangeValue } from '@mdv-ui/mdv'

const stay = ref<MdvDateRangeValue>({ start: '2026-11-19', end: '2026-11-23' })
const message = ref('Select both endpoints, then save the complete range.')
const labels: MdvDatePickerLabels = {
  title: "Select date",
  rangeTitle: "Select date range",
  chooseDate: "Choose a date",
  chooseRange: "Choose start and end dates",
  open: "Open date picker",
  calendar: "Switch to calendar",
  input: "Enter date",
  cancel: "Cancel",
  confirm: "Confirm",
  save: "Save",
  clear: "Clear date",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  previousYear: "Previous year",
  nextYear: "Next year",
  month: "Select month",
  year: "Select year",
  previousYears: "Earlier years",
  nextYears: "Later years",
  earlierMonths: "Earlier months",
  laterMonths: "Later months",
  today: "Today",
  selected: "Selected",
  rangeStart: "Range start",
  rangeEnd: "Range end",
  inRange: "In selected range",
  unavailable: "Unavailable",
  startLabel: "Start date",
  endLabel: "End date",
  dateLabel: "Date",
  formatHint: "Date format",
  keyboardHint: "Arrow keys move by day or week; Home/End move within the week. PageUp/PageDown change month; hold Shift to change year. Space selects. Single-date Enter selects and confirms. Shift+M/Shift+Y focus month or year.",
  invalidDate: "Enter a valid Gregorian date with a four-digit year.",
  required: "Choose a date.",
  incompleteRange: "Enter both start and end dates.",
  reversedRange: "End must not precede start.",
  outOfBounds: "Date is outside the allowed range.",
  disabledDate: "This date is unavailable.",
  blockedRange: "The range contains an unavailable date.",
  invalidBounds: "Date bounds are invalid.",
}
</script>

<template>
  <div class="grid gap-4">
    <MdvDateRangePicker v-model="stay" start-label="Arrival" end-label="Departure" locale="en-US" :labels="labels" clearable @confirm="message = 'Complete range confirmed.'" @cancel="message = `Draft discarded: ${$event.reason}.`" />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Committed: {{ JSON.stringify(stay) }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 模态与全屏布局

将 `layout` 设为 `modal` 或 `fullscreen`。`auto` 在视口宽度小于 600px 时使用全屏，其余情况使用模态布局。

<DemoBlock>
  <DateRangePickerLayoutDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDateRangePicker, MdvSelect } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangePickerLayout, MdvDateRangeValue } from '@mdv-ui/mdv'

const range = ref<MdvDateRangeValue>({ start: '2026-11-19', end: '2026-11-23' })
const layout = ref<MdvDateRangePickerLayout>('auto')
const inputView = ref(false)
const layouts = ['auto', 'modal', 'fullscreen'].map(value => ({ value, label: value }))
const labels: MdvDatePickerLabels = {
  title: "Select date",
  rangeTitle: "Select date range",
  chooseDate: "Choose a date",
  chooseRange: "Choose start and end dates",
  open: "Open date picker",
  calendar: "Switch to calendar",
  input: "Enter date",
  cancel: "Cancel",
  confirm: "Confirm",
  save: "Save",
  clear: "Clear date",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  previousYear: "Previous year",
  nextYear: "Next year",
  month: "Select month",
  year: "Select year",
  previousYears: "Earlier years",
  nextYears: "Later years",
  earlierMonths: "Earlier months",
  laterMonths: "Later months",
  today: "Today",
  selected: "Selected",
  rangeStart: "Range start",
  rangeEnd: "Range end",
  inRange: "In selected range",
  unavailable: "Unavailable",
  startLabel: "Start date",
  endLabel: "End date",
  dateLabel: "Date",
  formatHint: "Date format",
  keyboardHint: "Arrow keys move by day or week; Home/End move within the week. PageUp/PageDown change month; hold Shift to change year. Space selects. Single-date Enter selects and confirms. Shift+M/Shift+Y focus month or year.",
  invalidDate: "Enter a valid Gregorian date with a four-digit year.",
  required: "Choose a date.",
  incompleteRange: "Enter both start and end dates.",
  reversedRange: "End must not precede start.",
  outOfBounds: "Date is outside the allowed range.",
  disabledDate: "This date is unavailable.",
  blockedRange: "The range contains an unavailable date.",
  invalidBounds: "Date bounds are invalid.",
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <MdvSelect :model-value="layout" :options="layouts" label="Range layout" @update:model-value="layout = $event as MdvDateRangePickerLayout" />
      <MdvCheckbox v-model="inputView" label="Start with text input" />
    </div>
    <MdvDateRangePicker v-model="range" :layout="layout" :initial-view="inputView ? 'input' : 'calendar'" start-label="First day" end-label="Last day" locale="en-US" :labels="labels" />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Layout: {{ layout }} · Committed: {{ JSON.stringify(range) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 日期限制

用 `min` 和 `max` 设置包含边界的可选时段，用 `disabled-date` 排除不可选日期。范围内只要有不可选日期，整个范围就无效。

<DemoBlock>
  <DateRangePickerConstraintsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDateRangePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangeValue } from '@mdv-ui/mdv'

const range = ref<MdvDateRangeValue>({ start: '2026-11-19', end: '2026-11-19' })
const readonly = ref(false)
const unavailable = (date: string) => date === '2026-11-20'
const labels: MdvDatePickerLabels = {
  title: "Select date",
  rangeTitle: "Select date range",
  chooseDate: "Choose a date",
  chooseRange: "Choose start and end dates",
  open: "Open date picker",
  calendar: "Switch to calendar",
  input: "Enter date",
  cancel: "Cancel",
  confirm: "Confirm",
  save: "Save",
  clear: "Clear date",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  previousYear: "Previous year",
  nextYear: "Next year",
  month: "Select month",
  year: "Select year",
  previousYears: "Earlier years",
  nextYears: "Later years",
  earlierMonths: "Earlier months",
  laterMonths: "Later months",
  today: "Today",
  selected: "Selected",
  rangeStart: "Range start",
  rangeEnd: "Range end",
  inRange: "In selected range",
  unavailable: "Unavailable",
  startLabel: "Start date",
  endLabel: "End date",
  dateLabel: "Date",
  formatHint: "Date format",
  keyboardHint: "Arrow keys move by day or week; Home/End move within the week. PageUp/PageDown change month; hold Shift to change year. Space selects. Single-date Enter selects and confirms. Shift+M/Shift+Y focus month or year.",
  invalidDate: "Enter a valid Gregorian date with a four-digit year.",
  required: "Choose a date.",
  incompleteRange: "Enter both start and end dates.",
  reversedRange: "End must not precede start.",
  outOfBounds: "Date is outside the allowed range.",
  disabledDate: "This date is unavailable.",
  blockedRange: "The range contains an unavailable date.",
  invalidBounds: "Date bounds are invalid.",
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="readonly" label="Read only" />
    <MdvDateRangePicker
      v-model="range"
      start-label="Booking start"
      end-label="Booking end"
      locale="en-US"
      :labels="labels"
      min="2026-11-01"
      max="2026-12-31"
      :disabled-date="unavailable"
      :readonly="readonly"
      supporting-text="November–December 2026; the entire range must avoid November 20."
      clearable
    />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Committed: {{ JSON.stringify(range) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 文本输入与校验

选择器关闭时，按 Enter 或让焦点离开整组输入框可校验日期范围。即使省略错误文案，也无法保存倒序或不完整的范围。使用 `locale` 设置日期格式，按需用 `labels` 传入文案。[日期选择器文案](./date-picker#地区格式与界面文案)

<DemoBlock>
  <DateRangePickerInputDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvDateRangePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangeValue } from '@mdv-ui/mdv'

const range = ref<MdvDateRangeValue>(null)
const labels: MdvDatePickerLabels = {
  title: "Select date",
  rangeTitle: "Select date range",
  chooseDate: "Choose a date",
  chooseRange: "Choose start and end dates",
  open: "Open date picker",
  calendar: "Switch to calendar",
  input: "Enter date",
  cancel: "Cancel",
  confirm: "Confirm",
  save: "Save",
  clear: "Clear date",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  previousYear: "Previous year",
  nextYear: "Next year",
  month: "Select month",
  year: "Select year",
  previousYears: "Earlier years",
  nextYears: "Later years",
  earlierMonths: "Earlier months",
  laterMonths: "Later months",
  today: "Today",
  selected: "Selected",
  rangeStart: "Range start",
  rangeEnd: "Range end",
  inRange: "In selected range",
  unavailable: "Unavailable",
  startLabel: "Start date",
  endLabel: "End date",
  dateLabel: "Date",
  formatHint: "Date format",
  keyboardHint: "Arrow keys move by day or week; Home/End move within the week. PageUp/PageDown change month; hold Shift to change year. Space selects. Single-date Enter selects and confirms. Shift+M/Shift+Y focus month or year.",
  invalidDate: "Enter a valid Gregorian date with a four-digit year.",
  required: "Choose a date.",
  incompleteRange: "Enter both start and end dates.",
  reversedRange: "End must not precede start.",
  outOfBounds: "Date is outside the allowed range.",
  disabledDate: "This date is unavailable.",
  blockedRange: "The range contains an unavailable date.",
  invalidBounds: "Date bounds are invalid.",
}
</script>

<template>
  <div class="grid gap-4">
    <MdvDateRangePicker v-model="range" initial-view="input" start-label="Course start" end-label="Course end" locale="en-GB" :labels="labels" required supporting-text="Use DD/MM/YYYY or YYYY-MM-DD. End must not precede start." />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Complete ISO range: {{ JSON.stringify(range) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 表单与重置

通过 `start-name` 和 `end-name` 将已确认的两个 ISO 日期分别提交。原生重置会恢复初始模型。

<DemoBlock>
  <DateRangePickerFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDateRangePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangeValue } from '@mdv-ui/mdv'

const stay = ref<MdvDateRangeValue>({ start: '2026-11-21', end: '2026-11-23' })
const disabled = ref(false)
const result = ref('Each endpoint is submitted as its own ISO field.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ arrival: data.get('arrival'), departure: data.get('departure') })
}
const labels: MdvDatePickerLabels = {
  title: "Select date",
  rangeTitle: "Select date range",
  chooseDate: "Choose a date",
  chooseRange: "Choose start and end dates",
  open: "Open date picker",
  calendar: "Switch to calendar",
  input: "Enter date",
  cancel: "Cancel",
  confirm: "Confirm",
  save: "Save",
  clear: "Clear date",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  previousYear: "Previous year",
  nextYear: "Next year",
  month: "Select month",
  year: "Select year",
  previousYears: "Earlier years",
  nextYears: "Later years",
  earlierMonths: "Earlier months",
  laterMonths: "Later months",
  today: "Today",
  selected: "Selected",
  rangeStart: "Range start",
  rangeEnd: "Range end",
  inRange: "In selected range",
  unavailable: "Unavailable",
  startLabel: "Start date",
  endLabel: "End date",
  dateLabel: "Date",
  formatHint: "Date format",
  keyboardHint: "Arrow keys move by day or week; Home/End move within the week. PageUp/PageDown change month; hold Shift to change year. Space selects. Single-date Enter selects and confirms. Shift+M/Shift+Y focus month or year.",
  invalidDate: "Enter a valid Gregorian date with a four-digit year.",
  required: "Choose a date.",
  incompleteRange: "Enter both start and end dates.",
  reversedRange: "End must not precede start.",
  outOfBounds: "Date is outside the allowed range.",
  disabledDate: "This date is unavailable.",
  blockedRange: "The range contains an unavailable date.",
  invalidBounds: "Date bounds are invalid.",
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="disabled = false; result = 'Form reset to its initial range.'">
    <MdvCheckbox v-model="disabled" label="Disable the booking fieldset" />
    <fieldset :disabled="disabled" class="min-w-0 border-0 p-0">
      <legend class="mb-3 font-medium">Hotel booking</legend>
      <MdvDateRangePicker v-model="stay" start-label="Required arrival" end-label="Required departure" start-name="arrival" end-name="departure" locale="en-US" :labels="labels" required clearable />
    </fieldset>
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit booking</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset booking</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
```

  </template>
</DemoBlock>

---

## API

### 属性

<ApiTable :items="rangeProps" />

### 范围值

以下为模型中 `MdvDateRange` 对象的字段，不是独立组件属性。

<DocsTable label="日期范围值字段" min-width="28rem">

| 字段 | 类型 | 含义 |
| --- | --- | --- |
| `start` | `string` | 必填，有效的公历 `YYYY-MM-DD` 开始日期。 |
| `end` | `string` | 必填，有效的公历 `YYYY-MM-DD` 结束日期，不早于开始。 |

</DocsTable>

`MdvDateRangeValue` 为完整对象或 `null`，存储或传递时应保留两个端点的纯日期含义。

### 插槽

<SlotsTable :items="rangeSlots" />

### 事件

<DocsTable label="日期范围选择器事件" min-width="34rem">

| 事件 | 参数及时机 |
| --- | --- |
| `update:modelValue` | `MdvDateRangeValue`，请求完整范围或 `null`。 |
| `update:open` | `boolean`，独立的打开/关闭请求。 |
| `confirm` | 面板确认后已接受的有效 `MdvDateRangeValue`；字段编辑和清除不会发出。 |
| `cancel` | `{ reason }`，确认以外的实际关闭会放弃面板草稿，也包括外部模型/禁用状态变化。 |
| `open` / `opened` | 无参数，开始打开 / 动效完成。 |
| `close` / `closed` | `{ reason }`，开始关闭 / 动效和清理完成。 |

</DocsTable>

共用原因类型包括 `confirm`、`cancel`、`escape`、`scrim`、`outside`、`blur`、`model`、`programmatic` 和 `disabled`，具体原因取决于布局与关闭路径。布局迁移不伪造取消/打开事件。日期接受和关闭接受相互独立，`confirm` 不保证受控父级已经关闭面板。

### 方法与原生属性

<DocsTable label="日期范围选择器暴露方法" min-width="32rem">

| 方法 | 返回值 | 用途 |
| --- | --- | --- |
| `open(event?)` / `close()` | `Promise<boolean>` | 表示父级接受情况，不等待动效完成；`close()` 使用 `programmatic`。 |
| `focus(options?)` | `void` | 聚焦开始字段，不打开面板。 |
| `checkValidity()` / `reportValidity()` | `boolean` | 检查两个字段，报告时也显示反馈。 |
| `setCustomValidity(message)` | `void` | 设置两个字段共用的自定义校验，使用 `''` 清空。 |

</DocsTable>

`class`/`style` 应用于外层，`dir`/`lang` 同时传给字段。其他原生属性和监听器通常应用到开始输入；结束输入保留独立标签，不重复这些监听器、ARIA 命名、autofocus 或占位符。`form` 将两个可见字段及隐藏模型字段关联到外部表单，表单名称使用 `start-name`/`end-name`，而非通用 `name`。

### 公开类型

```ts
import type {
  MdvDateRange,
  MdvDateRangeValue,
  MdvDateRangePickerProps,
  MdvDateRangePickerLayout,
  MdvDatePickerCommonProps,
  MdvDatePickerView,
  MdvDatePickerLabels,
  MdvDatePickerCloseReason,
  MdvDatePickerCloseDetail,
  MdvDatePickerTriggerProps,
  MdvDatePickerTriggerSlotProps,
  MdvDatePickerSlots,
  MdvDatePickerExpose,
} from '@mdv-ui/mdv'
```
