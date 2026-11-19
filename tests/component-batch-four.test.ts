import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { afterEach, expect, test, vi } from 'vitest'
import DatePickerFormDemo from '../src/components/docs/demos/datePicker/form.vue'
import DatePickerControlledDemo from '../src/components/docs/demos/datePicker/controlled.vue'
import DateRangePickerInputDemo from '../src/components/docs/demos/dateRangePicker/input.vue'
import DateRangePickerConstraintsDemo from '../src/components/docs/demos/dateRangePicker/constraints.vue'
import DateRangePickerFormDemo from '../src/components/docs/demos/dateRangePicker/form.vue'
import DialogBasicDemo from '../src/components/docs/demos/dialog/basic.vue'
import DialogPolicyDemo from '../src/components/docs/demos/dialog/policy.vue'
import DialogGuardDemo from '../src/components/docs/demos/dialog/guard.vue'
import DialogNativeFormDemo from '../src/components/docs/demos/dialog/nativeForm.vue'
import DialogNestedDemo from '../src/components/docs/demos/dialog/nested.vue'
import { setReducedMotion } from './setup.ts'

function button(wrapper: VueWrapper, text: string) {
  const target = wrapper.findAll('button').find(candidate => candidate.text() === text)
  if (!target) throw new Error(`Missing button: ${text}`)
  return target
}

let restoreDialog: (() => void) | undefined
let dialogHost: VueWrapper | undefined

afterEach(() => {
  dialogHost?.unmount()
  dialogHost = undefined
  restoreDialog?.()
  restoreDialog = undefined
})

function mockNativeDialog() {
  setReducedMotion(true)
  const prototype = HTMLDialogElement.prototype
  const previous = ['showModal', 'close'].map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)] as const)
  // Supply only jsdom's missing native methods; MDV still owns guards, focus, and lifecycle.
  Object.defineProperties(prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) {
      this.open = true
    } },
    close: { configurable: true, value(this: HTMLDialogElement, value = '') {
      if (!this.open) return
      this.returnValue = value
      this.open = false
      queueMicrotask(() => this.dispatchEvent(new Event('close')))
    } },
  })
  restoreDialog = () => {
    for (const [name, descriptor] of previous) {
      if (descriptor) Object.defineProperty(prototype, name, descriptor)
      else Reflect.deleteProperty(prototype, name)
    }
  }
}

test('single-date form submits accepted ISO data, preserves invalid text, and resets custom validity', async () => {
  const wrapper = mount(DatePickerFormDemo, { attachTo: document.body })
  const entry = wrapper.get<HTMLInputElement>('input[data-date-entry]')
  const form = wrapper.get('form').element
  await entry.setValue('11/23/2026')
  await entry.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(new FormData(form).getAll('appointment')).toEqual(['2026-11-23'])
  await button(wrapper, 'Submit').trigger('click')
  expect(JSON.parse(wrapper.get('[role="status"]').text())).toEqual({ appointment: '2026-11-23' })

  await entry.setValue('02/30/2026')
  await entry.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(entry.element.value).toBe('02/30/2026')
  expect(entry.element.checkValidity()).toBe(false)
  expect(new FormData(form).get('appointment')).toBe('2026-11-23')

  await wrapper.get('input[type="checkbox"]').setValue(true)
  await flushPromises()
  expect(entry.element.validationMessage).toBe('Resolve the booking conflict first.')
  await button(wrapper, 'Check validity').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Date needs attention.')
  await button(wrapper, 'Reset').trigger('click')
  await flushPromises()
  expect(new FormData(form).get('appointment')).toBe('2026-11-19')
  expect(entry.element.checkValidity()).toBe(true)
  expect((wrapper.get('input[type="checkbox"]').element as HTMLInputElement).checked).toBe(false)
})

test('controlled single-date demo rejects then accepts entry changes without opening its calendar', async () => {
  const wrapper = mount(DatePickerControlledDemo, { attachTo: document.body })
  const entry = wrapper.get<HTMLInputElement>('input[data-date-entry]')
  await entry.setValue('11/25/2026')
  await entry.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Committed: 2026-11-19 · Open: false')
  expect(wrapper.get('[role="status"]').text()).toContain('Date 2026-11-25: rejected.')
  expect(entry.element.value).toBe('11/19/2026')

  await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(false)
  await entry.setValue('2026-11-25')
  await entry.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Committed: 2026-11-25 · Open: false')
  await button(wrapper, 'Focus field').trigger('click')
  expect(document.activeElement).toBe(entry.element)
  expect(wrapper.get('[role="status"]').text()).toContain('Open: false')
})

