<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import AppearanceDemo from '@/components/docs/demos/textField/appearance.vue'
import ModelsDemo from '@/components/docs/demos/textField/models.vue'
import ActionsDemo from '@/components/docs/demos/textField/actions.vue'
import FormDemo from '@/components/docs/demos/textField/form.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvTextFieldValue', default: "''", description: '字符串或数字模型；原生控件仍编辑字符串。' },
  { name: 'modelModifiers', type: 'MdvTextFieldModelModifiers', default: '{}', description: '使用 v-model 修饰符时，由 Vue 传递 trim、number 和 lazy。' },
  { name: 'variant', type: 'MdvTextFieldVariant', default: "'outlined'", description: "'outlined' 或 'filled'。" },
  { name: 'type', type: 'MdvTextFieldType', default: "'text'", description: "单行输入类型：'text'、'password'、'email'、'tel'、'url'、'search' 或 'number'。" },
  { name: 'label', type: 'string', default: "''", description: '可见的浮动标签，与实际输入控件关联。' },
  { name: 'placeholder', type: 'string', default: "''", description: '原生占位提示，不能作为无障碍名称。' },
  { name: 'supportingText', type: 'string', default: "''", description: '控件下方的辅助说明。' },
  { name: 'error', type: 'boolean', default: 'false', description: '业务错误状态，与原生约束的有效性独立。' },
  { name: 'errorText', type: 'string', default: "''", description: '错误状态下优先显示的说明；单独提供不会进入错误状态。' },
  { name: 'prefixText', type: 'string', default: "''", description: '装饰前缀，不进入模型或提交值。' },
  { name: 'suffixText', type: 'string', default: "''", description: '装饰后缀，不进入模型或提交值。' },
  { name: 'multiline', type: 'boolean', default: 'false', description: '以 textarea 替换单行输入控件。' },
  { name: 'rows', type: 'number', default: '3', description: '多行输入初始行数。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '该字段不可聚焦、编辑，也不参与表单提交。' },
  { name: 'readonly', type: 'boolean', default: 'false', description: '禁止编辑，仍可聚焦且参与提交。' },
  { name: 'required', type: 'boolean', default: 'false', description: '启用原生必填约束。' },
  { name: 'clearable', type: 'boolean', default: 'false', description: '有可编辑文本且未处于组合输入时提供清除操作。' },
  { name: 'clearLabel', type: 'string', description: '内置清除按钮的无障碍名称。' },
  { name: 'passwordToggle', type: 'boolean', default: 'false', description: '为单行密码框提供显隐切换。' },
  { name: 'showPasswordLabel', type: 'string', description: '显示密码按钮的无障碍名称。' },
  { name: 'hidePasswordLabel', type: 'string', description: '隐藏密码按钮的无障碍名称。' },
  { name: 'showCount', type: 'boolean', description: '显示 UTF-16 长度。省略时，有合法的 maxlength 才显示计数。' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: '占满可用宽度；否则默认 280px，且不超过容器。' },
]
const slots: SlotTableItem[] = [
  { name: 'leading', description: '输入控件前方的装饰图标或应用提供的操作。' },
  { name: 'trailing', description: '替换整个尾部区域，包括内置的清除和密码显隐操作。' },
]
</script>
# 文本框

用 `MdvTextField` 收集文本或数值。只能从固定选项中选择时，请用[选择框](./select)。

## 外观与多行输入

用 `v-model` 绑定值，通过 `variant` 选择填充或描边外观。设置 `multiline` 可使用多行输入。

<DemoBlock>
  <AppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvTextField } from '@mdv-ui/mdv'

const budget = ref('42.00')
const notes = ref('Leave the box at the front desk.')
</script>

<template>
  <div class="grid min-w-0 gap-4 sm:grid-cols-2">
    <MdvTextField
      v-model="budget"
      label="Budget (USD)"
      inputmode="decimal"
      prefix-text="$"
      supporting-text="Enter an amount in US dollars."
      full-width
    />
    <MdvTextField
      v-model="notes"
      variant="filled"
      label="Delivery instructions"
      supporting-text="Include only information the courier needs."
      multiline
      :rows="3"
      :maxlength="80"
      full-width
    />
  </div>
