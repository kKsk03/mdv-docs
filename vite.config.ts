import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Markdown from 'unplugin-vue-markdown/vite'
import Shiki from '@shikijs/markdown-exit'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { markdownCode, withCodeImports } from './build/markdown-code.ts'
import { markdownHeadings } from './build/markdown-headings.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    // Preserve native :dir() matching; lowering it to :lang() breaks scoped RTL demos.
    cssTarget: ['chrome120', 'edge120', 'firefox114', 'safari16.4', 'ios16.4'],
  },
  plugins: [
    vue({ include: [/\.vue$/, /\.md$/] }),
    Markdown({
      markdownSetup(md) {
        md.use(
          Shiki({
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
            defaultColor: false,
          }),
        )
        md.use(markdownCode)
        md.use(markdownHeadings)
      },
      transforms: { after: withCodeImports },
    }),
    ...(mode === 'test' ? [] : [vueDevTools(), tailwindcss()]),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
