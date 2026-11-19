<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import CircularProgressBasicDemo from '@/components/docs/demos/circularProgress/basic.vue'
import CircularProgressVariantDemo from '@/components/docs/demos/circularProgress/variant.vue'
import CircularProgressModeDemo from '@/components/docs/demos/circularProgress/mode.vue'
import CircularProgressSizeDemo from '@/components/docs/demos/circularProgress/size.vue'
import CircularProgressThemeDemo from '@/components/docs/demos/circularProgress/theme.vue'

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

`MdvCircularProgress` displays the progress of a task as a circular indicator. Use determinate progress for a measurable task and indeterminate progress when its completion amount is unknown. Flat and wavy appearances support both modes.

## Determinate progress

Pass `value` and, if needed, `max` in the task's actual units. The example tracks megabytes rather than converting everything to percentages. Use `aria-valuetext` when a spoken value needs its unit or other context.

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

Values are clamped to `0…max`; invalid `value` becomes `0`, and an invalid/nonpositive `max` becomes `100`. Decimal values remain supported. Reaching `max` does not remove the indicator or announce completion automatically. The example provides a separate status message for the application result.

---

## Flat and wavy appearances

Set `variant="wavy"` for the expressive appearance, or keep the default `flat` stroke. Both appearances support determinate and indeterminate progress.

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

Determinate progress starts at the top and travels clockwise, including in RTL layouts. A determinate wavy stroke expands its waves between 10% and 95%, returning to a flat stroke near either endpoint while preserving its outer size. Flat indeterminate progress omits the track; wavy indeterminate progress retains it.

## Switching progress modes

Use `indeterminate` while the task is waiting for a measurable result, then set it to `false` and provide the known value. Do not use an invented percentage to represent unknown progress.

<DemoBlock>
  <CircularProgressModeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvCircularProgress } from '@mdv-ui/mdv'

const unknown = ref(true)
const value = ref(25)

function complete() {
  unknown.value = false
  value.value = 100
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="unknown" label="Progress is unknown" />
    <MdvCircularProgress :value="value" :indeterminate="unknown" variant="wavy" label="Processing files" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="unknown || value === 100" @click="value = Math.min(100, value + 5)">Advance 5%</MdvButton>
      <MdvButton variant="outlined" @click="complete">Complete</MdvButton>
      <MdvButton variant="text" @click="value = 0; unknown = true">Start over</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ unknown ? 'Waiting for a measurable result…' : value === 100 ? 'Processing complete.' : `Processed ${value}%.` }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

`indeterminate` is independent of `value`. While it is enabled, the progressbar has no `aria-valuenow`; switching back exposes the normalized current value. The application owns task cancellation, retrying, error messages, completion feedback, and when the indicator is shown.

---

## Size and stroke width

`size` controls the diameter in CSS pixels; `thickness` controls the stroke width. Flat defaults to 40px and wavy to 48px, both with a 4px stroke. Set a common size if changing variants should keep the same diameter.

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

Leave enough surrounding space for the label and graphic. The indicator is a status display rather than a control, so it does not create a button target or enter the Tab order.

## Themes and colors

The default active stroke uses `primary`; the track uses `secondary-container`. Local light/dark scopes inherit MDV's theme tokens. There is no `color` prop; override the dedicated CSS variables when another semantic role is needed.

<DemoBlock>
  <CircularProgressThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvCircularProgress } from '@mdv-ui/mdv'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="flex flex-wrap items-center gap-6 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
      <MdvCircularProgress :value="60" :label="`${theme}: primary`" />
      <MdvCircularProgress
        :value="60"
        variant="wavy"
        :label="`${theme}: tertiary`"
        style="--mdv-progress-active-color: var(--mdv-sys-color-tertiary); --mdv-progress-track-color: var(--mdv-sys-color-tertiary-container)"
      />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="Circular progress color variables" min-width="28rem">

| Variable | Default color role |
| --- | --- |
| `--mdv-progress-active-color` | `--mdv-sys-color-primary` |
| `--mdv-progress-track-color` | `--mdv-sys-color-secondary-container` |

</DocsTable>

Do not rely on color alone to communicate completion or failure. In forced-colors mode, the indicator uses system `Highlight` and `GrayText` colors.

## Accessibility and motion

- Give the indicator an accessible name using `label`, `aria-label`, or `aria-labelledby`. `label` is also visible; an explicit `aria-label` takes precedence, and `aria-labelledby` prevents adding the label as another name.
- The root exposes `role="progressbar"`, `aria-valuemin="0"`, and the normalized `aria-valuemax`. Determinate mode also exposes the real current `aria-valuenow`, without waiting for visual interpolation.
- The decorative SVG is hidden from assistive technology and has no focus target. Keep related task descriptions outside the graphic and reference them with `aria-describedby` when useful.
- A progressbar is not a live region. Provide an application status message for meaningful completion/error changes. Avoid announcing every animation frame or continuously updating text for an unknown task.
- Value and waveform transitions take about 500ms. With reduced motion, determinate updates are immediate and indeterminate mode uses a static unknown-progress graphic. Continuous motion pauses when the page or indicator is not visible, and while its containing KeepAlive view is deactivated.

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
