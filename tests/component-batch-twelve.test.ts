import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import { createI18n } from 'vue-i18n'
import { expect, test, vi } from 'vitest'
import SwitchStatesDemo from '../src/components/docs/demos/switch/states.vue'
import SwitchIconsDemo from '../src/components/docs/demos/switch/icons.vue'
import SwitchFormDemo from '../src/components/docs/demos/switch/form.vue'
import TabsAppearanceDemo from '../src/components/docs/demos/tabs/appearance.vue'
import TabsKeyboardDemo from '../src/components/docs/demos/tabs/keyboard.vue'
import TabsPanelsDemo from '../src/components/docs/demos/tabs/panels.vue'
import TextFieldAppearanceDemo from '../src/components/docs/demos/textField/appearance.vue'
import TextFieldModelsDemo from '../src/components/docs/demos/textField/models.vue'
import TextFieldActionsDemo from '../src/components/docs/demos/textField/actions.vue'
import TextFieldFormDemo from '../src/components/docs/demos/textField/form.vue'
import { readArticleOutline } from '../src/content/article-headings.ts'
import { documentationPages, locales } from '../src/content/registry.ts'
import enUS from '../src/locales/en-US.ts'
import zhCN from '../src/locales/zh-CN.ts'
import { setReducedMotion } from './setup.ts'

function panelFor(wrapper: VueWrapper, tab: Element) {
  return wrapper.get(`[role="tabpanel"][id="${tab.getAttribute('aria-controls')}"]`)
}

test('a visible switch label activates the native control and updates the setting', async () => {
  const wrapper = mount(SwitchStatesDemo, { attachTo: document.body })
  const [notifications, , unavailable] = wrapper.findAll<HTMLInputElement>('input[role="switch"]')
  expect(notifications!.element.checked).toBe(false)
  notifications!.element.labels![0]!.click()
  await flushPromises()
  expect(notifications!.attributes('aria-checked')).toBe('true')
  expect(wrapper.get('[role="status"]').text()).toBe('Delivery notifications: on')
  expect(unavailable!.element.disabled).toBe(true)
})

test('switch icon slots follow selection and correcting the example setting clears its error', async () => {
  const wrapper = mount(SwitchIconsDemo, { attachTo: document.body })
  const [sync, quiet, offline] = wrapper.findAll<HTMLInputElement>('input[role="switch"]')
  const syncRow = sync!.element.labels![0]!
  const offIcon = syncRow.querySelector('svg')
  expect(offIcon).not.toBeNull()
  sync!.element.click()
  await flushPromises()
  expect(syncRow.querySelector('svg')).not.toBeNull()
  expect(syncRow.contains(offIcon)).toBe(false)
  expect(quiet!.element.labels![0]!.querySelector('svg')).toBeNull()
  expect(offline!.attributes('aria-invalid')).toBe('true')
  offline!.element.click()
  await flushPromises()
  expect(offline!.attributes('aria-invalid')).toBeUndefined()
})

test('the external switch participates in native required validation, submission, and reset', async () => {
  const wrapper = mount(SwitchFormDemo, { attachTo: document.body })
  const form = wrapper.get('form').element
  const input = wrapper.get<HTMLInputElement>('input[role="switch"]')
  const status = wrapper.get('[role="status"]')
  expect(input.element.closest('form')).toBeNull()
  expect(input.element.form).toBe(form)
  expect(input.attributes('aria-invalid')).toBeUndefined()
  expect(new FormData(form).has('sharing')).toBe(false)

  form.requestSubmit()
  await flushPromises()
  expect(status.text()).toBe('No submission yet.')
  const errorId = input.attributes('aria-errormessage')
  expect(wrapper.get(`[id="${errorId}"]`).text()).toBe('Enable team access to continue.')

  input.element.click()
  await flushPromises()
  form.requestSubmit()
  await flushPromises()
  expect(status.text()).toBe('Submitted: sharing=enabled.')
  expect(input.attributes('aria-invalid')).toBeUndefined()

  form.reset()
  await flushPromises()
  expect(input.element.checked).toBe(false)
  expect(input.attributes('aria-checked')).toBe('false')
  expect(new FormData(form).has('sharing')).toBe(false)
  expect(status.text()).toBe('Reset to the initial preference.')
})

