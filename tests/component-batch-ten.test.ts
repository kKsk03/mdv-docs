import { flushPromises, mount } from '@vue/test-utils'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { afterEach, expect, test, vi } from 'vitest'
import SegmentedBasicDemo from '../src/components/docs/demos/segmentedButton/basic.vue'
import SegmentedSelectionDemo from '../src/components/docs/demos/segmentedButton/selection.vue'
import SegmentedControlledDemo from '../src/components/docs/demos/segmentedButton/controlled.vue'
import SegmentedFormDemo from '../src/components/docs/demos/segmentedButton/form.vue'
import SelectBasicDemo from '../src/components/docs/demos/select/basic.vue'
import SelectStateDemo from '../src/components/docs/demos/select/state.vue'
import SelectControlledDemo from '../src/components/docs/demos/select/controlled.vue'
import SelectAsyncDemo from '../src/components/docs/demos/select/async.vue'
import SelectFormDemo from '../src/components/docs/demos/select/form.vue'
import SheetModalDemo from '../src/components/docs/demos/sideSheet/modal.vue'
import SheetStandardDemo from '../src/components/docs/demos/sideSheet/standard.vue'
import SheetPolicyDemo from '../src/components/docs/demos/sideSheet/policy.vue'
import SheetGuardDemo from '../src/components/docs/demos/sideSheet/guard.vue'
import SheetFormDemo from '../src/components/docs/demos/sideSheet/form.vue'
import SheetCompositionDemo from '../src/components/docs/demos/sideSheet/composition.vue'
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
function checkbox(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, label: string) {
  const result = wrapper.findAll('.mdv-checkbox').find(candidate => candidate.text() === label)
  if (!result) throw new Error(`Missing checkbox: ${label}`)
  return result.get<HTMLInputElement>('input')
}
async function clickSegment(input: Pick<DOMWrapper<HTMLInputElement>, 'element'>) {
  input.element.click()
  await flushPromises()
  await vi.advanceTimersByTimeAsync(1)
}
async function choose(input: Pick<DOMWrapper<Element>, 'trigger'>, key: 'Home' | 'End' = 'End') {
  await input.trigger('keydown', { key: 'ArrowDown' })
  await input.trigger('keydown', { key })
  await input.trigger('keydown', { key: 'Enter' })
  await flushPromises()
}
// Keep MDV modal logic intact; jsdom only needs native dialog entry/exit methods.
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

test('segmented single navigation selects while multiple navigation and Tab preserve selection', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  const wrapper = host = mount(SegmentedBasicDemo, { attachTo: document.body })
  const period = wrapper.get('[aria-label="Report period"]')
  const week = period.get<HTMLInputElement>('input[value="week"]')
  week.element.focus()
  await week.trigger('keydown', { key: 'ArrowRight' })
  await vi.advanceTimersByTimeAsync(1)
  expect(period.get<HTMLInputElement>('input[value="month"]').element.checked).toBe(true)
  const details = wrapper.get('[aria-label="Report details"]')
  await details.get('input[value="summary"]').trigger('keydown', { key: 'ArrowRight' })
  const images = details.get<HTMLInputElement>('input[value="images"]')
  expect(document.activeElement).toBe(images.element)
  expect(images.element.checked).toBe(false)
  await images.trigger('keydown', { key: 'Enter' })
  await vi.advanceTimersByTimeAsync(1)
  await images.trigger('keydown', { key: 'Tab' })
  expect(document.activeElement).toBe(details.get('input[value="dates"]').element)
  expect(wrapper.get('[role="status"]').text()).toBe('Period: month · Details: ["summary","images"]')
})

test('segmented optional clearing, last-value protection, disabled choices, and strict types compose', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  const wrapper = host = mount(SegmentedSelectionDemo, { attachTo: document.body })
  const optional = wrapper.get('[aria-label="Optional alignment"]').get<HTMLInputElement>('input[value="center"]')
  await clickSegment(optional)
  expect(optional.element.checked).toBe(true)
  await clickSegment(optional)
  expect(optional.element.checked).toBe(false)
  const channels = wrapper.get('[aria-label="Notification channels"]')
  const email = channels.get<HTMLInputElement>('input[value="email"]')
  await clickSegment(email)
  expect(email.element.checked).toBe(true)
  await clickSegment(channels.get('input[value="push"]'))
  await clickSegment(email)
  await clickSegment(channels.get('input[value="push"]'))
  expect(channels.get<HTMLInputElement>('input[value="push"]').element.checked).toBe(true)
  expect(channels.get<HTMLInputElement>('input[value="sms"]').element.disabled).toBe(true)
  const typed = wrapper.get('[aria-label="Strict value types"]').findAll<HTMLInputElement>('input')
  await clickSegment(typed[1]!)
  expect(typed[0]!.element.checked).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toContain('Typed: string "1"')
})

