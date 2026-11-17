import { expect, test, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import OnThisPage from '../src/components/docs/OnThisPage.vue'
import { readArticleOutline } from '../src/content/article-headings.ts'
import { scrollToArticleHash } from '../src/router/scroll.ts'
import enUS from '../src/locales/en-US.ts'
import zhCN from '../src/locales/zh-CN.ts'
import { renderMarkdown } from './markdown.ts'

test('the outline uses Markdown titles, nests third-level sections, and maps deeper headings to their section', async () => {
  const compiled = await renderMarkdown([
    '# Button',
    '### Opening notes',
    '## Use **MDV** with `Vue`',
    '### 颜色配置',
    '#### Detailed options',
    '### 颜色配置',
    '<h2 id="demo-title">An embedded demo title</h2>',
  ].join('\n\n'))
  const article = document.createElement('article')
  article.innerHTML = compiled.template
  const hidden = document.createElement('div')
  hidden.setAttribute('inert', '')
  hidden.innerHTML = '<h2 id="hidden-code-title" data-docs-heading>Hidden source heading</h2>'
  article.append(hidden)
  const outline = readArticleOutline(article)

  expect(outline.title).toEqual({ id: 'button', text: 'Button' })
  expect(outline.items).toEqual([
    { id: 'opening-notes', text: 'Opening notes', children: [] },
    {
      id: 'use-mdv-with-vue', text: 'Use MDV with Vue',
      children: [
        { id: '颜色配置', text: '颜色配置' },
        { id: '颜色配置-1', text: '颜色配置' },
      ],
    },
  ])
  expect(outline.sections['detailed-options']).toBe('颜色配置')
  expect(outline.sections['demo-title']).toBeUndefined()
  expect(outline.sections['hidden-code-title']).toBeUndefined()
})

async function fixture() {
  const root = document.createElement('div')
  root.className = 'docs-article-scroll'
  const article = document.createElement('article')
  article.className = 'docs-prose'
  root.append(article)
  document.body.append(root)
  const compiled = await renderMarkdown([
    '# 按钮', '## 变体', '## 颜色', '### 自定义颜色', '#### 详细选项', '## API',
  ].join('\n\n'))
  article.innerHTML = compiled.template
  const scroll = vi.fn()
  article.querySelectorAll<HTMLElement>('[data-docs-heading]').forEach(heading => {
    heading.scrollIntoView = scroll
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/docs', component: {} },
      { path: '/other', component: {} },
    ],
    scrollBehavior: to => scrollToArticleHash(to.hash, router),
  })
  await router.push('/docs?example=keep')
  const i18n = createI18n({
    legacy: false,
    locale: 'zh-CN',
    messages: { 'en-US': enUS, 'zh-CN': zhCN },
  })
  const wrapper = mount(OnThisPage, {
    props: { article },
    attachTo: root,
    global: { plugins: [router, i18n] },
  })
  await nextTick()
  return { article, router, i18n, wrapper, scroll }
}

test('outline links navigate to nested sections, preserve the query, and close the compact disclosure', async () => {
  const { router, wrapper, scroll } = await fixture()
  const toggle = wrapper.get('.docs-outline__toggle')
  const navigation = wrapper.get('nav')
  expect(toggle.attributes('aria-controls')).toBe(navigation.attributes('id'))
  expect(toggle.attributes('aria-expanded')).toBe('false')
  expect(navigation.attributes('inert')).toBeDefined()
  expect(navigation.attributes('aria-hidden')).toBe('true')
  await toggle.trigger('click')
  expect(toggle.attributes('aria-expanded')).toBe('true')
  expect(navigation.attributes('inert')).toBeUndefined()
  expect(navigation.attributes('aria-hidden')).toBeUndefined()

  const nested = wrapper.get('.docs-outline__sublist a')
  expect(nested.text()).toBe('自定义颜色')
  expect(decodeURIComponent(nested.attributes('href')!)).toBe('/docs?example=keep#自定义颜色')
  await nested.trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.hash).toBe('#自定义颜色')
  expect(router.currentRoute.value.query.example).toBe('keep')
  expect(toggle.attributes('aria-expanded')).toBe('false')
  expect(navigation.attributes('inert')).toBeDefined()
  expect(navigation.attributes('aria-hidden')).toBe('true')
  expect(wrapper.findAll('[aria-current="location"]')).toHaveLength(1)
  expect(nested.attributes('aria-current')).toBe('location')
  expect(scroll).toHaveBeenCalledOnce()
  expect(scroll.mock.calls[0]).toEqual([{
    behavior: 'smooth', block: 'start', inline: 'nearest',
  }])
})

test('compact navigation waits for the collapse before scrolling and cancels when reopened', async () => {
  const { router, wrapper, scroll } = await fixture()
  const toggle = wrapper.get('.docs-outline__toggle')
  const content = wrapper.get('.docs-outline__content').element
  let finishCollapse!: () => void
  const finished = new Promise<void>(resolve => { finishCollapse = resolve })
  const animations = vi.fn(() => [{ finished }])
  Object.defineProperty(content, 'getAnimations', { value: animations })
  await toggle.trigger('click')
  await wrapper.get('.docs-outline__sublist a').trigger('click')
  await flushPromises()
  expect(toggle.attributes('aria-expanded')).toBe('false')
  expect(router.currentRoute.value.hash).toBe('')
  expect(scroll).not.toHaveBeenCalled()

  finishCollapse()
  await flushPromises()
  expect(router.currentRoute.value.hash).toBe('#自定义颜色')
  expect(scroll).toHaveBeenCalledOnce()

  const nextFinished = new Promise<void>(resolve => { finishCollapse = resolve })
  animations.mockReturnValue([{ finished: nextFinished }])
  await toggle.trigger('click')
  await wrapper.get('a[href$="#api"]').trigger('click')
  await toggle.trigger('click')
  finishCollapse()
  await flushPromises()
  expect(toggle.attributes('aria-expanded')).toBe('true')
  expect(router.currentRoute.value.hash).toBe('#自定义颜色')
  expect(scroll).toHaveBeenCalledOnce()
})

