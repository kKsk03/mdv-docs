import { nextTick } from 'vue'
import type { Router } from 'vue-router'
import { getArticleHeadings } from '../content/article-headings.ts'
import {
  isTrackedArticleLocation,
  observeArticleScroll,
  replaceTrackedArticleHash,
} from './scroll.ts'

export function trackArticleHeadings(article: HTMLElement, router: Router): () => void {
  const root = article.closest<HTMLElement>('.docs-article-scroll')
  const view = article.ownerDocument.defaultView
  if (!root || !view) return () => {}

  let stopped = false
  let navigating = false
  let changingPage = false
  let replacing = false
  let pagePath = router.currentRoute.value.path
  let pendingHash: string | undefined
  let frame: number | undefined
  let settleTimer: number | undefined

  function finishNavigation() {
    navigating = false
    view!.clearTimeout(settleTimer)
    settleTimer = undefined
  }

  function waitForScrollEnd() {
    view!.clearTimeout(settleTimer)
    // Fallback for browsers without scrollend, including a target already in view.
    settleTimer = view!.setTimeout(finishNavigation, 200)
  }

  function pauseForNavigation() {
    navigating = true
    pendingHash = undefined
    waitForScrollEnd()
  }

  async function replaceHash() {
    if (replacing) return
    replacing = true
    try {
      while (pendingHash && !stopped && !navigating && !changingPage) {
        const hash = pendingHash
        pendingHash = undefined
        if (pagePath !== router.currentRoute.value.path) break
        if (hash !== router.currentRoute.value.hash) await replaceTrackedArticleHash(router, hash)
      }
    } catch {
      // Vue Router reports navigation errors; retry tracking on the next user scroll.
      pendingHash = undefined
    } finally {
      replacing = false
    }
  }

  function update() {
    frame = undefined
    if (stopped || navigating || changingPage || pagePath !== router.currentRoute.value.path) return
    const headings = getArticleHeadings(article)
      .filter(heading => heading.getBoundingClientRect().height > 0)
    if (!headings.length) return

    const readingLine = root!.getBoundingClientRect().top + 24
    let active = headings[0]!
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= readingLine) active = heading
    }
    if (root!.scrollHeight > root!.clientHeight &&
      root!.scrollTop + root!.clientHeight >= root!.scrollHeight - 2) {
      active = headings[headings.length - 1]!
    }
    pendingHash = `#${active.id}`
    void replaceHash()
  }

  function onScroll() {
    if (navigating) {
      waitForScrollEnd()
    } else if (frame === undefined) {
      frame = view!.requestAnimationFrame(update)
    }
  }

  function onInput(event: Event) {
    if (event.defaultPrevented) return
    if (event.type === 'keydown' && ![
      'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ',
    ].includes((event as KeyboardEvent).key)) return
    finishNavigation()
  }

  function onClick(event: MouseEvent) {
    if (event.defaultPrevented || event.button || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    const link = (event.target as Element | null)?.closest?.('a[href]')
    if (!link || link.hasAttribute('download') ||
      (link.getAttribute('target') && link.getAttribute('target') !== '_self')) return
    const url = new URL(link.getAttribute('href')!, article.ownerDocument.baseURI)
    const current = new URL(article.ownerDocument.URL)
    if (url.origin === current.origin && url.pathname === current.pathname &&
      url.search === current.search && url.hash) pauseForNavigation()
  }

  const stopObserving = observeArticleScroll(root, pauseForNavigation)
  const removeBeforeGuard = router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      changingPage = true
      pendingHash = undefined
    } else if (to.hash !== from.hash && !isTrackedArticleLocation(router, to.fullPath)) {
      pauseForNavigation()
    }
  })
  const removeAfterGuard = router.afterEach((to, from, failure) => {
    if (failure) {
      changingPage = false
      finishNavigation()
    } else if (to.path !== from.path) {
      void nextTick(() => {
        if (!stopped && router.currentRoute.value.path === to.path) {
          pagePath = to.path
          changingPage = false
        }
      })
    }
  })
  root.addEventListener('scroll', onScroll, { passive: true })
  root.addEventListener('scrollend', finishNavigation)
  root.addEventListener('wheel', onInput, { passive: true })
  root.addEventListener('touchstart', onInput, { passive: true })
  root.addEventListener('pointerdown', onInput, { passive: true })
  root.addEventListener('keydown', onInput)
  article.addEventListener('click', onClick)

  return () => {
    stopped = true
    pendingHash = undefined
    finishNavigation()
    if (frame !== undefined) view.cancelAnimationFrame(frame)
    stopObserving()
    removeBeforeGuard()
    removeAfterGuard()
    root.removeEventListener('scroll', onScroll)
    root.removeEventListener('scrollend', finishNavigation)
    root.removeEventListener('wheel', onInput)
    root.removeEventListener('touchstart', onInput)
    root.removeEventListener('pointerdown', onInput)
    root.removeEventListener('keydown', onInput)
    article.removeEventListener('click', onClick)
  }
}
