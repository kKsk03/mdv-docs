import { flushPromises, mount } from '@vue/test-utils'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { afterEach, expect, test, vi } from 'vitest'
import { MdvExtendedFab } from '@mdv-ui/mdv'
import DividerSemanticsDemo from '../src/components/docs/demos/divider/semantics.vue'
import FabExtendedDemo from '../src/components/docs/demos/fab/extended.vue'
import FabFormDemo from '../src/components/docs/demos/fab/form.vue'
import FabScrollDemo from '../src/components/docs/demos/fab/scroll.vue'
import FabMenuBasicDemo from '../src/components/docs/demos/fabMenu/basic.vue'
import FabMenuSelectionDemo from '../src/components/docs/demos/fabMenu/selection.vue'
import FabMenuControlledDemo from '../src/components/docs/demos/fabMenu/controlled.vue'
import { setReducedMotion } from './setup.ts'

function button(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, text: string) {
  const target = wrapper.findAll('button').find(candidate => candidate.text() === text)
  if (!target) throw new Error(`Missing button: ${text}`)
  return target
}

let host: VueWrapper | undefined
let restorePopover: (() => void) | undefined

afterEach(() => {
  host?.unmount()
  host = undefined
  restorePopover?.()
  restorePopover = undefined
})

function mockPopover() {
  setReducedMotion(true)
  const opened = new Set<HTMLElement>()
  const previous = ['showPopover', 'hidePopover'].map(name => [name, Object.getOwnPropertyDescriptor(HTMLElement.prototype, name)] as const)
  // Only supply missing native Popover state; use MDV's real selection and focus logic.
  Object.defineProperties(HTMLElement.prototype, {
    showPopover: { configurable: true, value(this: HTMLElement) {
      opened.add(this)
      this.style.display = 'block'
    } },
    hidePopover: { configurable: true, value(this: HTMLElement) {
      opened.delete(this)
      this.style.removeProperty('display')
    } },
  })
  const matches = Element.prototype.matches
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
    return selector === ':popover-open' ? opened.has(this as HTMLElement) : matches.call(this, selector)
  })
  restorePopover = () => {
    for (const [name, descriptor] of previous) {
      if (descriptor) Object.defineProperty(HTMLElement.prototype, name, descriptor)
      else Reflect.deleteProperty(HTMLElement.prototype, name)
    }
  }
  return opened
}

test('divider demo switches meaningful separator semantics without adding a focus stop', async () => {
  const wrapper = mount(DividerSemanticsDemo)
  const separator = wrapper.get('[role="separator"]')
  expect(separator.attributes('aria-label')).toBe('Reading and actions')
  expect(separator.attributes('aria-orientation')).toBe('horizontal')
  expect(separator.attributes('tabindex')).toBeUndefined()
  await wrapper.get('input[type="checkbox"]').setValue(false)
  expect(wrapper.find('[role="separator"]').exists()).toBe(false)
  expect(separator.attributes('aria-hidden')).toBe('true')
  await button(wrapper, 'Next action').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Next action selected.')
})

test('extended FAB demo rejects and accepts expansion while keeping the same named action', async () => {
  setReducedMotion(true)
  const wrapper = mount(FabExtendedDemo, { attachTo: document.body })
  const fab = wrapper.getComponent(MdvExtendedFab)
  const element = fab.element
  await button(wrapper, 'Request collapse').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('collapse() not accepted. · Notes: 0')
  expect(fab.props('expanded')).toBe(true)
  await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true)
  await button(wrapper, 'Request collapse').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('collapse() accepted. · Notes: 0')
  expect(fab.props('expanded')).toBe(false)
  expect(fab.element).toBe(element)
  expect(fab.text()).toBe('Write note')
  expect(fab.attributes('aria-expanded')).toBeUndefined()
  await fab.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toContain('Notes: 1')
  await button(wrapper, 'Focus action').trigger('click')
  expect(document.activeElement).toBe(element)
  await wrapper.findAll('input[type="checkbox"]')[1]!.setValue(false)
  expect(await fab.vm.collapse()).toBe(false)
  expect(await fab.vm.expand()).toBe(true)
  expect(fab.text()).toBe('Write note')
})

test('FAB form demo keeps native validation, submit/reset behavior, and real link attributes', async () => {
  const wrapper = mount(FabFormDemo, { attachTo: document.body })
  const title = wrapper.get<HTMLInputElement>('input[name="title"]')
  const form = wrapper.get('form').element
  await button(wrapper, 'Save note').trigger('click')
  expect(title.element.validity.valueMissing).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toBe('Enter a title before saving.')
  await title.setValue('Reading list')
  await button(wrapper, 'Save note').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Saved: Reading list')
  expect(new FormData(form).getAll('title')).toEqual(['Reading list'])
  await wrapper.get('button[aria-label="Reset draft"]').trigger('click')
  await flushPromises()
  expect(title.element.value).toBe('')
  expect(wrapper.get('[role="status"]').text()).toBe('Draft reset.')
  const link = wrapper.get('a')
  expect(link.text()).toBe('Design guide')
  expect(link.attributes('href')).toBe('https://m3.material.io/components/floating-action-button/overview')
  expect(link.attributes('target')).toBe('_blank')
  expect(link.attributes('rel')).toBe('noopener noreferrer')
})

