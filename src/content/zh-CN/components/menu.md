<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import MenuAppearanceDemo from '@/components/docs/demos/menu/appearance.vue'
import MenuSelectionDemo from '@/components/docs/demos/menu/selection.vue'
import MenuActionsDemo from '@/components/docs/demos/menu/actions.vue'
import MenuNestedDemo from '@/components/docs/demos/menu/nested.vue'
import MenuControlledDemo from '@/components/docs/demos/menu/controlled.vue'
import MenuContextDemo from '@/components/docs/demos/menu/context.vue'
import MenuBoundaryDemo from '@/components/docs/demos/menu/boundary.vue'
import MenuDialogDemo from '@/components/docs/demos/menu/dialog.vue'

const menuProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'undefined', description: '展开状态。不传时内部管理，初始关闭；绑定后每次更新请求都需要父级接受。' },
  { name: 'variant', type: "'expressive' | 'baseline'", default: "'expressive'", description: '外观变体。Baseline 始终使用 standard 配色与布局。' },
  { name: 'colorScheme', type: "'standard' | 'vibrant'", default: "'standard'", description: 'Expressive 的容器与选中配色；Baseline 忽略此属性。' },
  { name: 'layout', type: "'standard' | 'grouped'", default: "'standard'", description: 'Expressive grouped 在空间充足时将直接 MenuGroup 子项显示为独立表面；需要滚动时改为连续容器。' },
  { name: 'submenuMode', type: "'flyout' | 'push'", default: "'flyout'", description: '子面板在父面板旁展开，或在同一位置逐级进入并显示返回项。Push 为 MDV 扩展。' },
  { name: 'placement', type: 'MdvMenuPlacement', default: "'bottom-start'", description: '根面板的优先位置。top/bottom/left/right 均可追加 -start 或 -end；空间不足时可能翻转或平移。' },
  { name: 'offset', type: 'number', default: '4', description: '非负 CSS 像素间距。负数归零，非有限值回退到 4。' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', default: "''", description: '可见操作文字与前缀定位文本，默认插槽替换其显示内容。' },
  { name: 'supportingText', type: 'string', default: "''", description: '辅助文字，通过 aria-describedby 自动关联。' },
  { name: 'trailingText', type: 'string', default: "''", description: '装饰性尾部文字，例如快捷键提示；不会注册快捷键。' },
  { name: 'value', type: 'string | number', description: '选择组内普通非链接条目的值。子菜单入口不参与选择。' },
  { name: 'icon', type: 'MdvIconData', description: '本地前置图标数据。选中项会用内置勾替换此区域。' },
  { name: 'trailingIcon', type: 'MdvIconData', description: '本地尾部图标数据。children 插槽优先于尾部内容。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '阻止操作、选择与链接激活，但仍可通过方向键聚焦。' },
  { name: 'href', type: 'string', description: '创建原生链接，除非 children 提供了子菜单。禁用链接移除 href。' },
  { name: 'keepOpen', type: 'boolean', default: 'undefined', description: '覆盖自动关闭策略。实际默认：多选为 true；普通操作、链接、单选为 false。' },
]
const groupProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvMenuModelValue', default: 'undefined', description: '选择状态，与根菜单展开状态独立。不传时内部管理：单选/none 初始 null，多选初始 []。' },
  { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: '操作分组、单选或多选。可选条目需要 value。' },
  { name: 'label', type: 'string', default: "''", description: '可见分组标题与分组可访问名称，label 插槽替换标题。' },
]
const menuSlots: SlotTableItem[] = [
  { name: 'trigger', description: '接收 { triggerProps, open, close }。将完整 triggerProps 绑定到一个原生元素或只有一个原生控件根节点的组件。open 是布尔值；close() 请求关闭。' },
  { name: 'default', description: '放置 MenuItem、MenuGroup 与 Divider，接收 { open, close }。面板保留在当前 DOM 位置。' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: '替换 label，接收 { selected, disabled, expanded }。保留清晰的操作文字名称。' },
  { name: 'leading', description: '未选中时替换前置图标，选中时显示内置勾。接收条目状态；属于装饰区域，不应放独立控件。' },
  { name: 'supporting', description: '替换 supportingText，保留描述 ID 关联，接收条目状态。' },
  { name: 'trailing', description: '替换尾部文字/图标，例如放置 Badge，接收条目状态。此区域对辅助技术隐藏，重要计数应写入操作名称。' },
  { name: 'children', description: '嵌套 MenuItem/MenuGroup，无参数。条目变为子菜单入口，优先于 href、组选择与尾部内容。' },
]
const groupSlots: SlotTableItem[] = [
  { name: 'default', description: '当前组内的条目，无参数。' },
  { name: 'label', description: '替换可见标题，保留分组名称关联，无参数。' },
]
</script>

