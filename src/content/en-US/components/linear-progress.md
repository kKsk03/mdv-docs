<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import LinearProgressBasicDemo from '@/components/docs/demos/linearProgress/basic.vue'
import LinearProgressVariantDemo from '@/components/docs/demos/linearProgress/variant.vue'
import LinearProgressTaskDemo from '@/components/docs/demos/linearProgress/task.vue'
import LinearProgressSizeDemo from '@/components/docs/demos/linearProgress/size.vue'
import LinearProgressThemeDemo from '@/components/docs/demos/linearProgress/theme.vue'

const progressProps: ApiTableItem[] = [
  { name: 'value', type: 'number', default: '0', description: 'Current task value, clamped to 0–max. Nonfinite values become 0; decimals are preserved.' },
  { name: 'max', type: 'number', default: '100', description: 'Positive finite upper bound. Invalid or nonpositive values fall back to 100.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Explicitly displays unknown progress and omits aria-valuenow. Not inferred from value.' },
  { name: 'variant', type: "'flat' | 'wavy'", default: "'flat'", description: 'Straight or expressive wavy stroke. Both support determinate and indeterminate modes.' },
  { name: 'thickness', type: 'number', default: '4', description: 'Stroke width in CSS pixels. Invalid, nonfinite, or nonpositive values fall back to 4.' },
  { name: 'label', type: 'string', description: 'Optional visible text above the graphic. Supplies the accessible name unless explicit ARIA naming takes priority.' },
]
</script>

# Linear Progress

`MdvLinearProgress` displays task progress across the available width. Use determinate mode when the completed amount is measurable, and indeterminate mode when it is unknown. For a compact circular display, see [Circular Progress](/en-US/components/circular-progress); for a short wait without percentages, see [Loading Indicator](/en-US/components/loading-indicator).

## Determinate progress and task units

Pass `value` and `max` in the task's own units. This transfer reports megabytes through `aria-valuetext`; it does not convert the public value into a percentage first.

<DemoBlock>
  <LinearProgressBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvLinearProgress } from '@mdv-ui/mdv'

const transferred = ref(128)
const total = 256
</script>

<template>
  <div class="grid gap-5">
    <MdvLinearProgress :value="transferred" :max="total" label="File transfer" :aria-valuetext="`${transferred} of ${total} MB`" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="transferred === total" @click="transferred = Math.min(total, transferred + 32)">Add 32 MB</MdvButton>
      <MdvButton variant="outlined" :disabled="transferred === 0" @click="transferred = Math.max(0, transferred - 32)">Subtract 32 MB</MdvButton>
      <MdvButton variant="text" @click="transferred = 0">Reset transfer</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ transferred }} / {{ total }} MB{{ transferred === total ? ' · Complete' : '' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

The default range is `0…100`. Values are clamped to the valid range, invalid values become `0`, and an invalid upper bound becomes `100`. The indicator remains visible at completion. The application decides when to hide it and supplies the completion status.

## Flat and wavy appearances

Use `variant="wavy"` for the expressive stroke, or keep the default `flat` appearance. Set `indeterminate` explicitly for unknown progress.

<DemoBlock>
  <LinearProgressVariantDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvLinearProgress } from '@mdv-ui/mdv'
import type { MdvProgressVariant } from '@mdv-ui/mdv'

const variants: MdvProgressVariant[] = ['flat', 'wavy']
</script>

<template>
  <div class="grid gap-7">
    <div v-for="variant in variants" :key="variant" class="grid gap-4">
      <MdvLinearProgress :variant="variant" :value="55" :label="`${variant}: determinate`" />
      <MdvLinearProgress :variant="variant" indeterminate :label="`${variant}: indeterminate`" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

The wavy determinate stroke becomes flat at `10%` or below and at `95%` or above. Its graphic height stays constant while the wave retracts. Indeterminate wavy progress keeps its waveform. Rounded ends, track gaps, and the determinate end marker are rendered by MDV; the default marker is 4px and retracts near completion.

## Unknown progress, completion, and failure

Keep task ownership in the application. Start the example, establish a known total, advance it, or simulate a failure. These controls simulate state changes locally and do not upload anything.

<DemoBlock>
  <LinearProgressTaskDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvButton, MdvLinearProgress } from '@mdv-ui/mdv'

const phase = ref<'idle' | 'connecting' | 'uploading' | 'complete' | 'error'>('idle')
const transferred = ref(0)
const total = 256
const busy = computed(() => phase.value === 'connecting' || phase.value === 'uploading')
const message = computed(() => {
  if (phase.value === 'connecting') return 'Connecting. The total progress is not known yet.'
  if (phase.value === 'uploading') return `Uploading: ${transferred.value} of ${total} MB.`
  if (phase.value === 'complete') return 'Report uploaded. The completed indicator stays visible.'
  if (phase.value === 'error') return 'Upload failed. Start again to retry.'
  return 'Start an upload to try the task states.'
})

function advance() {
  transferred.value = Math.min(total, transferred.value + 64)
  if (transferred.value === total) phase.value = 'complete'
}
</script>

