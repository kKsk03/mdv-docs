<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BasicDemo from '@/components/docs/demos/select/basic.vue'
import MenusDemo from '@/components/docs/demos/select/menus.vue'
import StateDemo from '@/components/docs/demos/select/state.vue'
import ControlledDemo from '@/components/docs/demos/select/controlled.vue'
import AsyncDemo from '@/components/docs/demos/select/async.vue'
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

`MdvSelect` 通过描边或填充字段及列表框弹层，从预定义选项中选择一个值。本文对应 **MDV 0.1.5**。需要输入查询或自由文本时，请使用[自动补全](./autocomplete)。

## 字段、选项与值类型

每项需要唯一的 `value` 和 `label`，可额外提供 `supportingText`、`disabled`。模型保存值，字段显示标签。数字 `1` 和字符串 `'1'` 是不同选项；禁用项仍显示，但不能激活。由于值来自列表框选择，可见字段本身只读。

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

## 菜单外观与自定义选项

`variant` 控制字段，`menu-variant` 独立控制列表框，默认 Expressive。`option` 插槽接收原始选项及独立的选中、活动状态；`active` 表示键盘或指针正在浏览，不代表模型已接受选择。

长列表在弹层内滚动。现代浏览器使用 Popover 顶层，并通过 Floating UI 翻转和避让视口。弹层保留在组件 DOM 中，继承局部主题与方向。组件没有虚拟滚动，选项数量应适合简单选择器。

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

## 禁用、错误与清空

字段不可用时使用 `disabled`，个别选项不可用时在选项上禁用。`error`、`error-text` 展示应用反馈；需要阻止提交时，还需原生约束或 `setCustomValidity()`。

将模型赋为 `null` 即可清空。Select 没有公开 `clearable` 属性或清空插槽，下面使用独立操作，并遵循字段禁用状态。程序清空不会发出 `select`，该事件用于描述激活的选项。

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

## 受控选择与开关

值和开关是独立状态。常规用法绑定 `v-model`、`v-model:open`；需要拒绝请求时，显式处理更新事件。即使父级拒绝选中值，组件仍会发出 `select(option)` 并请求关闭弹层，所以不能把 `select` 当作父级已经保存新值。

实例 `open()`、`close()` 走相同的受控请求流程。应用需要无条件改变状态时，直接设置父级开关。`focus()` 和 `open()` 是不同方法。

<DemoBlock>
  <ControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const field = useTemplateRef<InstanceType<typeof MdvSelect>>('field')
