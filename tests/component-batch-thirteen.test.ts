import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import type { Component } from 'vue'
import { createI18n } from 'vue-i18n'
import { afterEach, expect, test, vi } from 'vitest'
import TimePickerAvailabilityDemo from '../src/components/docs/demos/timePicker/availability.vue'
import TimePickerFormDemo from '../src/components/docs/demos/timePicker/form.vue'
import TimePickerModesDemo from '../src/components/docs/demos/timePicker/modes.vue'
import ToolbarActionsDemo from '../src/components/docs/demos/toolbar/actions.vue'
import ToolbarExpansionDemo from '../src/components/docs/demos/toolbar/expansion.vue'
import ToolbarScrollDemo from '../src/components/docs/demos/toolbar/scroll.vue'
import TooltipOverlayDemo from '../src/components/docs/demos/tooltip/overlay.vue'
import TooltipPlainDemo from '../src/components/docs/demos/tooltip/plain.vue'
import TooltipRichDemo from '../src/components/docs/demos/tooltip/rich.vue'
import { getArticleHeadings, readArticleOutline } from '../src/content/article-headings.ts'
import { documentationPages, getRouteName, locales } from '../src/content/registry.ts'
import enUS from '../src/locales/en-US.ts'
import zhCN from '../src/locales/zh-CN.ts'
import router from '../src/router/index.ts'
import { setReducedMotion } from './setup.ts'

function button(wrapper: VueWrapper, label: string) {
  const control = wrapper.findAll<HTMLButtonElement>('button').find(item => item.text() === label)
  if (!control) throw new Error(`Missing button: ${label}`)
  return control
}

let demoHost: VueWrapper | undefined
const restoreNativeMethods: Array<() => void> = []

function mountDemo(component: Component) {
  demoHost = mount(component, { attachTo: document.body })
  return demoHost
}

afterEach(() => {
  try {
    demoHost?.unmount()
  } finally {
    demoHost = undefined
    for (const restore of restoreNativeMethods.splice(0)) restore()
  }
})

// Provide only the native open state missing in jsdom. MDV still handles triggers,
// validation, dismissal reasons, keyboard events, and returning focus.
function mockNativeMethods(prototype: object, methods: object) {
  for (const [name, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(methods))) {
    const previous = Object.getOwnPropertyDescriptor(prototype, name)
    Object.defineProperty(prototype, name, descriptor)
    restoreNativeMethods.push(() => {
      if (previous) Object.defineProperty(prototype, name, previous)
      else Reflect.deleteProperty(prototype, name)
    })
  }
}

function mockDialog() {
  setReducedMotion(true)
  mockNativeMethods(HTMLDialogElement.prototype, {
    showModal(this: HTMLDialogElement) { this.open = true },
    close(this: HTMLDialogElement, value = '') {
      if (!this.open) return
      this.returnValue = value
      this.open = false
      queueMicrotask(() => this.dispatchEvent(new Event('close')))
    },
  })
}

function mockPopover() {
  setReducedMotion(true)
  const opened = new WeakSet<Element>()
  mockNativeMethods(HTMLElement.prototype, {
    showPopover(this: HTMLElement) { opened.add(this) },
    hidePopover(this: HTMLElement) { opened.delete(this) },
  })
  const matches = Element.prototype.matches
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
    return selector === ':popover-open' ? opened.has(this) : matches.call(this, selector)
  })
}

const timeTrigger = 'button[aria-label="Open time picker"]'
const timeEntry = 'input[data-time-entry]'
const hour = 'input[aria-label="Hour"]'
const minute = 'input[aria-label="Minute"]'

function timeSummary(wrapper: VueWrapper) {
  return wrapper.get('p[role="status"]:not([aria-live])')
}

