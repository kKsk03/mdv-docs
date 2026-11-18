<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import AutocompleteBasicDemo from '@/components/docs/demos/autocomplete/basic.vue'
import AutocompleteVariantDemo from '@/components/docs/demos/autocomplete/variant.vue'
import AutocompleteMenuDemo from '@/components/docs/demos/autocomplete/menuVariant.vue'
import AutocompleteOptionDemo from '@/components/docs/demos/autocomplete/option.vue'
import AutocompleteRemoteDemo from '@/components/docs/demos/autocomplete/remote.vue'
import AutocompleteStatesDemo from '@/components/docs/demos/autocomplete/states.vue'
import AutocompleteFormDemo from '@/components/docs/demos/autocomplete/form.vue'

const autocompleteProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string | number | null', default: 'null', description: '当前建议值或自由文本。选中建议提交原始 value，输入文本提交字符串；未绑定时使用内部状态。' },
  { name: 'options', type: 'readonly MdvSelectOption[]', description: '建议列表，公开类型中为必传项。不需要建议时传入空数组；同一列表中 value 必须唯一。' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'outlined'", description: '输入字段的填充或描边外观。' },
  { name: 'menuVariant', type: "'expressive' | 'baseline'", default: "'expressive'", description: '建议面板的圆角、选中背景与行样式。独立于输入字段的 variant。' },
  { name: 'label', type: 'string', default: "''", description: '字段标签，也是建议列表的可访问名称。' },
  { name: 'placeholder', type: 'string', default: "''", description: '输入占位文字，不替代可访问名称。' },
  { name: 'supportingText', type: 'string', default: "''", description: '字段下方的辅助说明。' },
  { name: 'error', type: 'boolean', default: 'false', description: '业务错误状态。单独使用不会阻止原生表单提交。' },
  { name: 'errorText', type: 'string', default: "''", description: '业务错误或已报告的原生校验错误的说明。单独设置不会开启错误状态。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁用字段；祖先 fieldset 的 disabled 也按原生规则生效。' },
  { name: 'required', type: 'boolean', default: 'false', description: '要求模型不是 null 或空字符串，自由文本同样可以满足必填。' },
  { name: 'name', type: 'string', description: '原生表单字段名，只提交模型值，不重复提交显示标签。null 模型不提交该字段。' },
  { name: 'form', type: 'string', description: '关联外部表单的 id，同时作用于可见输入和表单代理。' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: '字段填满外层容器的可用宽度。' },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', description: '面板打开状态，省略时内部管理。受控模式下父级决定是否接受打开或关闭请求。' },
  { name: 'filterMode', type: "'local' | 'external'", default: "'local'", description: 'local 按 label 忽略大小写包含匹配；external 原样展示传入列表，由使用方管理搜索。' },
  { name: 'loading', type: 'boolean', default: 'false', description: '显示加载说明，并为 listbox 设置 aria-busy。不会发起请求或自动移除已有选项。' },
  { name: 'loadingText', type: 'string', default: "'正在加载…'", description: '面板的加载状态文案。组件默认文案为中文，按站点语言显式传入。' },
  { name: 'noOptionsText', type: 'string', default: "'没有匹配项'", description: '没有选项且未加载时显示的文案，可按页面语言自定义。' },
]
const autocompleteSlots: SlotTableItem[] = [
  { name: 'option', description: '自定义选项内容，接收 { option, selected, active }。仅负责呈现，不应放置按钮、链接或其他可聚焦控件。' },
]
</script>

# 自动补全

`MdvAutocomplete` 为可编辑输入提供建议。用户可以选择一项，也可以保留任意输入文本；需要严格限定为已有选项时使用 `MdvSelect`。

## 基本用法

通过 `v-model` 绑定 `string | number | null`，传入 `{ value, label }` 组成的 `options`。默认按标签进行本地过滤，忽略大小写并去除查询首尾空格。

<DemoBlock>
  <AutocompleteBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const city = ref<MdvSelectValue | null>(null)
const options: MdvSelectOption[] = [
  { value: 'london', label: 'London', supportingText: 'United Kingdom' },
  { value: 'paris', label: 'Paris', supportingText: 'France' },
  { value: 'tokyo', label: 'Tokyo', supportingText: 'Japan' },
  { value: 'oslo', label: 'Oslo', disabled: true },
]
</script>

