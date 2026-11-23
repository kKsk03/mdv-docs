<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import MenuAppearanceDemo from '@/components/docs/demos/menu/appearance.vue'
import MenuSelectionDemo from '@/components/docs/demos/menu/selection.vue'
import MenuActionsDemo from '@/components/docs/demos/menu/actions.vue'
import MenuNestedDemo from '@/components/docs/demos/menu/nested.vue'
import MenuContextDemo from '@/components/docs/demos/menu/context.vue'

const menuProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', default: 'undefined', description: 'Open state. Omit for internal state, initially closed. When bound, the parent must accept each update request.' },
  { name: 'variant', type: "'expressive' | 'baseline'", default: "'expressive'", description: 'Visual variant. Baseline always resolves to standard color scheme and layout.' },
  { name: 'colorScheme', type: "'standard' | 'vibrant'", default: "'standard'", description: 'Expressive surface and selection colors. Ignored by Baseline.' },
  { name: 'layout', type: "'standard' | 'grouped'", default: "'standard'", description: 'Grouped Expressive menus display direct MenuGroup children as separate surfaces when space allows; scrolling uses a continuous surface instead.' },
  { name: 'submenuMode', type: "'flyout' | 'push'", default: "'flyout'", description: 'Places child panels beside their parent or at the same location with a Back item. Push is an MDV extension.' },
  { name: 'placement', type: 'MdvMenuPlacement', default: "'bottom-start'", description: 'Preferred root placement. Each of top/bottom/left/right also accepts -start or -end. Available viewport space may flip or shift it.' },
  { name: 'offset', type: 'number', default: '4', description: 'Nonnegative placement gap in CSS pixels. Negative values clamp to 0; nonfinite values fall back to 4.' },
]
const itemProps: ApiTableItem[] = [
  { name: 'label', type: 'string', default: "''", description: 'Visible action label and typeahead text. The default slot replaces its display.' },
  { name: 'supportingText', type: 'string', default: "''", description: 'Additional text, automatically associated through aria-describedby.' },
  { name: 'trailingText', type: 'string', default: "''", description: 'Decorative trailing text, such as a shortcut hint. Does not register a shortcut.' },
  { name: 'value', type: 'string | number', description: 'Selection value for an ordinary, nonlink item in a selection group. Submenu triggers do not participate in selection.' },
  { name: 'icon', type: 'MdvIconData', description: 'Local leading icon data. A selected choice replaces this area with the built-in check.' },
  { name: 'trailingIcon', type: 'MdvIconData', description: 'Local trailing icon data. A children slot takes priority over trailing content.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks action, selection, and link activation while retaining arrow-key focusability.' },
  { name: 'href', type: 'string', description: 'Creates a native anchor, unless children supplies a submenu. Disabled links omit href.' },
  { name: 'keepOpen', type: 'boolean', default: 'undefined', description: 'Overrides automatic dismissal. Resolved default: true for multiple choices; false for actions, links, and single choices.' },
]
const groupProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvMenuModelValue', default: 'undefined', description: 'Selection state, independent of root open state. Omit for internal state: null for single/none, [] for multiple.' },
  { name: 'selectionMode', type: "'none' | 'single' | 'multiple'", default: "'none'", description: 'Action group, radio-style choice, or checkbox-style choices. Selectable items require a value.' },
  { name: 'label', type: 'string', default: "''", description: 'Visible group heading and accessible group name. The label slot replaces the heading.' },
]
const menuSlots: SlotTableItem[] = [
  { name: 'trigger', description: 'Receives { triggerProps, open, close }. Bind all triggerProps to one native element or a component with one native control root. open is a boolean; close() requests closing.' },
  { name: 'default', description: 'MenuItem, MenuGroup, and Divider content. Receives { open, close }. The panel remains at this DOM location.' },
]
const itemSlots: SlotTableItem[] = [
  { name: 'default', description: 'Replaces label. Receives { selected, disabled, expanded }; keep a clear text name for the action.' },
  { name: 'leading', description: 'Replaces the leading icon when not selected; selected items show the built-in check. Receives item state. Decorative, not a place for an independent control.' },
  { name: 'supporting', description: 'Replaces supportingText while preserving its description ID. Receives item state.' },
  { name: 'trailing', description: 'Replaces trailing text/icon, for example with Badge. Receives item state. Hidden from assistive technology; include important counts in the action name.' },
  { name: 'children', description: 'Nested MenuItem/MenuGroup content. No parameters. The item becomes a submenu trigger, taking priority over href, group selection, and trailing content.' },
]
const groupSlots: SlotTableItem[] = [
  { name: 'default', description: 'Items in this group. No parameters.' },
  { name: 'label', description: 'Replaces the visible heading and retains the group naming association. No parameters.' },
]
</script>
# Menu

