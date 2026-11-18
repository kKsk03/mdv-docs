<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import CheckboxBasicDemo from '@/components/docs/demos/checkbox/basic.vue'
import CheckboxGroupDemo from '@/components/docs/demos/checkbox/group.vue'
import CheckboxIndeterminateDemo from '@/components/docs/demos/checkbox/indeterminate.vue'
import CheckboxSelectAllDemo from '@/components/docs/demos/checkbox/selectAll.vue'
import CheckboxLabelDemo from '@/components/docs/demos/checkbox/label.vue'
import CheckboxColorDemo from '@/components/docs/demos/checkbox/color.vue'
import CheckboxColorCustomDemo from '@/components/docs/demos/checkbox/colorCustom.vue'
import CheckboxDisabledDemo from '@/components/docs/demos/checkbox/disabled.vue'
import CheckboxErrorDemo from '@/components/docs/demos/checkbox/error.vue'
import CheckboxFormDemo from '@/components/docs/demos/checkbox/form.vue'

const checkboxProps: ApiTableItem[] = [
  {
    name: 'modelValue',
    attribute: 'v-model',
    type: 'boolean | (string | number)[]',
    default: 'false',
    description: '选中状态。布尔值表示单个选项；数组表示多选，根据 value 是否在数组中决定选中状态。',
  },
  {
    name: 'value',
    type: 'string | number',
    default: "'on'",
    description: '数组模型中的成员值，也是原生表单提交值。数字与字符串按不同值处理，例如 1 与字符串 1 不会互相匹配。',
  },
  {
    name: 'indeterminate',
    type: 'boolean',
    default: 'false',
    description: '半选状态，优先显示横线。支持 v-model:indeterminate；激活半选项会清除半选并选中。',
  },
  {
    name: 'label',
    type: 'string',
    default: "''",
    description: '可点击的标签文字。默认插槽存在时，以插槽内容为准。',
  },
  {
    name: 'supportingText',
    type: 'string',
    default: "''",
    description: '标签下方的辅助说明，不属于点击切换区域。自动与实际输入的 aria-describedby 关联。',
  },
  {
    name: 'error',
    type: 'boolean',
    default: 'false',
    description: '外部业务错误状态，同时设置 aria-invalid。不会单独阻止原生表单提交。',
  },
  {
    name: 'errorText',
    type: 'string',
    default: "''",
    description: '业务错误或已报告的原生校验错误出现时，优先显示的说明。单独设置不会开启错误状态。',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: '禁用交互。也支持通过祖先 fieldset 的 disabled 属性禁用；禁用项不会提交表单值。',
  },
  {
    name: 'required',
    type: 'boolean',
    default: 'false',
    description: '要求当前这一项必须选中，不表示同名组中至少选一项。使用原生表单约束校验。',
  },
  {
    name: 'color',
    type: 'MdvCheckboxColor',
    default: "'primary'",
    description: '支持 primary、secondary、tertiary、success、warning、error、info，以及 #RGB 或 #RRGGBB 格式的局部种子色。',
  },
]

const checkboxSlots: SlotTableItem[] = [
  { name: 'default', description: '自定义标签内容，替换 label。可包含强调文字或链接；交互元素保留各自的行为。' },
]
</script>

# 复选框

复选框用于选择一个或多个选项，也可表示独立选项的开启与关闭。`MdvCheckbox` 使用原生 `input[type="checkbox"]`，支持键盘操作、表单校验和重置。

## 基本用法

导入 `MdvCheckbox`，通过 `v-model` 绑定布尔值。点击方框或标签都可以切换选中状态。

<DemoBlock>
  <CheckboxBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'

const checked = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-2">
    <MdvCheckbox v-model="checked" label="Enable notifications" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Checked: {{ checked }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 数组多选

多个复选框可以绑定同一个数组，通过各自的 `value` 区分选项。选中时添加对应值，取消选中时移除，组件会生成新数组。

用 `fieldset` 和 `legend` 为一组相关选项提供名称。`value` 支持字符串和数字，数字 `1` 与字符串 `'1'` 是不同选项。

<DemoBlock>
  <CheckboxGroupDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxValue } from '@mdv-ui/mdv'

const selected = ref<MdvCheckboxValue[]>(['email'])
</script>

