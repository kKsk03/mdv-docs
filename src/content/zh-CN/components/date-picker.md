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
import DatePickerControlledDemo from '@/components/docs/demos/datePicker/controlled.vue'

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
  { name: 'supportingText', type: 'string', default: '本地化日期格式提示', description: '字段下方的辅助说明；空值回退为日期格式提示。' },
  { name: 'error', type: 'boolean', default: 'false', description: '外部字段错误状态，也参与原生字段有效性；不能替代面板日期限制或父级接受策略。' },
  { name: 'errorText', type: 'string', description: '外部错误说明；存在错误但未提供文字时使用 labels.invalidDate。' },
  { name: 'labels', type: 'Partial<MdvDatePickerLabels>', default: '中文文案', description: '覆盖操作名称、面板标题、日期状态、键盘提示及校验消息。' },
]
const pickerSlots: SlotTableItem[] = [
  { name: 'trigger', description: '替换字段内的日历按钮，不是整个输入区域。接收 { open, close, triggerProps }，将 triggerProps 绑定到真实按钮。' },
  { name: 'title', description: '替换现有标题元素内的面板标题。Docked 中视觉隐藏，但仍作为弹层名称。无参数。' },
]
</script>

# 日期选择器

`MdvDatePicker` 通过文本字段及 Docked、Modal 或 Fullscreen 日历选择一个公历日期。模型为 `YYYY-MM-DD` 纯日期字符串或 `null`，不包含时间和时区。需要两个端点时使用[日期范围选择器](./date-range-picker)。

## 基本用法

绑定 `v-model`、提供字段标签，通过独立的日历图标按钮打开面板。聚焦或编辑字段不会自动展开。两种语言的文章共用英文演示。

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

### 草稿与已接受的值

日历选择先修改草稿。确认会写入有效且被父级接受的值，并请求关闭；取消、Escape、外部交互或外部关闭会放弃面板草稿。字段清除操作直接请求 `null`。

面板关闭时，Enter 或离开文本字段会单独校验并提交文字。这类字段修改不会发出面板的 `confirm` 事件。无效原文会保留供用户修正，不会替换已接受的模型。

日期支持 `0001`–`9999` 年。业务数据中应保留纯日期含义，转换为本地时间戳可能在不同时区改变日期语义。

---

## 布局与输入视图

使用 `auto` 适配视口，或指定明确布局。修改初始视图后重新打开，体验日历与文本输入。

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

<DocsTable label="单日选择器布局" min-width="30rem">

| 布局 | 行为 |
| --- | --- |
| `auto` | 视口宽度小于 600px 时全屏，其余使用 Docked。 |
| `docked` | 非模态 Popover，位于字段下方 4px，按逻辑起始侧对齐，始终显示日历。 |
| `modal` | 居中模态，可切换日历/输入，使用取消/确定操作。 |
| `fullscreen` | 填满视口的模态，使用关闭/保存操作。 |

</DocsTable>

Docked 面板固定宽度为 360px，随滚动跟随锚点，并有意不在视口边缘翻转、移位或压缩。显式 Docked 可能超出窄视口，应按场景使用 `auto` 或全屏。Auto 判断的是视口宽度，而非字段所在容器宽度。

Modal/Fullscreen 提供视图切换按钮。打开期间变换布局会保留草稿及浏览状态，不会隐式确认；外部模型变化则会将草稿同步为新接受的值。

## 日期限制与字段状态

使用 ISO `min`/`max` 设置含端点的限制，使用快速、无副作用的 `disabled-date` 同步谓词禁用日期。动态修改限制会重校验当前值和草稿，不会擅自重写模型。

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

无效上下限会阻止提交。禁用及只读字段不能编辑、清除或打开，切换到这些状态时也会释放已打开的弹层。只读值仍可提交。`error`/`error-text` 表示外部字段错误；需要限制面板确认时，应使用真实日期约束或父级接受逻辑。

日历校验反馈可供辅助技术读取，文本输入视图也会显示错误文字。不可选日期仍可通过键盘导航读取，但不能选中。

---

## 地区格式与界面文案

`locale` 控制日期格式、月份/星期名称、字段输入顺序及默认周首日，不会翻译界面。操作、错误和无障碍说明需要通过 `labels` 设置，省略的键保留 MDV 的中文默认值。

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

