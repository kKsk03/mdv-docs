<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import SearchBarDemo from '@/components/docs/demos/searchBar/bar.vue'
import SearchFormDemo from '@/components/docs/demos/searchBar/form.vue'
import SearchViewDemo from '@/components/docs/demos/searchBar/view.vue'
import SearchTriggerDemo from '@/components/docs/demos/searchBar/trigger.vue'
import SearchGuardDemo from '@/components/docs/demos/searchBar/guard.vue'
import SearchAsyncDemo from '@/components/docs/demos/searchBar/async.vue'
import SearchAppBarDemo from '@/components/docs/demos/searchBar/appbar.vue'
import SearchCompositionDemo from '@/components/docs/demos/searchBar/composition.vue'

const barProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string', default: "''（内部）", description: '搜索词。不传时内部管理，显式传入后由父级决定是否接受更新。' },
  { name: 'placeholder', type: 'string', default: "'搜索'", description: '输入提示。未提供 label 时也作为输入及 dialog 名称。英文应用应显式设置英文标签。' },
  { name: 'label', type: 'string', default: 'placeholder', description: '可访问输入名称，SearchView 也用它命名 dialog。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用输入，阻止打开或提交搜索。' },
  { name: 'readonly', type: 'boolean', default: 'false', description: '禁止修改与清空，仍可查看已有结果和提交当前搜索词。' },
  { name: 'clearable', type: 'boolean', default: 'true', description: '搜索词非空且可编辑时显示清空操作。' },
  { name: 'clearLabel', type: 'string', default: "'清空搜索'", description: '清空操作的可访问名称。' },
  { name: 'loading', type: 'boolean', default: 'false', description: '为输入和 View 结果区设置 aria-busy，不自动请求、显示进度或禁用编辑。' },
]
const viewProps: ApiTableItem[] = [
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: 'false', description: '搜索展开状态。不绑定时内部管理；绑定后父级需要接受请求。' },
  { name: 'variant', type: "'contained' | 'divided'", default: "'contained'", description: '分离圆角输入/结果表面，或带输入分割线的整体表面。' },
  { name: 'layout', type: "'auto' | 'docked' | 'fullscreen'", default: "'auto'", description: 'auto 在视口小于 600px 时全屏，600px 及以上停靠。两者都是模态。' },
  { name: 'backLabel', type: 'string', default: "'返回'", description: '全屏、divided 或自定义入口搜索中返回按钮的可访问名称。' },
  { name: 'closeOnEsc', type: 'boolean', default: 'true', description: '允许最上层搜索 dialog 通过 Escape 请求关闭。' },
  { name: 'closeOnScrim', type: 'boolean', default: 'true', description: '允许完成遮罩点击后请求关闭。' },
  { name: 'destroyOnClose', type: 'boolean', default: 'false', description: '关闭后销毁展开内容，外部 query/open 模型仍保留。' },
  { name: 'beforeClose', type: 'MdvSearchBeforeClose', description: '同步或异步关闭守卫，false 阻止请求。直接修改 open 会绕过守卫。' },
  { name: 'inputAttrs', type: 'InputHTMLAttributes', description: '真实输入的原生属性/监听，例如 id、name、form、required 和 ARIA。仅当前活动输入参与表单。' },
  { name: 'statusText', type: 'string', default: "''", description: '简短礼貌播报，例如“找到 3 篇文档”，不会自动朗读整个结果列表。' },
]
const appBarProps: ApiTableItem[] = [
  { name: 'appearance', type: "'default' | 'elevated' | 'bordered'", default: "'default'", description: '与 MdvAppBar 一致的应用栏表面外观。' },
  { name: 'scrollBehavior', type: "'none' | 'pinned' | 'enter-always'", default: "'none'", description: '64px 搜索应用栏的滚动行为，不支持 exit-until-collapsed。' },
  { name: 'scrollTarget', type: 'MdvAppBarScrollTarget', description: 'Window、HTMLElement、选择器或返回目标的函数。省略时跟随外围 Scaffold 正文，否则跟随 window。显式目标未找到不回退。' },
  { name: 'scrolled', type: 'boolean', default: '自动', description: '覆盖已滚动表面状态，不控制应用栏的隐藏或展开进度。' },
]
const barSlots: SlotTableItem[] = [
  { name: 'leading', description: '替换装饰性搜索图标，无参数。' },
  { name: 'trailing', description: '内置清空操作之后的内容，无参数。交互操作需要名称。' },
]
const viewSlots: SlotTableItem[] = [
  { name: 'default', description: '应用负责的建议、筛选、加载/错误/空状态和结果，接收 { query, expanded, close, search }。' },
  { name: 'trigger', description: '替换入口 SearchBar，接收搜索状态和 triggerProps。将完整对象（包含 ref）绑定到一个原生按钮或单按钮根组件。' },
  { name: 'leading', description: '入口栏前导内容，接收搜索状态。展开栏前导内容遵循布局与返回按钮规则。' },
  { name: 'trailing', description: '接收搜索状态，入口栏和展开栏都会渲染，避免固定重复 ID 或重复浮层。' },
]
const appBarSlots: SlotTableItem[] = [
  { name: 'default', description: '搜索结果，接收 { query, expanded, close, search }。' },
  { name: 'leading', description: '搜索框外侧的应用栏前导内容，接收 { scrolled, collapsed }。' },
  { name: 'actions', description: '搜索框外侧的应用栏尾部操作，接收 { scrolled, collapsed }。' },
  { name: 'search-leading', description: '入口搜索框内的前导内容，接收搜索状态。' },
  { name: 'search-trailing', description: '搜索框内的尾部内容，接收搜索状态，可能分别在入口和展开栏渲染。' },
]
</script>