test('the 12-hour picker preserves its draft across views, discards on Cancel, and commits on Enter', async () => {
  mockDialog()
  const wrapper = mountDemo(TimePickerModesDemo)
  const trigger = wrapper.get<HTMLButtonElement>(timeTrigger)
  const dialog = wrapper.get('dialog')
  const summary = timeSummary(wrapper)
  await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true)
  trigger.element.focus()
  await trigger.trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(true)
  expect(dialog.get('input[type="radio"]:checked').element).toBe(dialog.findAll('input[type="radio"]')[1]?.element)

  await dialog.get(minute).setValue('35')
  await dialog.get('button[aria-label="Switch to text entry"]').trigger('click')
  expect(dialog.find('[role="slider"]').exists()).toBe(false)
  expect(dialog.get<HTMLInputElement>(minute).element.value).toBe('35')
  expect(summary.text()).toContain('Committed: 13:05.')
  await button(wrapper, 'Cancel').trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(false)
  expect(summary.text()).toBe('Committed: 13:05. Closed without saving (cancel).')
  expect(document.activeElement).toBe(trigger.element)

  await trigger.trigger('click')
  await flushPromises()
  const draftMinute = dialog.get<HTMLInputElement>(minute)
  expect(draftMinute.element.value).toBe('05')
  await draftMinute.setValue('35')
  await draftMinute.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(dialog.element.open).toBe(false)
  expect(summary.text()).toBe('Committed: 13:35. Confirmed: 13:35.')
})

test('the availability example blocks excluded times and keeps a rejected draft open', async () => {
  mockDialog()
  const wrapper = mountDemo(TimePickerAvailabilityDemo)
  const [blockAll, reject] = wrapper.findAll('input[type="checkbox"]')
  const trigger = wrapper.get(timeTrigger)
  const dialog = wrapper.get('dialog')
  const summary = timeSummary(wrapper)
  await reject!.setValue(true)
  await trigger.trigger('click')
  await flushPromises()
  const confirm = button(wrapper, 'OK')
  await dialog.get(hour).setValue('21')
  expect(confirm.element.disabled).toBe(true)
  expect(dialog.get('[role="status"]').text()).toBe('This time is unavailable.')
  await dialog.get(hour).setValue('22')
  await dialog.get(minute).setValue('15')
  await confirm.trigger('click')
  await flushPromises()
  expect(summary.text()).toBe('Kept 22:00 instead of 22:15. Picker: open.')
  expect(wrapper.get<HTMLInputElement>(timeEntry).element.value).toBe('22:00')
  expect(dialog.get<HTMLInputElement>(minute).element.value).toBe('15')

  await reject!.setValue(false)
  await confirm.trigger('click')
  await flushPromises()
  expect(summary.text()).toBe('Accepted 22:15. Picker: closed.')
  expect(wrapper.get<HTMLInputElement>(timeEntry).element.value).toBe('22:15')
  await blockAll!.setValue(true)
  await trigger.trigger('click')
  await flushPromises()
  expect(dialog.get('[role="status"]').text()).toBe('There are no available times.')
  expect(button(wrapper, 'OK').element.disabled).toBe(true)
})

test('the external time field submits the committed time, blocks step and required errors, and resets', async () => {
  const wrapper = mountDemo(TimePickerFormDemo)
  const form = wrapper.get('form').element
  const submitted = vi.fn()
  form.addEventListener('submit', submitted)
  const entry = wrapper.get<HTMLInputElement>(timeEntry)
  const summary = timeSummary(wrapper)
  expect(entry.element.closest('form')).toBeNull()
  expect(entry.element.form).toBe(form)

  await entry.setValue('10:30')
  await entry.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(summary.text()).toBe('No booking submitted.')
  form.requestSubmit()
  await flushPromises()
  expect(summary.text()).toBe('Submitted [["appointment","10:30"]]')

  await entry.setValue('10:07')
  await entry.trigger('keydown', { key: 'Enter' })
  form.requestSubmit()
  await flushPromises()
  expect(entry.element.value).toBe('10:07')
  expect(entry.element.validationMessage).toBe('Use a time that matches the minute step.')
  expect(new FormData(form).getAll('appointment')).toEqual(['10:30'])
  expect(summary.text()).toBe('Submitted [["appointment","10:30"]]')

  await wrapper.get('button[aria-label="Clear time"]').trigger('click')
  await flushPromises()
  expect(entry.element.value).toBe('')
  expect(entry.element.validationMessage).toBe('Choose a time.')
  expect(new FormData(form).getAll('appointment')).toEqual([''])
  form.requestSubmit()
  await flushPromises()
  expect(summary.text()).toBe('Submitted [["appointment","10:30"]]')

  form.reset()
  await flushPromises()
  expect(submitted).toHaveBeenCalledTimes(1)
  expect(entry.element.value).toBe('09:00')
  expect(entry.element.checkValidity()).toBe(true)
  expect(new FormData(form).getAll('appointment')).toEqual(['09:00'])
  expect(summary.text()).toBe('Form reset.')
})

