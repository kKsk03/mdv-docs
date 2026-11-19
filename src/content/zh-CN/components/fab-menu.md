<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FabMenuBasicDemo from '@/components/docs/demos/fabMenu/basic.vue'
import FabMenuAppearanceDemo from '@/components/docs/demos/fabMenu/appearance.vue'
import FabMenuSelectionDemo from '@/components/docs/demos/fabMenu/selection.vue'
import FabMenuControlledDemo from '@/components/docs/demos/fabMenu/controlled.vue'
import FabMenuDialogDemo from '@/components/docs/demos/fabMenu/dialog.vue'

const menuProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false（内部状态）', description: '省略时内部管理打开状态。绑定布尔值后，父级需要接受 update:modelValue 请求。' },
  { name: 'variant', type: "'expressive' | 'baseline'", default: "'expressive'", description: 'Expressive 使用独立的胶囊操作项，Baseline 使用触发器上方的普通 MdvMenu。' },
  { name: 'color', type: 'MdvFabMenuColor', default: "'primary-container'", description: '支持 primary-container、secondary-container、tertiary-container、primary、secondary、tertiary，不支持 surface。' },
  { name: 'size', type: "'regular' | 'medium' | 'large'", default: "'regular'", description: '触发器尺寸为 56、80、96px。Expressive 关闭操作始终为 56px，不支持 small。' },
  { name: 'elevated', type: 'boolean', default: 'true', description: '控制触发器、关闭操作的阴影与 Expressive 操作项的悬停阴影。Baseline 菜单表面的阴影仍由 MdvMenu 管理。' },
  { name: 'position', type: "'static' | 'absolute' | 'fixed'", default: "'static'", description: '普通布局，或相对包含块、视口定位到逻辑底部末端。没有 placement 属性。' },
  { name: 'offset', type: 'number', default: '16 / 24', description: '贴边距离，默认 16px，视口宽度达到 1200px 时为 24px。显式非负值覆盖响应式默认值，安全区另计。' },
  { name: 'label', type: 'string（必填）', description: '说明可用操作的可访问名称，也用于命名 Expressive 操作组或 Baseline 菜单。' },
  { name: 'closeLabel', type: 'string', default: "'关闭菜单'", description: 'Expressive 展开后关闭操作的可访问名称，请按应用语言明确设置。' },
  { name: 'triggerAttrs', type: 'MdvFabMenuTriggerAttrs', description: '传给入口按钮的原生属性、事件，以及可选的函数或 Vue ref。入口语义仍由组件管理。' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', default: "''", description: '未提供默认插槽时的操作文字。' },
  { name: 'icon', type: 'MdvIconData', description: '装饰性前置图标数据，leading 插槽优先。' },
  { name: 'value', type: 'string | number', description: 'select.detail.value 中的操作标识，数字 0 也是有效值。' },
  { name: 'href', type: 'string', description: '渲染原生链接操作，可继续透传链接属性。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '阻止操作回调、选择事件和导航，不会因此关闭菜单。' },
  { name: 'keepOpen', type: 'boolean', default: 'false', description: '未取消的选择之后不自动关闭菜单，不代表操作项具有选中状态。' },
]
const menuSlots: SlotTableItem[] = [
  { name: 'default', description: '使用 MdvFabMenuItem 组成操作列表。无参数。' },
  { name: 'icon', description: '替换默认加号的装饰性入口图标。Expressive 展开后的关闭叉号由组件管理。无参数。' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: '替换 label 的操作文字。没有公开插槽参数。' },
  { name: 'leading', description: '装饰性前置图标，优先于 icon 数据。没有公开插槽参数。' },
]
</script>

# 浮动操作菜单

`MdvFabMenu` 通过一个浮动入口展开少量相关的主要操作，内部使用 `MdvFabMenuItem`。`expressive` 将操作显示为独立胶囊，`baseline` 则在 FAB 旁使用普通菜单。

## Expressive 与 Baseline

两种呈现可以使用同一组操作数据，但语义和键盘规则不同。下面并排展示，方便对比。

<DemoBlock>
  <FabMenuBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvFabMenu, MdvFabMenuItem } from '@mdv-ui/mdv'
