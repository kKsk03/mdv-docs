<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import BadgeBasicDemo from '@/components/docs/demos/badge/basic.vue'
import BadgeContentDemo from '@/components/docs/demos/badge/content.vue'
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

Use `MdvBadge` to show a count or short status beside another element.

## Basic usage

Put the target in the default slot. The default `small` variant shows a dot; `large` shows a count or short text.

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

## Numbers and text

Set `content` for a large badge. `0` is displayed; omit the value or use an empty string to hide the indicator.

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

## Visibility

Use `visible` to hide only the indicator. If a badge conveys a meaningful count or status, include that information in the target’s accessible name or description.

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
