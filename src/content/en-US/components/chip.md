<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ChipVariantDemo from '@/components/docs/demos/chip/variant.vue'
import ChipSelectionDemo from '@/components/docs/demos/chip/selection.vue'
import ChipIndependentDemo from '@/components/docs/demos/chip/independent.vue'
import ChipRemovalDemo from '@/components/docs/demos/chip/removal.vue'
import ChipAppearanceDemo from '@/components/docs/demos/chip/appearance.vue'
import ChipLayoutDemo from '@/components/docs/demos/chip/layout.vue'
import ChipFormDemo from '@/components/docs/demos/chip/form.vue'

const chipProps: ApiTableItem[] = [
  { name: 'variant', type: "'assist' | 'filter' | 'input' | 'suggestion'", default: "'assist'", description: 'Chip purpose. Filter selects by default; Input represents entered content and is removable by default.' },
  { name: 'label', type: 'string', default: "''", description: 'Default visible text and source for the fallback removal name. The default slot overrides displayed text.' },
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Raised appearance for Assist, Filter, and Suggestion. Ignored by Input.' },
  { name: 'color', type: 'MdvChipColor', description: 'Primary, secondary, tertiary, success, warning, error, info, or a #RGB/#RRGGBB seed. Omitted preserves the default variant color roles.' },
  { name: 'value', type: 'string | number', description: 'Unique Filter value for a single/multiple selection ChipSet.' },
  { name: 'selected', attribute: 'v-model:selected', type: 'boolean', default: 'Internal false when omitted', description: 'Filter/Input selected state. Supplied values are controlled; omit this when ChipSet owns Filter selection.' },
  { name: 'selectable', type: 'boolean', default: 'filter: true; input: false', description: 'Allows the primary action to toggle Filter/Input selection. Assist/Suggestion never select; removeOnly disables selection.' },
  { name: 'removable', type: 'boolean', default: 'input: true; filter: false', description: 'Enables removal for Filter/Input. Assist/Suggestion do not have removal actions.' },
  { name: 'removeOnly', type: 'boolean', default: 'false', description: 'Makes a removable Input chip one removal action with one focus target; no separate primary operation or selected state.' },
  { name: 'removeLabel', type: 'string', default: "'' (derived Chinese removal name)", description: 'Explicit accessible removal name. Fallback is 删除 plus the label/text, or 删除此项. Localize it for the application.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables primary and removal actions. ChipSet disabling also applies.' },
  { name: 'href', type: 'string', description: 'Native link for Assist/Suggestion only. Filter/Input ignore it and warn in development.' },
]
const setProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvChipSetModelValue', default: 'null', description: 'Accepted selection: a value/null for single, an array for multiple. With no bound model, changes are managed internally.' },
  { name: 'selection', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'None manages layout/focus only. Single/multiple take over selectable Filter chips with unique values.' },
  { name: 'label', type: 'string', default: "''", description: 'Visible group label and accessible naming source; the label slot replaces its text.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables every child chip action.' },
  { name: 'scrollable', type: 'boolean', default: 'false', description: 'Uses one horizontally scrollable row instead of wrapping. Keyboard navigation reveals its target.' },
]
const chipSlots: SlotTableItem[] = [
  { name: 'default', description: 'Custom label, receiving { selected }. Keep an accurate label/removeLabel when the content needs an explicit removal name.' },
  { name: 'leading', description: 'Decorative icon, receiving { selected }. Selected Filter replaces it with its built-in checkmark.' },
  { name: 'avatar', description: 'Input-only 24px circular content, taking precedence over leading. Receives { selected }.' },
  { name: 'trailing', description: 'Removal icon replacement for removable Filter/Input, or decorative trailing content for nonremovable Filter/Input. Receives { selected }; removal semantics stay managed by the chip.' },
]
const setSlots: SlotTableItem[] = [
  { name: 'default', description: 'MdvChip children; no slot parameters.' },
  { name: 'label', description: 'Replaces the visible group label; no slot parameters.' },
]
</script>

# Chip

`MdvChip` presents compact contextual actions, suggestions, filters, or entered content. `MdvChipSet` arranges related chips, manages their keyboard focus, and optionally manages Filter selection.

## Variants

Assist performs a contextual action; Suggestion proposes a response or action; Filter toggles a criterion; Input represents content such as an attachment, tag, or person. The Input primary action is independent of its removal action.

<DemoBlock>
  <ChipVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvChip, MdvChipSet, MdvIcon } from '@mdv-ui/mdv'
