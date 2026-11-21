<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import IconButtonVariantDemo from '@/components/docs/demos/iconButton/variant.vue'
import IconButtonSizeDemo from '@/components/docs/demos/iconButton/size.vue'
import IconButtonShapeDemo from '@/components/docs/demos/iconButton/shape.vue'
import IconButtonColorDemo from '@/components/docs/demos/iconButton/color.vue'
import IconButtonStateDemo from '@/components/docs/demos/iconButton/state.vue'
import IconButtonTooltipDemo from '@/components/docs/demos/iconButton/tooltip.vue'

const buttonProps: ApiTableItem[] = [
  { name: 'variant', type: "'filled' | 'tonal' | 'outlined' | 'standard'", default: "'filled'", description: 'Visual emphasis. Ordinary actions, unselected toggles, and selected toggles use their corresponding MD3 roles.' },
  { name: 'color', type: 'MdvIconButtonColor', description: 'primary, secondary, tertiary, success, warning, error, info, or a #RGB/#RRGGBB seed. Omit for the variant-specific default roles.' },
  { name: 'size', type: "'xs' | 's' | 'm' | 'l' | 'xl'", default: "'s'", description: 'Visible heights are 32, 40, 56, 96, and 136px. The root interaction target is at least 48px in both dimensions.' },
  { name: 'width', type: "'narrow' | 'default' | 'wide'", default: "'default'", description: 'Visible width for the selected size. Small surfaces remain centered inside the native interaction target.' },
  { name: 'shape', type: "'round' | 'square'", default: "'round'", description: 'Base unselected shape. Selecting swaps round and square; pressing alone does not change shape.' },
  { name: 'selected', attribute: 'v-model:selected', type: 'boolean', default: 'undefined', description: 'Omit for an ordinary action; any supplied boolean enables a controlled toggle with aria-pressed. The parent must accept update:selected.' },
  { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native type for button roots. Does not change anchor activation behavior.' },
  { name: 'href', type: 'string', description: 'In ordinary mode, renders a native anchor, including an empty href. Ignored in toggle mode, which always renders a button.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Uses native disabled for buttons. Links lose href and activation handlers and receive role=link, aria-disabled=true, and tabindex=-1.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'Replaces the icon visually with a centered indicator and sets aria-busy. Does not automatically disable clicks, toggling, or links.' },
]
const buttonSlots: SlotTableItem[] = [
  { name: 'default', description: 'Ordinary/unselected decorative icon. Receives { selected: boolean }; also renders the selected icon if no selected slot exists.' },
  { name: 'selected', description: 'Selected decorative icon. Receives { selected: true }; the default slot is the fallback.' },
]
</script>
# Icon Button

Use `MdvIconButton` for a compact action represented by an icon. Give it an accessible name, such as `aria-label="Bookmark"`.

## Variants and toggle mode

Use `variant` to set the appearance. Omit `selected` for a regular action, or bind `v-model:selected` for a toggle.

<DemoBlock>
  <IconButtonVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvIconButtonVariant } from '@mdv-ui/mdv'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'
import favoriteOutlineIcon from '@iconify-icons/material-symbols/favorite-outline'

const variants: MdvIconButtonVariant[] = ['filled', 'tonal', 'outlined', 'standard']
const selected = ref<Record<MdvIconButtonVariant, boolean>>({ filled: false, tonal: false, outlined: false, standard: false })
const actions = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="variant in variants" :key="variant" class="grid gap-3 rounded-xl bg-mdv-surface-container-low p-4">
        <p class="font-medium">{{ variant }}</p>
        <div class="flex flex-wrap gap-5">
          <div class="grid justify-items-center gap-2">
            <MdvIconButton :variant="variant" :aria-label="`Favorite action, ${variant}`" @click="actions++"><MdvIcon :icon="favoriteIcon" /></MdvIconButton>
            <span class="text-sm">Action</span>
          </div>
          <div class="grid justify-items-center gap-2">
            <MdvIconButton v-model:selected="selected[variant]" :variant="variant" :aria-label="`Favorite toggle, ${variant}`">
              <MdvIcon :icon="favoriteOutlineIcon" />
              <template #selected><MdvIcon :icon="favoriteIcon" /></template>
            </MdvIconButton>
            <span class="text-sm">Toggle</span>
          </div>
        </div>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Actions: {{ actions }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Sizes and widths

Use `size` for the control size and `width` for a narrow or wide surface.

<DemoBlock>
  <IconButtonSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvSelect } from '@mdv-ui/mdv'
import type { MdvIconButtonSize, MdvIconButtonWidth } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const sizes: MdvIconButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const width = ref<MdvIconButtonWidth>('default')
const widths = ['narrow', 'default', 'wide'].map(value => ({ value, label: value }))
</script>

<template>
  <div class="grid gap-6">
    <MdvSelect :model-value="width" :options="widths" label="Button width" @update:model-value="width = $event as MdvIconButtonWidth" />
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in sizes" :key="size" class="grid justify-items-center gap-3">
        <MdvIconButton :size="size" :width="width" :aria-label="`Add item, ${size}`"><MdvIcon :icon="addIcon" /></MdvIconButton>
        <span class="text-sm">{{ size }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Shapes

Set `shape` to `round` or `square`. A toggle uses the opposite shape when selected.

<DemoBlock>
  <IconButtonShapeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvIconButtonShape } from '@mdv-ui/mdv'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark'
import bookmarkOutlineIcon from '@iconify-icons/material-symbols/bookmark-outline'

const shapes: MdvIconButtonShape[] = ['round', 'square']
const selected = ref<Record<MdvIconButtonShape, boolean>>({ round: false, square: false })
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <div v-for="shape in shapes" :key="shape" class="grid justify-items-center gap-3">
      <MdvIconButton v-model:selected="selected[shape]" :shape="shape" size="m" :aria-label="`Bookmark, ${shape} base shape`">
        <template #default="{ selected: active }"><MdvIcon :icon="active ? bookmarkIcon : bookmarkOutlineIcon" /></template>
      </MdvIconButton>
      <span class="text-sm">{{ shape }} → {{ selected[shape] ? 'selected' : 'unselected' }}</span>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Colors

Omit `color` for the variant’s defaults, or choose a theme color or a hex seed.

<DemoBlock>
  <IconButtonColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvSelect, MdvTextField } from '@mdv-ui/mdv'