Use `MdvMenu` for actions or choices attached to a control. Use `MdvContextMenu` for context-specific actions such as right-click commands.

## Menu trigger

Bind the complete `triggerProps` from `#trigger` to one button. Give an icon-only trigger an accessible name.

<DemoBlock>
  <MenuAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDivider, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'
import undoIcon from '@iconify-icons/material-symbols/undo'
import copyIcon from '@iconify-icons/material-symbols/content-copy-outline'

const appearances = [
  { variant: 'expressive', colorScheme: 'standard' },
  { variant: 'expressive', colorScheme: 'vibrant' },
  { variant: 'baseline', colorScheme: 'standard' },
] as const
const message = ref('Choose a document action.')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvMenu v-for="appearance in appearances" :key="`${appearance.variant}-${appearance.colorScheme}`" v-bind="appearance">
        <template #trigger="{ triggerProps }">
          <MdvButton v-bind="triggerProps" variant="tonal">{{ appearance.variant }} / {{ appearance.colorScheme }}</MdvButton>
        </template>
        <MdvMenuItem label="Undo" :icon="undoIcon" trailing-text="Ctrl+Z" @select="message = 'Undo requested.'" />
        <MdvMenuItem label="Redo" trailing-text="Ctrl+Y" disabled />
        <MdvDivider />
        <MdvMenuItem label="Duplicate document" supporting-text="Keep the original document." :icon="copyIcon" @select="message = 'A duplicate was created locally.'" />
      </MdvMenu>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Selection groups

Use `MdvMenuGroup` for related options. Bind the group’s selection separately from the menu’s open state. Single choice closes by default; multiple choice stays open.

<DemoBlock>
  <MenuSelectionDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuModelValue } from '@mdv-ui/mdv'

const scale = ref<MdvMenuModelValue>(1)
const styles = ref<MdvMenuModelValue>(['bold'])
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu layout="grouped">
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Text preferences</MdvButton></template>
      <MdvMenuGroup v-model="scale" selection-mode="single" label="Display scale">
        <MdvMenuItem :value="1" label="Numeric value 1" />
        <MdvMenuItem value="1" label="Text value 1" />
        <MdvMenuItem :value="2" label="Double scale" />
      </MdvMenuGroup>
      <MdvMenuGroup v-model="styles" selection-mode="multiple" label="Text styles">
        <MdvMenuItem value="bold" label="Bold" />
        <MdvMenuItem value="italic" label="Italic" />
        <MdvMenuItem value="underline" label="Underline" disabled />
      </MdvMenuGroup>
    </MdvMenu>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Scale: {{ typeof scale }} {{ JSON.stringify(scale) }} · Styles: {{ JSON.stringify(styles) }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Actions and links

Use `href` for link items. Call `preventDefault()` in `select` to cancel the selection and its navigation or dismissal. For async decisions, cancel before awaiting.

<DemoBlock>
  <MenuActionsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuSelectEvent } from '@mdv-ui/mdv'