import type { MdvFabMenuVariant } from '@mdv-ui/mdv'
import noteIcon from '@iconify-icons/material-symbols/note-add-outline'
import photoIcon from '@iconify-icons/material-symbols/add-photo-alternate-outline'
import folderIcon from '@iconify-icons/material-symbols/create-new-folder-outline'

const variants: MdvFabMenuVariant[] = ['expressive', 'baseline']
const message = ref('Choose an action in either presentation.')
const actions = [
  { value: 'document', label: 'New document', icon: noteIcon },
  { value: 'photo', label: 'Add photo', icon: photoIcon },
  { value: 'folder', label: 'New folder', icon: folderIcon },
]
</script>

<template>
  <div class="grid gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="variant in variants" :key="variant" class="relative min-h-72 rounded-xl bg-mdv-surface-container-low p-5 pb-24">
        <p class="font-medium">{{ variant }}</p>
        <p class="mt-3 text-sm text-mdv-on-surface-variant">{{ variant === 'expressive' ? 'Use Tab to visit actions.' : 'Use arrow keys to visit actions.' }}</p>
        <MdvFabMenu :variant="variant" :label="`Create content, ${variant}`" close-label="Close create menu" position="absolute" :offset="16">
          <MdvFabMenuItem v-for="action in actions" :key="action.value" v-bind="action" @select="message = `${variant}: ${$event.detail.value}`" />
        </MdvFabMenu>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Expressive 展开时，原触发器变为关闭操作，焦点仍留在同一节点。操作列表是非模态的 `group`：通过 Tab 进入第一个操作，再按正常顺序继续。它不使用菜单的方向键导航，也不锁住焦点。

Baseline 使用 `variant="baseline"`、`placement="top-end"`、间距 4px 的 `MdvMenu`。打开后聚焦菜单项，方向键、Home/End、输入字符查找、Escape、Tab 均沿用普通菜单规则。定位时可以自动翻转或平移以适应视口。

## 外观、方向与局部主题

关闭状态的入口支持 56/80/96px 三种尺寸和六种颜色。Expressive 展开后，关闭操作固定为 56px，对齐原入口顶部的逻辑末端角，同时保留原入口的布局占位。

<DemoBlock>
  <FabMenuAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFabMenu, MdvFabMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvFabMenuColor, MdvFabMenuSize } from '@mdv-ui/mdv'

const size = ref<MdvFabMenuSize>('regular')
const color = ref<MdvFabMenuColor>('primary-container')
const elevated = ref(true)
const disabled = ref(false)
const rtl = ref(false)
const dark = ref(false)
const sizes = ['regular', 'medium', 'large'].map(value => ({ value, label: value }))
const colors = ['primary-container', 'secondary-container', 'tertiary-container', 'primary', 'secondary', 'tertiary'].map(value => ({ value, label: value }))
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4">
      <MdvSelect :model-value="size" :options="sizes" label="Trigger size" @update:model-value="size = $event as MdvFabMenuSize" />
      <MdvSelect :model-value="color" :options="colors" label="Trigger color" @update:model-value="color = $event as MdvFabMenuColor" />
    </div>
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="elevated" label="Elevated surfaces" />
      <MdvCheckbox v-model="disabled" label="Disable trigger" />
      <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
      <MdvCheckbox v-model="dark" label="Local dark theme" />
    </div>
    <div :dir="rtl ? 'rtl' : 'ltr'" :data-mdv-theme="dark ? 'dark' : undefined" class="relative min-h-80 rounded-xl bg-mdv-surface-container-low p-5 pb-32 text-mdv-on-surface">
      <p class="text-sm">Large triggers keep their original layout space while the close action becomes 56px.</p>
      <MdvFabMenu :size="size" :color="color" :elevated="elevated" :trigger-attrs="{ disabled }" label="More creation options" close-label="Close creation options" position="absolute" :offset="16">
        <MdvFabMenuItem label="New note" />
        <MdvFabMenuItem label="Create a shared project folder with a longer label" />
        <MdvFabMenuItem label="Import a template" />
      </MdvFabMenu>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

