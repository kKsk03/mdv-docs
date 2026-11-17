# 安装与配置

按照以下步骤，将 `Material Design Vue` 接入您的项目。  

## 1. 安装组件库

您可以使用 `npm`、`pnpm` 或 `yarn` 安装。  

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

后续步骤将使用 `pnpm` 进行演示。  

## 2. 配置 Tailwind CSS

`MDV` 需要配合 `Tailwind CSS` v4 使用。安装 `Tailwind CSS` 及其 `Vite` 插件：

```sh
pnpm add -D tailwindcss@4 @tailwindcss/vite@4
```

随后，在已有的 `vite.config.ts` 中添加 `Tailwind` 插件，保留项目的其他配置：  

```ts:line-numbers
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
})
```

## 3. 引入样式

在项目的 `CSS` 入口文件中，例如 `src/style.css`，按顺序添加：  

```css:line-numbers
@import 'tailwindcss';
@import '@mdv-ui/mdv/theme';
@import '@mdv-ui/mdv/styles';
```

这三项分别提供 `Tailwind CSS`、`MDV` 主题与字体，以及组件样式。  
确保在 `src/main.ts` 中引入该文件：  

```ts
import './style.css'
```

4. 使用图标（可选，但推荐）

`MdvIcon` 使用本地 `Iconify` 图标数据。需要使用图标时，可以安装 `Material Symbols` 数据包以方便后续使用：  

```sh
pnpm add @iconify-icons/material-symbols
```

5. 使用组件

在 `Vue` 单文件组件中导入需要的 `MDV` 组件：  

```vue:line-numbers
<script setup lang="ts">
import { MdvButton } from '@mdv-ui/mdv'
</script>

<template>
  <MdvButton>开始使用</MdvButton>
</template>
```