test('docked toolbar arrows skip disabled controls without toggling the focused action', async () => {
  const wrapper = mountDemo(ToolbarActionsDemo)
  const toolbar = wrapper.get('[role="toolbar"][aria-label="Text formatting"]')
  const bold = toolbar.get<HTMLButtonElement>('button[aria-label="Bold"]')
  const italic = toolbar.get<HTMLButtonElement>('button[aria-label="Italic"]')
  expect(toolbar.get<HTMLButtonElement>('button[aria-label="Underline"]').element.disabled).toBe(true)
  bold.element.focus()
  await bold.trigger('keydown', { key: 'ArrowRight' })
  expect(document.activeElement).toBe(italic.element)
  expect(wrapper.get('[role="status"]').text()).toBe('Bold: off; italic: off.')
  await italic.trigger('click')
  await italic.trigger('keydown', { key: 'Home' })
  expect(document.activeElement).toBe(bold.element)
  expect(wrapper.get('[role="status"]').text()).toBe('Bold: off; italic: on.')
})

test('a collapsed toolbar retains its primary action unless a FAB is paired', async () => {
  setReducedMotion(true)
  const wrapper = mountDemo(ToolbarExpansionDemo)
  const edit = wrapper.get<HTMLButtonElement>('button[aria-label="Edit note"]')
  const pin = wrapper.get<HTMLButtonElement>('button[aria-label="Pin note"]')
  pin.element.focus()
  await wrapper.get('button[aria-label="Collapse note actions"]').trigger('click')
  expect(pin.element.closest('[inert]')).not.toBeNull()
  expect(edit.element.closest('[inert]')).toBeNull()
  expect(document.activeElement).toBe(edit.element)

  await wrapper.get('button[aria-label="Expand note actions"]').trigger('click')
  await wrapper.get('input[type="checkbox"]').setValue(true)
  const fab = wrapper.get<HTMLButtonElement>('button[aria-label="Add note"]')
  await wrapper.get('button[aria-label="Collapse note actions"]').trigger('click')
  const toggle = wrapper.get('button[aria-label="Expand note actions"]')
  expect(toggle.attributes('aria-expanded')).toBe('false')
  expect(edit.element.closest('[inert]')?.id).toBe(toggle.attributes('aria-controls'))
  expect(document.activeElement).toBe(fab.element)
  expect(fab.element.closest('[inert]')).toBeNull()
  await fab.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Collapsed. Not pinned. Added a note.')
})

test('the vertical toolbar follows its own scroll region and does not collapse while focused', async () => {
  setReducedMotion(true)
  const wrapper = mountDemo(ToolbarScrollDemo)
  await flushPromises()
  const region = wrapper.get<HTMLElement>('[role="region"]')
  const toolbar = wrapper.get('[role="toolbar"]')
  const primary = toolbar.get<HTMLButtonElement>('button[aria-label="Save draft"]')
  const secondary = toolbar.get<HTMLButtonElement>('button[aria-label="Edit draft"]')
  const scrollTo = async (top: number) => {
    region.element.scrollTop = top
    await region.trigger('scroll')
    await flushPromises()
  }
  expect(toolbar.attributes('aria-orientation')).toBe('vertical')
  primary.element.focus()
  await primary.trigger('keydown', { key: 'ArrowUp' })
  expect(document.activeElement).toBe(secondary.element)
  await scrollTo(70)
  expect(secondary.element.closest('[inert]')).toBeNull()
  region.element.focus()
  await scrollTo(100)
  expect(secondary.element.closest('[inert]')).toBeNull()
  await scrollTo(120)
  expect(secondary.element.closest('[inert]')).not.toBeNull()
  expect(primary.element.closest('[inert]')).toBeNull()
  await scrollTo(80)
  expect(secondary.element.closest('[inert]')).toBeNull()
})