Expressive 胶囊操作项最小高度为 56px，图标 24px，水平内边距 24px，图文间距 8px。相邻操作间距为 4px，最后一个操作与关闭按钮之间为 8px。长文字可以换行增加高度；视口较短时，操作列表可独立滚动，关闭操作仍可访问。

胶囊使用所选色彩家族的 container/on-container，关闭操作使用实色与 on-color。`elevated` 影响入口、关闭操作和胶囊悬停阴影，不会移除 Baseline 普通菜单表面自身的阴影。与 Fab 不同，FabMenu 没有 `surface` 颜色和 `small` 尺寸。

## 选择、保持打开与取消

在操作项上监听 `@select` 执行业务逻辑，`event.detail.value` 用于辨识操作。组件没有选中值模型。需要重复执行时，可使用 `keep-open`。

<DemoBlock>
  <FabMenuSelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvFabMenu, MdvFabMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvFabMenuSelectEvent, MdvFabMenuVariant } from '@mdv-ui/mdv'

const variant = ref<MdvFabMenuVariant>('expressive')
const added = ref(0)
const message = ref('Try keeping the menu open or cancelling a link action.')
const variants = ['expressive', 'baseline'].map(value => ({ value, label: value }))

function cancel(event: MdvFabMenuSelectEvent) {
  event.preventDefault()
  message.value = 'Link selection cancelled; navigation and automatic closing were prevented.'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="variant" :options="variants" label="Action presentation" @update:model-value="variant = $event as MdvFabMenuVariant" />
    <div class="relative min-h-88 rounded-xl bg-mdv-surface-container-low p-5 pb-24">
      <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }} · Items added: {{ added }}</p>
      <MdvFabMenu :variant="variant" label="Try selection rules" close-label="Close selection menu" position="absolute" :offset="16">
        <MdvFabMenuItem label="Run and close" value="finish" @select="message = `Selected ${$event.detail.value}.`" />
        <MdvFabMenuItem label="Add another" :value="0" keep-open @select="added++; message = 'Added an item; menu remains open.'" />
        <MdvFabMenuItem label="Cancel link action" href="#cancelled-fab-action" @select="cancel" />
        <MdvFabMenuItem label="Unavailable export" href="#unavailable-fab-action" disabled @select="message = 'This must not run.'" />
      </MdvFabMenu>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

可以切换两种呈现后，分别尝试 Add another、Cancel link action 和 Unavailable export。第一个保持菜单打开，并保留数字 `0` 的操作值；第二个同步调用 `event.preventDefault()`，同时取消原生链接导航与自动关闭；禁用项不会调用操作回调或导航。

该事件为可取消的 `CustomEvent`，`detail` 包含 `{ value, selected: false, originalEvent }`。需要取消时，请在异步等待之前同步调用 `preventDefault()`。取消原始 click 的默认行为也会阻止选择。`keep-open` 仅影响关闭行为，不会把操作变为选中状态。

## 受控状态与触发器属性

不绑定模型时，菜单内部管理打开状态。绑定后，父级可以接受或拒绝打开、关闭请求。下面默认拒绝打开，启用后才接受；也可以拒绝下一次关闭，再允许后续尝试。

<DemoBlock>
  <FabMenuControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, shallowRef, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvFabMenu, MdvFabMenuItem } from '@mdv-ui/mdv'
import type { MdvFabMenuTriggerAttrs } from '@mdv-ui/mdv'

const menu = useTemplateRef<InstanceType<typeof MdvFabMenu>>('menu')
const trigger = shallowRef<HTMLButtonElement | null>(null)
const triggerAttrs: MdvFabMenuTriggerAttrs = { ref: trigger, title: 'Create a preview item' }
const open = ref(false)
const allowOpen = ref(false)
const rejectNextClose = ref(false)
const message = ref('Allow opening before requesting the menu.')
const closeReason = ref('(none)')

