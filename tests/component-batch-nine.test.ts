import { flushPromises, mount } from '@vue/test-utils'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { afterEach, expect, test, vi } from 'vitest'
import RailBasicDemo from '../src/components/docs/demos/navigationRail/basic.vue'
import RailLinksDemo from '../src/components/docs/demos/navigationRail/links.vue'
import RailModalDemo from '../src/components/docs/demos/navigationRail/modal.vue'
import RailPolicyDemo from '../src/components/docs/demos/navigationRail/policy.vue'
import RadioBasicDemo from '../src/components/docs/demos/radio/basic.vue'
import RadioStandaloneDemo from '../src/components/docs/demos/radio/standalone.vue'
import RadioControlledDemo from '../src/components/docs/demos/radio/controlled.vue'
import RadioFormDemo from '../src/components/docs/demos/radio/form.vue'
import SearchBarDemo from '../src/components/docs/demos/searchBar/bar.vue'
import SearchFormDemo from '../src/components/docs/demos/searchBar/form.vue'
import SearchViewDemo from '../src/components/docs/demos/searchBar/view.vue'
import SearchTriggerDemo from '../src/components/docs/demos/searchBar/trigger.vue'
import SearchGuardDemo from '../src/components/docs/demos/searchBar/guard.vue'
import SearchAsyncDemo from '../src/components/docs/demos/searchBar/async.vue'
import SearchCompositionDemo from '../src/components/docs/demos/searchBar/composition.vue'
import { setReducedMotion } from './setup.ts'

let host: VueWrapper | undefined
const restoreNative: (() => void)[] = []
afterEach(() => {
  host?.unmount()
  host = undefined
  for (const restore of restoreNative.splice(0)) restore()
})

function button(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, text: string) {
  const result = wrapper.findAll('button').find(candidate => candidate.text() === text)
  if (!result) throw new Error(`Missing button: ${text}`)
  return result
}
function railItem(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, label: string) {
  const result = wrapper.findAll('[data-mdv-rail-item]').find(candidate => candidate.get('.mdv-navigation-rail-item__name').text() === label)
  if (!result) throw new Error(`Missing rail item: ${label}`)
  return result
}
function radio(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, label: string) {
  const result = wrapper.findAll('.mdv-radio').find(candidate => candidate.get('.mdv-radio__label').text() === label)
  if (!result) throw new Error(`Missing radio: ${label}`)
  return result.get<HTMLInputElement>('input[type="radio"]')
}
function checkbox(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, label: string) {
  const result = wrapper.findAll('.mdv-checkbox').find(candidate => candidate.text() === label)
  if (!result) throw new Error(`Missing checkbox: ${label}`)
  return result.get<HTMLInputElement>('input')
}
// Exercise real MDV modal state and focus; only the missing jsdom native APIs are supplied.
function mockDialog() {
  setReducedMotion(true)
  const prototype = HTMLDialogElement.prototype
  const previous = ['showModal', 'close'].map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)] as const)
  Object.defineProperties(prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
    close: { configurable: true, value(this: HTMLDialogElement, value = '') {
      if (!this.open) return
      this.returnValue = value
      this.open = false
      queueMicrotask(() => this.dispatchEvent(new Event('close')))
    } },
  })
  restoreNative.push(() => {
    for (const [name, descriptor] of previous) {
      if (descriptor) Object.defineProperty(prototype, name, descriptor)
      else Reflect.deleteProperty(prototype, name)
    }
  })
}

test('standard rail owns destination state independently of focus, expansion, and creation actions', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(RailBasicDemo, { attachTo: document.body })
  const home = railItem(wrapper, 'Home')
  ;(home.element as HTMLElement).focus()
  await home.trigger('keydown', { key: 'ArrowDown' })
  expect(document.activeElement).toBe(railItem(wrapper, 'Explore').element)
  expect(home.attributes('aria-current')).toBe('page')
  await railItem(wrapper, 'Explore').trigger('click')
  await wrapper.get('[aria-label="Expand rail"]').trigger('click')
  await flushPromises()
  expect(wrapper.get('[data-mdv-rail]').attributes('data-expanded')).toBe('true')
  expect(railItem(wrapper, 'Settings').exists()).toBe(true)
  await wrapper.get('[aria-label="Create draft"]').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toContain('Destination: Explore · Drafts created: 1')
})