<template>
  <div class="grid max-w-sm gap-3">
    <MdvAutocomplete
      v-model="city"
      label="Destination"
      placeholder="Type a city"
      :options="options"
      supporting-text="Choose a suggestion or enter your own city."
      no-options-text="No cities found."
      full-width
    />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Model: {{ JSON.stringify(city) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

选中 London 后，模型为 `'london'`，输入框显示 `London`；输入未匹配的城市时，模型就是输入字符串。数字值与字符串值按不同选项处理，例如 `1` 和 `'1'` 不等价。

每项还支持 `supportingText` 和 `disabled`。禁用项可见，但不能被选择或成为键盘活动项。模型与 `value` 的类型应保持一致，且每个 `value` 唯一。

---

## 字段外观

通过 `variant` 设置 `outlined` 或 `filled`，默认 `outlined`。`full-width` 可让字段填满父容器。

<DemoBlock>
  <AutocompleteVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const outlined = ref<MdvSelectValue | null>(null)
const filled = ref<MdvSelectValue | null>(null)
const options = [
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'svelte', label: 'Svelte' },
]
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <MdvAutocomplete v-model="outlined" label="Outlined" variant="outlined" :options="options" no-options-text="No matches." full-width />
    <MdvAutocomplete v-model="filled" label="Filled" variant="filled" :options="options" no-options-text="No matches." full-width />
  </div>
</template>
```

  </template>
</DemoBlock>

### 建议面板

`menu-variant` 独立控制面板外观。默认 Expressive 使用较大的圆角和选中形状，Baseline 使用较小圆角和连续行布局。

<DemoBlock>
  <AutocompleteMenuDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const expressive = ref<MdvSelectValue | null>('paris')
const baseline = ref<MdvSelectValue | null>('paris')
const options = [
  { value: 'london', label: 'London' },
  { value: 'paris', label: 'Paris' },
  { value: 'tokyo', label: 'Tokyo' },
]
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <MdvAutocomplete v-model="expressive" label="Expressive menu" menu-variant="expressive" :options="options" no-options-text="No cities found." full-width />
    <MdvAutocomplete v-model="baseline" label="Baseline menu" menu-variant="baseline" :options="options" no-options-text="No cities found." full-width />
  </div>
</template>
```

  </template>
</DemoBlock>

面板使用 combobox/listbox 语义。它与操作菜单的用途不同，不需要组合 `MdvMenu`。

---

## 自定义选项

`option` 插槽接收原始选项、选中状态和键盘活动状态。用于补充文字、图像等展示内容；原有选择和键盘行为由组件管理。

<DemoBlock>
  <AutocompleteOptionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const project = ref<MdvSelectValue | null>('docs')
const options = [
  { value: 'library', label: 'Component library', supportingText: 'Shared Vue components' },
  { value: 'docs', label: 'Documentation', supportingText: 'Guides and live examples' },
]
</script>

<template>
  <MdvAutocomplete v-model="project" class="max-w-sm" label="Project" :options="options" no-options-text="No projects found." full-width>
    <template #option="{ option, selected }">
      <span class="grid gap-1">
        <span class="font-medium">{{ option.label }}{{ selected ? ' · Selected' : '' }}</span>
        <span class="text-sm text-mdv-on-surface-variant">{{ option.supportingText }}</span>
      </span>
    </template>
  </MdvAutocomplete>
</template>
```

  </template>
</DemoBlock>

不要在选项内放置独立按钮、链接或输入控件。需要多个可交互操作时，应选择适合该场景的组合。

---

## 异步搜索

设置 `filter-mode="external"` 后，组件原样展示使用方提供的 `options`。通过 `search` 获取查询，再更新列表和 `loading`。

下面用本地定时器模拟 350ms 响应，不会访问网络。输入新内容时取消上一轮响应，开始搜索时清空旧选项，卸载时清理定时器。

<DemoBlock>
  <AutocompleteRemoteDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvAutocomplete } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const city = ref<MdvSelectValue | null>(null)
const options = ref<MdvSelectOption[]>([])
const loading = ref(false)
const query = ref('')
const cities: MdvSelectOption[] = [
  { value: 'london', label: 'London' },
  { value: 'los-angeles', label: 'Los Angeles' },
  { value: 'paris', label: 'Paris' },
  { value: 'tokyo', label: 'Tokyo' },
]
let timer: ReturnType<typeof setTimeout> | undefined

function search(value: string) {
  clearTimeout(timer)
  query.value = value
  options.value = []
  loading.value = true
  // Simulate a request; cancel the previous scheduled response.
  timer = setTimeout(() => {
    const keyword = value.trim().toLowerCase()
    options.value = cities.filter(option => option.label.toLowerCase().includes(keyword))
    loading.value = false
  }, 350)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid max-w-sm gap-3">
    <MdvAutocomplete
      v-model="city"
      label="Search cities"
      :options="options"
      filter-mode="external"
      :loading="loading"
      loading-text="Searching cities…"
      :no-options-text="query ? 'No cities found.' : 'Type to search cities.'"
      full-width
      @search="search"
    />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Query: {{ JSON.stringify(query) }} · Model: {{ JSON.stringify(city) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

真实应用需要自行处理请求、防抖、错误、排序和过期结果，例如通过 `AbortController` 或请求序号取消过时结果。`loading` 只展示状态，不自动禁止旧选项或管理请求。

默认 `loading-text` 和 `no-options-text` 为中文；本站共享演示显式传入英文，使两种语言的示例保持一致。使用方可按自己的语言设置文案。

---

## 禁用与错误

通过 `disabled` 禁用字段，通过 `error`、`error-text` 表达业务错误。设置 `error-text` 本身不会开启错误；需要阻止提交时使用原生约束或 `setCustomValidity()`。

<DemoBlock>
  <AutocompleteStatesDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvAutocomplete } from '@mdv-ui/mdv'

const options = [{ value: 'paris', label: 'Paris' }]
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <MdvAutocomplete label="Disabled" model-value="paris" :options="options" disabled full-width />
    <MdvAutocomplete label="Destination" :options="options" error error-text="Choose a supported destination." no-options-text="No cities found." full-width />
  </div>
</template>
```

  </template>
</DemoBlock>

---

## 表单与校验

`name` 提交模型值，显示标签不会额外提交。模型为 `null` 时不创建该字段；非 null 的数字提交时转换为字符串。禁用字段不参与提交，`form` 可关联外部表单。

直接点击 Submit 查看必填提示。选择建议或输入自由文本都能通过必填校验；Reset 恢复创建时的初始模型。

<DemoBlock>
  <AutocompleteFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete, MdvButton } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const city = ref<MdvSelectValue | null>(null)