import calendar from '@iconify-icons/material-symbols/calendar-month-outline'

const selected = ref(false)
const attached = ref(true)
const message = ref('Try an action, a filter, or a removable input chip.')
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet label="Chip variants">
      <MdvChip label="Add to calendar" @click="message = 'Added to your calendar.'">
        <template #leading><MdvIcon :icon="calendar" /></template>
      </MdvChip>
      <MdvChip variant="suggestion" label="Sounds good" @click="message = 'Reply: Sounds good.'" />
      <MdvChip v-model:selected="selected" variant="filter" label="Unread" />
      <MdvChip v-if="attached" variant="input" label="Design notes" remove-label="Remove Design notes" @click="message = 'Opened Design notes.'" @remove="attached = false" />
    </MdvChipSet>
    <MdvButton v-if="!attached" variant="text" @click="attached = true">Restore attachment</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }} · Unread: {{ selected }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="Chip variant behavior" min-width="32rem">

| Variant | Default primary action | Default removal | Link support |
| --- | --- | --- | --- |
| `assist` | Application action | No | Yes |
| `suggestion` | Application action | No | Yes |
| `filter` | Toggle selection, with built-in selected checkmark | No; can enable | No |
| `input` | Application action; selection can be enabled | Yes | No |

</DocsTable>

Only Assist/Suggestion accept `href`; native `target`, `rel`, and `download` are forwarded. Button chips always use `type="button"`. Do not use a Filter/Input chip as a disguised link.

---

## Group selection

Set ChipSet's `selection` to `single` or `multiple` and bind `v-model`. Each selectable Filter needs a unique `value`. Single selection can be cleared by clicking its selected chip again; multiple selection uses an array.

<DemoBlock>
  <ChipSelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvChip, MdvChipSet, MdvIcon } from '@mdv-ui/mdv'
import type { MdvChipSetModelValue } from '@mdv-ui/mdv'
import image from '@iconify-icons/material-symbols/image-outline'