test('segmented controlled rejection restores checked state and native cancellation prevents requests', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  const wrapper = host = mount(SegmentedControlledDemo, { attachTo: document.body })
  const draft = wrapper.get<HTMLInputElement>('input[value="draft"]')
  const published = wrapper.get<HTMLInputElement>('input[value="published"]')
  await clickSegment(published)
  expect(draft.element.checked).toBe(true)
  expect(published.element.checked).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Accepted: draft · Requested: published')
  await checkbox(wrapper, 'Accept selection requests').setValue(true)
  await clickSegment(published)
  await clickSegment(wrapper.get('input[value="blocked"]'))
  expect(published.element.checked).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toBe('Accepted: published · Requested: published')
})

test('segmented external forms submit repeated names, omit disabled inputs, and reset the initial snapshot', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  const wrapper = host = mount(SegmentedFormDemo, { attachTo: document.body })
  const form = wrapper.get<HTMLFormElement>('form').element
  await clickSegment(wrapper.get('input[value="month"]'))
  await clickSegment(wrapper.get('input[value="html"]'))
  expect([...new FormData(form)]).toEqual([['period', 'month'], ['format', 'pdf'], ['format', 'html']])
  await wrapper.get('form').trigger('submit')
  expect(wrapper.get('[role="status"]').text()).toContain('["format","html"]')
  await checkbox(wrapper, 'Disable export fields').setValue(true)
  expect([...new FormData(form)]).toEqual([])
  await checkbox(wrapper, 'Disable export fields').setValue(false)
  form.reset()
  await flushPromises()
  expect([...new FormData(form)]).toEqual([['period', 'week'], ['format', 'pdf']])
  await button(wrapper, 'Focus period').trigger('click')
  expect(document.activeElement?.getAttribute('name')).toBe('period')
})

test('select keeps typed values distinct and skips a disabled final option during keyboard commit', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(SelectBasicDemo, { attachTo: document.body })
  const fields = wrapper.findAll<HTMLInputElement>('[role="combobox"]')
  await choose(fields[1]!)
  expect(fields[1]!.element.value).toBe('Medium')
  expect(fields[1]!.attributes('aria-expanded')).toBe('false')
  await choose(fields[2]!)
  expect(wrapper.get('p[role="status"]').text()).toContain('Typed: string "1"')
  expect(document.activeElement).toBe(fields[2]!.element)
})

test('select renders the empty-list message supplied by the example', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(SelectBasicDemo, { attachTo: document.body })
  const field = wrapper.findAll<HTMLInputElement>('[role="combobox"]').find(
    input => input.element.labels?.[0]?.textContent?.trim() === 'Archived projects',
  )!
  await field.trigger('click')
  await flushPromises()
  const popup = wrapper.get(`[id="${field.attributes('aria-controls')}"]`).element.parentElement!
  expect(field.attributes('aria-expanded')).toBe('true')
  expect(popup.querySelector('[role="status"]')?.textContent?.trim()).toBe('No archived projects')
  expect(popup.querySelector('[role="option"]')).toBeNull()
})

test('select clearing is an application action and external errors do not change native validity', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(SelectStateDemo, { attachTo: document.body })
  const input = wrapper.get<HTMLInputElement>('[role="combobox"]')
  await choose(input)
  await button(wrapper, 'Clear channel').trigger('click')
  expect(input.element.value).toBe('')
  expect(wrapper.get('p[role="status"]').text()).toBe('Model: null · Selected option: Push notification')
  await checkbox(wrapper, 'Show external error').setValue(true)
  expect(input.attributes('aria-invalid')).toBe('true')
  expect(wrapper.get<HTMLSelectElement>('select').element.checkValidity()).toBe(true)
  await checkbox(wrapper, 'Disable channel').setValue(true)
  expect(button(wrapper, 'Clear channel').attributes('disabled')).toBeDefined()
  expect(input.element.disabled).toBe(true)
})

test('select independently accepts value requests and rejects open requests from exposed methods', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(SelectControlledDemo, { attachTo: document.body })
  const input = wrapper.get<HTMLInputElement>('[role="combobox"]')
  await choose(input)
  expect(input.element.value).toBe('Basic')
  expect(input.attributes('aria-expanded')).toBe('false')
  await checkbox(wrapper, 'Accept value requests').setValue(true)
  await choose(input)
  expect(input.element.value).toBe('Pro')
  await checkbox(wrapper, 'Accept open requests').setValue(false)
  await button(wrapper, 'Request open').trigger('click')
  expect(input.attributes('aria-expanded')).toBe('false')
  expect(wrapper.get('p[role="status"]').text()).toContain('Last request: open=true')
})

