<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ChipVariantDemo from '@/components/docs/demos/chip/variant.vue'
import ChipSelectionDemo from '@/components/docs/demos/chip/selection.vue'
import ChipIndependentDemo from '@/components/docs/demos/chip/independent.vue'
import ChipRemovalDemo from '@/components/docs/demos/chip/removal.vue'
import ChipAppearanceDemo from '@/components/docs/demos/chip/appearance.vue'
import ChipLayoutDemo from '@/components/docs/demos/chip/layout.vue'

const chipProps: ApiTableItem[] = [
  { name: 'variant', type: "'assist' | 'filter' | 'input' | 'suggestion'", default: "'assist'", description: '纸片用途。Filter 默认可选择；Input 表示已输入内容，默认可删除。' },
  { name: 'label', type: 'string', default: "''", description: '默认可见文字及删除名称来源；默认插槽优先显示。' },
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Assist、Filter、Suggestion 的抬升外观，Input 忽略。' },
  { name: 'color', type: 'MdvChipColor', description: 'primary、secondary、tertiary、success、warning、error、info，或 #RGB/#RRGGBB 种子色；省略时保留默认变体颜色角色。' },
  { name: 'value', type: 'string | number', description: 'ChipSet 单选/多选模式中 Filter 的唯一选值。' },
  { name: 'selected', attribute: 'v-model:selected', type: 'boolean', default: '省略时内部 false', description: 'Filter/Input 选中状态；传入后受控。由 ChipSet 接管 Filter 选择时应省略。' },
  { name: 'selectable', type: 'boolean', default: 'filter: true; input: false', description: '允许主操作切换 Filter/Input 选择。Assist/Suggestion 不参与选择，removeOnly 会关闭选择。' },
  { name: 'removable', type: 'boolean', default: 'input: true; filter: false', description: '开启 Filter/Input 删除；Assist/Suggestion 没有删除操作。' },
  { name: 'removeOnly', type: 'boolean', default: 'false', description: '可删除 Input 整颗只作为一个删除操作和焦点目标，不再提供独立主操作及选中状态。' },
  { name: 'removeLabel', type: 'string', default: "''（自动生成中文删除名称）", description: '显式删除可访问名称；默认是“删除”加标签/文字，或“删除此项”，应按应用语言本地化。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用主操作与删除；ChipSet 的禁用也会生效。' },
  { name: 'href', type: 'string', description: '仅 Assist/Suggestion 支持的原生链接；Filter/Input 忽略并在开发环境提示。' },
]
const setProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvChipSetModelValue', default: 'null', description: '已接受选值：单选为单值/null，多选为数组。未绑定模型时内部管理更新。' },
  { name: 'selection', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'None 只负责布局和焦点；单选/多选接管具有唯一 value 的可选择 Filter。' },
  { name: 'label', type: 'string', default: "''", description: '可见组标签和可访问名称来源；label 插槽替代其文字。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用所有子纸片操作。' },
  { name: 'scrollable', type: 'boolean', default: 'false', description: '使用单行水平滚动替代自动换行；键盘导航时显露目标。' },
]
const chipSlots: SlotTableItem[] = [
  { name: 'default', description: '自定义标签，接收 { selected }。复杂内容需准确的 label/removeLabel，以保证删除名称。' },
  { name: 'leading', description: '前置装饰图标，接收 { selected }；Filter 选中时替换为内置勾选符号。' },
  { name: 'avatar', description: '仅 Input 的 24px 圆形内容，优先于 leading；接收 { selected }。' },
  { name: 'trailing', description: '可删除 Filter/Input 的删除图标替换，或不可删除 Filter/Input 的末端装饰；接收 { selected }，删除语义仍由组件管理。' },
]
const setSlots: SlotTableItem[] = [
  { name: 'default', description: 'MdvChip 子项，无插槽参数。' },
  { name: 'label', description: '替代可见组标签，无插槽参数。' },
]
</script>
# 纸片

用 `MdvChip` 展示紧凑的操作、筛选项、建议或标签。用 `MdvChipSet` 组织相关条目。

## 用途与变体

Assist 用于操作，Filter 用于筛选条件，Input 用于已输入的内容，Suggestion 用于建议回复或操作。

