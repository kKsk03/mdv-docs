<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import AppearanceDemo from '@/components/docs/demos/tabs/appearance.vue'
import KeyboardDemo from '@/components/docs/demos/tabs/keyboard.vue'
import PanelsDemo from '@/components/docs/demos/tabs/panels.vue'

const tabsProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvTabValue', description: '当前选中值。省略时由组件内部选择首个可用标签。' },
  { name: 'variant', type: 'MdvTabsVariant', default: "'primary'", description: "'primary' 或 'secondary'。" },
  { name: 'scrollable', type: 'boolean', default: 'false', description: '标签按内容宽度排列并可在条内横向滚动，而不是等宽分布。' },
  { name: 'showDivider', type: 'boolean', default: 'true', description: '显示标签栏底部分隔线。' },
  { name: 'iconPosition', type: 'MdvTabsIconPosition', description: "'top' 或 'leading'；主标签默认 'top'，次级标签默认 'leading'。" },
  { name: 'activation', type: 'MdvTabsActivation', default: "'manual'", description: "'manual' 将焦点与选择分开；'automatic' 在聚焦时请求选择。" },
  { name: 'tabNavigation', type: 'MdvTabsTabNavigation', default: "'all'", description: "'all' 允许逐项 Tab；'active' 为整组保留一个 Tab 入口。" },
  { name: 'swipeable', type: 'boolean', default: 'false', description: '允许从面板的非交互内容区触摸横滑，请求切换至相邻的可用标签。' },
]
const tabProps: ApiTableItem[] = [
  { name: 'value', type: 'MdvTabValue', description: '必填。组内唯一，值和类型须与面板一致。' },
  { name: 'label', type: 'string', default: "''", description: '未提供默认插槽时显示的文本。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁止激活，也不参与组内键盘导航。' },
]
const panelProps: ApiTableItem[] = [
  { name: 'value', type: 'MdvTabValue', description: '必填。值和类型须与标签一致。' },
  { name: 'lazy', type: 'boolean', default: 'false', description: '首次选中才挂载正文，之后保留。' },
  { name: 'destroyOnHide', type: 'boolean', default: 'false', description: '仅在选中时挂载正文，优先于 lazy 的保留规则。' },
]
const tabsSlots: SlotTableItem[] = [
  { name: 'default', description: '放置 MdvTab 控件。' },
  { name: 'panels', description: '放置对应的 MdvTabPanel。' },
]
const tabSlots: SlotTableItem[] = [
  { name: 'default', description: '替换可见标签，接收 { active: boolean }。' },
  { name: 'icon', description: '装饰图标，接收 { active: boolean }。' },
  { name: 'badge', description: '可选徽标，例如 MdvBadge；接收 { active: boolean }。' },
]
const panelSlots: SlotTableItem[] = [
  { name: 'default', description: '面板内容，接收 { active: boolean }。' },
]
</script>
# 标签页

用 `MdvTabs` 切换同一页面的相关视图。把 `MdvTab` 放在默认插槽中，将 `MdvTabPanel` 放在 `#panels`。

## 主标签与次级标签

让每个标签及其面板使用相同的 `value`。主要视图用 `variant="primary"`，视图内的子分类用 `secondary`。

<DemoBlock>
  <AppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import history from '@iconify-icons/material-symbols/history'
import overview from '@iconify-icons/material-symbols/space-dashboard-outline'
import { ref } from 'vue'
import { MdvBadge, MdvIcon, MdvSwitch, MdvTab, MdvTabPanel, MdvTabs } from '@mdv-ui/mdv'
import type { MdvTabValue } from '@mdv-ui/mdv'

const selected = ref<MdvTabValue>('overview')
const secondary = ref(false)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSwitch v-model="secondary" label="Use secondary tabs" />
    <MdvTabs
      v-model="selected"
      :variant="secondary ? 'secondary' : 'primary'"
      aria-label="Project views"
    >
      <MdvTab value="overview" label="Overview">
        <template #icon><MdvIcon :icon="overview" /></template>
      </MdvTab>
      <MdvTab value="activity" label="Activity" aria-label="Activity, 3 unread updates">
        <template #icon><MdvIcon :icon="history" /></template>
        <template #badge><MdvBadge variant="large" :content="3" aria-hidden="true" /></template>
      </MdvTab>
      <template #panels>
        <MdvTabPanel value="overview" class="p-3">Project status and milestones.</MdvTabPanel>
        <MdvTabPanel value="activity" class="p-3">Recent changes to the project.</MdvTabPanel>
      </template>
    </MdvTabs>
  </div>