const value = ref<MdvSelectValue | null>('basic')
const open = ref(false)
const acceptValue = ref(false)
const acceptOpen = ref(true)
const requested = ref('none')
const options: MdvSelectOption[] = [{ value: 'basic', label: 'Basic' }, { value: 'pro', label: 'Pro' }]
function updateValue(next: MdvSelectValue | null) {
  requested.value = `value=${JSON.stringify(next)}`
  if (acceptValue.value) value.value = next
}
function updateOpen(next: boolean) {
  requested.value = `open=${next}`
  if (acceptOpen.value) open.value = next
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="acceptValue" label="Accept value requests" />
      <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
    </div>
    <MdvSelect ref="field" :model-value="value" :open="open" label="Controlled plan" :options="options" full-width @update:model-value="updateValue" @update:open="updateOpen" />
    <div class="flex flex-wrap gap-2">
      <MdvButton variant="outlined" @click="field?.focus(); field?.open()">Request open</MdvButton>
      <MdvButton variant="text" @click="field?.close()">Request close</MdvButton>
      <MdvButton variant="text" @click="open = false">Close directly</MdvButton>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Accepted: {{ value }} · Open: {{ open }} · Last request: {{ requested }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 应用管理选项加载

0.1.5 的 Select 公开 API 没有 `loading`、`loadingText`、`noOptionsText` 属性。加载、失败、取消和重试由应用在字段外管理。下面的模拟请求在选项可用前禁用字段、播报状态，并在重新请求、取消或卸载时清理计时器。需要按输入查询远程建议时使用 Autocomplete。

<DemoBlock>
  <AsyncDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvLinearProgress, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const value = ref<MdvSelectValue | null>(null)
const options = ref<MdvSelectOption[]>([])
const loading = ref(false)
const failNext = ref(false)
const message = ref('Load projects to enable the field.')
let timer: ReturnType<typeof setTimeout> | undefined
function cancel() {
  clearTimeout(timer)
  loading.value = false
  message.value = 'Request cancelled.'
}
function load() {
  clearTimeout(timer)
  loading.value = true
  message.value = 'Loading projects…'
  const fail = failNext.value
  failNext.value = false
  timer = setTimeout(() => {
    loading.value = false
    if (fail) { message.value = 'The simulated service is unavailable. Try again.'; return }
    options.value = [{ value: 'design', label: 'Design system' }, { value: 'website', label: 'Documentation website' }]
    message.value = 'Projects loaded.'
  }, 450)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid min-w-0 gap-3" :aria-busy="loading">
    <MdvCheckbox v-model="failNext" label="Fail the next simulated request" />
    <div class="flex flex-wrap gap-2">
      <MdvButton @click="load">{{ loading ? 'Restart request' : 'Load projects' }}</MdvButton>
      <MdvButton variant="text" :disabled="!loading" @click="cancel">Cancel request</MdvButton>
    </div>
    <MdvLinearProgress v-if="loading" indeterminate aria-label="Loading project options" />
    <MdvSelect v-model="value" label="Project" placeholder="Choose a project" :options="options" :disabled="loading || options.length === 0" :supporting-text="message" full-width />
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }} Model: {{ JSON.stringify(value) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

空 Select 列表框打开时，当前内部兜底文案是中文。其本地化需要在组件库中评估公开 API，不能视为上方 Select 已支持的属性。示例使用明确的英文应用状态，不依赖空弹层文案。

## 原生表单、校验与重置

可见输入只显示标签，不带提交名称；隐藏输入只提交一次实际值，另一个无名称的原生 select 提供必填校验。`null` 不生成具名提交字段，`''` 提交空值且不满足 `required`；禁用字段被排除，数字在 FormData 中序列化为字符串。

`required` 只检查是否为空，不检查是否仍属于选项。移除或禁用选项不会自动清空已有模型，相关策略由父级决定；未知值会显示为对应字符串，应保持选项与模型一致。

原生 reset 请求恢复初始值并关闭弹层。应用设置的自定义错误需明确调用 `setCustomValidity('')` 清理，下面给出了用法。`checkValidity()` 也可能触发原生 invalid，不是无副作用的视觉检查。

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

## 无障碍与键盘交互

输入使用 combobox 语义，以及 `aria-expanded`、`aria-controls`、`aria-activedescendant`。浏览选项时焦点留在字段上，选中项通过 `aria-selected` 表达。请提供可见标签或无障碍名称；选项插槽中不要嵌套链接、输入或按钮。

<DocsTable label="选择器键盘交互">

| 按键 | 行为 |
| --- | --- |
| Enter / Space | 关闭时打开；已打开时提交当前可用项。 |
| 下 / 上方向键 | 打开列表，随后在可用项间移动，不循环。 |
| Home / End | 移到首个或末个可用项，适合列表打开后使用。 |
| 可打印字符 | 按标签前缀查找，匹配项会立即提交；连续输入缓冲在 600ms 后清空。 |
| Escape | 请求关闭列表框。 |
| Tab / 失焦 / 外部指针 | 保留正常焦点移动；字段失焦或外部按下会请求关闭。 |

</DocsTable>

输入法组合输入不会被当作选择快捷键。该字段不提供自由编辑或任意文本值。最终应用仍需验证读屏、触摸、原生校验展示、减少动态效果和弹层位置。

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
