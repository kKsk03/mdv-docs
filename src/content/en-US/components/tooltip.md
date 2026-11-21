<script setup lang="ts">
import ApiTable from '@/components/docs/ApiTable.vue'
import DemoBlock from '@/components/docs/DemoBlock.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import PlainDemo from '@/components/docs/demos/tooltip/plain.vue'
import RichDemo from '@/components/docs/demos/tooltip/rich.vue'
import OverlayDemo from '@/components/docs/demos/tooltip/overlay.vue'

const props: ApiTableItem[] = [
  { name: 'modelValue', attribute: 'v-model', type: 'boolean', description: 'Controls whether the tooltip is requested to open. Omit for internal state, initially closed.' },
  { name: 'text', type: 'string', description: 'Fallback body when the default slot is not supplied. The rendered panel needs nonempty text to open.' },
  { name: 'placement', type: 'MdvTooltipPlacement', default: "'top' / 'bottom-start'", description: 'Preferred side and alignment. Plain defaults to top; Rich defaults to bottom-start. The panel can flip or shift to fit.' },
  { name: 'offset', type: 'number', default: '4', description: 'Gap from the trigger in pixels. For an unbounded trigger, use a larger gap if needed.' },
  { name: 'openDelay', type: 'number', default: '600', description: 'Hover delay in milliseconds. Does not affect keyboard focus, the touch long-press threshold, or persistent Rich.' },
  { name: 'closeDelay', type: 'number', description: 'Overrides the delays, in milliseconds, for leaving the hover area and releasing a touch long press. Omit to use the interaction-specific defaults.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the tooltip, not the trigger action. Suppresses the panel and removes the tooltip’s own ARIA relationship.' },
]
const richProps: ApiTableItem[] = [
  { name: 'title', type: 'string', description: 'Optional heading. The title slot takes precedence; the rendered heading names the panel by default.' },
  { name: 'persistent', type: 'boolean', default: 'false', description: 'Uses trigger activation instead of automatic hover, focus, and long-press opening. Remains open on pointer leave.' },
]
const slots: SlotTableItem[] = [
  { name: 'trigger', description: 'Receives { triggerProps, open, close }. Bind the entire triggerProps object to one interactive element or a component that forwards the bindings to it.' },
  { name: 'default', description: 'Overrides text. Use descriptive text only for Plain; Rich can include short paragraphs and inline links.' },
]
const richSlots: SlotTableItem[] = [
  { name: 'title', description: 'Replaces the heading supplied by title.' },
  { name: 'actions', description: 'Optional row of actions. Prefer one or two text buttons; call close() when an action should dismiss the panel.' },
]
</script>
# Tooltip

Use `MdvTooltip` for a short description and `MdvRichTooltip` for contextual help with a title or action. Keep essential instructions visible without the tooltip.

## Plain tooltip

Bind the complete `triggerProps` from `#trigger` to one control. A tooltip describes the trigger; it does not replace the accessible name of an icon button.

<DemoBlock>
  <PlainDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvTooltip } from '@mdv-ui/mdv'
import refreshIcon from '@iconify-icons/material-symbols/refresh'

const noteId = `refresh-note-${useId()}`
const disabled = ref(false)
const count = ref(0)
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <MdvTooltip text="Fetch the latest preview data." :disabled="disabled">
        <template #trigger="{ triggerProps }">
          <MdvIconButton
            v-bind="triggerProps"
            variant="standard"
            aria-label="Refresh preview"
            :aria-describedby="noteId"
            @click="count++"
          >
            <MdvIcon :icon="refreshIcon" />
          </MdvIconButton>
        </template>
      </MdvTooltip>
      <MdvCheckbox v-model="disabled" label="Disable the tooltip" />
    </div>
    <p :id="noteId" class="text-sm text-mdv-on-surface-variant">Refreshing never changes the saved draft.</p>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Refreshes: {{ count }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Rich tooltip

Set `persistent` to let users toggle the panel by activating the trigger. Name the panel with `title` or `aria-label`. Links and buttons inside remain reachable with Tab.

<DemoBlock>
  <RichDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvRichTooltip } from '@mdv-ui/mdv'

