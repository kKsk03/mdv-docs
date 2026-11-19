<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ListVariantDemo from '@/components/docs/demos/list/variant.vue'
import ListContentDemo from '@/components/docs/demos/list/content.vue'
import ListSelectionDemo from '@/components/docs/demos/list/selection.vue'
import ListControlledDemo from '@/components/docs/demos/list/controlled.vue'
import ListActionsDemo from '@/components/docs/demos/list/actions.vue'
import ListGroupsDemo from '@/components/docs/demos/list/groups.vue'
import ListThemeDemo from '@/components/docs/demos/list/theme.vue'
import ListFormDemo from '@/components/docs/demos/list/form.vue'

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

`MdvList` arranges related rows with `MdvListItem` and optional `MdvListSubheader`. An ordinary list can contain static information, native actions, and independent controls. A selection list uses a controlled `listbox` model with one keyboard entry point.

## Variants and layouts

Choose `expressive` or `baseline`, independently of `standard` or `segmented` layout. Expressive is the default. Every example starts with the same selected destination.

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

<DocsTable label="List variant and layout behavior" min-width="35rem">

| Combination | Resting rows | Selected rows | Interaction shape |
| --- | --- | --- | --- |
| Expressive standard | Transparent, 4px corners | `secondary-container`, 16px corners | Hover 8px; focus/pressed 16px |
| Expressive segmented | `surface-container`; 16px group end corners, 4px inner corners | `secondary-container`, 16px corners | Interaction shape overrides resting segment corners |
| Baseline standard | Transparent, 4px corners | `secondary-container` | Fixed corners |
| Baseline segmented | `surface-container`, 4px corners | `secondary-container` | Fixed corners |

</DocsTable>

The expressive selected shape takes priority over hover. Segmented lists use 8px padding and 2px gaps. Subheaders or other non-item nodes break a run of connected segments. Explicit `layout` takes priority over the `segmented` shorthand.

## Content, line counts, and dividers

Use props for common row content, or slots to replace individual areas. An item's `lines` overrides the list default; otherwise the count is inferred from the visible overline, headline/content, and supporting areas.

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

<DocsTable label="List row dimensions" min-width="28rem">

| Content | Default minimum height or size |
| --- | --- |
| One / two / three lines | 56 / 72 / 88px |
| Leading icon / avatar / image | 24 / 40 / 56px |
| Row leading / trailing padding | 16 / 24px |
| Gap between content regions | 16px |

</DocsTable>

These heights are minimums; media and custom content can make a row taller. Three-line content aligns to the top. Headline and overline truncate on one line. Supporting text uses at most two lines in a three-line row without an overline, and one line otherwise.

Standard `full-width` dividers span adjacent rows; `inset` follows the text start after an icon, avatar, or image. Segmented lists use their gaps and suppress these dividers. Built-in images and icons are decorative; use a slot with appropriate naming for meaningful imagery.

## Single and multiple selection

Provide a unique string or number `value` on every selectable row and name the listbox. Single selection accepts a scalar or `null`; multiple selection uses an array.

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

Numeric `1` and string `'1'` are different values because comparisons use `Object.is`. Clicking the selected single option keeps it selected. Multiple selection toggles values using a new array. Disabled options cannot change the model.

The built-in checkbox, radio, and switch presentations are decorative selection indicators. They follow the row's selected state unless `leading-value` or `trailing-value` overrides their appearance. They are not nested inputs, independent actions, or submitted form fields.

Selection keyboard rules:

- Tab enters one option, preferring the selected or current option. Other options use `tabindex="-1"`.
- Arrow keys move focus and wrap; Home/End focus the first/last available option. Moving focus does not select.
- Enter/Space selects the focused option. Disabled, `hidden`, and `inert` rows are skipped.
- Removing or disabling a focused option moves focus to an available row. Applications still own any model cleanup when values are removed.

Link rows and rows without values do not participate in selection. Keep native navigation links and independently interactive rows in an ordinary list.

## Controlled acceptance and cancellation

A selection request changes the visible state only after the parent accepts it. `v-model` handles acceptance directly. The example starts by rejecting requests; cancelling the row click prevents the request itself.

<DemoBlock>
  <ListControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvList, MdvListItem } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'

const selected = ref<MdvListModelValue>('draft')
const accept = ref(false)
const cancelClick = ref(false)
const message = ref('The parent currently rejects selection changes.')

function update(value: MdvListModelValue) {
  message.value = `Requested ${value}: ${accept.value ? 'accepted' : 'rejected'}.`
  if (accept.value) selected.value = value
}

