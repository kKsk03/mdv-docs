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

const chipProps: ApiTableItem[] = [
  { name: 'variant', type: "'assist' | 'filter' | 'input' | 'suggestion'", default: "'assist'", description: 'Chip purpose. Filter selects by default; Input represents entered content and is removable by default.' },
  { name: 'label', type: 'string', default: "''", description: 'Visible chip text. The default slot replaces it.' },
  { name: 'elevated', type: 'boolean', default: 'false', description: 'Raised appearance for Assist, Filter, and Suggestion. Ignored by Input.' },
  { name: 'color', type: 'MdvChipColor', description: 'Primary, secondary, tertiary, success, warning, error, info, or a #RGB/#RRGGBB seed. Omitted preserves the default variant color roles.' },
  { name: 'value', type: 'string | number', description: 'Unique Filter value for a single/multiple selection ChipSet.' },
  { name: 'selected', attribute: 'v-model:selected', type: 'boolean', default: 'Internal false when omitted', description: 'Filter/Input selected state. Supplied values are controlled; omit this when ChipSet owns Filter selection.' },
  { name: 'selectable', type: 'boolean', default: 'filter: true; input: false', description: 'Allows the primary action to toggle Filter/Input selection. Assist/Suggestion never select; removeOnly disables selection.' },
  { name: 'removable', type: 'boolean', default: 'input: true; filter: false', description: 'Enables removal for Filter/Input. Assist/Suggestion do not have removal actions.' },
  { name: 'removeOnly', type: 'boolean', default: 'false', description: 'Makes a removable Input chip one removal action with one focus target; no separate primary operation or selected state.' },
  { name: 'removeLabel', type: 'string', description: 'Accessible name of the removal action. The component leaves the removal name unset when omitted.' },
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
  { name: 'default', description: 'Custom visible label. Receives { selected }. Use removeLabel to name the removal action separately.' },
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

Use `MdvChip` for compact actions, filters, suggestions, or tags. Use `MdvChipSet` to group related chips.

## Variants

Use Assist for an action, Filter for a criterion, Input for entered content, or Suggestion for a proposed response.

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

## Group selection

Set the ChipSet’s `selection` to `single` or `multiple`, bind `v-model`, and give each selectable Filter a unique `value`. Supply a label for the group.

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

## Removing entered content

Handle `remove` by removing the item from your data. Use stable Vue keys so the group can move focus to another item.

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

## Appearance and colors

Use `elevated` where the variant supports it, or set `color` to a theme role or a hexadecimal seed.

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

## Wrapping and scrolling

ChipSet wraps by default. Set `scrollable` to keep a single horizontal row.

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

## Form composition

ChipSet does not submit a form value automatically. Submit its model yourself or add named form inputs.

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