# 菜单

`MdvMenu` 用于临时操作与少量选择，`MdvContextMenu` 提供右键入口，两者共用 `MdvMenuItem` 与 `MdvMenuGroup`。表单字段应使用 Select 或 Autocomplete，持久目的地应使用导航组件。

## 外观与触发器绑定

完整绑定 `triggerProps`，包括 ref、ID、ARIA 属性与监听器。触发器插槽里的 `open` 是布尔值，并不是打开函数。MDV Button 与 IconButton 可以直接接收该对象；只有图标的入口需要 `aria-label`。

<DemoBlock>
  <MenuAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDivider, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'
import undoIcon from '@iconify-icons/material-symbols/undo'
import copyIcon from '@iconify-icons/material-symbols/content-copy-outline'

const appearances = [
  { variant: 'expressive', colorScheme: 'standard' },
  { variant: 'expressive', colorScheme: 'vibrant' },
  { variant: 'baseline', colorScheme: 'standard' },
] as const
const message = ref('Choose a document action.')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvMenu v-for="appearance in appearances" :key="`${appearance.variant}-${appearance.colorScheme}`" v-bind="appearance">
        <template #trigger="{ triggerProps }">
          <MdvButton v-bind="triggerProps" variant="tonal">{{ appearance.variant }} / {{ appearance.colorScheme }}</MdvButton>
        </template>
        <MdvMenuItem label="Undo" :icon="undoIcon" trailing-text="Ctrl+Z" @select="message = 'Undo requested.'" />
        <MdvMenuItem label="Redo" trailing-text="Ctrl+Y" disabled />
        <MdvDivider />
        <MdvMenuItem label="Duplicate document" supporting-text="Keep the original document." :icon="copyIcon" @select="message = 'A duplicate was created locally.'" />
      </MdvMenu>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Expressive 使用 16px 容器圆角与 20px 图标，Baseline 使用 4px 与 24px。两者均保留阴影和至少 48px 的操作高度，辅助文字与长标签可以撑高。Baseline 忽略 `vibrant` 与 `grouped`。

## 分组、单选与多选

根组件的 `v-model` 控制展开，每个分组独立的 `v-model` 控制选择，字符串与数值保持原类型。默认单选后关闭，多选后保持打开。

<DemoBlock>
  <MenuSelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuModelValue } from '@mdv-ui/mdv'

