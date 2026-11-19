<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ListVariantDemo from '@/components/docs/demos/list/variant.vue'
import ListContentDemo from '@/components/docs/demos/list/content.vue'
import ListSelectionDemo from '@/components/docs/demos/list/selection.vue'
import ListControlledDemo from '@/components/docs/demos/list/controlled.vue'
import ListActionsDemo from '@/components/docs/demos/list/actions.vue'
import ListGroupsDemo from '@/components/docs/demos/list/groups.vue'
import ListThemeDemo from '@/components/docs/demos/list/theme.vue'
import ListFormDemo from '@/components/docs/demos/list/form.vue'

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

`MdvList` 通过 `MdvListItem` 和可选的 `MdvListSubheader` 排列相关条目。普通列表可以包含静态信息、原生操作和独立控件；选择列表使用受控的 `listbox` 模型，保留单一键盘入口。

## 变体与布局

可以独立选择 `expressive`、`baseline` 变体，以及 `standard`、`segmented` 布局。默认使用 Expressive，下面各组初始选中相同的目标。

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

<DocsTable label="列表变体与布局行为" min-width="35rem">

| 组合 | 默认条目 | 选中条目 | 交互形状 |
| --- | --- | --- | --- |
| Expressive standard | 透明，4px 圆角 | `secondary-container`，16px 圆角 | Hover 8px，焦点/按压 16px |
| Expressive segmented | `surface-container`，分组外角 16px、内角 4px | `secondary-container`，16px 圆角 | 交互形状覆盖默认分段圆角 |
| Baseline standard | 透明，4px 圆角 | `secondary-container` | 固定圆角 |
| Baseline segmented | `surface-container`，4px 圆角 | `secondary-container` | 固定圆角 |

</DocsTable>

Expressive 选中形状优先于 hover。分段列表使用 8px 内边距和 2px 条目间隙；分组标题或其他非条目节点会切断连续分段。显式 `layout` 优先于 `segmented` 简写。

## 内容、行数与分隔线

常见内容可以通过属性提供，也可以用插槽替换局部区域。子项 `lines` 优先于列表默认值；都省略时，根据上方标签、主标题/正文和辅助区域推断行数。

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

<DocsTable label="列表条目尺寸" min-width="28rem">

| 内容 | 默认最小高度或尺寸 |
| --- | --- |
| 一行 / 两行 / 三行 | 56 / 72 / 88px |
| 前置图标 / 头像 / 图片 | 24 / 40 / 56px |
| 起始 / 末端内边距 | 16 / 24px |
| 内容区域之间的间距 | 16px |

</DocsTable>

以上高度为最小值，媒体和自定义内容可以自然撑高。三行内容顶部对齐，主标题与上方标签单行省略；三行且无上方标签时，辅助文字最多两行，其他情况为一行。

普通布局的 `full-width` 分隔线铺满相邻项之间，`inset` 随图标、头像或图片后的正文起点对齐。分段布局使用间隙并隐藏这些分隔线。内置图片与图标为装饰内容，有独立信息意义的图片应通过插槽提供适当名称。

## 单选与多选

为每个可选项提供唯一的字符串或数值 `value`，并为 listbox 命名。单选使用单个值或 `null`，多选使用数组。

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

比较使用 `Object.is`，因此数值 `1` 和字符串 `'1'` 不相等。单选重复点击当前项会保持选中，多选通过新数组添加或移除值。禁用项不会修改模型。

内置 checkbox、radio、switch 是装饰性的选择指示器，默认跟随整行选择，也可以通过 `leading-value`、`trailing-value` 单独覆盖视觉值。它们不是嵌套输入控件、独立操作或表单字段。

选择列表的键盘规则：

- Tab 进入唯一停靠项，优先选中项或当前项，其他项为 `tabindex="-1"`。
- 方向键循环移动焦点，Home/End 到首尾可用项，移动焦点不会自动选择。
- Enter/Space 选择当前项，跳过禁用、`hidden` 与 `inert` 条目。
- 焦点项被移除或禁用时，焦点移到可用项；删除值后的模型清理仍由业务负责。

链接行和没有值的行不参与选择。原生导航链接和带独立操作的条目应放在普通列表中。

## 受控接受与取消

选择请求只有被父级接受后才改变可见状态，`v-model` 会直接处理接受。示例默认拒绝请求，取消行点击则会阻止选择请求本身。

<DemoBlock>
  <ListControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvList, MdvListItem } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'

const selected = ref<MdvListModelValue>('draft')
const accept = ref(false)
const cancelClick = ref(false)
const message = ref('The parent currently rejects selection changes.')

function update(value: MdvListModelValue) {
  message.value = `Requested ${value}: ${accept.value ? 'accepted' : 'rejected'}.`
  if (accept.value) selected.value = value
}