const single = ref<MdvChipSetModelValue>('all')
const multiple = ref<MdvChipSetModelValue>(['images'])
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet v-model="single" selection="single" label="Content type">
      <MdvChip variant="filter" value="all" label="All" />
      <MdvChip variant="filter" value="articles" label="Articles" />
      <MdvChip variant="filter" value="images" label="Images">
        <template #leading><MdvIcon :icon="image" /></template>
      </MdvChip>
      <MdvChip variant="filter" value="unavailable" label="Unavailable" disabled />
    </MdvChipSet>
    <MdvChipSet v-model="multiple" selection="multiple" label="Additional filters">
      <MdvChip variant="filter" value="images" label="Images" />
      <MdvChip variant="filter" value="videos" label="Videos" />
      <MdvChip variant="filter" value="recent" label="Recent" />
    </MdvChipSet>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Single: {{ JSON.stringify(single) }} · Multiple: {{ JSON.stringify(multiple) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Group selection applies only to selectable Filter chips. Input, Assist, Suggestion, and `:selectable="false"` chips do not join the group model. Do not also bind `selected` on a Filter managed by the group. Numbers and strings are distinct, and multiple-selection updates create new arrays rather than modifying the supplied array.

The accepted parent model controls `aria-pressed` and appearance. Rejecting an update preserves the accepted state. Native click listeners run before selection; `event.preventDefault()` cancels the toggle request. There is no `selection-required` prop.

### Independent selection and avatars

With ChipSet's default `selection="none"`, each chip can use its own boolean `v-model:selected`. Unbound chips manage their own state. An Input chip needs `selectable` to toggle; selection alone does not add a Filter checkmark.

<DemoBlock>
  <ChipIndependentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvChip, MdvChipSet } from '@mdv-ui/mdv'

const saved = ref(false)
const person = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet label="Independent selections">
      <MdvChip v-model:selected="saved" variant="filter" label="Saved only" />
      <MdvChip v-model:selected="person" variant="input" label="Alex" selectable :removable="false">
        <template #avatar>
          <span class="grid size-full place-items-center bg-mdv-primary-container text-xs text-mdv-on-primary-container">AL</span>
        </template>
        <template #default="{ selected }">Alex{{ selected ? ' (selected)' : '' }}</template>
      </MdvChip>
    </MdvChipSet>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Saved only: {{ saved }} · Alex: {{ person }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Use `#avatar` for Input content such as a contact's initials. It takes precedence over `#leading`. The default label and decorative slots receive `{ selected }`. Avatar/icon slots are hidden from assistive technology and inert, so the chip's text must identify the action. Do not put buttons, inputs, or links inside chip slots.

---

## Removing entered content

The `remove` event is a request. Update the data array to remove a chip; the component does not delete its own node. Use a stable Vue `:key` so ChipSet can move focus to an available neighbor after actual removal.

<DemoBlock>
  <ChipRemovalDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvChip, MdvChipSet, MdvIcon } from '@mdv-ui/mdv'
import cancel from '@iconify-icons/material-symbols/cancel-outline'

const initial = ['Design', 'Review', 'Release']
const tags = ref([...initial])
const removeOnly = ref(false)
const message = ref('Open a tag, or remove it with its separate action.')

function remove(tag: string) {
  tags.value = tags.value.filter(item => item !== tag)
  message.value = `Removed ${tag}.`
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="removeOnly" label="Make the whole chip remove only" />
    <MdvChipSet label="Project tags">
      <MdvChip v-for="tag in tags" :key="tag" variant="input" :label="tag" :remove-only="removeOnly" :remove-label="`Remove ${tag}`" @click="message = `Opened ${tag}.`" @remove="remove(tag)">
        <template #trailing><MdvIcon :icon="cancel" /></template>
      </MdvChip>
      <span v-if="!tags.length" class="text-sm text-mdv-on-surface-variant">All tags removed.</span>
    </MdvChipSet>
    <MdvButton class="justify-self-start" variant="text" @click="tags = [...initial]; message = 'Tags restored.'">Restore tags</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

The separate remove button does not fire the primary click or change selection. Focus an Input chip or its remove button and press Delete/Backspace to request removal. Repeated keydown events and modified Ctrl/Alt/Meta shortcuts do not repeat the request. The trailing slot above changes the removal icon while preserving the component's button and name.

Enable `remove-only` when the whole Input chip should only remove content. It combines the operations into one named focus target and ignores selection. It requires removal to be enabled and applies only to Input.

Always provide a localized `remove-label` when needed. Fallback names are Chinese (`删除` plus label/text, or `删除此项`). For complex custom label content, supply an accurate `label` or explicit removal name so server-rendered output is already named.

## Appearance and colors

Assist, Filter, and Suggestion support `elevated`; Input keeps its ordinary appearance. Chip `color` accepts the same named roles and local hexadecimal seeds as Button, leaving the surrounding theme intact.

<DemoBlock>
  <ChipAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvChip, MdvChipSet } from '@mdv-ui/mdv'
import type { MdvChipColor } from '@mdv-ui/mdv'

const colors: MdvChipColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info', '#006c4c']
const message = ref('Try the elevated actions or toggle a color filter.')
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet label="Elevated chips">
      <MdvChip label="Assist" elevated @click="message = 'Elevated assist activated.'" />
      <MdvChip variant="suggestion" label="Suggestion" elevated @click="message = 'Elevated suggestion activated.'" />
      <MdvChip variant="filter" label="Filter" elevated />
    </MdvChipSet>
    <MdvChipSet label="Theme roles and a local seed">
      <MdvChip v-for="color in colors" :key="color" variant="filter" :label="color" :color="color" />
    </MdvChipSet>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Default chips have a 32px visible height, 8px corners, and 18px icons, with at least 48px interaction targets. A chip with primary and removal actions reserves separate targets; do not compress that space with local CSS. Default selected Filter/Input surfaces use `secondary-container` and `on-secondary-container`. Light/dark themes, local tokens, focus outlines, state layers, and reduced motion are provided by MDV.

## Wrapping, scrolling, and disabling

ChipSet wraps by default. Enable `scrollable` for a single horizontal row. Try keyboard navigation in the narrow row, or disable the whole set.

<DemoBlock>
  <ChipLayoutDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvChip, MdvChipSet } from '@mdv-ui/mdv'
import type { MdvChipSetModelValue } from '@mdv-ui/mdv'

