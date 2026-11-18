<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ButtonGroupActionsDemo from '@/components/docs/demos/buttonGroup/actions.vue'
import ButtonGroupSingleDemo from '@/components/docs/demos/buttonGroup/single.vue'
import ButtonGroupMultipleDemo from '@/components/docs/demos/buttonGroup/multiple.vue'
import ButtonGroupIndependentDemo from '@/components/docs/demos/buttonGroup/independent.vue'
import ButtonGroupSizeDemo from '@/components/docs/demos/buttonGroup/size.vue'
import ButtonGroupStatesDemo from '@/components/docs/demos/buttonGroup/states.vue'
import ButtonGroupFormDemo from '@/components/docs/demos/buttonGroup/form.vue'

const groupProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvButtonGroupModelValue', default: 'null / []', description: '单选为单值或 null，多选为数组。省略时内部管理；受控时父级必须接受更新。' },
  { name: 'variant', type: "'standard' | 'connected'", default: "'standard'", description: '分离按钮及按压宽度动效，或固定 2px 间距的相连按钮。' },
  { name: 'size', type: "'xs' | 's' | 'm' | 'l' | 'xl'", default: "'s'", description: '公共尺寸。Standard 项可覆盖，Connected 项始终继承。' },
  { name: 'shape', type: "'round' | 'square'", default: "'round'", description: '公共形状，继承规则与 size 相同。' },
  { name: 'selection', type: "'none' | 'single' | 'multiple'", default: 'standard: none; connected: single', description: '普通操作、单选或多选；布局与选择模式可独立配置。' },
  { name: 'selectionRequired', type: 'boolean', default: 'false', description: '阻止取消最后一项，不自动创建初始选择，也不执行 HTML required 校验。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用所有按钮项及组的表单字段。' },
  { name: 'density', type: '0 | -1 | -2 | -3', default: '0', description: '每档负密度减少 4px 视觉高度，交互目标保持至少 48px。' },
  { name: 'fullWidth', type: 'boolean', default: 'standard: false; connected: true', description: '填满可用宽度；纯图标项保持自身宽度，文字项分配剩余空间。' },
  { name: 'name', type: 'string', description: '已接受组选值的隐藏表单字段名。' },
  { name: 'form', type: 'string', description: '可选的外部表单 id。' },
]
const itemProps: ApiTableItem[] = [
  { name: 'value', type: 'string | number', description: '唯一选值及原生按钮值；使用组选中模式时应提供。' },
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'elevated'", default: "'filled'", description: '按钮外观。不支持 text/link 变体，普通链接操作请使用 href。' },
  { name: 'color', type: 'MdvButtonColor', description: 'primary、secondary、tertiary、success、warning、error、info，或 #RGB/#RRGGBB 局部种子色。省略时使用变体默认颜色。' },
  { name: 'size', type: 'MdvButtonSize', default: '继承组', description: '仅 Standard 可以覆盖组尺寸；独立使用时默认 s。' },
  { name: 'shape', type: 'MdvButtonShape', default: '继承组', description: '仅 Standard 可以覆盖组形状；独立使用时默认 round。' },
  { name: 'iconOnly', type: 'boolean', default: 'false', description: '纯图标按钮，必须提供 aria-label 或 aria-labelledby。' },
  { name: 'width', type: "'narrow' | 'default' | 'wide'", default: "'default'", description: '纯图标项的宽度。' },
  { name: 'selected', attribute: 'v-model:selected', type: 'boolean', description: 'selection=none 时的受控独立切换模型；普通操作和组选中模式应省略。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用此项、选择及链接导航。' },
  { name: 'loading', type: 'boolean', default: 'false', description: '显示加载指示器，不自动禁止激活。' },
  { name: 'loadingText', type: 'string', description: '加载期间的临时文字；省略时保留当前标签。' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: '原生按钮类型。' },
  { name: 'href', type: 'string', description: '普通操作渲染为原生链接；组选择和独立切换时忽略。' },
]
const groupSlots: SlotTableItem[] = [
  { name: 'default', description: 'MdvButtonGroupItem 子项，无插槽参数。' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: '文字标签或纯图标项的图标，接收 { selected }。' },
  { name: 'leading', description: '前置装饰内容，接收 { selected }。' },
  { name: 'trailing', description: '后置装饰内容，接收 { selected }。' },
  { name: 'selected', description: '选中图标，替代 leading 或纯图标项的 default；接收 { selected }。不会自动插入勾选符号。' },
]
</script>

