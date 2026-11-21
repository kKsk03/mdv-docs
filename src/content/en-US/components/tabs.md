<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import AppearanceDemo from '@/components/docs/demos/tabs/appearance.vue'
import KeyboardDemo from '@/components/docs/demos/tabs/keyboard.vue'
import PanelsDemo from '@/components/docs/demos/tabs/panels.vue'

const tabsProps: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'MdvTabValue', description: 'Selected value. Omit the prop for internal selection of the first available tab.' },
  { name: 'variant', type: 'MdvTabsVariant', default: "'primary'", description: "'primary' or 'secondary'." },
  { name: 'scrollable', type: 'boolean', default: 'false', description: 'Uses natural tab widths in a horizontally scrollable strip instead of equal-width tabs.' },
  { name: 'showDivider', type: 'boolean', default: 'true', description: 'Shows the baseline under the tab strip.' },
  { name: 'iconPosition', type: 'MdvTabsIconPosition', description: "'top' or 'leading'; defaults to 'top' for primary and 'leading' for secondary." },
  { name: 'activation', type: 'MdvTabsActivation', default: "'manual'", description: "'manual' separates focus from selection; 'automatic' requests selection on focus." },
  { name: 'tabNavigation', type: 'MdvTabsTabNavigation', default: "'all'", description: "'all' includes each available tab in the Tab order; 'active' uses a single entry." },
  { name: 'swipeable', type: 'boolean', default: 'false', description: 'Enables touch swipes across non-interactive panel content to request an adjacent available tab.' },
]
const tabProps: ApiTableItem[] = [
  { name: 'value', type: 'MdvTabValue', description: 'Required. Unique within the group; must match the panel value and type.' },
  { name: 'label', type: 'string', default: "''", description: 'Visible text when no default slot is supplied.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Excludes the tab from activation and group keyboard movement.' },
]
const panelProps: ApiTableItem[] = [
  { name: 'value', type: 'MdvTabValue', description: 'Required. Matches the tab value and type.' },
  { name: 'lazy', type: 'boolean', default: 'false', description: 'Mounts the slot on first selection and retains it afterward.' },
  { name: 'destroyOnHide', type: 'boolean', default: 'false', description: 'Mounts the slot only while active, taking precedence over lazy retention.' },
]
const tabsSlots: SlotTableItem[] = [
  { name: 'default', description: 'Place the MdvTab controls here.' },
  { name: 'panels', description: 'Place the matching MdvTabPanel elements here.' },
]
const tabSlots: SlotTableItem[] = [
  { name: 'default', description: 'Visible label override. Receives { active: boolean }.' },
  { name: 'icon', description: 'Decorative icon. Receives { active: boolean }.' },
  { name: 'badge', description: 'Optional badge, such as MdvBadge. Receives { active: boolean }.' },
]
const panelSlots: SlotTableItem[] = [
  { name: 'default', description: 'Panel content. Receives { active: boolean }.' },
]
</script>
# Tabs

Use `MdvTabs` to switch between related views on one page. Put `MdvTab` in the default slot and `MdvTabPanel` in `#panels`.

## Primary and secondary tabs

Give each tab and its panel the same `value`. Use `variant="primary"` for main views or `secondary` for subdivisions within a view.

<DemoBlock>
  <AppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import history from '@iconify-icons/material-symbols/history'
import overview from '@iconify-icons/material-symbols/space-dashboard-outline'
import { ref } from 'vue'
import { MdvBadge, MdvIcon, MdvSwitch, MdvTab, MdvTabPanel, MdvTabs } from '@mdv-ui/mdv'
import type { MdvTabValue } from '@mdv-ui/mdv'

const selected = ref<MdvTabValue>('overview')
const secondary = ref(false)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSwitch v-model="secondary" label="Use secondary tabs" />
    <MdvTabs
      v-model="selected"
      :variant="secondary ? 'secondary' : 'primary'"
      aria-label="Project views"
    >
      <MdvTab value="overview" label="Overview">
        <template #icon><MdvIcon :icon="overview" /></template>
      </MdvTab>
      <MdvTab value="activity" label="Activity" aria-label="Activity, 3 unread updates">
        <template #icon><MdvIcon :icon="history" /></template>
        <template #badge><MdvBadge variant="large" :content="3" aria-hidden="true" /></template>
      </MdvTab>
      <template #panels>
        <MdvTabPanel value="overview" class="p-3">Project status and milestones.</MdvTabPanel>
        <MdvTabPanel value="activity" class="p-3">Recent changes to the project.</MdvTabPanel>
      </template>
    </MdvTabs>
  </div>
