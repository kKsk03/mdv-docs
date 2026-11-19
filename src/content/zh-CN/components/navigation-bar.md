<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import NavigationBarBasicDemo from '@/components/docs/demos/navigationBar/basic.vue'
import NavigationBarOrientationDemo from '@/components/docs/demos/navigationBar/orientation.vue'
import NavigationBarLinksDemo from '@/components/docs/demos/navigationBar/links.vue'
import NavigationBarThemeDemo from '@/components/docs/demos/navigationBar/theme.vue'

const barProps: ApiTableItem[] = [
  { name: 'orientation', type: "'auto' | 'vertical' | 'horizontal'", default: "'auto'", description: '每个条目内部图标与标签的排列。Auto 在导航栏容器宽度小于 600px 时纵排，达到 600px 时横排；导航栏本身仍位于底部。' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', default: '必填', description: '始终可见的目的地名称，也是默认可访问名称。' },
  { name: 'href', type: 'string', description: '传入后渲染原生链接，包括空字符串；省略时渲染 type=button 的操作。' },
  { name: 'active', type: 'boolean', default: 'false', description: '由应用维护的当前目的地。添加选中指示器与 aria-current=page，不会自行导航。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用原生按钮，或移除链接 href、通过 aria-disabled=true 表达禁用并退出 Tab 顺序。' },
]
const barSlots: SlotTableItem[] = [
  { name: 'default', description: '放置 NavigationBarItem 目的地，无参数。' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'icon', description: '目的地图标，接收 { active }，可切换描边/填充图形。对辅助技术隐藏，名称由 label 提供。' },
  { name: 'badge', description: '位于图标附近的可选 Badge 或计数内容，接收 { active }。重要通知信息应包含在目的地可访问名称中。' },
]
</script>

# 导航栏

`MdvNavigationBar` 提供固定在底部的导航表面，`MdvNavigationBarItem` 用图标与始终可见的文字表示顶层目的地。建议放置 3–5 个简短目的地；目的地较多或需要更宽的持久侧栏时，应由应用布局选择其他导航组件。

## 目的地、选中图标与徽标

当前目的地由应用维护，在导航成功后更新 `active`；导航栏与条目均没有选择 `v-model`。图标插槽接收 `active`，可以切换图形而不挤动文字和徽标。

<DemoBlock>
  <NavigationBarBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvIcon, MdvNavigationBar, MdvNavigationBarItem } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import activeHomeIcon from '@iconify-icons/material-symbols/home'
import exploreIcon from '@iconify-icons/material-symbols/explore-outline'
import activeExploreIcon from '@iconify-icons/material-symbols/explore'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import activeBookmarkIcon from '@iconify-icons/material-symbols/bookmark'

const current = ref('home')
const destinations = [
  { id: 'home', label: 'Home', icon: homeIcon, activeIcon: activeHomeIcon },
  { id: 'explore', label: 'Explore', icon: exploreIcon, activeIcon: activeExploreIcon, badge: '3' },
  { id: 'saved', label: 'Saved', icon: bookmarkIcon, activeIcon: activeBookmarkIcon },
]
</script>

<template>
  <div class="relative isolate h-64 overflow-hidden rounded-xl bg-mdv-surface-container-low [contain:layout]">
    <div class="p-6 pb-28">
      <p class="font-medium">My library</p>
      <p class="mt-3 text-sm text-mdv-on-surface-variant" role="status">Current destination: {{ current }}</p>
    </div>
    <MdvNavigationBar aria-label="Library destinations">
      <MdvNavigationBarItem v-for="destination in destinations" :key="destination.id" :label="destination.label" :active="current === destination.id" :aria-label="destination.badge ? `${destination.label}, ${destination.badge} unread updates` : undefined" @click="current = destination.id">
        <template #icon="{ active }"><MdvIcon :icon="active ? destination.activeIcon : destination.icon" /></template>
        <template v-if="destination.badge" #badge><MdvBadge variant="large" :content="destination.badge" /></template>
      </MdvNavigationBarItem>
    </MdvNavigationBar>
  </div>
