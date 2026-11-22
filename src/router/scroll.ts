import { nextTick } from 'vue'
import type { Router } from 'vue-router'

const trackedLocations = new WeakMap<Router, string>()
const scrollObservers = new WeakMap<HTMLElement, () => void>()

export function isTrackedArticleLocation(router: Router, fullPath: string): boolean {
  return trackedLocations.get(router) === fullPath
}

export async function replaceTrackedArticleHash(router: Router, hash: string) {
  const current = router.currentRoute.value
  const location = { path: current.path, query: current.query, hash }
  const fullPath = router.resolve(location).fullPath
  trackedLocations.set(router, fullPath)
  try {
    await router.replace(location)
    // Keep the marker through Vue Router's deferred scrollBehavior callback.
    await nextTick()
  } finally {
    if (trackedLocations.get(router) === fullPath) trackedLocations.delete(router)
  }
}

export function observeArticleScroll(root: HTMLElement, callback: () => void) {
  scrollObservers.set(root, callback)
  return () => {
    if (scrollObservers.get(root) === callback) scrollObservers.delete(root)
  }
}

export function scrollToArticleHash(hash: string, router?: Router): false {
  if (router && isTrackedArticleLocation(router, router.currentRoute.value.fullPath)) return false
  if (!hash || typeof document === 'undefined') return false

  let id: string
  try {
    id = decodeURIComponent(hash.slice(1))
  } catch {
    return false
  }

  // The landing page opts in to fragment scrolling without mounting an article.
  // Entering and leaving pages can briefly contain the same heading ID.
  const target = Array.from(document.querySelectorAll<HTMLElement>('.docs-prose [id], [data-docs-anchor][id]'))
    .find(element => element.id === id && !element.closest('[inert], [aria-hidden="true"]'))
  if (target) {
    const root = target.closest<HTMLElement>('.docs-article-scroll')
    if (root) scrollObservers.get(root)?.()
    const reducedMotion = target.ownerDocument.defaultView
      ?.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    // The scaffold owns scrolling; Vue Router's window scrolling cannot reach it.
    target.scrollIntoView({
      behavior: reducedMotion ? 'instant' : 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }
  return false
}