</template>
```

  </template>
</DemoBlock>

## 模型修饰符

需要转换模型值时，使用 `.trim`、`.number` 等修饰符。用 `.lazy` 在 `change` 而非 `input` 时更新模型。

<DemoBlock>
  <ModelsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvTextField } from '@mdv-ui/mdv'
import type { MdvTextFieldValue } from '@mdv-ui/mdv'

const displayName = ref<MdvTextFieldValue>('')
const quantity = ref<MdvTextFieldValue>('')
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvTextField
      v-model.trim="displayName"
      label="Display name"
      supporting-text="Try adding spaces or entering text with an IME."
      full-width
    />
    <MdvTextField
      v-model.lazy.number="quantity"
      type="number"
      label="Quantity"
      min="0"
      step="1"
      supporting-text="Commit a numeric value when the input changes, not on every keystroke."
      full-width
    />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">
      Name: {{ JSON.stringify(displayName) }} · Quantity: {{ JSON.stringify(quantity) }}
      ({{ typeof quantity }})
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 图标与输入操作

用 `leading` 和 `trailing` 自定义内容。`clearable` 添加清除操作，`password-toggle` 为密码输入添加显隐操作。

<DemoBlock>
  <ActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import edit from '@iconify-icons/material-symbols/edit-outline'
import search from '@iconify-icons/material-symbols/search'
import { ref, useTemplateRef } from 'vue'
import { MdvIcon, MdvIconButton, MdvTextField } from '@mdv-ui/mdv'

const query = ref('Packaging')
const password = ref('demo-only')
const projectCode = ref('')
const codeField = useTemplateRef<InstanceType<typeof MdvTextField>>('codeField')

function fillProjectCode() {
  projectCode.value = 'PROJECT-01'
  codeField.value?.focus()
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvTextField v-model="query" type="search" label="Search examples" clearable clear-label="Clear search examples" full-width>
      <template #leading><MdvIcon :icon="search" /></template>
    </MdvTextField>
    <MdvTextField
      v-model="password"
      type="password"
      label="Demo password"
      autocomplete="new-password"
      supporting-text="Use sample text, not a real password."
      password-toggle
      show-password-label="Show demo password"
      hide-password-label="Hide demo password"
      full-width
    />
    <MdvTextField ref="codeField" v-model="projectCode" label="Project code" full-width>
      <template #trailing>
        <MdvIconButton
          type="button"
          variant="standard"
          aria-label="Use suggested project code"
          @click="fillProjectCode"
        >
          <MdvIcon :icon="edit" />
        </MdvIconButton>
      </template>
    </MdvTextField>
  </div>
</template>
```

  </template>
</DemoBlock>

用 `clear-label`、`show-password-label` 和 `hide-password-label` 为内置按钮命名。需要自定义控件时，`trailing` 插槽可替换整个尾部区域。

## 原生表单与校验

设置 `name` 后，表单会提交字段值。可用 `required` 或 `type="email"` 等原生约束，也可调用 `setCustomValidity()` 设置自定义错误，并传空字符串清除。

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvTextField } from '@mdv-ui/mdv'

const email = ref('')
const result = ref('No submission yet.')
const emailHint = useId()
const emailField = useTemplateRef<InstanceType<typeof MdvTextField>>('emailField')

function submit(event: SubmitEvent) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify([...data.entries()])
}

function reportDuplicate() {
  emailField.value?.setCustomValidity('This email address is already in use.')
  emailField.value?.reportValidity()
}

function clearCustomError() {
  emailField.value?.setCustomValidity('')
}

function reset() {
  clearCustomError()
  result.value = 'Reset to the initial values.'
}
</script>

<template>
  <form class="grid min-w-0 gap-4" @submit.prevent="submit" @reset="reset">
    <p :id="emailHint" class="text-sm text-mdv-on-surface-variant">Use an example address.</p>
    <MdvTextField
      ref="emailField"
      v-model="email"
      :aria-describedby="emailHint"
      type="email"
      name="email"
      label="Contact email"
      supporting-text="We send a copy of the report to this address."
      autocomplete="email"
      required
      full-width
      @input="clearCustomError"
    />
    <MdvTextField label="Plan" name="plan" model-value="Starter" readonly full-width />
    <MdvTextField label="Region (unavailable)" name="region" model-value="West" disabled full-width />
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit example</MdvButton>
      <MdvButton variant="tonal" @click="reportDuplicate">Report duplicate email</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-all text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
```

  </template>
</DemoBlock>

---

## API

### 属性

<ApiTable :items="props" />

### 插槽

<SlotsTable :items="slots" />

### 原生属性和方法

`id`、`name`、`form`、`autocomplete`、`inputmode`、原生约束、ARIA／`data-*` 属性及原生监听器传给实际控件。`class` 与 `style` 用于外层，`dir` 和 `lang` 同时用于外层及输入控件。自动填充及密码管理器的行为仍需在目标浏览器中验证。

通过组件模板引用调用：

- `focus(options?: FocusOptions)` 与 `blur()`：控制输入框或文本区的实际焦点。
- `select()`：在原生输入类型支持时选中文本。
- `checkValidity(): boolean`：执行原生校验；`reportValidity(): boolean` 还会请求浏览器反馈。
- `setCustomValidity(message: string)`：添加自定义原生校验错误，传入 `''` 可清除。

### 公开类型

```ts
import type {
  MdvTextFieldValue,
  MdvTextFieldModelModifiers,
  MdvTextFieldType,
  MdvTextFieldVariant,
} from '@mdv-ui/mdv'
```
