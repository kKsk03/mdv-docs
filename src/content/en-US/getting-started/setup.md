# Setup

Follow these steps to add `Material Design Vue` to your project.

## 1. Install the package

You can install it with `npm`, `pnpm`, or `yarn`.

::: code-tabs
@tab npm
```sh
npm install @mdv-ui/mdv
```

@tab pnpm
```sh
pnpm add @mdv-ui/mdv
```

@tab yarn
```sh
yarn add @mdv-ui/mdv
```
:::

The remaining steps use `pnpm` for the examples.

## 2. Configure Tailwind CSS

`MDV` requires `Tailwind CSS` v4. Install `Tailwind CSS` and its `Vite` plugin:

```sh
pnpm add -D tailwindcss@4 @tailwindcss/vite@4
```

Next, add the `Tailwind` plugin to your existing `vite.config.ts`, keeping the rest of your project configuration:

```ts:line-numbers
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

## 3. Import styles

In your project's `CSS` entry file, such as `src/style.css`, add the following imports in this order:

```css:line-numbers
@import 'tailwindcss';
@import '@mdv-ui/mdv/theme';
@import '@mdv-ui/mdv/styles';
```

These imports provide `Tailwind CSS`, the `MDV` theme and fonts, and component styles, respectively.
Make sure to import this file in `src/main.ts`:

```ts
import './style.css'
```

4. Use icons (optional, but recommended)

`MdvIcon` uses local `Iconify` icon data. If you need icons, install the `Material Symbols` data package for use in your project:

```sh
pnpm add @iconify-icons/material-symbols
```

5. Use components

Import the `MDV` components you need in a `Vue` single-file component:

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <MdvButton>Get started</MdvButton>
</template>
```
