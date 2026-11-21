<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ListVariantDemo from '@/components/docs/demos/list/variant.vue'
import ListContentDemo from '@/components/docs/demos/list/content.vue'
import ListSelectionDemo from '@/components/docs/demos/list/selection.vue'
import ListActionsDemo from '@/components/docs/demos/list/actions.vue'

const listProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvListModelValue', default: 'null', description: '单选使用单个值或 null，多选使用数组。变更需要父级接受；selection-mode=none 时不参与选择。' },
  { name: 'variant', type: "'expressive' | 'baseline'", default: "'expressive'", description: '视觉风格与交互圆角行为。' },
  { name: 'layout', type: "'standard' | 'segmented'", default: "'standard'（解析后）", description: '显式布局优先于 segmented 简写。' },
  { name: 'segmented', type: 'boolean', default: 'false', description: '省略 layout 时，作为分段布局的简写。' },
  { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: '切换普通列表与受控 listbox。选择项需要唯一值，并且不能是链接。' },
  { name: 'dividers', type: "'none' | 'full-width' | 'inset'", default: "'none'", description: '普通布局相邻项之间的分隔线。分段布局通过间隙分隔。' },
  { name: 'lines', type: '1 | 2 | 3', description: '子项没有覆盖时的默认行数，省略后由各条目的内容推断。' },
]
const itemProps: ApiTableItem[] = [
  { name: 'lines', type: '1 | 2 | 3', description: '覆盖列表行数，否则继承列表设置，或从上方标签、主标题/正文和辅助区域推断。' },
  { name: 'overline', type: 'string', default: "''", description: '主标题上方的短文字，overline 插槽优先。' },
  { name: 'headline', type: 'string', default: "''", description: '主标题，同时作为交互行的默认可访问名称，默认插槽优先。' },
  { name: 'supportingText', type: 'string', default: "''", description: '主标题下方的辅助文字。未通过 content 替换正文列时，自动参与交互行的描述关联。' },
  { name: 'trailingText', type: 'string', default: "''", description: '尾部短文本，可与尾部图标或展示指示器组合。' },
  { name: 'value', type: 'string | number', description: '唯一的列表选择值。非选择模式的原生按钮也将其作为原生 value。' },
  { name: 'selected', type: 'boolean', default: 'false', description: '列表选择之外的视觉状态。参与选择时，以父列表模型为准。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用本行激活并将主操作移出 Tab 顺序，独立控件也应绑定 action 插槽的 disabled。' },
  { name: 'interactive', type: 'boolean', default: 'false', description: '既非选项也非链接时，使用原生按钮作为主操作。激活监听器也会启用按钮语义。' },
  { name: 'href', type: 'string', description: '使用原生链接，空字符串同样生效。链接行不参与列表选择。' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: '交互按钮的原生类型，单独设置 type 不会将静态行变为按钮。' },
  { name: 'icon', type: 'MdvIconData', description: '本地前置图标数据。省略 leading 时，推断优先于 avatarName 和 image。' },
  { name: 'leading', type: 'MdvListLeading', description: '显式指定 icon、avatar、image、checkbox、radio 或 switch，优先于自动推断。' },
  { name: 'avatarName', type: 'string', description: '取去除首尾空白后的首个 Unicode 字符作为大写头像文字；提供头像图片时显示图片。' },
  { name: 'image', type: 'string', description: '前置图片地址，leading=avatar 时使用圆形头像；自动推断优先级低于 icon 和 avatarName。' },
  { name: 'trailingIcon', type: 'MdvIconData', description: '本地尾部图标数据，自动推断 trailing 时优先于 trailingText。' },
  { name: 'trailing', type: 'MdvListTrailing', description: '显式指定 icon、text、checkbox、radio 或 switch 展示。' },
  { name: 'leadingValue', type: 'boolean', default: 'selected（解析后）', description: '只覆盖前置选择指示器的视觉值，省略后跟随条目选择状态。' },
  { name: 'trailingValue', type: 'boolean', default: 'selected（解析后）', description: '只覆盖尾部选择指示器的视觉值，不更新列表模型。' },
]
const subheaderProps: ApiTableItem[] = [
  { name: 'inset', type: 'boolean', default: 'false', description: '将起始留白改为 56px，与普通前置图标后的正文对齐，默认起始留白为 16px。' },
]
const listSlots: SlotTableItem[] = [
  { name: 'default', description: '列表条目与展示性分组标题，无插槽参数。' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: '替换主标题，接收 { selected, disabled }。' },
  { name: 'overline', description: '替换上方标签，接收 { selected, disabled }。' },
  { name: 'supporting', description: '替换辅助文字，接收 { selected, disabled }。' },
  { name: 'content', description: '完全替换正文列，接收 MdvListItemContentProps 和 { selected, disabled }，内容应保持非交互。' },
  { name: 'leading', description: '替换装饰性前置内容，接收 { selected, disabled }。' },
  { name: 'trailing', description: '替换装饰性尾部内容，接收 { selected, disabled }。' },
  { name: 'leading-action', description: '独立前置控件，位于主操作之外，接收 { selected, disabled }，请将 disabled 绑定到控件。' },
  { name: 'trailing-action', description: '独立尾部控件，位于主操作之外，接收 { selected, disabled }，请将 disabled 绑定到控件。' },
]
const subheaderSlots: SlotTableItem[] = [
  { name: 'default', description: '可见分组标题文字，无插槽参数。' },
]
</script>
# 列表

