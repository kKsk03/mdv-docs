<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BasicDemo from '@/components/docs/demos/segmentedButton/basic.vue'
import AppearanceDemo from '@/components/docs/demos/segmentedButton/appearance.vue'
import IconsDemo from '@/components/docs/demos/segmentedButton/icons.vue'
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

用 `MdvSegmentedButton` 展示少量相关选项，每项使用一个 `MdvSegmentedButtonItem`。需要 Expressive 的连接式样式时，请参阅[按钮组](./button-group)。

## 选择选项

单选模式绑定单个值，多选模式（`selection="multiple"`）绑定数组。为每项提供不同的 `value`。如果单选时允许取消已选项，设置 `:selection-required="false"`。

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

## 密度与宽度

用 `density` 调整高度，用 `full-width` 填满容器。选项标签宜简短；空间不足时可以换用其他控件。

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

## 图标

通过 `leading` 和 `selected-icon` 插槽自定义选项图标。只有图标的选项需要单独提供无障碍名称。

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

## 表单与重置

设置 `name` 后，表单会提交选中的值；多选会以同名字段提交多条值。用 `form` 关联外部表单，原生重置会恢复初始选择。

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

---

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

模板 ref 可用 `InstanceType<typeof MdvSegmentedButton>` 或相应的条目组件类型。