const scrollable = ref(false)
const disabled = ref(false)
const selected = ref<MdvChipSetModelValue>(['Design'])
const topics = ['Design', 'Research', 'Engineering', 'Accessibility', 'Typography', 'Motion', 'Color', 'Layouts']
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="scrollable" label="Keep chips on one scrollable line" />
      <MdvCheckbox v-model="disabled" label="Disable the set" />
    </div>
    <MdvChipSet v-model="selected" selection="multiple" label="Browse topics" :scrollable="scrollable" :disabled="disabled">
      <MdvChip v-for="topic in topics" :key="topic" variant="filter" :value="topic" :label="topic" />
    </MdvChipSet>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Topics: {{ JSON.stringify(selected) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

`disabled` on the set disables all primary/removal actions; a chip's own `disabled` affects only that chip. Disabled links remove `href`, expose `aria-disabled`, leave the Tab order, and block activation. Keep labels short; narrow chips truncate visually while retaining the complete text in the DOM.

---

## Form composition

Chip and ChipSet do not create hidden form fields, native required validation, or form-reset behavior. Use the model directly in your request, or add explicit fields and an application reset handler for a native form.

<DemoBlock>
  <ChipFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvButton, MdvChip, MdvChipSet } from '@mdv-ui/mdv'
import type { MdvChipSetModelValue } from '@mdv-ui/mdv'

const topics = ref<MdvChipSetModelValue>(['design'])
const values = computed(() => Array.isArray(topics.value) ? topics.value : [])
const result = ref('Selected chips are submitted through explicit hidden inputs.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ topic: data.getAll('topic') })
}

function reset() {
  topics.value = ['design']
  result.value = 'Form reset by the application.'
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="reset">
    <MdvChipSet v-model="topics" selection="multiple" label="Newsletter topics">
      <MdvChip variant="filter" value="design" label="Design" />
      <MdvChip variant="filter" value="engineering" label="Engineering" />
      <MdvChip variant="filter" value="research" label="Research" />
    </MdvChipSet>
    <input v-for="value in values" :key="value" type="hidden" name="topic" :value="value" />
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

This example submits repeated `topic` fields and resets the model explicitly. If the set can be disabled, also disable your submitted fields when that matches the form's policy. ChipSet's `name` attribute alone does not serialize its model.

## Keyboard and accessibility

- ChipSet is a horizontal `toolbar`, not a listbox or radio group. Give it a `label`, `#label`, `aria-label`, or `aria-labelledby`.
- Tab enters one remembered action, initially preferring a selected chip. Left/Right move through primary and removal actions in DOM order, skipping unavailable targets; navigation wraps and mirrors in RTL. Home/End go to the first/last available action. Moving focus does not change selection.
- Enter/Space activate native buttons; links retain native Enter behavior. Standalone chips use ordinary native Tab order for their separate actions. Selected toggles expose `aria-pressed`.
- After removal, the group focuses a following available chip, or a preceding one at the end; an empty group receives focus. If application code already moved focus elsewhere, that decision is respected.

Chips do not implement text entry, a tag editor, menus, loading, error validation, or drag sorting. Compose those application behaviors explicitly.

---

## API

### MdvChip props

<ApiTable :items="chipProps" />

### MdvChip slots

<SlotsTable :items="chipSlots" />

### MdvChipSet props

<ApiTable :items="setProps" />

### MdvChipSet slots

<SlotsTable :items="setSlots" />

### Events and methods

<DocsTable label="Chip and ChipSet events" min-width="34rem">

| Component | Event | Payload |
| --- | --- | --- |
| Chip | `update:selected` | `boolean`; independent Filter/Input selection request. |
| Chip | `remove` | Original `MouseEvent` or `KeyboardEvent`; application removal request. |
| ChipSet | `update:modelValue` | `MdvChipSetModelValue`; accepted-parent selection request. |
| Chip | Native primary `click` and keyboard/pointer events | Original event on the primary button/link. Removal uses its own event above. |

</DocsTable>

Both components expose `focus(options?: FocusOptions)` and `blur()`. Chip focuses its primary action; ChipSet focuses its remembered available action or the group when empty. `blur()` only removes focus owned by that chip/set.

### Native attributes and public types

On Chip, `class`, `style`, `dir`, `lang`, and `hidden` apply to the outer wrapper; `id`, ARIA, `data-*`, and native primary listeners apply to the button/link. A two-action chip's remove control is managed through `remove` and `remove-label`. ChipSet attributes and listeners apply to its toolbar container.

```ts
import type {
  MdvChipVariant,
  MdvChipColor,
  MdvChipValue,
  MdvChipSetSelection,
  MdvChipSetModelValue,
} from '@mdv-ui/mdv'
```

`MdvChipValue` is `string | number`; `MdvChipSetModelValue` is that value, an array of values, or `null`. The current package does not export separate Chip/ChipSet prop interfaces.
