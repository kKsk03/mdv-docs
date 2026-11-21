<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import RadioBasicDemo from '@/components/docs/demos/radio/basic.vue'
import RadioStandaloneDemo from '@/components/docs/demos/radio/standalone.vue'
import RadioStateDemo from '@/components/docs/demos/radio/state.vue'
import RadioFormDemo from '@/components/docs/demos/radio/form.vue'

const radioProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string | number | null', default: 'null', description: '独立使用时的选择模型。位于 MdvRadioGroup 内时由组模型决定是否选中。' },
  { name: 'value', type: 'string | number', default: '必填', description: '当前选项及其原生提交值。使用 Object.is 比较，数字 1 与字符串 1 不同。' },
  { name: 'label', type: 'string', default: "''", description: '可点击标签。默认插槽会替换该文字。' },
  { name: 'supportingText', type: 'string', default: "''", description: '关联的辅助文字。位于组内时仍作为当前选项的说明。' },
  { name: 'error', type: 'boolean', default: 'false', description: '外部视觉与 ARIA 错误状态；组错误也会影响子项。单独设置不会建立原生自定义校验错误。' },
  { name: 'errorText', type: 'string', default: "''", description: '独立使用时，外部或已报告原生错误的说明。组内错误文案应设置在组上。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用当前输入。子项不能重新启用已被组或上级 fieldset 禁用的输入。' },
  { name: 'required', type: 'boolean', default: 'false', description: '独立输入的原生必选约束。位于组内时使用组的 required 策略。' },
  { name: 'color', type: 'MdvRadioColor', default: "组颜色或 'primary'", description: '主题色、语义色或 #RGB/#RRGGBB 种子色。单项可覆盖组颜色；错误样式优先。' },
]
const groupProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string | number | null', default: 'null', description: '整组共享的单个选中值。不绑定时内部管理，绑定后由父级决定是否接受更新。' },
  { name: 'name', type: 'string', description: '子项继承的原生输入名称。省略时无名选项不进入 FormData；不会生成隐藏字段。' },
  { name: 'label', type: 'string', default: "''", description: '渲染在 legend 中的组名称，label 插槽优先。不显示文字时需提供可访问名称。' },
  { name: 'supportingText', type: 'string', default: "''", description: '关联全部选项的共享辅助信息。' },
  { name: 'error', type: 'boolean', default: 'false', description: 'fieldset 和选项的外部错误状态，单独设置不会阻止原生提交。' },
  { name: 'errorText', type: 'string', default: "''", description: 'error 或已报告原生无效状态激活时优先显示的共享错误信息。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用原生 fieldset，阻止选项交互、校验和提交。' },
  { name: 'required', type: 'boolean', default: 'false', description: '要求选中一个可用选项，由组管理承载原生 required 的输入。' },
  { name: 'color', type: 'MdvRadioColor', description: '子项默认继承的颜色，可由单项覆盖；均省略时子项使用 primary。' },
  { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: '垂直列表或可换行水平布局，两者使用相同的方向键选择规则。' },
]
const radioSlots: SlotTableItem[] = [{ name: 'default', description: '替换可点击标签，无参数。避免在标签内嵌套交互控件。' }]
const groupSlots: SlotTableItem[] = [
  { name: 'default', description: 'Radio 选项，无参数。子项选中状态来自组模型。' },
  { name: 'label', description: '替换 legend 内容，无参数。保留有意义的组名称。' },
]
</script>
# 单选框

用 `MdvRadioGroup` 和 `MdvRadio` 从一组选项中选择一项。各选项可独立勾选时，请用[复选框](./checkbox)。

## 单选组

在组上绑定 `v-model`，为每项设置不同的 `value`。字符串和数字不会相互转换；用 `null` 表示未选中。通过 `label` 属性或同名插槽设置组标题。

<DemoBlock>
  <RadioBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const plan = ref<MdvRadioModelValue>('basic')
const delivery = ref<MdvRadioModelValue>('email')
const typed = ref<MdvRadioModelValue>(1)
</script>