const result = ref('Submit a suggestion or your own city.')
const options = [
  { value: 'london', label: 'London' },
  { value: 'paris', label: 'Paris' },
  { value: 'tokyo', label: 'Tokyo' },
]

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ destination: data.get('destination') })
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="result = 'Form reset.'">
    <MdvAutocomplete
      v-model="city"
      class="max-w-sm"
      name="destination"
      label="Required destination"
      :options="options"
      supporting-text="Free text is also accepted."
      error-text="Enter a destination to continue."
      no-options-text="No cities found."
      required
      full-width
    />
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

`required` 只检查非 null、非空字符串，不限制必须来自建议列表，也不自动裁剪模型中的空格。若业务要求固定选项，应使用 `MdvSelect`，或自行增加校验。

原生表单校验代理负责将错误反馈到可见字段。表单 reset 会请求恢复初始模型并收起面板，受控模式仍需父级接受更新；读取恢复状态前等待 Vue 更新。外部业务错误和自定义校验消息由使用方清理。

---

## 打开状态与键盘

省略 `open` 时由组件管理面板；通过 `v-model:open` 可受控管理。模板引用还提供 `open()`、`close()` 和焦点方法，受控面板仍服从父级接受的状态。

- ArrowDown、ArrowUp 浏览可用建议，Enter 提交当前活动项，Escape 收起。
- 焦点保留在输入框，通过 `aria-activedescendant` 表达活动项。
- Home、End 保留原生光标编辑行为；Tab 按原生顺序离开字段。
- 支持中文输入法组合输入。建议列表与状态说明会提供相应的无障碍语义。

为字段提供 `label` 或可访问名称；占位文字不能替代标签。自定义选项不会替换原有的 option 语义。

---

## API

### 属性

<ApiTable :items="autocompleteProps" />

### Slots

<SlotsTable :items="autocompleteSlots" />

### 选项结构

```ts
interface MdvSelectOption {
  value: string | number
  label: string
  supportingText?: string
  disabled?: boolean
}
```

### 事件

- `update:modelValue(value: MdvSelectValue | null)`：请求更新选项值或自由文本。
- `update:open(open: boolean)`：请求更新面板状态。
- `select(option: MdvSelectOption)`：选中建议时发出完整选项。
- `search(query: string)`：输入变化时同步发出查询。选中建议不会额外伪造一次搜索。

### 方法

- `focus(options?: FocusOptions)`、`blur()`：控制实际输入框焦点。
- `open()`、`close()`：请求打开或关闭面板。
- `checkValidity(): boolean`、`reportValidity(): boolean`：检查原生约束或报告错误。
- `setCustomValidity(message: string)`：设置自定义校验消息，空字符串清除。

### 原生属性与类型

`class`、`style` 作用于外壳；`id`、ARIA、原生输入属性和监听器转发到实际输入框。`name` 只用于隐藏的模型值字段。公开插槽只有 `option`；不要将 TextField 的全部属性或插槽视为 Autocomplete 的公开 API。

```ts
import type {
  MdvAutocompleteProps,
  MdvAutocompleteFilterMode,
  MdvSelectBaseProps,
  MdvSelectOption,
  MdvSelectValue,
  MdvSelectVariant,
  MdvSelectMenuVariant,
  MdvSelectOptionSlotProps,
} from '@mdv-ui/mdv'
```
