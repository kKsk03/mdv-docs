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
import MenuContextDemo from '@/components/docs/demos/menu/context.vue'

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

用 `MdvMenu` 展示控件关联的操作或选项，用 `MdvContextMenu` 提供右键等上下文操作。

## 菜单触发控件

将 `#trigger` 提供的完整 `triggerProps` 绑定到同一个按钮。如果按钮只显示图标，请提供无障碍名称。

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

## 选择分组

用 `MdvMenuGroup` 组织相关选项。分组选择与菜单展开状态分别绑定。单选默认关闭菜单，多选默认保持打开。

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

## 操作与链接

链接项用 `href`。在 `select` 中调用 `preventDefault()` 可取消选择及随后的跳转或关闭。如果判断是异步的，请在等待前先取消。

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

## 子菜单

把子菜单放在菜单项的 `#children` 插槽中。空间较窄时可用 `submenu-mode="push"` 原位显示子菜单。返回项使用父菜单项的标签或插槽文字。

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

## 上下文菜单

在可聚焦的触发控件上通过右键或 Shift+F10 打开上下文菜单。对于需要容易找到的操作，请提供可见入口。

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

---

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