地区格式只影响显示，模型始终为 ISO。选择器使用公历与拉丁数字。文本支持明确的 ISO 日期，以及地区顺序的斜杠、短横线、点或空格分隔日期，月日可用一位数字。无分隔输入必须为地区顺序的八位数字，不猜测两位年份、不逐字插入分隔符，IME 组合输入期间 Enter 不提交。

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

## 受控状态与自定义入口

日期模型和 `v-model:open` 相互独立，父级可以拒绝日期更新或打开/关闭请求。日期请求被拒绝时面板保持打开，且不发出 `confirm`。关闭是另一次请求，因此接受日期不代表强制接受关闭。

<DemoBlock>
  <DatePickerControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvDatePicker, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvDatePickerExpose, MdvDatePickerLabels, MdvDateValue } from '@mdv-ui/mdv'
import calendar from '@iconify-icons/material-symbols/calendar-month-outline'

const picker = useTemplateRef<MdvDatePickerExpose>('picker')
const date = ref<MdvDateValue>('2026-11-19')
const open = ref(false)
const rejectDate = ref(true)
const rejectClose = ref(false)
const result = ref('Date requests are rejected until you unlock them.')

function updateDate(value: MdvDateValue) {
  result.value = `Date ${value ?? '(none)'}: ${rejectDate.value ? 'rejected' : 'accepted'}.`
  if (!rejectDate.value) date.value = value
}

function updateOpen(value: boolean) {
  if (value || !rejectClose.value) open.value = value
  else {
    rejectClose.value = false
    result.value = 'Closing was rejected once. Try closing again.'
  }
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
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="rejectDate" label="Reject date updates" />
      <MdvCheckbox v-model="rejectClose" label="Reject the next closing request" />
    </div>
    <MdvDatePicker ref="picker" :model-value="date" :open="open" label="Studio booking" locale="en-US" :labels="labels" @update:model-value="updateDate" @update:open="updateOpen">
      <template #trigger="{ triggerProps }"><MdvIconButton v-bind="triggerProps"><MdvIcon :icon="calendar" /></MdvIconButton></template>
      <template #title>Book a studio</template>
    </MdvDatePicker>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="picker?.open()">Open picker</MdvButton>
      <MdvButton variant="outlined" @click="picker?.close()">Request close</MdvButton>
      <MdvButton variant="text" @click="picker?.focus()">Focus field</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Committed: {{ date }} · Open: {{ open }} · {{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

示例可以只拒绝下一次关闭，之后允许重试。设计受控模态时需保留可用退出路径。自定义入口将 `triggerProps` 绑定到 MDV 图标按钮，保留原生按钮类型、名称、展开状态、目标、禁用及点击处理。`focus()` 只聚焦字段，不展开面板。

---

## 原生表单与校验

使用 `name` 提交已接受的 ISO 日期。`required`、重置、fieldset 禁用及外部 `form` 关联遵循原生行为，也可通过暴露的校验方法设置业务规则。

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

FormData 包含隐藏的已接受值，不包含本地化显示文字。可选日期为空时，以配置的字段名提交空字符串。面板草稿输入不参与外部表单。提交前通过 Enter 或失焦完成文本编辑；Enter 用于提交字段，不会自动提交整个表单。

Reset 请求恢复初始模型、清除自定义有效性及编辑反馈，仍受父级接受状态约束。被取消的原生 reset 会得到尊重。使用 `setCustomValidity()` 后，需要在业务错误解决时清空消息。

## 键盘、焦点与动效

- 日期网格只有一个 Tab 停点。方向键按日/周移动，Home/End 到本周首末，PageUp/PageDown 翻月，配合 Shift 翻年；RTL 中水平方向会反转。
- Space 选择草稿，单日 Enter 选择并确认。Shift+M/Shift+Y 聚焦月份/年份入口，Modal 单日中聚焦合并的月年入口。
- Docked 为非模态 Popover；Modal/Fullscreen 使用原生 dialog，约束 Tab 焦点并与其他 MDV 浮层协调。Escape 返回打开入口，外部点击/失焦保留用户的新目标。
- 弹层保留在原 DOM 中并继承局部主题，需要现代浏览器的 dialog/Popover API，不会 Teleport 到 body。服务端输出关闭态，挂载/hydration 后再建立打开状态。
- 各布局的动效遵循减少动态效果设置并支持快速反向。退出动效及资源释放完成后才结束关闭生命周期；触屏键盘及读屏组合仍需应用和设备验证。

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
