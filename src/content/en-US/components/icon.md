<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import IconBasicDemo from '@/components/docs/demos/icon/basic.vue'
import IconStyleDemo from '@/components/docs/demos/icon/style.vue'
import IconSizeColorDemo from '@/components/docs/demos/icon/sizeColor.vue'
import IconSemanticsDemo from '@/components/docs/demos/icon/semantics.vue'

const iconProps: ApiTableItem[] = [
  { name: 'icon', type: 'MdvIconData (required)', description: 'Local Iconify SVG data containing a string body. Pass the imported data object, not a string icon name.' },
  { name: 'size', type: 'MdvIconSize = number | string', default: '24px / container', description: 'Numbers are pixels; strings accept CSS lengths such as 1em, 2rem, and var(--icon-size). Omit inside supported button slots to follow their icon container.' },
  { name: 'color', type: 'string', default: 'currentColor', description: 'Direct CSS color, including an MDV color variable. This prop does not derive a color scheme from a seed.' },
]
</script>
# Icon

Use `MdvIcon` to render Iconify icon data. Import only the artwork you use.

## Material Symbols

Install the optional icon data package if you want to use Material Symbols. Then import each icon and pass it to `icon`.

```sh
pnpm add @iconify-icons/material-symbols
```

<DemoBlock>
  <IconBasicDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvIcon } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import searchIcon from '@iconify-icons/material-symbols/search'
import settingsIcon from '@iconify-icons/material-symbols/settings'

const icons = [
  { name: 'home-outline', data: homeIcon },
  { name: 'search', data: searchIcon },
  { name: 'settings', data: settingsIcon },
]
</script>

<template>
  <div class="flex flex-wrap gap-6">
    <div v-for="icon in icons" :key="icon.name" class="grid justify-items-center gap-3 rounded-xl bg-mdv-surface-container-low p-4">
      <MdvIcon :icon="icon.data" />
      <span class="text-sm">{{ icon.name }}</span>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Icon styles

Choose the outline, fill, or style in the imported artwork. It is not a runtime property of `MdvIcon`.

<DemoBlock>
  <IconStyleDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon } from '@mdv-ui/mdv'
import favorite from '@iconify-icons/material-symbols/favorite'
import favoriteOutline from '@iconify-icons/material-symbols/favorite-outline'
import favoriteRounded from '@iconify-icons/material-symbols/favorite-rounded'
import favoriteOutlineRounded from '@iconify-icons/material-symbols/favorite-outline-rounded'
import favoriteSharp from '@iconify-icons/material-symbols/favorite-sharp'
import favoriteOutlineSharp from '@iconify-icons/material-symbols/favorite-outline-sharp'

const filled = ref(false)
const styles = [
  { name: 'Outlined', outline: favoriteOutline, filled: favorite },
  { name: 'Rounded', outline: favoriteOutlineRounded, filled: favoriteRounded },
  { name: 'Sharp', outline: favoriteOutlineSharp, filled: favoriteSharp },
]
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="filled" label="Use filled artwork" />
    <div class="flex flex-wrap gap-6">
      <div v-for="style in styles" :key="style.name" class="grid min-w-24 justify-items-center gap-3">
        <MdvIcon :icon="filled ? style.filled : style.outline" :size="32" />
        <span class="text-sm">{{ style.name }}</span>
      </div>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Size and color

Icons inherit `currentColor` by default. Set `size` to a CSS length or a number in pixels. In a button, give the button itself its accessible name.

<DemoBlock>
  <IconSizeColorDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvIcon, MdvIconButton, MdvSelect } from '@mdv-ui/mdv'
import type { MdvIconSize } from '@mdv-ui/mdv'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'
import saveIcon from '@iconify-icons/material-symbols/save'

const size = ref<MdvIconSize>(32)
const sizes = [
  { value: 24, label: '24px (number)' },
  { value: 32, label: '32px (number)' },
  { value: '1em', label: '1em (font size)' },
  { value: '2rem', label: '2rem' },
  { value: 'var(--sample-icon-size)', label: 'CSS variable' },
]
</script>

<template>
  <div class="grid gap-6" style="--sample-icon-size: 40px">
    <MdvSelect :model-value="size" :options="sizes" label="Icon size" @update:model-value="size = $event as MdvIconSize" />
    <div class="flex min-h-16 flex-wrap items-center gap-6 text-2xl">
      <MdvIcon :icon="favoriteIcon" :size="size" class="text-mdv-primary" />
      <MdvIcon :icon="favoriteIcon" :size="size" color="var(--mdv-sys-color-error)" />
      <MdvIcon :icon="favoriteIcon" :size="size" color="#006c4c" />
    </div>
    <div class="flex flex-wrap items-center gap-5">
      <MdvButton><template #leading><MdvIcon :icon="saveIcon" /></template>Save draft</MdvButton>
      <MdvIconButton size="m" aria-label="Save draft"><MdvIcon :icon="saveIcon" /></MdvIconButton>
      <span class="text-sm text-mdv-on-surface-variant">Omit size inside buttons to follow their icon containers.</span>
    </div>
  </div>
</template>
```

  </template>
</DemoBlock>

## Decorative and meaningful icons

Leave the icon decorative when nearby text already gives its meaning. For a meaningful standalone icon, supply `aria-label` or `aria-labelledby`.

<DemoBlock>
  <IconSemanticsDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvCheckbox, MdvIcon } from '@mdv-ui/mdv'
import checkIcon from '@iconify-icons/material-symbols/check-circle-outline'
import warningIcon from '@iconify-icons/material-symbols/warning-outline'

const labelId = `attention-label-${useId()}`
const expose = ref(true)
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="expose" label="Expose the standalone status" />
    <div class="flex flex-wrap items-center gap-8">
      <span class="inline-flex items-center gap-2"><MdvIcon :icon="checkIcon" />Saved (decorative icon)</span>
      <MdvIcon :icon="checkIcon" :aria-label="expose ? 'Ready to sync' : undefined" color="var(--mdv-sys-color-primary)" />
      <span class="inline-flex items-center gap-2">
        <MdvIcon :icon="warningIcon" :aria-labelledby="labelId" color="var(--mdv-sys-color-error)" />
        <span :id="labelId">Needs attention</span>
      </span>
    </div>
    <p class="text-sm text-mdv-on-surface-variant">The standalone status is {{ expose ? 'named and exposed as an image' : 'decorative and hidden' }}. None of these icons is an action.</p>
  </div>
</template>
```

  </template>
</DemoBlock>

## Other local artwork

You can also pass trusted local artwork in Iconify format. `MdvIcon` does not sanitize SVG data.

---

## API

### Props

<ApiTable :items="iconProps" />

### Native attributes and semantics

`class`, `style`, `id`, ARIA, `data-*`, and native listeners reach the root SVG. The default role is `img`, and default hiding depends on whether `aria-label` or `aria-labelledby` supplies a name. The component keeps the source coordinates in `viewBox`.

There are no content slots, custom component events, or additional exposed methods. `@click` can be forwarded, but the SVG does not gain button semantics or native form behavior.

### Public types

```ts
import type { MdvIconData, MdvIconSize } from '@mdv-ui/mdv'

// MdvIconData is Iconify's local SVG data type.
// MdvIconSize is number | string.
```

MDV does not export a separate `MdvIconProps` type. You do not need to install a separate renderer or enable an online icon service.
