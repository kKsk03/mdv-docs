<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import DrawerBasicDemo from '@/components/docs/demos/navigationDrawer/basic.vue'
import DrawerGroupsDemo from '@/components/docs/demos/navigationDrawer/groups.vue'
import DrawerModalDemo from '@/components/docs/demos/navigationDrawer/modal.vue'
import DrawerPolicyDemo from '@/components/docs/demos/navigationDrawer/policy.vue'
import DrawerGuardDemo from '@/components/docs/demos/navigationDrawer/guard.vue'
import DrawerResponsiveDemo from '@/components/docs/demos/navigationDrawer/responsive.vue'
import DrawerCompositionDemo from '@/components/docs/demos/navigationDrawer/composition.vue'

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

`MdvNavigationDrawer` 在应用内容旁占据布局空间；`MdvModalNavigationDrawer` 使用遮罩覆盖内容，并管理模态焦点。两者共用 `MdvNavigationDrawerItem` 和 `MdvNavigationDrawerGroup`。

这些组件对应经典 Material Design 3 导航抽屉。它们适合包含更多层级的目的地；Expressive 应用也可以考虑展开的 Navigation Rail。导航形式和响应式断点由应用决定。

## 标准布局与宽度

在具有明确高度的 flex 容器中，将标准抽屉放在内容之前，并给内容设置 `min-width: 0`。展开时占据面板宽度，关闭后占位归零；不会锁定背景滚动，也不会在展开时主动抢焦点。

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

默认宽度为 `360px`，受父级可用空间限制。使用 `width` 传入其他 CSS 长度。正常选择目的地不会关闭标准抽屉；`active` 只表示当前页及其样式，应用负责切换目的地。

根组件的打开状态是受控的：需要关闭和重新打开时绑定 `v-model`。不绑定时，标准抽屉保持默认打开，模态抽屉保持关闭。这与分组可选的内部展开状态不同。

## 分组标题、折叠菜单与尾部内容

不设置 `collapsible` 的分组就是静态分组标题。添加 `collapsible` 后才变成可展开的子菜单；`divider` 在分组之前添加分割线。项目的 `badge` 插槽可放置视觉徽标或本地化的尾部文字。

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

切换是否接受展开更新，可以比较请求与最终状态。收起的子项仍保留挂载，但会变为 inert，并从无障碍树中隐藏。如果收起时焦点位于内部，MDV 会将焦点移回分组按钮。每层可折叠分组增加 12px 逻辑缩进，静态分组不额外增加层级。

禁用分组只禁用它的展开按钮，不会禁用所有子项；示例中的审计日志仍可使用。需要阻止目的地操作时，应单独禁用项目。数值 `0` 也会作为尾部文字显示。重要计数除了视觉徽标，还需通过例如 `aria-label="Design, 3 updates"` 提供完整名称。

## 模态导航

通过具有名称的按钮打开模态抽屉。组件没有内置关闭图标，需要时在插槽中提供。原生 dialog 进入顶层，锁定文档滚动，并将焦点限制在最上层模态中。优先聚焦 `autofocus` 控件，否则聚焦首个可用控件。

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

正常选择目的地会以 `select` 原因请求关闭；分组按钮只负责展开或收起。禁用项目、`@click.prevent`、带修饰键的点击、新窗口链接和下载不会正常触发自动关闭。取消点击也会取消原生导航，但不会撤销业务处理函数已经修改的状态。

使用明确的标题、`aria-label` 或 `aria-labelledby`。均未提供时，导航名称回退为 `主导航`，因此英文实例应显式命名。关闭后会在适当时将焦点返回可用的打开控件，不会覆盖后来打开的模态或业务代码主动设置的外部焦点。

## 关闭策略、状态保留与父级接收

模态关闭开关相互独立，默认均启用。插槽和实例的 `close()` 返回 Promise，表示父级是否接受关闭；`true` 不代表退出动画已经结束，结束时机应监听 `closed`。

<DemoBlock>
  <DrawerPolicyDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvCheckbox, MdvModalNavigationDrawer, MdvNavigationDrawerItem, MdvTextField } from '@mdv-ui/mdv'
import type { MdvNavigationDrawerCloseDetail } from '@mdv-ui/mdv'

