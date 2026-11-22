import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, expect, test, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import App from '../src/App.vue'
import { navigationItems } from '../src/content/registry.ts'
import enUS from '../src/locales/en-US.ts'
import zhCN from '../src/locales/zh-CN.ts'
import router from '../src/router/index.ts'

afterEach(() => {
  localStorage.removeItem('mdv-docs-locale')
})

test.each([
  { locale: 'en-US', heading: 'Component Library', fragment: 'component-library', linkLabel: 'Link to section: Component Library' },
  { locale: 'zh-CN', heading: '组件库', fragment: '组件库', linkLabel: '跳转到章节：组件库' },
] as const)('the $locale landing route shows the component library without an article layout', async ({ locale, heading, fragment, linkLabel }) => {
  const components = navigationItems.find(item => item.id === 'components' && 'pages' in item)
  if (!components || !('pages' in components)) throw new Error('Missing components in the navigation registry')

  localStorage.setItem('mdv-docs-locale', locale)
  await router.push('/')
  const i18n = createI18n({ legacy: false, locale: 'en-US', messages: { 'en-US': enUS, 'zh-CN': zhCN } })
  const wrapper = mount(App, { attachTo: document.body, global: { plugins: [router, i18n] } })
  const main = wrapper.get('main')
  expect(router.currentRoute.value.path).toBe(`/${locale}/getting-started/introduction`)
  expect(main.find('article, .docs-outline').exists()).toBe(false)
  expect(main.findAll('h1, h2').map(element => element.element.tagName)).toEqual(['H1', 'H2'])
  const hero = main.get('header')
  const brand = hero.get('h1')
  expect(brand.text()).toBe('Material Design Vue')
  expect(brand.find('svg, img').exists()).toBe(false)
  expect(brand.findAll('.introduction-hero__initial').map(initial => initial.text())).toEqual(['M', 'D', 'V'])
  const actions = hero.findAll('a[href]')
  expect(actions.map(link => link.attributes('href'))).toEqual([
    `/${locale}/getting-started/setup`, `#${encodeURIComponent(fragment)}`, 'https://github.com/kKsk03/mdv',
  ])
  expect(actions.map(link => link.text())).toEqual(locale === 'zh-CN'
    ? ['开始使用', '浏览组件', 'GitHub'] : ['Get started', 'Components', 'GitHub'])
  expect(actions[2]!.attributes('target')).toBe('_blank')
  const facts = hero.findAll('li').map(item => item.text())
  expect(facts).toContain(`v${__MDV_LIBRARY__.version}`)
  expect(facts).toContain(`${__MDV_LIBRARY__.components} ${locale === 'zh-CN' ? '个组件' : 'components'}`)
  const catalog = main.get('section[aria-labelledby]')
  const libraryHeading = catalog.get<HTMLElement>('h2')
  expect(libraryHeading.attributes('id')).toBe(fragment)
  expect(libraryHeading.attributes('aria-label')).toBe(heading)
  expect(libraryHeading.text().replace(/^#\s*/, '')).toBe(heading)
  expect(libraryHeading.find('svg').exists()).toBe(false)
  const permalink = libraryHeading.get<HTMLAnchorElement>('a.docs-heading-anchor')
  expect(permalink.attributes('href')).toBe(actions[1]!.attributes('href'))
  expect(permalink.attributes('aria-label')).toBe(linkLabel)
  expect(permalink.element.tabIndex).toBe(0)
  expect(permalink.get('span[aria-hidden="true"]').text()).toBe('#')

  const scroll = vi.fn()
  libraryHeading.element.scrollIntoView = scroll
  await router.push(permalink.element.hash)
  await flushPromises()
  expect(router.currentRoute.value.hash).toBe(`#${fragment}`)
  expect(scroll).toHaveBeenCalledOnce()

  const entries = catalog.get('ul').findAll('li')
  expect(entries).toHaveLength(components.pages.length)
  for (const [index, page] of components.pages.entries()) {
    const entry = entries[index]!
    const link = entry.get('a[href]')
    const title = entry.get('.component-library__title')
    const subtitle = entry.find('.component-library__subtitle')
    expect(link.attributes('href')).toBe(`/${locale}/${page.slug}`)
    expect(title.text()).toBe(page.navigationLabel?.['en-US'] ?? page.title['en-US'])
    const labelIds = [title.attributes('id')]
    if (locale === 'en-US') {
      expect(subtitle.exists()).toBe(false)
    } else {
      expect(subtitle.text()).toBe(page.title[locale])
      labelIds.push(subtitle.attributes('id'))
    }
    expect(link.attributes('aria-labelledby')).toBe(labelIds.join(' '))
  }

  const buttonPath = `/${locale}/components/button`
  const navigate = vi.spyOn(router, 'push')
  await main.get(`a[href="${buttonPath}"]`).trigger('click')
  expect(navigate).toHaveBeenCalledOnce()
  await expect(navigate.mock.results[0]!.value).resolves.toBeUndefined()
  await flushPromises()
  expect(router.currentRoute.value.path).toBe(buttonPath)
  expect(main.get('article h1').text()).toContain(locale === 'en-US' ? 'Button' : '按钮')
  expect(main.find('.docs-outline').exists()).toBe(true)
})