test('range input demo accepts only a complete ordered pair in its configured date format', async () => {
  const wrapper = mount(DateRangePickerInputDemo, { attachTo: document.body })
  const [start, end] = wrapper.findAll<HTMLInputElement>('input[data-date-entry]')
  await start!.setValue('23/11/2026')
  await start!.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Complete ISO range: null')
  expect(start!.element.validationMessage).toBe('Enter both start and end dates.')
  await end!.setValue('21/11/2026')
  await end!.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(end!.element.validationMessage).toBe('End must not precede start.')
  expect(wrapper.get('[role="status"]').text()).toBe('Complete ISO range: null')
  await end!.setValue('25/11/2026')
  await end!.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Complete ISO range: {"start":"2026-11-23","end":"2026-11-25"}')
  expect(start!.element.checkValidity()).toBe(true)
  expect(end!.element.checkValidity()).toBe(true)
})

test('range constraints reject an unavailable interior date and keep read-only values submit-ready', async () => {
  const wrapper = mount(DateRangePickerConstraintsDemo, { attachTo: document.body })
  const [start, end] = wrapper.findAll<HTMLInputElement>('input[data-date-entry]')
  await end!.setValue('11/23/2026')
  await end!.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(end!.element.validationMessage).toBe('The range contains an unavailable date.')
  expect(wrapper.get('[role="status"]').text()).toContain('"end":"2026-11-19"')
  await start!.setValue('11/21/2026')
  await end!.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('{"start":"2026-11-21","end":"2026-11-23"}')
  await wrapper.get('input[type="checkbox"]').setValue(true)
  expect(start!.element.readOnly).toBe(true)
  expect(start!.element.disabled).toBe(false)
  expect(wrapper.get('button[aria-label="Open date picker"]').attributes('disabled')).toBeDefined()
})

test('range form submits each endpoint once, omits disabled fields, and restores its initial pair', async () => {
  const wrapper = mount(DateRangePickerFormDemo, { attachTo: document.body })
  const form = wrapper.get('form').element
  const end = wrapper.findAll<HTMLInputElement>('input[data-date-entry]')[1]!
  await end.setValue('11/25/2026')
  await end.trigger('keydown', { key: 'Enter' })
  await flushPromises()
  await button(wrapper, 'Submit booking').trigger('click')
  expect(JSON.parse(wrapper.get('[role="status"]').text())).toEqual({ arrival: '2026-11-21', departure: '2026-11-25' })
  expect(new FormData(form).getAll('departure')).toEqual(['2026-11-25'])
  await wrapper.get('input[type="checkbox"]').setValue(true)
  await flushPromises()
  expect([...new FormData(form)]).toEqual([])
  await button(wrapper, 'Reset booking').trigger('click')
  await flushPromises()
  expect(Object.fromEntries(new FormData(form))).toEqual({ arrival: '2026-11-21', departure: '2026-11-23' })
})

test('basic dialog demo returns the chosen result and restores its opener', async () => {
  mockNativeDialog()
  const wrapper = dialogHost = mount(DialogBasicDemo, { attachTo: document.body })
  const opener = button(wrapper, 'Review changes')
  opener.element.focus()
  await opener.trigger('click')
  await flushPromises()
  const dialog = wrapper.get<HTMLDialogElement>('dialog')
  expect(dialog.element.open).toBe(true)
  expect(dialog.attributes('role')).toBe('alertdialog')
  expect(document.activeElement).toBe(button(wrapper, 'Keep editing').element)
  await button(wrapper, 'Discard').trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('action · discard')
  expect(document.activeElement).toBe(opener.element)
})

