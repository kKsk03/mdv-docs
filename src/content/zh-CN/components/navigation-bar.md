<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import NavigationBarBasicDemo from '@/components/docs/demos/navigationBar/basic.vue'
import NavigationBarOrientationDemo from '@/components/docs/demos/navigationBar/orientation.vue'
import NavigationBarLinksDemo from '@/components/docs/demos/navigationBar/links.vue'

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

用 `MdvNavigationBar` 在视口底部展示少量主要入口，每个入口使用一个 `MdvNavigationBarItem`。

## 入口与徽标

根据当前入口设置 `active`。图标插槽可根据 `active` 切换图案，`badge` 插槽可展示数量或状态。请为导航栏提供明确的无障碍名称。

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

## 图标与标签布局

`orientation` 设置图标与标签的排列方式。`auto` 在容器宽度小于 600px 时上下排列，达到 600px 后左右排列。请为固定在底部的导航栏预留空间。

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

## 链接与路由

用 `href` 指定链接。集成 Vue Router 时，通过 `RouterLink` 的自定义插槽获取 `href`、`isExactActive` 和 `navigate`，不要嵌套链接。`disabled` 会禁用原生跳转，但不会阻止自定义点击回调，请在回调里检查禁用状态。

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

---

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
