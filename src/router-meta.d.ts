import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    documentId?: string
    locale?: 'en-US' | 'zh-CN'
    title?: string
  }
}