const id = `policy-example-${useId()}`
const open = ref(false)
const closeOnEsc = ref(true)
const closeOnScrim = ref(true)
const closeOnSelect = ref(true)
const closeOnSwipe = ref(true)
const destroy = ref(false)
const blockClose = ref(false)
const acceptClose = ref(true)
const message = ref('No close requested.')
function beforeClose(detail: Readonly<MdvNavigationDrawerCloseDetail>) {
  message.value = `Guard ${detail.reason}: ${blockClose.value ? 'blocked' : 'allowed'}.`
  return !blockClose.value
}
function update(value: boolean) {
  if (value || acceptClose.value) open.value = value
  else message.value = 'The parent rejected the close request.'
}
async function closeDrawer(close: () => Promise<boolean>) {
  message.value = `Close accepted: ${await close()}.`
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="closeOnEsc" label="Close on Escape" />
      <MdvCheckbox v-model="closeOnScrim" label="Close on scrim" />
      <MdvCheckbox v-model="closeOnSelect" label="Close on selection" />
      <MdvCheckbox v-model="closeOnSwipe" label="Close on swipe" />
      <MdvCheckbox v-model="destroy" label="Destroy closed content" />
      <MdvCheckbox v-model="blockClose" label="Block guarded closes" />
      <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
    </div>
    <div><MdvButton :aria-controls="id" :aria-expanded="open" @click="open = true">Open policy drawer</MdvButton></div>
    <MdvModalNavigationDrawer :id="id" :model-value="open" title="Drawer close policy" :close-on-esc="closeOnEsc" :close-on-scrim="closeOnScrim" :close-on-select="closeOnSelect" :close-on-swipe="closeOnSwipe" :destroy-on-close="destroy" :before-close="beforeClose" @update:model-value="update">
      <MdvNavigationDrawerItem label="Choose this destination" />
      <template #footer="{ close }">
        <div class="grid gap-3">
          <MdvTextField label="Retained navigation note" placeholder="Type, close, and reopen" full-width />
          <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
          <div class="flex flex-wrap gap-2">
            <MdvButton variant="text" @click="closeDrawer(close)">Request guarded close</MdvButton>
            <MdvButton variant="text" @click="open = false">Close by model</MdvButton>
          </div>
        </div>
      </template>
    </MdvModalNavigationDrawer>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

分别尝试守卫拦截、父级拒绝更新，两者都会保持抽屉打开。直接将模型赋为 `false` 则绕过 `beforeClose`，关闭原因为 `model`。并发关闭请求会合并；已经过期的异步结果不会关闭后来重新打开的抽屉。

内容默认保留。输入示例中未绑定外部模型的备注，关闭并重新打开，再与启用 `destroy-on-close` 的效果比较。销毁发生在退出完成后，会重置该输入框的内部状态；父级持有的模型仍需由应用自行处理。

滑动关闭可从允许接管的抽屉内容区域开始，朝逻辑起始侧移动，RTL 时方向相反。超过面板宽度一半，或关闭方向速度超过 400px/s 时可以提交关闭。未达到条件、取消、守卫阻止或父级拒绝的手势会回弹。纵向滚动和可编辑控件保留原生交互；应用的手势组合仍需用真实触摸验证。

## 异步确认未保存内容

需要确认后才能离开时，让 `beforeClose` 返回 Promise。确认对话框放在抽屉的兄弟位置，避免随着即将销毁的内容一起消失。每次选择及卸载时都要结束待处理的 Promise。

<DemoBlock>
  <DrawerGuardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref, useId } from 'vue'
import { MdvButton, MdvDialog, MdvModalNavigationDrawer, MdvNavigationDrawerItem, MdvTextField } from '@mdv-ui/mdv'

const id = `guard-example-${useId()}`
const open = ref(false)
const confirming = ref(false)
const note = ref('')
const message = ref('Type a note in the drawer, then try closing it.')
let resolveClose: ((allowed: boolean) => void) | undefined
function beforeClose() {
  if (!note.value.trim()) return true
  confirming.value = true
  return new Promise<boolean>(resolve => { resolveClose = resolve })
}
function answer(allowed: boolean) {
  confirming.value = false
  if (allowed) note.value = ''
  message.value = allowed ? 'The note was discarded.' : 'Keep editing the note.'
  resolveClose?.(allowed)
  resolveClose = undefined
}
onBeforeUnmount(() => resolveClose?.(false))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-controls="id" :aria-expanded="open" @click="open = true">Open guarded drawer</MdvButton>
    <MdvModalNavigationDrawer :id="id" v-model="open" title="Draft workspace" :before-close="beforeClose">
      <MdvNavigationDrawerItem label="Draft destination" active />
      <template #footer="{ close }">
        <div class="grid gap-3">
          <MdvTextField v-model="note" label="Unsaved navigation note" full-width />
          <MdvButton variant="text" @click="close()">Leave draft workspace</MdvButton>
        </div>
      </template>
    </MdvModalNavigationDrawer>
    <MdvDialog :model-value="confirming" title="Discard navigation note?" role="dialog" description="This local note has not been saved." @update:model-value="answer(false)">
      <template #actions>
        <MdvButton variant="text" @click="answer(false)">Keep editing</MdvButton>
        <MdvButton variant="text" @click="answer(true)">Discard and close</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

此备注没有接入持久化服务。Discard 清空备注并允许原请求关闭，Keep editing 拒绝关闭。守卫抛错或 Promise 拒绝时，会报告错误并保持打开。守卫只控制关闭，不负责目的地状态；如果路由或 active 状态也需要确认，业务代码应将这些修改一起延后。

## 响应式组合

