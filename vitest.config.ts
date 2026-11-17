import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default defineConfig(config => mergeConfig(viteConfig(config), {
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'jsdom',
    environmentOptions: { jsdom: { pretendToBeVisual: true } },
    setupFiles: ['./tests/setup.ts'],
    pool: 'threads',
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
  },
}))
