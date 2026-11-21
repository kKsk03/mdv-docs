<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import CircularProgressBasicDemo from '@/components/docs/demos/circularProgress/basic.vue'
import CircularProgressVariantDemo from '@/components/docs/demos/circularProgress/variant.vue'
import CircularProgressSizeDemo from '@/components/docs/demos/circularProgress/size.vue'

const progressProps: ApiTableItem[] = [
  { name: 'value', type: 'number', default: '0', description: 'Current value in the range 0–max. Finite values are clamped; nonfinite values become 0. Decimal values are preserved.' },
  { name: 'max', type: 'number', default: '100', description: 'Positive finite upper bound; invalid values fall back to 100.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows unknown progress and omits aria-valuenow. Set this explicitly; the mode is not inferred from value.' },
  { name: 'variant', type: "'flat' | 'wavy'", default: "'flat'", description: 'Straight or expressive wavy stroke, available in both progress modes.' },
  { name: 'size', type: 'number', default: 'flat: 40; wavy: 48', description: 'Diameter in CSS pixels. Nonpositive or nonfinite values use the variant default.' },
  { name: 'thickness', type: 'number', default: '4', description: 'Stroke width in CSS pixels. Invalid values fall back to 4; circular strokes are limited to half the diameter.' },
  { name: 'label', type: 'string', description: 'Optional visible label above the graphic. Also supplies its accessible name unless an explicit ARIA name is provided.' },
]
</script>
# Circular Progress

Use `MdvCircularProgress` to show task progress in a compact circular indicator.

## Determinate progress

Pass `value` and `max` in the task’s units. Name the indicator with `label` or `aria-label`; provide `aria-valuetext` if the value needs a spoken unit.

<DemoBlock>
  <CircularProgressBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCircularProgress } from '@mdv-ui/mdv'

const transferred = ref(128)
const total = 256
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCircularProgress :value="transferred" :max="total" label="File transfer" :aria-valuetext="`${transferred} of ${total} MB`" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="transferred === total" @click="transferred = Math.min(total, transferred + 32)">Add 32 MB</MdvButton>
      <MdvButton variant="outlined" :disabled="transferred === 0" @click="transferred = Math.max(0, transferred - 32)">Subtract 32 MB</MdvButton>
      <MdvButton variant="text" @click="transferred = 0">Reset</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ transferred }} / {{ total }} MB{{ transferred === total ? ' · Complete' : '' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Flat and wavy appearances

Use `variant="wavy"` for a wavy stroke. Set `indeterminate` when the completed amount is unknown.

<DemoBlock>
  <CircularProgressVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvCircularProgress } from '@mdv-ui/mdv'
import type { MdvProgressVariant } from '@mdv-ui/mdv'

const variants: MdvProgressVariant[] = ['flat', 'wavy']
</script>

<template>
  <div class="grid gap-6">
    <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-center gap-8">
      <MdvCircularProgress :value="60" :variant="variant" :label="`${variant}: 60%`" />
      <MdvCircularProgress indeterminate :variant="variant" :label="`${variant}: waiting`" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Size and stroke width

Use `size` for the diameter and `thickness` for the stroke width, both in CSS pixels.

<DemoBlock>
  <CircularProgressSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvCircularProgress } from '@mdv-ui/mdv'

const thick = ref(false)
const sizes = [24, 40, 64, 96]
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="thick" label="Use an 8px stroke" />
    <div class="flex flex-wrap items-center gap-6">
      <MdvCircularProgress v-for="size in sizes" :key="size" :size="size" :thickness="thick ? 8 : 4" :value="65" :label="`${size}px`" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Colors

To override the active stroke or track color, set these CSS variables on the indicator. Use separate text for completion or errors.

<DocsTable label="Circular progress color variables" min-width="28rem">

| Variable | Default color role |
| --- | --- |
| `--mdv-progress-active-color` | `--mdv-sys-color-primary` |
| `--mdv-progress-track-color` | `--mdv-sys-color-secondary-container` |

</DocsTable>

---

## API

### Props

<ApiTable :items="progressProps" />

### Slots, events, and native attributes

This component has no public slots, model, component events, or exposed methods. Set `value` and `indeterminate` from the application's task state. There are no `loading`, `disabled`, or `error` props.

Native `id`, `class`, `style`, `dir`, ARIA descriptions/value text, and event listeners apply to the root element. The component manages the progressbar role and value attributes; use the props to change progress semantics. An explicit accessible name does not change the visible `label` text.

### Public types

```ts
import type {
  MdvProgressVariant,
  MdvProgressProps,
  MdvCircularProgressProps,
} from '@mdv-ui/mdv'
```

`MdvCircularProgressProps` extends the common progress props with `size`. `MdvProgressVariant` is `'flat' | 'wavy'`.