<DemoBlock>
  <ChipVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvChip, MdvChipSet, MdvIcon } from '@mdv-ui/mdv'
import calendar from '@iconify-icons/material-symbols/calendar-month-outline'

const selected = ref(false)
const attached = ref(true)
const message = ref('Try an action, a filter, or a removable input chip.')
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet label="Chip variants">
      <MdvChip label="Add to calendar" @click="message = 'Added to your calendar.'">
        <template #leading><MdvIcon :icon="calendar" /></template>
      </MdvChip>
      <MdvChip variant="suggestion" label="Sounds good" @click="message = 'Reply: Sounds good.'" />
      <MdvChip v-model:selected="selected" variant="filter" label="Unread" />
      <MdvChip v-if="attached" variant="input" label="Design notes" remove-label="Remove Design notes" @click="message = 'Opened Design notes.'" @remove="attached = false" />
    </MdvChipSet>
    <MdvButton v-if="!attached" variant="text" @click="attached = true">Restore attachment</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }} · Unread: {{ selected }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 组选择

将 ChipSet 的 `selection` 设为 `single` 或 `multiple`，绑定 `v-model`，并为每个可选筛选项设置唯一的 `value`。请为分组提供名称。

<DemoBlock>
  <ChipSelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvChip, MdvChipSet, MdvIcon } from '@mdv-ui/mdv'
import type { MdvChipSetModelValue } from '@mdv-ui/mdv'
import image from '@iconify-icons/material-symbols/image-outline'

const single = ref<MdvChipSetModelValue>('all')
const multiple = ref<MdvChipSetModelValue>(['images'])
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet v-model="single" selection="single" label="Content type">
      <MdvChip variant="filter" value="all" label="All" />
      <MdvChip variant="filter" value="articles" label="Articles" />
      <MdvChip variant="filter" value="images" label="Images">
        <template #leading><MdvIcon :icon="image" /></template>
      </MdvChip>
      <MdvChip variant="filter" value="unavailable" label="Unavailable" disabled />
    </MdvChipSet>
    <MdvChipSet v-model="multiple" selection="multiple" label="Additional filters">
      <MdvChip variant="filter" value="images" label="Images" />
      <MdvChip variant="filter" value="videos" label="Videos" />
      <MdvChip variant="filter" value="recent" label="Recent" />
    </MdvChipSet>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Single: {{ JSON.stringify(single) }} · Multiple: {{ JSON.stringify(multiple) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

<DemoBlock>
  <ChipIndependentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvChip, MdvChipSet } from '@mdv-ui/mdv'

const saved = ref(false)
const person = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet label="Independent selections">
      <MdvChip v-model:selected="saved" variant="filter" label="Saved only" />
      <MdvChip v-model:selected="person" variant="input" label="Alex" selectable :removable="false">
        <template #avatar>
          <span class="grid size-full place-items-center bg-mdv-primary-container text-xs text-mdv-on-primary-container">AL</span>
        </template>
        <template #default="{ selected }">Alex{{ selected ? ' (selected)' : '' }}</template>
      </MdvChip>
    </MdvChipSet>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Saved only: {{ saved }} · Alex: {{ person }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 删除已输入内容

收到 `remove` 后从数据中删除对应项。使用稳定的 Vue `key`，让分组能将焦点移到其他项。

<DemoBlock>
  <ChipRemovalDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvChip, MdvChipSet, MdvIcon } from '@mdv-ui/mdv'
import cancel from '@iconify-icons/material-symbols/cancel-outline'

const initial = ['Design', 'Review', 'Release']
const tags = ref([...initial])
const removeOnly = ref(false)
const message = ref('Open a tag, or remove it with its separate action.')

function remove(tag: string) {
  tags.value = tags.value.filter(item => item !== tag)
  message.value = `Removed ${tag}.`
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="removeOnly" label="Make the whole chip remove only" />
    <MdvChipSet label="Project tags">
      <MdvChip v-for="tag in tags" :key="tag" variant="input" :label="tag" :remove-only="removeOnly" :remove-label="`Remove ${tag}`" @click="message = `Opened ${tag}.`" @remove="remove(tag)">
        <template #trailing><MdvIcon :icon="cancel" /></template>
      </MdvChip>
      <span v-if="!tags.length" class="text-sm text-mdv-on-surface-variant">All tags removed.</span>
    </MdvChipSet>
    <MdvButton class="justify-self-start" variant="text" @click="tags = [...initial]; message = 'Tags restored.'">Restore tags</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 外观与颜色

在支持的变体上使用 `elevated`，也可以用 `color` 设置主题色或十六进制种子色。

<DemoBlock>
  <ChipAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvChip, MdvChipSet } from '@mdv-ui/mdv'
import type { MdvChipColor } from '@mdv-ui/mdv'

const colors: MdvChipColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', '#006c4c']
const message = ref('Try the elevated actions or toggle a color filter.')
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet label="Elevated chips">
      <MdvChip label="Assist" elevated @click="message = 'Elevated assist activated.'" />
      <MdvChip variant="suggestion" label="Suggestion" elevated @click="message = 'Elevated suggestion activated.'" />
      <MdvChip variant="filter" label="Filter" elevated />
    </MdvChipSet>
    <MdvChipSet label="Theme roles and a local seed">
      <MdvChip v-for="color in colors" :key="color" variant="filter" :label="color" :color="color" />
    </MdvChipSet>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 换行与滚动

ChipSet 默认换行。使用 `scrollable` 可保持单行并横向滚动。

<DemoBlock>
  <ChipLayoutDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvChip, MdvChipSet } from '@mdv-ui/mdv'
