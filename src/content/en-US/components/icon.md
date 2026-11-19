<script setup lang="ts">
import DemoBlock from '@/components/docs/DemoBlock.vue'
import DocsTable from '@/components/docs/DocsTable.vue'
import ApiTable from '@/components/docs/ApiTable.vue'
import type { ApiTableItem } from '@/components/docs/api-table.types'
import IconBasicDemo from '@/components/docs/demos/icon/basic.vue'
import IconStyleDemo from '@/components/docs/demos/icon/style.vue'
import IconSizeColorDemo from '@/components/docs/demos/icon/sizeColor.vue'
import IconSemanticsDemo from '@/components/docs/demos/icon/semantics.vue'
import IconCustomDemo from '@/components/docs/demos/icon/custom.vue'

const iconProps: ApiTableItem[] = [
  { name: 'icon', type: 'MdvIconData (required)', description: 'Local Iconify SVG data containing a string body. Pass the imported data object, not a string icon name.' },
  { name: 'size', type: 'MdvIconSize = number | string', default: '24px / container', description: 'Numbers are pixels; strings accept CSS lengths such as 1em, 2rem, and var(--icon-size). Omit inside supported button slots to follow their icon container.' },
  { name: 'color', type: 'string', default: 'currentColor', description: 'Direct CSS color, including an MDV color variable. This prop does not derive a color scheme from a seed.' },
]
</script>

# Icon

`MdvIcon` renders local SVG data through `@iconify/vue/offline`, which is included with MDV. The icon is available synchronously without an icon API request or font CDN. Use it for decorative or meaningful imagery; an icon-only action belongs in [IconButton](/en-US/components/icon-button).

## Install icon data and import individual icons

To use Material Symbols, add its data package to your application:

```sh
pnpm add @iconify-icons/material-symbols
```

Import each icon from its own subpath, as in the example below. Installing the data package adds it to your local dependencies; it does not by itself bundle the whole collection into the site. The application bundler includes the modules you actually import. MDV does not import or register the full collection for `MdvIcon`.

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

Keep static individual imports. Importing an entire collection, registering all its data, or dynamically matching every icon file can make that data reachable by the build and increase the output. The built-in icons of other MDV components are already provided by those components; this package is needed when your application imports its own Material Symbols data.

`icon` expects an object such as `homeIcon`, not a name like `'material-symbols:home'`. Invalid input renders an empty icon box and warns in development, without attempting a network fallback.

## Styles and filled artwork

Material Symbols style and fill are determined by the imported SVG data. MDV recommends the Outlined 400 baseline; Rounded and Sharp artwork are available through their own subpaths.

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

<DocsTable label="Material Symbols individual import names" min-width="29rem">

| Style | Outline artwork | Filled artwork |
| --- | --- | --- |
| Outlined | `favorite-outline` | `favorite` |
| Rounded | `favorite-outline-rounded` | `favorite-rounded` |
| Sharp | `favorite-outline-sharp` | `favorite-sharp` |

</DocsTable>

Each name follows `@iconify-icons/material-symbols/`. Switching the data changes the glyph; there is no variable-font `FILL`, `wght`, `GRAD`, or `opsz` prop, and changing size does not automatically select another optical drawing.

## Size, color, and button composition

Standalone icons default to 24 × 24px. Numbers use pixels, while CSS strings can follow font size or a local variable. Color inherits `currentColor` unless explicitly supplied.

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

The first icon inherits primary text color, the second uses the error token, and the third uses a literal CSS color. `MdvIcon` does not interpret `success` as an MDV semantic role or a hexadecimal value as a theme seed: use `var(--mdv-sys-color-success)` for a theme-aware semantic color.

Inside Button or IconButton, omit `size` so the icon follows the button's dimensions. Explicit size overrides the SVG, but does not enlarge the enclosing button or reserve more space. `style` takes precedence over the size/color props and accepts the normal Vue object, string, or array forms.

## Decorative and meaningful icons

The default icon has `aria-hidden="true"` and `focusable="false"`. If adjacent text already conveys the same information, leave it decorative. A standalone status can receive `aria-label` or reference existing text with `aria-labelledby`.

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

A non-empty name removes the default hiding and keeps image semantics. Explicit `aria-hidden` takes priority; the application must ensure referenced label elements exist. Naming an icon does not put it in the Tab order or make it an action. A native `title` is not a substitute for an accessible name or an MDV Tooltip.

Put an action name on the button and keep its inner icon decorative. Avoid adding click behavior to a standalone SVG when the interaction needs button keyboard, focus, disabled, or form behavior.

## Other local artwork

The data type also accepts other icon collections or trusted local artwork in Iconify format. A string `body` is required; supply the original width/height to retain the intended coordinate system.

<DemoBlock>
  <IconCustomDemo />
  <template #source>

```vue:line-numbers
<script setup lang="ts">
import { MdvButton, MdvIcon } from '@mdv-ui/mdv'
import type { MdvIconData } from '@mdv-ui/mdv'

// Trusted local artwork in Iconify's data format; no icon-data package is needed.
const diamond: MdvIconData = {
  width: 24,
  height: 24,
  body: '<path fill="currentColor" d="M12 2 22 12 12 22 2 12Z"/>',
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-6">
    <span class="inline-flex items-center gap-2 text-mdv-primary"><MdvIcon :icon="diamond" :size="32" />Local artwork</span>
    <MdvButton variant="tonal"><template #leading><MdvIcon :icon="diamond" /></template>Explore collection</MdvButton>
  </div>
</template>
```

  </template>
</DemoBlock>

This example does not need an external icon-data package. MDV renders the supplied SVG data and does not sanitize it. Pure-path Material Symbols render synchronously in SSR; custom gradients, clip paths, and internal IDs need their own SSR/hydration checks.

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
