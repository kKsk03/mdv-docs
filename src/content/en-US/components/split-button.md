<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import MenuDemo from '@/components/docs/demos/splitButton/menu.vue'
import VariantsDemo from '@/components/docs/demos/splitButton/variants.vue'
import StateDemo from '@/components/docs/demos/splitButton/state.vue'

const splitButtonProps: ApiTableItem[] = [
  { name: 'variant', type: 'MdvSplitButtonVariant', default: "'filled'", description: "'filled', 'tonal', 'outlined', or 'elevated'." },
  { name: 'size', type: 'MdvButtonSize', default: "'s'", description: "One of 'xs', 's', 'm', 'l', or 'xl'." },
  { name: 'color', type: 'MdvButtonColor', description: 'Theme/semantic color or a #RGB/#RRGGBB seed color.' },
  { name: 'expanded', type: 'boolean', default: 'false', description: 'Accepted menu-open state used for arrow, shape, and aria-expanded. The component does not toggle it itself.' },
  { name: 'menuButtonLabel', type: 'string', description: 'Required accessible name describing the related choices, such as “More save options”.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables both the primary action and menu button.' },
  { name: 'actionDisabled / menuDisabled', type: 'boolean', default: 'false', description: 'Disables only the corresponding half.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Shows progress in the primary action; does not disable the menu side.' },
  { name: 'loadingText', type: 'string', description: 'Temporary accessible/visible primary-action label while loading.' },
  { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Uses the default slot as the primary icon; name the primary action through actionAttrs.' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native type of the primary button. The menu half remains type button.' },
  { name: 'href', type: 'string', description: 'Renders the primary action as a native link.' },
  { name: 'hoverShadow / fullWidth', type: 'boolean', default: 'false', description: 'Enables hover shadow or fills the available width.' },
  { name: 'actionAttrs', type: 'MdvSplitButtonActionAttrs', description: 'Native attributes, ARIA, ref-compatible values, and listeners for the primary control.' },
  { name: 'menuButtonAttrs', type: 'MdvSplitButtonMenuAttrs', description: 'Native attributes/listeners and a function or Vue ref for the menu control; accepts MdvMenu triggerProps.' },
]
const splitButtonSlots: SlotTableItem[] = [
  { name: 'default', description: 'Primary action label, or the icon when iconOnly is true.' },
  { name: 'leading / trailing', description: 'Decorative icons beside the primary label; hidden while loading.' },
]
</script>

# Split Button

`MdvSplitButton` combines one primary action with a separate menu trigger for related alternatives. It does not own the menu or its selection model. This page describes **MDV 0.1.5**; use the ordinary Button when there is no meaningful set of related secondary actions.

## Compose with MdvMenu

Use the Menu trigger slot's complete `triggerProps` on `menu-button-attrs`, and bind the slot's accepted `open` boolean to `expanded`. The primary click remains independent from the menu. Menu keyboard navigation, dismissal, selection, and focus return stay owned by `MdvMenu`.

<DemoBlock>
  <MenuDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvMenu, MdvMenuItem, MdvSplitButton } from '@mdv-ui/mdv'

const result = ref('Choose a primary action or open related options.')
function save() { result.value = 'The document was saved.' }
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps, open }">
        <MdvSplitButton :expanded="open" :menu-button-attrs="triggerProps" menu-button-label="More save options" @click="save">Save</MdvSplitButton>
      </template>
      <MdvMenuItem label="Save a copy" @select="result = 'A copy was saved.'" />
      <MdvMenuItem label="Export as PDF" @select="result = 'PDF export requested.'" />
    </MdvMenu>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Do not bind `triggerProps` to the split-button group root. Keeping them on the actual trailing button preserves its ID, ref, ARIA relationships, and listeners. When a controlled Menu rejects an open request, `expanded` remains false and the split-button presentation continues to reflect the accepted state.

## Variants, sizes, and independent actions

The component offers four Button appearances and five sizes. The primary and menu halves are separate native controls with independent disabled states. A loading indicator belongs to the primary action and does not disable the menu button.

<DemoBlock>
  <VariantsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvSplitButton } from '@mdv-ui/mdv'
