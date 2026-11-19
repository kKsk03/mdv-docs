<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import RadioBasicDemo from '@/components/docs/demos/radio/basic.vue'
import RadioStandaloneDemo from '@/components/docs/demos/radio/standalone.vue'
import RadioStateDemo from '@/components/docs/demos/radio/state.vue'
import RadioColorDemo from '@/components/docs/demos/radio/color.vue'
import RadioControlledDemo from '@/components/docs/demos/radio/controlled.vue'
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

`MdvRadio` 从互斥选项中选择一个标量值。`MdvRadioGroup` 提供共享模型、可访问分组、键盘选择与校验。本页对应 **MDV 0.1.5**。独立多选使用 Checkbox，立即生效的开关设置使用 Switch。

## 分组、方向与严格值

将模型绑定在组上，并为每个子项提供唯一 `value`，不要分别给组内子项绑定模型。值支持字符串和数字，`null` 表示未选择。数字 `1` 与字符串 `'1'` 对应不同选项。

水平布局在空间不足时会换行。Tab 进入已选可用项，或首个可用项；方向键同时移动焦点并选择，跳过禁用项。再次点击已选项不会取消；需要清空时提供单独的重置操作。

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

## 独立单选框与原生名称

独立 Radio 可以共享模型及原生 `name`。不同选择集合应使用唯一名称，避免浏览器将页面中无关输入组成一组。示例用原生 `fieldset` 和 `legend` 提供分组语义。需要统一键盘、必选与校验逻辑时，优先使用 `MdvRadioGroup`。

即使应用使用数字值，原生表单提交值仍是字符串。示例重置后恢复挂载时的初始模型。

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

## 标签、禁用与错误

普通文字使用 `label`，富文本使用默认插槽。辅助文字会关联原生输入。Radio 默认插槽替换当前标签，Group 的 `label` 插槽替换 legend。

Group 的 `disabled` 和上级禁用 `fieldset` 通过原生语义禁用子项。子项可自行禁用，但不能覆盖上级禁用状态。组错误传递到选项，单项辅助文字仍说明当前选项；共享错误文案由组显示，应设置在组的 `error-text` 上。

`error` 和 `error-text` 表示应用错误。需要阻止原生提交时，还要使用原生约束或 `setCustomValidity()`。仅提供 `error-text` 不会激活错误状态。

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

## 颜色、局部主题与 RTL

支持 `primary`、`secondary`、`tertiary`、`success`、`warning`、`error`、`info`，或合法的 `#RGB`/`#RRGGBB` 种子色。组提供默认颜色，单项可以覆盖。错误和禁用外观遵循 MDV 状态规则。自定义颜色参与深浅色方案生成，不是直接为控件涂上固定十六进制颜色。

<DemoBlock>
  <RadioColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioColor, MdvRadioModelValue } from '@mdv-ui/mdv'

const selected = ref<MdvRadioModelValue>('primary')
const colors: MdvRadioColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', '#006c4c']
const preference = ref<MdvRadioModelValue>('inherited')
</script>

<template>
  <div class="grid gap-5">
    <MdvRadioGroup v-model="selected" label="Theme roles and seed colors" orientation="horizontal">
      <MdvRadio v-for="color in colors" :key="color" :value="color" :color="color" :label="color" />
    </MdvRadioGroup>
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="theme in ['light', 'dark'] as const" :key="theme" :data-mdv-theme="theme" :dir="theme === 'dark' ? 'rtl' : 'ltr'" class="rounded-xl bg-mdv-surface-container-low p-4 text-mdv-on-surface">
        <MdvRadioGroup v-model="preference" color="tertiary" :label="`${theme} theme${theme === 'dark' ? ' · RTL' : ''}`">
          <MdvRadio value="inherited" label="Inherited tertiary" />
          <MdvRadio value="override" color="#006c4c" label="Local seed override" />
          <MdvRadio value="disabled" label="Disabled" disabled />
        </MdvRadioGroup>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 父级控制更新

显式传入模型后，由父级决定是否接受 `update:modelValue`。拒绝请求后，原生选中状态会恢复到已接受的模型。焦点仍可能移到尝试选择的项目，焦点和选中是不同状态。示例默认不接受选择请求。

<DemoBlock>
  <RadioControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const value = ref<MdvRadioModelValue>('basic')
const accept = ref(false)
const requested = ref<MdvRadioModelValue>(null)
function update(next: MdvRadioModelValue) {
  requested.value = next
  if (accept.value) value.value = next
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="accept" label="Accept selection requests" />
    <MdvRadioGroup :model-value="value" label="Controlled plan" @update:model-value="update">
      <MdvRadio value="basic" label="Basic plan" /><MdvRadio value="pro" label="Pro plan" />
    </MdvRadioGroup>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Accepted: {{ value }} · Requested: {{ requested ?? 'none' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 原生表单、校验与重置

设置组 `name` 后，仅提交已选且未禁用的输入，不会额外创建隐藏字段。不设置名称时仍可选择与校验，但不会进入 `FormData`。同一个协作组内避免覆盖子项名称，独立选择集合应另建一组。

Group 的 `form` 可关联外部表单，并传递到子输入。单个 Radio 也可接收 `id`、`form`、ARIA 与原生监听。子项显式指定的 `name` 或 `form` 优先于继承值。

示例将选项放在 form 外，演示必选、整组禁用、真实 `FormData` 和校验方法。服务端错误通过 `setCustomValidity()` 设置，空字符串清除。重置会恢复初始模型并清理已报告的校验状态；原生 reset 不会清除 custom validity，因此示例在 reset 监听中显式清理自己设置的服务端错误。

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

MDV 0.1.5 存在一个库侧问题：空必选组报告错误后，改选另一个有效选项，组错误已清除，但原先报错项可能仍保持红色和 `aria-invalid="true"`，即使其原生校验已经有效。此问题已记录，示例保留组件原始外观，便于检查实际集成行为。

## 无障碍与键盘操作

<DocsTable label="单选框组键盘操作">

| 按键 | 行为 |
| --- | --- |
| Tab / Shift+Tab | 在当前已选可用项或首个可用项处进入/离开组。 |
| 右 / 下方向键 | 循环选择并聚焦下一个可用项。 |
| 左 / 上方向键 | 循环选择并聚焦上一个可用项。 |
| Home / End | 选择并聚焦首个或最后一个可用项。 |
| Space | 选中当前原生 Radio。 |

</DocsTable>

Radio 使用真实 `input[type="radio"]`，交互区域最小为 48px。Group 使用 `fieldset`、`legend` 和 `role="radiogroup"`。不显示标签时应提供 `aria-label` 或 `aria-labelledby`，不要替换为按钮或菜单角色。原生 `input`、`change`、`invalid`、focus、blur 事件作用于输入；组件模型更新携带具有原始类型的选项值。

MDV 提供减少动态效果与强制颜色样式。读屏播报、最终布局中的触摸区域、浏览器校验 UI 及跨浏览器表单行为仍需验证。上级 fieldset 禁用保留浏览器对首个 legend 的原生例外。

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

MDV 0.1.5 没有导出 `MdvRadioProps` 或 `MdvRadioGroupProps` 接口。为模板 ref 标注类型时使用实际组件类型。