# 按钮组

`MdvButtonGroup` 将相关的 `MdvButtonGroupItem` 排成单行。Standard 适合组合相关操作，Connected 将选项在视觉上连接起来。选择模式与布局外观分别配置。

## Standard 普通操作

默认 `standard` 布局使用 `selection="none"`，每项负责自己的原生操作，并可使用不同外观。按下时，当前按钮向直接邻项借用安全空间来扩宽，整组总宽度保持稳定。

<DemoBlock>
  <ButtonGroupActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem } from '@mdv-ui/mdv'

const message = ref('Choose a document action.')
</script>

<template>
  <div class="grid gap-4">
    <MdvButtonGroup aria-label="Document actions">
      <MdvButtonGroupItem @click="message = 'Document saved.'">Save</MdvButtonGroupItem>
      <MdvButtonGroupItem variant="tonal" @click="message = 'A copy was created.'">Duplicate</MdvButtonGroupItem>
      <MdvButtonGroupItem variant="outlined" @click="message = 'Document archived.'">Archive</MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

子项应使用 `MdvButtonGroupItem`，而非直接把普通 `MdvButton` 放入组中。普通操作可以通过 `href` 渲染为原生链接；切换项始终为按钮，并忽略 `href`。

### Connected 单选

Connected 默认开启单选并填满可用宽度。使用 `v-model` 绑定已接受值，并为每项提供唯一 `value`。

<DemoBlock>
  <ButtonGroupSingleDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvButtonGroupModelValue } from '@mdv-ui/mdv'