test('tabs preserve selection and accessible panel relationships when the variant changes', async () => {
  setReducedMotion(true)
  const wrapper = mount(TabsAppearanceDemo, { attachTo: document.body })
  const [overview, activity] = wrapper.findAll<HTMLButtonElement>('[role="tab"]')
  const panel = panelFor(wrapper, activity!.element)
  expect(wrapper.get('[role="tablist"]').attributes('aria-label')).toBe('Project views')
  expect(activity!.attributes('aria-label')).toBe('Activity, 3 unread updates')
  expect(panel.attributes('aria-labelledby')).toBe(activity!.attributes('id'))
  await activity!.trigger('click')
  await wrapper.get<HTMLInputElement>('[role="switch"]').setValue(true)
  await flushPromises()
  expect(activity!.attributes('aria-selected')).toBe('true')
  expect(overview!.attributes('aria-selected')).toBe('false')
  expect(panel.element.hasAttribute('hidden')).toBe(false)
})

test('manual tab navigation skips disabled tabs and reports only accepted selection changes', async () => {
  setReducedMotion(true)
  const wrapper = mount(TabsKeyboardDemo, { attachTo: document.body })
  const [summary, archive, details] = wrapper.findAll<HTMLButtonElement>('[role="tab"]')
  const lock = wrapper.findAll<HTMLInputElement>('[role="switch"]')[1]!
  summary!.element.focus()
  await summary!.trigger('keydown', { key: 'ArrowRight' })
  expect(document.activeElement).toBe(details!.element)
  expect(details!.element.tabIndex).toBe(0)
  expect(summary!.element.tabIndex).toBe(-1)
  expect(archive!.element.tabIndex).toBe(-1)
  expect(summary!.attributes('aria-selected')).toBe('true')

  await lock.setValue(true)
  await details!.trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Rejected: details.')
  expect(panelFor(wrapper, details!.element).element.hasAttribute('hidden')).toBe(true)

  await lock.setValue(false)
  await details!.trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Accepted: details.')
  expect(panelFor(wrapper, details!.element).element.hasAttribute('hidden')).toBe(false)
})

test('automatic activation selects the focused tab after End and Home', async () => {
  setReducedMotion(true)
  const wrapper = mount(TabsKeyboardDemo, { attachTo: document.body })
  const tabs = wrapper.findAll<HTMLButtonElement>('[role="tab"]')
  const summary = tabs[0]!
  const details = tabs[2]!
  await wrapper.get<HTMLInputElement>('[role="switch"]').setValue(true)
  summary.element.focus()
  await summary.trigger('keydown', { key: 'End' })
  await flushPromises()
  expect(document.activeElement).toBe(details.element)
  expect(details.attributes('aria-selected')).toBe('true')
  await details.trigger('keydown', { key: 'Home' })
  await flushPromises()
  expect(summary.attributes('aria-selected')).toBe('true')
})