<template>
  <div class="grid gap-5">
    <MdvRadioGroup v-model="plan" label="Plan" supporting-text="Choose one plan. Arrow keys select the next available option.">
      <MdvRadio value="basic" label="Basic" />
      <MdvRadio value="pro" label="Pro" supporting-text="Includes shared workspaces." />
      <MdvRadio value="enterprise" label="Enterprise (unavailable)" disabled />
    </MdvRadioGroup>
    <MdvRadioGroup v-model="delivery" orientation="horizontal" label="Notifications">
      <MdvRadio value="email" label="Email" /><MdvRadio value="sms" label="SMS" /><MdvRadio value="push" label="Push" />
    </MdvRadioGroup>
    <MdvRadioGroup v-model="typed" orientation="horizontal" label="Strict values">
      <MdvRadio :value="1" label="Number 1" /><MdvRadio value="1" label="String 1" />
    </MdvRadioGroup>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Plan: {{ plan }} · Delivery: {{ delivery }} · Typed value: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 独立单选按钮

不使用单选组组件时，为同一组选项绑定相同的模型和原生 `name`。不同的选项组应使用不同的 `name`。

<DemoBlock>
  <RadioStandaloneDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvRadio } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const name = `standalone-format-${useId()}`
const format = ref<MdvRadioModelValue>('pdf')
const submitted = ref('Not submitted.')
function submit(event: Event) {
  const value = new FormData(event.currentTarget as HTMLFormElement).get(name)
  submitted.value = `Submitted format: ${value}`
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit">
    <fieldset class="min-w-0 border-0 p-0">
      <legend class="mb-2 text-sm font-medium">Export format</legend>
      <div class="flex flex-wrap gap-3">
        <MdvRadio v-model="format" :name="name" value="pdf" label="PDF" />
        <MdvRadio v-model="format" :name="name" value="html" label="HTML" />
        <MdvRadio v-model="format" :name="name" value="text" label="Plain text" />
      </div>
    </fieldset>
    <div class="flex flex-wrap gap-3"><MdvButton type="submit">Read form data</MdvButton><MdvButton type="reset" variant="outlined">Reset format</MdvButton></div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Model: {{ format }} · {{ submitted }}</p>
  </form>
</template>
```

  </template>
</DemoBlock>

## 标签与状态

用 `supporting-text` 提供提示，用 `disabled` 禁用不可选项。通过单选组的 `error` 和 `error-text` 显示整组的错误提示。

<DemoBlock>
  <RadioStateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const disabled = ref(false)
const error = ref(false)
const value = ref<MdvRadioModelValue>('standard')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="disabled" label="Disable the group" /><MdvCheckbox v-model="error" label="Show server error" /></div>
    <MdvRadioGroup v-model="value" :disabled="disabled" :error="error" label="Delivery service" supporting-text="All prices include delivery." error-text="This delivery option is temporarily unavailable.">
      <template #label><span class="font-medium">Delivery service</span> <span class="text-mdv-on-surface-variant">(one option)</span></template>
      <MdvRadio value="standard" label="Standard delivery" supporting-text="Arrives in 3–5 working days." />
      <MdvRadio value="express" supporting-text="Available on working days.">Express delivery <span class="text-sm text-mdv-on-surface-variant">— includes tracking and a scheduled delivery window</span></MdvRadio>
      <MdvRadio value="overnight" label="Overnight delivery (unavailable)" disabled />
    </MdvRadioGroup>
    <MdvRadio model-value="blocked" value="blocked" label="Standalone error" error error-text="Please review this choice." />
  </div>
</template>
```

  </template>
</DemoBlock>

## 表单与校验

设置 `name` 后，表单会提交已选中且未禁用的选项。用 `required` 要求用户选择，用 `form` 关联外部表单。原生重置会恢复初始选择。

<DemoBlock>
  <RadioFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const id = `radio-form-${useId()}`
const group = useTemplateRef<InstanceType<typeof MdvRadioGroup>>('group')
const delivery = ref<MdvRadioModelValue>(null)
const disabled = ref(false)
const message = ref('Not submitted.')
function submit(event: Event) {
  message.value = `Submitted: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
function validate() { message.value = group.value?.reportValidity() ? 'Valid selection.' : 'Please choose a delivery option.' }
function serverError() {
  group.value?.setCustomValidity('This service is temporarily unavailable.')
  validate()
}
function reset(event: Event) {
  if (event.defaultPrevented) return
  group.value?.setCustomValidity('')
  message.value = 'Form reset to no selection.'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disabled" label="Disable delivery group" />
    <MdvRadioGroup ref="group" v-model="delivery" :form="id" name="delivery" label="Required delivery" supporting-text="Only the selected enabled radio is submitted." error-text="Choose an available delivery service." :disabled="disabled" required>
      <MdvRadio value="standard" label="Standard" /><MdvRadio value="express" label="Express" /><MdvRadio value="overnight" label="Overnight (unavailable)" disabled />
    </MdvRadioGroup>
    <form :id="id" class="flex flex-wrap gap-3" @submit.prevent="submit" @reset="reset">
      <MdvButton type="submit">Submit delivery</MdvButton><MdvButton type="reset" variant="outlined">Reset delivery</MdvButton>
    </form>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="text" @click="validate">Report validity</MdvButton>
      <MdvButton variant="text" @click="serverError">Set custom error</MdvButton>
      <MdvButton variant="text" @click="group?.setCustomValidity('')">Clear custom error</MdvButton>
      <MdvButton variant="text" @click="group?.focus({ preventScroll: true })">Focus selection</MdvButton>
    </div>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Model: {{ delivery ?? 'null' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

必填校验失败后，即使新选项已通过原生校验，原先报错的选项仍可能显示为错误状态。

---

## API

### MdvRadio

<ApiTable :items="radioProps" />

<SlotsTable :items="radioSlots" />

`class`/`style` 作用于外层容器，`dir`/`lang` 也作用于该容器。其余原生属性和监听交给 input，包括 `id`、`name`、`form`、ARIA 和校验事件。组件管理输入类型、选中状态、值及适用的组 tab/required 规则。

### MdvRadioGroup

<ApiTable :items="groupProps" />

<SlotsTable :items="groupSlots" />

当前实现将原生属性和监听传给 fieldset，并将 `form` 用于关联子项。自身的类和 style 显式设置，传入的组 `class` 当前不会合并到 fieldset。布局类请放在外层容器，这与 Radio 的外壳透传不同，也不应据此覆盖组件内部样式。

### 模型、事件与方法

两者在自身模型变化时发出 `update:modelValue(value: MdvRadioModelValue)`。组内选择更新的是 **Group** 模型，不会将每个子项的独立模型同步为组模型。没有自定义 `select` 事件，也没有传选项值的自定义 `change` 事件。

<DocsTable label="单选框与单选框组公开方法">

| 方法 | Radio | Radio Group |
| --- | --- | --- |
| `focus(options?: FocusOptions)` | 聚焦当前输入。 | 聚焦当前可用选中项，否则聚焦首个可用项。 |
| `blur()` | 使当前输入失焦。 | 使当前 active HTMLElement 失焦。 |
| `checkValidity(): boolean` | 执行原生输入校验。 | 检查注册输入，原生 invalid 事件可能报告错误。 |
| `reportValidity(): boolean` | 报告原生校验。 | 报告注册输入并显示共享错误反馈。 |
| `setCustomValidity(message: string)` | 设置输入的原生自定义错误。 | 将自定义错误放到首个可用项并协调校验。 |

</DocsTable>

空字符串清除自定义错误。`checkValidity()` 也可能派发原生 `invalid`，并非静默的纯视觉检查。Group 的 `blur()` 当前操作 `document.activeElement`，仅在组拥有焦点时调用。

### 公开类型

```ts
import type {
  MdvRadioValue,        // string | number
  MdvRadioModelValue,   // MdvRadioValue | null
  MdvRadioColor,        // MdvButtonColor
  MdvRadioOrientation,  // 'vertical' | 'horizontal'
} from '@mdv-ui/mdv'
```