const view = ref<MdvButtonGroupModelValue>('week')
const required = ref(true)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="required" label="Keep one option selected" />
    <MdvButtonGroup v-model="view" variant="connected" :selection-required="required" aria-label="Calendar view">
      <MdvButtonGroupItem value="day">Day</MdvButtonGroupItem>
      <MdvButtonGroupItem value="week">Week</MdvButtonGroupItem>
      <MdvButtonGroupItem value="month">Month</MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="text-sm text-mdv-on-surface-variant" role="status">View: {{ view ?? '(none)' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

未开启 `selection-required` 时，再次点击已选项会清空为 `null`。该属性只阻止取消最后一项，不自动选中、不使空初始值有效，也不是 HTML `required` 校验。需要默认有值时，应自行初始化模型。

### 多选

设置 `selection="multiple"` 并使用数组模型。需要勾选图标时添加 `selected` 插槽，MDV 不会自动插入。

<DemoBlock>
  <ButtonGroupMultipleDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvIcon } from '@mdv-ui/mdv'
import type { MdvButtonGroupModelValue } from '@mdv-ui/mdv'
import check from '@iconify-icons/material-symbols/check'

const filters = ref<MdvButtonGroupModelValue>(['photos'])
</script>

<template>
  <div class="grid gap-4">
    <MdvButtonGroup v-model="filters" variant="connected" selection="multiple" aria-label="File filters">
      <MdvButtonGroupItem v-for="item in ['photos', 'videos', 'audio']" :key="item" :value="item" variant="tonal">
        {{ item.charAt(0).toUpperCase() + item.slice(1) }}
        <template #selected><MdvIcon :icon="check" /></template>
      </MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Filters: {{ JSON.stringify(filters) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

值可以是字符串或数字，`0` 与 `'0'` 是不同选项。更新会创建新数组，不会直接修改传入数组。Standard 布局也能通过显式 `selection` 开启选择。

---

## 独立切换与图标

每项需要独立布尔模型时，保持 `selection="none"`，分别绑定 `v-model:selected`。纯图标按钮必须提供可访问名称。不要同时使用独立 `selected` 与组的单选/多选模型。

<DemoBlock>
  <ButtonGroupIndependentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvIcon } from '@mdv-ui/mdv'
import boldIcon from '@iconify-icons/material-symbols/format-bold'
import italicIcon from '@iconify-icons/material-symbols/format-italic'
import underlineIcon from '@iconify-icons/material-symbols/format-underlined'

const bold = ref(false)
const italic = ref(false)
const underline = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvButtonGroup selection="none" aria-label="Text formatting">
      <MdvButtonGroupItem v-model:selected="bold" icon-only variant="tonal" aria-label="Bold">
        <MdvIcon :icon="boldIcon" />
      </MdvButtonGroupItem>
      <MdvButtonGroupItem v-model:selected="italic" icon-only variant="tonal" aria-label="Italic">
        <MdvIcon :icon="italicIcon" />
      </MdvButtonGroupItem>
      <MdvButtonGroupItem v-model:selected="underline" icon-only variant="tonal" aria-label="Underline">
        <MdvIcon :icon="underlineIcon" />
      </MdvButtonGroupItem>
    </MdvButtonGroup>
    <p :class="{ 'font-bold': bold, italic, underline }">A short note with independent formatting.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

纯图标项支持 `width="narrow"`、`"default"`、`"wide"`。`default`、`leading`、`trailing`、`selected` 插槽均接收 `{ selected }`。插槽只放装饰内容，不在按钮内部再放交互控件。

---

## 尺寸、形状与密度

五档尺寸沿用 Button 的规格。Standard 可在子项覆盖组的 `size`、`shape`，Connected 则统一继承，以保持连接处的形状一致。可切换 Square shape 与 Density -2 比较效果。

<DemoBlock>
  <ButtonGroupSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvButtonSize } from '@mdv-ui/mdv'

const sizes: MdvButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const square = ref(false)
const dense = ref(false)
const message = ref('Choose a size example.')
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="square" label="Square shape" />
      <MdvCheckbox v-model="dense" label="Density -2" />
    </div>
    <div v-for="size in sizes" :key="size" class="grid min-w-0 gap-2">
      <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      <MdvButtonGroup :size="size" :shape="square ? 'square' : 'round'" :density="dense ? -2 : 0" :aria-label="`${size} actions`">
        <MdvButtonGroupItem @click="message = `Selected ${size} start.`">Start</MdvButtonGroupItem>
        <MdvButtonGroupItem variant="tonal" @click="message = `Selected ${size} stop.`">Stop</MdvButtonGroupItem>
      </MdvButtonGroup>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="按钮组尺寸与间距">

| 尺寸 | 默认视觉高度 | Standard 间距 |
| --- | --- | --- |
| `xs` | 32px | 18px |
| `s` | 40px | 12px |
| `m` | 56px | 8px |
| `l` | 96px | 8px |
| `xl` | 136px | 8px |

</DocsTable>

Connected 间距固定为 2px。密度支持 `0`、`-1`、`-2`、`-3`，每档减少 4px 视觉高度，交互目标仍至少为 48px。字体放大时表面允许自然增高。

按钮组保持单行，空间不足时在内部横向滚动。长操作列表优先缩短标签或显式组合菜单。`full-width` 在 Standard 中默认为 `false`，Connected 中默认为 `true`，可以自行覆盖。

## 禁用、加载与颜色

组的 `disabled` 禁用全部子项，子项自己的 `disabled` 只禁用该项。加载仅改变视觉，本例同时绑定 `disabled`，避免显示加载指示器时重复发布。

<DemoBlock>
  <ButtonGroupStatesDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvCheckbox } from '@mdv-ui/mdv'

const loading = ref(false)
const disabled = ref(false)
const message = ref('Toggle the states, then try the available actions.')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="loading" label="Show loading" />
      <MdvCheckbox v-model="disabled" label="Disable group" />
    </div>
    <MdvButtonGroup :disabled="disabled" aria-label="Publishing actions">
      <MdvButtonGroupItem :loading="loading" :disabled="loading" loading-text="Publishing…" @click="message = 'Published.'">
        Publish
      </MdvButtonGroupItem>
      <MdvButtonGroupItem variant="elevated" color="tertiary" @click="message = 'Preview opened.'">Preview</MdvButtonGroupItem>
      <MdvButtonGroupItem disabled variant="outlined">Unavailable</MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

子项 `color` 沿用 Button 的七套预设颜色及十六进制局部种子色，省略时使用变体默认角色。选中颜色/形状、状态层、焦点框、弹簧动效、主题继承、RTL 和减少动态效果均由 MDV 处理。

---

## 原生表单

为组设置 `name` 后，会提交已经接受的组选值。多选生成同名的重复隐藏字段，通过 `FormData.getAll()` 读取。

