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
import AutocompleteFormDemo from '@/components/docs/demos/autocomplete/form.vue'

const autocompleteProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'string | number | null', default: 'null', description: 'A suggestion value or free text. Selection emits the original value; typing emits a string. Uses internal state when unbound.' },
  { name: 'options', type: 'readonly MdvSelectOption[]', description: 'Suggestion list, required by the public type. Pass an empty array when needed. Each value must be unique within the list.' },
  { name: 'variant', type: "'filled' | 'outlined'", default: "'outlined'", description: 'Filled or outlined input appearance.' },
  { name: 'menuVariant', type: "'expressive' | 'baseline'", default: "'expressive'", description: 'Suggestion panel corners, selection surface, and row appearance. Independent of the field variant.' },
  { name: 'label', type: 'string', default: "''", description: 'Field label and accessible name for the suggestion list.' },
  { name: 'placeholder', type: 'string', default: "''", description: 'Input placeholder. Does not replace an accessible name.' },
  { name: 'supportingText', type: 'string', default: "''", description: 'Supporting text below the field.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Application error state. Does not independently block native form submission.' },
  { name: 'errorText', type: 'string', default: "''", description: 'Message for an application error or a reported native validation error. Text alone does not activate an error.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the field. An ancestor disabled fieldset also applies native disabling rules.' },
  { name: 'required', type: 'boolean', default: 'false', description: 'Requires a non-null, nonempty model. Free text also satisfies this constraint.' },
  { name: 'name', type: 'string', description: 'Native form field name. Submits the model without duplicating its display label. A null model omits this field.' },
  { name: 'form', type: 'string', description: 'External form id, applied to the visible input and form proxies.' },
  { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Fills the outer container width.' },
  { name: 'open', attribute: 'v-model:open', type: 'boolean', description: 'Panel state, internally managed when omitted. In controlled mode the parent accepts or rejects open/close requests.' },
  { name: 'filterMode', type: "'local' | 'external'", default: "'local'", description: 'Local performs case-insensitive label inclusion matching. External displays the supplied list and leaves search to the application.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Displays loading text and sets listbox aria-busy. Does not fetch results or automatically remove existing options.' },
  { name: 'loadingText', type: 'string', default: "'正在加载…'", description: 'Panel loading message. The component default is Chinese; provide text for your application locale.' },
  { name: 'noOptionsText', type: 'string', default: "'没有匹配项'", description: 'Message shown when there are no options and loading is false. Set it for your application locale.' },
]
const autocompleteSlots: SlotTableItem[] = [
  { name: 'option', description: 'Custom option content, receiving { option, selected, active }. Presentation only: do not include buttons, links, or other focusable controls.' },
]
</script>
# Autocomplete

Use `MdvAutocomplete` to suggest matches as users type. It can also accept text that is not in the suggestions.

## Basic usage

Bind `v-model` and pass `options` with a `value` and `label` for each suggestion. The default filter matches labels without regard to case.

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

## Field appearance

Set `variant` to `outlined` or `filled`. Use `full-width` to fill the parent.

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

## Custom options

Use the `option` slot to customize how suggestions appear. Selection and keyboard interaction still belong to Autocomplete.

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

## Async search

Set `filter-mode="external"` to use server results as supplied. Read the query from `search`, then update `options` and `loading`. Cancel or ignore stale requests.

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

## Forms and validation

Set `name` to submit the model rather than the display label. Use native constraints or `setCustomValidity()` to block invalid submission; `error` and `error-text` only display feedback.

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

---

## API

### Props

<ApiTable :items="autocompleteProps" />

### Slots

<SlotsTable :items="autocompleteSlots" />

### Option structure

```ts
interface MdvSelectOption {
  value: string | number
  label: string
  supportingText?: string
  disabled?: boolean
}
```

### Events

- `update:modelValue(value: MdvSelectValue | null)`: requests a suggestion value or free-text update.
- `update:open(open: boolean)`: requests a panel-state update.
- `select(option: MdvSelectOption)`: emits the complete selected suggestion.
- `search(query: string)`: synchronously emits the changed input query. Selecting a suggestion does not synthesize another search.

### Methods

- `focus(options?: FocusOptions)` and `blur()`: control the actual input focus.
- `open()` and `close()`: request panel opening or closing.
- `checkValidity(): boolean` and `reportValidity(): boolean`: check native constraints or report errors.
- `setCustomValidity(message: string)`: sets a custom validity message; an empty string clears it.

### Native attributes and types

`class` and `style` apply to the wrapper. `id`, ARIA, native input attributes, and listeners are forwarded to the actual input. `name` belongs only to the hidden model-value field. The only public slot is `option`; the full TextField prop and slot surface is not the Autocomplete public API.

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