function activate(event: MouseEvent) {
  if (!cancelClick.value) return
  event.preventDefault()
  message.value = 'Click cancelled before the selection request.'
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="accept" label="Accept list selection" />
      <MdvCheckbox v-model="cancelClick" label="Cancel row clicks" />
    </div>
    <MdvList :model-value="selected" selection-mode="single" layout="segmented" aria-label="Review stage" @update:model-value="update">
      <MdvListItem v-for="stage in ['draft', 'review', 'approved']" :key="stage" :value="stage" :headline="stage" trailing="radio" @click="activate" />
    </MdvList>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Selected: {{ selected }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

取消主操作原生 `click`，或取消用于选择的 `keydown` 默认行为，都会阻止该次选择。`MdvListItem` 不发出自己的 `update:selected`，选择属于父级 List 模型。选择模式以外，`selected` 只是视觉属性。

## 独立控件与原生操作

将真实控件放入 `#leading-action` 或 `#trailing-action`。它们与主操作互为兄弟节点，共享条目表面，因此保留自己的焦点入口，也不会触发主按钮。

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

可以分别尝试保存复选框、项目主操作、更多操作和同步开关。为每个控件绑定插槽的 `disabled`，保持原生禁用语义与外观一致；禁用行也会阻止操作区域激活。禁用链接移除 `href`、退出 Tab 顺序并保留禁用链接语义，重新启用后恢复地址。

包含多个控件时使用普通列表，不要在主标题、正文、leading、trailing 展示插槽中放置交互元素。提供 `href` 时使用原生链接，提供 `interactive` 或激活监听器时使用原生按钮，否则保持静态内容。静态信息不会增加 Tab 入口。

## 分组标题、重排与焦点

分组标题提供视觉分区并切断连续分段，`inset` 用于对齐普通前置图标后的正文。稳定条目 key 可以在重排时保留选择和节点身份。

<DemoBlock>
  <ListGroupsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvList, MdvListItem, MdvListSubheader } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const list = useTemplateRef<InstanceType<typeof MdvList>>('list')
const selected = ref<MdvListModelValue>('research')
const showSubheader = ref(true)
const projects = ref(['research', 'prototype', 'release'])
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="showSubheader" label="Show the project group label" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="projects = [...projects].reverse()">Reverse project order</MdvButton>
      <MdvButton variant="outlined" @click="list?.focus()">Focus selected row</MdvButton>
    </div>
    <MdvList ref="list" v-model="selected" selection-mode="single" layout="segmented" aria-label="Grouped destinations">
      <MdvListSubheader inset>Workspace</MdvListSubheader>
      <MdvListItem value="inbox" headline="Inbox" :icon="folderIcon" />
      <MdvListItem value="archive" headline="Archive" :icon="folderIcon" />
      <MdvListSubheader v-if="showSubheader" inset>Projects</MdvListSubheader>
      <MdvListItem v-for="project in projects" :key="project" :value="project" :headline="project" :icon="folderIcon" />
    </MdvList>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Selected: {{ selected }}. Reordering preserves each row's value.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

隐藏项目标题可以连通分段，反转项目后，Focus selected row 按钮会调用 List 实例的 `focus()`。选择导航跟随当前 DOM 顺序。Subheader 是展示性的 `li`，不是可展开分组、吸顶标题，也不增加键盘停靠点。

## 原生表单

普通交互行支持原生按钮类型、必填校验、重置与提交者属性。需要显式启用交互，单独设置 `type` 不会将静态内容变成按钮。

<DemoBlock>
  <ListFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem, MdvTextField } from '@mdv-ui/mdv'

const name = ref('')
const message = ref('Enter a display name before submitting.')

function submit(event: Event) {
  const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null
  message.value = `Submitted ${name.value} with intent=${submitter?.value || '(none)'}.`
}
</script>

<template>
  <div class="grid gap-4">
    <form class="grid gap-3" @submit.prevent="submit" @reset="name = ''; message = 'Profile reset.'">
      <MdvTextField v-model="name" label="Display name" name="displayName" required full-width />
      <MdvList aria-label="Profile form actions">
        <MdvListItem interactive type="submit" name="intent" value="save" headline="Submit profile" supporting-text="Uses native required-field validation." />
        <MdvListItem interactive type="reset" headline="Reset profile" />
        <MdvListItem interactive headline="Preview profile" @click="message = `Preview: ${name || '(empty)'}`" />
      </MdvList>
    </form>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Preview profile 使用默认 `button` 类型，不会提交。Submit profile 提供 `name="intent"` 与 `value="save"`，由业务处理提交。列表选择模型本身不会序列化，也没有内置 `name`、校验或重置 API；需要提交选择时，请另外绑定表单字段。

## 长内容、局部主题与方向

条目继承局部浅深色、MDV 令牌及逻辑方向。长文字保持在正文列内，尾部内容保留自己的空间。

<DemoBlock>
  <ListThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvList, MdvListItem } from '@mdv-ui/mdv'
import notificationsIcon from '@iconify-icons/material-symbols/notifications-outline'

const rtl = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="rtl" label="Use right-to-left lists" />
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" :dir="rtl ? 'rtl' : 'ltr'" class="min-w-0 rounded-xl bg-mdv-surface-container-lowest p-2 text-mdv-on-surface">
      <MdvList layout="segmented" :aria-label="`${theme} list preview`">
        <MdvListItem :lines="3" headline="A long notification headline that stays within the row" supporting-text="Supporting text can wrap onto two lines in a three-line row without an overline, while its trailing content keeps its space." :icon="notificationsIcon" trailing-text="Now" />
        <MdvListItem :lines="3" headline="Archive export" supporting-text="ReportArchive2026WithALongUnbrokenSupportingValueToCheckWrapping" avatar-name="Alex Morgan" trailing="checkbox" :trailing-value="true" selected />
      </MdvList>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

选中时文字与展示图标使用 `on-secondary-container`。Expressive 的悬停、按压、可见焦点和选中状态保留共用表面与涟漪。减少动态效果会缩短过渡，强制颜色模式使用系统颜色。列表不提供种子色属性。

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