test('panel shells stay associated while retained, lazy, and destroyed drafts follow their own lifetimes', async () => {
  setReducedMotion(true)
  const wrapper = mount(TabsPanelsDemo, { attachTo: document.body })
  const [retained, lazy, reset] = wrapper.findAll('[role="tab"]')
  const retainedPanel = panelFor(wrapper, retained!.element)
  const lazyPanel = panelFor(wrapper, lazy!.element)
  const resetPanel = panelFor(wrapper, reset!.element)
  const original = retainedPanel.get<HTMLInputElement>('input')
  expect(lazyPanel.find('input').exists()).toBe(false)
  expect(resetPanel.find('input').exists()).toBe(false)
  await original.setValue('Persistent text')

  await lazy!.trigger('click')
  const firstVisit = lazyPanel.get<HTMLInputElement>('input')
  await firstVisit.setValue('Lazy text')
  expect(retainedPanel.element.hasAttribute('inert')).toBe(true)

  await reset!.trigger('click')
  await resetPanel.get<HTMLInputElement>('input').setValue('Temporary text')
  await retained!.trigger('click')
  expect(resetPanel.find('input').exists()).toBe(false)
  expect(retainedPanel.get('input').element).toBe(original.element)
  expect(original.element.value).toBe('Persistent text')

  await lazy!.trigger('click')
  expect(lazyPanel.get('input').element).toBe(firstVisit.element)
  expect(firstVisit.element.value).toBe('Lazy text')
  await reset!.trigger('click')
  expect(resetPanel.get<HTMLInputElement>('input').element.value).toBe('')
})

test('the multiline text count uses UTF-16 length and describes the native textarea', async () => {
  const wrapper = mount(TextFieldAppearanceDemo, { attachTo: document.body })
  const notes = wrapper.get('textarea')
  const budget = wrapper.get('input')
  await notes.setValue('A😀')
  expect(notes.element.maxLength).toBe(80)
  const descriptions = notes.attributes('aria-describedby')?.split(' ')
  expect(descriptions?.map(id => wrapper.get(`[id="${id}"]`).text())).toEqual([
    'Include only information the courier needs.', '3 / 80',
  ])
  expect(budget.element.value).toBe('42.00')
})

test('the text model commits after composition and the lazy number commits only on change', async () => {
  const wrapper = mount(TextFieldModelsDemo, { attachTo: document.body })
  const [name, quantity] = wrapper.findAll<HTMLInputElement>('input')
  const status = wrapper.get('[role="status"]')
  await name!.trigger('compositionstart')
  name!.element.value = '  中文  '
  await name!.trigger('input')
  expect(status.text()).toContain('Name: ""')
  await name!.trigger('compositionend')
  expect(status.text()).toContain('Name: "中文"')
  expect(name!.element.value).toBe('  中文  ')
  await name!.trigger('blur')
  expect(name!.element.value).toBe('中文')

  quantity!.element.value = '5'
  await quantity!.trigger('input')
  expect(status.text()).toContain('Quantity: "" (string)')
  await quantity!.trigger('change')
  expect(status.text()).toContain('Quantity: 5 (number)')
  quantity!.element.value = ''
  await quantity!.trigger('change')
  expect(status.text()).toContain('Quantity: "" (string)')
})

test('clear commits one native input and returns focus; a custom trailing action can fill its field', async () => {
  const wrapper = mount(TextFieldActionsDemo, { attachTo: document.body })
  const search = wrapper.get<HTMLInputElement>('input[type="search"]').element
  const onInput = vi.fn()
  const onChange = vi.fn()
  search.addEventListener('input', onInput)
  search.addEventListener('change', onChange)
  await wrapper.get('button[aria-label="Clear search examples"]').trigger('click')
  expect(search.value).toBe('')
  expect(document.activeElement).toBe(search)
  expect(onInput).toHaveBeenCalledTimes(1)
  expect(onChange).not.toHaveBeenCalled()

  const code = wrapper.findAll<HTMLInputElement>('input').at(-1)!.element
  await wrapper.get('button[aria-label="Use suggested project code"]').trigger('click')
  expect(code.value).toBe('PROJECT-01')
  expect(document.activeElement).toBe(code)
})

test('password visibility preserves the sample value, focus, and selection', async () => {
  const wrapper = mount(TextFieldActionsDemo, { attachTo: document.body })
  const password = wrapper.get<HTMLInputElement>('input[type="password"]').element
  password.focus()
  password.setSelectionRange(2, 5)
  await wrapper.get('button[aria-label="Show demo password"]').trigger('click')
  await flushPromises()
  expect(password.type).toBe('text')
  expect(password.value).toBe('demo-only')
  expect(document.activeElement).toBe(password)
  expect([password.selectionStart, password.selectionEnd]).toEqual([2, 5])
  const hide = wrapper.get('button[aria-label="Hide demo password"]')
  expect(hide.attributes('aria-pressed')).toBe('true')
  await hide.trigger('click')
  await flushPromises()
  expect(password.type).toBe('password')
})