</template>
```

  </template>
</DemoBlock>

## 键盘选择

设置 `tab-navigation="active"` 后，标签栏只有一个 Tab 停靠点。用方向键移动焦点；在 `activation="manual"` 模式下，按 Enter 或空格才会选中。

<DemoBlock>
  <KeyboardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSwitch, MdvTab, MdvTabPanel, MdvTabs } from '@mdv-ui/mdv'
import type { MdvTabValue } from '@mdv-ui/mdv'

const selected = ref<MdvTabValue>('summary')
const automatic = ref(false)
const lock = ref(false)
const result = ref('No selection request yet.')

function request(value: MdvTabValue) {
  if (lock.value) {
    result.value = `Rejected: ${value}.`
    return
  }
  selected.value = value
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvSwitch v-model="automatic" label="Select on focus" />
    <MdvSwitch v-model="lock" label="Keep the current panel" />
    <MdvTabs
      :model-value="selected"
      :activation="automatic ? 'automatic' : 'manual'"
      tab-navigation="active"
      aria-label="Report sections"
      @update:model-value="request"
      @change="result = `Accepted: ${$event}.`"
    >
      <MdvTab value="summary" label="Summary" />
      <MdvTab value="archive" label="Archive" disabled />
      <MdvTab value="details" label="Details" />
      <template #panels>
        <MdvTabPanel value="summary" class="p-3">Key facts at a glance.</MdvTabPanel>
        <MdvTabPanel value="archive" class="p-3">Archived reports are unavailable.</MdvTabPanel>
        <MdvTabPanel value="details" class="p-3">Additional figures and notes.</MdvTabPanel>
      </template>
    </MdvTabs>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 滚动与面板内容

标签较多时用 `scrollable`。在 `MdvTabPanel` 上用 `lazy` 让内容首次显示时才挂载，或用 `destroy-on-hide` 在每次隐藏时卸载内容。

<DemoBlock>
  <PanelsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvTab, MdvTabPanel, MdvTabs, MdvTextField } from '@mdv-ui/mdv'
import type { MdvTabValue } from '@mdv-ui/mdv'

const selected = ref<MdvTabValue>('retained')
</script>

<template>
  <MdvTabs
    v-model="selected"
    class="min-w-0 max-w-md"
    scrollable
    swipeable
    aria-label="Draft workspace"
  >
    <MdvTab value="retained" label="Retained draft" />
    <MdvTab value="lazy" label="First-visit draft" />
    <MdvTab value="reset" label="Reset on return" />
    <MdvTab value="notes" label="Review and release notes" />
    <template #panels>
      <MdvTabPanel value="retained" class="space-y-3 p-3">
        <p>This field stays mounted when the panel is hidden.</p>
        <MdvTextField label="Retained draft" full-width />
      </MdvTabPanel>
      <MdvTabPanel value="lazy" class="space-y-3 p-3" lazy>
        <p>This field mounts on your first visit and keeps its draft afterward.</p>
        <MdvTextField label="First-visit draft" full-width />
      </MdvTabPanel>
      <MdvTabPanel value="reset" class="space-y-3 p-3" destroy-on-hide>
        <p>This field starts fresh each time you return.</p>
        <MdvTextField label="Temporary draft" full-width />
      </MdvTabPanel>
      <MdvTabPanel value="notes" class="p-3">
        On a touch screen, swipe across this text to go back to the previous panel.
      </MdvTabPanel>
    </template>
  </MdvTabs>
</template>
```

  </template>
</DemoBlock>

---

## API

### MdvTabs

<ApiTable :items="tabsProps" />
<SlotsTable :items="tabsSlots" />

`focus(value?: MdvTabValue)` 聚焦指定的可用标签；省略参数时聚焦当前可用项或首个可用项。普通聚焦仍遵循自动激活规则。`aria-label`、`aria-labelledby` 和 `aria-describedby` 传给实际标签栏；其余 `id`、`class`、`style`、`dir` 等属性及原生监听器落在组的外层。

### MdvTab

<ApiTable :items="tabProps" />
<SlotsTable :items="tabSlots" />

标签为 `type="button"`，不会提交表单。实例公开 `focus(options?: FocusOptions)` 和 `blur()`。可自定义原生 ID 供面板引用，角色、Tab 顺序、`aria-selected` 和 `aria-controls` 由标签组统一管理。取消原生 `click` 可阻止该次点击选择；取消 `keydown` 可阻止内置左右键和 Home／End 处理。自动模式下的聚焦选择不依赖点击。

### MdvTabPanel

<ApiTable :items="panelProps" />
<SlotsTable :items="panelSlots" />

面板的 `id`、`role`、`aria-labelledby`、`hidden` 和 `inert` 由标签组维护，其余原生属性透传。默认 `tabindex="0"`；不需要额外 Tab 停靠点时可设为 `tabindex="-1"`。面板或其内容的布局、留白由应用控制；组件不限定高度。

### 公开类型

```ts
import type {
  MdvTabValue,
  MdvTabsVariant,
  MdvTabsIconPosition,
  MdvTabsActivation,
  MdvTabsTabNavigation,
  MdvTabsProps,
  MdvTabProps,
  MdvTabPanelProps,
  MdvTabSlotProps,
} from '@mdv-ui/mdv'
```
