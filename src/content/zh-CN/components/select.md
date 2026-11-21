<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BasicDemo from '@/components/docs/demos/select/basic.vue'
import MenusDemo from '@/components/docs/demos/select/menus.vue'
import StateDemo from '@/components/docs/demos/select/state.vue'
import FormDemo from '@/components/docs/demos/select/form.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string | number | null', default: '内部 null', description: '选中选项的值。不绑定时使用内部状态；绑定后由父级接受请求，使用 Object.is 比较。' },
  { name: 'options', type: 'readonly MdvSelectOption[]', default: '必填', description: '每项具有唯一的带类型 value 和可见 label，可提供 supportingText 和 disabled。' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'outlined'", description: 'TextField 外观，与 menuVariant 分开控制。' },
  { name: 'menuVariant', type: "'expressive' | 'baseline'", default: "'expressive'", description: '列表框表面与选项样式。弹层是独立的 combobox listbox，并非 MdvMenu。' },
  { name: 'label', type: 'string', default: "''", description: '可见字段标签及列表框名称。省略时应提供 aria-label 或 aria-labelledby。' },
  { name: 'placeholder', type: 'string', default: "''", description: '显示值为空时的提示。' },
  { name: 'supportingText', type: 'string', default: "''", description: '与字段关联的辅助说明。' },
  { name: 'error', type: 'boolean', default: 'false', description: '外部视觉与 ARIA 错误，不会单独导致原生校验失败。' },
  { name: 'errorText', type: 'string', default: "''", description: '外部或已报告原生错误优先使用的文案。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用交互、原生校验与提交，禁用时会请求关闭已打开的列表。' },
  { name: 'required', type: 'boolean', default: 'false', description: '通过原生校验代理要求值不是 null 或空字符串，数字 0 有效。' },
  { name: 'name', type: 'string', description: '隐藏提交输入的名称。可见只读标签输入和校验代理不带提交名称。' },
  { name: 'form', type: 'string', description: '外部原生表单 ID，关联提交值、校验代理和可见字段。' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: '填满可用容器宽度。' },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', default: '内部 false', description: '不绑定时内部管理开关；绑定后接受或拒绝 update:open 请求。' },
]
const slots: SlotTableItem[] = [{ name: 'option', description: '替换选项内容，接收 { option: MdvSelectOption, selected: boolean, active: boolean }。组件保留 option 角色和交互外壳，插槽中不要放交互控件。' }]
</script>
# 选择器

用 `MdvSelect` 从预设选项中选择一个值。需要搜索或输入自由文本时，请用[自动补全](./autocomplete)。

## 字段与选项

绑定 `v-model`，并在 `options` 中为每项提供 `value` 和 `label`。用 `null` 表示未选择，数字值与字符串值不会互相转换。