test('text field native and custom errors block submission until corrected; reset brings back the initial value', async () => {
  const wrapper = mount(TextFieldFormDemo, { attachTo: document.body })
  const form = wrapper.get('form').element
  const email = wrapper.get<HTMLInputElement>('input[type="email"]')
  const status = wrapper.get('[role="status"]')
  expect(email.attributes('aria-invalid')).toBeUndefined()
  form.requestSubmit()
  await flushPromises()
  expect(email.attributes('aria-invalid')).toBe('true')
  expect(status.text()).toBe('No submission yet.')

  await email.setValue('demo@example.com')
  const duplicate = wrapper.findAll('button').find(item => item.text() === 'Report duplicate email')!
  await duplicate.trigger('click')
  expect(email.element.validity.customError).toBe(true)
  const descriptionIds = email.attributes('aria-describedby')?.split(' ')
  expect(descriptionIds?.map(id => wrapper.get(`[id="${id}"]`).text())).toEqual([
    'Use an example address.', 'This email address is already in use.',
  ])
  form.requestSubmit()
  expect(status.text()).toBe('No submission yet.')

  await email.setValue('another@example.com')
  form.requestSubmit()
  await flushPromises()
  expect(status.text()).toBe('[["email","another@example.com"],["plan","Starter"]]')
  form.reset()
  await flushPromises()
  expect(email.element.value).toBe('')
  expect(email.attributes('aria-invalid')).toBeUndefined()
})

const articleDemos = {
  switch: ['switch/states', 'switch/icons', 'switch/form'],
  tabs: ['tabs/appearance', 'tabs/keyboard', 'tabs/panels'],
  'text-field': ['textField/appearance', 'textField/models', 'textField/actions', 'textField/form'],
}

test.each(Object.entries(articleDemos))('%s loads both localized articles with synchronized demos', async (slug, demos) => {
  const page = documentationPages.find(entry => entry.id === slug)
  if (!page) throw new Error(`Missing documentation page: ${slug}`)
  expect(page.slug).toBe(`components/${slug}`)
  const expected = await Promise.all(demos.map(async demo => {
    const path = resolve(process.cwd(), 'src/components/docs/demos', `${demo}.vue`)
    return (await readFile(path, 'utf8')).trimEnd()
  }))
  for (const locale of locales) {
    const article = await readFile(resolve(process.cwd(), 'src/content', locale, 'components', `${slug}.md`), 'utf8')
    const actual = Array.from(article.matchAll(/```vue:line-numbers\n([\s\S]*?)\n```/g), match => match[1])
    expect(actual, `${locale}/${slug}`).toEqual(expected)

    const { default: Article } = await page.documents[locale]()
    const i18n = createI18n({ legacy: false, locale, messages: { 'en-US': enUS, 'zh-CN': zhCN } })
    const wrapper = mount({ render: () => h('article', [h(Article)]) }, { global: { plugins: [i18n] } })
    expect(readArticleOutline(wrapper.get('article').element).title?.text).toBe(page.title[locale])
    const previews = wrapper.findAll('.docs-demo__preview')
    expect(previews).toHaveLength(demos.length)
    expect(previews.every(preview => preview.element.childElementCount > 0)).toBe(true)
    const sections = wrapper.findAll('h2[data-docs-heading]')
    expect(sections).toHaveLength(demos.length + 1)
    for (const section of sections) {
      expect(section.get('.docs-heading-anchor').attributes('href')).toBe(`#${encodeURIComponent(section.element.id)}`)
    }
    wrapper.unmount()
  }
})