test('select option loading supports cancellation, failed-request retry, and unmount cleanup', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  setReducedMotion(true)
  const wrapper = host = mount(SelectAsyncDemo, { attachTo: document.body })
  const input = wrapper.get<HTMLInputElement>('[role="combobox"]')
  await button(wrapper, 'Load projects').trigger('click')
  expect(input.element.disabled).toBe(true)
  await button(wrapper, 'Cancel request').trigger('click')
  await vi.advanceTimersByTimeAsync(500)
  expect(wrapper.get('p[role="status"]').text()).toContain('Request cancelled.')
  await checkbox(wrapper, 'Fail the next simulated request').setValue(true)
  await button(wrapper, 'Load projects').trigger('click')
  await vi.advanceTimersByTimeAsync(450)
  expect(wrapper.get('p[role="status"]').text()).toContain('The simulated service is unavailable.')
  expect(input.element.disabled).toBe(true)
  await button(wrapper, 'Load projects').trigger('click')
  await vi.advanceTimersByTimeAsync(450)
  expect(input.element.disabled).toBe(false)
  await choose(input)
  expect(input.element.value).toBe('Documentation website')
  await button(wrapper, 'Load projects').trigger('click')
  wrapper.unmount()
  host = undefined
  expect(vi.getTimerCount()).toBe(0)
})

test('select external forms validate empty values, submit one real value, and clear application errors on reset', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(SelectFormDemo, { attachTo: document.body })
  const form = wrapper.get<HTMLFormElement>('form').element
  const input = wrapper.get('[role="combobox"]')
  expect(form.checkValidity()).toBe(false)
  expect([...new FormData(form)]).toEqual([])
  await choose(input)
  expect([...new FormData(form)]).toEqual([['delivery', 'express']])
  expect(form.checkValidity()).toBe(true)
  await button(wrapper, 'Set custom error').trigger('click')
  expect(form.checkValidity()).toBe(false)
  await button(wrapper, 'Clear custom error').trigger('click')
  expect(form.checkValidity()).toBe(true)
  await choose(input, 'Home')
  expect([...new FormData(form)]).toEqual([['delivery', '']])
  expect(form.checkValidity()).toBe(false)
  await checkbox(wrapper, 'Disable delivery field').setValue(true)
  expect([...new FormData(form)]).toEqual([])
  expect(form.checkValidity()).toBe(true)
  await checkbox(wrapper, 'Disable delivery field').setValue(false)
  await button(wrapper, 'Set custom error').trigger('click')
  form.reset()
  await flushPromises()
  expect(wrapper.get<HTMLSelectElement>('select').element.validity.customError).toBe(false)
  expect([...new FormData(form)]).toEqual([])
  expect(wrapper.get('p[role="status"]').text()).toContain('Model: null')
})

test('modal sheet owns initial focus, application back navigation, action results, and opener restoration', async () => {
  mockDialog()
  const wrapper = host = mount(SheetModalDemo, { attachTo: document.body })
  const opener = button(wrapper, 'Open project details')
  ;(opener.element as HTMLElement).focus()
  await opener.trigger('click')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('dialog')
  expect(modal.element.open).toBe(true)
  expect(document.activeElement).toBe(modal.get('input').element)
  await button(modal, 'View history').trigger('click')
  expect(modal.get('h2').text()).toBe('Project history')
  await modal.get('[aria-label="Back to project details"]').trigger('click')
  expect(modal.get('h2').text()).toBe('Project details')
  expect(modal.element.open).toBe(true)
  await button(modal, 'Done').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Closed: action · Result: done')
  expect(document.activeElement).toBe(opener.element)
})

test('standard sheet keeps main content interactive and only explicitly transfers focus', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(SheetStandardDemo, { attachTo: document.body })
  const opener = button(wrapper, 'Open')
  ;(opener.element as HTMLElement).focus()
  await opener.trigger('click')
  await flushPromises()
  const panel = wrapper.get('[role="dialog"]')
  expect(panel.attributes('aria-modal')).toBeUndefined()
  expect(wrapper.find('dialog').exists()).toBe(false)
  expect(document.activeElement).toBe(opener.element)
  await button(wrapper, 'Focus').trigger('click')
  expect(document.activeElement).toBe(panel.element)
  await button(panel, 'Done').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Closed: action · Result: done')
  expect(document.activeElement).toBe(opener.element)
})

