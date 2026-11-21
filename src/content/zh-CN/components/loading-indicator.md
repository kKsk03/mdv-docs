<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import LoadingAppearanceDemo from '@/components/docs/demos/loadingIndicator/appearance.vue'
import LoadingTaskDemo from '@/components/docs/demos/loadingIndicator/task.vue'
import LoadingButtonDemo from '@/components/docs/demos/loadingIndicator/button.vue'

const indicatorProps: ApiTableItem[] = [
  { name: 'contained', type: 'boolean', default: 'false', description: '增加圆形 primary-container 背景，图形使用 on-primary-container。' },
  { name: 'size', type: 'number', default: '48', description: '整体 CSS 像素尺寸。有限值限制在 24–240，非有限数值回退到 48。' },
  { name: 'label', type: 'string', default: "'加载中'", description: '仅作为可访问名称，不显示文字。纯空白标签回退到默认中文名称，请按应用语言显式设置。' },
  { name: 'paused', type: 'boolean', default: 'false', description: '冻结当前动画相位，恢复后继续，不代表任务已经完成。' },
  { name: 'decorative', type: 'boolean', default: 'false', description: '当所属控件已说明加载状态时，移除指示器的角色、名称和描述，并对辅助技术隐藏。' },
]
</script>
# 加载指示器

用 `MdvLoadingIndicator` 表示无法计算百分比的等待状态。已知任务总量时，请用[线性进度条](./linear-progress)。

## 外观与尺寸

用 `variant="contained"` 添加圆形背景。`size` 以 CSS 像素为单位设置整体尺寸。

<DemoBlock>
  <LoadingAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvLoadingIndicator } from '@mdv-ui/mdv'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid justify-items-center gap-4 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
      <span class="text-sm font-medium">{{ theme }}</span>
      <div class="flex flex-wrap justify-center gap-8">
        <div class="grid justify-items-center gap-3">
          <MdvLoadingIndicator :label="`${theme}: loading preview`" />
          <span class="text-sm">Default</span>
        </div>
        <div class="grid justify-items-center gap-3">
          <MdvLoadingIndicator contained :label="`${theme}: loading contained preview`" />
          <span class="text-sm">Contained</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 区域加载

用 `label` 或 `aria-label` 为指示器命名，在正在更新的区域设置 `aria-busy`。完成、错误和重试应分别呈现。

<DemoBlock>
  <LoadingTaskDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const phase = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const fail = ref(false)
const loading = computed(() => phase.value === 'loading')
const message = computed(() => ({
  idle: 'Load recommendations to try the preview.',
  loading: 'Loading recommendations…',
  success: 'Recommendations are ready.',
  error: 'Loading failed. Disable the simulated failure and retry.',
})[phase.value])
let timer: ReturnType<typeof setTimeout> | undefined

function load() {
  if (loading.value) return
  phase.value = 'loading'
  // Simulate a local request; no network request is made.
  timer = setTimeout(() => {
    timer = undefined
    phase.value = fail.value ? 'error' : 'success'
  }, 1200)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap items-center gap-4">
      <MdvButton :disabled="loading" @click="load">Load recommendations</MdvButton>
      <MdvCheckbox v-model="fail" label="Simulate a loading failure" :disabled="loading" />
    </div>
    <section :aria-busy="loading" aria-label="Recommendations" class="grid min-h-40 place-items-center rounded-xl bg-mdv-surface-container-low p-5">
      <MdvLoadingIndicator v-if="loading" label="Loading recommendations" />
      <div v-else-if="phase === 'success'" class="grid gap-2">
        <p class="font-medium">Your reading list</p>
        <p class="text-sm">Designing useful interfaces · Choosing meaningful motion</p>
      </div>
      <p v-else class="text-sm text-mdv-on-surface-variant">{{ phase === 'error' ? 'Nothing loaded. You can retry.' : 'Recommendations will appear here.' }}</p>
    </section>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 在按钮中使用

当按钮已表达加载状态时，把内部指示器设为装饰性内容，避免重复播报。

<DemoBlock>
  <LoadingButtonDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvIcon, MdvLoadingIndicator } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save'

const saving = ref(false)
const saves = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined

function save() {
  if (saving.value) return
  saving.value = true
  timer = setTimeout(() => {
    timer = undefined
    saves.value++
    saving.value = false
  }, 900)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-busy="saving" :disabled="saving" style="--mdv-button-icon-size: 24px" @click="save">
      <template #leading>
        <MdvLoadingIndicator v-if="saving" :size="24" decorative style="--mdv-loading-indicator-active-color: currentColor" />
        <MdvIcon v-else :icon="saveIcon" />
      </template>
      {{ saving ? 'Saving draft…' : 'Save draft' }}
    </MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ saving ? 'Saving the draft.' : `Saved ${saves} times.` }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 颜色变量

可覆盖以下变量，并继续使用主题色值。

<DocsTable label="加载指示器颜色变量" min-width="31rem">

| 变量 | 默认外观 | 容器外观 |
| --- | --- | --- |
| `--mdv-loading-indicator-active-color` | `primary` | `on-primary-container` |
| `--mdv-loading-indicator-container-color` | 不绘制容器 | `primary-container` |

</DocsTable>

---

## API

### Props

<ApiTable :items="indicatorProps" />

### 插槽、事件、方法与属性透传

没有插槽、自定义组件事件、`v-model` 或公开方法。外观通过 `contained` 切换，没有 `variant`、`value`、`max`、`loading` 或请求耗时属性。

原生属性、监听器、`class` 和 `style` 进入根节点 span。MDV 管理加载角色与装饰语义，并移除数值进度的 ARIA 属性。组件不会提交表单值，也不创建遮罩层。

### 公开类型

```ts
import type { MdvLoadingIndicatorProps } from '@mdv-ui/mdv'
```
