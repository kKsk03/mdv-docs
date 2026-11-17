<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ButtonVariantDemo from '@/components/docs/demos/button/variant.vue'
import ButtonSizeDemo from '@/components/docs/demos/button/size.vue'

const buttonProps: ApiTableItem[] = [
  {
    name: 'variant',
    type: "'filled' | 'tonal' | 'outlined' | 'elevated' | 'text' | 'link'",
    default: "'filled'",
  },
  {
    name: 'color',
    type: 'MdvButtonColor',
  },
  {
    name: 'size',
    type: "'xs' | 's' | 'm' | 'l' | 'xl'",
    default: "'s'",
    description: 'Button size, including height, padding, text, and icon dimensions.',
  },
  {
    name: 'shape',
    type: "'round' | 'square'",
    default: "'round'",
    description: 'Button shape. round uses a pill shape; square uses rounded rectangular corners.',
  },
  {
    name: 'type',
    type: "'button' | 'submit' | 'reset'",
    default: "'button'",
    description: 'Native button type. Only applies when href is omitted and the root element is a button.',
  },
  {
    name: 'href',
    type: 'string',
    description: 'Renders a native link when provided, independently of variant. Native attributes such as target, rel, and download are forwarded.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Disables the control. Buttons use native disabled behavior; links lose their href and block activation.',
  },
  {
    name: 'loading',
    type: 'boolean',
    default: 'false',
    description: 'Shows a loading indicator and hides leading and trailing icons. It does not block clicks, navigation, or submission; also set disabled to prevent repeated actions.',
  },
  {
    name: 'loadingText',
    type: 'string',
    description: 'Replacement text while loading. Omit it to keep the original label. An empty string shows only the indicator and requires an accessible name such as aria-label.',
  },
  {
    name: 'hoverShadow',
    type: 'boolean',
    default: 'false',
    description: 'Enables hover elevation for filled and tonal, or increases the existing elevation of elevated. Does not affect outlined, text, or link.',
  },
  {
    name: 'fullWidth',
    type: 'boolean',
    default: 'false',
    description: 'Fills the available width of the parent container.',
  },
]

const buttonSlots: SlotTableItem[] = [
  { name: 'default', description: 'The button label.' },
  { name: 'leading', description: 'Leading icon. Icons are decorative and do not contribute to the accessible name.' },
  { name: 'trailing', description: 'Trailing icon. Icons are decorative and do not contribute to the accessible name.' },
]
</script>

# Button

Buttons let people take actions with a single tap or click. MDV provides filled, tonal, outlined, elevated, text, and link variants.

## Variants

Each variant communicates a different level of emphasis. Choose one primary action per group and use lower-emphasis variants for supporting actions.

<DemoBlock>
  <ButtonVariantDemo />
  <template #source>

```vue
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton variant="filled">filled</MdvButton>
    <MdvButton variant="tonal">tonal</MdvButton>
    <MdvButton variant="outlined">outlined</MdvButton>
    <MdvButton variant="elevated">elevated</MdvButton>
    <MdvButton variant="text">text</MdvButton>
    <MdvButton variant="link">link</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## Sizes

Use `size` to choose between `xs`, `s`, `m`, `l`, and `xl`. The default is `s`.

<DemoBlock>
  <ButtonSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton size="xs">XS</MdvButton>
    <MdvButton size="s">S</MdvButton>
    <MdvButton size="m">M</MdvButton>
    <MdvButton size="l">L</MdvButton>
    <MdvButton size="xl">XL</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## API

### Props

<ApiTable :items="buttonProps">
<template #description-variant>

The button appearance. Available values:

- `filled`: a filled button for primary actions.
- `tonal`: a tonal button for moderate emphasis.
- `outlined`: an outlined button for secondary actions.
- `elevated`: a raised button separated from its background by a shadow.
- `text`: a text button for low-emphasis actions.
- `link`: an MDV link appearance; `href` still determines navigation semantics.

</template>
<template #description-color>

Supports the theme colors `primary`, `secondary`, and `tertiary`, plus the semantic colors `success`, `warning`, `error`, and `info`.

Also accepts a local `#RGB` or `#RRGGBB` seed. The seed generates colors for light and dark modes, so the final background may differ from the input. Omit this prop to retain the variant's default colors.

</template>
</ApiTable>

### Slots

<SlotsTable :items="buttonSlots" />
