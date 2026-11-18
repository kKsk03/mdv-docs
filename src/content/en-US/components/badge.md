<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BadgeBasicDemo from '@/components/docs/demos/badge/basic.vue'
import BadgeContentDemo from '@/components/docs/demos/badge/content.vue'
import BadgeVisibilityDemo from '@/components/docs/demos/badge/visibility.vue'
import BadgeCountDemo from '@/components/docs/demos/badge/count.vue'

const badgeProps: ApiTableItem[] = [
  { name: 'variant', type: "'small' | 'large'", default: "'small'", description: 'Small displays a dot; large displays a number or short text.' },
  { name: 'content', type: 'string | number', description: 'Large content, displayed as supplied. Numeric zero is valid. Missing content or an empty string hides the large indicator. Small ignores this value.' },
  { name: 'visible', type: 'boolean', default: 'true', description: 'Whether to render the indicator. The wrapped slot content stays mounted and interactive.' },
]
const badgeSlots: SlotTableItem[] = [
  { name: 'default', description: 'Wrapped button, icon, or other content. The indicator sits at the logical top-end of this wrapper.' },
]
</script>

# Badge

Badges attach short status information to buttons, icons, or other content, such as unread updates or message counts. `MdvBadge` presents status; the wrapped control owns the action.

## Basic usage

Put the wrapped content in the default slot. The default `small` variant shows a 6px dot. `large` shows a number or short text with a minimum height of 16px.

<DemoBlock>
  <BadgeBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvBadge, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import notifications from '@iconify-icons/material-symbols/notifications-outline'
import mail from '@iconify-icons/material-symbols/mail-outline'
</script>

<template>
  <div class="flex flex-wrap items-center gap-8">
    <MdvBadge>
      <MdvIconButton variant="standard" aria-label="Notifications, new updates available">
        <MdvIcon :icon="notifications" />
      </MdvIconButton>
    </MdvBadge>
    <MdvBadge variant="large" :content="3">
      <MdvIconButton variant="standard" aria-label="Mail, 3 unread messages">
        <MdvIcon :icon="mail" />
      </MdvIconButton>
    </MdvBadge>
  </div>
</template>
```

  </template>
</DemoBlock>

Indicators use the theme's `error` and `on-error` colors and follow light/dark, local themes, and dynamic colors. These color roles identify the badge visually; its content does not need to represent an error.

---

## Numbers and text

Use `content` for large badges. It is displayed as supplied, and numeric `0` is valid. Omitted content or an empty string prevents the large indicator from rendering.

<DemoBlock>
  <BadgeContentDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvBadge, MdvButton } from '@mdv-ui/mdv'

const values = [0, 7, 99, '99+', 'New']
</script>

<template>
  <div class="flex flex-wrap items-center gap-8 py-2">
    <MdvBadge v-for="value in values" :key="value" variant="large" :content="value" :aria-label="`Status: ${value}`">
      <MdvButton variant="tonal">Inbox</MdvButton>
    </MdvBadge>
  </div>
</template>
```

  </template>
</DemoBlock>

`99+` is supplied text; the component does not truncate numbers automatically. Keep content short to avoid obscuring adjacent controls. Small badges do not need `content`.

---

## Visibility

Control the indicator with `visible`. Hiding it preserves the wrapped content, focus, and interaction. Click the button before and after toggling to verify its state remains intact.

<DemoBlock>
  <BadgeVisibilityDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'

const visible = ref(true)
const clicks = ref(0)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="visible" label="Show badge" />
    <MdvBadge :visible="visible" aria-label="New updates available">
      <MdvButton variant="tonal" @click="clicks++">Open updates</MdvButton>
    </MdvBadge>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Opened {{ clicks }} times.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

`visible` does not manage read status. Bind application state to hide empty counts, clear messages after reading, or schedule visibility.

### Message state composition

This example explicitly displays `99+` above 99, hides the badge at zero, clears the count when opening mail, and includes the count in the button's accessible name.

<DemoBlock>
  <BadgeCountDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import mail from '@iconify-icons/material-symbols/mail-outline'

const unread = ref(3)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <MdvBadge variant="large" :content="unread > 99 ? '99+' : unread" :visible="unread > 0">
        <MdvIconButton variant="tonal" :aria-label="`Read mail, ${unread} unread messages`" @click="unread = 0">
          <MdvIcon :icon="mail" />
        </MdvIconButton>
      </MdvBadge>
      <MdvButton variant="outlined" @click="unread++">Add message</MdvButton>
      <MdvButton variant="outlined" @click="unread += 100">Add 100</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Unread: {{ unread }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## Placement and layout

The root is a relatively positioned `inline-flex` wrapper. Its indicator sits at logical top-end and mirrors automatically with `dir="rtl"`.

```vue
<div dir="rtl">
  <MdvBadge variant="large" content="New">
    <MdvButton variant="tonal" aria-label="Inbox, new messages">Inbox</MdvButton>
  </MdvBadge>
</div>
```

Reserve space around the badge. An ancestor with `overflow: hidden` can clip an indicator extending beyond the wrapped content. Provide enough padding in layouts that need clipping.

There are no corner-position, `max`, `showZero`, or `color` props. Implement count presentation through `content` and `visible`.

---

## Accessibility and interaction

Indicators do not intercept pointer events, enter the Tab order, or manage focus. Wrapped buttons and links still need their own accessible names.

- Without `aria-label`, the indicator is `aria-hidden="true"`. Include status in the button name when appropriate, as in the basic unread-count example.
- A nonempty `aria-label` labels the indicator with `role="img"`. It does not replace the wrapped button's name.
- Dynamic badges are not automatically live regions. Provide separate status announcements when needed, avoiding duplicate announcements.

Badges have no independent selected, disabled, loading, or click state. The actual control in the default slot owns clicks, disabling, and keyboard interaction.

---

## API

### Props

<ApiTable :items="badgeProps" />

### Slots

<SlotsTable :items="badgeSlots" />

### Native attributes and types

`class`, `style`, `id`, `dir`, `lang`, `data-*`, and other native attributes are forwarded to the wrapper. `aria-label` specifically labels the indicator. There are no additional component events, models, or exposed methods.

```ts
import type { MdvBadgeVariant, MdvBadgeContent } from '@mdv-ui/mdv'
```

`MdvBadgeVariant` is `'small' | 'large'`, and `MdvBadgeContent` is `string | number`.