<template>
  <div class="grid gap-5">
    <section :aria-busy="busy" aria-label="Report upload" class="grid min-h-12 items-center">
      <MdvLinearProgress v-if="busy || phase === 'complete'" :indeterminate="phase === 'connecting'" :value="transferred" :max="total" variant="wavy" label="Report upload" :aria-valuetext="phase === 'connecting' ? undefined : `${transferred} of ${total} MB`" />
      <span v-else class="text-sm text-mdv-on-surface-variant">{{ phase === 'error' ? 'Ready to retry.' : 'No upload is running.' }}</span>
    </section>
    <div class="flex flex-wrap gap-3">
      <MdvButton :disabled="busy" @click="transferred = 0; phase = 'connecting'">Start upload</MdvButton>
      <MdvButton variant="tonal" :disabled="phase !== 'connecting'" @click="phase = 'uploading'">Progress is known</MdvButton>
      <MdvButton variant="outlined" :disabled="phase !== 'uploading'" @click="advance">Upload 64 MB</MdvButton>
      <MdvButton variant="text" :disabled="!busy" @click="phase = 'error'">Simulate failure</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

Connecting omits `aria-valuenow` and custom numeric value text. Once progress is known, the indicator uses the real `0…256` range. The surrounding region owns `aria-busy`; a separate status outside that busy region announces meaningful changes. Failure removes the indicator and offers retry, while successful completion leaves the completed indicator visible.

There is no built-in request handling, error state, completion event, automatic hiding, or elapsed-time estimate.

## Width, stroke thickness, and direction

The linear component fills its container. Limit its width with a wrapper or root `class`/`style`. Use `thickness` for the graphic's stroke rather than changing the root height.

<DemoBlock>
  <LinearProgressSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvLinearProgress, MdvSelect } from '@mdv-ui/mdv'

const thickness = ref(4)
const narrow = ref(false)
const rtl = ref(false)
const options = [2, 4, 8, 12].map(value => ({ value, label: `${value}px` }))
</script>

<template>
  <div class="grid gap-5">
    <MdvSelect :model-value="thickness" :options="options" label="Stroke thickness" @update:model-value="thickness = Number($event)" />
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="narrow" label="Use a narrow container" />
      <MdvCheckbox v-model="rtl" label="Right-to-left progress" />
    </div>
    <div :dir="rtl ? 'rtl' : 'ltr'" class="grid w-full gap-6" :style="{ maxInlineSize: narrow ? '220px' : '100%' }">
      <MdvLinearProgress :value="55" :thickness="thickness" label="Flat stroke" />
      <MdvLinearProgress :value="55" :thickness="thickness" variant="wavy" label="Wavy stroke" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

The flat graphic is `thickness` pixels high. The wavy graphic reserves an additional 6px, giving default heights of 4px and 10px respectively. A visible label adds its own height and a 4px gap. Linear Progress has no `size` prop.

An inherited `dir="rtl"` mirrors both determinate growth and indeterminate movement. Labels retain normal logical text direction.

## Local themes and colors

The active stroke and end marker use `primary`; the track uses `secondary-container`. Local theme scopes inherit the same roles. Override the dedicated variables for a different color pair.

<DemoBlock>
  <LinearProgressThemeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvLinearProgress } from '@mdv-ui/mdv'
</script>

<template>
  <div class="grid gap-4">
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid gap-6 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
      <MdvLinearProgress :value="60" :label="`${theme}: primary`" />
      <MdvLinearProgress :value="60" variant="wavy" :label="`${theme}: tertiary`" style="--mdv-progress-active-color: var(--mdv-sys-color-tertiary); --mdv-progress-track-color: var(--mdv-sys-color-tertiary-container)" />
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

<DocsTable label="Linear progress color variables" min-width="28rem">

| Variable | Default role |
| --- | --- |
| `--mdv-progress-active-color` | `--mdv-sys-color-primary` |
| `--mdv-progress-track-color` | `--mdv-sys-color-secondary-container` |

</DocsTable>

There is no `color` prop. Keep enough contrast between the indicator and its surface, and describe failures or completion with text rather than color alone. Forced-colors mode uses system `Highlight` and `GrayText` colors.

## Accessibility and motion

- Supply a name with visible `label`, `aria-label`, or `aria-labelledby`. An explicit ARIA name takes priority without changing the visible label. Related descriptions can use `aria-describedby`.
- The root is a read-only `progressbar`, exposing `aria-valuemin="0"` and the normalized maximum. Determinate mode also exposes the actual current value. ARIA updates immediately, independently of visual interpolation.
- The SVG is decorative, does not enter the Tab order, and does not move focus. Progress indicators are not sliders or inputs.
- The component does not create a live region. Provide task-level status text when completion or failure needs an announcement; avoid per-frame announcements.
- Value and waveform transitions take approximately 500ms and continue from the current displayed frame after an interrupted update. Reduced motion updates determinate values directly and presents a static indeterminate graphic.
- Continuous animation pauses while the page is hidden, the graphic is outside the viewport, or its KeepAlive view is deactivated. SSR emits a stable initial graphic; the browser measures its actual width after mounting.

## API

### Props

<ApiTable :items="progressProps" />

### Slots, events, methods, and attributes

There are no public slots, component events, `v-model`, or additional exposed methods. Update `value` and `indeterminate` from application state. There are no `loading`, `disabled`, `error`, or `paused` props.

`id`, `class`, `style`, `dir`, ARIA descriptions/value text, and native listeners reach the root. MDV manages the progressbar role and range attributes; change progress through its props rather than overriding those attributes. The component does not submit a form value.

### Public types

```ts
import type { MdvProgressProps, MdvProgressVariant } from '@mdv-ui/mdv'
```

`MdvProgressVariant` is `'flat' | 'wavy'`. Linear Progress uses the shared `MdvProgressProps`; there is no separate `MdvLinearProgressProps` export.
