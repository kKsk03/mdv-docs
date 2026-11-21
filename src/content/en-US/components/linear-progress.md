<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import LinearProgressBasicDemo from '@/components/docs/demos/linearProgress/basic.vue'
import LinearProgressVariantDemo from '@/components/docs/demos/linearProgress/variant.vue'
import LinearProgressTaskDemo from '@/components/docs/demos/linearProgress/task.vue'
import LinearProgressSizeDemo from '@/components/docs/demos/linearProgress/size.vue'

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

Use `MdvLinearProgress` to show task progress across a region. For a compact indicator, see [Circular Progress](./circular-progress).

## Determinate progress

Pass `value` and `max` in the task’s units. Give the indicator an accessible name and use `aria-valuetext` to include units when needed.

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

## Flat and wavy appearances

Use `variant="wavy"` for a wavy stroke. Both flat and wavy support unknown progress with `indeterminate`.

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

## Unknown progress

Set `indeterminate` until a total is available. Use separate status text for completion or errors; the progress indicator does not announce them on its own.

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

## Width and thickness

The indicator fills its container. Control the width with layout styles and the stroke with `thickness`.

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

## Colors

Use these CSS variables to change the active stroke and track colors.

<DocsTable label="Linear progress color variables" min-width="28rem">

| Variable | Default role |
| --- | --- |
| `--mdv-progress-active-color` | `--mdv-sys-color-primary` |
| `--mdv-progress-track-color` | `--mdv-sys-color-secondary-container` |

</DocsTable>

---

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