test('plain tooltip preserves the existing description and button action when disabled', async () => {
  mockPopover()
  const wrapper = mountDemo(TooltipPlainDemo)
  const trigger = wrapper.get<HTMLButtonElement>('button[aria-label="Refresh preview"]')
  const panel = wrapper.get('[role="tooltip"]')
  const descriptions = () => trigger.attributes('aria-describedby')?.split(/\s+/).map(id => wrapper.get(`[id="${id}"]`).text())
  expect(descriptions()).toEqual(['Refreshing never changes the saved draft.', 'Fetch the latest preview data.'])
  trigger.element.focus()
  await flushPromises()
  expect(panel.element.matches(':popover-open')).toBe(true)
  expect(document.activeElement).toBe(trigger.element)
  await trigger.trigger('keydown', { key: 'Escape' })
  await flushPromises()
  expect(panel.element.matches(':popover-open')).toBe(false)
  expect(document.activeElement).toBe(trigger.element)

  await wrapper.get('input[type="checkbox"]').setValue(true)
  expect(descriptions()).toEqual(['Refreshing never changes the saved draft.'])
  expect(trigger.element.disabled).toBe(false)
  await trigger.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Refreshes: 1')
})

test('a tooltip touch long press suppresses the action and keeps the panel until the release delay', async () => {
  mockPopover()
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] })
  const wrapper = mountDemo(TooltipPlainDemo)
  const trigger = wrapper.get('button[aria-label="Refresh preview"]')
  const panel = wrapper.get('[role="tooltip"]')
  const touch = (type: string) => Object.assign(new MouseEvent(type, { bubbles: true, cancelable: true }), {
    pointerId: 1, pointerType: 'touch', isPrimary: true,
  })
  trigger.element.dispatchEvent(touch('pointerdown'))
  await vi.advanceTimersByTimeAsync(499)
  expect(panel.element.matches(':popover-open')).toBe(false)
  await vi.advanceTimersByTimeAsync(1)
  await flushPromises()
  expect(panel.element.matches(':popover-open')).toBe(true)
  trigger.element.dispatchEvent(touch('pointerup'))
  expect(trigger.element.dispatchEvent(touch('click'))).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Refreshes: 0')
  await vi.advanceTimersByTimeAsync(1499)
  expect(panel.element.matches(':popover-open')).toBe(true)
  await vi.advanceTimersByTimeAsync(1)
  await flushPromises()
  expect(panel.element.matches(':popover-open')).toBe(false)
})

