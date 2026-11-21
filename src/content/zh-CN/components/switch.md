<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import StatesDemo from '@/components/docs/demos/switch/states.vue'
import IconsDemo from '@/components/docs/demos/switch/icons.vue'
import FormDemo from '@/components/docs/demos/switch/form.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'false', description: '设置是否开启。' },
  { name: 'label', type: 'string', default: "''", description: '可点击的可见标签；默认插槽优先。' },
  { name: 'labelPosition', type: 'MdvSwitchLabelPosition', default: "'end'", description: "标签的逻辑位置：'start' 或 'end'。" },
  { name: 'supportingText', type: 'string', default: "''", description: '与输入控件关联的辅助说明。' },
  { name: 'color', type: 'MdvSwitchColor', default: "'primary'", description: '主题色、语义色或 #RGB/#RRGGBB 种子色。' },
  { name: 'disabled', type: 'boolean', default: 'false', description: '禁止原生激活，控件也不参与表单提交。' },
  { name: 'required', type: 'boolean', default: 'false', description: '原生校验要求开关处于开启状态。' },
  { name: 'value', type: 'string', default: "'on'", description: '开启时提交的表单值，不是 Vue 模型。' },
  { name: 'error', type: 'boolean', default: 'false', description: '标记业务错误，不改变原生校验有效性。' },
  { name: 'errorText', type: 'string', default: "''", description: '显示业务错误或已报告的原生错误时优先使用的说明。' },
]

const slots: SlotTableItem[] = [
  { name: 'default', description: '替换标签文本。请勿在标签内放置独立的交互控件。' },
  { name: 'selected-icon', description: '替换开启时手柄内的内置勾号；显式空插槽可隐藏勾号。' },
  { name: 'unselected-icon', description: '关闭时手柄内可选的装饰图标。' },
]
</script>
# 开关

用 `MdvSwitch` 开启或关闭设置。标签应描述设置本身，不要随开关状态改变。

## 切换设置

用 `v-model` 绑定布尔值。用 `label-position="start"` 将标签放在轨道前。

<DemoBlock>
  <StatesDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSwitch } from '@mdv-ui/mdv'

const notifications = ref(false)
const previews = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvSwitch
      v-model="notifications"
      label="Delivery notifications"
      supporting-text="Receive updates when a package is on its way."
    />
    <MdvSwitch
      v-model="previews"
      label="Show previews of upcoming scheduled messages in the activity feed"
      label-position="start"
    />
    <MdvSwitch :model-value="true" label="Organization audit log" disabled />
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      Delivery notifications: {{ notifications ? 'on' : 'off' }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## 图标、颜色与错误

选中时滑块默认显示勾号。使用 `selected-icon` 或 `unselected-icon` 插槽可替换对应状态的图标。

<DemoBlock>
  <IconsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import close from '@iconify-icons/material-symbols/close'
import { ref } from 'vue'
import { MdvIcon, MdvSwitch } from '@mdv-ui/mdv'

const sync = ref(false)
const quiet = ref(true)
const offline = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSwitch v-model="sync" label="Sync over Wi-Fi" color="#006C66">
      <template #unselected-icon><MdvIcon :icon="close" size="16" /></template>
    </MdvSwitch>
    <div
      data-mdv-theme="dark"
      dir="rtl"
      class="rounded-xl bg-mdv-surface-container p-4 text-mdv-on-surface"
    >
      <MdvSwitch v-model="quiet" label="Quiet hours" color="tertiary">
        <template #selected-icon></template>
      </MdvSwitch>
    </div>
    <MdvSwitch
      v-model="offline"
      label="Offline access"
      color="tertiary"
      :error="offline"
      error-text="Your organization does not allow offline access."
    />
  </div>
</template>
```

  </template>
</DemoBlock>

## 表单提交和重置

设置 `name` 后，开关只在开启且未禁用时提交值。必须开启时使用 `required`，用 `form` 关联外部表单。重置会恢复初始状态。

<DemoBlock>
  <FormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvSwitch } from '@mdv-ui/mdv'

const formId = useId()
const share = ref(false)
const result = ref('No submission yet.')

function submit(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  const value = new FormData(form).get('sharing')
  result.value = `Submitted: sharing=${value}.`
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSwitch
      v-model="share"
      :form="formId"
      name="sharing"
      value="enabled"
      label="Share this report with the project team"
      supporting-text="Enable team access before publishing."
      error-text="Enable team access to continue."
      required
    />
    <form
      :id="formId"
      class="flex flex-wrap gap-3"
      @submit.prevent="submit"
      @reset="result = 'Reset to the initial preference.'"
    >
      <MdvButton type="submit">Publish report</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
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

### 原生属性和事件

`class`、`style`、`dir` 和 `lang` 用于外层。`id`、`name`、`form`、ARIA、`data-*`，以及 `input`、`change`、`focus`、`blur`、`invalid` 等原生监听器透传给实际复选框。类型、角色和勾选状态由组件管理；请用 `v-model` 设置开关状态，不要另传 `checked` 或 `defaultChecked`。

`update:modelValue` 在原生激活后发出请求的布尔值；`@change` 收到的是原生事件。调用 `preventDefault()` 取消 `click` 会阻止原生激活。程序直接设置模型不会合成原生事件。

### 公开方法和类型

可通过组件模板引用调用 `focus(options?: FocusOptions)`、`blur()`、`checkValidity(): boolean`、`reportValidity(): boolean` 或 `setCustomValidity(message: string)`。校验方法使用原生复选框；向 `setCustomValidity()` 传入空字符串可移除自定义错误。

```ts
import type { MdvSwitchColor, MdvSwitchLabelPosition } from '@mdv-ui/mdv'
```