test('controlled rail rejects expansion and blocks disabled and cancelled link callbacks', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(RailLinksDemo, { attachTo: document.body })
  await checkbox(wrapper, 'Accept expansion requests').setValue(false)
  await wrapper.get('[aria-label="Toggle controlled rail"]').trigger('click')
  expect(wrapper.get('[data-mdv-rail]').attributes('data-expanded')).toBe('false')
  const cancelled = railItem(wrapper, 'Cancelled link')
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  cancelled.element.dispatchEvent(event)
  await flushPromises()
  expect(event.defaultPrevented).toBe(true)
  await railItem(wrapper, 'Unavailable').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toContain('Navigation cancelled')
  expect(railItem(wrapper, 'Unavailable').attributes('href')).toBeUndefined()
  ;(railItem(wrapper, 'Overview').element as HTMLElement).focus()
  await railItem(wrapper, 'Overview').trigger('keydown', { key: 'End' })
  expect(document.activeElement).toBe(cancelled.element)
})

test('modal rail keeps collapsed and expanded slot state separate and reports selection closing', async () => {
  mockDialog()
  const wrapper = host = mount(RailModalDemo, { attachTo: document.body })
  const opener = button(wrapper, 'Open modal rail')
  ;(opener.element as HTMLElement).focus()
  await opener.trigger('click')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('.mdv-modal-navigation-rail')
  expect(modal.element.open).toBe(true)
  expect(wrapper.findAll('[data-mdv-rail]').map(rail => rail.attributes('data-expanded'))).toEqual(['false', 'true'])
  await railItem(modal, 'Saved').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Destination: Saved · Last close: select')
  expect(document.activeElement).toBe(opener.element)
  await checkbox(wrapper, 'Hide the collapsed rail').setValue(true)
  expect(wrapper.find('[data-mdv-rail]').exists()).toBe(true) // retained expanded content
  expect(wrapper.find('.mdv-modal-navigation-rail-host > [data-mdv-rail]').exists()).toBe(false)
})

test('rail close policy distinguishes parent rejection from direct model closing', async () => {
  mockDialog()
  const wrapper = host = mount(RailPolicyDemo, { attachTo: document.body })
  await checkbox(wrapper, 'Selection closes').setValue(false)
  await button(wrapper, 'Open policy example').trigger('click')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('dialog')
  await railItem(modal, 'Saved').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(true)
  await checkbox(modal, 'Accept close requests').setValue(false)
  await button(modal, 'Request close()').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(true)
  expect(modal.text()).toContain('close() accepted: false')
  await button(modal, 'Close directly').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(false)
  expect(wrapper.text()).toContain('Closed: model')
})

test('rail content retention preserves local state until destroyOnClose recreates the input', async () => {
  mockDialog()
  const wrapper = host = mount(RailPolicyDemo, { attachTo: document.body })
  for (const destroy of [false, true]) {
    await checkbox(wrapper, 'Destroy expanded content on close').setValue(destroy)
    await button(wrapper, 'Open policy example').trigger('click')
    await flushPromises()
    await wrapper.get('dialog input:not([type="checkbox"])').setValue('Local draft')
    await button(wrapper.get('dialog'), 'Request close()').trigger('click')
    await flushPromises()
    expect(wrapper.find('dialog input:not([type="checkbox"])').exists()).toBe(!destroy)
    await button(wrapper, 'Open policy example').trigger('click')
    await flushPromises()
    expect(wrapper.get<HTMLInputElement>('dialog input:not([type="checkbox"])').element.value).toBe(destroy ? '' : 'Local draft')
    await button(wrapper.get('dialog'), 'Close directly').trigger('click')
    await flushPromises()
  }
})

test('radio groups keep number/string values distinct and skip disabled options during keyboard selection', async () => {
  const wrapper = host = mount(RadioBasicDemo, { attachTo: document.body })
  await radio(wrapper, 'String 1').setValue(true)
  expect(wrapper.get('[role="status"]').text()).toContain('Typed value: string "1"')
  expect(radio(wrapper, 'Number 1').element.checked).toBe(false)
  await radio(wrapper, 'Basic').trigger('keydown', { key: 'ArrowDown' })
  expect(radio(wrapper, 'Pro').element.checked).toBe(true)
  await radio(wrapper, 'Pro').trigger('keydown', { key: 'ArrowDown' })
  expect(radio(wrapper, 'Basic').element.checked).toBe(true)
  expect(document.activeElement).toBe(radio(wrapper, 'Basic').element)
})

test('standalone radios submit one shared native name and reset to their initial application value', async () => {
  const wrapper = host = mount(RadioStandaloneDemo, { attachTo: document.body })
  await radio(wrapper, 'HTML').setValue(true)
  await wrapper.get('form').trigger('submit')
  expect(wrapper.get('[role="status"]').text()).toContain('Submitted format: html')
  expect([...new FormData(wrapper.get<HTMLFormElement>('form').element).values()]).toEqual(['html'])
  wrapper.get<HTMLFormElement>('form').element.reset()
  await flushPromises()
  expect(radio(wrapper, 'PDF').element.checked).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toContain('Model: pdf')
})