const count = ref(0)
const message = ref('No action has run.')
function cancel(event: MdvMenuSelectEvent) {
  event.preventDefault()
  message.value = 'The action was cancelled; the menu stays open.'
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="outlined">Document actions</MdvButton></template>
      <MdvMenuItem label="Increment preview counter" keep-open @select="count++" />
      <MdvMenuItem label="Cancel this action" @select="cancel" />
      <MdvMenuItem label="Notifications, 3 unread" @select="message = 'Notifications requested.'">
        <template #trailing><MdvBadge variant="large" content="3" /></template>
      </MdvMenuItem>
      <MdvMenuItem label="Read the menu design guide" href="https://m3.material.io/components/menus/overview" target="_blank" rel="noopener noreferrer" />
      <MdvMenuItem label="Unavailable guide" href="https://m3.material.io/" disabled />
      <MdvMenuItem label="Finish" @select="message = 'Finished.'" />
    </MdvMenu>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Counter: {{ count }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Submenus

Place a submenu in the item’s `#children` slot. In compact layouts, `submenu-mode="push"` opens the child menu in place. Its back row uses the parent item’s label or slot text.

<DemoBlock>
  <MenuNestedDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvMenu, MdvMenuGroup, MdvMenuItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvMenuModelValue, MdvMenuSubmenuMode } from '@mdv-ui/mdv'

const mode = ref<MdvMenuSubmenuMode>('flyout')
const rtl = ref(false)
const font = ref<MdvMenuModelValue>('roboto')
const message = ref('Choose a nested action.')
const modes = [{ value: 'flyout', label: 'flyout' }, { value: 'push', label: 'push' }]
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="mode" :options="modes" label="Submenu mode" @update:model-value="mode = $event as MdvMenuSubmenuMode" />
    <MdvCheckbox v-model="rtl" label="Use right-to-left menus" />
    <div :dir="rtl ? 'rtl' : 'ltr'">
      <MdvMenu :submenu-mode="mode" style="width: 240px">
        <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Formatting</MdvButton></template>
        <MdvMenuItem label="Text">
          <template #children>
            <MdvMenuItem label="Font">
              <template #children>
                <MdvMenuGroup v-model="font" selection-mode="single" label="Font family">
                  <MdvMenuItem value="roboto" label="Roboto" />
                  <MdvMenuItem value="system" label="System default" />
                </MdvMenuGroup>
              </template>
            </MdvMenuItem>
            <MdvMenuItem label="Reset formatting" @select="message = 'Formatting reset.'" />
          </template>
        </MdvMenuItem>
        <MdvMenuItem label="Insert table" @select="message = 'Table requested.'" />
      </MdvMenu>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Font: {{ font }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Context menu

Open a context menu with right-click or Shift+F10 on its focusable trigger. Provide a visible alternative for actions that need to be discoverable.

<DemoBlock>
  <MenuContextDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvContextMenu, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'

const message = ref('No context action selected.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvContextMenu>
      <template #trigger="{ triggerProps }">
        <div v-bind="triggerProps" tabindex="0" class="w-full rounded-xl border border-dashed border-mdv-outline bg-mdv-surface-container p-6 text-sm">
          Right-click this document, or focus here and press Shift+F10.
        </div>
      </template>
      <MdvMenuItem label="Inspect document" @select="message = 'Document details requested.'" />
      <MdvMenuItem label="Archive document" @select="message = 'Document archived locally.'" />
    </MdvContextMenu>
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="outlined">Document options</MdvButton></template>
      <MdvMenuItem label="Inspect document" @select="message = 'Document details requested.'" />
      <MdvMenuItem label="Archive document" @select="message = 'Document archived locally.'" />
    </MdvMenu>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### MdvMenu and MdvContextMenu

The two roots share the same props, slots, events, and methods; only trigger behavior differs.

<ApiTable :items="menuProps" />

<SlotsTable :items="menuSlots" />

<DocsTable label="Menu root events" min-width="32rem">

| Event | Payload and timing |
| --- | --- |
| `update:modelValue` | Proposed open boolean |
| `open` / `opened` | No arguments; entering starts / finishes |
| `close` / `closed` | `MdvMenuCloseDetail`; exiting starts / finishes |

</DocsTable>

Close reasons: `escape`, `outside`, `focus-out`, `tab`, `select`, `trigger`, `model`, `programmatic`. Child-panel transitions do not repeat root events.

<DocsTable label="Menu root methods" min-width="32rem">

| Method | Behavior |
| --- | --- |
| `open(edge?: 'first' \| 'last')` | Requests opening, defaulting to the first item; needs a bound trigger |
| `close()` | Requests programmatic closing |
| `toggle()` | Requests the opposite open state |
| `focus(edge?: 'first' \| 'last')` | Focuses an item in the existing root panel; does not open it |

</DocsTable>

These methods return no acceptance promise. Other native attributes, classes, styles, and listeners apply to the root menu panel, not its trigger. Explicit `aria-label`/`aria-labelledby` can replace the automatic trigger naming; bind trigger attributes through its slot.

### MdvMenuItem

<ApiTable :items="itemProps" />

<SlotsTable :items="itemSlots" />

The `select` event carries `MdvMenuSelectEvent`. Exposed methods: `focus()` and `blur()`. Native attributes and listeners reach the actual button/anchor. Actions are `type="button"` and do not submit forms. Links retain `target`, `rel`, and `download`; disabled actions suppress activation listeners. Children take priority over links and selection.

### MdvMenuGroup

<ApiTable :items="groupProps" />

<SlotsTable :items="groupSlots" />

Events: `update:modelValue(value)` and `change(value)`, both carrying `MdvMenuModelValue`. No exposed methods. Other attributes fall through to the `role="group"` wrapper. None mode emits no selection updates. No hidden form fields are generated.

### Public types and limits

```ts
import type {
  MdvMenuProps, MdvMenuVariant, MdvMenuColorScheme, MdvMenuLayout,
  MdvMenuSubmenuMode, MdvMenuPlacement, MdvMenuSelectionMode,
  MdvMenuValue, MdvMenuModelValue, MdvMenuCloseReason, MdvMenuCloseDetail,
  MdvMenuSelectDetail, MdvMenuSelectEvent, MdvMenuSlotProps,
  MdvMenuTriggerProps, MdvMenuTriggerSlotProps, MdvMenuItemSlotProps,
} from '@mdv-ui/mdv'
```

`MdvMenuProps` also types ContextMenu. There are no separately exported ContextMenu, MenuItem, or MenuGroup props interfaces. Menus do not provide form validation, asynchronous action orchestration, a router, global keyboard shortcuts, or a mobile sheet replacement.