import type { MdvIconButtonColor, MdvIconButtonVariant } from '@mdv-ui/mdv'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'

const variant = ref<MdvIconButtonVariant>('filled')
const dark = ref(false)
const seedDraft = ref('#006c4c')
const seed = ref<`#${string}`>('#006c4c')
const error = ref('')
const variants = ['filled', 'tonal', 'outlined', 'standard'].map(value => ({ value, label: value }))
const presets: MdvIconButtonColor[] = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'info']
const colors = computed<{ label: string; value: MdvIconButtonColor | undefined }[]>(() => [
  { label: 'default', value: undefined },
  ...presets.map(value => ({ label: value, value })),
  { label: seed.value, value: seed.value },
])

function applySeed() {
  if (!/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(seedDraft.value)) {
    error.value = 'Use #RGB or #RRGGBB, for example #06C or #006c4c.'
    return
  }
  seed.value = seedDraft.value as `#${string}`
  error.value = ''
}
</script>

<template>
  <div class="grid gap-5">
    <MdvSelect :model-value="variant" :options="variants" label="Color preview variant" @update:model-value="variant = $event as MdvIconButtonVariant" />
    <form class="flex flex-wrap items-start gap-3" novalidate @submit.prevent="applySeed">
      <MdvTextField v-model="seedDraft" label="Local seed color" :error="!!error" :error-text="error" />
      <MdvButton type="submit" variant="tonal">Apply seed</MdvButton>
    </form>
    <MdvCheckbox v-model="dark" label="Local dark theme" />
    <div :data-mdv-theme="dark ? 'dark' : undefined" class="flex flex-wrap gap-6 rounded-xl bg-mdv-surface-container-low p-5 text-mdv-on-surface">
      <div v-for="color in colors" :key="color.label" class="grid justify-items-center gap-2">
        <MdvIconButton :variant="variant" :color="color.value" :aria-label="`Favorite, ${color.label}`"><MdvIcon :icon="favoriteIcon" /></MdvIconButton>
        <span class="text-sm">{{ color.label }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Loading, disabled, and links

Use `loading` for a spinner and add `disabled` to prevent repeated actions. Provide `href` to render a link.

<DemoBlock>
  <IconButtonStateDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import refreshIcon from '@iconify-icons/material-symbols/refresh'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'
import favoriteOutlineIcon from '@iconify-icons/material-symbols/favorite-outline'
import guideIcon from '@iconify-icons/material-symbols/open-in-new'

const loading = ref(false)
const disabled = ref(false)
const selected = ref(false)
const actions = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="loading" label="Show loading indicators" />
      <MdvCheckbox v-model="disabled" label="Disable all three actions" />
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <MdvIconButton :loading="loading" :disabled="disabled" aria-label="Refresh preview" @click="actions++"><MdvIcon :icon="refreshIcon" /></MdvIconButton>
      <MdvIconButton v-model:selected="selected" variant="tonal" :loading="loading" :disabled="disabled" aria-label="Favorite preview">
        <MdvIcon :icon="favoriteOutlineIcon" />
        <template #selected><MdvIcon :icon="favoriteIcon" /></template>
      </MdvIconButton>
      <MdvIconButton href="https://m3.material.io/components/icon-buttons/overview" target="_blank" rel="noopener noreferrer" variant="outlined" :loading="loading" :disabled="disabled" aria-label="Read icon button design guide"><MdvIcon :icon="guideIcon" /></MdvIconButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Refreshes: {{ actions }} · Favorite: {{ selected }}. Loading alone keeps actions enabled.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Tooltip composition

Bind [Tooltip](./tooltip) `triggerProps` to show a hint. The icon button still needs its own accessible name.

<DemoBlock>
  <IconButtonTooltipDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvTooltip } from '@mdv-ui/mdv'