# 搜索栏

`MdvSearchBar` 提供可编辑搜索输入；`MdvSearchView` 添加可展开的模态建议与结果表面；`MdvSearchAppBar` 将该体验放进应用栏。本页覆盖 **MDV 0.1.5** 的这三个组件。

数据、筛选、请求、历史记录和结果操作由应用负责。组件不实现搜索服务，也不为任意结果自动添加 combobox/listbox 语义。

## 独立输入、提交与表单

搜索直接更新当前页面、不需要独立结果表面时使用 SearchBar。它最小高 56px，并占满容器。`v-model` 跟踪输入，`search` 表示主动提交。Enter 会发出 search 并阻止原生表单隐式提交，示例因此提供单独提交按钮来读取 `FormData`。

清空会更新为空字符串、发出 `clear`，并将焦点放回输入。只读允许查看和提交当前搜索词，但不能修改或清空；禁用会阻止交互。SearchBar 的原生 `name`、`form`、`id`、输入事件与校验属性直接作用于输入，`class` 和 `style` 作用于外壳。重置恢复初始搜索词，受控值仍需要父级接受更新。

<DemoBlock>
  <SearchBarDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvCheckbox, MdvSearchBar } from '@mdv-ui/mdv'

const id = `search-bar-form-${useId()}`
const query = ref('Material')
const disabled = ref(false)
const readonly = ref(false)
const message = ref('Press Enter to search, or read the form data separately.')
function search(value: string) { message.value = `Search submitted: ${value || '(all documents)'}` }
function submit(event: Event) {
  message.value = `Form data: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="disabled" label="Disable search" /><MdvCheckbox v-model="readonly" label="Read only" /></div>
    <form :id="id" class="grid gap-4" @submit.prevent="submit">
      <MdvSearchBar v-model="query" name="q" placeholder="Search documents" clear-label="Clear query" :disabled="disabled" :readonly="readonly" @search="search" @clear="message = 'Query cleared.'" />
      <div class="flex flex-wrap gap-3"><MdvButton type="submit">Read search form</MdvButton><MdvButton type="reset" variant="outlined">Reset query</MdvButton></div>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Query: {{ query || '(empty)' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## SearchView 输入归属与表单

SearchView 的入口与展开输入共享搜索词，但仅活动输入具有表单名称及指定 ID。通过 `input-attrs` 提供原生关联，不要把 `name` 放在组件外壳上。示例可分别在两种形态读取外部表单，不会重复提交 `q` 字段，并可在保持搜索展开时恢复初始搜索词。模态内按钮显式关联同一表单。

<DemoBlock>
  <SearchFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvSearchView } from '@mdv-ui/mdv'

const id = `search-view-form-${useId()}`
const inputId = `search-view-input-${useId()}`
const query = ref('design')
const message = ref('No form submission yet.')
function submit(event: Event) {
  message.value = `Form data: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
</script>

<template>
  <div class="grid gap-4">
    <MdvSearchView v-model="query" placeholder="Search external form" clear-label="Clear form query" back-label="Back to external form" variant="divided" :input-attrs="{ id: inputId, form: id, name: 'q' }">
      <template #default="{ close }">
        <div class="grid gap-4 p-5">
          <p class="text-sm">Only the active search input belongs to the external form.</p>
          <div class="flex flex-wrap gap-3"><MdvButton type="submit" :form="id">Submit from search</MdvButton><MdvButton type="reset" :form="id" variant="outlined">Reset from search</MdvButton><MdvButton variant="text" @click="close()">Close form search</MdvButton></div>
          <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Query: {{ query }}</p>
        </div>
      </template>
    </MdvSearchView>
    <form :id="id" class="flex flex-wrap gap-3" @submit.prevent="submit">
      <MdvButton type="submit">Submit collapsed search</MdvButton><MdvButton type="reset" variant="outlined">Reset collapsed search</MdvButton>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Query: {{ query }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 建议、外观与响应式布局

聚焦或点击入口输入可以打开 SearchView。`contained` 使用分离的圆角输入与结果表面，`divided` 使用带分割线的整体表面。示例同时由应用切换配套 List 的外观。

`auto` 参考的是**视口**，不是示例容器：小于 600px 使用全屏，600px 及以上停靠入口。两种布局均为原生模态 dialog，包含遮罩与焦点限制。因此停靠结果也不是内联的非模态弹出框。contained 展开后会向入口两侧各延伸 12px，默认外壳提供 24px 水平内边距；应给组件留出空间，不要覆盖内部定位。

Enter 发出 `search` 并将焦点移入结果区，不会选中结果或关闭搜索。示例显式处理结果选择并调用插槽 `close()`。清空保持展开，筛选与空状态属于普通插槽内容。

<DemoBlock>
  <SearchViewDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvList, MdvListItem, MdvSearchView, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSearchLayout, MdvSearchSlotProps, MdvSearchVariant } from '@mdv-ui/mdv'
import mailIcon from '@iconify-icons/material-symbols/mail-outline'

const query = ref('')
const open = ref(false)
const variant = ref<MdvSearchVariant>('contained')
const layout = ref<MdvSearchLayout>('auto')
const unreadOnly = ref(false)
const selected = ref('No result selected.')
const variants = ['contained', 'divided'].map(value => ({ value, label: value }))
const layouts = ['auto', 'docked', 'fullscreen'].map(value => ({ value, label: value }))
const rows = [
  { title: 'Material Design guidelines', detail: 'Design team · Updated this morning', unread: true },
  { title: 'Travel plans for the weekend', detail: 'Travel club · Routes and meeting points', unread: false },
  { title: 'Accessible search patterns', detail: 'Engineering · Keyboard and focus review', unread: true },
  { title: 'Shared photo collection', detail: 'Community · Last week in pictures', unread: false },
  { title: 'A longer project update about design systems and shared workspaces', detail: 'Product team · A longer subject with supporting context', unread: true },
]
const results = computed(() => rows.filter(row => (!unreadOnly.value || row.unread) && `${row.title} ${row.detail}`.toLowerCase().includes(query.value.trim().toLowerCase())))
function choose(title: string, close: MdvSearchSlotProps['close']) {
  query.value = title
  selected.value = `Selected: ${title}`
  void close()
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvSelect :model-value="variant" :options="variants" label="Search appearance" @update:model-value="variant = $event as MdvSearchVariant" />
      <MdvSelect :model-value="layout" :options="layouts" label="Search layout" @update:model-value="layout = $event as MdvSearchLayout" />
    </div>
    <div class="rounded-xl bg-mdv-surface-container-low py-6">
      <MdvSearchView v-model="query" v-model:open="open" :variant="variant" :layout="layout" placeholder="Search messages" clear-label="Clear messages query" back-label="Back to messages" :status-text="`${results.length} matching messages`" @search="selected = `Submitted: ${$event || '(all messages)'}`">
        <template #default="{ close }">
          <div class="px-4 pb-2"><MdvCheckbox v-model="unreadOnly" label="Unread only" /></div>
          <MdvList v-if="results.length" :variant="variant === 'contained' ? 'expressive' : 'baseline'">
            <MdvListItem v-for="row in results" :key="row.title" :headline="row.title" :supporting-text="row.detail" interactive @click="choose(row.title, close)"><template #leading><MdvIcon :icon="mailIcon" /></template></MdvListItem>
          </MdvList>
          <p v-else class="p-6 text-sm text-mdv-on-surface-variant">No matching messages. Try “design” or “travel”.</p>
        </template>
      </MdvSearchView>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ selected }} · Open: {{ open }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 图标入口与受控模型

将完整 `triggerProps` 绑定到一个入口，包括 `ref`、点击处理、dialog 关联、展开状态和禁用状态。纯图标入口还应提供可访问名称。省略 ref 或将绑定分散到不同元素，会破坏定位或焦点恢复。

搜索词和展开模型彼此独立。不绑定时内部管理；显式 `:model-value` 或 `:open` 需要父级接受更新，拒绝时保持已接受状态。示例把接受控制放在模态内部，拒绝关闭后仍可重新启用，避免无法通过键盘退出。

<DemoBlock>
  <SearchTriggerDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvSearchView } from '@mdv-ui/mdv'
