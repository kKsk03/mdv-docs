<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DrawerBasicDemo from '@/components/docs/demos/navigationDrawer/basic.vue'
import DrawerGroupsDemo from '@/components/docs/demos/navigationDrawer/groups.vue'
import DrawerModalDemo from '@/components/docs/demos/navigationDrawer/modal.vue'
import DrawerResponsiveDemo from '@/components/docs/demos/navigationDrawer/responsive.vue'

const drawerProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'true / false', description: '打开状态。标准抽屉默认为 true，模态抽屉默认为 false。绑定模型以接收更新请求；省略后不会改为内部管理打开状态。' },
  { name: 'title', type: 'string', default: "''", description: '头部标题，也用于默认无障碍命名。header 插槽替换标题；可显式指定无障碍名称。' },
  { name: 'width', type: 'string', default: "'360px'", description: '面板宽度，使用 CSS 长度。标准抽屉受父级可用空间约束，模态抽屉受视口可用空间约束。' },
  { name: 'beforeClose', type: '(detail: Readonly<MdvNavigationDrawerCloseDetail>) => boolean | void | Promise<boolean | void>', description: '可选的同步或异步关闭守卫。返回 false 阻止关闭，其余成功结果允许请求更新模型。直接修改模型会绕过守卫。' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: '退出动画结束后卸载插槽内容。默认保留内部状态；销毁内容不会自动重置父级持有的模型。' },
]
const modalProps: ApiTableItem[] = [
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: '使用 Escape 请求关闭位于最顶层的模态抽屉。' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: '完整点击遮罩后请求关闭。' },
  { name: 'closeOnSelect', type: 'boolean', default: 'true', description: '正常激活可用目的地后请求关闭。被取消的点击、原生新窗口操作或下载不会自动关闭。' },
  { name: 'closeOnSwipe', type: 'boolean', default: 'true', description: '允许朝逻辑起始侧滑动关闭。未达到条件或被拒绝的手势会回弹。' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', required: true, description: '目的地文本。长文本在视觉上省略，完整名称仍供辅助技术读取。' },
  { name: 'href', type: 'string', description: '使用原生链接代替按钮。禁用链接会移除 href。' },
  { name: 'active', type: 'boolean', default: 'false', description: '当前目的地样式和 aria-current="page"。由应用提供路由或页面状态。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '阻止激活，并从键盘导航中排除该目的地；不影响相邻项目。' },
  { name: 'badge', type: 'string | number', description: '尾部文字，也显示数值 0。badge 插槽优先；此属性不会自动创建 MdvBadge。' },
]
const groupProps: ApiTableItem[] = [
  { name: 'label', type: 'string', required: true, description: '静态分组标题或可折叠分组的按钮文字。' },
  { name: 'collapsible', type: 'boolean', default: 'false', description: 'false 显示静态分组标题；true 显示可展开或收起子项的按钮。' },
  { name: 'expanded', attribute: 'v-model:expanded', type: 'boolean', default: 'undefined', description: '展开状态。省略时由内部管理，初始展开；显式布尔值需由父级接收 update:expanded。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '仅禁用分组的展开按钮，不会递归禁用内部目的地。' },
  { name: 'divider', type: 'boolean', default: 'false', description: '在分组之前添加组件提供的分割线。' },
]
const drawerSlots: SlotTableItem[] = [
  { name: 'default', description: '放置 NavigationDrawerItem 和 NavigationDrawerGroup。参数为 { close }，close(): Promise<boolean> 请求带守卫的 action 关闭。' },
  { name: 'header', description: '替换标题区域。参数为 { close }；自定义后仍需提供明确的抽屉无障碍名称。' },
  { name: 'footer', description: '位于目的地滚动列表之外，适合放置明确的关闭操作。参数为 { close }。' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'icon', description: '装饰性前置图标。参数为 { active }，可据此切换填充或描边图标数据。' },
  { name: 'badge', description: '尾部文字或 MdvBadge，优先于 badge 属性。参数为 { active }。重要通知信息还应包含在目的地的无障碍名称中。' },
]
const groupSlots: SlotTableItem[] = [
  { name: 'default', description: '分组中的目的地或嵌套分组。参数为 { expanded }。' },
  { name: 'label', description: '替换静态标题或展开按钮的文字。参数为 { expanded }，需保留有意义的文本名称。' },
  { name: 'icon', description: '静态分组标题或展开按钮的装饰性图标。参数为 { expanded }。' },
]
</script>
# 导航抽屉

导航抽屉适合容纳较多的导航入口。`MdvNavigationDrawer` 在正文旁占据布局空间，`MdvModalNavigationDrawer` 覆盖正文。两者共用 `MdvNavigationDrawerItem` 和 `MdvNavigationDrawerGroup`。

## 标准抽屉

在高度明确的 Flex 布局中，将标准抽屉放在正文前，给正文设置 `min-width: 0` 以便收窄。用 `active` 标记当前入口。

<DemoBlock>
  <DrawerBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvIcon, MdvNavigationDrawer, MdvNavigationDrawerItem, MdvSelect } from '@mdv-ui/mdv'
import inboxIcon from '@iconify-icons/material-symbols/inbox'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import archiveIcon from '@iconify-icons/material-symbols/archive-outline'

const id = `standard-example-${useId()}`
const open = ref(true)
const current = ref('Inbox')
const width = ref('280px')
const widths = ['240px', '280px', '360px'].map(value => ({ value, label: value }))
const destinations = [{ label: 'Inbox', icon: inboxIcon }, { label: 'Saved', icon: bookmarkIcon }, { label: 'Archive', icon: archiveIcon }]
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <MdvButton :aria-controls="id" :aria-expanded="open" @click="open = !open">Toggle standard drawer</MdvButton>
      <MdvSelect :model-value="width" :options="widths" label="Drawer width" @update:model-value="width = String($event)" />
    </div>
    <div class="flex h-80 min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationDrawer :id="id" v-model="open" title="Library" :width="width">
        <MdvNavigationDrawerItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" @click="current = destination.label">
          <template #icon><MdvIcon :icon="destination.icon" /></template>
        </MdvNavigationDrawerItem>
        <template #footer="{ close }"><MdvButton variant="text" @click="close()">Close standard drawer</MdvButton></template>
      </MdvNavigationDrawer>
      <div class="min-w-0 flex-1 overflow-auto p-4" :class="open ? 'hidden sm:block' : ''">
        <p class="font-medium">{{ current }}</p>
        <p class="mt-3 text-sm text-mdv-on-surface-variant">The drawer reserves layout space. Selecting a destination keeps it open.</p>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current destination: {{ current }} · Open: {{ open }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 分组与徽标

使用分组提供小节标题。用 `collapsible` 让分组可展开，用 `divider` 添加分隔线，用入口的 `badge` 插槽显示数量或简短状态。

<DemoBlock>
  <DrawerGroupsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox, MdvIcon, MdvNavigationDrawer, MdvNavigationDrawerGroup, MdvNavigationDrawerItem } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const drawer = useTemplateRef<InstanceType<typeof MdvNavigationDrawer>>('drawer')
const expanded = ref(true)
const accept = ref(true)
const current = ref('Design')
const message = ref('Group changes are accepted.')
function requestExpanded(value: boolean) {
  if (accept.value) expanded.value = value
  message.value = `Expanded ${value}: ${accept.value ? 'accepted' : 'rejected'}.`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="accept" label="Accept project group changes" />
    <MdvButton variant="outlined" @click="drawer?.focus()">Focus current destination</MdvButton>
    <div class="h-96 w-full max-w-90 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationDrawer ref="drawer" title="Workspace">
        <MdvNavigationDrawerGroup label="Mail">
          <MdvNavigationDrawerItem label="Inbox" :badge="0" :active="current === 'Inbox'" @click="current = 'Inbox'" />
          <MdvNavigationDrawerItem label="Unavailable mailbox" disabled />
        </MdvNavigationDrawerGroup>
        <MdvNavigationDrawerGroup label="Projects" collapsible divider :expanded="expanded" @update:expanded="requestExpanded">
          <template #icon><MdvIcon :icon="folderIcon" /></template>
          <MdvNavigationDrawerItem label="Design" :active="current === 'Design'" aria-label="Design, 3 updates" @click="current = 'Design'">
            <template #badge><MdvBadge variant="large" content="3" /></template>
          </MdvNavigationDrawerItem>
          <MdvNavigationDrawerGroup label="Archive" collapsible>
            <MdvNavigationDrawerItem label="Research" :active="current === 'Research'" @click="current = 'Research'" />
          </MdvNavigationDrawerGroup>
        </MdvNavigationDrawerGroup>
        <MdvNavigationDrawerGroup label="Administration" collapsible disabled divider>
          <MdvNavigationDrawerItem label="Read-only audit log" :active="current === 'Read-only audit log'" @click="current = 'Read-only audit log'" />
        </MdvNavigationDrawerGroup>
      </MdvNavigationDrawer>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 模态抽屉

用带名称的按钮打开模态抽屉，为抽屉提供无障碍名称。如果需要在抽屉内关闭，请提供对应操作。绑定模型以响应关闭请求。

<DemoBlock>
  <DrawerModalDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvIcon, MdvModalNavigationDrawer, MdvNavigationDrawerGroup, MdvNavigationDrawerItem } from '@mdv-ui/mdv'
import inboxIcon from '@iconify-icons/material-symbols/inbox'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const id = `modal-example-${useId()}`
const open = ref(false)
const current = ref('Inbox')
const lastClose = ref('none')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-controls="id" :aria-expanded="open" @click="open = true">Open modal drawer</MdvButton>
    <MdvModalNavigationDrawer :id="id" v-model="open" title="Mail destinations" @closed="lastClose = $event.reason">
      <MdvNavigationDrawerItem label="Inbox" :active="current === 'Inbox'" :badge="12" @click="current = 'Inbox'">
        <template #icon><MdvIcon :icon="inboxIcon" /></template>
      </MdvNavigationDrawerItem>
      <MdvNavigationDrawerItem label="Saved" :active="current === 'Saved'" @click="current = 'Saved'">
        <template #icon><MdvIcon :icon="bookmarkIcon" /></template>
      </MdvNavigationDrawerItem>
      <MdvNavigationDrawerGroup label="Folders" collapsible divider>
        <MdvNavigationDrawerItem label="Reports" :active="current === 'Reports'" @click="current = 'Reports'" />
        <MdvNavigationDrawerItem label="Unavailable folder" disabled />
        <MdvNavigationDrawerItem label="Cancelled navigation" href="#cancelled-navigation" @click.prevent />
        <MdvNavigationDrawerItem label="Open design guide in a new tab" href="https://m3.material.io/components/navigation-drawer/overview" target="_blank" rel="noopener noreferrer" />
      </MdvNavigationDrawerGroup>
      <template #footer="{ close }"><MdvButton variant="text" @click="close()">Close modal drawer</MdvButton></template>
    </MdvModalNavigationDrawer>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · Last close: {{ lastClose }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 响应式布局

MDV 不会自动切换标准和模态抽屉。请由应用选择布局断点，并在两种布局间共享当前入口。

<DemoBlock>
  <DrawerResponsiveDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useId, useTemplateRef, watch } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvIcon, MdvIconButton, MdvModalNavigationDrawer, MdvNavigationDrawer, MdvNavigationDrawerItem } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'

