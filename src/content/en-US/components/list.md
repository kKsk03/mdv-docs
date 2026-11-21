<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ListVariantDemo from '@/components/docs/demos/list/variant.vue'
import ListContentDemo from '@/components/docs/demos/list/content.vue'
import ListSelectionDemo from '@/components/docs/demos/list/selection.vue'
import ListActionsDemo from '@/components/docs/demos/list/actions.vue'

const listProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvListModelValue', default: 'null', description: 'Single value or null for single selection; an array for multiple selection. Changes require parent acceptance. Ignored by selection-mode=none.' },
  { name: 'variant', type: "'expressive' | 'baseline'", default: "'expressive'", description: 'Visual treatment and interaction corner behavior.' },
  { name: 'layout', type: "'standard' | 'segmented'", default: "'standard' (resolved)", description: 'Explicit layout takes priority over the segmented shorthand.' },
  { name: 'segmented', type: 'boolean', default: 'false', description: 'Shorthand for the segmented layout when layout is omitted.' },
  { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Chooses an ordinary list or a controlled listbox. Selectable rows need unique values and cannot be links.' },
  { name: 'dividers', type: "'none' | 'full-width' | 'inset'", default: "'none'", description: 'Separators between adjacent standard rows. Segmented layout uses gaps instead.' },
  { name: 'lines', type: '1 | 2 | 3', description: 'Default row line count when the item does not override it. Omit to let each item infer its count from content.' },
]
const itemProps: ApiTableItem[] = [
  { name: 'lines', type: '1 | 2 | 3', description: 'Overrides the list line count. Otherwise inherits it or infers a count from overline, headline/content, and supporting text.' },
  { name: 'overline', type: 'string', default: "''", description: 'Short text above the headline; the overline slot takes priority.' },
  { name: 'headline', type: 'string', default: "''", description: 'Main text and the default accessible name for interactive rows. The default slot takes priority.' },
  { name: 'supportingText', type: 'string', default: "''", description: 'Supporting text below the headline. Automatically contributes to an interactive row description unless content replaces the column.' },
  { name: 'trailingText', type: 'string', default: "''", description: 'Short trailing text, also compatible with a trailing icon or display control.' },
  { name: 'value', type: 'string | number', description: 'Unique list selection value. On a nonselectable native button, also supplies its native value.' },
  { name: 'selected', type: 'boolean', default: 'false', description: 'Presentation state outside list selection. A selectable row derives its state from the parent model instead.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables row activation and excludes its primary action from Tab. Bind the action-slot disabled parameter to independent controls too.' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Makes the primary action a native button when the row is neither an option nor a link. Activation listeners also enable button semantics.' },
  { name: 'href', type: 'string', description: 'Creates a native anchor, including an empty string. Link rows do not participate in list selection.' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Type of an interactive native button. Setting type alone does not make a static row interactive.' },
  { name: 'icon', type: 'MdvIconData', description: 'Local leading icon data. Inferred before avatarName or image when leading is omitted.' },
  { name: 'leading', type: 'MdvListLeading', description: 'Explicit icon, avatar, image, checkbox, radio, or switch presentation. Overrides automatic inference.' },
  { name: 'avatarName', type: 'string', description: 'Uses the first trimmed Unicode character as an uppercase avatar initial. With an avatar image, the image is shown instead.' },
  { name: 'image', type: 'string', description: 'Leading image URL. Use leading=avatar for a round avatar image; otherwise inferred after icon and avatarName.' },
  { name: 'trailingIcon', type: 'MdvIconData', description: 'Local trailing icon data. Used for automatic trailing inference before trailingText.' },
  { name: 'trailing', type: 'MdvListTrailing', description: 'Explicit icon, text, checkbox, radio, or switch presentation.' },
  { name: 'leadingValue', type: 'boolean', default: 'selected (resolved)', description: 'Overrides only the visual leading selection indicator. Omit to follow the row selection.' },
  { name: 'trailingValue', type: 'boolean', default: 'selected (resolved)', description: 'Overrides only the visual trailing selection indicator. Does not update the list model.' },
]
const subheaderProps: ApiTableItem[] = [
  { name: 'inset', type: 'boolean', default: 'false', description: 'Uses a 56px leading inset to align with text after a standard leading icon. Default leading padding is 16px.' },
]
const listSlots: SlotTableItem[] = [
  { name: 'default', description: 'List rows and presentational subheaders. No slot parameters.' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: 'Replaces the headline. Receives { selected, disabled }.' },
  { name: 'overline', description: 'Replaces the overline text. Receives { selected, disabled }.' },
  { name: 'supporting', description: 'Replaces supporting text. Receives { selected, disabled }.' },
  { name: 'content', description: 'Replaces the complete text column. Receives MdvListItemContentProps plus { selected, disabled }; keep this content noninteractive.' },
  { name: 'leading', description: 'Replaces decorative leading content. Receives { selected, disabled }.' },
  { name: 'trailing', description: 'Replaces decorative trailing content. Receives { selected, disabled }.' },
  { name: 'leading-action', description: 'Independent leading controls, outside the primary action. Receives { selected, disabled }; bind disabled to the control.' },
  { name: 'trailing-action', description: 'Independent trailing controls, outside the primary action. Receives { selected, disabled }; bind disabled to the control.' },
]
const subheaderSlots: SlotTableItem[] = [
  { name: 'default', description: 'Visible subheader text. No slot parameters.' },
]
</script>
# List

Use `MdvList` and `MdvListItem` to display related rows, actions, or selectable options.

## Variants and layouts

Use `variant` for Expressive or Baseline appearance and `layout` for Standard or Segmented rows.

<DemoBlock>
  <ListVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const examples = [
  { id: 'expressive-standard', variant: 'expressive', layout: 'standard' },
  { id: 'expressive-segmented', variant: 'expressive', layout: 'segmented' },
  { id: 'baseline-standard', variant: 'baseline', layout: 'standard' },
  { id: 'baseline-segmented', variant: 'baseline', layout: 'segmented' },
] as const
const selected = ref<Record<string, MdvListModelValue>>(Object.fromEntries(examples.map(example => [example.id, 'projects'])))
const destinations = ['workspace', 'projects', 'archive']
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <div v-for="example in examples" :key="example.id" class="min-w-0 rounded-xl bg-mdv-surface-container-lowest p-2">
      <p class="px-3 py-2 text-sm font-medium">{{ example.variant }} · {{ example.layout }}</p>
      <MdvList v-model="selected[example.id]" :variant="example.variant" :layout="example.layout" selection-mode="single" :aria-label="example.id">
        <MdvListItem v-for="destination in destinations" :key="destination" :value="destination" :headline="destination" :icon="folderIcon" />
      </MdvList>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Row content

Use the row’s content props or slots for a headline, supporting text, icons, and other content. Set `lines` to override the inferred line count.

<DemoBlock>
  <ListContentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvListDivider } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const dividers = ref<MdvListDivider>('inset')
const options = ['none', 'full-width', 'inset'].map(value => ({ value, label: value }))
const image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"%3E%3Cpath fill="%23d0bcff" d="M0 0h56v56H0z"/%3E%3Cpath fill="%234f378b" d="m0 48 18-26 13 14 10-11 15 23z"/%3E%3C/svg%3E'
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="dividers" :options="options" label="Row dividers" @update:model-value="dividers = $event as MdvListDivider" />
    <MdvList :dividers="dividers" :lines="1" aria-label="List content examples">
      <MdvListItem headline="Workspace files" :icon="folderIcon" trailing-text="12" />
      <MdvListItem :lines="2" headline="Alex Morgan" supporting-text="Shared a document with you" avatar-name="Alex Morgan" trailing-text="Now" />
      <MdvListItem :lines="3" overline="ARCHIVE" headline="Quarterly report" supporting-text="A thumbnail, overline, headline, and supporting text." :image="image" />
      <MdvListItem :lines="2" headline="Workspace export" supporting-text="Custom content keeps the row's normal geometry." :icon="folderIcon">
        <template #content="{ headline, supportingText }">
          <span class="block font-medium">{{ headline }}</span>
          <span class="block text-sm text-mdv-on-surface-variant">{{ supportingText }}</span>
        </template>
      </MdvListItem>
    </MdvList>
  </div>
</template>
```

  </template>
</DemoBlock>

## Single and multiple selection

Give each selectable item a unique `value` and name the listbox. Bind a single value or `null` for single selection, and an array for multiple selection.

<DemoBlock>
  <ListSelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'

const single = ref<MdvListModelValue>('profile')
const multiple = ref<MdvListModelValue>(['updates'])
</script>

<template>
  <div class="grid gap-6">
    <div class="grid gap-3">
      <MdvList v-model="single" selection-mode="single" aria-label="Account preference">
        <MdvListItem value="profile" headline="Profile" leading="radio" />
        <MdvListItem value="locked" headline="Unavailable setting" leading="radio" disabled />
        <MdvListItem :value="1" headline="Numeric value 1" leading="radio" />
        <MdvListItem value="1" headline="Text value 1" leading="radio" />
      </MdvList>
      <p class="text-sm text-mdv-on-surface-variant" role="status">Single: {{ typeof single }} {{ JSON.stringify(single) }}</p>
    </div>
    <div class="grid gap-3">
      <MdvList v-model="multiple" selection-mode="multiple" layout="segmented" aria-label="Notification categories">
        <MdvListItem value="updates" headline="Product updates" trailing="checkbox" />
        <MdvListItem value="security" headline="Security alerts" trailing="checkbox" />
        <MdvListItem value="billing" headline="Billing messages" trailing="checkbox" />
      </MdvList>
      <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Multiple: {{ JSON.stringify(multiple) }}</p>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Independent actions

Use `leading-action` or `trailing-action` for independent controls, rather than nesting a button inside the row’s primary action.

<DemoBlock>
  <ListActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvList, MdvListItem, MdvSwitch } from '@mdv-ui/mdv'
import moreIcon from '@iconify-icons/material-symbols/more-vert'
import syncIcon from '@iconify-icons/material-symbols/sync'

const disabled = ref(false)
const saved = ref(false)
const sync = ref(true)
const opens = ref(0)
const more = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disabled" label="Disable action rows" />
    <MdvList layout="segmented" aria-label="Workspace actions">
      <MdvListItem interactive headline="Project details" supporting-text="Open the project from its main action." :selected="saved" :disabled="disabled" @click="opens++">
        <template #leading-action="{ disabled: rowDisabled }"><MdvCheckbox v-model="saved" :disabled="rowDisabled" aria-label="Save project" /></template>
        <template #trailing-action="{ disabled: rowDisabled }">
          <MdvIconButton variant="standard" :disabled="rowDisabled" aria-label="More project actions" @click="more++"><MdvIcon :icon="moreIcon" /></MdvIconButton>
        </template>
      </MdvListItem>
      <MdvListItem headline="Background sync" supporting-text="The switch is an independent action." :icon="syncIcon" :disabled="disabled">
        <template #trailing-action="{ disabled: rowDisabled }"><MdvSwitch v-model="sync" :disabled="rowDisabled" aria-label="Enable background sync" /></template>
      </MdvListItem>
      <MdvListItem href="https://m3.material.io/components/lists/overview" target="_blank" rel="noopener noreferrer" headline="Read the list design guide" :disabled="disabled" />
      <MdvListItem headline="Workspace is up to date" trailing-text="Read only" />
    </MdvList>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Project opens: {{ opens }} · Saved: {{ saved }} · Sync: {{ sync }} · More: {{ more }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Section headings

Use `MdvListSubheader` to label sections. Preserve item identity with stable Vue keys when items are reordered.

---

## API

### MdvList

<ApiTable :items="listProps" />

<SlotsTable :items="listSlots" />

<DocsTable label="List model event" min-width="30rem">

| Event | Payload |
| --- | --- |
| `update:modelValue` | Requested scalar in single mode or a fresh value array in multiple mode. No request for disabled or cancelled activation. |

</DocsTable>

`focus(options?: FocusOptions)` focuses the current/selected available option, or an available primary action in an ordinary list. `blur()` blurs a focused descendant. Static content does not become focusable. Native attributes and listeners apply to the root `ul`; MDV manages `role="list"`/`"listbox"` and `aria-multiselectable`.

### MdvListItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

The item exposes `focus(options?: FocusOptions)` and `blur()`. Disabled rows ignore `focus()`. There are no custom component events; native activation listeners apply to the primary action. Use the parent List model for selection changes.

For interactive items, `class`, `style`, `dir`, `lang`, `hidden`, and `inert` apply to the outer `li`. Other native attributes, IDs, ARIA, and listeners reach its button, anchor, or option. Static rows receive attributes on the `li`. MDV manages the resulting roles, disabled state, and selection attributes.

The headline supplies the primary action's name and supporting text contributes to `aria-describedby`. Explicit ARIA names take priority. Custom `content` keeps a naming container but does not automatically create a separate supporting description; supply explicit references when needed. Decorative indicators have no separate change events or methods.

### MdvListSubheader

<ApiTable :items="subheaderProps" />

<SlotsTable :items="subheaderSlots" />

Native attributes and listeners reach the presentational `li`. There are no custom events, models, or exposed methods. It does not implement sticky positioning or expansion.

### Public types and scope

```ts
import type {
  MdvListVariant,
  MdvListLayout,
  MdvListSelectionMode,
  MdvListDivider,
  MdvListValue,
  MdvListModelValue,
  MdvListLeading,
  MdvListTrailing,
  MdvListItemSlotProps,
  MdvListItemContentProps,
} from '@mdv-ui/mdv'
```

`MdvListValue` is `string | number`; the model is a value, value array, or `null`. MDV does not export separate List, ListItem, or ListSubheader props interfaces. Expandable trees, drag sorting, swipe actions, virtualization, and sticky subheaders are outside this component's current scope.
