import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { expect, test, vi } from 'vitest'
import DemoBlock from '../src/components/docs/DemoBlock.vue'
import EnglishButtonArticle from '../src/content/en-US/components/button.md'
import ChineseButtonArticle from '../src/content/zh-CN/components/button.md'
import enUS from '../src/locales/en-US.ts'
import zhCN from '../src/locales/zh-CN.ts'

function createMessages(locale = 'en-US') {
  return createI18n({
    legacy: false,
    locale,
    messages: { 'en-US': enUS, 'zh-CN': zhCN },
  })
}

test('demo disclosures have independent state and unique source targets without submitting forms', async () => {
  const submit = vi.fn((event: Event) => event.preventDefault())
  const wrapper = mount({
    render: () => h('form', { onSubmit: submit }, ['First', 'Second'].map(title =>
      h(DemoBlock, null, {
        default: () => h('input', { 'aria-label': `${title} example` }),
        source: () => h('pre', h('code', '<Example />')),
      }),
    )),
  }, { attachTo: document.body, global: { plugins: [createMessages()] } })
  const sections = wrapper.findAll('.docs-demo')
  const toggles = sections.map(section => section.get('button'))
  const sources = sections.map(section => section.get('.docs-demo__source'))

  expect(toggles[0]!.attributes('aria-controls')).not.toBe(toggles[1]!.attributes('aria-controls'))
  sections.forEach((section, index) => {
    expect(toggles[index]!.attributes('type')).toBe('button')
    expect(toggles[index]!.attributes('aria-expanded')).toBe('false')
    expect(toggles[index]!.attributes('aria-controls')).toBe(sources[index]!.attributes('id'))
    expect(sources[index]!.attributes('inert')).toBeDefined()
    expect(sources[index]!.attributes('aria-hidden')).toBe('true')
    expect(section.text()).toContain('Example code')
  })

  await toggles[0]!.trigger('click')
  expect(toggles[0]!.attributes('aria-expanded')).toBe('true')
  expect(sources[0]!.attributes('inert')).toBeUndefined()
  expect(sources[0]!.attributes('aria-hidden')).toBeUndefined()
  expect(toggles[1]!.attributes('aria-expanded')).toBe('false')
  expect(submit).not.toHaveBeenCalled()
})

test('closing and reopening preserves the live preview and the mounted source content', async () => {
  const wrapper = mount(DemoBlock, {
    slots: {
      default: () => h('input'),
      source: () => h('textarea', { 'aria-label': 'Source editor' }),
    },
    attachTo: document.body,
    global: { plugins: [createMessages()] },
  })
  const input = wrapper.get('input')
  const source = wrapper.get('textarea')
  const toggle = wrapper.get('button')
  await input.setValue('keep preview state')
  await toggle.trigger('click')
  await source.setValue('keep source state')
  await toggle.trigger('click')
  await toggle.trigger('click')
  expect(wrapper.get('input').element).toBe(input.element)
  expect(wrapper.get('textarea').element).toBe(source.element)
  expect(input.element.value).toBe('keep preview state')
  expect(source.element.value).toBe('keep source state')
  expect(toggle.attributes('aria-expanded')).toBe('true')
})

test.each([
  ['en-US', EnglishButtonArticle, 'Example code', 'filled'],
  ['zh-CN', ChineseButtonArticle, '示例代码', 'filled'],
] as const)('%s Button article composes the shell, real preview, and highlighted source', async (locale, Article, label, filled) => {
  const i18n = createMessages(locale)
  const wrapper = mount(Article, { global: { plugins: [i18n] } })
  const source = wrapper.get('.docs-demo__source')
  const toggle = wrapper.get('.docs-demo__toggle')
  expect(wrapper.get('.docs-demo__preview').text()).toContain(filled)
  expect(toggle.text()).toBe(label)
  expect(source.findAll('.docs-code-block')).toHaveLength(1)
  expect(source.findAll('pre.shiki')).toHaveLength(1)
  expect(source.get('pre code').text()).toContain("import { MdvButton } from '@mdv-ui/mdv'")
  expect(source.get('pre code').text()).toContain(`<MdvButton variant="filled">${filled}</MdvButton>`)
  expect(source.findAll('.mdv-button')).toHaveLength(0)

  await toggle.trigger('click')
  expect(toggle.attributes('aria-expanded')).toBe('true')
  expect(source.attributes('inert')).toBeUndefined()

  i18n.global.locale.value = locale === 'en-US' ? 'zh-CN' : 'en-US'
  await nextTick()
  expect(toggle.text()).toBe(locale === 'en-US' ? '示例代码' : 'Example code')
})