</template>
```

  </template>
</DemoBlock>

在线演示通过包含块，将真实固定定位的导航栏限制在示例视口内。这属于预览外壳，不是 Navigation Bar 的定位属性。实际应用中，导航栏通常固定于真正的视口。

示例通过目的地名称表达 Explore 的通知计数。计数本身不应成为独立键盘目标，也不应替换目的地的可见标签。

## 自动与显式排列

`orientation` 表示条目内部图标与文字如何排列，并不改变导航栏的物理位置。`auto` 根据具名容器的宽度，小于 600px 时纵排，达到 600px 时横排；显式 `vertical` 与 `horizontal` 会强制对应排列。

<DemoBlock>
  <NavigationBarOrientationDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvNavigationBar, MdvNavigationBarItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvNavigationBarOrientation } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import searchIcon from '@iconify-icons/material-symbols/search'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const orientation = ref<MdvNavigationBarOrientation>('auto')
const wide = ref(false)
const current = ref('Home')
const options = ['auto', 'vertical', 'horizontal'].map(value => ({ value, label: value }))
const destinations = [{ label: 'Home', icon: homeIcon }, { label: 'Search', icon: searchIcon }, { label: 'Saved', icon: bookmarkIcon }]
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="orientation" :options="options" label="Item orientation" @update:model-value="orientation = $event as MdvNavigationBarOrientation" />
    <MdvCheckbox v-model="wide" label="Use a 720px preview" />
    <div class="overflow-x-auto rounded-xl" role="region" aria-label="Navigation bar width preview" tabindex="0">
      <div class="relative isolate h-56 overflow-hidden bg-mdv-surface-container-low [contain:layout]" :style="{ inlineSize: wide ? '720px' : 'min(100%, 360px)' }">
        <p class="p-6 pb-28 text-sm text-mdv-on-surface-variant">{{ orientation }} · {{ wide ? '720px' : 'up to 360px' }}</p>
        <MdvNavigationBar :orientation="orientation" aria-label="Orientation example destinations">
          <MdvNavigationBarItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" @click="current = destination.label">
            <template #icon><MdvIcon :icon="destination.icon" /></template>
          </MdvNavigationBarItem>
        </MdvNavigationBar>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

开启 720px 预览可以查看中等宽度布局，空间不足时在示例内横向滚动。更宽时，MDV 不会自动将导航栏替换成 Rail 或 Drawer。

<DocsTable label="导航栏尺寸" min-width="32rem">

| 排列 | 导航栏最小高度 | 条目最小高度 | 指示器 |
| --- | --- | --- | --- |
| 纵排 | 80px | 56px | 图标后的 64 × 32px 胶囊 |
| 横排 | 64px | 48px | 图标与文字后的胶囊 |

</DocsTable>

这些是最小值，标签换行或放大文字可能撑高。横排条目最大宽 168px，条目集合最大宽 840px。MDV 会处理底部安全区；页面正文需要为实际导航栏高度和安全区预留空间，避免末段内容被遮挡。固定定位外壳本身不占布局空间。

## 原生链接与路由组合

真实目的地使用 `href`，保留原生导航、修饰键点击和链接语义。与 Vue Router 组合时，使用自定义 RouterLink 插槽提供的 `href`、`isExactActive`、`navigate`，将其绑定到条目，不要在交互元素中再嵌套链接。

<DemoBlock>
  <NavigationBarLinksDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { MdvCheckbox, MdvIcon, MdvNavigationBar, MdvNavigationBarItem } from '@mdv-ui/mdv'
import bookIcon from '@iconify-icons/material-symbols/menu-book'
import settingsIcon from '@iconify-icons/material-symbols/settings'
import navigationIcon from '@iconify-icons/material-symbols/navigation-outline'

const route = useRoute()
const disableSetup = ref(false)
const locale = computed(() => route.meta.locale === 'zh-CN' ? 'zh-CN' : 'en-US')
const destinations = [
  { slug: 'getting-started/introduction', label: 'Intro', icon: bookIcon },
  { slug: 'getting-started/setup', label: 'Setup', icon: settingsIcon },
  { slug: 'components/navigation-bar', label: 'Navigation', icon: navigationIcon },
]
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disableSetup" label="Disable the Setup destination" />
    <div class="relative isolate h-56 overflow-hidden rounded-xl bg-mdv-surface-container-low [contain:layout]">
      <p class="p-6 pb-28 text-sm text-mdv-on-surface-variant">These links navigate to real documentation pages.</p>
      <MdvNavigationBar aria-label="Documentation example destinations">
        <RouterLink v-for="destination in destinations" :key="destination.slug" :to="`/${locale}/${destination.slug}`" custom v-slot="{ href, isExactActive, navigate }">
          <MdvNavigationBarItem :href="href" :label="destination.label" :active="isExactActive" :disabled="disableSetup && destination.label === 'Setup'" @click="disableSetup && destination.label === 'Setup' ? $event.preventDefault() : navigate($event)">
            <template #icon><MdvIcon :icon="destination.icon" /></template>
          </MdvNavigationBarItem>
        </RouterLink>
      </MdvNavigationBar>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

以上为真实文档链接。Intro 与 Setup 会离开当前文章，Navigation 指向当前页面。示例跟随当前文档语言，但演示标签保持英文。

应使用路由器的激活状态，而不是在导航守卫完成前立即修改独立选中模型。禁用链接移除 `href`，输出 `aria-disabled="true"` 与 `tabindex="-1"`。组件本身不会生成 URL。

在 MDV 0.1.5 中，禁用链接会取消原生导航，但不会阻止应用传入的 click 回调。因此示例会先检查禁用状态，再调用 RouterLink 的 `navigate`；自定义导航回调也应保留此检查。这个库侧集成问题已记录到文档开发清单。

## 局部主题、方向与较长标签

主题作用域提供表面与指示器颜色。RTL 跟随逻辑布局方向，标签需要换行时仍保持可见。顶层目的地名称应尽量简短，不应为了腾空间而隐藏标签。

<DemoBlock>
  <NavigationBarThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvCheckbox, MdvIcon, MdvNavigationBar, MdvNavigationBarItem } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import mailIcon from '@iconify-icons/material-symbols/mail-outline'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const rtl = ref(false)
const current = ref('Inbox')
const destinations = [{ label: 'Home', icon: homeIcon }, { label: 'Inbox', icon: mailIcon }, { label: 'Recently saved', icon: bookmarkIcon }]
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="rtl" label="Use right-to-left navigation bars" />
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" :dir="rtl ? 'rtl' : 'ltr'" class="relative isolate h-56 min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low text-mdv-on-surface [contain:layout]">
        <p class="p-5 pb-32 text-sm">{{ theme }} · {{ current }}</p>
        <MdvNavigationBar orientation="vertical" :aria-label="`${theme} example destinations`">
          <MdvNavigationBarItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" :aria-label="destination.label === 'Inbox' ? 'Inbox, more than 9 unread messages' : undefined" @click="current = destination.label">
            <template #icon><MdvIcon :icon="destination.icon" /></template>
            <template v-if="destination.label === 'Inbox'" #badge><MdvBadge variant="large" content="9+" /></template>
          </MdvNavigationBarItem>
        </MdvNavigationBar>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

选中指示器使用 `secondary-container`，选中图标使用 `on-secondary-container`，其他文字/图标使用 `on-surface-variant`。未选中项 hover 时，胶囊在 200ms 内从中心展开；已选中项保留指示器，焦点/按压叠加状态层。减少动态效果时缩短过渡，强制颜色模式使用系统边框与焦点色。没有公开的颜色或隐藏标签属性。

## 键盘、语义与布局职责

根节点为原生导航 landmark，应通过 `aria-label` 或 `aria-labelledby` 命名，尤其是同页还有抽屉或本页目录时。条目保留按钮/链接语义，当前目的地输出 `aria-current="page"`。

所有可用目的地按原生顺序参与 Tab。按钮通过原生 Enter/Space 激活，链接遵守原生规则，禁用项退出 Tab。没有单一停靠项、方向键选择、tablist/面板关系或滑动导航。

响应式断点、路由、当前目的地和正文留白由应用负责。导航栏不会自动接入 AppBarScaffold，不管理文档滚动，也不生成正文面板。除非刻意像演示一样建立局部视口，否则应避免将固定导航栏放入带 `transform` 或布局包含的祖先中。

## API

### MdvNavigationBar

<ApiTable :items="barProps" />

<SlotsTable :items="barSlots" />

没有组件事件、模型或额外暴露方法。非语义外层提供固定定位与具名尺寸容器；`class`、`style`、`id`、`dir`、`aria-label` 和原生监听器作用于内部 `nav`。导航语义保持不变，不接受其他 `role` 覆盖。

### MdvNavigationBarItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

没有组件事件、模型、默认插槽或额外暴露方法。原生 `click` 与其余属性作用于实际按钮/链接。按钮类型由组件管理为 `button`，放入表单也不会变成提交按钮。链接 `target`、`rel`、`download` 保持原生行为，MDV 管理 `role`、禁用状态、Tab 与当前页面 ARIA。

### 公共类型

```ts
import type {
  MdvNavigationBarOrientation,
  MdvNavigationBarProps,
  MdvNavigationBarItemProps,
  MdvNavigationBarItemSlotProps,
} from '@mdv-ui/mdv'
```

没有图标数据属性或颜色/尺寸/位置模型，应使用图标/徽标插槽、继承主题和已支持的排列方式。MDV 不强制建议的目的地数量，也不捆绑路由器。