标准抽屉和模态抽屉不会自动互相切换。观察应用可用宽度、保留共享的目的地状态，再挂载适当的组件。示例使用 **600px 工作区断点**，与文档站自身的侧边栏断点无关。

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

预览可在自己的横向滚动区域中扩展为 720px。紧凑工作区在 App Bar 显示菜单按钮，使用模态导航；宽工作区则由标准抽屉占据内容旁的空间。切回宽布局时会清除模态模型并卸载遮罩。模态抽屉仍覆盖真实浏览器视口，不会被预览外壳裁剪。

## App Bar 相邻布局、滚动与局部主题

在共同的 flex 容器里，`MdvAppBarScaffold` 必须是标准抽屉的**紧邻后一个兄弟元素**。MDV 通过这个相邻关系，将 App Bar 背景延续到抽屉内容侧圆角之后，并在主题切换过程中保持同步。

<DemoBlock>
  <DrawerCompositionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvAppBar, MdvAppBarScaffold, MdvCheckbox, MdvNavigationDrawer, MdvNavigationDrawerGroup, MdvNavigationDrawerItem } from '@mdv-ui/mdv'

const open = ref(true)
const dark = ref(false)
const rtl = ref(false)
const current = ref('Inbox')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="open" label="Show composed drawer" />
      <MdvCheckbox v-model="dark" label="Use a local dark theme" />
      <MdvCheckbox v-model="rtl" label="Use right-to-left composition" />
    </div>
    <div class="overflow-x-auto rounded-xl" role="region" aria-label="Drawer and app bar composition" tabindex="0">
      <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="flex h-80 min-w-0 overflow-hidden bg-mdv-surface-container-low text-mdv-on-surface" style="inline-size: max(100%, 640px)">
        <MdvNavigationDrawer v-model="open" title="Mail" width="240px">
          <MdvNavigationDrawerItem label="Inbox" :active="current === 'Inbox'" @click="current = 'Inbox'" />
          <MdvNavigationDrawerGroup label="Folders" divider>
            <MdvNavigationDrawerItem v-for="number in 12" :key="number" :label="`Project ${number}: a long destination label`" :active="current === `Project ${number}`" :badge="number" @click="current = `Project ${number}`" />
          </MdvNavigationDrawerGroup>
        </MdvNavigationDrawer>
        <MdvAppBarScaffold class="min-w-0 flex-1" :content-attrs="{ 'aria-label': 'Composed workspace content' }">
          <template #appbar><MdvAppBar :title="current" :heading-level="3" /></template>
          <div class="grid gap-4 p-5 text-sm">
            <p v-for="number in 8" :key="number">Workspace section {{ number }}. Scroll this content and compare the drawer corner with the app bar.</p>
          </div>
        </MdvAppBarScaffold>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

共同容器使用 `surface-container-low` 背景，同时让抽屉和 App Bar 保持各自的 surface 色彩角色。不要用同一背景覆盖所有面板来掩盖色差。目的地列表独立滚动，头部和底部位于列表滚动区域之外；Scaffold 内容也拥有独立滚动区域。

切换局部深浅主题、RTL，并展开或收起抽屉，观察圆角连接。标准抽屉使用 `surface`，没有阴影；模态抽屉使用 `surface-container-low`、1 级阴影和 32% 遮罩。内容侧圆角为 16px，目的地行高至少 56px，图标为 24px。当前项使用 `secondary-container` 与 `on-secondary-container`。

## 路由、键盘与语义

使用真实 `href` 表示目的地。与 Vue Router 组合时，通过自定义 `RouterLink` 插槽将 `href`、`isExactActive` 传给项目，并用 `navigate` 处理 `click`；不要在项目中嵌套另一个可交互链接。MDV 不内置路由器、不选择当前目的地，也不生成 URL。存在异步路由守卫时，由应用决定是否保持模态打开，直到导航被接受。

面板是具有列表语义的导航区域；分组和项目并非 ARIA menu、tree 或 tablist。页面有多个导航区域时，应分别命名。

<DocsTable label="导航抽屉键盘操作" min-width="30rem">

| 按键 | 行为 |
| --- | --- |
| Tab / Shift+Tab | 按正常顺序访问可用控件；模态抽屉将焦点限制在最上层 dialog 中 |
| ArrowUp / ArrowDown | 在可见且启用的目的地和分组按钮之间移动焦点，不改变当前目的地 |
| Home / End | 聚焦第一个或最后一个可用导航行 |
| 按钮上的 Enter / Space | 执行原生操作；分组按钮切换展开状态 |
| 链接上的 Enter | 执行原生链接导航 |
| Escape | 开关启用时请求关闭最上层模态抽屉；标准抽屉保持打开 |

</DocsTable>

输入框等编辑控件保留自己的按键行为。禁用目的地和收起的子项不会参与方向键导航。减少动态效果时会移除或缩短面板、宽度、分组和状态过渡。实际布局、焦点归还、触摸手势及放大文字仍需在目标浏览器验证。

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