const scale = ref<MdvMenuModelValue>(1)
const styles = ref<MdvMenuModelValue>(['bold'])
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu layout="grouped">
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Text preferences</MdvButton></template>
      <MdvMenuGroup v-model="scale" selection-mode="single" label="Display scale">
        <MdvMenuItem :value="1" label="Numeric value 1" />
        <MdvMenuItem value="1" label="Text value 1" />
        <MdvMenuItem :value="2" label="Double scale" />
      </MdvMenuGroup>
      <MdvMenuGroup v-model="styles" selection-mode="multiple" label="Text styles">
        <MdvMenuItem value="bold" label="Bold" />
        <MdvMenuItem value="italic" label="Italic" />
        <MdvMenuItem value="underline" label="Underline" disabled />
      </MdvMenuGroup>
    </MdvMenu>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Scale: {{ typeof scale }} {{ JSON.stringify(scale) }} · Styles: {{ JSON.stringify(styles) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

同组内使用唯一值。即使位于选择组中，链接与子菜单入口也仍为操作。每个子菜单都会建立新的分组上下文；该层需要选择时，在 `#children` 内放置自己的 `MdvMenuGroup`。

`layout="grouped"` 的直接内容应为 `MdvMenuGroup`。较短的 Expressive 菜单使用 2px 组间隙与 8px 分组圆角；高度限制导致滚动时，MDV 会切换为连续容器与分隔线。

## 操作、取消与原生链接

`@select` 接收可取消的 `MdvMenuSelectEvent`。同步调用 `event.preventDefault()`，会同时取消选择更新、原生导航与自动关闭。异步权限检查应先取消，再由应用处理结果与展开模型。

<DemoBlock>
  <MenuActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuSelectEvent } from '@mdv-ui/mdv'

const count = ref(0)
const message = ref('No action has run.')
function cancel(event: MdvMenuSelectEvent) {
  event.preventDefault()
  message.value = 'The action was cancelled; the menu stays open.'
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="outlined">Document actions</MdvButton></template>
      <MdvMenuItem label="Increment preview counter" keep-open @select="count++" />
      <MdvMenuItem label="Cancel this action" @select="cancel" />
      <MdvMenuItem label="Notifications, 3 unread" @select="message = 'Notifications requested.'">
        <template #trailing><MdvBadge variant="large" content="3" /></template>
      </MdvMenuItem>
      <MdvMenuItem label="Read the menu design guide" href="https://m3.material.io/components/menus/overview" target="_blank" rel="noopener noreferrer" />
      <MdvMenuItem label="Unavailable guide" href="https://m3.material.io/" disabled />
      <MdvMenuItem label="Finish" @select="message = 'Finished.'" />
    </MdvMenu>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Counter: {{ count }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

`event.detail` 为 `{ value, selected, originalEvent }`。`selected` 表示本次提出的选择状态，不表示受控父级已经接受；普通操作为 `false`。原生 `@click.prevent` 同样可以取消内置激活。

尾部文字、图标与徽标是装饰内容，通知示例将计数写进操作名称。`Ctrl+Z` 这类提示不会自动注册快捷键。独立按钮和表单控件应放在菜单条目之外。

## 多级菜单与紧凑导航

在 `#children` 中放下一层。`flyout` 支持鼠标悬停、点击与逻辑前进/后退方向键；`push` 在同一位置逐级进入，并添加可聚焦的返回项。返回项使用父条目名称，名称为空时回退为 `返回`。

<DemoBlock>
  <MenuNestedDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvMenu, MdvMenuGroup, MdvMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvMenuModelValue, MdvMenuSubmenuMode } from '@mdv-ui/mdv'

const mode = ref<MdvMenuSubmenuMode>('flyout')
const rtl = ref(false)
const font = ref<MdvMenuModelValue>('roboto')
const message = ref('Choose a nested action.')
const modes = [{ value: 'flyout', label: 'flyout' }, { value: 'push', label: 'push' }]
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="mode" :options="modes" label="Submenu mode" @update:model-value="mode = $event as MdvMenuSubmenuMode" />
    <MdvCheckbox v-model="rtl" label="Use right-to-left menus" />
    <div :dir="rtl ? 'rtl' : 'ltr'">
      <MdvMenu :submenu-mode="mode" style="width: 240px">
        <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Formatting</MdvButton></template>
        <MdvMenuItem label="Text">
          <template #children>
            <MdvMenuItem label="Font">
              <template #children>
                <MdvMenuGroup v-model="font" selection-mode="single" label="Font family">
                  <MdvMenuItem value="roboto" label="Roboto" />
                  <MdvMenuItem value="system" label="System default" />
                </MdvMenuGroup>
              </template>
            </MdvMenuItem>
            <MdvMenuItem label="Reset formatting" @select="message = 'Formatting reset.'" />
          </template>
        </MdvMenuItem>
        <MdvMenuItem label="Insert table" @select="message = 'Table requested.'" />
      </MdvMenu>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Font: {{ font }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

紧凑模式由应用选择，MDV 不会根据断点自动切换子菜单方式。RTL 会反转左右导航与箭头方向。子菜单继承整棵菜单的外观与主题，但拥有自己的分组上下文。

## 受控请求与生命周期

显式布尔模型是状态依据，父级拒绝打开或关闭请求时，实际状态不变。分组选择请求与打开状态独立；拒绝选择更新不会自动阻止正常关闭，所以示例为选择项设置了 `keep-open`。

<DemoBlock>
  <MenuControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuModelValue } from '@mdv-ui/mdv'

const menu = useTemplateRef<InstanceType<typeof MdvMenu>>('menu')
const open = ref(false)
const acceptOpen = ref(true)
const acceptClose = ref(true)
const acceptChoice = ref(false)
const choice = ref<MdvMenuModelValue>('draft')
const message = ref('Choice changes are initially rejected.')
const lifecycle = ref<string[]>([])
function requestOpen(value: boolean) {
  const accepted = value ? acceptOpen.value : acceptClose.value
  if (accepted) open.value = value
  message.value = `Open ${value}: ${accepted ? 'accepted' : 'rejected'}.`
}
function requestChoice(value: MdvMenuModelValue) {
  if (acceptChoice.value) choice.value = value
  message.value = `Choice ${value}: ${acceptChoice.value ? 'accepted' : 'rejected'}.`
}
function record(event: string) {
  lifecycle.value = [...lifecycle.value, event].slice(-6)
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
      <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
      <MdvCheckbox v-model="acceptChoice" label="Accept choice requests" />
    </div>
    <div class="flex flex-wrap gap-3">
      <MdvMenu ref="menu" :model-value="open" @update:model-value="requestOpen" @open="record('open')" @opened="record('opened')" @close="record(`close: ${$event.reason}`)" @closed="record(`closed: ${$event.reason}`)">
        <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Controlled menu</MdvButton></template>
        <MdvMenuGroup :model-value="choice" selection-mode="single" label="Document stage" @update:model-value="requestChoice">
          <MdvMenuItem value="draft" label="Draft" keep-open />
          <MdvMenuItem value="review" label="Review" keep-open />
        </MdvMenuGroup>
        <MdvMenuItem label="Close controlled menu" />
      </MdvMenu>
      <MdvButton variant="outlined" @click="menu?.open('last')">Open at last item</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Open: {{ open }} · Stage: {{ choice }} · {{ message }}</p>
    <p class="break-words text-xs text-mdv-on-surface-variant">Lifecycle: {{ lifecycle.join(' → ') || 'none' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

`MdvMenuGroup` 会同时发出 `update:modelValue` 与 `change`，携带请求的新值；即使父级拒绝请求也会发出，并不等待接受。根菜单实际进入/退出时发出 `open`/`close`，对应动效完成后才发出 `opened`/`closed`。被中断的动效不会发出完成事件。

## 右键入口

右键入口在鼠标位置展开；通过 Shift+F10 或 ContextMenu 键触发时，在聚焦区域下方展开。非交互区域需要自行添加可聚焦能力。普通点击不会打开 `MdvContextMenu`。

<DemoBlock>
  <MenuContextDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvContextMenu, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'

const message = ref('No context action selected.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvContextMenu>
      <template #trigger="{ triggerProps }">
        <div v-bind="triggerProps" tabindex="0" class="w-full rounded-xl border border-dashed border-mdv-outline bg-mdv-surface-container p-6 text-sm">
          Right-click this document, or focus here and press Shift+F10.
        </div>
      </template>
      <MdvMenuItem label="Inspect document" @select="message = 'Document details requested.'" />
      <MdvMenuItem label="Archive document" @select="message = 'Document archived locally.'" />
    </MdvContextMenu>
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="outlined">Document options</MdvButton></template>
      <MdvMenuItem label="Inspect document" @select="message = 'Document details requested.'" />
      <MdvMenuItem label="Archive document" @select="message = 'Document archived locally.'" />
    </MdvMenu>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

没有触屏长按实现，也不会自动替换成 Sheet。应为触屏及无法调用右键菜单的用户保留可见的普通菜单入口，上面两个入口执行相同的本地操作。

## 可用空间、滚动与局部主题

根组件可通过 `width`、`max-width` 或 `--mdv-menu-max-height` 调整尺寸。Floating UI 根据视口空间定位，必要时翻转/平移，并跟随滚动和尺寸变化。溢出菜单在内部滚动，聚焦项会保持可见。

<DemoBlock>
  <MenuBoundaryDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'

const selected = ref('No recent document selected.')
</script>

<template>
  <div class="grid gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="min-w-0 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
        <MdvMenu layout="grouped" placement="bottom-end" :offset="8" style="width: 260px; --mdv-menu-max-height: 220px">
          <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="tonal">{{ theme }} recent files</MdvButton></template>
          <MdvMenuGroup label="Recent documents">
            <MdvMenuItem v-for="number in 8" :key="number" :label="`Document ${number}: a longer project description`" supporting-text="ArchiveExportWithALongUnbrokenSupportingValue" @select="selected = `Document ${number} selected.`" />
          </MdvMenuGroup>
          <MdvMenuGroup label="Workspace"><MdvMenuItem label="Create a document" @select="selected = 'New document requested.'" /></MdvMenuGroup>
        </MdvMenu>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ selected }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

面板通过原生手动 Popover top layer 在当前 DOM 位置绘制，保留局部 MDV 主题与方向继承，不会 Teleport 到 `body`，也不锁页面滚动。需要支持 Popover API 的浏览器。颜色来自主题角色，没有通用 `color` 属性。

## Dialog 组合与焦点

菜单可以打开对话框，也可以放在对话框内部。应让对应浮层管理焦点，打开新模态后不要手动把焦点拉回菜单触发器。

<DemoBlock>
  <MenuDialogDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'

const open = ref(false)
const message = ref('No workspace action selected.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Workspace menu</MdvButton></template>
      <MdvMenuItem label="Open workspace dialog" @select="open = true" />
    </MdvMenu>
    <MdvDialog v-model="open" title="Workspace settings" role="dialog" description="Escape closes the topmost menu before closing this dialog.">
      <div class="flex flex-wrap gap-3">
        <MdvMenu>
          <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="tonal">Settings actions</MdvButton></template>
          <MdvMenuItem label="Reset workspace" @select="message = 'Workspace reset locally.'" />
          <MdvMenuItem label="Preview changes" keep-open @select="message = 'Preview requested.'" />
        </MdvMenu>
        <MdvButton variant="text" @click="message = 'Focus continued after the menu.'">After the menu</MdvButton>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Escape 优先关闭最深层菜单；对话框内的菜单先于对话框处理 Escape。Tab 离开菜单后，从触发器对应的位置继续移动；在对话框中时遵守该对话框的焦点范围。通过操作打开 Dialog 后，菜单不会抢回新模态的焦点。

## 键盘与无障碍

<DocsTable label="菜单键盘行为" min-width="32rem">

| 输入 | 行为 |
| --- | --- |
| 触发器点击、Enter、Space、ArrowDown | 普通菜单从首项打开 |
| 触发器 ArrowUp | 从末项打开 |
| ArrowUp / ArrowDown | 在可见项之间循环；禁用操作可聚焦但不能执行 |
| Home / End | 到首项/末项，跳过标题与分隔线 |
| 可打印前缀 | 按操作文字定位，重复相同字母时循环匹配 |
| 逻辑前进/后退方向键 | 进入/返回子菜单，RTL 反转方向 |
| Escape | 先关闭最深层子菜单，再关闭根菜单 |
| Tab / Shift+Tab | 关闭整棵菜单并继续向外移动，不构成菜单 Tab 循环 |

</DocsTable>

面板为 `role="menu"`，选择项为带 `aria-checked` 的 `menuitemradio` 或 `menuitemcheckbox`，普通操作与子菜单入口为 `menuitem`。分组关联标题名称，辅助文字关联描述。禁用项使用 `aria-disabled`，保留键盘可发现性。

选择、Escape 与程序化关闭后，会在合适时机恢复到可用触发器；外部指针/焦点操作与业务主动移焦后保留新目标。减少动态效果时会缩短/移除动效。卸载与 KeepAlive 停用时释放面板、定位、计时器和监听器。SSR 输出关闭态面板，初始为 true 的模型会在客户端挂载后打开。

## API

### MdvMenu 与 MdvContextMenu

两者共用属性、插槽、事件与方法，只有触发行为不同。

<ApiTable :items="menuProps" />

<SlotsTable :items="menuSlots" />

<DocsTable label="菜单根组件事件" min-width="32rem">

| 事件 | 参数与时机 |
| --- | --- |
| `update:modelValue` | 请求新的展开布尔值 |
| `open` / `opened` | 无参数，进入开始/完成 |
| `close` / `closed` | `MdvMenuCloseDetail`，退出开始/完成 |

</DocsTable>

关闭原因：`escape`、`outside`、`focus-out`、`tab`、`select`、`trigger`、`model`、`programmatic`。子面板开关不会重复发出根组件事件。

<DocsTable label="菜单根组件方法" min-width="32rem">

| 方法 | 行为 |
| --- | --- |
| `open(edge?: 'first' \| 'last')` | 请求打开，默认首项，需要已绑定的触发器 |
| `close()` | 请求程序化关闭 |
| `toggle()` | 请求切换展开状态 |
| `focus(edge?: 'first' \| 'last')` | 聚焦已存在根面板中的条目，不负责打开 |

</DocsTable>

这些方法不返回接受状态 Promise。其余原生属性、class、style 和监听器作用于根菜单面板，不作用于触发器。显式 `aria-label`/`aria-labelledby` 可替换自动触发器名称；触发器属性应通过插槽绑定。

### MdvMenuItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

`select` 事件携带 `MdvMenuSelectEvent`。暴露 `focus()` 与 `blur()`。原生属性与监听器作用于实际按钮/链接。操作使用 `type="button"`，不会提交表单。链接保留 `target`、`rel`、`download`；禁用操作会拦截激活监听器。子菜单优先于链接与选择。

### MdvMenuGroup

<ApiTable :items="groupProps" />

<SlotsTable :items="groupSlots" />

事件为 `update:modelValue(value)` 与 `change(value)`，均携带 `MdvMenuModelValue`。没有暴露方法，其余属性透传到 `role="group"` 容器。None 模式不发出选择更新，也不会生成隐藏表单字段。

### 公共类型与范围

```ts
import type {
  MdvMenuProps, MdvMenuVariant, MdvMenuColorScheme, MdvMenuLayout,
  MdvMenuSubmenuMode, MdvMenuPlacement, MdvMenuSelectionMode,
  MdvMenuValue, MdvMenuModelValue, MdvMenuCloseReason, MdvMenuCloseDetail,
  MdvMenuSelectDetail, MdvMenuSelectEvent, MdvMenuSlotProps,
  MdvMenuTriggerProps, MdvMenuTriggerSlotProps, MdvMenuItemSlotProps,
} from '@mdv-ui/mdv'
```

ContextMenu 同样使用 `MdvMenuProps`，没有单独导出 ContextMenu、MenuItem 或 MenuGroup 的 Props 接口。菜单不负责表单校验、异步业务编排、路由、全局快捷键或移动端 Sheet 替代方案。
