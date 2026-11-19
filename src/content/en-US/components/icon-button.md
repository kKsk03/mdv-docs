<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import SlotsTable from '@/components/docs/SlotsTable.vue'
import type { ApiTableItem, SlotTableItem } from '@/components/docs/api-table.types'
import IconButtonVariantDemo from '@/components/docs/demos/iconButton/variant.vue'
import IconButtonSizeDemo from '@/components/docs/demos/iconButton/size.vue'
import IconButtonShapeDemo from '@/components/docs/demos/iconButton/shape.vue'
import IconButtonControlledDemo from '@/components/docs/demos/iconButton/controlled.vue'
import IconButtonColorDemo from '@/components/docs/demos/iconButton/color.vue'
import IconButtonStateDemo from '@/components/docs/demos/iconButton/state.vue'
import IconButtonFormDemo from '@/components/docs/demos/iconButton/form.vue'
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

`MdvIconButton` performs a compact action or toggles a state using an icon. It defaults to `filled`, size `s`, default width, and round shape. Always provide an action name on the button with `aria-label` or `aria-labelledby`. The demos use individually imported [Icon](/en-US/components/icon) data.

## Variants and toggle mode

Use filled or tonal for a visible container, outlined for a boundary, and standard for a transparent surface. Omit `selected` for an ordinary action; bind a boolean to enable toggle behavior.

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

A toggle emits `update:selected` and changes only after the parent accepts the value. `v-model:selected` handles this directly. Use `:selected="false"` for a boolean false, rather than the literal string `selected="false"`.

Ordinary actions commonly use filled artwork. Toggles can change from outline to filled artwork so their state is visible beyond color. MDV does not derive a filled glyph from an arbitrary SVG; provide `#selected`, or read the default slot's `selected` parameter.

## Sizes, widths, and interaction targets

Size controls visible height, icon size, outline thickness, and corner geometry. Width selects a narrow, default, or wide visible surface.

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

<DocsTable label="Icon button visible dimensions" min-width="42rem">

| Size | Height | Icon | Narrow width | Default width | Wide width | Square radius | Outline |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `xs` | 32px | 20px | 28px | 32px | 40px | 12px | 1px |
| `s` | 40px | 24px | 32px | 40px | 52px | 12px | 1px |
| `m` | 56px | 24px | 48px | 56px | 72px | 16px | 1px |
| `l` | 96px | 32px | 64px | 96px | 128px | 28px | 2px |
| `xl` | 136px | 40px | 104px | 136px | 184px | 28px | 3px |

</DocsTable>

The root target is at least 48 × 48px and occupies actual layout space. For example, an `s/default` surface is 40 × 40px inside a 48 × 48px native button. It does not rely on invisible hit areas extending into adjacent controls. Give wrapping layouts enough room for the largest intended width.

## Shapes and state feedback

`shape` is the unselected shape. A selected toggle swaps round to square, or square to round. Deselecting restores the base shape. Pressing or holding an ordinary action does not independently morph its corners.

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

Round uses fully rounded ends; square uses the radius for the current size. All four variants have no elevation shadow. Hover uses an 8% state layer, focus/pressed 10%, with separate ripple and focus-visible feedback. Reduced motion suppresses spinning/ripple motion and shortens shape transitions; forced colors use system colors.

## Controlled acceptance and click cancellation

An ordinary `@click` listener runs before the internal toggle request. Calling `event.preventDefault()` there cancels that request. A controlled parent can independently reject a request by leaving `selected` unchanged.

<DemoBlock>
  <IconButtonControlledDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark'
import bookmarkOutlineIcon from '@iconify-icons/material-symbols/bookmark-outline'

const selected = ref(false)
const accept = ref(false)
const cancel = ref(false)
const message = ref('The parent currently rejects selection changes.')

function update(value: boolean) {
  message.value = `Requested ${value}: ${accept.value ? 'accepted' : 'rejected'}.`
  if (accept.value) selected.value = value
}

function click(event: MouseEvent) {
  if (cancel.value) {
    event.preventDefault()
    message.value = 'Click cancelled before a selection request.'
  }
}
</script>