import refreshIcon from '@iconify-icons/material-symbols/refresh'

const refreshes = ref(0)
</script>

<template>
  <div class="flex flex-wrap items-center gap-5">
    <MdvTooltip text="Refresh results" placement="top">
      <template #trigger="{ triggerProps }">
        <MdvIconButton v-bind="triggerProps" variant="standard" aria-label="Refresh results" @click="refreshes++"><MdvIcon :icon="refreshIcon" /></MdvIconButton>
      </template>
    </MdvTooltip>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Refreshed {{ refreshes }} times. Hover or focus the action to see its tooltip.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## API

### Props

<ApiTable :items="buttonProps" />

### Slots

<SlotsTable :items="buttonSlots" />

### Events

<DocsTable label="Icon button component event" min-width="31rem">

| Event | Payload and meaning |
| --- | --- |
| `update:selected` | Requested boolean state in toggle mode. Not emitted for ordinary actions, disabled activation, or a cancelled click. |

</DocsTable>

`click`, focus, blur, pointer, and keyboard events are native listeners forwarded to the root control; there is no separate custom click event. Disabled controls suppress activation listeners. Buttons retain native Enter/Space and form behavior; anchors retain native Enter activation.

### Native attributes and sizing overrides

`class`, `style`, `id`, ARIA, `data-*`, and applicable native button/link attributes reach the root. There are no additional exposed methods. Reference and focus the underlying native control when needed rather than expecting a component `focus()` API.

For a deliberate custom visible size, set the local variables together:

```vue
<MdvIconButton
  aria-label="Favorite"
  :style="{
    '--mdv-icon-button-height': '64px',
    '--mdv-icon-button-width': '80px',
    '--mdv-icon-button-icon-size': '28px',
  }"
>
  <MdvIcon :icon="favoriteIcon" />
</MdvIconButton>
```

Root CSS width/height changes the whole target box, including padding; these variables control the visible geometry. Always preserve usable targets and room for the icon.

### Public types

```ts
import type {
  MdvIconButtonVariant,
  MdvIconButtonColor,
  MdvIconButtonSize,
  MdvIconButtonWidth,
  MdvIconButtonShape,
  MdvIconButtonType,
} from '@mdv-ui/mdv'
```

MDV does not export a separate `MdvIconButtonProps` type.
