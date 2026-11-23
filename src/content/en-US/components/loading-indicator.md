<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import LoadingAppearanceDemo from '@/components/docs/demos/loadingIndicator/appearance.vue'
import LoadingTaskDemo from '@/components/docs/demos/loadingIndicator/task.vue'
import LoadingButtonDemo from '@/components/docs/demos/loadingIndicator/button.vue'

const indicatorProps: ApiTableItem[] = [
  { name: 'contained', type: 'boolean', default: 'false', description: 'Adds a circular primary-container background and uses on-primary-container for the shape.' },
  { name: 'size', type: 'number', default: '48', description: 'Overall size in CSS pixels. Finite values are clamped to 24–240; nonfinite values fall back to 48.' },
  { name: 'label', type: 'string', description: 'Name read by assistive technology. A missing or blank value leaves the name unset unless native ARIA names it.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the current animation phase; resuming continues from that phase. Does not mean the task has finished.' },
  { name: 'decorative', type: 'boolean', default: 'false', description: 'Hides the indicator from assistive technology and removes its role/name/description when the owner already conveys loading.' },
]
</script>
# Loading Indicator

Use `MdvLoadingIndicator` while a task is waiting without a measurable percentage. Use [Linear Progress](./linear-progress) for a known total.

## Appearance and size

Use `variant="contained"` for a circular background. `size` sets the overall size in CSS pixels.

<DemoBlock>
  <LoadingAppearanceDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvLoadingIndicator } from '@mdv-ui/mdv'
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2">
    <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="grid justify-items-center gap-4 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
      <span class="text-sm font-medium">{{ theme }}</span>
      <div class="flex flex-wrap justify-center gap-8">
        <div class="grid justify-items-center gap-3">
          <MdvLoadingIndicator :label="`${theme}: loading preview`" />
          <span class="text-sm">Default</span>
        </div>
        <div class="grid justify-items-center gap-3">
          <MdvLoadingIndicator contained :label="`${theme}: loading contained preview`" />
          <span class="text-sm">Contained</span>
        </div>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Loading a region

Name the indicator with `label` or `aria-label` and set `aria-busy` on the region being updated. Show completion, error, and retry separately.

<DemoBlock>
  <LoadingTaskDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const phase = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const fail = ref(false)
const loading = computed(() => phase.value === 'loading')
const message = computed(() => ({
  idle: 'Load recommendations to try the preview.',
  loading: 'Loading recommendations…',
  success: 'Recommendations are ready.',
  error: 'Loading failed. Disable the simulated failure and retry.',
})[phase.value])
let timer: ReturnType<typeof setTimeout> | undefined

function load() {
  if (loading.value) return
  phase.value = 'loading'
  // Simulate a local request; no network request is made.
  timer = setTimeout(() => {
    timer = undefined
    phase.value = fail.value ? 'error' : 'success'
  }, 1200)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap items-center gap-4">
      <MdvButton :disabled="loading" @click="load">Load recommendations</MdvButton>
      <MdvCheckbox v-model="fail" label="Simulate a loading failure" :disabled="loading" />
    </div>
    <section :aria-busy="loading" aria-label="Recommendations" class="grid min-h-40 place-items-center rounded-xl bg-mdv-surface-container-low p-5">
      <MdvLoadingIndicator v-if="loading" label="Loading recommendations" />
      <div v-else-if="phase === 'success'" class="grid gap-2">
        <p class="font-medium">Your reading list</p>
        <p class="text-sm">Designing useful interfaces · Choosing meaningful motion</p>
      </div>
      <p v-else class="text-sm text-mdv-on-surface-variant">{{ phase === 'error' ? 'Nothing loaded. You can retry.' : 'Recommendations will appear here.' }}</p>
    </section>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Inside a button

When the button already conveys that it is loading, make the indicator decorative to avoid a second announcement.

<DemoBlock>
  <LoadingButtonDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvIcon, MdvLoadingIndicator } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save'

const saving = ref(false)
const saves = ref(0)
let timer: ReturnType<typeof setTimeout> | undefined

function save() {
  if (saving.value) return
  saving.value = true
  timer = setTimeout(() => {
    timer = undefined
    saves.value++
    saving.value = false
  }, 900)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-busy="saving" :disabled="saving" style="--mdv-button-icon-size: 24px" @click="save">
      <template #leading>
        <MdvLoadingIndicator v-if="saving" :size="24" decorative style="--mdv-loading-indicator-active-color: currentColor" />
        <MdvIcon v-else :icon="saveIcon" />
      </template>
      {{ saving ? 'Saving draft…' : 'Save draft' }}
    </MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ saving ? 'Saving the draft.' : `Saved ${saves} times.` }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Color variables

Override these variables for a theme-aware color change.

<DocsTable label="Loading indicator color variables" min-width="31rem">

| Variable | Default | Contained |
| --- | --- | --- |
| `--mdv-loading-indicator-active-color` | `primary` | `on-primary-container` |
| `--mdv-loading-indicator-container-color` | No painted container | `primary-container` |

</DocsTable>

---

## API

### Props

<ApiTable :items="indicatorProps" />

### Slots, events, methods, and attributes

There are no slots, custom component events, `v-model`, or exposed methods. `contained` is the appearance switch; there is no `variant`, `value`, `max`, `loading`, or request-duration prop.

Native attributes, listeners, `class`, and `style` apply to the root span. MDV manages the loading role and decorative semantics and strips numeric progress ARIA attributes. The indicator does not submit a form value or create an overlay.

### Public type

```ts
import type { MdvLoadingIndicatorProps } from '@mdv-ui/mdv'
```