function update(value: boolean) {
  if (value && !allowOpen.value) message.value = 'Opening rejected.'
  else if (!value && rejectNextClose.value) {
    rejectNextClose.value = false
    message.value = 'Closing rejected once. Try again.'
  } else {
    open.value = value
    message.value = `${value ? 'Opening' : 'Closing'} accepted.`
  }
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="allowOpen" label="Allow opening" />
      <MdvCheckbox v-model="rejectNextClose" label="Reject the next close request" />
    </div>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="menu?.open()">Request open</MdvButton>
      <MdvButton variant="outlined" @click="menu?.close()">Request close</MdvButton>
      <MdvButton variant="text" @click="menu?.toggle()">Toggle menu</MdvButton>
      <MdvButton variant="text" @click="menu?.focus()">Focus trigger</MdvButton>
    </div>
    <div class="relative min-h-64 rounded-xl bg-mdv-surface-container-low p-5 pb-24">
      <p class="text-sm text-mdv-on-surface-variant" role="status">Open: {{ open }} · {{ message }} · Last close: {{ closeReason }}</p>
      <MdvFabMenu ref="menu" :model-value="open" :trigger-attrs="triggerAttrs" label="Controlled creation" close-label="Close controlled creation" position="absolute" :offset="16" @update:model-value="update" @closed="closeReason = $event.reason">
        <MdvFabMenuItem label="Create note" />
        <MdvFabMenuItem label="Create collection" />
      </MdvFabMenu>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

`open()`、`close()`、`toggle()` 只请求状态变化，返回 `void`，不会返回接受情况或等待动画。请观察绑定模型与生命周期事件；`focus()` 用于聚焦真实入口。

入口专属的原生属性、事件应放入 `trigger-attrs`。其中的 `ref` 接受函数或 Vue ref，收到原生按钮，不支持字符串 ref。根节点的 `class`、`style`、`id`、`dir` 属于外壳。按钮类型、ID、可访问名称、展开状态和控制关系由 MDV 管理。

原生 `disabled`、`aria-disabled="true"`、禁用的 fieldset 都会阻止入口激活。传入的 click/keydown 监听器可通过取消对应事件的默认行为，阻止该次内部激活处理。

## 与对话框组合

Expressive 浮层使用浏览器原生 Popover 顶层，不会通过 Teleport 脱离原来的 DOM 父级。因此能够继承局部主题，也可以参与外层 MDV 对话框的焦点管理。

<DemoBlock>
  <FabMenuDialogDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvFabMenu, MdvFabMenuItem, MdvIcon, MdvTextField } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/create-new-folder-outline'
import noteIcon from '@iconify-icons/material-symbols/note-add-outline'

