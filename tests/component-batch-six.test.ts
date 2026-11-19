import { flushPromises, mount } from '@vue/test-utils'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { afterEach, expect, test, vi } from 'vitest'
import IconSemanticsDemo from '../src/components/docs/demos/icon/semantics.vue'
import IconButtonControlledDemo from '../src/components/docs/demos/iconButton/controlled.vue'
import IconButtonStateDemo from '../src/components/docs/demos/iconButton/state.vue'
import IconButtonFormDemo from '../src/components/docs/demos/iconButton/form.vue'
import IconButtonColorDemo from '../src/components/docs/demos/iconButton/color.vue'
import FullscreenBasicDemo from '../src/components/docs/demos/fullscreenDialog/basic.vue'
import FullscreenFormDemo from '../src/components/docs/demos/fullscreenDialog/form.vue'
import FullscreenPolicyDemo from '../src/components/docs/demos/fullscreenDialog/policy.vue'
import FullscreenAsyncDemo from '../src/components/docs/demos/fullscreenDialog/async.vue'
import FullscreenGuardDemo from '../src/components/docs/demos/fullscreenDialog/guard.vue'
import { setReducedMotion } from './setup.ts'

function button(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, text: string) {
  const target = wrapper.findAll('button').find(candidate => candidate.text() === text)
  if (!target) throw new Error(`Missing button: ${text}`)
  return target
}

let host: VueWrapper | undefined
let restoreDialog: (() => void) | undefined

afterEach(() => {
  host?.unmount()
  host = undefined
  restoreDialog?.()
  restoreDialog = undefined
})

function mockNativeDialog() {
  setReducedMotion(true)
  const prototype = HTMLDialogElement.prototype
  const previous = ['showModal', 'close'].map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)] as const)
  // Supply only jsdom's missing native methods; MDV owns modal state and focus.
  Object.defineProperties(prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
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

test('icon semantics demo toggles its standalone image name and references a real label', async () => {
  const wrapper = mount(IconSemanticsDemo)
  const image = wrapper.get('svg[aria-label="Ready to sync"]')
  expect(image.attributes('role')).toBe('img')
  expect(image.attributes('aria-hidden')).toBeUndefined()
  expect(image.attributes('focusable')).toBe('false')
  const labelled = wrapper.get('svg[aria-labelledby]')
  const label = wrapper.get(`#${labelled.attributes('aria-labelledby')}`)
  expect(label.text()).toBe('Needs attention')
  await wrapper.get('input[type="checkbox"]').setValue(false)
  expect(image.attributes('aria-label')).toBeUndefined()
  expect(image.attributes('aria-hidden')).toBe('true')
  expect(wrapper.text()).toContain('decorative and hidden')
})

test('icon button demo separates rejected model changes from cancelled activation', async () => {
  const wrapper = mount(IconButtonControlledDemo)
  const control = wrapper.get('button[aria-label="Bookmark note"]')
  await control.trigger('click')
  expect(control.attributes('aria-pressed')).toBe('false')
  expect(wrapper.get('[role="status"]').text()).toContain('Requested true: rejected.')
  await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true)
  await control.trigger('click')
  expect(control.attributes('aria-pressed')).toBe('true')
  expect(wrapper.get('[role="status"]').text()).toContain('Requested true: accepted.')
  await wrapper.findAll('input[type="checkbox"]')[1]!.setValue(true)
  await control.trigger('click')
  expect(control.attributes('aria-pressed')).toBe('true')
  expect(control.attributes('aria-label')).toBe('Bookmark note')
  expect(wrapper.get('[role="status"]').text()).toContain('Click cancelled before a selection request.')
})

test('loading icon actions remain usable until disabled, including toggle and link semantics', async () => {
  const wrapper = mount(IconButtonStateDemo, { attachTo: document.body })
  const refresh = wrapper.get('button[aria-label="Refresh preview"]')
  const favorite = wrapper.get('button[aria-label="Favorite preview"]')
  const link = wrapper.get('a[aria-label="Read icon button design guide"]')
  const destination = link.attributes('href')
  await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true)
  expect(refresh.attributes('aria-busy')).toBe('true')
  expect(refresh.attributes('disabled')).toBeUndefined()
  expect(refresh.attributes('aria-pressed')).toBeUndefined()
  await refresh.trigger('click')
  await favorite.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toContain('Refreshes: 1 · Favorite: true')
  expect(favorite.attributes('aria-pressed')).toBe('true')
  await wrapper.findAll('input[type="checkbox"]')[1]!.setValue(true)
  await refresh.trigger('click')
  await favorite.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toContain('Refreshes: 1 · Favorite: true')
  expect(link.attributes('href')).toBeUndefined()
  expect(link.attributes('aria-disabled')).toBe('true')
  expect(link.attributes('tabindex')).toBe('-1')
  const click = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
  link.element.dispatchEvent(click)
  expect(click.defaultPrevented).toBe(true)
  await wrapper.findAll('input[type="checkbox"]')[1]!.setValue(false)
  expect(link.attributes('href')).toBe(destination)
  expect(link.attributes('aria-disabled')).toBeUndefined()
})

