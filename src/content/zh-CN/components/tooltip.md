<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import PlainDemo from '@/components/docs/demos/tooltip/plain.vue'
import RichDemo from '@/components/docs/demos/tooltip/rich.vue'
import OverlayDemo from '@/components/docs/demos/tooltip/overlay.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', description: '控制是否请求打开提示；省略时内部管理，初始关闭。' },
  { name: 'text', type: 'string', description: '未提供默认插槽时的正文。面板须有非空文本才能打开。' },
  { name: 'placement', type: 'MdvTooltipPlacement', default: "'top' / 'bottom-start'", description: '首选方向和对齐方式。普通款默认 top，富提示默认 bottom-start；空间不足时可翻转或平移。' },
  { name: 'offset', type: 'number', default: '4', description: '与触发器的间隔，单位为像素。无边界的触发器可按需加大距离。' },
  { name: 'openDelay', type: 'number', default: '600', description: '悬停打开的延迟，单位为毫秒。不影响键盘聚焦、触屏长按阈值或持久富提示。' },
  { name: 'closeDelay', type: 'number', description: '覆盖移出悬停区域或长按松手后的关闭延迟，单位为毫秒；省略时按交互场景取默认值。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '只禁用提示，不禁用触发操作。隐藏面板并撤销该提示自身的 ARIA 关联。' },
]
const richProps: ApiTableItem[] = [
  { name: 'title', type: 'string', description: '可选标题。title 插槽优先；渲染后的标题默认也是面板的无障碍名称。' },
  { name: 'persistent', type: 'boolean', default: 'false', description: '通过激活触发器开关，而不是靠悬停、聚焦或长按自动打开。移开指针时仍保持打开。' },
]
const slots: SlotTableItem[] = [
  { name: 'trigger', description: '接收 { triggerProps, open, close }。把完整的 triggerProps 绑定到一个可交互元素，或绑定到能把这些绑定透传给该元素的组件。' },
  { name: 'default', description: '替代 text。普通款只放说明文字；富提示可放简短段落和内联链接。' },
]
const richSlots: SlotTableItem[] = [
  { name: 'title', description: '替代 title 提供的标题。' },
  { name: 'actions', description: '可选操作区，建议放一至两个文字按钮。需要在执行操作后关闭时调用 close()。' },
]
</script>
# 提示气泡

用 `MdvTooltip` 提供简短说明，用 `MdvRichTooltip` 提供带标题或操作的上下文帮助。必要说明应直接显示，不要只放在气泡中。

## 普通提示

把 `#trigger` 提供的完整 `triggerProps` 绑定到同一个控件。提示气泡只提供描述，不能代替图标按钮的无障碍名称。

<DemoBlock>
  <PlainDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvTooltip } from '@mdv-ui/mdv'
import refreshIcon from '@iconify-icons/material-symbols/refresh'

const noteId = `refresh-note-${useId()}`
const disabled = ref(false)
const count = ref(0)
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <MdvTooltip text="Fetch the latest preview data." :disabled="disabled">
        <template #trigger="{ triggerProps }">
          <MdvIconButton
            v-bind="triggerProps"
            variant="standard"
            aria-label="Refresh preview"
            :aria-describedby="noteId"
            @click="count++"
          >
            <MdvIcon :icon="refreshIcon" />
          </MdvIconButton>
        </template>
      </MdvTooltip>
      <MdvCheckbox v-model="disabled" label="Disable the tooltip" />
    </div>
    <p :id="noteId" class="text-sm text-mdv-on-surface-variant">Refreshing never changes the saved draft.</p>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Refreshes: {{ count }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 富提示

设置 `persistent` 后，可通过激活触发控件开关提示。用 `title` 或 `aria-label` 为面板命名，其中的链接和按钮可通过 Tab 到达。

<DemoBlock>
  <RichDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvRichTooltip } from '@mdv-ui/mdv'

const detailsId = `storage-details-${useId()}`
const acknowledged = ref(false)
</script>