用 `MdvList` 和 `MdvListItem` 展示相关条目、操作或可选项。

## 变体与布局

用 `variant` 选择 Expressive 或 Baseline 外观，用 `layout` 选择标准或分段布局。

<DemoBlock>
  <ListVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const examples = [
  { id: 'expressive-standard', variant: 'expressive', layout: 'standard' },
  { id: 'expressive-segmented', variant: 'expressive', layout: 'segmented' },
  { id: 'baseline-standard', variant: 'baseline', layout: 'standard' },
  { id: 'baseline-segmented', variant: 'baseline', layout: 'segmented' },
] as const
const selected = ref<Record<string, MdvListModelValue>>(Object.fromEntries(examples.map(example => [example.id, 'projects'])))
const destinations = ['workspace', 'projects', 'archive']
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <div v-for="example in examples" :key="example.id" class="min-w-0 rounded-xl bg-mdv-surface-container-lowest p-2">
      <p class="px-3 py-2 text-sm font-medium">{{ example.variant }} · {{ example.layout }}</p>
      <MdvList v-model="selected[example.id]" :variant="example.variant" :layout="example.layout" selection-mode="single" :aria-label="example.id">
        <MdvListItem v-for="destination in destinations" :key="destination" :value="destination" :headline="destination" :icon="folderIcon" />
      </MdvList>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 条目内容

通过条目属性或插槽设置标题、辅助文本、图标等内容。用 `lines` 覆盖自动计算的行数。

<DemoBlock>
  <ListContentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvListDivider } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const dividers = ref<MdvListDivider>('inset')
const options = ['none', 'full-width', 'inset'].map(value => ({ value, label: value }))
const image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"%3E%3Cpath fill="%23d0bcff" d="M0 0h56v56H0z"/%3E%3Cpath fill="%234f378b" d="m0 48 18-26 13 14 10-11 15 23z"/%3E%3C/svg%3E'
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="dividers" :options="options" label="Row dividers" @update:model-value="dividers = $event as MdvListDivider" />
    <MdvList :dividers="dividers" :lines="1" aria-label="List content examples">
      <MdvListItem headline="Workspace files" :icon="folderIcon" trailing-text="12" />
      <MdvListItem :lines="2" headline="Alex Morgan" supporting-text="Shared a document with you" avatar-name="Alex Morgan" trailing-text="Now" />
      <MdvListItem :lines="3" overline="ARCHIVE" headline="Quarterly report" supporting-text="A thumbnail, overline, headline, and supporting text." :image="image" />
      <MdvListItem :lines="2" headline="Workspace export" supporting-text="Custom content keeps the row's normal geometry." :icon="folderIcon">
        <template #content="{ headline, supportingText }">
          <span class="block font-medium">{{ headline }}</span>
          <span class="block text-sm text-mdv-on-surface-variant">{{ supportingText }}</span>
        </template>
      </MdvListItem>
    </MdvList>
  </div>
