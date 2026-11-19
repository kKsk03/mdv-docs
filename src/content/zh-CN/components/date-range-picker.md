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
import DateRangePickerControlledDemo from '@/components/docs/demos/dateRangePicker/controlled.vue'

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
  { name: 'supportingText', type: 'string', default: '本地化日期格式提示', description: '两个字段共用的辅助说明，空值回退为日期格式提示。' },
  { name: 'error', type: 'boolean', default: 'false', description: '外部字段错误状态，也参与原生校验。面板限制请使用日期约束或父级接受逻辑。' },
  { name: 'errorText', type: 'string', description: '外部错误说明，省略时回退为 labels.invalidDate。' },
  { name: 'labels', type: 'Partial<MdvDatePickerLabels>', default: '中文文案', description: '与 DatePicker 共用的操作名称、面板标题、日期说明、提示和错误消息。' },
]
const rangeSlots: SlotTableItem[] = [
  { name: 'trigger', description: '替换结束字段内的日历按钮，接收 { open, close, triggerProps }；将提供的 props 绑定到原生按钮。' },
  { name: 'title', description: '替换面板标题并保留现有标题及可访问命名，无参数。' },
]
</script>

# 日期范围选择器

`MdvDateRangePicker` 选择一组完整的公历日期，通过两个文本字段及 Modal/Fullscreen 日历处理预订、报表周期等区间。只需要一个日期时使用[日期选择器](./date-picker)。

## 基本用法

模型为 `{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' } | null`，包含两个端点，允许同日范围，不会提交半个范围。日期不包含时间或时区，支持 `0001`–`9999` 年。

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

### 选择两个端点

通过结束字段的日历按钮打开面板，先选择开始，再选择结束。保存只提交有效且被父级接受的完整日期对。第二个端点早于开始时会重新开始选择，不会交换日期；已有完整草稿后再次选择也会开始新范围。

确认前，已接受的模型保持不变。取消、Escape、遮罩或外部关闭会放弃面板草稿；字段清除为整个范围请求 `null`。聚焦字段不会自动打开面板。

---

## 模态与全屏布局

`auto` 在视口宽度小于 600px 时使用全屏，其余使用 Modal。范围选择不支持 `docked`，需要固定形态时请从支持的布局中选择。

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

范围日历纵向滚动月份，保留固定星期行及关闭/保存操作。更早/更晚月份控制可继续浏览，无需一次性渲染所有支持年份。输入视图使用两个字段，空间不足时自动换行。

变换布局或视图会保留草稿及日历浏览状态，不隐式提交。`initial-view` 在打开时生效，当前视图通过面板切换操作改变；外部模型变化则将草稿同步为新接受的范围。

## 限制作用于整个区间

通过 ISO `min`/`max` 设置含端点限制，通过同步 `disabled-date` 禁用日期。即便两个端点都可用，中间存在禁用日期时整个范围仍然无效。

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

可以尝试 11 月 19–23 日，11 月 20 日会阻止该范围；11 月 19–19 日则有效。文本输入也不能绕过限制。无效或倒序上下限会阻止提交，动态修改约束会重校验当前值和草稿，但不会自动改写模型。

谓词需要快速、无副作用。长范围可能逐日调用，遇到首个禁用日停止；没有谓词时只需检查端点和上下限。禁用/只读状态会阻止编辑与打开并释放已有弹层，只读的已接受值仍可提交。

---

## 文本输入与校验

面板关闭时，Enter 或离开字段对会校验完整范围。从开始移到结束时允许继续填写尚未完成的日期对。无效文字保留供修正；倒序的文本范围会报错，不自动交换。

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

示例采用 `en-GB`，可输入 `19/11/2026` 与 `23/11/2026`，也可使用明确的 ISO 日期。地区顺序支持斜杠、短横线、点或空格分隔，月日可用一位数字。无分隔文本必须为八位数字，不猜测两位年份，IME 组合输入的 Enter 不提交。

不完整或无效的面板草稿不能保存。日历视图提供辅助技术可读的校验状态，输入视图同时显示错误文字。切换视图会保留尚未解决的原文，便于修正。

