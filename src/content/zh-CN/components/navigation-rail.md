<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import RailBasicDemo from '@/components/docs/demos/navigationRail/basic.vue'
import RailLinksDemo from '@/components/docs/demos/navigationRail/links.vue'
import RailModalDemo from '@/components/docs/demos/navigationRail/modal.vue'
import RailPolicyDemo from '@/components/docs/demos/navigationRail/policy.vue'
import RailThemeDemo from '@/components/docs/demos/navigationRail/theme.vue'

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

`MdvNavigationRail` 在正文旁常驻主要目的地，`MdvModalNavigationRail` 则覆盖正文展开。两者都使用 `MdvNavigationRailItem` 表示目的地。本页对应已安装的 **MDV 0.1.5**。

收起轨适合少量主要目的地，通常为 3–7 个。保留明确的标签，次要目的地可以在展开后显示。组件不决定响应式断点，也不会自动替换为抽屉或底部导航栏。

## 标准布局与展开

为外层 flex/grid 布局提供明确高度，并为正文设置 `min-width: 0`。收起宽度为 96px；标准轨展开会改变真实布局宽度，正文随之让位。示例在窄屏展开时隐藏旁边的说明区域，确保导航操作仍然可用。

`menuAttrs` 包含 `aria-controls`、`aria-expanded` 和 `onClick`，绑定到菜单按钮一次即可。再加 `@click="toggle"` 会触发两次切换。FAB 插槽不内置创建逻辑，示例由应用统计创建草稿次数。

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

## 受控请求、链接与键盘焦点

`expanded` 是受控状态：父级接受 `update:expanded` 才会改变展开结果。项目的 `active` 同样由应用管理。移动焦点不会选中目的地，点击也不会自动修改 `active`。

设置 `href` 后渲染原生链接，保留修饰键、`target`、`rel` 和下载行为。同步调用 `preventDefault()` 可以取消导航及随后的选择关闭。禁用项会阻止激活回调。接入 Vue Router 时，可使用自定义 `RouterLink` 插槽提供的 `href`、导航处理函数，并从路由计算 `active`，保留真实链接语义。

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

## 模态展开与沉浸布局

模态展开保留收起轨的 96px 占位，展开层通过原生 dialog 进入顶层覆盖正文。MDV 提供遮罩、模态焦点限制、Escape 和焦点恢复。使用 `aria-label` 或 `aria-labelledby` 命名导航；内置兜底名称为中文。

`hide-on-collapse` 会移除收起轨及其占位。必须保留可访问的外部菜单按钮，并关联 `aria-controls` 和 `aria-expanded`。示例中的外部按钮在两种布局下均可使用。

默认情况下，模态插槽会分别为收起轨和展开层渲染两份内容，接收到不同的 `expanded`。避免在其中硬编码重复 ID，或重复声明独立浮层。示例将嵌套 Dialog 声明在导航轨外部。

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

## 关闭策略与内容生命周期

`closeOnEsc`、`closeOnScrim`、`closeOnSelect` 分别控制对应的关闭请求。菜单按钮和公开的 `close()` 仍可请求关闭。父级保持 `expanded` 不变即可拒绝请求，此时不会触发已接受关闭的生命周期。Navigation Rail **没有 `beforeClose` 属性**；需要确认时由应用决定是否接受状态更新。

`close(): Promise<boolean>` 表示父级是否接受关闭，不代表动画完成。动画结束使用 `closed`。调用此方法的原因是 `menu`；直接修改模型的原因是 `model`。

下面的便笺属于 TextField 内部状态，普通关闭后会保留；启用 `destroy-on-close` 后，关闭再打开会创建新实例。保存在导航外部的模型不会随销毁重置。示例还提供直接改模型的关闭按钮，便于在拒绝请求时退出。

<DemoBlock>
  <RailPolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvModalNavigationRail, MdvNavigationRailItem, MdvTextField } from '@mdv-ui/mdv'