test('the desktop outline stays accessible and a collapsed compact outline becomes inert again', async () => {
  const viewport = Object.assign(new EventTarget(), {
    matches: true,
    media: '(min-width: 1280px)',
  })
  const originalMatchMedia = window.matchMedia
  vi.stubGlobal('matchMedia', (query: string) => query === viewport.media ? viewport : originalMatchMedia(query))
  const { wrapper } = await fixture()
  const navigation = wrapper.get('nav')
  const toggle = wrapper.get('.docs-outline__toggle')
  expect(toggle.attributes('aria-expanded')).toBe('false')
  expect(navigation.attributes('inert')).toBeUndefined()
  expect(navigation.attributes('aria-hidden')).toBeUndefined()

  viewport.matches = false
  viewport.dispatchEvent(new Event('change'))
  await nextTick()
  expect(navigation.attributes('inert')).toBeDefined()
  expect(navigation.attributes('aria-hidden')).toBe('true')

  await toggle.trigger('click')
  expect(navigation.attributes('inert')).toBeUndefined()
  viewport.matches = true
  viewport.dispatchEvent(new Event('change'))
  await nextTick()
  expect(navigation.attributes('inert')).toBeUndefined()
})

test('current-section changes select the matching outline entry, including a deeper heading', async () => {
  const { router, wrapper } = await fixture()
  await router.replace({ hash: '#api' })
  await flushPromises()
  expect(wrapper.get('[aria-current="location"]').text()).toBe('API')
  await router.replace({ hash: `#${encodeURIComponent('详细选项')}` })
  await flushPromises()
  expect(wrapper.get('[aria-current="location"]').text()).toBe('自定义颜色')
  expect(wrapper.findAll('[aria-current="location"]')).toHaveLength(1)
})

test('one selection indicator follows nested sections and stays aligned when the outline scrolls or resizes', async () => {
  const { router, wrapper } = await fixture()
  const navigation = wrapper.get('nav').element
  const indicator = wrapper.get<HTMLElement>('.docs-outline__indicator').element
  let viewportHeight = 100
  let nestedHeight = 56
  Object.defineProperty(navigation, 'clientHeight', { get: () => viewportHeight })
  navigation.getBoundingClientRect = () => ({ top: 100, left: 0, bottom: 200 }) as DOMRect
  const measure = vi.fn((index: number) => {
    const nested = index === 2
    const top = 100 + [8, 48, 88, 152][index]! - navigation.scrollTop
    const height = nested ? nestedHeight : 36
    return { top, bottom: top + height, left: nested ? 20 : 8, width: nested ? 168 : 180, height } as DOMRect
  })
  wrapper.findAll('.docs-outline__link').forEach((link, index) => {
    link.element.getBoundingClientRect = () => measure(index)
  })

  window.dispatchEvent(new Event('resize'))
  expect(indicator.hidden).toBe(false)
  expect(indicator.style.transform).toBe('translate(8px, 8px)')
  expect(indicator.style.height).toBe('36px')
  expect(indicator.style.transition).toBe('none')

  await router.replace({ hash: '#自定义颜色' })
  await flushPromises()
  expect(wrapper.get('.docs-outline__indicator').element).toBe(indicator)
  expect(indicator.style.transform).toBe('translate(20px, 88px)')
  expect(indicator.style.width).toBe('168px')
  expect(indicator.style.height).toBe('56px')
  expect(indicator.style.transition).toBe('')
  expect(navigation.scrollTop).toBe(44)
  expect(navigation.closest('.docs-article-scroll')!.scrollTop).toBe(0)

  // Unchanged measurements preserve an ongoing selection animation.
  window.dispatchEvent(new Event('resize'))
  expect(indicator.style.transition).toBe('')
  nestedHeight = 72
  window.dispatchEvent(new Event('resize'))
  expect(indicator.style.height).toBe('72px')
  expect(indicator.style.transition).toBe('none')

  viewportHeight = 0
  window.dispatchEvent(new Event('resize'))
  expect(indicator.hidden).toBe(true)
  viewportHeight = 100
  window.dispatchEvent(new Event('resize'))
  expect(indicator.hidden).toBe(false)

  wrapper.unmount()
  measure.mockClear()
  window.dispatchEvent(new Event('resize'))
  expect(measure).not.toHaveBeenCalled()
})

test('new article content and locale labels replace the previous outline without retaining demo headings', async () => {
  const { article, router, i18n, wrapper } = await fixture()
  await router.push('/other')
  const compiled = await renderMarkdown('# Setup\n\n## Install\n\n### Configure CSS')
  article.innerHTML = compiled.template
  i18n.global.locale.value = 'en-US'
  await flushPromises()
  expect(wrapper.get('nav').attributes('aria-label')).toBe('On this page')
  expect(wrapper.get('.docs-outline__title').text()).toBe('Setup')
  expect(wrapper.findAll('a').map(link => link.text())).toEqual(['Install', 'Configure CSS'])

  article.innerHTML = '<h1 id="introduction" data-docs-heading>Introduction</h1>'
  await flushPromises()
  expect(wrapper.find('aside').exists()).toBe(false)
})