<template>
  <div class="grid justify-items-start gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="accept" label="Accept selection changes" />
      <MdvCheckbox v-model="cancel" label="Cancel the click" />
    </div>
    <MdvIconButton :selected="selected" aria-label="Bookmark note" @update:selected="update" @click="click">
      <MdvIcon :icon="bookmarkOutlineIcon" />
      <template #selected><MdvIcon :icon="bookmarkIcon" /></template>
    </MdvIconButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Selected: {{ selected }} · {{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Try clicking before enabling acceptance, then enable it, and finally enable Cancel the click. The action name stays Bookmark note throughout; `aria-pressed` communicates selected state. Native button Enter/Space activation produces one ordinary activation, rather than an additional component keyboard event.

## Default roles and custom colors

Without `color`, each variant follows the MD3 roles for its action and toggle states:

<DocsTable label="Default icon button color roles" min-width="43rem">

| Variant | Ordinary action | Unselected toggle | Selected toggle |
| --- | --- | --- | --- |
| filled | primary / on-primary | surface-container / on-surface-variant | primary / on-primary |
| tonal | secondary-container / on-secondary-container | Same as ordinary | secondary / on-secondary |
| outlined | Transparent, outline-variant border, on-surface-variant | Same as ordinary | inverse-surface / inverse-on-surface, no border |
| standard | Transparent / on-surface-variant | Same as ordinary | Transparent / primary |

</DocsTable>

Explicit `color` supports three main theme colors, four semantic colors, or a hexadecimal seed. The seed generates local light/dark color roles; it is not a literal background fill and does not change the global theme.

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

Filled actions and selected toggles use the chosen family's main color; an unselected filled toggle stays neutral. Tonal uses container colors until selected, then the main color. Outlined uses the chosen icon/border colors until selected, then a borderless container color. Standard actions/selected toggles use the chosen main color, while unselected toggles stay neutral.

The example validates `#RGB`/`#RRGGBB` before applying a seed. User `style` can override generated local color variables. Disabled controls use neutral roles: 38% on-surface content and, where applicable, a 10% on-surface container.

## Loading, disabled actions, and links

`loading` keeps the icon mounted but visually hidden, shows a centered indicator, and sets `aria-busy="true"`. It preserves the name and dimensions. Add `disabled` when activation must be blocked.

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

Try Refresh preview and Favorite preview while loading is enabled. They still work until Disable all three actions is checked. The guide control is a real anchor; disabled removes its `href`, excludes it from Tab, and prevents activation callbacks and navigation. Re-enabling restores the link.

In ordinary mode, `href` selects a native anchor independently of the visual variant. Native `target`, `rel`, and `download` remain available; MDV does not invent a destination or open mode. Combining `selected` and `href` keeps button/toggle semantics, ignores `href`, and warns in development.

## Native forms

The default type is `button`. Explicitly choose `submit` or `reset` for native form actions; required validation and reset remain available.

<DemoBlock>
  <IconButtonFormDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvTextField } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save'
import resetIcon from '@iconify-icons/material-symbols/restart-alt'
import previewIcon from '@iconify-icons/material-symbols/visibility'

const title = ref('')
const result = ref('Enter a title before saving.')
</script>

<template>
  <div class="grid gap-4">
    <form class="grid gap-4" @submit.prevent="result = `Saved: ${title}`" @reset="title = ''; result = 'Draft reset.'">
      <MdvTextField v-model="title" label="Draft title" name="title" required full-width />
      <div class="flex flex-wrap gap-4">
        <MdvIconButton type="submit" aria-label="Save draft"><MdvIcon :icon="saveIcon" /></MdvIconButton>
        <MdvIconButton type="reset" variant="tonal" aria-label="Reset draft"><MdvIcon :icon="resetIcon" /></MdvIconButton>
        <MdvIconButton variant="standard" aria-label="Preview draft" @click="result = `Preview: ${title || '(empty)'}`"><MdvIcon :icon="previewIcon" /></MdvIconButton>
      </div>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Preview draft demonstrates the default button type and does not submit the form. Native `name`, `value`, `form`, and other applicable attributes are forwarded. A selected toggle is not automatically serialized as a form value; bind a field explicitly if the selected state belongs in submitted data.

## Tooltip composition

A Tooltip helps explain an icon, but the action still needs its own accessible name. Bind the complete `triggerProps` to the button so focus, hover, and ARIA relationships work together.

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

IconButton does not include a Tooltip automatically. Keep its icon decorative: the icon wrapper is `aria-hidden` and inert, including while loading. Do not place interactive children inside either icon slot.

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