test('controlled radio restores rejected native state before accepting later requests', async () => {
  vi.useFakeTimers()
  const wrapper = host = mount(RadioControlledDemo, { attachTo: document.body })
  await radio(wrapper, 'Pro plan').setValue(true)
  await vi.advanceTimersByTimeAsync(1)
  expect(wrapper.get('[role="status"]').text()).toBe('Accepted: basic · Requested: pro')
  expect(radio(wrapper, 'Pro plan').element.checked).toBe(false)
  expect(radio(wrapper, 'Basic plan').element.checked).toBe(true)
  await checkbox(wrapper, 'Accept selection requests').setValue(true)
  await radio(wrapper, 'Pro plan').setValue(true)
  await vi.advanceTimersByTimeAsync(1)
  expect(radio(wrapper, 'Pro plan').element.checked).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toBe('Accepted: pro · Requested: pro')
})

test('radio form uses external association, native/custom validity, disabled omission, and reset cleanup', async () => {
  const wrapper = host = mount(RadioFormDemo, { attachTo: document.body })
  const form = wrapper.get<HTMLFormElement>('form').element
  expect(radio(wrapper, 'Standard').element.form).toBe(form)
  await button(wrapper, 'Report validity').trigger('click')
  expect(wrapper.get('fieldset').attributes('aria-invalid')).toBe('true')
  await radio(wrapper, 'Express').setValue(true)
  expect(form.checkValidity()).toBe(true)
  expect([...new FormData(form)]).toEqual([['delivery', 'express']])
  await button(wrapper, 'Set custom error').trigger('click')
  expect(form.checkValidity()).toBe(false)
  await button(wrapper, 'Clear custom error').trigger('click')
  expect(form.checkValidity()).toBe(true)
  await checkbox(wrapper, 'Disable delivery group').setValue(true)
  expect([...new FormData(form)]).toEqual([])
  await checkbox(wrapper, 'Disable delivery group').setValue(false)
  await button(wrapper, 'Set custom error').trigger('click')
  form.reset()
  await flushPromises()
  expect(radio(wrapper, 'Standard').element.validity.customError).toBe(false)
  expect(radio(wrapper, 'Express').element.checked).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toContain('Model: null')
})

test('search bar commits IME once, submits on Enter, keeps readonly data, and resets its native form', async () => {
  const wrapper = host = mount(SearchBarDemo, { attachTo: document.body })
  const input = wrapper.get<HTMLInputElement>('input[type="search"]')
  await input.trigger('compositionstart')
  await input.setValue('设计')
  await input.trigger('keydown', { key: 'Enter', isComposing: true })
  expect(wrapper.get('[role="status"]').text()).not.toContain('Search submitted:')
  await input.trigger('compositionend')
  await flushPromises()
  await input.trigger('keydown', { key: 'Enter' })
  expect(wrapper.get('[role="status"]').text()).toContain('Search submitted: 设计')
  await checkbox(wrapper, 'Read only').setValue(true)
  expect(wrapper.find('[aria-label="Clear query"]').exists()).toBe(false)
  expect([...new FormData(wrapper.get<HTMLFormElement>('form').element)]).toEqual([['q', '设计']])
  wrapper.get<HTMLFormElement>('form').element.reset()
  await flushPromises()
  expect(input.element.value).toBe('Material')
})

test('search view filters results and explicitly closes after selecting a destination', async () => {
  mockDialog()
  const wrapper = host = mount(SearchViewDemo, { attachTo: document.body })
  await wrapper.get('input[type="search"]').trigger('focus')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('dialog')
  expect(modal.element.open).toBe(true)
  await modal.get('input[type="search"]').setValue('travel')
  expect(modal.findAll('.mdv-list-item__primary')).toHaveLength(1)
  await checkbox(modal, 'Unread only').setValue(true)
  expect(modal.text()).toContain('No matching messages.')
  await checkbox(modal, 'Unread only').setValue(false)
  await modal.get('.mdv-list-item__primary').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(false)
  expect(wrapper.get('p[role="status"]').text()).toContain('Selected: Travel plans for the weekend · Open: false')
})

test('search view transfers one named input and its ID between presentations and resets the active form', async () => {
  mockDialog()
  const wrapper = host = mount(SearchFormDemo, { attachTo: document.body })
  const form = wrapper.get<HTMLFormElement>('form').element
  const entry = wrapper.get<HTMLInputElement>('input[type="search"]')
  const inputId = entry.attributes('id')!
  expect([...new FormData(form)]).toEqual([['q', 'design']])
  await entry.trigger('focus')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('dialog')
  const activeInput = modal.get<HTMLInputElement>('input[type="search"]')
  expect(activeInput.attributes('id')).toBe(inputId)
  expect(entry.attributes('name')).toBeUndefined()
  await activeInput.setValue('navigation')
  expect([...new FormData(form)]).toEqual([['q', 'navigation']])
  await wrapper.get('form').trigger('submit')
  expect(modal.get('p[role="status"]').text()).toContain('Form data: [["q","navigation"]]')
  form.reset()
  await flushPromises()
  expect(activeInput.element.value).toBe('design')
  expect(modal.element.open).toBe(true)
  await button(modal, 'Close form search').trigger('click')
  await flushPromises()
  expect(entry.attributes('id')).toBe(inputId)
  expect([...new FormData(form)]).toEqual([['q', 'design']])
})

