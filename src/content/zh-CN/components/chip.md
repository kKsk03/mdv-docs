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
import ChipFormDemo from '@/components/docs/demos/chip/form.vue'

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

`MdvChip` 以紧凑形式呈现上下文操作、建议、筛选或已输入内容。`MdvChipSet` 排列相关纸片、管理键盘焦点，也可以统一管理 Filter 选择。

## 用途与变体

Assist 执行上下文操作，Suggestion 提供回复或操作建议，Filter 切换筛选条件，Input 表示附件、标签或联系人等内容。Input 的主操作与删除操作相互独立。

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

<DocsTable label="纸片变体行为" min-width="32rem">

| 变体 | 默认主操作 | 默认删除 | 链接支持 |
| --- | --- | --- | --- |
| `assist` | 业务操作 | 无 | 支持 |
| `suggestion` | 业务操作 | 无 | 支持 |
| `filter` | 切换选择，内置选中勾选符号 | 无，可开启 | 不支持 |
| `input` | 业务操作，可开启选择 | 有 | 不支持 |

</DocsTable>

只有 Assist/Suggestion 接受 `href`，原生 `target`、`rel`、`download` 会透传。按钮纸片的类型固定为 `type="button"`。不要把 Filter/Input 当作链接使用。

---

## 组选择

将 ChipSet 的 `selection` 设置为 `single` 或 `multiple`，并绑定 `v-model`。可选择 Filter 需要唯一 `value`。单选可再次点击已选项取消，多选使用数组。

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

组选择只作用于可选择的 Filter。Input、Assist、Suggestion 和 `:selectable="false"` 不加入组模型。被组管理的 Filter 不再单独绑定 `selected`。数字与字符串严格区分，多选更新创建新数组，不修改传入数组。

父级接受的模型决定 `aria-pressed` 与外观；拒绝更新时保留原状态。原生 click 监听先于选择运行，`event.preventDefault()` 可取消切换请求。组件没有 `selection-required` 属性。

### 独立选择与头像

ChipSet 默认 `selection="none"`，各纸片可以分别绑定布尔 `v-model:selected`，未绑定时内部管理。Input 需要显式开启 `selectable` 才会切换；选中本身不会自动添加 Filter 的勾选符号。

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

Input 的 `#avatar` 可以显示联系人缩写等内容，优先于 `#leading`。默认标签及装饰插槽接收 `{ selected }`。头像/图标槽对辅助技术隐藏并设为 inert，因此纸片文字必须准确标识操作。不要在插槽内再放按钮、输入框或链接。

---

## 删除已输入内容

`remove` 是请求事件，需要修改数据数组才会移除纸片，组件不会自行删除节点。使用稳定的 Vue `:key`，ChipSet 才能在实际删除后将焦点移到可用邻项。

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

独立删除按钮不会触发主操作 click，也不会修改选择。聚焦 Input 主体或删除按钮后，Delete/Backspace 可请求删除；重复 keydown 与 Ctrl/Alt/Meta 组合不重复请求。上面的 trailing 插槽替换图标，按钮和名称仍由组件保留。

整颗 Input 都应只删除内容时，开启 `remove-only`，将操作合并为一个有名称的焦点目标并忽略选中。它只作用于 Input，且必须允许删除。

需要时始终提供本地化 `remove-label`。默认中文名称是“删除”加标签/文字，或“删除此项”。复杂默认槽应提供准确的 `label` 或显式删除名称，确保服务端输出就已有正确名称。

## 外观与颜色

Assist、Filter、Suggestion 支持 `elevated`，Input 保持普通外观。`color` 接受与 Button 相同的预设角色及十六进制局部种子色，不改写周围主题。

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

默认纸片可见高度 32px、圆角 8px、图标 18px，交互目标至少 48px。包含主操作和删除操作时分别预留命中区域，不应通过局部 CSS 压缩。默认已选 Filter/Input 使用 `secondary-container` 与 `on-secondary-container`。浅深色、局部令牌、焦点框、状态层及减少动态效果由 MDV 提供。

## 换行、滚动与禁用

ChipSet 默认自动换行，开启 `scrollable` 后使用单行水平滚动。可在窄行内尝试键盘导航，或禁用整个组。

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

组的 `disabled` 禁用全部主操作和删除操作；纸片自己的 `disabled` 仅控制该项。禁用链接移除 `href`、设置 `aria-disabled`、退出 Tab 并阻止激活。标签应简短，窄容器可视觉省略，但 DOM 中保留完整文字。

---

## 表单组合

Chip 和 ChipSet 不生成隐藏表单字段，不实现原生 required 校验或表单重置。可以直接提交业务模型，也可以在原生表单中显式增加字段和重置处理。

<DemoBlock>
  <ChipFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvButton, MdvChip, MdvChipSet } from '@mdv-ui/mdv'
import type { MdvChipSetModelValue } from '@mdv-ui/mdv'

const topics = ref<MdvChipSetModelValue>(['design'])
const values = computed(() => Array.isArray(topics.value) ? topics.value : [])
const result = ref('Selected chips are submitted through explicit hidden inputs.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ topic: data.getAll('topic') })
}

function reset() {
  topics.value = ['design']
  result.value = 'Form reset by the application.'
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="reset">
    <MdvChipSet v-model="topics" selection="multiple" label="Newsletter topics">
      <MdvChip variant="filter" value="design" label="Design" />
      <MdvChip variant="filter" value="engineering" label="Engineering" />
      <MdvChip variant="filter" value="research" label="Research" />
    </MdvChipSet>
    <input v-for="value in values" :key="value" type="hidden" name="topic" :value="value" />
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
```

  </template>
</DemoBlock>

本例提交重复的 `topic` 字段，并显式重置模型。如果组可以禁用，也应按表单策略禁用自己增加的字段。单纯给 ChipSet 添加 `name` 不会序列化其模型。

## 键盘与无障碍

- ChipSet 使用水平 `toolbar`，不是 listbox 或 radio group。通过 `label`、`#label`、`aria-label`、`aria-labelledby` 提供名称。
- Tab 进入唯一记忆入口，初始优先选中项。左/右键按 DOM 顺序经过主操作及删除操作，跳过不可用目标，可循环并随 RTL 镜像。Home/End 到首尾，移焦不修改选择。
- Enter/Space 激活原生按钮，链接保留 Enter 行为。独立使用时两个操作分别采用原生 Tab 顺序，切换项使用 `aria-pressed`。
- 删除后优先聚焦后方可用纸片，末尾则退到前项；全部删除后聚焦空组。如果应用已主动将焦点移到其他位置，组件会尊重该决定。

组件不实现文字输入、标签编辑器、菜单、加载、错误校验或拖拽排序，这些业务行为需要明确组合。

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
