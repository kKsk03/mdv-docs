<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import LoadingAppearanceDemo from '@/components/docs/demos/loadingIndicator/appearance.vue'
import LoadingSizeDemo from '@/components/docs/demos/loadingIndicator/size.vue'
import LoadingPauseDemo from '@/components/docs/demos/loadingIndicator/pause.vue'
import LoadingTaskDemo from '@/components/docs/demos/loadingIndicator/task.vue'
import LoadingButtonDemo from '@/components/docs/demos/loadingIndicator/button.vue'

const indicatorProps: ApiTableItem[] = [
  { name: 'contained', type: 'boolean', default: 'false', description: 'Adds a circular primary-container background and uses on-primary-container for the shape.' },
  { name: 'size', type: 'number', default: '48', description: 'Overall size in CSS pixels. Finite values are clamped to 24–240; nonfinite values fall back to 48.' },
  { name: 'label', type: 'string', default: "'加载中'", description: 'Accessible name only; does not display text. Whitespace-only labels use the default Chinese name. Set explicitly for the application language.' },
  { name: 'paused', type: 'boolean', default: 'false', description: 'Freezes the current animation phase; resuming continues from that phase. Does not mean the task has finished.' },
  { name: 'decorative', type: 'boolean', default: 'false', description: 'Hides the indicator from assistive technology and removes its role/name/description when the owner already conveys loading.' },
]
</script>

# Loading Indicator

`MdvLoadingIndicator` uses continuously morphing shapes to communicate a short wait with unknown progress. Material guidance recommends it for waits around 200ms–5s. For longer work or measurable completion, use [Linear Progress](/en-US/components/linear-progress) or [Circular Progress](/en-US/components/circular-progress).

The component does not measure request duration, delay its own appearance, detect completion, or accept percentage values. The application owns its loading state and mounting.

## Default and contained appearances

The default shape uses `primary` without a background. `contained` adds a circular `primary-container` surface and uses `on-primary-container` for the shape. Both follow inherited global or local MDV themes.

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

Contained is useful over content that needs a contrasting background. Each SVG cycles through seven shapes while rotating. The local SVG geometry approximates the MD3 shapes and motion; it is not a port of Android's polygon data.

## Overall size

`size` is a number in CSS pixels, defaulting to `48`. The SVG occupies `38/48` of that box in both appearances. The component keeps its layout space while animating.

<DemoBlock>
  <LoadingSizeDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const contained = ref(true)
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="contained" label="Use contained indicators" />
    <div class="flex flex-wrap items-center gap-6">
      <div v-for="size in [24, 48, 96, 240]" :key="size" class="grid justify-items-center gap-3">
        <MdvLoadingIndicator :size="size" :contained="contained" :label="`Loading at ${size}px`" />
        <span class="text-sm">{{ size }}px</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

Finite inputs are clamped to `24…240`; `NaN` and infinity fall back to `48`. Use a container with enough room for the selected size. `label` names the indicator for assistive technology and does not create a visible caption; captions in this demo are separate text.

## Pause, resume, and visibility

`paused` freezes the current shape and rotation phase. Resuming continues the animation; pausing does not change the unknown-progress semantics.

<DemoBlock>
  <LoadingPauseDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const paused = ref(false)
const visible = ref(true)
</script>

<template>
  <div class="grid justify-items-start gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="paused" label="Pause the animation" />
      <MdvCheckbox v-model="visible" label="Show the indicator" />
    </div>
    <div class="grid min-h-24 min-w-24 place-items-center">
      <MdvLoadingIndicator v-show="visible" :paused="paused || !visible" :size="96" contained label="Loading the preview" />
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ !visible ? 'Hidden and paused.' : paused ? 'Paused at the current frame. Loading is still in progress.' : 'Animating while the indicator is visible.' }}</p>
  </div>
</template>
```

  </template>
</DemoBlock>

The example combines `v-show` with `paused || !visible` so manually hiding the node immediately stops its frame loop. Use `v-if` when the indicator should be unmounted after loading.

MDV also suspends frames when the document is hidden, an available IntersectionObserver reports the indicator outside the viewport, or its KeepAlive view is deactivated. Reduced motion displays the stable first frame while preserving the loading role. Turning that preference off resumes the saved animation phase. Unmounting cleans up animation frames, observers, and listeners.

## Loading content, errors, and retry

Use `aria-busy` on the actual content region. Keep a meaningful completion/error status outside the busy region so the application can announce changes.

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

The example simulates a 1.2-second local request and clears its timer on unmount. The indicator is present only while loading. Try a failure and retry; neither outcome is inferred by the indicator. A real application should also own request cancellation and error handling.

## Decorative use inside a button

When a button's name already says that saving is in progress, make the nested indicator decorative to avoid an extra progressbar announcement. Set `aria-busy` and disabled behavior on the button explicitly.

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

This is an application composition through Button's leading slot. It uses a 24px indicator with `currentColor` so it matches the button foreground. It does not change Button's existing `loading` implementation. The example timer is disposed on unmount.

## Color variables

Use MDV roles for theme-aware local overrides. There is no `color` prop.

```vue
<MdvLoadingIndicator
  contained
  label="Loading preview"
  style="--mdv-loading-indicator-active-color: var(--mdv-sys-color-on-tertiary-container); --mdv-loading-indicator-container-color: var(--mdv-sys-color-tertiary-container)"
/>
```

<DocsTable label="Loading indicator color variables" min-width="31rem">

| Variable | Default | Contained |
| --- | --- | --- |
| `--mdv-loading-indicator-active-color` | `primary` | `on-primary-container` |
| `--mdv-loading-indicator-container-color` | No painted container | `primary-container` |

</DocsTable>

Keep at least 3:1 contrast between the graphic and its background. Forced-colors mode uses system `CanvasText`, with a `Canvas` background and outline for the contained appearance.

## Accessibility

- The default root is a nonfocusable `span` with `role="progressbar"`. Provide a task-specific English `label`, `aria-label`, or `aria-labelledby`; the built-in label defaults to Chinese. The internal SVG is decorative.
- An explicit `aria-label` or `aria-labelledby` takes priority over `label`. These names do not create visible text. Place a visible explanation alongside the indicator when readers need one.
- Unknown progress has no `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, or `aria-valuetext`; MDV removes forwarded values for these attributes as well. Use a progress component for numeric information.
- `decorative` removes the role, naming, and description attributes and sets `aria-hidden="true"`. Make sure its owner already communicates loading.
- The indicator does not move focus or create a live region. The surrounding task owns announcements, busy state, error text, and completion feedback. Animation frames do not repeatedly announce progress.

SSR produces a stable nonempty initial SVG, and the client reuses its graphic nodes. Validate custom integrations separately if SSR or assistive technology behavior is part of your application's requirements.

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