<template>
  <div class="grid min-w-0 justify-items-start gap-3">
    <MdvRichTooltip persistent title="Offline access" placement="bottom-start">
      <template #trigger="{ triggerProps }">
        <MdvButton v-bind="triggerProps" variant="outlined">About offline access</MdvButton>
      </template>
      <p>
        Downloads are available without a connection.
        <a :href="`#${detailsId}`" class="text-mdv-primary underline">Storage details</a>
      </p>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="acknowledged = true; close()">Got it</MdvButton>
      </template>
    </MdvRichTooltip>
    <p :id="detailsId" tabindex="-1" class="text-sm text-mdv-on-surface-variant">
      Storage details: downloads stay on this device until removed.
    </p>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ acknowledged ? 'Offline help acknowledged.' : 'Offline help not acknowledged.' }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 浮层中的提示

临时提示可通过悬停、聚焦或触屏长按打开。将提示气泡放在所属浮层中，按 Escape 会先关闭气泡，再关闭父对话框。显示气泡需要浏览器支持 Popover API。

<DemoBlock>
  <OverlayDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvRichTooltip } from '@mdv-ui/mdv'
import type { MdvTooltipCloseDetail } from '@mdv-ui/mdv'

const dialogOpen = ref(false)
const tooltipOpen = ref(false)
const autoSelected = ref(false)
const lastClose = ref<MdvTooltipCloseDetail['reason'] | null>(null)
</script>

<template>
  <div class="grid min-w-0 justify-items-start gap-3">
    <MdvButton variant="outlined" @click="dialogOpen = true">Open preview settings</MdvButton>
    <MdvDialog v-model="dialogOpen" title="Preview settings">
      <p class="mb-3">Focus or hover over the resolution action for more context.</p>
      <MdvRichTooltip
        v-model="tooltipOpen"
        title="Automatic resolution"
        text="The preview size follows the available space."
        @close="lastClose = $event.reason"
      >
        <template #trigger="{ triggerProps }">
          <MdvButton v-bind="triggerProps" variant="outlined" @click="autoSelected = true">
            Use auto resolution
          </MdvButton>
        </template>
      </MdvRichTooltip>
      <template #actions="{ close }">
        <MdvButton variant="text" autofocus @click="close()">Close settings</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ autoSelected ? 'Automatic resolution selected.' : 'Resolution unchanged.' }}
      Last tooltip close: {{ lastClose ?? 'none' }}.
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### 公共属性

<ApiTable :items="props" />

### 富提示专用属性

<ApiTable :items="richProps" />

### 公共插槽

<SlotsTable :items="slots" />

### 富提示专用插槽

<SlotsTable :items="richSlots" />

内容插槽接收 `{ open, close }`；调用插槽中的 `close()` 会请求程序化关闭。`id`、`class`、`style`、`dir` 和面板的 ARIA 属性作用于面板；触发器的名称、ID 等原生属性则直接写在 `#trigger` 里的控件上。

### 事件与暴露方法

- `update:modelValue(boolean)` 请求改变状态。`open` 和 `close(detail)` 表示开始打开或关闭；`opened` 和 `closed(detail)` 表示该阶段结束。动效被中断时不会发送被取消阶段的完成事件。
- `detail.reason` 可为 `leave`、`focus-out`、`escape`、`outside`、`trigger`、`replaced`、`owner`、`disabled`、`empty`、`model` 或 `programmatic`。
- 模板 ref 暴露 `open()`、`close()` 和 `toggle()`，用于请求状态变化，不等待动效结束。所属浮层关闭或提示被替换后，触发器恢复可用时可以显式调用 `open()` 再次打开。

### 公共类型

```ts
import type {
  MdvTooltipProps,
  MdvRichTooltipProps,
  MdvTooltipPlacement,
  MdvTooltipCloseReason,
  MdvTooltipCloseDetail,
  MdvTooltipSlotProps,
  MdvTooltipTriggerProps,
  MdvTooltipTriggerSlotProps,
} from '@mdv-ui/mdv'
```