<DemoBlock>
  <BasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const sizes: MdvSelectOption[] = [
  { value: 'small', label: 'Small', supportingText: 'For personal projects' },
  { value: 'medium', label: 'Medium', supportingText: 'For a growing team' },
  { value: 'large', label: 'Large', supportingText: 'Currently unavailable', disabled: true },
]
const typedOptions: MdvSelectOption[] = [{ value: 1, label: 'Number 1' }, { value: '1', label: 'String 1' }]
const outlined = ref<MdvSelectValue | null>('small')
const filled = ref<MdvSelectValue | null>(null)
const typed = ref<MdvSelectValue | null>(1)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <MdvSelect v-model="outlined" label="Outlined size" :options="sizes" full-width />
      <MdvSelect v-model="filled" label="Filled size" variant="filled" placeholder="Choose a size" :options="sizes" full-width />
    </div>
    <MdvSelect v-model="typed" label="Strict value types" :options="typedOptions" full-width />
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Outlined: {{ JSON.stringify(outlined) }} · Filled: {{ JSON.stringify(filled) }} · Typed: {{ typeof typed }} {{ JSON.stringify(typed) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 菜单与自定义选项

用 `variant` 设置字段外观，用 `menu-variant` 设置弹层外观。通过 `option` 插槽自定义内容：`active` 代表当前高亮项，`selected` 反映模型中的选中项。

<DemoBlock>
  <MenusDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'
import checkIcon from '@iconify-icons/material-symbols/check'

const expressive = ref<MdvSelectValue | null>('design')
const baseline = ref<MdvSelectValue | null>('design')
const dark = ref(false)
const rtl = ref(false)
const options: MdvSelectOption[] = [
  { value: 'design', label: 'Design system', supportingText: 'Shared components and foundations' },
  { value: 'website', label: 'Documentation website', supportingText: 'Guides, examples, and API reference' },
  { value: 'archive', label: 'Archived workspace', supportingText: 'Read-only access', disabled: true },
  ...Array.from({ length: 12 }, (_, index) => ({ value: `project-${index}`, label: `Research project ${index + 1}`, supportingText: 'A longer option label and supporting description for scrolling.' })),
]
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="grid gap-4 rounded-xl bg-mdv-surface p-4 text-mdv-on-surface sm:grid-cols-2">
      <MdvSelect v-model="expressive" label="Expressive menu" :options="options" full-width>
        <template #option="{ option, selected, active }">
          <div class="flex min-w-0 items-center gap-3">
            <MdvIcon :icon="selected ? checkIcon : folderIcon" />
            <span class="min-w-0 break-words">
              <span class="block" :class="active ? 'font-medium' : undefined">{{ option.label }}</span>
              <span class="block text-xs">{{ option.supportingText }}</span>
            </span>
          </div>
        </template>
      </MdvSelect>
      <MdvSelect v-model="baseline" label="Baseline menu" menu-variant="baseline" :options="options" full-width />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## 字段状态与清除

通过 `disabled` 禁用字段或单个选项。将模型设为 `null` 可清除选择。用 `error` 和 `error-text` 显示错误；需要阻止提交时，请使用原生校验。

<DemoBlock>
  <StateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const value = ref<MdvSelectValue | null>('email')
const disabled = ref(false)
const error = ref(false)
const lastOption = ref('No option selected in this session.')
const options: MdvSelectOption[] = [{ value: 'email', label: 'Email' }, { value: 'push', label: 'Push notification' }, { value: 'sms', label: 'SMS', disabled: true }]
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="disabled" label="Disable channel" />
      <MdvCheckbox v-model="error" label="Show external error" />
    </div>
    <MdvSelect v-model="value" label="Notification channel" placeholder="Choose a channel" supporting-text="Only available channels can be selected." :options="options" :disabled="disabled" :error="error" error-text="This channel cannot be used for the current account." full-width @select="lastOption = `Selected option: ${$event.label}`" />
    <div><MdvButton variant="outlined" :disabled="disabled || value === null" @click="value = null">Clear channel</MdvButton></div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Model: {{ JSON.stringify(value) }} · {{ lastOption }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 表单与校验

设置 `name` 后，表单会提交所选值。`required` 只检查是否为空，不检查值是否仍在 `options` 中。替换选项时，请由应用清除已失效的值。

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const formId = `select-delivery-${useId()}`
const field = useTemplateRef<InstanceType<typeof MdvSelect>>('field')
const value = ref<MdvSelectValue | null>(null)
const disabled = ref(false)
const message = ref('Not submitted.')
const options: MdvSelectOption[] = [{ value: '', label: 'Choose a method' }, { value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]
function submit(event: Event) {
  message.value = `Form data: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
function reset() {
  queueMicrotask(() => {
    field.value?.setCustomValidity('')
    message.value = 'Selection and application validation reset.'
  })
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvCheckbox v-model="disabled" label="Disable delivery field" />
    <MdvSelect ref="field" v-model="value" label="Delivery method" :options="options" :form="formId" name="delivery" required :disabled="disabled" full-width />
    <form :id="formId" class="flex flex-wrap gap-2" @submit.prevent="submit" @reset="reset">
      <MdvButton type="submit">Submit delivery</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset delivery</MdvButton>
      <MdvButton variant="text" @click="message = `Valid: ${field?.reportValidity()}`">Report validity</MdvButton>
      <MdvButton variant="text" @click="field?.setCustomValidity('Delivery is unavailable for this address.'); field?.reportValidity()">Set custom error</MdvButton>
      <MdvButton variant="text" @click="field?.setCustomValidity(''); message = `Valid: ${field?.checkValidity()}`">Clear custom error</MdvButton>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Model: {{ JSON.stringify(value) }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

异步加载选项时，请在字段外显示加载、失败或重试状态。弹层的内置空列表文案固定为中文。

---

## API

### 属性

<ApiTable :items="props" />

`class`、`style`、`dir`、`lang` 作用于 Select 外层。其他普通属性和监听传给 TextField 输入，包括 `id`、ARIA、焦点和键盘事件。只读选择语义、提交名称和 combobox ARIA 由组件管理。没有公开 leading、trailing、clear 插槽，请使用选项插槽。

### 插槽

<SlotsTable :items="slots" />

### 事件

<DocsTable label="选择器事件">

| 事件 | 参数 | 含义 |
| --- | --- | --- |
| `update:modelValue` | `MdvSelectValue \| null` | 请求选中值，原生 reset 也使用该事件。 |
| `update:open` | `boolean` | 请求打开或关闭，也包括受控方法调用。 |
| `select` | `MdvSelectOption` | 激活了可用选项，重复选择当前项也触发；父级是否接受是独立步骤。 |

</DocsTable>

字段原生 input/change 是 DOM 事件，不是携带所选模型值的事件。处理组件选择请使用 `update:modelValue` 和 `select`。Select 没有 `search` 事件。

### 方法

<DocsTable label="选择器公开方法">

| 方法 | 行为 |
| --- | --- |
| `focus(options?: FocusOptions)` / `blur()` | 聚焦或移出可见字段。 |
| `open()` / `close()` | 请求弹层开关，不返回接受结果。 |
| `checkValidity(): boolean` | 检查原生校验代理及可见输入。 |
| `reportValidity(): boolean` | 报告原生校验及关联的字段反馈。 |
| `setCustomValidity(message: string)` | 设置原生自定义错误，空字符串清除。 |

</DocsTable>

### 公共类型

```ts
import type {
  MdvSelectValue,           // string | number
  MdvSelectVariant,         // 'filled' | 'outlined'
  MdvSelectMenuVariant,     // 'expressive' | 'baseline'
  MdvSelectOption,          // value, label, supportingText?, disabled?
  MdvSelectOptionSlotProps, // option, selected, active
  MdvSelectBaseProps,
  MdvSelectProps,
} from '@mdv-ui/mdv'
```
