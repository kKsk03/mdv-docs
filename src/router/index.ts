import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout.vue'
import { scrollToArticleHash } from './scroll'
import {
  defaultDocumentId,
  documentationPages,
  getRouteName,
  isLocale,
  locales,
} from '@/content/registry'

const preferredLocaleKey = 'mdv-docs-locale'

function preferredLocale() {
  if (typeof window === 'undefined') return 'en-US'

  try {
    const savedLocale = window.localStorage.getItem(preferredLocaleKey)
    if (isLocale(savedLocale)) return savedLocale
  } catch {
    // Storage may be unavailable in restricted browser contexts.
  }

  return window.navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en-US'
}

function localeFromPath(path: string) {
  const prefix = path.split('/')[1]
  return isLocale(prefix) ? prefix : null
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    // Vue Router runs this after the lazy page has rendered.
    return scrollToArticleHash(to.hash, router)
  },
  routes: [
    {
      path: '/',
      redirect: () => ({
        name: getRouteName(preferredLocale(), defaultDocumentId),
      }),
    },
    ...locales.map((locale) => ({
      path: `/${locale}`,
      component: Layout,
      children: [
        {
          path: '',
          redirect: { name: getRouteName(locale, defaultDocumentId) },
        },
        ...documentationPages.map((page) => ({
          path: page.slug,
          name: getRouteName(locale, page.id),
          component: page.documents[locale],
          props: page.id === defaultDocumentId ? { locale } : false,
          meta: {
            documentId: page.id,
            locale,
            title: page.title[locale],
          },
        })),
      ],
    })),
    {
      path: '/:pathMatch(.*)*',
      redirect: (to) => ({
        name: getRouteName(localeFromPath(to.path) ?? preferredLocale(), defaultDocumentId),
      }),
    },
  ],
})

export default router