test('persistent Rich opens on activation and returns focus when its action dismisses it', async () => {
  mockPopover()
  const wrapper = mountDemo(TooltipRichDemo)
  const trigger = button(wrapper, 'About offline access')
  const action = button(wrapper, 'Got it')
  const panel = wrapper.get('[role="dialog"]')
  expect(trigger.attributes('aria-haspopup')).toBe('dialog')
  expect(trigger.attributes('aria-controls')).toBe(panel.attributes('id'))
  expect(panel.attributes('aria-modal')).toBe('false')
  expect(panel.get(`[id="${panel.attributes('aria-labelledby')}"]`).text()).toBe('Offline access')

  trigger.element.focus()
  await flushPromises()
  expect(trigger.attributes('aria-expanded')).toBe('false')
  await trigger.trigger('click')
  await flushPromises()
  expect(trigger.attributes('aria-expanded')).toBe('true')
  expect(document.activeElement).toBe(trigger.element)
  await trigger.trigger('pointerleave')
  expect(panel.element.matches(':popover-open')).toBe(true)
  const link = panel.get('a')
  expect(wrapper.get(`[id="${link.attributes('href')?.slice(1)}"]`).text()).toContain('Storage details:')
  link.element.focus()
  action.element.focus()
  await action.trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Offline help acknowledged.')
  expect(trigger.attributes('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(trigger.element)
})

test('Escape dismisses the tooltip before the dialog; owner closure removes the reopened tooltip', async () => {
  mockDialog()
  mockPopover()
  const wrapper = mountDemo(TooltipOverlayDemo)
  const opener = button(wrapper, 'Open preview settings')
  await opener.trigger('click')
  await flushPromises()
  const dialog = wrapper.get('dialog')
  const trigger = button(wrapper, 'Use auto resolution')
  const panel = dialog.get('[role="dialog"]')
  trigger.element.focus()
  await flushPromises()
  expect(panel.element.matches(':popover-open')).toBe(true)
  await trigger.trigger('keydown', { key: 'Escape' })
  await flushPromises()
  expect(dialog.element.open).toBe(true)
  expect(panel.element.matches(':popover-open')).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toContain('Last tooltip close: escape.')

  const close = button(wrapper, 'Close settings')
  close.element.focus()
  trigger.element.focus()
  await flushPromises()
  expect(panel.element.matches(':popover-open')).toBe(true)
  await close.trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(false)
  expect(panel.element.matches(':popover-open')).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toContain('Last tooltip close: owner.')
})

const articleDemos = {
  'time-picker': { demos: ['timePicker/modes', 'timePicker/availability', 'timePicker/form'], sections: 5 },
  toolbar: { demos: ['toolbar/actions', 'toolbar/expansion', 'toolbar/scroll'], sections: 4 },
  tooltip: { demos: ['tooltip/plain', 'tooltip/rich', 'tooltip/overlay'], sections: 4 },
}

function readSource(path: string) {
  return readFile(resolve(process.cwd(), path), 'utf8')
}

test.each(Object.entries(articleDemos))('%s resolves both localized routes with synchronized demos', async (slug, { demos, sections }) => {
  const page = documentationPages.find(entry => entry.id === slug)
  if (!page) throw new Error(`Missing documentation page: ${slug}`)
  const expected = await Promise.all(demos.map(async demo => (await readSource(`src/components/docs/demos/${demo}.vue`)).trimEnd()))
  const labels = slug === 'time-picker' ? (await readSource('src/components/docs/demos/timePicker/labels.ts')).trimEnd() : null
  for (const locale of locales) {
    const route = router.resolve(`/${locale}/components/${slug}`)
    expect(route.name).toBe(getRouteName(locale, slug))
    expect(route.meta).toMatchObject({ documentId: slug, locale, title: page.title[locale] })
    expect(route.matched.at(-1)?.components?.default).toBe(page.documents[locale])

    const source = await readSource(`src/content/${locale}/${page.slug}.md`)
    const fences = (language: string) => Array.from(source.matchAll(new RegExp('```' + language + ':line-numbers\n([\\s\\S]*?)\n```', 'g')), match => match[1])
    expect(fences('vue'), `${locale}/${slug}`).toEqual(expected)
    if (labels) expect(fences('ts')).toEqual([labels])

    const { default: Article } = await page.documents[locale]()
    const i18n = createI18n({ legacy: false, locale, messages: { 'en-US': enUS, 'zh-CN': zhCN } })
    const wrapper = mount({ render: () => h('article', [h(Article)]) }, { global: { plugins: [i18n] } })
    const article = wrapper.get('article').element
    const outline = readArticleOutline(article)
    expect(outline.title?.text).toBe(page.title[locale])
    expect(outline.items).toHaveLength(sections)
    const previews = wrapper.findAll('.docs-demo__preview')
    expect(previews).toHaveLength(demos.length)
    expect(previews.every(preview => preview.element.childElementCount > 0)).toBe(true)
    expect(wrapper.findAll('.docs-demo__source pre')).toHaveLength(demos.length)
    for (const heading of getArticleHeadings(article)) {
      expect(heading.querySelector('.docs-heading-anchor')?.getAttribute('href')).toBe(`#${encodeURIComponent(heading.id)}`)
    }
    wrapper.unmount()
  }
})