</template>
```

  </template>
</DemoBlock>

## 单选与多选

为可选项设置不同的 `value`，并为列表框命名。单选绑定一个值或 `null`，多选绑定数组。

<DemoBlock>
  <ListSelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'

const single = ref<MdvListModelValue>('profile')
const multiple = ref<MdvListModelValue>(['updates'])
</script>

<template>
  <div class="grid gap-6">
    <div class="grid gap-3">
      <MdvList v-model="single" selection-mode="single" aria-label="Account preference">
        <MdvListItem value="profile" headline="Profile" leading="radio" />
        <MdvListItem value="locked" headline="Unavailable setting" leading="radio" disabled />
        <MdvListItem :value="1" headline="Numeric value 1" leading="radio" />
        <MdvListItem value="1" headline="Text value 1" leading="radio" />
      </MdvList>
      <p class="text-sm text-mdv-on-surface-variant" role="status">Single: {{ typeof single }} {{ JSON.stringify(single) }}</p>
    </div>
    <div class="grid gap-3">
      <MdvList v-model="multiple" selection-mode="multiple" layout="segmented" aria-label="Notification categories">
        <MdvListItem value="updates" headline="Product updates" trailing="checkbox" />
        <MdvListItem value="security" headline="Security alerts" trailing="checkbox" />
        <MdvListItem value="billing" headline="Billing messages" trailing="checkbox" />
      </MdvList>
      <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Multiple: {{ JSON.stringify(multiple) }}</p>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 独立操作

用 `leading-action` 或 `trailing-action` 放置独立控件，不要在条目的主操作中嵌套按钮。

<DemoBlock>
  <ListActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvList, MdvListItem, MdvSwitch } from '@mdv-ui/mdv'
import moreIcon from '@iconify-icons/material-symbols/more-vert'
import syncIcon from '@iconify-icons/material-symbols/sync'

const disabled = ref(false)
const saved = ref(false)
const sync = ref(true)
const opens = ref(0)
const more = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disabled" label="Disable action rows" />
    <MdvList layout="segmented" aria-label="Workspace actions">
      <MdvListItem interactive headline="Project details" supporting-text="Open the project from its main action." :selected="saved" :disabled="disabled" @click="opens++">
        <template #leading-action="{ disabled: rowDisabled }"><MdvCheckbox v-model="saved" :disabled="rowDisabled" aria-label="Save project" /></template>
        <template #trailing-action="{ disabled: rowDisabled }">
          <MdvIconButton variant="standard" :disabled="rowDisabled" aria-label="More project actions" @click="more++"><MdvIcon :icon="moreIcon" /></MdvIconButton>
        </template>
      </MdvListItem>
      <MdvListItem headline="Background sync" supporting-text="The switch is an independent action." :icon="syncIcon" :disabled="disabled">
        <template #trailing-action="{ disabled: rowDisabled }"><MdvSwitch v-model="sync" :disabled="rowDisabled" aria-label="Enable background sync" /></template>
      </MdvListItem>
      <MdvListItem href="https://m3.material.io/components/lists/overview" target="_blank" rel="noopener noreferrer" headline="Read the list design guide" :disabled="disabled" />
      <MdvListItem headline="Workspace is up to date" trailing-text="Read only" />
    </MdvList>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Project opens: {{ opens }} · Saved: {{ saved }} · Sync: {{ sync }} · More: {{ more }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 分段标题

用 `MdvListSubheader` 为列表分段设置标题。条目重新排序时，使用稳定的 Vue `key` 保持条目身份。

---

## API

### MdvList

<ApiTable :items="listProps" />

<SlotsTable :items="listSlots" />

<DocsTable label="列表模型事件" min-width="30rem">

| 事件 | 载荷 |
| --- | --- |
| `update:modelValue` | 单选请求新的单个值，多选请求新的值数组。禁用或被取消的激活不产生请求。 |

</DocsTable>

`focus(options?: FocusOptions)` 聚焦当前/选中的可用项，普通列表则聚焦可用主操作；`blur()` 让已聚焦的后代失焦，不会将静态内容变为可聚焦。原生属性和监听器进入根节点 `ul`，MDV 管理 `role="list"`/`"listbox"` 与 `aria-multiselectable`。

### MdvListItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

条目公开 `focus(options?: FocusOptions)` 和 `blur()`，禁用时忽略 `focus()`。没有自定义组件事件，原生激活监听器进入主操作，选择变化使用父级 List 模型。

交互条目的 `class`、`style`、`dir`、`lang`、`hidden` 和 `inert` 进入外层 `li`，其他原生属性、ID、ARIA 及监听器进入按钮、链接或选项。静态条目的属性进入 `li`。MDV 管理对应角色、禁用和选中属性。

主标题为主操作命名，辅助文字自动参与 `aria-describedby`；显式 ARIA 名称优先。自定义 `content` 保留命名容器，但不会自动创建独立辅助描述，需要时显式关联。装饰性指示器没有独立变更事件或方法。

### MdvListSubheader

<ApiTable :items="subheaderProps" />

<SlotsTable :items="subheaderSlots" />

原生属性和监听器进入展示性的 `li`。没有自定义事件、模型或公开方法，也不实现吸顶或展开。

### 公开类型与范围

```ts
import type {
  MdvListVariant,
  MdvListLayout,
  MdvListSelectionMode,
  MdvListDivider,
  MdvListValue,
  MdvListModelValue,
  MdvListLeading,
  MdvListTrailing,
  MdvListItemSlotProps,
  MdvListItemContentProps,
} from '@mdv-ui/mdv'
```

`MdvListValue` 为 `string | number`，模型可以是单个值、值数组或 `null`。MDV 不单独导出 List、ListItem、ListSubheader 的 Props 接口。可展开树形、拖拽排序、滑动操作、虚拟化和吸顶分组标题不属于当前范围。
