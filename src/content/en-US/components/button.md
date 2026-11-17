<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import ButtonVariantDemo from '@/components/docs/demos/button/variant.vue'
import ButtonSizeDemo from '@/components/docs/demos/button/size.vue'
import ButtonShapeDemo from '@/components/docs/demos/button/shape.vue'
import ButtonColorDemo from '@/components/docs/demos/button/color.vue'
import ButtonColorVariantDemo from '@/components/docs/demos/button/colorVariant.vue'
import ButtonColorCustomDemo from '@/components/docs/demos/button/colorCustom.vue'
import ButtonIconDemo from '@/components/docs/demos/button/icon.vue'
import ButtonDisabledDemo from '@/components/docs/demos/button/disabled.vue'
import ButtonLoadingDemo from '@/components/docs/demos/button/loading.vue'
import ButtonLinkDemo from '@/components/docs/demos/button/link.vue'
import ButtonFullWidthDemo from '@/components/docs/demos/button/fullWidth.vue'
import ButtonHoverShadowDemo from '@/components/docs/demos/button/hoverShadow.vue'

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

Buttons let people perform actions with a single click or tap, such as opening a menu or posting a comment.

## Basic usage

Import `MdvButton` and use the default slot to set the button label.

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <MdvButton>Save</MdvButton>
</template>
```

---

## Variants

Use `variant` to set the button's appearance.

<DemoBlock>
  <ButtonVariantDemo />
  <template #source>

```vue:line-numbers
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
    <MdvButton variant="link" href="https://www.google.com" target="_blank">link</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

---

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

---

## Shapes

Use `shape` to set the button shape.

<DemoBlock>
  <ButtonShapeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton shape="round">round</MdvButton>
    <MdvButton shape="square">square</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## Colors

Use `color` to choose the button's color palette.

<DemoBlock>
  <ButtonColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton color="primary">primary</MdvButton>
    <MdvButton color="secondary">secondary</MdvButton>
    <MdvButton color="tertiary">tertiary</MdvButton>
    <MdvButton color="success">success</MdvButton>
    <MdvButton color="warning">warning</MdvButton>
    <MdvButton color="error">error</MdvButton>
    <MdvButton color="info">info</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

### Using colors with variants

The effect of `color` depends on the selected variant.
Omit `color` to use the variant's default colors.

<DemoBlock>
  <ButtonColorVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton variant="tonal">tonal & default</MdvButton>
    <MdvButton variant="tonal" color="primary">tonal & primary</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

### Custom colors

`color` also accepts hexadecimal colors in `#RGB` or `#RRGGBB` format.

<DemoBlock>
  <ButtonColorCustomDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton color="#6750A4">#6750A4</MdvButton>
    <MdvButton color="#00796B">#00796B</MdvButton>
    <MdvButton color="#00ACC1">#00ACC1</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

---

## Icons

Use the `leading` or `trailing` slot to add an icon.

<DemoBlock>
  <ButtonIconDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton, MdvIcon } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'
import arrowForwardIcon from '@iconify-icons/material-symbols/arrow-forward'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton>
      <template #leading>
        <MdvIcon :icon="addIcon" />
      </template>
      Add
    </MdvButton>

    <MdvButton variant="tonal">
      Next
      <template #trailing>
        <MdvIcon :icon="arrowForwardIcon" />
      </template>
    </MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## Disabled state

Set `disabled` to disable the button.

<DemoBlock>
  <ButtonDisabledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton :disabled="true">disabled</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## Loading state

Set `loading` to show a loading indicator. Leading and trailing icons are hidden while loading, and the button label is preserved by default.
Also set `disabled` when you need to prevent repeated actions.

Use `loading-text` to customize the text shown while loading.

<DemoBlock>
  <ButtonLoadingDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton :loading="true">loading</MdvButton>
    <MdvButton :disabled="true" :loading="true">disabled & loading</MdvButton>
    <MdvButton :disabled="true" :loading="true" loading-text="Loading...">disabled & loading</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## Link buttons

Providing `href` renders a native link while preserving the selected variant's appearance.
`variant` controls the appearance: set it to `link` for a link style. `href` determines whether the component renders as a link.

<DemoBlock>
  <ButtonLinkDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton variant="link" href="/en-US/getting-started/setup">Setup</MdvButton>

    <MdvButton
      variant="link"
      href="https://www.google.com"
      target="_blank"
    >
      Google
    </MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

## Form actions

Buttons default to `type="button"` and do not submit forms automatically. Set `type` explicitly to submit or reset a form.

```vue:line-numbers
<template>
  <form>
    <div class="flex flex-wrap items-center gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="text">Reset</MdvButton>
    </div>
  </form>
</template>
```

## Full width

Set `full-width` to fill the available width of the parent container.

<DemoBlock>
  <ButtonFullWidthDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <MdvButton :full-width="true">Continue</MdvButton>
</template>
```

  </template>
</DemoBlock>

## Hover shadows

Set `hover-shadow` to enable hover elevation for supported variants.

<DemoBlock>
  <ButtonHoverShadowDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap items-center gap-3">
    <MdvButton hover-shadow>Button</MdvButton>
    <MdvButton variant="tonal" hover-shadow>Tonal</MdvButton>
    <MdvButton variant="elevated" hover-shadow>Elevated</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

---

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