test('icon form buttons preserve native required validation, ordinary actions, and reset', async () => {
  const wrapper = mount(IconButtonFormDemo, { attachTo: document.body })
  const title = wrapper.get<HTMLInputElement>('input[name="title"]')
  await wrapper.get('button[aria-label="Save draft"]').trigger('click')
  expect(title.element.validity.valueMissing).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toBe('Enter a title before saving.')
  await wrapper.get('button[aria-label="Preview draft"]').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Preview: (empty)')
  await title.setValue('Reading notes')
  await wrapper.get('button[aria-label="Save draft"]').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Saved: Reading notes')
  expect(new FormData(wrapper.get('form').element).getAll('title')).toEqual(['Reading notes'])
  await wrapper.get('button[aria-label="Reset draft"]').trigger('click')
  await flushPromises()
  expect(title.element.value).toBe('')
  expect(wrapper.get('[role="status"]').text()).toBe('Draft reset.')
})

test('color demo retains the accepted seed after invalid input and applies a valid replacement', async () => {
  const wrapper = mount(IconButtonColorDemo)
  const seed = wrapper.get('input[type="text"]:not([role="combobox"])')
  await seed.setValue('red')
  await wrapper.get('form').trigger('submit')
  expect(wrapper.text()).toContain('Use #RGB or #RRGGBB')
  expect(wrapper.find('button[aria-label="Favorite, #006c4c"]').exists()).toBe(true)
  await seed.setValue('#06C')
  await wrapper.get('form').trigger('submit')
  expect(wrapper.find('button[aria-label="Favorite, #06C"]').exists()).toBe(true)
  expect(wrapper.text()).not.toContain('Use #RGB or #RRGGBB')
})

test('fullscreen demo provides dialog naming, a return value, and opener focus restoration', async () => {
  mockNativeDialog()
  const wrapper = host = mount(FullscreenBasicDemo, { attachTo: document.body })
  const opener = button(wrapper, 'Review workspace')
  opener.element.focus()
  await opener.trigger('click')
  await flushPromises()
  const dialog = wrapper.get<HTMLDialogElement>('dialog')
  expect(dialog.element.open).toBe(true)
  expect(dialog.attributes('role')).toBe('dialog')
  expect(wrapper.get(`#${dialog.attributes('aria-labelledby')}`).text()).toBe('Review workspace')
  expect(wrapper.get(`#${dialog.attributes('aria-describedby')}`).text()).toContain('fills the viewport')
  await button(wrapper, 'Approve').trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('action · approved')
  expect(document.activeElement).toBe(opener.element)
})

test('fullscreen header submission targets the body form and respects native required validation', async () => {
  mockNativeDialog()
  const wrapper = host = mount(FullscreenFormDemo, { attachTo: document.body })
  await button(wrapper, 'Create workspace').trigger('click')
  await flushPromises()
  const dialog = wrapper.get<HTMLDialogElement>('dialog')
  const input = dialog.get<HTMLInputElement>('input[name="workspace"]')
  expect(document.activeElement).toBe(input.element)
  expect(button(wrapper, 'Save').attributes('form')).toBe(dialog.get('form').attributes('id'))
  await button(wrapper, 'Save').trigger('click')
  await flushPromises()
  expect(input.element.validity.valueMissing).toBe(true)
  expect(dialog.element.open).toBe(true)
  await input.setValue('Design workspace')
  await button(wrapper, 'Save').trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Saved: Design workspace')
})

