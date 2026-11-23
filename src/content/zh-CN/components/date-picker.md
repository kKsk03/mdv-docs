<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DatePickerBasicDemo from '@/components/docs/demos/datePicker/basic.vue'
import DatePickerLayoutDemo from '@/components/docs/demos/datePicker/layout.vue'
import DatePickerConstraintsDemo from '@/components/docs/demos/datePicker/constraints.vue'
import DatePickerLocaleDemo from '@/components/docs/demos/datePicker/locale.vue'
import DatePickerFormDemo from '@/components/docs/demos/datePicker/form.vue'

const pickerProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvDateValue', default: 'null', description: '已接受的 YYYY-MM-DD 日期或 null。未绑定时内部管理，面板修改在确认前只作为草稿。' },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: 'false', description: '独立的受控打开状态，未绑定时由内部管理。' },
  { name: 'layout', type: "'auto' | 'docked' | 'modal' | 'fullscreen'", default: "'auto'", description: 'Auto 在视口小于 600 CSS px 时使用 Fullscreen，宽屏使用 Docked；显式布局保留指定形态。' },
  { name: 'initialView', type: "'calendar' | 'input'", default: "'calendar'", description: 'Modal/Fullscreen 打开时使用的视图；Docked 始终显示日历。' },
  { name: 'locale', type: 'string', default: "'zh-CN'", description: '控制日期格式、月份/星期名称、输入顺序及默认周首日。使用公历和拉丁数字，不翻译操作与错误文案。' },
  { name: 'firstDayOfWeek', type: '0 | 1 | 2 | 3 | 4 | 5 | 6', default: '由 locale 决定', description: '覆盖周首日，0 为周日，6 为周六。' },
  { name: 'min', type: 'string', description: '含端点的最早 ISO 日期；无效或倒序上下限会阻止提交。' },
  { name: 'max', type: 'string', description: '含端点的最晚 ISO 日期。' },
  { name: 'disabledDate', type: '(date: string) => boolean', description: '接收 YYYY-MM-DD 的同步谓词，返回 true 表示不可选。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用输入、清除及打开，也遵循原生 fieldset 禁用。' },
  { name: 'readonly', type: 'boolean', default: 'false', description: '禁止编辑和打开，已接受的值仍可参与表单提交。' },
  { name: 'required', type: 'boolean', default: 'false', description: '通过可见原生输入及选择器校验要求有效日期。' },
  { name: 'clearable', type: 'boolean', default: 'false', description: '在字段中添加清除操作，请求 null；仍遵循必填校验。' },
  { name: 'label', type: 'string', default: 'labels.dateLabel', description: '可见字段标签及辅助技术读取的输入名称。' },
  { name: 'name', type: 'string', description: '已接受 ISO 日期的表单字段名，不会重复提交本地化显示文字。' },
  { name: 'placeholder', type: 'string', description: '字段与面板文本输入共用的可选占位提示。' },
  { name: 'supportingText', type: 'string', description: '输入框下方的辅助说明。省略后，只有传入 labels.formatHint 才会显示格式提示。' },
  { name: 'error', type: 'boolean', default: 'false', description: '外部字段错误状态，也参与原生字段有效性；不能替代面板日期限制或父级接受策略。' },
  { name: 'errorText', type: 'string', description: 'error 状态下由应用提供的错误说明。组件内部校验使用 labels 中对应的文案。' },
  { name: 'labels', type: 'Partial<MdvDatePickerLabels>', description: '由应用传入的可选文案，包括面板标题、操作文字、无障碍名称、提示和校验消息。' },
]
const pickerSlots: SlotTableItem[] = [
  { name: 'trigger', description: '替换字段内的日历按钮，不是整个输入区域。接收 { open, close, triggerProps }，将 triggerProps 绑定到真实按钮。' },
  { name: 'title', description: '替换现有标题元素内的面板标题。Docked 中视觉隐藏，但仍作为弹层名称。无参数。' },
]
</script>
# 日期选择器

用 `MdvDatePicker` 选择单个日期。模型为 `YYYY-MM-DD` 或 `null`，不包含时区。选择起止日期时，请用[日期范围选择器](./date-range-picker)。

