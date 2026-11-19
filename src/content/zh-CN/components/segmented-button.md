<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BasicDemo from '@/components/docs/demos/segmentedButton/basic.vue'
import SelectionDemo from '@/components/docs/demos/segmentedButton/selection.vue'
import AppearanceDemo from '@/components/docs/demos/segmentedButton/appearance.vue'
import IconsDemo from '@/components/docs/demos/segmentedButton/icons.vue'
import ControlledDemo from '@/components/docs/demos/segmentedButton/controlled.vue'
import FormDemo from '@/components/docs/demos/segmentedButton/form.vue'

const groupProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvSegmentedButtonModelValue', default: 'null', description: '单选使用字符串、数字或 null，多选使用数组。需要首屏选中时，请初始化模型。' },
  { name: 'selection', type: "'single' | 'multiple'", default: "'single'", description: '采用原生 radio 或 checkbox 语义。切换模式时，应用也需提供对应形状的模型。' },
  { name: 'selectionRequired', type: 'boolean', default: 'single: true; multiple: false', description: '阻止用户取消最后一个选中值；不会自动选择、修正外部模型或添加原生 required 校验。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用全部分段；原生祖先 fieldset 的 disabled 同样生效。' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: '各分段等宽填满可用区域，溢出内容保留在组内滚动。' },
  { name: 'density', type: '0 | -1 | -2 | -3', default: '0', description: '可见表面高度依次为 40、36、32、28px；实际交互区域仍至少为 48px 高。' },
  { name: 'showSelectedIcon', type: 'boolean', default: 'true', description: '显示内置勾或 selected-icon 插槽；关闭后移除选中图标区域。' },
  { name: 'name', type: 'string', description: '所有原生输入共用的字段名，多选提交多个同名记录。不提供时不生成提交字段。' },
  { name: 'form', type: 'string', description: '外部原生表单的 ID，由组内全部分段继承。' },
]
const itemProps: ApiTableItem[] = [
  { name: 'value', type: 'string | number', default: '必填', description: '组内唯一值，使用 Object.is 比较，数字 1 与字符串 1 不同。' },
  { name: 'label', type: 'string', default: "''", description: '可见标签，默认插槽优先。纯图标项必须提供无障碍名称。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用这一项，不能覆盖组或原生 fieldset 的禁用状态。' },
]
const groupSlots: SlotTableItem[] = [{ name: 'default', description: 'MdvSegmentedButtonItem 子项，无参数。将分段放在一起，避免插入无关 DOM 同级节点。' }]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: '替换 label，接收 { selected: boolean }。' },
  { name: 'leading', description: '装饰性前置图标，接收 { selected: boolean }。纯图标项需另行提供无障碍名称。' },
  { name: 'selected-icon', description: '替换内置勾，接收 { selected: boolean }。showSelectedIcon 为 false 时隐藏。' },
]
</script>

# 分段按钮

`MdvSegmentedButton` 使用传统 Material Design 3 分段样式呈现少量相关选项，`MdvSegmentedButtonItem` 表示其中一项。本文对应 **MDV 0.1.5**。Expressive 的连接按钮样式请参阅[按钮组](./button-group)。

## 单选与多选

模型绑定在组上，每项提供唯一的字符串或数字 `value`。单选替换当前值，多选产生新数组；子项没有独立模型。建议每组使用 2～5 个简短相关选项，更长的列表适合 Select 或 Autocomplete。

<DemoBlock>
  <BasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const period = ref<MdvSegmentedButtonModelValue>('week')