test('fullscreen policy keeps an exit action, handles parent rejection, and retains or destroys fields', async () => {
  mockNativeDialog()
  const wrapper = host = mount(FullscreenPolicyDemo, { attachTo: document.body })
  await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(false)
  await wrapper.findAll('input[type="checkbox"]')[1]!.setValue(false)
  await button(wrapper, 'Try fullscreen policy').trigger('click')
  await flushPromises()
  const dialog = wrapper.get<HTMLDialogElement>('dialog')
  expect(dialog.find('button[aria-label="Close policy preview"]').exists()).toBe(false)
  await dialog.get('input[type="text"]').setValue('Retained draft')
  await dialog.trigger('keydown', { key: 'Escape' })
  await flushPromises()
  expect(dialog.element.open).toBe(true)
  await dialog.get('input[type="checkbox"]').setValue(true)
  await button(wrapper, 'Done').trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(true)
  expect(wrapper.findAll('[role="status"]').at(-1)!.text()).toBe('The parent rejected closing.')
  await dialog.get('input[type="checkbox"]').setValue(false)
  await button(wrapper, 'Done').trigger('click')
  await flushPromises()
  await button(wrapper, 'Try fullscreen policy').trigger('click')
  await flushPromises()
  expect(dialog.get<HTMLInputElement>('input[type="text"]').element.value).toBe('Retained draft')
  await button(wrapper, 'Done').trigger('click')
  await flushPromises()
  await wrapper.findAll('input[type="checkbox"]')[2]!.setValue(true)
  await button(wrapper, 'Try fullscreen policy').trigger('click')
  await flushPromises()
  await button(wrapper, 'Done').trigger('click')
  await flushPromises()
  expect(dialog.find('input').exists()).toBe(false)
  await button(wrapper, 'Try fullscreen policy').trigger('click')
  await flushPromises()
  expect(dialog.get<HTMLInputElement>('input[type="text"]').element.value).toBe('')
})

test('asynchronous fullscreen saving blocks dismissal, preserves a failed draft, and later succeeds', async () => {
  mockNativeDialog()
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  const wrapper = host = mount(FullscreenAsyncDemo, { attachTo: document.body })
  await button(wrapper, 'Try asynchronous save').trigger('click')
  await flushPromises()
  const dialog = wrapper.get<HTMLDialogElement>('dialog')
  await button(wrapper, 'Publish').trigger('click')
  await flushPromises()
  expect(button(wrapper, 'Cancel').attributes('disabled')).toBeDefined()
  expect(dialog.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  await dialog.get('button[aria-label="Close publishing"]').trigger('click')
  await flushPromises()
  expect(dialog.element.open).toBe(true)
  await vi.advanceTimersByTimeAsync(600)
  await flushPromises()
  expect(dialog.element.open).toBe(true)
  expect(dialog.get<HTMLInputElement>('input[type="text"]').element.value).toBe('Field notes')
  expect(wrapper.findAll('[role="status"]').at(-1)!.text()).toContain('Save failed.')
  await dialog.get('input[type="checkbox"]').setValue(false)
  await button(wrapper, 'Publish').trigger('click')
  await vi.advanceTimersByTimeAsync(600)
  await flushPromises()
  expect(dialog.element.open).toBe(false)
  expect(wrapper.findAll('[role="status"]').at(-1)!.text()).toBe('Saved: Field notes')
})

test('unsaved fullscreen guard waits for nested confirmation and preserves or discards the draft', async () => {
  mockNativeDialog()
  const wrapper = host = mount(FullscreenGuardDemo, { attachTo: document.body })
  await button(wrapper, 'Edit reading plan').trigger('click')
  await flushPromises()
  const outer = wrapper.get<HTMLDialogElement>('dialog[role="dialog"]')
  await outer.get('input').setValue('Unsaved plan')
  await button(wrapper, 'Cancel').trigger('click')
  await flushPromises()
  expect(wrapper.findAll('dialog[open]')).toHaveLength(2)
  expect(document.activeElement).toBe(button(wrapper, 'Keep editing').element)
  await button(wrapper, 'Keep editing').trigger('click')
  await flushPromises()
  expect(wrapper.findAll('dialog[open]')).toHaveLength(1)
  expect(outer.get<HTMLInputElement>('input').element.value).toBe('Unsaved plan')
  await button(wrapper, 'Cancel').trigger('click')
  await flushPromises()
  await button(wrapper, 'Keep editing').trigger('keydown', { key: 'Escape' })
  await flushPromises()
  expect(outer.element.open).toBe(true)
  await button(wrapper, 'Cancel').trigger('click')
  await flushPromises()
  await button(wrapper, 'Discard').trigger('click')
  await flushPromises()
  expect(wrapper.findAll('dialog[open]')).toHaveLength(0)
  expect(wrapper.get('[role="status"]').text()).toBe('Saved plan: Weekend reading')
  await button(wrapper, 'Edit reading plan').trigger('click')
  await flushPromises()
  expect(outer.get<HTMLInputElement>('input').element.value).toBe('Weekend reading')
  await outer.get('input').setValue('Saved plan')
  await button(wrapper, 'Save changes').trigger('click')
  await flushPromises()
  expect(outer.element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Saved plan: Saved plan')
})