</template>
```

  </template>
</DemoBlock>

## Keyboard selection

Set `tab-navigation="active"` for a single Tab stop. Arrow keys move focus; with `activation="manual"`, press Enter or Space to select.

<DemoBlock>
  <KeyboardDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvSwitch, MdvTab, MdvTabPanel, MdvTabs } from '@mdv-ui/mdv'
import type { MdvTabValue } from '@mdv-ui/mdv'

const selected = ref<MdvTabValue>('summary')
const automatic = ref(false)
const lock = ref(false)
const result = ref('No selection request yet.')

function request(value: MdvTabValue) {
  if (lock.value) {
    result.value = `Rejected: ${value}.`
    return
  }
  selected.value = value
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvSwitch v-model="automatic" label="Select on focus" />
    <MdvSwitch v-model="lock" label="Keep the current panel" />
    <MdvTabs
      :model-value="selected"
      :activation="automatic ? 'automatic' : 'manual'"
      tab-navigation="active"
      aria-label="Report sections"
      @update:model-value="request"
      @change="result = `Accepted: ${$event}.`"
    >
      <MdvTab value="summary" label="Summary" />
      <MdvTab value="archive" label="Archive" disabled />
      <MdvTab value="details" label="Details" />
      <template #panels>
        <MdvTabPanel value="summary" class="p-3">Key facts at a glance.</MdvTabPanel>
        <MdvTabPanel value="archive" class="p-3">Archived reports are unavailable.</MdvTabPanel>
        <MdvTabPanel value="details" class="p-3">Additional figures and notes.</MdvTabPanel>
      </template>
    </MdvTabs>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Scrolling and panel content

Use `scrollable` when tabs need more room. On `MdvTabPanel`, use `lazy` to mount content when first shown or `destroy-on-hide` to unmount it each time it is hidden.

<DemoBlock>
  <PanelsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvTab, MdvTabPanel, MdvTabs, MdvTextField } from '@mdv-ui/mdv'
import type { MdvTabValue } from '@mdv-ui/mdv'

const selected = ref<MdvTabValue>('retained')
</script>

<template>
  <MdvTabs
    v-model="selected"
    class="min-w-0 max-w-md"
    scrollable
    swipeable
    aria-label="Draft workspace"
  >
    <MdvTab value="retained" label="Retained draft" />
    <MdvTab value="lazy" label="First-visit draft" />
    <MdvTab value="reset" label="Reset on return" />
    <MdvTab value="notes" label="Review and release notes" />
    <template #panels>
      <MdvTabPanel value="retained" class="space-y-3 p-3">
        <p>This field stays mounted when the panel is hidden.</p>
        <MdvTextField label="Retained draft" full-width />
      </MdvTabPanel>
      <MdvTabPanel value="lazy" class="space-y-3 p-3" lazy>
        <p>This field mounts on your first visit and keeps its draft afterward.</p>
        <MdvTextField label="First-visit draft" full-width />
      </MdvTabPanel>
      <MdvTabPanel value="reset" class="space-y-3 p-3" destroy-on-hide>
        <p>This field starts fresh each time you return.</p>
        <MdvTextField label="Temporary draft" full-width />
      </MdvTabPanel>
      <MdvTabPanel value="notes" class="p-3">
        On a touch screen, swipe across this text to go back to the previous panel.
      </MdvTabPanel>
    </template>
  </MdvTabs>
</template>
```

  </template>
</DemoBlock>

---

## API

### MdvTabs

<ApiTable :items="tabsProps" />
<SlotsTable :items="tabsSlots" />

The `focus(value?: MdvTabValue)` method focuses a specified available tab, or the current or first available tab when omitted. Automatic activation still applies to ordinary focus. `aria-label`, `aria-labelledby`, and `aria-describedby` go to the actual tablist. Other wrapper attributes such as `id`, `class`, `style`, and `dir`, and native listeners go on the group root.

### MdvTab

<ApiTable :items="tabProps" />
<SlotsTable :items="tabSlots" />

The tab is a `type="button"` and does not submit a form. It exposes `focus(options?: FocusOptions)` and `blur()`. A caller-supplied ID labels its panel; the group manages role, tab order, `aria-selected`, and `aria-controls`. Preventing a native `click` cancels that click selection; preventing `keydown` cancels built-in arrow/Home/End handling. Automatic selection on focus is separate from click.

### MdvTabPanel

<ApiTable :items="panelProps" />
<SlotsTable :items="panelSlots" />

The group owns the panel's `id`, `role`, `aria-labelledby`, `hidden`, and `inert` attributes. Other native attributes are forwarded. The panel defaults to `tabindex="0"`; use `tabindex="-1"` when an extra Tab stop is not useful. Set layout and padding on the panel or its content; the component does not fix the height.

### Public types

```ts
import type {
  MdvTabValue,
  MdvTabsVariant,
  MdvTabsIconPosition,
  MdvTabsActivation,
  MdvTabsTabNavigation,
  MdvTabsProps,
  MdvTabProps,
  MdvTabPanelProps,
  MdvTabSlotProps,
} from '@mdv-ui/mdv'
```
