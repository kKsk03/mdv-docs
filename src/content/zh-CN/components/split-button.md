<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import MenuDemo from '@/components/docs/demos/splitButton/menu.vue'
import VariantsDemo from '@/components/docs/demos/splitButton/variants.vue'
import StateDemo from '@/components/docs/demos/splitButton/state.vue'

const splitButtonProps: ApiTableItem[] = [
  { name: 'variant', type: 'MdvSplitButtonVariant', default: "'filled'", description: "'filled'、'tonal'、'outlined' 或 'elevated'。" },
  { name: 'size', type: 'MdvButtonSize', default: "'s'", description: "可选 'xs'、's'、'm'、'l'、'xl'。" },
  { name: 'color', type: 'MdvButtonColor', description: '主题色、语义色或 #RGB/#RRGGBB 种子色。' },
  { name: 'expanded', type: 'boolean', default: 'false', description: '已接受的菜单展开状态，用于箭头、形状和 aria-expanded；组件自身不会切换该值。' },
  { name: 'menuButtonLabel', type: 'string', description: '尾部菜单按钮的无障碍名称，例如“更多保存选项”。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '同时禁用主操作和菜单按钮。' },
  { name: 'actionDisabled / menuDisabled', type: 'boolean', default: 'false', description: '仅禁用对应一侧。' },
  { name: 'loading', type: 'boolean', default: 'false', description: '在主操作上显示进度；不会禁用菜单入口。' },
  { name: 'loadingText', type: 'string', description: '加载期间主操作临时显示/朗读的标签。' },
  { name: 'iconOnly', type: 'boolean', default: 'false', description: '将默认插槽作为主图标；通过 actionAttrs 为主操作命名。' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: '主按钮的原生类型；菜单一侧始终为 type button。' },
  { name: 'href', type: 'string', description: '将主操作渲染为原生链接。' },
  { name: 'hoverShadow / fullWidth', type: 'boolean', default: 'false', description: '启用悬停阴影或填满可用宽度。' },
  { name: 'actionAttrs', type: 'MdvSplitButtonActionAttrs', description: '主控件的原生属性、ARIA、兼容 ref 的值及监听器。' },
  { name: 'menuButtonAttrs', type: 'MdvSplitButtonMenuAttrs', description: '菜单控件的原生属性/监听器以及函数或 Vue ref；可接收 MdvMenu triggerProps。' },
]
const splitButtonSlots: SlotTableItem[] = [
  { name: 'default', description: '主操作标签；iconOnly 时作为图标。' },
  { name: 'leading / trailing', description: '主标签旁的装饰图标；加载时隐藏。' },
]
</script>
# Split Button

用 `MdvSplitButton` 提供一个主操作，以及菜单中的相关备选操作。

## 与 MdvMenu 组合

将 `MdvMenu` 触发插槽的 `triggerProps` 传给 `menu-button-attrs`，把 `open` 状态传给 `expanded`。主按钮的点击单独处理。

<DemoBlock>
  <MenuDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvMenu, MdvMenuItem, MdvSplitButton } from '@mdv-ui/mdv'

const result = ref('Choose a primary action or open related options.')
function save() { result.value = 'The document was saved.' }
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps, open }">
        <MdvSplitButton :expanded="open" :menu-button-attrs="triggerProps" menu-button-label="More save options" @click="save">Save</MdvSplitButton>
      </template>
      <MdvMenuItem label="Save a copy" @select="result = 'A copy was saved.'" />
      <MdvMenuItem label="Export as PDF" @select="result = 'PDF export requested.'" />
    </MdvMenu>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 变体与尺寸

用 `variant` 和 `size` 同时设置两部分的外观与尺寸。

<DemoBlock>
  <VariantsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvSplitButton } from '@mdv-ui/mdv'
import type { MdvButtonSize, MdvSplitButtonVariant } from '@mdv-ui/mdv'

const variants: MdvSplitButtonVariant[] = ['filled', 'tonal', 'outlined', 'elevated']
const sizes: MdvButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const disabled = ref(true)
const result = ref('Each half has its own action and focus target.')
</script>

<template>
  <div class="grid min-w-0 gap-6">
    <div class="flex flex-wrap items-center gap-3">
      <MdvSplitButton v-for="variant in variants" :key="variant" :variant="variant" :menu-button-label="`More ${variant} actions`" @click="result = `${variant} action`">{{ variant }}</MdvSplitButton>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <MdvSplitButton v-for="size in sizes" :key="size" :size="size" :menu-button-label="`More size ${size} actions`">{{ size }}</MdvSplitButton>
    </div>
    <MdvCheckbox v-model="disabled" label="Disable the example main action" />
    <div class="flex flex-wrap items-center gap-3">
      <MdvSplitButton :action-disabled="disabled" menu-button-label="More available actions" @menu-click="result = 'The menu side remains available.'">Independent action state</MdvSplitButton>
      <MdvSplitButton loading loading-text="Saving" menu-button-label="More save actions">Save</MdvSplitButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 加载与禁用状态

加载状态只影响主操作。两部分可以分别禁用。主操作只有图标时，在 `action-attrs` 中提供无障碍名称。

<DemoBlock>
  <StateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvSplitButton } from '@mdv-ui/mdv'

const disabled = ref(false)
const loading = ref(false)
const result = ref('Use the focus controls to move between native actions.')
const splitButton = useTemplateRef<InstanceType<typeof MdvSplitButton>>('splitButton')
function submit() { result.value = 'The native submit action ran.' }
</script>

<template>
  <div class="grid min-w-0 gap-5">
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="outlined" @click="disabled = !disabled">Toggle disabled</MdvButton>
      <MdvButton variant="outlined" @click="loading = !loading">Toggle loading</MdvButton>
      <MdvButton variant="text" @click="splitButton?.focus()">Focus main action</MdvButton>
      <MdvButton variant="text" @click="splitButton?.focusMenu()">Focus menu action</MdvButton>
    </div>
    <MdvSplitButton ref="splitButton" :disabled="disabled" :loading="loading" loading-text="Saving" menu-button-label="More save actions" @click="submit">Save document</MdvSplitButton>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### 属性

<ApiTable :items="splitButtonProps" />

### 插槽

<SlotsTable :items="splitButtonSlots" />

### 事件与方法

<DocsTable label="Split Button 事件">

| 事件 | 参数 | 含义 |
| --- | --- | --- |
| `click` | `MouseEvent` | 主操作被激活。 |
| `menu-click` | `MouseEvent` | 菜单入口被激活；不会单独切换外部菜单状态。 |

</DocsTable>

在对应事件中同步调用 `preventDefault()` 可取消后续的 `actionAttrs.onClick` 或 `menuButtonAttrs.onClick` 回调及原生默认行为。实例公开 `element`、`actionElement`、`menuButtonElement`、`focus(options?)`、`focusMenu(options?)` 和 `blur()`。

`class`、`style`、`dir` 和组级 ARIA 作用于外层 `role="group"`。控件专属原生属性应放到对应 attrs 属性中。MDV 管理的禁用状态、菜单可访问名称和 `aria-expanded` 会覆盖冲突值。

### 公共类型

```ts
import type {
  MdvSplitButtonVariant,
  MdvSplitButtonActionAttrs,
  MdvSplitButtonMenuAttrs,
  MdvSplitButtonProps,
  MdvButtonColor,
  MdvButtonSize,
} from '@mdv-ui/mdv'
```