test('dialog policy demo handles parent rejection and retains or destroys its internal field state', async () => {
  mockNativeDialog()
  const wrapper = dialogHost = mount(DialogPolicyDemo, { attachTo: document.body })
  await button(wrapper, 'Try close policy').trigger('click')
  await flushPromises()
  const dialog = wrapper.get<HTMLDialogElement>('dialog')
  await dialog.get('input[type="text"]').setValue('Keep this draft')
  await dialog.get('input[type="checkbox"]').setValue(true)
  await button(wrapper, 'Done').trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(true)
  expect(wrapper.findAll('[role="status"]').at(-1)!.text()).toBe('The parent rejected closing.')
  await dialog.get('input[type="checkbox"]').setValue(false)
  await button(wrapper, 'Done').trigger('click')
  await flushPromises()
  await button(wrapper, 'Try close policy').trigger('click')
  await flushPromises()
  expect(dialog.get<HTMLInputElement>('input[type="text"]').element.value).toBe('Keep this draft')
  await button(wrapper, 'Done').trigger('click')
  await flushPromises()
  await wrapper.findAll('input[type="checkbox"]')[2]!.setValue(true)
  await button(wrapper, 'Try close policy').trigger('click')
  await flushPromises()
  await dialog.get('input[type="text"]').setValue('Discard this draft')
  await button(wrapper, 'Done').trigger('click')
  await flushPromises()
  expect(dialog.find('input').exists()).toBe(false)
  await button(wrapper, 'Try close policy').trigger('click')
  await flushPromises()
  expect(dialog.get<HTMLInputElement>('input[type="text"]').element.value).toBe('')
})

test('asynchronous dialog guard blocks dismissal, disables duplicate actions, and later allows closing', async () => {
  mockNativeDialog()
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  const wrapper = dialogHost = mount(DialogGuardDemo, { attachTo: document.body })
  await button(wrapper, 'Try an asynchronous guard').trigger('click')
  await flushPromises()
  const dialog = wrapper.get<HTMLDialogElement>('dialog')
  await button(wrapper, 'Check and close').trigger('click')
  await flushPromises()
  expect(button(wrapper, 'Check and close').attributes('disabled')).toBeDefined()
  expect(button(wrapper, 'Cancel').attributes('disabled')).toBeDefined()
  await vi.advanceTimersByTimeAsync(600)
  await flushPromises()
  expect(dialog.element.open).toBe(true)
  expect(wrapper.findAll('[role="status"]').at(-1)!.text()).toContain('Dismissal blocked.')
  await dialog.get('input[type="checkbox"]').setValue(true)
  await button(wrapper, 'Check and close').trigger('click')
  await vi.advanceTimersByTimeAsync(600)
  await flushPromises()
  expect(dialog.element.open).toBe(false)
  expect(wrapper.findAll('[role="status"]').at(-1)!.text()).toBe('Dismissal allowed.')
})

test('native dialog-form demo respects required validation and uses the submitter result', async () => {
  mockNativeDialog()
  const wrapper = dialogHost = mount(DialogNativeFormDemo, { attachTo: document.body })
  await button(wrapper, 'Try method="dialog"').trigger('click')
  await flushPromises()
  const dialog = wrapper.get<HTMLDialogElement>('dialog')
  await button(wrapper, 'Create project').trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(true)
  expect(dialog.get<HTMLInputElement>('input').element.validity.valueMissing).toBe(true)
  await dialog.get('input').setValue('Design system')
  await button(wrapper, 'Create project').trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('form · created')
})

test('nested dialog demo dismisses only the top dialog and returns focus to the parent action', async () => {
  mockNativeDialog()
  const wrapper = dialogHost = mount(DialogNestedDemo, { attachTo: document.body })
  await button(wrapper, 'Open collection settings').trigger('click')
  await flushPromises()
  const remove = button(wrapper, 'Remove bookmark')
  remove.element.focus()
  await remove.trigger('click')
  await flushPromises()
  expect(wrapper.findAll('dialog[open]')).toHaveLength(2)
  expect(document.activeElement).toBe(button(wrapper, 'Keep bookmark').element)
  await button(wrapper, 'Keep bookmark').trigger('keydown', { key: 'Escape' })
  await flushPromises()
  expect(wrapper.findAll('dialog[open]')).toHaveLength(1)
  expect(document.activeElement).toBe(remove.element)
  await remove.trigger('click')
  await flushPromises()
  await button(wrapper, 'Remove it').trigger('click')
  await flushPromises()
  expect(wrapper.findAll('dialog[open]')).toHaveLength(1)
  expect(wrapper.get('[role="status"]').text()).toBe('Bookmark removed.')
  expect(remove.attributes('disabled')).toBeDefined()
  await button(wrapper, 'Done with settings').trigger('click')
  await flushPromises()
  expect(wrapper.findAll('dialog[open]')).toHaveLength(0)
})
