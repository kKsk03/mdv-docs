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

用 `MdvCheckbox` 表示可独立勾选的选项，或选择列表中的多个项目。

## 基本用法

用 `v-model` 绑定布尔值。设置 `label` 后，点击标签也能切换复选框。

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

## 数组多选

将多个复选框绑定到同一数组，并为每项设置 `value`。勾选添加该值，取消勾选则移除。

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

## 半选状态

用 `v-model:indeterminate` 表示部分选中，例如只选择了部分条目时的「全选」复选框。

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

## 标签与辅助文字

用 `label` 设置名称，用 `supporting-text` 补充说明。默认插槽可以替换可见标签。

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

## 颜色

用 `color` 设置选中时的颜色。

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

## 禁用状态

用 `disabled` 禁止修改。禁用的复选框不会随表单提交。

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

## 错误状态

用 `error` 显示错误状态，用 `error-text` 设置提示。错误外观本身不会阻止原生表单提交。

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

## 表单与校验

为表单提交设置 `name` 和 `value`。`FormData` 只包含已勾选且未禁用的复选框；用 `getAll()` 读取同名字段的多个值。

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