import type { MdvChipSetModelValue } from '@mdv-ui/mdv'

const scrollable = ref(false)
const disabled = ref(false)
const selected = ref<MdvChipSetModelValue>(['Design'])
const topics = ['Design', 'Research', 'Engineering', 'Accessibility', 'Typography', 'Motion', 'Color', 'Layouts']
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="scrollable" label="Keep chips on one scrollable line" />
      <MdvCheckbox v-model="disabled" label="Disable the set" />
    </div>
    <MdvChipSet v-model="selected" selection="multiple" label="Browse topics" :scrollable="scrollable" :disabled="disabled">
      <MdvChip v-for="topic in topics" :key="topic" variant="filter" :value="topic" :label="topic" />
    </MdvChipSet>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Topics: {{ JSON.stringify(selected) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 表单组合

ChipSet 不会自动提交表单值。请由应用提交其模型，或添加带 `name` 的表单控件。

---

## API

### MdvChip 属性

<ApiTable :items="chipProps" />

### MdvChip 插槽

<SlotsTable :items="chipSlots" />

### MdvChipSet 属性

<ApiTable :items="setProps" />

### MdvChipSet 插槽

<SlotsTable :items="setSlots" />

### 事件与方法

<DocsTable label="纸片与纸片组事件" min-width="34rem">

| 组件 | 事件 | 参数 |
| --- | --- | --- |
| Chip | `update:selected` | `boolean`，独立 Filter/Input 选择请求。 |
| Chip | `remove` | 原始 `MouseEvent` 或 `KeyboardEvent`，由应用处理删除请求。 |
| ChipSet | `update:modelValue` | `MdvChipSetModelValue`，请求父级接受新的组选值。 |
| Chip | 主操作原生 `click` 及键盘/指针事件 | 主按钮/链接上的原始事件，删除使用上方独立事件。 |

</DocsTable>

两个组件均暴露 `focus(options?: FocusOptions)` 和 `blur()`。Chip 聚焦主操作，ChipSet 聚焦记忆中的可用操作，空组时聚焦容器。`blur()` 只移除该纸片/组拥有的焦点。

### 原生属性与公共类型

Chip 的 `class`、`style`、`dir`、`lang`、`hidden` 应用于外层，`id`、ARIA、`data-*` 和主操作原生监听器应用于按钮/链接。双操作纸片的删除由 `remove` 与 `remove-label` 管理。ChipSet 的属性与监听器应用于 toolbar 容器。

```ts
import type {
  MdvChipVariant,
  MdvChipColor,
  MdvChipValue,
  MdvChipSetSelection,
  MdvChipSetModelValue,
} from '@mdv-ui/mdv'
```

`MdvChipValue` 为 `string | number`，`MdvChipSetModelValue` 为单值、值数组或 `null`。当前包没有导出独立的 Chip/ChipSet 属性接口。