import searchIcon from '@iconify-icons/material-symbols/search'

const open = ref(false)
const query = ref('')
const acceptOpen = ref(true)
const acceptQuery = ref(true)
const message = ref('No request yet.')
function updateOpen(next: boolean) {
  message.value = `Open requested: ${next}${acceptOpen.value ? '' : ' (rejected)'}`
  if (acceptOpen.value) open.value = next
}
function updateQuery(next: string) {
  message.value = `Query requested: ${JSON.stringify(next)}${acceptQuery.value ? '' : ' (rejected)'}`
  if (acceptQuery.value) query.value = next
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
    <MdvSearchView :open="open" :model-value="query" placeholder="Search with an icon trigger" clear-label="Clear controlled query" back-label="Close controlled search" @update:open="updateOpen" @update:model-value="updateQuery">
      <template #trigger="{ triggerProps }"><MdvIconButton v-bind="triggerProps" variant="tonal" aria-label="Open controlled search"><MdvIcon :icon="searchIcon" /></MdvIconButton></template>
      <template #default="{ close }">
        <div class="grid gap-4 p-5">
          <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
          <MdvCheckbox v-model="acceptQuery" label="Accept query requests" />
          <p class="break-words text-sm">Accepted query: {{ query || '(empty)' }}</p>
          <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }}</p>
          <MdvButton variant="outlined" @click="close()">Request search close</MdvButton>
          <MdvButton variant="text" @click="open = false">Close search directly</MdvButton>
        </div>
      </template>
    </MdvSearchView>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Open: {{ open }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 异步关闭确认

`beforeClose(detail)` 返回 `false` 或异步得到 `false` 时阻止关闭；成功的 `void`/`true` 允许提出模型请求，父级仍可拒绝。直接修改 `open` 会绕过守卫。动画结束应使用 `closed`；`close()` 可能在动画结束前就返回接受结果。

示例等待 Keep editing 或 Discard note 后再决定是否关闭，并在卸载时结束等待中的 Promise，防止离开文档页后残留确认。清空搜索词不会调用关闭守卫。

<DemoBlock>
  <SearchGuardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvSearchView, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSearchBeforeClose, MdvSearchCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const note = ref('')
const dirty = ref(false)
const pendingReason = ref('')
const message = ref('No close request yet.')
let resolveClose: ((accepted: boolean) => void) | undefined
const beforeClose: MdvSearchBeforeClose = detail => {
  if (!dirty.value) return true
  pendingReason.value = detail.reason
  return new Promise<boolean>(resolve => { resolveClose = resolve })
}
function decide(discard: boolean) {
  if (discard) { note.value = ''; dirty.value = false }
  pendingReason.value = ''
  resolveClose?.(discard)
  resolveClose = undefined
}
function closed(detail: MdvSearchCloseDetail) { message.value = `Closed: ${detail.reason}` }
onBeforeUnmount(() => resolveClose?.(false))
</script>

<template>
  <div class="grid gap-4">
    <MdvSearchView v-model:open="open" placeholder="Search and annotate" clear-label="Clear annotation query" back-label="Leave annotation search" variant="divided" :before-close="beforeClose" @closed="closed">
      <template #default="{ close }">
        <div class="grid gap-4 p-5">
          <MdvTextField :model-value="note" label="Unsaved note" supporting-text="Type a note, then request closing." @update:model-value="note = String($event); dirty = true" />
          <MdvButton variant="outlined" @click="close()">Close annotation search</MdvButton>
          <div v-if="pendingReason" role="alert" class="grid gap-3 rounded-xl bg-mdv-secondary-container p-4 text-mdv-on-secondary-container">
            <p class="text-sm">Discard the unsaved note? Close reason: {{ pendingReason }}</p>
            <div class="flex flex-wrap gap-3"><MdvButton variant="text" @click="decide(false)">Keep editing</MdvButton><MdvButton variant="tonal" @click="decide(true)">Discard note</MdvButton></div>
          </div>
        </div>
      </template>
    </MdvSearchView>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }} · Unsaved: {{ dirty }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 加载、错误、重试与过期结果

`loading` 提供 busy 状态，不自动显示进度或禁用输入。进度、错误、重试、结果和空状态需要自行渲染。使用简短的 `status-text` 播报当前结果，不要自动朗读每条结果。

示例通过 Enter 启动可取消的模拟请求，不连接真实网络服务。编辑会使待处理结果失效，旧响应不能覆盖新搜索词；卸载时也清理计时器。真实请求应使用相同的取消/请求序号策略，并根据应用决定是否防抖。

<DemoBlock>
  <SearchAsyncDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { MdvButton, MdvCheckbox, MdvLinearProgress, MdvList, MdvListItem, MdvSearchView } from '@mdv-ui/mdv'

const query = ref('design')
const loading = ref(false)
const failed = ref(false)
const failNext = ref(false)
const results = ref<string[]>([])
const searched = ref(false)
const catalog = ['Material Design introduction', 'Designing accessible forms', 'Search interaction guide', 'Navigation patterns']
let timer: ReturnType<typeof setTimeout> | undefined
let request = 0
const status = computed(() => loading.value ? 'Searching documents.' : failed.value ? 'Search failed. Retry is available.' : searched.value ? `${results.value.length} documents found.` : 'Edit the query, then press Enter.')
function cancel() {
  request++
  clearTimeout(timer)
  loading.value = false
  failed.value = false
  searched.value = false
  results.value = []
}
function search(value: string) {
  cancel()
  loading.value = true
  const ticket = request
  const reject = failNext.value
  failNext.value = false
  timer = setTimeout(() => {
    if (ticket !== request) return
    loading.value = false
    searched.value = true
    failed.value = reject
    if (!reject) results.value = catalog.filter(title => title.toLowerCase().includes(value.trim().toLowerCase()))
  }, 650)
}
watch(query, cancel)
onBeforeUnmount(cancel)
</script>

<template>
  <MdvSearchView v-model="query" placeholder="Search the catalog" clear-label="Clear catalog query" back-label="Close catalog search" :loading="loading" :status-text="status" @search="search">
    <template #default="{ close }">
      <div class="px-4 pb-2"><MdvCheckbox v-model="failNext" label="Fail the next simulated request" /></div>
      <MdvLinearProgress v-if="loading" indeterminate aria-label="Searching catalog" />
      <div v-else-if="failed" class="grid gap-3 p-5"><p class="text-sm">The simulated service is unavailable.</p><MdvButton variant="tonal" @click="search(query)">Retry search</MdvButton></div>
      <MdvList v-else-if="results.length"><MdvListItem v-for="title in results" :key="title" :headline="title" interactive @click="close()" /></MdvList>
      <p v-else class="p-5 text-sm text-mdv-on-surface-variant">{{ searched ? 'No documents matched. Try “design”.' : 'Press Enter to run a simulated search. Editing cancels stale results.' }}</p>
    </template>
  </MdvSearchView>
</template>
```

  </template>
</DemoBlock>

## 搜索应用栏与独立正文滚动

将 SearchAppBar 放到 `MdvAppBarScaffold` 的 `appbar` 插槽。它使用 64px 应用栏，不指定 `scroll-target` 时跟随 Scaffold 正文。`enter-always` 在向下滚动时隐藏、向上滚动时显示；焦点和已打开搜索会保持相关操作可访问。示例在自己的有限高度区域内滚动。

`leading`、`actions` 位于搜索框外，接收应用栏状态；`search-leading`、`search-trailing` 位于搜索框内，接收搜索状态。SearchAppBar 没有自定义 `trigger` 插槽，独立图标入口应使用 SearchView。与 Standard Navigation Drawer 相邻时遵循普通 App Bar 的布局规则。

<DemoBlock>
  <SearchAppBarDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvAppBarScaffold, MdvButton, MdvDialog, MdvIcon, MdvIconButton, MdvList, MdvListItem, MdvSearchAppBar } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import moreIcon from '@iconify-icons/material-symbols/more-vert'

const query = ref('')
const about = ref(false)
const selected = ref('Inbox')
const subjects = ['Design review', 'Weekend travel', 'Accessibility checklist', 'Project updates']
const results = computed(() => subjects.filter(title => title.toLowerCase().includes(query.value.toLowerCase())))
</script>

<template>
  <div class="grid gap-4">
    <div class="h-[28rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvAppBarScaffold class="h-full" :content-attrs="{ 'aria-label': 'Search application messages', tabindex: 0 }">
        <template #appbar>
          <MdvSearchAppBar v-model="query" appearance="bordered" scroll-behavior="enter-always" placeholder="Search inbox" clear-label="Clear inbox query" back-label="Back to inbox" :status-text="`${results.length} inbox results`">
            <template #leading><MdvIcon :icon="homeIcon" /></template>
            <template #actions><MdvIconButton variant="standard" aria-label="About search example" @click="about = true"><MdvIcon :icon="moreIcon" /></MdvIconButton></template>
            <template #default="{ close }">
              <MdvList v-if="results.length"><MdvListItem v-for="title in results" :key="title" :headline="title" interactive @click="selected = title; close()" /></MdvList>
              <p v-else class="p-5 text-sm">No matching inbox messages.</p>
            </template>
          </MdvSearchAppBar>
        </template>
        <div class="p-4 text-sm text-mdv-on-surface-variant">Selected: {{ selected }}. Scroll this pane down and then up to reveal the search App Bar.</div>
        <MdvList><MdvListItem v-for="index in 20" :key="index" :headline="subjects[(index - 1) % subjects.length]!" supporting-text="Message preview · The scaffold owns this scroll container." /></MdvList>
      </MdvAppBarScaffold>
    </div>
    <MdvDialog v-model="about" title="Search App Bar" description="The search field belongs to a 64px App Bar. Its scroll target comes from the surrounding scaffold."><template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template></MdvDialog>
  </div>
</template>
```

  </template>
</DemoBlock>

## 对话框组合、局部主题与 RTL

SearchView 保持在原组件树中，由原生 dialog 进入顶层，因此可继承局部主题和方向，也能在另一个 MDV 对话框中打开搜索。Escape 先关闭最上层搜索并恢复入口焦点，外层对话框保持打开。应为两个层级提供明确名称。

避免将独立浮层放入会渲染两次的 `trailing` 插槽。与其他 MDV 浮层组合相同，应在搜索根组件旁声明，使用共享状态控制。

<DemoBlock>
  <SearchCompositionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvList, MdvListItem, MdvSearchView } from '@mdv-ui/mdv'

