/// <reference types="vite/client" />

declare const __MDV_LIBRARY__: Readonly<{ version: string; components: number }>

declare module '*.md' {
  import type { Component } from 'vue'

  const component: Component
  export default component
}