import type { MdvNavigationRailCloseDetail } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const id = `rail-policy-${useId()}`
const rail = useTemplateRef<InstanceType<typeof MdvModalNavigationRail>>('rail')
const expanded = ref(false)
const acceptClose = ref(true)
const closeOnEsc = ref(true)
const closeOnScrim = ref(true)
const closeOnSelect = ref(true)
const destroy = ref(false)
const message = ref('No close request yet.')
function update(value: boolean) {
  if (value || acceptClose.value) expanded.value = value
  else message.value = 'Parent rejected closing.'
}
async function close() { message.value = `close() accepted: ${await rail.value?.close()}` }
function closed(detail: MdvNavigationRailCloseDetail) { message.value = `Closed: ${detail.reason}` }
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="closeOnEsc" label="Escape closes" />
      <MdvCheckbox v-model="closeOnScrim" label="Scrim closes" />
      <MdvCheckbox v-model="closeOnSelect" label="Selection closes" />
      <MdvCheckbox v-model="destroy" label="Destroy expanded content on close" />
    </div>
    <MdvButton :aria-controls="id" :aria-expanded="expanded" @click="expanded = true">Open policy example</MdvButton>
    <MdvModalNavigationRail :id="id" ref="rail" :expanded="expanded" hide-on-collapse :close-on-esc="closeOnEsc" :close-on-scrim="closeOnScrim" :close-on-select="closeOnSelect" :destroy-on-close="destroy" aria-label="Rail close policy" @update:expanded="update" @closed="closed">
      <template #menu="{ menuAttrs }"><MdvIconButton v-bind="menuAttrs" variant="standard" aria-label="Request policy close"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
      <MdvNavigationRailItem label="Saved"><template #icon><MdvIcon :icon="bookmarkIcon" /></template></MdvNavigationRailItem>
      <div class="grid gap-3 px-5 py-4">
        <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
        <MdvTextField label="Local note" placeholder="Type, close, then reopen" />
        <MdvButton variant="outlined" @click="close">Request close()</MdvButton>
        <MdvButton variant="text" @click="expanded = false">Close directly</MdvButton>
        <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
      </div>
    </MdvModalNavigationRail>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 滚动、长标签、局部主题与 RTL

两种形态的标签都允许换行。展开宽度根据标签、徽标或 `expanded-width` 测量，并受到可用空间约束。为导航设置有限高度，使导航项独立滚动，菜单和 FAB 仍可访问。主题色、逻辑边缘、焦点轮廓和减少动态效果由 MDV 处理，示例只修改局部容器主题与方向。

<DemoBlock>
  <RailThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvCheckbox, MdvIcon, MdvIconButton, MdvNavigationRail, MdvNavigationRailItem } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const expanded = ref(true)
const dark = ref(false)
const rtl = ref(false)
const current = ref('A shared workspace with a long destination label')
const labels = ['A shared workspace with a long destination label', 'Reading list', 'Project drafts', 'Notifications', 'Recent activity', 'Archive', 'Account settings']
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="dark" label="Local dark theme" /><MdvCheckbox v-model="rtl" label="Right to left" /></div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="flex h-[27rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low text-mdv-on-surface">
      <MdvNavigationRail v-model:expanded="expanded" expanded-width="280px" show-divider aria-label="Scrollable themed destinations">
        <template #menu="{ menuAttrs }"><MdvIconButton v-bind="menuAttrs" variant="standard" aria-label="Toggle themed rail"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
        <MdvNavigationRailItem v-for="(label, index) in labels" :key="label" :label="label" :active="current === label" @click="current = label">
          <template #icon><MdvIcon :icon="bookmarkIcon" /></template>
          <template v-if="index === 0" #badge><MdvBadge variant="large" content="99+" aria-label="More than 99 updates" /></template>
        </MdvNavigationRailItem>
      </MdvNavigationRail>
      <p class="min-w-0 flex-1 overflow-auto p-4 text-sm" :class="expanded ? 'hidden sm:block' : ''">Long labels wrap. Only the destinations scroll; the menu remains reachable.</p>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 无障碍与集成

<DocsTable label="导航轨键盘操作">

| 按键或操作 | 行为 |
| --- | --- |
| Tab / Shift+Tab | 依次访问可用目的地与其他普通控件。 |
| 上 / 下方向键 | 循环移动目的地焦点，跳过禁用或隐藏项；不修改选中状态。 |
| Home / End | 聚焦首个或最后一个可用目的地。 |
| Enter / Space | 使用原生按钮或链接行为；Space 激活按钮。 |
| 模态内 Escape | 启用时请求关闭，仅最上层模态处理。 |
| 标准轨 `focus(options?)` | 聚焦当前可用项，否则聚焦首个可用项。 |

</DocsTable>

使用项目提供的标签，不在项目内部再嵌套交互链接。通知数量有意义时应为徽标提供说明。切换页面后，应用负责更新目的地状态，并按需将焦点移到新内容。导航轨宽度变化与页面切换过渡相互独立。

组件使用 `nav` 和原生按钮/链接，不是 `menu`。不额外提供滑动手势、隐藏标签模式、密度变体或自动移动端替换。模态继承所在位置的主题和方向，无需应用手写 Teleport。真实触摸、读屏、强制颜色和 SSR/hydration 仍需结合实际应用验证。

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