<template>
  <div class="grid gap-3">
    <fieldset class="min-w-0">
      <legend class="mb-2 font-medium">Notification channels</legend>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <MdvCheckbox v-model="selected" value="email" label="Email" />
        <MdvCheckbox v-model="selected" value="sms" label="SMS" />
        <MdvCheckbox v-model="selected" value="push" label="Push" />
      </div>
    </fieldset>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Selected: {{ selected.length ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 半选状态

通过 `v-model:indeterminate` 同步半选状态。半选时显示横线，并向辅助技术表达 `mixed` 状态。

半选与 `v-model` 的选中值相互独立。点击半选项会清除半选并将它选中，再次点击才会取消选中，不会在三种状态之间循环。

<DemoBlock>
  <CheckboxIndeterminateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox } from '@mdv-ui/mdv'

const checked = ref(false)
const indeterminate = ref(true)
</script>

<template>
  <div class="grid justify-items-start gap-3">
    <MdvCheckbox v-model="checked" v-model:indeterminate="indeterminate" label="Partially selected" />
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Checked: {{ checked }} · Indeterminate: {{ indeterminate }}
    </p>
    <MdvButton variant="outlined" @click="indeterminate = true">Set indeterminate</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

### 全选

全选项的选中与半选状态可根据子项推导：全部选中时显示勾，部分选中时显示横线，全部取消时显示空框。

<DemoBlock>
  <CheckboxSelectAllDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxModelValue, MdvCheckboxValue } from '@mdv-ui/mdv'

const options = ['Email', 'SMS', 'Push']
const selected = ref<MdvCheckboxValue[]>(['Email'])
const allSelected = computed(() => selected.value.length === options.length)
const partlySelected = computed(() => selected.value.length > 0 && !allSelected.value)

function selectAll(value: MdvCheckboxModelValue) {
  selected.value = value === true ? [...options] : []
}
</script>

<template>
  <div class="grid gap-3">
    <fieldset class="min-w-0">
      <legend class="mb-2 font-medium">Notification channels</legend>
      <MdvCheckbox
        :model-value="allSelected"
        :indeterminate="partlySelected"
        label="Select all"
        @update:model-value="selectAll"
      />
      <div class="ms-6 grid justify-items-start">
        <MdvCheckbox
          v-for="option in options"
          :key="option"
          v-model="selected"
          :value="option"
          :label="option"
        />
      </div>
    </fieldset>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Selected: {{ selected.length ? selected.join(', ') : 'None' }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 标签与辅助文字

通过 `label` 设置标签，通过 `supporting-text` 显示辅助说明。默认插槽可以替换标签，加入强调文字或链接；其中的交互元素保持自身行为，辅助说明不属于切换区域。

<DemoBlock>
  <CheckboxLabelDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'

const updates = ref(true)
const priority = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox
      v-model="updates"
      label="Product updates"
      supporting-text="Receive occasional news about new components."
    />
    <MdvCheckbox v-model="priority" supporting-text="The default slot replaces the label prop.">
      Include <strong>priority notifications</strong>
    </MdvCheckbox>
  </div>
</template>
```

  </template>
</DemoBlock>

没有可见标签时，需通过 `aria-label` 或 `aria-labelledby` 为复选框提供可访问名称：

```vue
<MdvCheckbox v-model="checked" aria-label="Select this item" />
```

---

## 颜色

通过 `color` 设置选中颜色，默认使用 `primary`。标签文字保持正文色，跟随主题自动适配浅色和深色模式。

<DemoBlock>
  <CheckboxColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxColor, MdvCheckboxValue } from '@mdv-ui/mdv'

const colors: MdvCheckboxColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info']
const selected = ref<MdvCheckboxValue[]>([...colors])
</script>

<template>
  <div class="flex flex-wrap gap-x-6 gap-y-3">
    <MdvCheckbox
      v-for="color in colors"
      :key="color"
      v-model="selected"
      :value="color"
      :color="color"
      :label="color"
    />
  </div>
</template>
```

  </template>
</DemoBlock>

### 自定义颜色

`color` 也支持 `#RGB` 或 `#RRGGBB` 格式的局部种子色。组件根据种子色生成适配当前主题的配色，最终填充色不保证与输入色号完全相同。

<DemoBlock>
  <CheckboxColorCustomDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxColor, MdvCheckboxValue } from '@mdv-ui/mdv'

const colors: MdvCheckboxColor[] = ['#6750A4', '#00796B', '#00ACC1']
const selected = ref<MdvCheckboxValue[]>([...colors])
</script>

<template>
  <div class="flex flex-wrap gap-x-6 gap-y-3">
    <MdvCheckbox
      v-for="color in colors"
      :key="color"
      v-model="selected"
      :value="color"
      :color="color"
      :label="color"
    />
  </div>
</template>
```

  </template>
</DemoBlock>

`color="error"` 只选择错误色系，不表示校验失败。需要表达错误时使用 [`error`](#错误状态)。

---

## 禁用状态

通过 `disabled` 禁用复选框。未选中、已选中和半选状态都有对应的禁用外观；禁用项不参与原生表单提交。

<DemoBlock>
  <CheckboxDisabledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvCheckbox } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap gap-x-6 gap-y-3">
    <MdvCheckbox label="Unchecked" disabled />
    <MdvCheckbox :model-value="true" label="Checked" disabled />
    <MdvCheckbox indeterminate label="Indeterminate" disabled />
  </div>
</template>
```

  </template>