const dark = ref(false)
const rtl = ref(false)
const dialog = ref(false)
const query = ref('')
const selected = ref('No document selected.')
const documents = ['Design system overview', 'Forms and validation', 'Navigation and focus']
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="dark" label="Local dark theme" /><MdvCheckbox v-model="rtl" label="Right to left" /></div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="rounded-xl bg-mdv-surface-container-low p-5 text-mdv-on-surface">
      <MdvButton variant="tonal" @click="dialog = true">Choose a document</MdvButton>
      <p role="status" class="mt-4 text-sm">{{ selected }}</p>
      <MdvDialog v-model="dialog" title="Attach a document" description="Open the nested search. Escape closes search first and returns to this dialog.">
        <MdvSearchView v-model="query" placeholder="Search attachments" clear-label="Clear attachment query" back-label="Back to attachment dialog" variant="divided">
          <template #default="{ close }">
            <MdvList><MdvListItem v-for="title in documents.filter(value => value.toLowerCase().includes(query.toLowerCase()))" :key="title" :headline="title" interactive @click="selected = title; close()" /></MdvList>
            <MdvButton class="m-4" variant="text" @click="close()">Close attachment search</MdvButton>
          </template>
        </MdvSearchView>
        <template #actions="{ close }"><MdvButton variant="text" @click="close()">Finish attaching</MdvButton></template>
      </MdvDialog>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 键盘、输入法、无障碍与输入归属