const open = ref(false)
const name = ref('Reading list')
const message = ref('No content added yet.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Open workspace</MdvButton>
    <MdvDialog v-model="open" title="Workspace actions" role="dialog">
      <div class="relative min-h-72 pb-24">
        <MdvTextField v-model="name" label="Workspace name" full-width autofocus />
        <p class="mt-4 text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
        <MdvFabMenu label="Add to workspace" close-label="Close workspace menu" position="absolute" :offset="0">
          <template #icon><MdvIcon :icon="folderIcon" /></template>
          <MdvFabMenuItem @select="message = `Note added to ${name}.`">
            <template #leading><MdvIcon :icon="noteIcon" /></template>
            Add a note
          </MdvFabMenuItem>
          <MdvFabMenuItem label="Add a collection" :icon="folderIcon" @select="message = `Collection added to ${name}.`" />
        </MdvFabMenu>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template>
    </MdvDialog>
  </div>
</template>
```

  </template>
</DemoBlock>

打开工作区，输入名称后选择操作。Escape 优先关闭活动菜单，对话框仍保持可用。示例还通过 `#icon` 自定义入口图标，通过 `#leading` 自定义操作图标。由于组件默认关闭名称为中文，英文演示明确传入了 `close-label`。

## 定位、焦点与动效

- `static` 保留普通布局入口，`absolute`、`fixed` 使用逻辑底部末端定位。`absolute` 需要明确的定位容器。与 Fab 不同，FabMenu 没有 `placement` 属性。
- 省略 `offset` 时，小于 1200px 的视口采用 16px，从 1200px 起采用 24px，安全区另计。显式值会覆盖响应式默认距离。布局仍需为入口和相邻导航预留空间。
- Expressive 为非模态交互，没有遮罩或页面滚动锁。Tab/Shift+Tab 正常访问操作，方向键不用于选择操作。禁用的 Expressive 操作退出 Tab 顺序；Baseline 沿用普通菜单及其禁用项导航语义。
- Escape 关闭并将焦点还给入口。外部点击、焦点或 Tab 离开时，保留新目标的焦点。当前操作被移除或变为不可用时，组件会恢复到可用入口。
- 定位会跟随滚动和视口变化；锚点离开可见视口时请求 outside 关闭。受控父级仍可以拒绝该请求，因此应明确规划接受策略。
- MDV 支持快速反向动画与减少动态效果偏好。需要等待完成时使用 `opened`、`closed`，不要把方法调用视为动画结束。需要原生 Popover 支持，实际支持的浏览器与辅助技术组合仍需验证。

## MdvFabMenu API

### Props

<ApiTable :items="menuProps" />

### 插槽

<SlotsTable :items="menuSlots" />

### 事件

<DocsTable label="浮动操作菜单事件" min-width="32rem">

| 事件 | 参数与时机 |
| --- | --- |
| `update:modelValue` | 请求的 boolean 打开状态，受控父级需要接受。 |
| `open` | 无参数，开始已接受的打开流程。 |
| `opened` | 无参数，进入动画完成。 |
| `close` | `{ reason }`，开始已接受的关闭流程。 |
| `closed` | `{ reason }`，退出动画与浮层清理完成。 |

</DocsTable>

<DocsTable label="浮动操作菜单关闭原因" min-width="32rem">

| 原因 | 来源 |
| --- | --- |
| `trigger` | 激活入口或关闭操作。 |
| `escape` | Escape 关闭。 |
| `outside` | 外部指针操作，或锚点离开可见视口。 |
| `focus-out` | 焦点离开菜单交互范围。 |
| `tab` | Tab 使焦点离开菜单交互范围。 |
| `select` | 未取消且未要求保持打开的操作选择。 |
| `model` | 父级直接修改绑定的打开状态。 |
| `programmatic` | 命令式关闭请求。 |

</DocsTable>

### 方法与入口元素

<DocsTable label="浮动操作菜单实例 API" min-width="31rem">

| 成员 | 类型与作用 |
| --- | --- |
| `open()` | `void`；请求打开。 |
| `close()` | `void`；请求关闭。 |
| `toggle()` | `void`；请求切换打开状态。 |
| `focus(options?)` | `void`；聚焦入口，接受可选的 `FocusOptions`。 |
| `triggerElement` | 当前 `HTMLButtonElement`，挂载前、卸载后为 null。 |

</DocsTable>

## MdvFabMenuItem API

### Props

<ApiTable :items="itemProps" />

### 插槽

<SlotsTable :items="itemSlots" />

### 事件、方法与原生属性

<DocsTable label="浮动操作菜单项事件与方法" min-width="33rem">

| 成员 | 含义 |
| --- | --- |
| `select` 事件 | 可取消的 `MdvFabMenuSelectEvent`，`detail` 包含 `value`、`selected: false`、`originalEvent`。 |
| `focus(options?)` | 聚焦操作项的原生控件，接受可选的 `FocusOptions`。 |

</DocsTable>

原生属性会透传到实际操作控件。Expressive 默认渲染原生按钮（`type="button"`），提供 `href` 时渲染链接；Baseline 转交给 `MdvMenuItem`。按实际需求使用原生表单、链接属性，保留明确文字，不要在操作内部嵌套交互控件。

### 公开类型

```ts
import type {
  MdvFabMenuProps,
  MdvFabMenuItemProps,
  MdvFabMenuVariant,
  MdvFabMenuColor,
  MdvFabMenuSize,
  MdvFabMenuTriggerAttrs,
  MdvFabMenuCloseReason,
  MdvFabMenuCloseDetail,
  MdvFabMenuSelectEvent,
} from '@mdv-ui/mdv'
```