</DemoBlock>

如需禁用一组字段，可为外层 `fieldset` 设置 `disabled`。

---

## 错误状态

通过 `error` 表达业务错误，`error-text` 提供错误说明。取消错误后恢复 `supporting-text`。单独设置 `error-text` 不会开启错误状态。

<DemoBlock>
  <CheckboxErrorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'

const showError = ref(true)
const checked = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="showError" label="Show error" />
    <MdvCheckbox
      v-model="checked"
      :error="showError"
      label="Receive notifications"
      supporting-text="Choose whether to receive notifications."
      error-text="Notifications are currently unavailable."
    />
  </div>
</template>
```

  </template>
</DemoBlock>

禁用外观优先于错误，错误色优先于 `color` 配色。错误说明依次使用 `error-text`、已报告的原生校验消息、`supporting-text`。

`error` 本身不会阻止原生表单提交。需要阻止提交时，使用 `required` 或 `setCustomValidity()` 添加原生约束。

---

## 表单与校验

为复选框设置 `name` 和 `value` 即可参与原生表单提交。只有有名称、已选中且未禁用的项会进入 `FormData`；同名多选值通过 `getAll()` 读取。

下面的必选项首次显示时不会自动报错。直接点击 Submit 可查看校验反馈，选中后再提交查看表单值，Reset 恢复初始选择。

<DemoBlock>
  <CheckboxFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxValue } from '@mdv-ui/mdv'

const accepted = ref(false)
const channels = ref<MdvCheckboxValue[]>(['email'])
const result = ref('Submit to inspect the form values.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ terms: data.get('terms'), channels: data.getAll('channel') })
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="result = 'Form reset.'">
    <MdvCheckbox
      v-model="accepted"
      name="terms"
      value="accepted"
      label="Accept the terms"
      supporting-text="This option is required."
      error-text="Accept the terms to continue."
      required
    />
    <fieldset class="min-w-0">
      <legend class="mb-2 font-medium">Optional channels</legend>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <MdvCheckbox v-model="channels" name="channel" value="email" label="Email" />
        <MdvCheckbox v-model="channels" name="channel" value="sms" label="SMS" />
      </div>
    </fieldset>
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

`required` 要求**当前这一项必须选中**，不会自动校验同名多选组是否至少选中一项。半选只是显示状态，是否提交仍由底层选中值决定；数字 `value` 提交时会转换为字符串。

`form.reset()` 会恢复组件创建时的模型和半选状态，并同步 `v-model`。程序更新模型不会改变重置基线；读取重置后的 Vue 状态时等待 `nextTick()`。重置会清除已报告的原生错误，但不会清除外部 `error` 或自定义校验消息。

`id`、`name`、`form`、ARIA、`data-*` 和原生事件监听会透传到实际输入；`class` 和 `style` 作用于组件最外层。选中状态由模型管理，使用 `v-model`，不要通过 `checked` 或 `defaultChecked` 竞争控制。

---

## 键盘与无障碍

- 使用 Tab 或 Shift+Tab 移动焦点，空格键切换选中状态。
- 为相关选项提供 `fieldset` 和 `legend`，为无可见标签的选项提供可访问名称。
- 辅助说明和错误文本自动与输入关联，动态说明使用礼貌播报。组件遵循系统减少动态效果的偏好。

---

## API

### 属性

<ApiTable :items="checkboxProps" />

### Slot

<SlotsTable :items="checkboxSlots" />

### 事件

- `update:modelValue(value: MdvCheckboxModelValue)`：请求更新布尔值或数组模型，由 `v-model` 接收。
- `update:indeterminate(value: boolean)`：请求更新半选状态，由 `v-model:indeterminate` 接收。
- `click`、`input`、`change`、`focus`、`blur`、`invalid`：透传实际输入的原生事件。模型赋值和表单重置不会伪造 `input` 或 `change`。

### 方法

通过组件模板引用调用：

- `focus(options?: FocusOptions)`：聚焦实际输入，支持 `preventScroll`。
- `blur()`：移除输入焦点。
- `checkValidity(): boolean`：检查原生约束，失败时触发 `invalid`。
- `reportValidity(): boolean`：检查约束并显示浏览器的校验反馈。
- `setCustomValidity(message: string)`：设置自定义校验消息，传入空字符串清除。

### 类型

```ts
import type {
  MdvCheckboxValue,
  MdvCheckboxModelValue,
  MdvCheckboxColor,
} from '@mdv-ui/mdv'
```

`MdvCheckboxValue` 为 `string | number`；`MdvCheckboxModelValue` 为 `boolean | MdvCheckboxValue[]`；`MdvCheckboxColor` 为支持的主题色、语义色或十六进制种子色。