<DocsTable label="搜索键盘操作">

| 按键或操作 | 行为 |
| --- | --- |
| 输入内 Enter | 非重复且不处于输入法组合时发出 `search(query, event)`；View 聚焦结果区但不关闭。 |
| 输入内下 / 上方向键 | View 聚焦首个/最后一个可用搜索结果，必要时先打开。 |
| 结果内上 / 下方向键 | 移动已识别结果操作焦点；首项向上返回输入。 |
| 结果上 Home / End | 聚焦首个/最后一个已识别结果。 |
| Tab / Shift+Tab | 按普通控件顺序移动，已展开 View 限制模态焦点。 |
| Escape | 启用时请求关闭最上层 View。 |
| 清空操作 | 更新为空字符串、发出 clear、聚焦输入，并保持 View 打开。 |

</DocsTable>

MDV 识别可交互 `MdvListItem` 的主要操作，以及带 `data-mdv-search-result` 的可聚焦元素。自定义结果仍需正确的名称和原生交互语义。内部筛选、文字输入和自己处理键盘的组件保留原交互。加载与状态不会将任意内容变成 combobox 或应用菜单。

输入法草稿在组合结束后提交。用于确认候选词的 Enter、重复 Enter 和旧式输入法键码不会提交搜索。示例文字保持英文，组件输入支持组合文本。