const detailsId = `storage-details-${useId()}`
const acknowledged = ref(false)
</script>

<template>
  <div class="grid min-w-0 justify-items-start gap-3">
    <MdvRichTooltip persistent title="Offline access" placement="bottom-start">
      <template #trigger="{ triggerProps }">
        <MdvButton v-bind="triggerProps" variant="outlined">About offline access</MdvButton>
      </template>
      <p>
        Downloads are available without a connection.
        <a :href="`#${detailsId}`" class="text-mdv-primary underline">Storage details</a>
      </p>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="acknowledged = true; close()">Got it</MdvButton>
      </template>
    </MdvRichTooltip>
    <p :id="detailsId" tabindex="-1" class="text-sm text-mdv-on-surface-variant">
      Storage details: downloads stay on this device until removed.
    </p>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ acknowledged ? 'Offline help acknowledged.' : 'Offline help not acknowledged.' }}
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Tooltips in overlays

Temporary tooltips open on hover, focus, or touch long press. Place the tooltip inside its owning overlay. Escape dismisses it before the parent dialog. Display requires browser support for the Popover API.

<DemoBlock>
  <OverlayDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvRichTooltip } from '@mdv-ui/mdv'
import type { MdvTooltipCloseDetail } from '@mdv-ui/mdv'

const dialogOpen = ref(false)
const tooltipOpen = ref(false)
const autoSelected = ref(false)
const lastClose = ref<MdvTooltipCloseDetail['reason'] | null>(null)
</script>

<template>
  <div class="grid min-w-0 justify-items-start gap-3">
    <MdvButton variant="outlined" @click="dialogOpen = true">Open preview settings</MdvButton>
    <MdvDialog v-model="dialogOpen" title="Preview settings">
      <p class="mb-3">Focus or hover over the resolution action for more context.</p>
      <MdvRichTooltip
        v-model="tooltipOpen"
        title="Automatic resolution"
        text="The preview size follows the available space."
        @close="lastClose = $event.reason"
      >
        <template #trigger="{ triggerProps }">
          <MdvButton v-bind="triggerProps" variant="outlined" @click="autoSelected = true">
            Use auto resolution
          </MdvButton>
        </template>
      </MdvRichTooltip>
      <template #actions="{ close }">
        <MdvButton variant="text" autofocus @click="close()">Close settings</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">
      {{ autoSelected ? 'Automatic resolution selected.' : 'Resolution unchanged.' }}
      Last tooltip close: {{ lastClose ?? 'none' }}.
    </p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### Shared props

<ApiTable :items="props" />

### Rich-only props

<ApiTable :items="richProps" />

### Shared slots

<SlotsTable :items="slots" />

### Rich-only slots

<SlotsTable :items="richSlots" />

The content slots receive `{ open, close }`; calling the slot `close()` requests programmatic dismissal. Attributes such as `id`, `class`, `style`, `dir`, and panel ARIA attributes apply to the panel. Set the trigger's name, ID, and other native attributes on the control in `#trigger`.

### Events and exposed methods

- `update:modelValue(boolean)` requests a change. `open` and `close(detail)` indicate that opening or dismissal has begun; `opened` and `closed(detail)` indicate completion. Interrupted transitions do not emit the cancelled completion event.
- `detail.reason` is `leave`, `focus-out`, `escape`, `outside`, `trigger`, `replaced`, `owner`, `disabled`, `empty`, `model`, or `programmatic`.
- A template ref exposes `open()`, `close()`, and `toggle()`. These request state changes and do not wait for a transition. `open()` can explicitly reopen a tooltip after owner or replacement dismissal if its trigger is available again.

### Public types

```ts
import type {
  MdvTooltipProps,
  MdvRichTooltipProps,
  MdvTooltipPlacement,
  MdvTooltipCloseReason,
  MdvTooltipCloseDetail,
  MdvTooltipSlotProps,
  MdvTooltipTriggerProps,
  MdvTooltipTriggerSlotProps,
} from '@mdv-ui/mdv'
```