test('scroll demo targets its own scaffold, responds to reversal, and can disable collapse', async () => {
  setReducedMotion(true)
  const wrapper = mount(FabScrollDemo, { attachTo: document.body })
  await flushPromises()
  const region = wrapper.get<HTMLElement>('[aria-label="Scrollable field notes"]')
  // jsdom has no layout; supply only the dimensions of the actual preview scroll node.
  Object.defineProperties(region.element, {
    scrollHeight: { configurable: true, value: 1200 },
    clientHeight: { configurable: true, value: 300 },
  })
  vi.stubGlobal('scrollY', 120)
  window.dispatchEvent(new Event('scroll'))
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Label: expanded')
  region.element.scrollTop = 100
  await region.trigger('scroll')
  expect(wrapper.get('[role="status"]').text()).toContain('Label: collapsed')
  region.element.scrollTop = 50
  await region.trigger('scroll')
  expect(wrapper.get('[role="status"]').text()).toContain('Label: expanded')
  await wrapper.get('input[type="checkbox"]').setValue(false)
  region.element.scrollTop = 180
  await region.trigger('scroll')
  expect(wrapper.get('[role="status"]').text()).toContain('Label: expanded')
})

test.each(['expressive', 'baseline'] as const)('%s FAB menu demo runs a named action once and closes', async variant => {
  const opened = mockPopover()
  const wrapper = host = mount(FabMenuBasicDemo, { attachTo: document.body })
  const trigger = wrapper.get(`button[aria-label="Create content, ${variant}"]`)
  await trigger.trigger('click')
  await flushPromises()
  expect(trigger.attributes('aria-expanded')).toBe('true')
  expect(opened.size).toBe(1)
  const menu = wrapper.get(`.mdv-fab-menu--${variant}`)
  await button(menu, 'New document').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe(`${variant}: document`)
  expect(trigger.attributes('aria-expanded')).toBe('false')
  expect(opened.size).toBe(0)
})

test.each(['expressive', 'baseline'] as const)('%s selection demo keeps repeated actions open and cancels link navigation', async variant => {
  const opened = mockPopover()
  const wrapper = host = mount(FabMenuSelectionDemo, { attachTo: document.body })
  // Drive the presentation's public model while retaining real menu action controls.
  await wrapper.getComponent({ name: 'MdvSelect' }).vm.$emit('update:modelValue', variant)
  await flushPromises()
  const trigger = wrapper.get('button[aria-label="Try selection rules"]')
  await trigger.trigger('click')
  await flushPromises()
  await button(wrapper, 'Add another').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Items added: 1')
  expect(trigger.attributes('aria-expanded')).toBe('true')
  const link = wrapper.get('a[href="#cancelled-fab-action"]')
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
  link.element.dispatchEvent(event)
  await flushPromises()
  expect(event.defaultPrevented).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toContain('Link selection cancelled')
  expect(trigger.attributes('aria-expanded')).toBe('true')
  const disabled = wrapper.get('a[aria-disabled="true"]')
  expect(disabled.attributes('href')).toBeUndefined()
  const disabledClick = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })
  disabled.element.dispatchEvent(disabledClick)
  await flushPromises()
  expect(disabledClick.defaultPrevented).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toContain('Link selection cancelled')
  expect(opened.size).toBe(1)
  await button(wrapper, 'Run and close').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Selected finish.')
  expect(trigger.attributes('aria-expanded')).toBe('false')
  expect(opened.size).toBe(0)
})

test('controlled FAB menu demo rejects opening and one close before accepting Escape and restoring focus', async () => {
  const opened = mockPopover()
  const wrapper = host = mount(FabMenuControlledDemo, { attachTo: document.body })
  const trigger = wrapper.get('button[aria-label="Controlled creation"]')
  await button(wrapper, 'Request open').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Open: false · Opening rejected.')
  await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true)
  await wrapper.findAll('input[type="checkbox"]')[1]!.setValue(true)
  await button(wrapper, 'Request open').trigger('click')
  await flushPromises()
  expect(trigger.attributes('aria-label')).toBe('Close controlled creation')
  expect(document.activeElement).toBe(trigger.element)
  expect(trigger.attributes('title')).toBe('Create a preview item')
  await trigger.trigger('keydown', { key: 'Escape' })
  await flushPromises()
  expect(trigger.attributes('aria-expanded')).toBe('true')
  expect(wrapper.get('[role="status"]').text()).toContain('Closing rejected once. Try again.')
  await trigger.trigger('keydown', { key: 'Escape' })
  await flushPromises()
  expect(trigger.attributes('aria-expanded')).toBe('false')
  expect(wrapper.get('[role="status"]').text()).toContain('Last close: escape')
  expect(opened.size).toBe(0)
  await button(wrapper, 'Focus trigger').trigger('click')
  expect(document.activeElement).toBe(trigger.element)
})
