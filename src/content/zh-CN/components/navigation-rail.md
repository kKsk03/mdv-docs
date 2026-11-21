<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import RailBasicDemo from '@/components/docs/demos/navigationRail/basic.vue'
import RailLinksDemo from '@/components/docs/demos/navigationRail/links.vue'
import RailModalDemo from '@/components/docs/demos/navigationRail/modal.vue'

const railProps: ApiTableItem[] = [
  { name: 'expanded', attribute: 'v-model:expanded', type: 'boolean', default: 'false', description: '受控展开状态。父级需要接受 update:expanded；不绑定时不会自动维护展开状态。' },
  { name: 'alignment', type: "'top' | 'center'", default: "'top'", description: '导航项在滚动区域内的位置。菜单与 FAB 保持在上方。' },
  { name: 'expandedWidth', type: 'string', default: '按内容测量', description: 'CSS 长度。展开宽度受 220–360px 和可用空间约束；省略时根据标签和徽标测量。' },
  { name: 'transparent', type: 'boolean', default: 'false', description: '使导航轨表面透明，不移除模态遮罩。' },
  { name: 'showDivider', type: 'boolean', default: 'false', description: '在靠正文的逻辑边缘显示分割线。' },
]
const modalProps: ApiTableItem[] = [
  { name: 'hideOnCollapse', type: 'boolean', default: 'false', description: '隐藏收起的 96px 窄轨及其布局占位。需要提供可访问的外部按钮以重新打开。' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: 'Escape 请求关闭最上层模态。' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: '完成一次遮罩点击后请求关闭。' },
  { name: 'closeOnSelect', type: 'boolean', default: 'true', description: '普通可用导航项激活后请求关闭。取消点击、新窗口和下载操作不会触发。' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: '关闭动画完成后销毁展开层内容。除非 hideOnCollapse 为 true，否则收起轨仍保留。' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', default: '必填', description: '可见且可访问的目的地文字。长标签可以换行并增加项目高度。' },
  { name: 'href', type: 'string', description: '将原生按钮替换为链接。通过原生属性支持 target、rel 和 download。' },
  { name: 'active', type: 'boolean', default: 'false', description: '当前目的地指示器和 aria-current="page"。路由与页面状态由应用维护。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '阻止激活监听、移除链接 href，并将项目排除在导航轨键盘移动之外。' },
]
const railSlots: SlotTableItem[] = [
  { name: 'default', description: '导航项和仅展开时显示的内容。接收 { expanded, toggle, menuAttrs }。' },
  { name: 'menu', description: '导航项上方的菜单操作。接收 { expanded, toggle, menuAttrs }；将 menuAttrs 绑定到操作按钮一次即可。' },
  { name: 'fab', description: '导航项上方可选的创建操作。接收相同状态；可放置具有名称的 Button、IconButton 或合适的 FAB。' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'icon', description: '装饰性导航图标。接收 { active, expanded }，可切换填充、描边或展开样式。' },
  { name: 'badge', description: '通知内容。接收 { active, expanded }。需要徽标表面时自行组合 MdvBadge；选中项目不会自动清除徽标。' },
]
</script>
# 导航轨

导航轨用于在页面侧边展示主要入口。`MdvNavigationRail` 在布局内展开，`MdvModalNavigationRail` 覆盖正文展开，两者都使用 `MdvNavigationRailItem`。

## 标准导航轨

用 `v-model:expanded` 控制展开，将当前入口设为 `active`。为布局设置明确的高度，并给正文设置 `min-width: 0`，让它在导航轨展开时可以收窄。

<DemoBlock>
  <RailBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvNavigationRail, MdvNavigationRailItem, MdvSelect } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home'
import homeOutlineIcon from '@iconify-icons/material-symbols/home-outline'
import exploreIcon from '@iconify-icons/material-symbols/explore-outline'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import menuIcon from '@iconify-icons/material-symbols/menu'
import editIcon from '@iconify-icons/material-symbols/edit'
import settingsIcon from '@iconify-icons/material-symbols/settings'

const expanded = ref(false)
const current = ref('Home')
const centered = ref(false)
const transparent = ref(false)
const divider = ref(true)
const width = ref('auto')
const drafts = ref(0)
const widths = ['auto', '280px', '360px'].map(value => ({ value, label: value }))
const destinations = [{ label: 'Home', icon: homeOutlineIcon }, { label: 'Explore', icon: exploreIcon }, { label: 'Saved', icon: bookmarkIcon }]
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <MdvCheckbox v-model="centered" label="Center items" />
      <MdvCheckbox v-model="transparent" label="Transparent" />
      <MdvCheckbox v-model="divider" label="Divider" />
      <MdvSelect :model-value="width" :options="widths" label="Expanded width" @update:model-value="width = String($event)" />
    </div>
    <div class="flex h-[34rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationRail v-model:expanded="expanded" :alignment="centered ? 'center' : 'top'" :expanded-width="width === 'auto' ? undefined : width" :transparent="transparent" :show-divider="divider" aria-label="Workspace navigation">
        <template #menu="{ menuAttrs, expanded: isExpanded }">
          <MdvIconButton v-bind="menuAttrs" variant="standard" :aria-label="isExpanded ? 'Collapse rail' : 'Expand rail'"><MdvIcon :icon="menuIcon" /></MdvIconButton>
        </template>
        <template #fab>
          <MdvIconButton variant="tonal" size="m" shape="square" aria-label="Create draft" @click="drafts++"><MdvIcon :icon="editIcon" /></MdvIconButton>
        </template>
        <template #default="{ expanded: isExpanded }">
          <MdvNavigationRailItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" @click="current = destination.label">
            <template #icon="{ active }"><MdvIcon :icon="active && destination.label === 'Home' ? homeIcon : destination.icon" /></template>
            <template v-if="destination.label === 'Explore'" #badge><MdvBadge variant="large" content="3" aria-label="3 new discoveries" /></template>
          </MdvNavigationRailItem>
          <MdvNavigationRailItem v-if="isExpanded" label="Settings" :active="current === 'Settings'" @click="current = 'Settings'">
            <template #icon><MdvIcon :icon="settingsIcon" /></template>
          </MdvNavigationRailItem>
        </template>
      </MdvNavigationRail>
      <div class="min-w-0 flex-1 overflow-auto p-4" :class="expanded ? 'hidden sm:block' : ''">
        <p class="font-medium">{{ current }}</p>
        <p class="mt-3 text-sm text-mdv-on-surface-variant">Standard expansion reserves real layout space. Selection stays under application control.</p>
        <MdvButton class="mt-4" variant="text" @click="expanded = !expanded">Toggle rail</MdvButton>
      </div>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Destination: {{ current }} · Drafts created: {{ drafts }} · Expanded: {{ expanded }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

将 `menuAttrs` 绑定到菜单按钮。它已包含点击处理，不要再绑定 `toggle`。

## 模态导航轨

模态导航轨在布局中保留收起时的宽度，展开时覆盖正文。若用 `hide-on-collapse` 隐藏收起后的导航轨，请提供外部按钮以重新打开。

<DemoBlock>
  <RailModalDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox, MdvDialog, MdvIcon, MdvIconButton, MdvModalNavigationRail, MdvNavigationRailItem } from '@mdv-ui/mdv'
import type { MdvNavigationRailCloseDetail } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import editIcon from '@iconify-icons/material-symbols/edit'

const id = `modal-rail-${useId()}`
const expanded = ref(false)
const immersive = ref(false)
const compose = ref(false)
const current = ref('Home')
const reason = ref('Not closed yet')
function closed(detail: MdvNavigationRailCloseDetail) { reason.value = detail.reason }
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="immersive" label="Hide the collapsed rail" />
    <div class="flex h-[28rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvModalNavigationRail :id="id" v-model:expanded="expanded" :hide-on-collapse="immersive" aria-label="Modal workspace navigation" @closed="closed">
        <template #menu="{ menuAttrs, expanded: isExpanded }"><MdvIconButton v-bind="menuAttrs" variant="standard" :aria-label="isExpanded ? 'Close modal rail' : 'Expand modal rail'"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
        <template #fab><MdvIconButton variant="tonal" size="m" shape="square" aria-label="Compose from rail" @click="compose = true"><MdvIcon :icon="editIcon" /></MdvIconButton></template>
        <MdvNavigationRailItem label="Home" :active="current === 'Home'" @click="current = 'Home'"><template #icon><MdvIcon :icon="homeIcon" /></template></MdvNavigationRailItem>
        <MdvNavigationRailItem label="Saved" :active="current === 'Saved'" @click="current = 'Saved'">
          <template #icon><MdvIcon :icon="bookmarkIcon" /></template>
          <template #badge><MdvBadge variant="large" content="5" aria-label="5 saved updates" /></template>
        </MdvNavigationRailItem>
      </MdvModalNavigationRail>
      <div class="min-w-0 flex-1 overflow-auto p-4">
        <MdvButton :aria-controls="id" :aria-expanded="expanded" @click="expanded = true">Open modal rail</MdvButton>
        <p class="mt-4 text-sm text-mdv-on-surface-variant">Modal expansion overlays the page. The external trigger also works when the collapsed rail is hidden.</p>
      </div>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Destination: {{ current }} · Last close: {{ reason }}</p>
    <MdvDialog v-model="compose" title="New draft" description="This dialog is declared outside the rail slots so only one instance exists.">
      <template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template>
    </MdvDialog>
  </div>
</template>
```

  </template>
</DemoBlock>

用 `aria-label` 或 `aria-labelledby` 为导航命名。模态布局会在两种视图中渲染插槽，因此不要在插槽内写固定 ID 或各自挂载对话框。

## 链接与键盘导航

用 `href` 指定链接目标。集成 Vue Router 时，通过 `RouterLink` 的自定义插槽获取 `href` 和导航方法，根据当前路由设置 `active`。方向键移动焦点，但不会切换当前入口。

<DemoBlock>
  <RailLinksDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvNavigationRail, MdvNavigationRailItem } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import bookIcon from '@iconify-icons/material-symbols/menu-book'
import lockIcon from '@iconify-icons/material-symbols/lock-outline'

const expanded = ref(false)
const accept = ref(true)
const current = ref('Overview')
const message = ref('No navigation requested.')
function update(value: boolean) {
  message.value = `Expansion requested: ${value}${accept.value ? '' : ' (rejected)'}`
  if (accept.value) expanded.value = value
}
function cancel(event: MouseEvent) {
  event.preventDefault()
  message.value = 'Navigation cancelled; the destination is unchanged.'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="accept" label="Accept expansion requests" />
    <div class="flex h-[30rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationRail :expanded="expanded" show-divider aria-label="Controlled destinations" @update:expanded="update">
        <template #menu="{ menuAttrs }"><MdvIconButton v-bind="menuAttrs" variant="standard" aria-label="Toggle controlled rail"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
        <MdvNavigationRailItem label="Overview" :active="current === 'Overview'" @click="current = 'Overview'">
          <template #icon><MdvIcon :icon="homeIcon" /></template>
        </MdvNavigationRailItem>
        <MdvNavigationRailItem label="Material guide" href="https://m3.material.io/components/navigation-rail/overview" target="_blank" rel="noopener noreferrer">
          <template #icon><MdvIcon :icon="bookIcon" /></template>
        </MdvNavigationRailItem>
        <MdvNavigationRailItem label="Cancelled link" href="https://example.com" @click="cancel">
          <template #icon><MdvIcon :icon="bookIcon" /></template>
        </MdvNavigationRailItem>
        <MdvNavigationRailItem label="Unavailable" href="https://example.com" disabled @click="message = 'This must not run.'">
          <template #icon><MdvIcon :icon="lockIcon" /></template>
        </MdvNavigationRailItem>
      </MdvNavigationRail>
      <p class="min-w-0 flex-1 overflow-auto p-4 text-sm text-mdv-on-surface-variant" :class="expanded ? 'hidden sm:block' : ''">Arrow keys move focus without changing the current destination. The external guide opens in a new tab.</p>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }} · Current: {{ current }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### MdvNavigationRail

<ApiTable :items="railProps" />

<SlotsTable :items="railSlots" />

事件为 `update:expanded(value: boolean)`。公开 `focus(options?: FocusOptions): void`。原生 `id`、`class`、`style`、方向、ARIA 和监听作用于导航表面。标准轨没有打开/关闭生命周期，也不公开 `close()`。

### MdvModalNavigationRail

继承标准轨五个属性和所有导航轨插槽，另外提供：

<ApiTable :items="modalProps" />

<DocsTable label="模态导航轨事件与方法">

| 成员 | 参数或返回值 | 含义 |
| --- | --- | --- |
| `update:expanded` | `boolean` | 请求父级接受状态变化。 |
| `open` / `opened` | 无 | 打开被接受 / 打开动画结束。 |
| `close` / `closed` | `MdvNavigationRailCloseDetail` | 关闭被接受 / 关闭动画结束。 |
| `close()` | `Promise<boolean>` | 以 `menu` 原因请求关闭。 |
| `focus()` | `void` | 聚焦已打开模态中的 autofocus 或首个可用交互项。 |

</DocsTable>

关闭详情为 `{ reason: 'menu' | 'escape' | 'scrim' | 'select' | 'model' }`。取消点击、非主键点击、修饰键链接、其他 target 或下载不会按选择关闭。

`class` 和 `style` 作用于布局外壳，`dir`、`data-mdv-theme` 同时影响两种形态；`id`、ARIA 及其余原生属性/监听作用于 dialog，内层导航也接收可访问名称。默认保留展开层内容，`destroyOnClose` 在动画结束后销毁这些内容。

### MdvNavigationRailItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

原生属性与监听转交给按钮/链接，组件管理交互类型、禁用语义、键盘访问及 `aria-current`。公开 `focus(options?: FocusOptions): void` 和 `blur(): void`。没有自定义选择事件或模型，使用原生 `click` 配合应用的目的地状态。

### 公开类型

```ts
import type {
  MdvNavigationRailAlignment,
  MdvNavigationRailProps,
  MdvModalNavigationRailProps,
  MdvNavigationRailCloseReason,
  MdvNavigationRailCloseDetail,
  MdvNavigationRailSlotProps,
  MdvNavigationRailItemProps,
  MdvNavigationRailItemSlotProps,
} from '@mdv-ui/mdv'
```

`MdvNavigationRailSlotProps` 为 `{ expanded, toggle, menuAttrs }`，`toggle(): void` 请求状态变化。项目插槽接收 `{ active, expanded }`。使用图标时按文件导入 Iconify 数据，详见[安装与配置](../getting-started/setup)。
