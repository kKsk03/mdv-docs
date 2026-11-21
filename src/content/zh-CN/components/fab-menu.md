<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import FabMenuBasicDemo from '@/components/docs/demos/fabMenu/basic.vue'
import FabMenuSelectionDemo from '@/components/docs/demos/fabMenu/selection.vue'
import FabMenuControlledDemo from '@/components/docs/demos/fabMenu/controlled.vue'

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

用 `MdvFabMenu` 从悬浮操作按钮展开相关操作。每项使用一个 `MdvFabMenuItem`。

## Expressive 与 Baseline

用 `variant="expressive"` 显示展开式操作列表，或用 `baseline` 显示常规菜单。请为触发按钮提供明确的名称。

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

## 选择操作

处理 `select` 并读取 `event.detail.value` 识别操作。使用 `keep-open` 让菜单在操作后保持打开，或调用 `preventDefault()` 取消选择。

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

## 展开状态与触发按钮

用 `v-model` 控制菜单开关。通过 `trigger-attrs` 向内置按钮传递 `disabled` 等原生属性。

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

---

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