<DemoBlock>
  <ButtonGroupFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvButtonGroup, MdvButtonGroupItem } from '@mdv-ui/mdv'
import type { MdvButtonGroupModelValue } from '@mdv-ui/mdv'

const channels = ref<MdvButtonGroupModelValue>(['email'])
const result = ref('Submit to inspect all selected channels.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ channel: data.getAll('channel') })
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="result = 'Form reset.'">
    <MdvButtonGroup v-model="channels" name="channel" variant="connected" selection="multiple" aria-label="Notification channels">
      <MdvButtonGroupItem value="email">Email</MdvButtonGroupItem>
      <MdvButtonGroupItem value="sms">SMS</MdvButtonGroupItem>
      <MdvButtonGroupItem value="push">Push</MdvButtonGroupItem>
    </MdvButtonGroup>
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
```

  </template>
</DemoBlock>

Vue 模型保留数字/字符串类型，原生表单值按 HTML 规则转为字符串。`selection="none"` 不提交组选值。`form` 可以关联外部表单。Reset 请求恢复创建时捕获的初始模型，受控父级仍需要接受更新；取消原生 reset 会保留当前状态。禁用组/fieldset 遵循原生表单禁用规则。

## 键盘与受控状态

- 容器是有名称的 `role="group"`，不使用 tablist 或 radio group 语义。通过 `aria-label` 或 `aria-labelledby` 说明用途。
- Tab / Shift+Tab 逐项经过可用原生控件；方向键移焦，Home/End 到首尾；导航可循环，跳过禁用、隐藏及 inert 项。水平移动随 RTL 镜像。
- 移动焦点不会修改选择。Enter/Space 激活按钮，链接保持原生 Enter 行为。切换按钮通过 `aria-pressed` 暴露状态。
- 绑定模型后，父级接受值为最终状态。父级可拒绝 `update:modelValue`，视觉和 `aria-pressed` 维持已接受值。子项原生 click 调用 `preventDefault()` 可取消此次选择变化。

---

## API

### MdvButtonGroup 属性

<ApiTable :items="groupProps" />

### MdvButtonGroup 插槽

<SlotsTable :items="groupSlots" />

### MdvButtonGroupItem 属性

<ApiTable :items="itemProps" />

### MdvButtonGroupItem 插槽

<SlotsTable :items="itemSlots" />

### 事件与方法

<DocsTable label="按钮组事件" min-width="32rem">

| 组件 | 事件 | 参数 |
| --- | --- | --- |
| Group | `update:modelValue` | `MdvButtonGroupModelValue`，组选择/重置请求。 |
| Item | `update:selected` | `boolean`，none 模式的独立切换请求。 |
| Item | 原生 `click`、键盘和指针事件 | 原生事件透传到实际按钮或链接。 |

</DocsTable>

组暴露 `element`、`focus(options?: FocusOptions)`、`blur()`、`refresh()`。`focus()` 聚焦首个可用项，`blur()` 只在焦点位于组内时移除焦点，`refresh()` 用于应用变化后主动重新测量。常规成员、字体及尺寸变化会自动观察。子项暴露 `element`、`focus(options?)`、`blur()`。

### 原生属性与类型

组的 `class`、`style`、ARIA、`dir` 等普通属性应用于外层 group，根节点不进入 Tab 顺序。子项属性与事件应用于其唯一原生按钮/链接，包括适用的 `name`、`form`、`target`、`rel`、`download`。加载不会替换该节点，也不会自动禁止操作。

```ts
import type {
  MdvButtonGroupVariant,
  MdvButtonGroupSelection,
  MdvButtonGroupValue,
  MdvButtonGroupModelValue,
  MdvButtonGroupDensity,
  MdvButtonGroupItemVariant,
  MdvButtonGroupProps,
  MdvButtonGroupItemProps,
  MdvButtonGroupItemSlotProps,
} from '@mdv-ui/mdv'
```

`MdvButtonGroupValue` 为 `string | number`；`MdvButtonGroupModelValue` 是单值、值数组或 `null`。共用的尺寸、形状、颜色、按钮类型、图标宽度类型为 `MdvButtonSize`、`MdvButtonShape`、`MdvButtonColor`、`MdvButtonType`、`MdvIconButtonWidth`。