SearchView 包含入口输入与展开输入，共享同一搜索词。使用 `input-attrs` 提供 `id`、`name`、`form`、`required` 和原生输入监听。仅当前活动输入参与表单，传入 ID 也随之分配。需要时重新读取 `inputElement`，不要缓存可能转为非活动状态的输入。SearchView 根属性属于外壳，SearchAppBar 根属性属于应用栏。

默认 placeholder、清空和返回标签是中文，英文示例均显式覆盖。MDV 0.1.5 的内部结果区名称另固定为“搜索建议与结果”，没有公开覆盖入口；本地化该内部名称需要库侧改进。应用应自行本地化 `status-text`。

MDV 提供减少动态效果、原生 dialog 焦点和文档滚动锁定。真实触摸、读屏、视觉视口变化、SSR/hydration 及跨浏览器嵌套模态仍需结合应用验证。停靠面板默认不额外提供搜索专属阴影。

## API

### MdvSearchBar

<ApiTable :items="barProps" />

<SlotsTable :items="barSlots" />

### MdvSearchView

继承 SearchBar 属性，搜索词初始为 `''`，另有：

<ApiTable :items="viewProps" />

<SlotsTable :items="viewSlots" />

搜索插槽状态为 `{ query: string, expanded: boolean, close: () => Promise<boolean>, search: (event?: Event) => void }`。`search()` 提交当前词并聚焦结果，`close()` 使用 `programmatic` 原因请求关闭。自定义入口还接收 `triggerProps`，包含 `ref`、`aria-haspopup="dialog"`、`aria-controls`、`aria-expanded`、可选 `disabled` 和 `onClick`。