test('custom search trigger keeps independent query/open acceptance and offers a direct close', async () => {
  mockDialog()
  const wrapper = host = mount(SearchTriggerDemo, { attachTo: document.body })
  await checkbox(wrapper, 'Accept open requests').setValue(false)
  await wrapper.get('[aria-label="Open controlled search"]').trigger('click')
  await flushPromises()
  expect(wrapper.get<HTMLDialogElement>('dialog').element.open).toBe(false)
  await checkbox(wrapper, 'Accept open requests').setValue(true)
  await wrapper.get('[aria-label="Open controlled search"]').trigger('click')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('dialog')
  await checkbox(modal, 'Accept query requests').setValue(false)
  await modal.get('input[type="search"]').setValue('rejected')
  await flushPromises()
  expect(modal.get<HTMLInputElement>('input[type="search"]').element.value).toBe('')
  await checkbox(modal, 'Accept open requests').setValue(false)
  await button(modal, 'Request search close').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(true)
  await button(modal, 'Close search directly').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(false)
})

test('search close guard preserves a draft on Keep and clears it only after Discard', async () => {
  mockDialog()
  const wrapper = host = mount(SearchGuardDemo, { attachTo: document.body })
  await wrapper.get('input[type="search"]').trigger('focus')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('dialog')
  await modal.get('input:not([type="search"])').setValue('Unpublished note')
  await button(modal, 'Close annotation search').trigger('click')
  await flushPromises()
  expect(modal.get('[role="alert"]').text()).toContain('programmatic')
  await button(modal, 'Keep editing').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(true)
  expect(modal.get<HTMLInputElement>('input:not([type="search"])').element.value).toBe('Unpublished note')
  await button(modal, 'Close annotation search').trigger('click')
  await flushPromises()
  await button(modal, 'Discard note').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(false)
  expect(wrapper.get('p[role="status"]').text()).toBe('Closed: programmatic · Unsaved: false')
})

test('simulated search cancels stale responses and supports failed-request retry with timer cleanup', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  mockDialog()
  const wrapper = host = mount(SearchAsyncDemo, { attachTo: document.body })
  await wrapper.get('input[type="search"]').trigger('focus')
  await flushPromises()
  const modal = wrapper.get('dialog')
  const input = modal.get('input[type="search"]')
  await input.trigger('keydown', { key: 'Enter' })
  expect(modal.find('[role="progressbar"]').exists()).toBe(true)
  await input.setValue('navigation')
  await vi.advanceTimersByTimeAsync(650)
  expect(modal.findAll('.mdv-list-item__primary')).toHaveLength(0)
  await checkbox(modal, 'Fail the next simulated request').setValue(true)
  await input.trigger('keydown', { key: 'Enter' })
  await vi.advanceTimersByTimeAsync(650)
  expect(modal.text()).toContain('The simulated service is unavailable.')
  await button(modal, 'Retry search').trigger('click')
  await vi.advanceTimersByTimeAsync(650)
  expect(modal.get('.mdv-list-item__primary').text()).toBe('Navigation patterns')
  await input.trigger('keydown', { key: 'Enter' })
  wrapper.unmount()
  host = undefined
  expect(vi.getTimerCount()).toBe(0)
})

test('nested search dismisses before its parent dialog and preserves the selected document', async () => {
  mockDialog()
  const wrapper = host = mount(SearchCompositionDemo, { attachTo: document.body })
  await button(wrapper, 'Choose a document').trigger('click')
  await flushPromises()
  await wrapper.get('input[type="search"]').trigger('focus')
  await flushPromises()
  expect(wrapper.findAll<HTMLDialogElement>('dialog').filter(dialog => dialog.element.open)).toHaveLength(2)
  const search = wrapper.get<HTMLDialogElement>('.mdv-search-dialog')
  await search.get('.mdv-list-item__primary').trigger('click')
  await flushPromises()
  expect(search.element.open).toBe(false)
  expect(wrapper.findAll<HTMLDialogElement>('dialog').filter(dialog => dialog.element.open)).toHaveLength(1)
  expect(wrapper.get('[role="status"]').text()).toBe('Design system overview')
})