test('sheet close policy honors disabled Escape, parent rejection, and direct model closing', async () => {
  mockDialog()
  const wrapper = host = mount(SheetPolicyDemo, { attachTo: document.body })
  await checkbox(wrapper, 'Escape closes').setValue(false)
  await button(wrapper, 'Open close policy').trigger('click')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('dialog')
  await modal.trigger('cancel')
  await flushPromises()
  expect(modal.element.open).toBe(true)
  await checkbox(modal, 'Accept close requests').setValue(false)
  await button(modal, 'Request close()').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(true)
  expect(modal.get('[role="status"]').text()).toBe('close() accepted: false')
  await button(modal, 'Close directly').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(false)
  expect(wrapper.findAll('[role="status"]').at(-1)!.text()).toBe('Closed: model · Result: (empty)')
})

test('sheet retained and destroyed content have different local draft lifetimes', async () => {
  mockDialog()
  const wrapper = host = mount(SheetPolicyDemo, { attachTo: document.body })
  for (const destroy of [false, true]) {
    await checkbox(wrapper, 'Destroy content on close').setValue(destroy)
    await button(wrapper, 'Open close policy').trigger('click')
    await flushPromises()
    await wrapper.get('dialog input:not([type="checkbox"])').setValue('Local note')
    await button(wrapper.get('dialog'), 'Request close()').trigger('click')
    await flushPromises()
    expect(wrapper.find('dialog input:not([type="checkbox"])').exists()).toBe(!destroy)
    await button(wrapper, 'Open close policy').trigger('click')
    await flushPromises()
    expect(wrapper.get<HTMLInputElement>('dialog input:not([type="checkbox"])').element.value).toBe(destroy ? '' : 'Local note')
    await button(wrapper.get('dialog'), 'Close directly').trigger('click')
    await flushPromises()
  }
})

test('sheet async guard keeps a note, discards only on confirmation, and saves before closing', async () => {
  mockDialog()
  const wrapper = host = mount(SheetGuardDemo, { attachTo: document.body })
  await button(wrapper, 'Edit guarded note').trigger('click')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('dialog')
  await modal.get('input').setValue('Unpublished note')
  await button(modal, 'Cancel').trigger('click')
  await flushPromises()
  expect(modal.get('[role="alert"]').text()).toContain('action')
  await button(modal, 'Keep editing').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(true)
  expect(modal.get<HTMLInputElement>('input').element.value).toBe('Unpublished note')
  await modal.get('[aria-label="Close project note"]').trigger('click')
  await flushPromises()
  await button(modal, 'Discard changes').trigger('click')
  await flushPromises()
  expect(modal.element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toContain('Unsaved: false')
  await button(wrapper, 'Edit guarded note').trigger('click')
  await flushPromises()
  await modal.get('input').setValue('Saved note')
  await button(modal, 'Save note').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Saved: "Saved note" · Unsaved: false · Closed: action · Result: save')
})

test('sheet dialog forms retain actual form values and submitter close results', async () => {
  mockDialog()
  const wrapper = host = mount(SheetFormDemo, { attachTo: document.body })
  await button(wrapper, 'Open native dialog form').trigger('click')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('dialog')
  const form = modal.get<HTMLFormElement>('form')
  expect(form.element.checkValidity()).toBe(false)
  await form.get('input').setValue('Design references')
  expect(form.element.checkValidity()).toBe(true)
  const submitter = button(form, 'Create collection').element as HTMLButtonElement
  form.element.dispatchEvent(new SubmitEvent('submit', { bubbles: true, cancelable: true, submitter }))
  await flushPromises()
  expect(modal.element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toContain('[["collection","Design references"]] · Closed: form · Result: create')
})

test('nested sheet cancellation preserves its parent dialog and restores its opener', async () => {
  mockDialog()
  const wrapper = host = mount(SheetCompositionDemo, { attachTo: document.body })
  await button(wrapper, 'Open document dialog').trigger('click')
  await flushPromises()
  const opener = button(wrapper, 'Edit access settings')
  ;(opener.element as HTMLElement).focus()
  await opener.trigger('click')
  await flushPromises()
  const modal = wrapper.get<HTMLDialogElement>('.mdv-side-sheet')
  await choose(modal.get('[role="combobox"]'))
  await modal.trigger('cancel')
  await flushPromises()
  expect(modal.element.open).toBe(false)
  expect(wrapper.findAll<HTMLDialogElement>('dialog').filter(item => item.element.open)).toHaveLength(1)
  expect(wrapper.get('[role="status"]').text()).toBe('Access: public')
  expect(document.activeElement).toBe(opener.element)
})