const workspace = useTemplateRef<HTMLElement>('workspace')
const id = `responsive-example-${useId()}`
const wide = ref(false)
const compact = ref(true)
const modal = ref(false)
const current = ref('Inbox')
const destinations = ['Inbox', 'Saved', 'Archive']
let observer: ResizeObserver | undefined
onMounted(() => {
  const element = workspace.value
  if (!element) return
  const measure = () => { compact.value = element.clientWidth < 600 }
  measure()
  observer = new ResizeObserver(measure)
  observer.observe(element)
})
watch(compact, value => { if (!value) modal.value = false })
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="wide" label="Use a 720px workspace" />
    <div class="overflow-x-auto rounded-xl" role="region" aria-label="Responsive drawer workspace" tabindex="0">
      <div ref="workspace" class="relative isolate flex h-96 overflow-hidden bg-mdv-surface-container-low [contain:layout]" :style="{ inlineSize: wide ? '720px' : 'min(100%, 360px)' }">
        <MdvNavigationDrawer v-if="!compact" title="Mail" width="240px" aria-label="Expanded workspace destinations">
          <MdvNavigationDrawerItem v-for="destination in destinations" :key="destination" :label="destination" :active="current === destination" @click="current = destination" />
        </MdvNavigationDrawer>
        <MdvAppBarScaffold class="min-w-0 flex-1" :content-attrs="{ 'aria-label': 'Responsive workspace content' }">
          <template #appbar>
            <MdvAppBar :title="current" :heading-level="3">
              <template v-if="compact" #leading>
                <MdvIconButton variant="standard" aria-label="Open workspace navigation" :aria-controls="id" :aria-expanded="modal" @click="modal = true"><MdvIcon :icon="menuIcon" /></MdvIconButton>
              </template>
            </MdvAppBar>
          </template>
          <p class="p-5 text-sm text-mdv-on-surface-variant">{{ compact ? 'Compact: modal navigation.' : 'Expanded: standard navigation.' }}</p>
        </MdvAppBarScaffold>
        <MdvModalNavigationDrawer v-if="compact" :id="id" v-model="modal" title="Workspace destinations">
          <MdvNavigationDrawerItem v-for="destination in destinations" :key="destination" :label="destination" :active="current === destination" @click="current = destination" />
        </MdvModalNavigationDrawer>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current destination: {{ current }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 搭配应用栏

将 `MdvAppBarScaffold` 放在同一 Flex 容器中，紧接标准抽屉，可让应用栏的背景延伸到抽屉圆角后方。

用 `href` 指定链接；接入 Vue Router 时，根据当前路由设置 `active`。

---

## API

### MdvNavigationDrawer

<ApiTable :items="drawerProps" />

<SlotsTable :items="drawerSlots" />

`id`、`dir`、`aria-label`、class、style 和原生监听器等传递到导航面板；自定义 CSS 属性也会传递到宽度轨道。MDV 管理导航语义、隐藏状态和焦点能力。父级负责提供布局高度，组件不会自动创建完整应用外壳。

### MdvModalNavigationDrawer

继承上述共享属性，其中 `modelValue` 默认为 `false`，并额外提供：

<ApiTable :items="modalProps" />

共用上述三个插槽。`id`、`dir`、ARIA 和原生监听器传递到 dialog；class 和 style 传递到面板，自定义 CSS 属性也可供遮罩使用。需要原生 dialog 支持。模态层进入浏览器顶层，不参与标准抽屉的布局占位。

### 共享事件与方法

<DocsTable label="导航抽屉生命周期事件" min-width="32rem">

| 事件 | 参数与时机 |
| --- | --- |
| `update:modelValue` | 允许关闭后请求的新布尔值 |
| `open` / `opened` | 无参数；进入开始或完成 |
| `close` / `closed` | `MdvNavigationDrawerCloseDetail`；被接受的退出开始或完成 |

</DocsTable>

`MdvNavigationDrawerCloseDetail` 只有 `reason`。标准抽屉使用 `action` 和 `model`；模态抽屉还使用 `escape`、`scrim`、`select`、`swipe`。守卫或父级拒绝后不会发出退出生命周期；被打断的过渡不会发出过期的完成事件。

<DocsTable label="导航抽屉实例方法" min-width="30rem">

| 方法 | 行为 |
| --- | --- |
| `close(): Promise<boolean>` | 请求带守卫的 action 关闭，返回父级是否接受 |
| `focus(): void` | 聚焦当前面板中可用的目的地或控件，不会主动打开抽屉 |

</DocsTable>

### MdvNavigationDrawerItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

没有模型和组件事件。原生属性与监听器传递到实际按钮或链接，按钮固定为 `type="button"`。链接的 `target`、`rel`、`download` 保留原生行为。当前目的地提供 `aria-current="page"`；禁用链接移除 `href`，设置 `aria-disabled="true"` 和 `tabindex="-1"`。实例方法为 `focus(options?: FocusOptions)` 与 `blur()`。

### MdvNavigationDrawerGroup

<ApiTable :items="groupProps" />

<SlotsTable :items="groupSlots" />

事件：`update:expanded(value: boolean)` 请求修改展开状态。没有额外实例方法。属性传递到外层分组列表项，可折叠分组的原生事件监听器则传递到展开按钮。MDV 管理内部列表、展开 ARIA 和收起状态。需要折叠时使用 `collapsible`，不要给静态标题添加自定义点击行为来替代。

### 公开类型

```ts
import type {
  MdvNavigationDrawerProps,
  MdvModalNavigationDrawerProps,
  MdvNavigationDrawerCloseReason,
  MdvNavigationDrawerCloseDetail,
  MdvNavigationDrawerSlotProps,
  MdvNavigationDrawerItemProps,
  MdvNavigationDrawerItemSlotProps,
  MdvNavigationDrawerGroupProps,
  MdvNavigationDrawerGroupSlotProps,
} from '@mdv-ui/mdv'
```

没有抽屉 variant、自动断点属性、路由模型或递归禁用策略。使用这些组件与应用状态显式组合对应行为。