import type { MdvButtonSize, MdvSplitButtonVariant } from '@mdv-ui/mdv'

const variants: MdvSplitButtonVariant[] = ['filled', 'tonal', 'outlined', 'elevated']
const sizes: MdvButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const disabled = ref(true)
const result = ref('Each half has its own action and focus target.')
</script>

<template>
  <div class="grid min-w-0 gap-6">
    <div class="flex flex-wrap items-center gap-3">
      <MdvSplitButton v-for="variant in variants" :key="variant" :variant="variant" :menu-button-label="`More ${variant} actions`" @click="result = `${variant} action`">{{ variant }}</MdvSplitButton>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <MdvSplitButton v-for="size in sizes" :key="size" :size="size" :menu-button-label="`More size ${size} actions`">{{ size }}</MdvSplitButton>
    </div>
    <MdvCheckbox v-model="disabled" label="Disable the example main action" />
    <div class="flex flex-wrap items-center gap-3">
      <MdvSplitButton :action-disabled="disabled" menu-button-label="More available actions" @menu-click="result = 'The menu side remains available.'">Independent action state</MdvSplitButton>
      <MdvSplitButton loading loading-text="Saving" menu-button-label="More save actions">Save</MdvSplitButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Loading, disabled, and focus behavior

Each half is separately reachable in normal Tab order. `focus()` targets the primary control, `focusMenu()` targets the trailing menu button, and `blur()` blurs both. The group itself does not add an extra tab stop. When using `iconOnly`, supply an accessible name through `actionAttrs` and keep `menuButtonLabel` meaningful.

<DemoBlock>
  <StateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvSplitButton } from '@mdv-ui/mdv'

const disabled = ref(false)
const loading = ref(false)
const result = ref('Use the focus controls to move between native actions.')
const splitButton = useTemplateRef<InstanceType<typeof MdvSplitButton>>('splitButton')
function submit() { result.value = 'The native submit action ran.' }
</script>

<template>
  <div class="grid min-w-0 gap-5">
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="outlined" @click="disabled = !disabled">Toggle disabled</MdvButton>
      <MdvButton variant="outlined" @click="loading = !loading">Toggle loading</MdvButton>
      <MdvButton variant="text" @click="splitButton?.focus()">Focus main action</MdvButton>
      <MdvButton variant="text" @click="splitButton?.focusMenu()">Focus menu action</MdvButton>
    </div>
    <MdvSplitButton ref="splitButton" :disabled="disabled" :loading="loading" loading-text="Saving" menu-button-label="More save actions" @click="submit">Save document</MdvSplitButton>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

The primary control is a native button unless `href` or `actionAttrs.href` selects link semantics. The menu side is always a button. Only the primary button uses `type`; neither the group nor menu trigger submits a form. Use `actionAttrs` for primary native form attributes and `menuButtonAttrs` for the secondary button.

## API

### Props

<ApiTable :items="splitButtonProps" />

### Slots

<SlotsTable :items="splitButtonSlots" />

### Events and methods

<DocsTable label="Split Button events">

| Event | Payload | Meaning |
| --- | --- | --- |
| `click` | `MouseEvent` | Primary action activation. |
| `menu-click` | `MouseEvent` | Menu trigger activation; does not independently toggle an external menu. |

</DocsTable>

Synchronous `preventDefault()` in the corresponding event can cancel the subsequent `actionAttrs.onClick` or `menuButtonAttrs.onClick` callback and the native default action. The instance exposes `element`, `actionElement`, `menuButtonElement`, `focus(options?)`, `focusMenu(options?)`, and `blur()`.

`class`, `style`, `dir`, and group-level ARIA apply to the outer `role="group"`. Put control-specific native attributes on the matching attrs prop. MDV-managed disabled state, menu accessible name, and `aria-expanded` take precedence over conflicting values.

### Public types

```ts
import type {
  MdvSplitButtonVariant,
  MdvSplitButtonActionAttrs,
  MdvSplitButtonMenuAttrs,
  MdvSplitButtonProps,
  MdvButtonColor,
  MdvButtonSize,
} from '@mdv-ui/mdv'
```