const details = ref<MdvSegmentedButtonModelValue>(['summary'])
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSegmentedButton v-model="period" aria-label="Report period">
      <MdvSegmentedButtonItem value="day" label="Day" />
      <MdvSegmentedButtonItem value="week" label="Week" />
      <MdvSegmentedButtonItem value="month" label="Month" />
    </MdvSegmentedButton>
    <MdvSegmentedButton v-model="details" selection="multiple" aria-label="Report details">
      <MdvSegmentedButtonItem value="summary" label="Summary" />
      <MdvSegmentedButtonItem value="images" label="Images" />
      <MdvSegmentedButtonItem value="dates" label="Dates" />
    </MdvSegmentedButton>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Period: {{ period }} · Details: {{ JSON.stringify(details) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 允许清空与值类型

单选默认 `selectionRequired=true`。设置为 `false` 后，再次激活已选项会清空为 `null`。多选默认允许空数组，添加 `selection-required` 可以阻止移除最后一个选中值。

这只是交互约束，不等于 HTML `required`。即使要求选择，外部空模型也会保持为空。切换选择模式、删除选项和清理失效值由应用负责；模型中的数字和对应字符串严格区分。

<DemoBlock>
  <SelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const optional = ref<MdvSegmentedButtonModelValue>(null)
const required = ref<MdvSegmentedButtonModelValue>(['email'])
const typed = ref<MdvSegmentedButtonModelValue>(1)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="grid gap-1">
      <p class="text-sm text-mdv-on-surface-variant">Optional single selection: activate again to clear.</p>
      <MdvSegmentedButton v-model="optional" :selection-required="false" aria-label="Optional alignment">
        <MdvSegmentedButtonItem value="left" label="Left" />
        <MdvSegmentedButtonItem value="center" label="Center" />
        <MdvSegmentedButtonItem value="right" label="Right" />
      </MdvSegmentedButton>
    </div>
    <div class="grid gap-1">
      <p class="text-sm text-mdv-on-surface-variant">Keep at least one channel selected.</p>
      <MdvSegmentedButton v-model="required" selection="multiple" selection-required aria-label="Notification channels">
        <MdvSegmentedButtonItem value="email" label="Email" />
        <MdvSegmentedButtonItem value="push" label="Push" />
        <MdvSegmentedButtonItem value="sms" label="SMS" disabled />
      </MdvSegmentedButton>
    </div>
    <MdvSegmentedButton v-model="typed" aria-label="Strict value types">
      <MdvSegmentedButtonItem :value="1" label="Number 1" />
      <MdvSegmentedButtonItem value="1" label="String 1" />
    </MdvSegmentedButton>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Optional: {{ JSON.stringify(optional) }} · Channels: {{ JSON.stringify(required) }} · Typed: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 密度、全宽与溢出

密度只改变可见表面，仍保留完整交互区域。`full-width` 使各项等宽填满容器。长标签保持单行，在组内滚动，不会被挤成多行；外层布局应允许收缩，例如设置 `min-width: 0`。

颜色跟随 MDV 主题：选中项使用 `secondary-container` 和 `on-secondary-container`，描边使用 `outline`。组件没有 `color`、`variant`、`size` 或垂直方向属性。局部主题、RTL、减少动态效果和强制颜色样式由 MDV 提供。

<DemoBlock>
  <AppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonDensity, MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const densities: MdvSegmentedButtonDensity[] = [0, -1, -2, -3]
const value = ref<MdvSegmentedButtonModelValue>('week')
const disabled = ref(false)
const dark = ref(false)
const rtl = ref(false)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="disabled" label="Disable all segments" />
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="grid min-w-0 gap-4 rounded-xl bg-mdv-surface p-4 text-mdv-on-surface">
      <div v-for="density in densities" :key="density" class="grid min-w-0 gap-1">
        <p class="text-sm">Density {{ density }} · Surface {{ 40 + density * 4 }}px</p>
        <MdvSegmentedButton v-model="value" :density="density" :disabled="disabled" :aria-label="`Period at density ${density}`" full-width>
          <MdvSegmentedButtonItem value="day" label="Day" />
          <MdvSegmentedButtonItem value="week" label="Week" />
          <MdvSegmentedButtonItem value="month" label="Month" />
        </MdvSegmentedButton>
      </div>
      <div class="w-full max-w-[240px] min-w-0">
        <MdvSegmentedButton :disabled="disabled" aria-label="Scrollable long labels" full-width>
          <MdvSegmentedButtonItem value="workspace" label="Shared workspace" />
          <MdvSegmentedButtonItem value="library" label="Personal library" />
          <MdvSegmentedButtonItem value="archive" label="Archived projects" />
        </MdvSegmentedButton>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 前置与选中图标

纯文字项选中后显示勾；图文项的勾在同一区域替换前置图标；纯图标项保留原图标，并在旁边增加勾。插槽接收 `selected`，可以按状态调整内容。

自定义图标使用单图标数据导入，内置勾无需使用方安装图标数据包。纯图标项通过 `aria-label` 或 `aria-labelledby` 命名。整个分段是原生输入的标签，插槽中不要放嵌套交互控件。

<DemoBlock>
  <IconsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'
import listIcon from '@iconify-icons/material-symbols/view-list-outline'
import gridIcon from '@iconify-icons/material-symbols/grid-view-outline'
import doneIcon from '@iconify-icons/material-symbols/done-all'

const view = ref<MdvSegmentedButtonModelValue>('list')
const compact = ref<MdvSegmentedButtonModelValue>('grid')
const showSelectedIcon = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvCheckbox v-model="showSelectedIcon" label="Show selected icons" />
    <MdvSegmentedButton v-model="view" :show-selected-icon="showSelectedIcon" aria-label="Content view">
      <MdvSegmentedButtonItem value="list" label="List">
        <template #leading><MdvIcon :icon="listIcon" /></template>
        <template #selected-icon><MdvIcon :icon="doneIcon" /></template>
      </MdvSegmentedButtonItem>
      <MdvSegmentedButtonItem value="grid">
        <template #default="{ selected }">{{ selected ? 'Grid view' : 'Grid' }}</template>
        <template #leading><MdvIcon :icon="gridIcon" /></template>
      </MdvSegmentedButtonItem>
    </MdvSegmentedButton>
    <MdvSegmentedButton v-model="compact" :show-selected-icon="showSelectedIcon" aria-label="Icon-only content view">
      <MdvSegmentedButtonItem value="list" aria-label="List view"><template #leading><MdvIcon :icon="listIcon" /></template></MdvSegmentedButtonItem>
      <MdvSegmentedButtonItem value="grid" aria-label="Grid view"><template #leading><MdvIcon :icon="gridIcon" /></template></MdvSegmentedButtonItem>
    </MdvSegmentedButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## 受控请求与取消

`update:modelValue` 请求更新，由父级决定是否接受。拒绝更新后，原生 checked 会恢复为已接受的模型。程序修改模型不会伪造原生 input/change。`click.prevent` 可取消激活，下面的 Cancelled 项演示这一点。

<DemoBlock>
  <ControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const value = ref<MdvSegmentedButtonModelValue>('draft')
const requested = ref<MdvSegmentedButtonModelValue>(null)
const accept = ref(false)
function update(next: MdvSegmentedButtonModelValue) {
  requested.value = next
  if (accept.value) value.value = next
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvCheckbox v-model="accept" label="Accept selection requests" />
    <MdvSegmentedButton :model-value="value" aria-label="Controlled publication state" @update:model-value="update">
      <MdvSegmentedButtonItem value="draft" label="Draft" />
      <MdvSegmentedButtonItem value="published" label="Published" />
      <MdvSegmentedButtonItem value="blocked" label="Cancelled" @click.prevent />
    </MdvSegmentedButton>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Accepted: {{ value }} · Requested: {{ requested ?? 'none' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 原生表单与重置

组把 `name`、`form` 传给实际的 radio/checkbox 输入。FormData 仅包含已选且可提交的输入，并将值序列化为字符串。多选提交同名多条记录，应用模型仍保留数字或字符串类型；省略 `name` 时不会生成内部字段名。

原生 reset 恢复组件创建时的模型快照，多选数组使用独立副本。reset 不派发 input/change，取消 reset 事件会保留当前选择。`selectionRequired` 不会让空组原生校验失败，提交校验应由应用明确实现。

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const formId = `segmented-export-${useId()}`
const group = useTemplateRef<InstanceType<typeof MdvSegmentedButton>>('group')
const period = ref<MdvSegmentedButtonModelValue>('week')
const formats = ref<MdvSegmentedButtonModelValue>(['pdf'])
const disabled = ref(false)
const submitted = ref('Not submitted.')
function submit(event: Event) {
  submitted.value = JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvCheckbox v-model="disabled" label="Disable export fields" />
    <fieldset :disabled="disabled" class="grid min-w-0 gap-3">
      <legend class="mb-2 text-sm">Export options</legend>
      <MdvSegmentedButton ref="group" v-model="period" :form="formId" name="period" aria-label="Export period">
        <MdvSegmentedButtonItem value="week" label="Week" />
        <MdvSegmentedButtonItem value="month" label="Month" />
      </MdvSegmentedButton>
      <MdvSegmentedButton v-model="formats" :form="formId" selection="multiple" name="format" aria-label="Export formats">
        <MdvSegmentedButtonItem value="pdf" label="PDF" />
        <MdvSegmentedButtonItem value="html" label="HTML" />
        <MdvSegmentedButtonItem value="csv" label="CSV" disabled />
      </MdvSegmentedButton>
    </fieldset>
    <form :id="formId" class="flex flex-wrap gap-2" @submit.prevent="submit" @reset="submitted = 'Reset to the initial values.'">
      <MdvButton type="submit">Submit export</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset export</MdvButton>
      <MdvButton variant="text" @click="group?.focus()">Focus period</MdvButton>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Period: {{ period }} · Formats: {{ JSON.stringify(formats) }} · {{ submitted }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 无障碍与键盘交互

单选使用 `role="radiogroup"` 和原生 radio，多选使用 `role="group"` 和原生 checkbox。请提供组名称。MDV 的 Tab 规则会逐项访问组内分段。

<DocsTable label="分段按钮键盘交互">

| 按键 | 行为 |
| --- | --- |
| Tab / Shift+Tab | 初次进入第一个可用项，之后按 DOM 顺序移动；到边界时正常离开，不改变选择。 |
| 右 / 左方向键 | 循环移动焦点，RTL 时方向反转；单选同时选中，多选只移动焦点。 |
| 下 / 上方向键 | 向后或向前移动，选择规则相同。 |
| Home / End | 聚焦第一个或最后一个可用项，单选同时选中。 |
| Space / Enter | 激活当前项，遵循禁用与至少保留一项的规则。 |

</DocsTable>

导航跳过禁用、hidden 和 inert 项，并将目标滚入视野。移除聚焦项后优先聚焦下一项，其次是前一项；应用已转移的焦点会被尊重。实际触摸、读屏和最终布局中的焦点环裁切需要在浏览器中检查。

## API

### MdvSegmentedButton

<ApiTable :items="groupProps" />

<SlotsTable :items="groupSlots" />

原生属性、监听、`class` 和 `style` 作用于组根节点，组角色和 Tab 行为由组件管理。它用于选择，不应在其中放普通操作按钮。

### MdvSegmentedButtonItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

子项需要 SegmentedButton 父级。`class`、`style`、`dir`、`lang`、`hidden` 作用于外层 label；`id`、ARIA、`data-*`、click、input、change、键盘及焦点等其他原生属性和监听作用于 input。组管理 `name`、`form`、类型、checked、value 和 tab index，请勿在子项覆盖。

### 事件与方法

组发出 `update:modelValue(value: MdvSegmentedButtonModelValue)`，没有自定义 select 事件。原生 input/change 来自实际子项激活；允许清空的单选取消已选项时，组件补全一次 input/change。

两者都公开 `focus(options?: FocusOptions)` 和 `blur()`。组 focus 进入当前可用焦点入口，组 blur 仅影响组内焦点；子项方法只操作自身输入。组件不会发起表单提交，也没有公开原生校验辅助方法。

### 公共类型

```ts
import type {
  MdvSegmentedButtonValue,      // string | number
  MdvSegmentedButtonModelValue, // value | value[] | null
  MdvSegmentedButtonSelection,  // 'single' | 'multiple'
  MdvSegmentedButtonDensity,    // 0 | -1 | -2 | -3
} from '@mdv-ui/mdv'
```

MDV 0.1.5 没有单独导出 SegmentedButton/Item 的 props 接口。模板 ref 可使用 `InstanceType<typeof MdvSegmentedButton>` 或对应 Item 组件类型。
