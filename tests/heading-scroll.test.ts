import { expect, test, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { createMemoryHistory, createRouter, RouterView } from 'vue-router'
import { scrollToArticleHash } from '../src/router/scroll.ts'
import { setReducedMotion } from './setup.ts'

test('fragment scrolling finds encoded Chinese IDs inside the article and ignores missing targets', () => {
  const article = document.createElement('article')
  article.className = 'docs-prose'
  const heading = document.createElement('h2')
  heading.id = '代码块标题'
  const scroll = vi.fn()
  heading.scrollIntoView = scroll
  article.append(heading)
  document.body.append(article)
  try {
    expect(scrollToArticleHash(`#${encodeURIComponent(heading.id)}`)).toBe(false)
    expect(scroll.mock.calls[0]).toEqual([{
      behavior: 'smooth', block: 'start', inline: 'nearest',
    }])
    scrollToArticleHash('#代码块标题')
    expect(scroll).toHaveBeenCalledTimes(2)
    for (const hash of ['', '#missing', '#%invalid']) scrollToArticleHash(hash)
    expect(scroll).toHaveBeenCalledTimes(2)
  } finally { article.remove() }
})

test('fragment navigation selects the entering page when leaving content has the same heading ID', () => {
  const article = document.createElement('article')
  article.className = 'docs-prose'
  const leaving = document.createElement('div')
  leaving.setAttribute('inert', '')
  leaving.setAttribute('aria-hidden', 'true')
  const oldHeading = document.createElement('h2')
  oldHeading.id = 'api'
  oldHeading.scrollIntoView = vi.fn()
  leaving.append(oldHeading)
  const newHeading = document.createElement('h2')
  newHeading.id = 'api'
  newHeading.scrollIntoView = vi.fn()
  article.append(leaving, newHeading)
  document.body.append(article)

  scrollToArticleHash('#api')
  expect(oldHeading.scrollIntoView).not.toHaveBeenCalled()
  expect(newHeading.scrollIntoView).toHaveBeenCalledOnce()
})

test('fragment navigation honors reduced motion instead of forcing a scroll animation', () => {
  const article = document.createElement('article')
  article.className = 'docs-prose'
  const heading = document.createElement('h2')
  heading.id = 'reduced-motion'
  const scroll = vi.fn()
  heading.scrollIntoView = scroll
  article.append(heading)
  document.body.append(article)
  try {
    setReducedMotion(true)
    scrollToArticleHash('#reduced-motion')
    expect(scroll.mock.calls[0]).toEqual([{
      behavior: 'instant', block: 'start', inline: 'nearest',
    }])
    setReducedMotion(false)
    scrollToArticleHash('#reduced-motion')
    expect(scroll.mock.calls[1]).toEqual([{
      behavior: 'smooth', block: 'start', inline: 'nearest',
    }])
  } finally {
    setReducedMotion(false)
    article.remove()
  }
})

test('direct section URLs wait for lazy route content and same-page router navigation scrolls again', async () => {
  const host = document.createElement('div')
  document.body.append(host)
  const scroll = vi.fn<(this: HTMLElement, options?: ScrollIntoViewOptions) => void>()
  const Article = {
    render: () => h('article', { class: 'docs-prose' }, ['配置', 'next'].map(id =>
      h('h2', { id, ref: (element: unknown) => {
        if (element instanceof HTMLElement) element.scrollIntoView = scroll
      } }, id),
    )),
  }
  const history = createMemoryHistory()
  history.push(`/docs#${encodeURIComponent('配置')}`)
  const router = createRouter({
    history,
    routes: [{ path: '/docs', component: async () => Article }],
    scrollBehavior: to => scrollToArticleHash(to.hash),
  })
  const wrapper = mount(RouterView, { attachTo: host, global: { plugins: [router] } })
  try {
    await router.isReady()
    await nextTick()
    expect(scroll).toHaveBeenCalledTimes(1)
    expect(scroll.mock.contexts[0]!.id).toBe('配置')
    expect(scroll.mock.calls[0]![0]?.behavior).toBe('smooth')
    await router.push({ hash: '#next' })
    await nextTick()
    expect(scroll).toHaveBeenCalledTimes(2)
    expect(scroll.mock.contexts[1]!.id).toBe('next')
    await router.push({ hash: '#missing' })
    await nextTick()
    expect(scroll).toHaveBeenCalledTimes(2)
  } finally {
    wrapper.unmount()
    host.remove()
  }
})