### 地区格式与文案

`locale` 改变日期显示、输入顺序、月份/星期名称及默认周首日，模型始终保持 ISO。`first-day-of-week` 可以显式覆盖周首日，范围为周日 `0` 到周六 `6`。

操作及错误文案独立于 locale，默认使用中文，应通过 `labels` 配置应用语言。示例均提供完整英文对象，全部键可参阅[日期选择器的文案分组](./date-picker#地区格式与界面文案)。范围相关的标题和说明包括 `rangeTitle`、`chooseRange`、`rangeStart`、`rangeEnd`、`inRange`、`incompleteRange`、`reversedRange` 和 `blockedRange`。

## 受控范围接受

父级决定是否接受请求的范围。拒绝后已接受模型保持不变，不发出 `confirm`，也不会自动关闭面板。

<DemoBlock>
  <DateRangePickerControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvDateRangePicker } from '@mdv-ui/mdv'
import type { MdvDatePickerLabels, MdvDateRangeValue } from '@mdv-ui/mdv'

const range = ref<MdvDateRangeValue>({ start: '2026-11-19', end: '2026-11-23' })
const reject = ref(true)
const confirmations = ref(0)
const request = ref('No range request yet.')

function update(value: MdvDateRangeValue) {
  request.value = `${JSON.stringify(value)}: ${reject.value ? 'rejected' : 'accepted'}.`
  if (!reject.value) range.value = value
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
  <div class="grid gap-4">
    <MdvCheckbox v-model="reject" label="Reject range updates" />
    <MdvDateRangePicker :model-value="range" start-label="Controlled start" end-label="Controlled end" locale="en-US" :labels="labels" @update:model-value="update" @confirm="confirmations++" />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Committed: {{ JSON.stringify(range) }} · Confirmations: {{ confirmations }} · {{ request }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

先在拒绝更新时修改并保存草稿，再取消、关闭拒绝开关并重新打开以接受新范围。有效且未改变的范围仍可确认，因为它已经与父级模型一致。`v-model:open` 可单独控制打开状态，拒绝关闭时应保留可用的退出路径。

---

## 原生表单提交与重置

通过 `start-name`、`end-name` 分别提交两个 ISO 字段。可见的本地化文本与面板草稿不会重复提交，同时支持原生 `required`、fieldset 禁用、重置及外部 `form` 关联。

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

禁用 fieldset 后，其字段会从 FormData 中省略；只读字段仍提交已接受值。可选范围清空后，以配置的字段名提交空字符串。Reset 请求恢复初始日期对、清除编辑/自定义校验反馈，也尊重取消 reset 或父级拒绝更新。

提交前使用 Enter 或失焦完成文本编辑，Enter 会被处理为字段提交，不会自动提交表单。额外业务约束可使用 `checkValidity()`、`reportValidity()` 和 `setCustomValidity(message)`；错误解决后使用 `''` 清空自定义消息。

## 无障碍、主题与动效

- 两个字段都应提供清晰标签，不能只靠占位符识别范围。`start-label` 与 `end-label` 同时命名面板内的输入。
- 日历只有一个 Tab 停点。方向键按日/周移动，Home/End 在本周内定位，PageUp/PageDown 翻月，配合 Shift 翻年；RTL 水平方向反转，不可选日期仍可通过网格导航读取。
- Space 或 Enter 选择端点，Enter 不会自动确认完整范围，应使用保存。Modal/Fullscreen 将焦点约束在原生 dialog 中，并与其他 MDV 浮层协调。
- Escape 和明确退出操作恢复打开入口；模型/禁用状态导致关闭时尊重应用焦点决策。弹层保留原 DOM 的局部主题继承，端点使用 `primary`，中段使用 `secondary-container`。
- 弹层遵循减少动态效果设置，响应式迁移时保留草稿，退出动画后完成清理。服务端保持关闭态，挂载/hydration 后再建立打开状态；真实触屏键盘及辅助技术组合需另行验证。

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