### MdvSearchAppBar

继承全部 SearchView 属性，另有：

<ApiTable :items="appBarProps" />

<SlotsTable :items="appBarSlots" />

`scrollTarget` 与 AppBar 使用相同类型，影响滚动观察，不影响结果定位。没有 `variant="small"`、标题、中大尺寸展开或 `exit-until-collapsed` 搜索 API；这里的 `variant` 表示 contained/divided 搜索外观。

### 模型与事件

<DocsTable label="搜索事件">

| 事件 | 组件 | 参数与含义 |
| --- | --- | --- |
| `update:modelValue` | 全部 | `string`，搜索词更新请求。 |
| `update:open` | View / AppBar | `boolean`，展开状态更新请求。 |
| `search` | Bar | `(query: string, originalEvent: KeyboardEvent)`，Enter 提交。 |
| `search` | View / AppBar | `(query: string, originalEvent?: Event)`，输入或插槽主动提交。 |
| `clear` | 全部 | 无参数，清空操作被激活。 |
| `open` / `opened` | View / AppBar | 打开被接受 / 打开动画结束。 |
| `close` / `closed` | View / AppBar | `MdvSearchCloseDetail`，关闭被接受 / 关闭动画结束。 |

</DocsTable>

关闭详情为 `{ reason: 'back' | 'escape' | 'scrim' | 'programmatic' | 'model' }`。请求关闭时，`beforeClose` 接收只读详情；直接改模型的原因为 `model`，会绕过守卫。已接受的生命周期与更新请求不同。