## 基本用法

绑定 `v-model`，为字段设置标签，用日历按钮打开选择器。确认后提交草稿；选择器关闭时，按 Enter 或失焦可提交有效文本。

<DemoBlock>
  <DatePickerBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvDatePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'

const date = ref<MdvDateValue>('2026-11-19')
const message = ref('Open the calendar to edit a draft, then confirm or cancel.')
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
    <MdvDatePicker v-model="date" label="Appointment date" locale="en-US" :labels="labels" clearable @confirm="message = `Confirmed ${$event ?? '(none)'}.`" @cancel="message = `Draft discarded: ${$event.reason}.`" />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Committed: {{ date ?? '(none)' }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 布局与输入视图

将 `layout` 设为 `auto` 时，视口宽度小于 600px 使用全屏，否则停靠在输入框旁。也可以明确设置为 `modal` 或 `fullscreen`。

<DemoBlock>
  <DatePickerLayoutDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDatePicker, MdvSelect } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDatePickerLayout, MdvDateValue } from '@mdv-ui/mdv'

const date = ref<MdvDateValue>('2026-11-19')
const layout = ref<MdvDatePickerLayout>('auto')
const inputView = ref(false)
const layouts = ['auto', 'docked', 'modal', 'fullscreen'].map(value => ({ value, label: value }))
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
      <MdvSelect :model-value="layout" :options="layouts" label="Picker layout" @update:model-value="layout = $event as MdvDatePickerLayout" />
      <MdvCheckbox v-model="inputView" label="Start with text input" />
    </div>
    <MdvDatePicker v-model="date" :layout="layout" :initial-view="inputView ? 'input' : 'calendar'" label="Travel date" locale="en-US" :labels="labels" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Layout: {{ layout }} · Committed: {{ date ?? '(none)' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 日期限制

用 `min` 和 `max` 设置包含边界的日期范围，用 `disabled-date` 排除个别日期。值仍需提交但不允许编辑时，使用 `readonly`。

<DemoBlock>
  <DatePickerConstraintsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDatePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'

const date = ref<MdvDateValue>('2026-11-19')
const disabled = ref(false)
const readonly = ref(false)
const error = ref(false)
const unavailable = (value: string) => value === '2026-11-20'
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
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="disabled" label="Disabled" />
      <MdvCheckbox v-model="readonly" label="Read only" />
      <MdvCheckbox v-model="error" label="External error" />
    </div>
    <MdvDatePicker
      v-model="date"
      label="Available appointment"
      locale="en-US"
      :labels="labels"
      min="2026-11-01"
      max="2026-12-31"
      :disabled-date="unavailable"
      :disabled="disabled"
      :readonly="readonly"
      :error="error"
      error-text="This appointment needs approval."
      supporting-text="November–December 2026; November 20 is unavailable."
      clearable
    />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Committed: {{ date ?? '(none)' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 地区格式与界面文案

用 `locale` 设置日期格式，按需通过 `labels` 提供应用文案。省略 `cancel`、`confirm` 或 `save` 时，对应操作显示图标。没有对应错误文案时，组件仍会拒绝无效日期。未提供自定义必填提示时，原生必填消息由浏览器提供。

<DemoBlock>
  <DatePickerLocaleDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDatePicker, MdvSelect } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'

const date = ref<MdvDateValue>('2026-11-19')
const locale = ref('en-US')
const monday = ref(false)
const locales = ['en-US', 'en-GB', 'de-DE'].map(value => ({ value, label: value }))
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
      <MdvSelect :model-value="locale" :options="locales" label="Date locale" @update:model-value="locale = $event as string" />
      <MdvCheckbox v-model="monday" label="Always start weeks on Monday" />
    </div>
    <MdvDatePicker v-model="date" label="Meeting date" :locale="locale" :first-day-of-week="monday ? 1 : undefined" :labels="labels" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Locale: {{ locale }} · ISO model: {{ date ?? '(none)' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="日期选择器文案分组" min-width="32rem">

| 用途 | `MdvDatePickerLabels` 中的键 |
| --- | --- |
| 面板标题 | `title`、`rangeTitle`、`chooseDate`、`chooseRange` |
| 操作 | `open`、`calendar`、`input`、`cancel`、`confirm`、`save`、`clear` |
| 日历导航 | `previousMonth`、`nextMonth`、`previousYear`、`nextYear`、`month`、`year`、`previousYears`、`nextYears`、`earlierMonths`、`laterMonths` |
| 日期状态 | `today`、`selected`、`rangeStart`、`rangeEnd`、`inRange`、`unavailable` |
| 字段及提示 | `startLabel`、`endLabel`、`dateLabel`、`formatHint`、`keyboardHint` |
| 校验 | `invalidDate`、`required`、`incompleteRange`、`reversedRange`、`outOfBounds`、`disabledDate`、`blockedRange`、`invalidBounds` |

</DocsTable>

## 原生表单与校验

设置 `name` 后，表单会提交已确认的 ISO 日期。用 `required` 要求填写，用 `form` 关联外部表单。

<DemoBlock>
  <DatePickerFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { MdvButton, MdvCheckbox, MdvDatePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerExpose, MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'

const picker = useTemplateRef<MdvDatePickerExpose>('picker')
const date = ref<MdvDateValue>('2026-11-19')
const blocked = ref(false)
const result = ref('The form submits an ISO date, not its formatted display text.')
watch(blocked, value => picker.value?.setCustomValidity(value ? 'Resolve the booking conflict first.' : ''))

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ appointment: data.get('appointment') })
}

function reset() {
  blocked.value = false
  result.value = 'Form reset to its initial date.'
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
  <form class="grid gap-4" @submit.prevent="submit" @reset="reset">
    <MdvCheckbox v-model="blocked" label="Add a custom validation error" />
    <MdvDatePicker ref="picker" v-model="date" name="appointment" label="Required appointment" locale="en-US" :labels="labels" required clearable />
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
      <MdvButton variant="text" @click="result = picker?.reportValidity() ? 'Date is valid.' : 'Date needs attention.'">Check validity</MdvButton>
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

<ApiTable :items="pickerProps" />

### 插槽

<SlotsTable :items="pickerSlots" />

### 事件

<DocsTable label="日期选择器事件" min-width="34rem">

| 事件 | 参数及时机 |
| --- | --- |
| `update:modelValue` | `MdvDateValue`，请求接受日期或 `null`。 |
| `update:open` | `boolean`，请求打开或关闭。 |
| `confirm` | 面板确认后已接受的有效 `MdvDateValue`；字段编辑和清除不会发出。 |
| `cancel` | `{ reason }`，确认以外的实际关闭会放弃面板草稿，也包括外部模型/禁用状态变化。 |
| `open` / `opened` | 无参数，开始打开 / 打开动效完成。 |
| `close` / `closed` | `{ reason }`，开始关闭 / 动效及清理完成。 |

</DocsTable>

关闭原因有 `confirm`、`cancel`、`escape`、`scrim`、`outside`、`blur`、`model`、`programmatic` 和 `disabled`，实际使用取决于布局及关闭路径。布局迁移不会伪造取消/打开周期。

### 方法与原生属性

<DocsTable label="日期选择器暴露方法" min-width="32rem">

| 方法 | 返回值 | 用途 |
| --- | --- | --- |
| `open(event?)` / `close()` | `Promise<boolean>` | 表示父级是否接受，不等待最终动效事件；`close()` 原因为 `programmatic`。 |
| `focus(options?)` | `void` | 聚焦字段，不展开。 |
| `checkValidity()` / `reportValidity()` | `boolean` | 检查原生约束，报告时也显示校验反馈。 |
| `setCustomValidity(message)` | `void` | 设置原生自定义校验消息，使用 `''` 清空。 |

</DocsTable>

`class`/`style` 应用于外层，`dir`/`lang` 同时传给字段。其他原生属性及监听器应用到输入框，`form` 关联文本及隐藏模型字段。日期范围及模型值请使用选择器 props，不要覆盖托管输入的 `type`、`value` 或显示字段名。

### 公开类型

```ts
import type {
  MdvDateValue,
  MdvDatePickerProps,
  MdvDatePickerCommonProps,
  MdvDatePickerLayout,
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
