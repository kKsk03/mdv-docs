import { flushPromises, mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import { readArticleOutline } from '../src/content/article-headings.ts'
import { documentationPages, getRouteName, navigationItems } from '../src/content/registry.ts'
import enUS from '../src/locales/en-US.ts'
import zhCN from '../src/locales/zh-CN.ts'

test.each([
  { locale: 'en-US', heading: 'Component Library', fragment: 'component-library' },
  { locale: 'zh-CN', heading: '组件库', fragment: '组件库' },
] as const)('Introduction lists English component names and optional translations in $locale', async ({ locale, heading, fragment }) => {
  const introduction = documentationPages.find(page => page.id === 'introduction')!
  const components = navigationItems.find(item => item.id === 'components' && 'pages' in item)
  if (!components || !('pages' in components)) throw new Error('Missing components in the navigation registry')

  const router = createRouter({
    history: createMemoryHistory(),
    routes: documentationPages.map(page => ({
      path: `/${locale}/${page.slug}`,
      name: getRouteName(locale, page.id),
      component: { render: () => null },
    })),
  })
  await router.push({ name: getRouteName(locale, introduction.id) })
  const { default: Article } = await introduction.documents[locale]()
  const i18n = createI18n({ legacy: false, locale, messages: { 'en-US': enUS, 'zh-CN': zhCN } })
  const wrapper = mount(Article, { global: { plugins: [router, i18n] } })

  expect(readArticleOutline(wrapper.element).items).toContainEqual({
    id: fragment, text: heading, children: [],
  })
  const entries = wrapper.get('ul').findAll('li')
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
  await wrapper.get(`a[href="${buttonPath}"]`).trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.path).toBe(buttonPath)
})
