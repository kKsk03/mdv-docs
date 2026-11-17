import { expect, test, vi } from 'vitest'
import { nextTick } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { trackArticleHeadings } from '../src/router/heading-tracker.ts'
import { scrollToArticleHash } from '../src/router/scroll.ts'

async function mount(initial = '/docs?example=keep') {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  const root = document.createElement('div')
  root.className = 'docs-article-scroll'
  const article = document.createElement('article')
  article.className = 'docs-prose'
  root.append(article)
  document.body.append(root)
  Object.defineProperties(root, {
    clientHeight: { value: 400 },
    scrollHeight: { value: 1500 },
  })
  root.getBoundingClientRect = () => ({ top: 64, height: 400 }) as DOMRect
  const scroll = vi.fn()
  function addHeading(id: string, offset: number, hidden = false) {
    const heading = document.createElement('h2')
    heading.id = id
    heading.hidden = hidden
    heading.getBoundingClientRect = () => ({
      top: 64 + offset - root.scrollTop, height: 32,
    }) as DOMRect
    heading.scrollIntoView = scroll
    article.append(heading)
    return heading
  }
  addHeading('overview', 24)
  addHeading('安装组件库', 240)
  addHeading('hidden-section', 680, true)
  addHeading('引入样式', 700)
  addHeading('最后一步', 1400)

  let sequence = 0
  const frames = new Map<number, FrameRequestCallback>()
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    const id = ++sequence
    frames.set(id, callback)
    return id
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => {
    frames.delete(id)
  })

  const history = createMemoryHistory()
  const router = createRouter({
    history,
    routes: [
      { path: '/docs', component: {} },
      { path: '/other', component: {} },
    ],
    scrollBehavior: to => scrollToArticleHash(to.hash, router),
  })
  await router.push(initial)
  await nextTick()
  const push = vi.spyOn(history, 'push')
  const replace = vi.spyOn(history, 'replace')
  const stop = trackArticleHeadings(article, router)

  async function flush() {
    const queued = Array.from(frames.values())
    frames.clear()
    for (const callback of queued) callback(0)
    await new Promise<void>(resolve => setImmediate(resolve))
    await nextTick()
  }
  function scrollTo(top: number) {
    root.scrollTop = top
    root.dispatchEvent(new window.Event('scroll'))
  }

  return {
    root, article, router, scroll, push, replace, stop, scrollTo, flush, frames, addHeading,
    timerCount: () => vi.getTimerCount(),
    finishScroll: () => root.dispatchEvent(new window.Event('scrollend')),
    finishTimers() {
      vi.runOnlyPendingTimers()
    },
    close() {
      stop()
      root.remove()
    },
  }
}

test('manual scrolling replaces the router fragment without moving the viewport or adding history', async () => {
  const fixture = await mount()
  try {
    fixture.scrollTo(250)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#安装组件库')
    expect(fixture.router.currentRoute.value.path).toBe('/docs')
    expect(fixture.router.currentRoute.value.query.example).toBe('keep')
    expect(fixture.replace).toHaveBeenCalledTimes(1)
    expect(fixture.push).not.toHaveBeenCalled()
    expect(fixture.scroll).not.toHaveBeenCalled()
    expect(fixture.root.scrollTop).toBe(250)
    fixture.scrollTo(720)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#引入样式')
    expect(fixture.scroll).not.toHaveBeenCalled()
    fixture.scrollTo(250)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#安装组件库')
    expect(fixture.scroll).not.toHaveBeenCalled()
  } finally { fixture.close() }
})

test('tracking batches scroll events, skips hidden headings, and reaches the last short section', async () => {
  const fixture = await mount()
  try {
    fixture.scrollTo(250)
    fixture.scrollTo(720)
    expect(fixture.frames.size).toBe(1)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#引入样式')
    expect(fixture.replace).toHaveBeenCalledTimes(1)
    fixture.scrollTo(680)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#引入样式')
    fixture.scrollTo(1100)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#最后一步')
    fixture.scrollTo(0)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#overview')
  } finally { fixture.close() }
})

test('an explicit section link keeps its target during smooth scrolling and tracking resumes afterward', async () => {
  const fixture = await mount()
  try {
    await fixture.router.push({ hash: '#最后一步' })
    await nextTick()
    expect(fixture.scroll).toHaveBeenCalledTimes(1)
    fixture.scrollTo(250)
    await fixture.flush()
    fixture.scrollTo(720)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#最后一步')
    expect(fixture.replace).not.toHaveBeenCalled()
    fixture.finishScroll()
    fixture.scrollTo(250)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#安装组件库')
    expect(fixture.scroll).toHaveBeenCalledTimes(1)
  } finally { fixture.close() }
})

test('native fragment links suspend tracking before browser scrolling and use a scrollend fallback', async () => {
  const fixture = await mount('/docs#安装组件库')
  const preventBrowserDefault = (event: Event) => event.preventDefault()
  try {
    const link = document.createElement('a')
    link.href = `#${encodeURIComponent('最后一步')}`
    fixture.article.append(link)
    document.addEventListener('click', preventBrowserDefault, { once: true })
    link.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }))
    fixture.scrollTo(720)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#安装组件库')
    expect(fixture.timerCount()).toBe(1)
    fixture.finishTimers()
    fixture.scrollTo(720)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#引入样式')
  } finally {
    document.removeEventListener('click', preventBrowserDefault)
    fixture.close()
  }
})

test('manual input interrupts navigation locking and allows the current section to replace the target', async () => {
  const fixture = await mount()
  try {
    await fixture.router.push({ hash: '#最后一步' })
    await nextTick()
    fixture.root.dispatchEvent(new window.Event('wheel'))
    fixture.scrollTo(250)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#安装组件库')
    expect(fixture.scroll).toHaveBeenCalledTimes(1)
  } finally { fixture.close() }
})

test('tracking uses the new article after route changes and recovers from cancelled navigation', async () => {
  const fixture = await mount()
  try {
    await fixture.router.push('/other')
    fixture.article.replaceChildren()
    fixture.addHeading('other-overview', 24)
    fixture.addHeading('other-section', 240)
    fixture.scrollTo(250)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.path).toBe('/other')
    expect(fixture.router.currentRoute.value.hash).toBe('#other-section')
    const removeGuard = fixture.router.beforeEach(to => to.path === '/docs' ? false : undefined)
    await fixture.router.push('/docs')
    removeGuard()
    fixture.scrollTo(0)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.path).toBe('/other')
    expect(fixture.router.currentRoute.value.hash).toBe('#other-overview')
  } finally { fixture.close() }
})

test('disposing tracking cancels queued work and removes scroll and router listeners', async () => {
  const fixture = await mount()
  try {
    await fixture.router.push({ hash: '#最后一步' })
    await nextTick()
    fixture.finishScroll()
    fixture.scrollTo(250)
    expect(fixture.frames.size).toBe(1)
    fixture.stop()
    expect(fixture.frames.size).toBe(0)
    expect(fixture.timerCount()).toBe(0)
    fixture.scrollTo(720)
    await fixture.flush()
    expect(fixture.router.currentRoute.value.hash).toBe('#最后一步')
    await fixture.router.push({ hash: '#安装组件库' })
    await nextTick()
    expect(fixture.timerCount()).toBe(0)
  } finally { fixture.close() }
})