### 公开属性与方法

<DocsTable label="搜索公开 API">

| 成员 | 组件 | 含义 |
| --- | --- | --- |
| `element` | 全部 | SearchBar/SearchView 外壳；SearchAppBar 对应应用栏根。 |
| `inputElement` | 全部 | 当前输入，不存在时为 null；View/AppBar 返回活动输入。 |
| `focus(options?: FocusOptions)` | 全部 | 聚焦对应输入；收起的自定义入口聚焦按钮。 |
| `blur()` | 全部 | 使对应输入或入口失焦。 |
| `open(): Promise<boolean>` | View / AppBar | 请求打开并返回模型接受结果。 |
| `close(): Promise<boolean>` | View / AppBar | 经过守卫请求程序关闭并返回接受结果。 |
| `refresh()` | AppBar | 刷新应用栏滚动与布局测量。 |

</DocsTable>

这些组件不公开自定义有效性辅助方法，需要原生校验方法时使用当前 `inputElement`。调用公开方法也不会绕过受控 query/open 的父级接受规则。

### 公开类型

```ts
import type {
  MdvSearchVariant,
  MdvSearchLayout,
  MdvSearchCloseReason,
  MdvSearchCloseDetail,
  MdvSearchBeforeClose,
  MdvSearchBarProps,
  MdvSearchViewProps,
  MdvSearchAppBarProps,
  MdvSearchSlotProps,
  MdvSearchTriggerProps,
  MdvSearchTriggerSlotProps,
} from '@mdv-ui/mdv'
```

`MdvSearchBeforeClose` 返回 `boolean | void | Promise<boolean | void>`。应用栏插槽状态与滚动目标分别使用 `MdvAppBarSlotProps`、`MdvAppBarScrollTarget`，详见[应用栏](./app-bar)。