function activate(event: MouseEvent) {
  if (!cancelClick.value) return
  event.preventDefault()
  message.value = 'Click cancelled before the selection request.'
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="accept" label="Accept list selection" />
      <MdvCheckbox v-model="cancelClick" label="Cancel row clicks" />
    </div>
    <MdvList :model-value="selected" selection-mode="single" layout="segmented" aria-label="Review stage" @update:model-value="update">
      <MdvListItem v-for="stage in ['draft', 'review', 'approved']" :key="stage" :value="stage" :headline="stage" trailing="radio" @click="activate" />
    </MdvList>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Selected: {{ selected }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Cancelling the primary action's native `click`, or the default behavior of its selection `keydown`, prevents that selection. `MdvListItem` does not emit its own `update:selected`; selection belongs to the parent List model. Outside selection mode, `selected` is a presentation prop.

## Independent controls and native actions

Put real controls in `#leading-action` or `#trailing-action`. They share the row surface while remaining siblings of its primary action, so they keep their own focus and do not trigger the primary button.

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

Try the save checkbox, main project action, More action, and sync switch separately. Bind the slot's `disabled` parameter to each control to retain native disabled semantics and appearance. Disabling a row also blocks activation from its action areas. Disabled links lose `href`, leave the Tab order, and retain disabled link semantics; re-enabling restores them.

Use an ordinary list for rows with multiple controls. Keep interactive elements out of the headline, content, leading, and trailing display slots. A row with `href` uses a native anchor; `interactive` or activation listeners use a native button; otherwise the content is static. Static information does not add a Tab stop.

## Subheaders, reordering, and focus

Subheaders label visual sections and break segmented runs. `inset` aligns text with a standard leading icon. Stable item keys keep selection and row identity when ordering changes.

<DemoBlock>
  <ListGroupsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvList, MdvListItem, MdvListSubheader } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const list = useTemplateRef<InstanceType<typeof MdvList>>('list')
const selected = ref<MdvListModelValue>('research')
const showSubheader = ref(true)
const projects = ref(['research', 'prototype', 'release'])
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="showSubheader" label="Show the project group label" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="projects = [...projects].reverse()">Reverse project order</MdvButton>
      <MdvButton variant="outlined" @click="list?.focus()">Focus selected row</MdvButton>
    </div>
    <MdvList ref="list" v-model="selected" selection-mode="single" layout="segmented" aria-label="Grouped destinations">
      <MdvListSubheader inset>Workspace</MdvListSubheader>
      <MdvListItem value="inbox" headline="Inbox" :icon="folderIcon" />
      <MdvListItem value="archive" headline="Archive" :icon="folderIcon" />
      <MdvListSubheader v-if="showSubheader" inset>Projects</MdvListSubheader>
      <MdvListItem v-for="project in projects" :key="project" :value="project" :headline="project" :icon="folderIcon" />
    </MdvList>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Selected: {{ selected }}. Reordering preserves each row's value.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Hide the project label to join the segments, reverse the projects, and use Focus selected row to call the List instance's `focus()`. Selection navigation follows current DOM order. The subheader is a presentational `li`, not an expandable group, sticky heading, or extra keyboard stop.

## Native forms

Ordinary interactive rows support native button types, required validation, reset, and submitter attributes. Make the row interactive explicitly; `type` alone does not turn static content into a button.

<DemoBlock>
  <ListFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem, MdvTextField } from '@mdv-ui/mdv'

const name = ref('')
const message = ref('Enter a display name before submitting.')

function submit(event: Event) {
  const submitter = (event as SubmitEvent).submitter as HTMLButtonElement | null
  message.value = `Submitted ${name.value} with intent=${submitter?.value || '(none)'}.`
}
</script>

<template>
  <div class="grid gap-4">
    <form class="grid gap-3" @submit.prevent="submit" @reset="name = ''; message = 'Profile reset.'">
      <MdvTextField v-model="name" label="Display name" name="displayName" required full-width />
      <MdvList aria-label="Profile form actions">
        <MdvListItem interactive type="submit" name="intent" value="save" headline="Submit profile" supporting-text="Uses native required-field validation." />
        <MdvListItem interactive type="reset" headline="Reset profile" />
        <MdvListItem interactive headline="Preview profile" @click="message = `Preview: ${name || '(empty)'}`" />
      </MdvList>
    </form>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Preview profile uses the default `button` type and does not submit. Submit profile supplies `name="intent"` and `value="save"`; the application handles submission. The List selection model itself is not serialized and has no built-in `name`, validation, or reset API. Add form fields explicitly when selection belongs in submitted data.

## Long content, local themes, and direction

The same rows inherit local light/dark scopes, MDV tokens, and logical direction. Long text stays in its content column while trailing content retains its space.

<DemoBlock>
  <ListThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvList, MdvListItem } from '@mdv-ui/mdv'
import notificationsIcon from '@iconify-icons/material-symbols/notifications-outline'

const rtl = ref(false)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="rtl" label="Use right-to-left lists" />
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" :dir="rtl ? 'rtl' : 'ltr'" class="min-w-0 rounded-xl bg-mdv-surface-container-lowest p-2 text-mdv-on-surface">
      <MdvList layout="segmented" :aria-label="`${theme} list preview`">
        <MdvListItem :lines="3" headline="A long notification headline that stays within the row" supporting-text="Supporting text can wrap onto two lines in a three-line row without an overline, while its trailing content keeps its space." :icon="notificationsIcon" trailing-text="Now" />
        <MdvListItem :lines="3" headline="Archive export" supporting-text="ReportArchive2026WithALongUnbrokenSupportingValueToCheckWrapping" avatar-name="Alex Morgan" trailing="checkbox" :trailing-value="true" selected />
      </MdvList>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

The selected row uses `on-secondary-container` text and display icons. Expressive hover, pressed, focus-visible, and selected states retain the shared surface and ripple. Reduced motion minimizes transitions; forced-colors mode uses system colors. This component does not provide a color-seed prop.

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
