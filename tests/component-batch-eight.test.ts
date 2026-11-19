import { flushPromises, mount } from '@vue/test-utils'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { afterEach, expect, test, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import MenuSelectionDemo from '../src/components/docs/demos/menu/selection.vue'
import MenuActionsDemo from '../src/components/docs/demos/menu/actions.vue'
import MenuControlledDemo from '../src/components/docs/demos/menu/controlled.vue'
import MenuContextDemo from '../src/components/docs/demos/menu/context.vue'
import MenuNestedDemo from '../src/components/docs/demos/menu/nested.vue'
import NavigationLinksDemo from '../src/components/docs/demos/navigationBar/links.vue'
import DrawerBasicDemo from '../src/components/docs/demos/navigationDrawer/basic.vue'
import DrawerGroupsDemo from '../src/components/docs/demos/navigationDrawer/groups.vue'
import DrawerModalDemo from '../src/components/docs/demos/navigationDrawer/modal.vue'
import DrawerPolicyDemo from '../src/components/docs/demos/navigationDrawer/policy.vue'
import DrawerGuardDemo from '../src/components/docs/demos/navigationDrawer/guard.vue'
import DrawerResponsiveDemo from '../src/components/docs/demos/navigationDrawer/responsive.vue'
import { setReducedMotion } from './setup.ts'

let host: VueWrapper | undefined
const restoreNative: (() => void)[] = []

afterEach(() => {
  host?.unmount()
  host = undefined
  for (const restore of restoreNative.splice(0)) restore()
})

function button(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, text: string) {
  const target = wrapper.findAll('button').find(candidate => candidate.text() === text)
  if (!target) throw new Error(`Missing button: ${text}`)
  return target
}

function menuItem(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, text: string) {
  const target = wrapper.findAll('[data-mdv-menu-item]').find(candidate => candidate.text() === text)
  if (!target) throw new Error(`Missing menu item: ${text}`)
  return target
}

function drawerRow(wrapper: Pick<DOMWrapper<Element>, 'findAll'>, text: string) {
  const target = wrapper.findAll('[data-mdv-drawer-control]')
    .find(candidate => candidate.find('.mdv-navigation-drawer__label').text() === text)
  if (!target) throw new Error(`Missing drawer row: ${text}`)
  return target
}

// Keep real MDV state, events, focus, and positioning; jsdom lacks these native APIs.
function mockPopover() {
  setReducedMotion(true)
  const opened = new Set<HTMLElement>()
  const prototype = HTMLElement.prototype
  const previous = ['showPopover', 'hidePopover'].map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)] as const)
  Object.defineProperties(prototype, {
    showPopover: { configurable: true, value(this: HTMLElement) { opened.add(this); this.style.display = 'block' } },
    hidePopover: { configurable: true, value(this: HTMLElement) { opened.delete(this); this.style.removeProperty('display') } },
  })
  const matches = Element.prototype.matches
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
    return selector === ':popover-open' ? opened.has(this as HTMLElement) : matches.call(this, selector)
  })
  restoreNative.push(() => {
    for (const [name, descriptor] of previous) {
      if (descriptor) Object.defineProperty(prototype, name, descriptor)
      else Reflect.deleteProperty(prototype, name)
    }
  })
  return opened
}

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

test('menu groups keep numeric and string choices distinct and resolve default dismissal separately', async () => {
  const opened = mockPopover()
  const wrapper = host = mount(MenuSelectionDemo, { attachTo: document.body })
  const trigger = button(wrapper, 'Text preferences')
  await trigger.trigger('click')
  await flushPromises()
  expect(menuItem(wrapper, 'Numeric value 1').attributes('aria-checked')).toBe('true')
  await menuItem(wrapper, 'Text value 1').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Scale: string "1"')
  expect(menuItem(wrapper, 'Numeric value 1').attributes('aria-checked')).toBe('false')
  expect(opened.size).toBe(0)
  await trigger.trigger('click')
  await flushPromises()
  await menuItem(wrapper, 'Bold').trigger('click')
  await menuItem(wrapper, 'Italic').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Styles: ["italic"]')
  expect(opened.size).toBe(1)
  const disabled = menuItem(wrapper, 'Underline')
  ;(menuItem(wrapper, 'Italic').element as HTMLElement).focus()
  await menuItem(wrapper, 'Italic').trigger('keydown', { key: 'ArrowDown' })
  expect(document.activeElement).toBe(disabled.element)
  await disabled.trigger('click')
  expect(disabled.attributes('aria-checked')).toBe('false')
  expect(wrapper.get('[role="status"]').text()).toContain('Styles: ["italic"]')
})

test('menu actions preserve keep-open and cancel selection without allowing disabled links', async () => {
  const opened = mockPopover()
  const wrapper = host = mount(MenuActionsDemo, { attachTo: document.body })
  await button(wrapper, 'Document actions').trigger('click')
  await flushPromises()
  await menuItem(wrapper, 'Increment preview counter').trigger('click')
  await menuItem(wrapper, 'Cancel this action').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Counter: 1 · The action was cancelled; the menu stays open.')
  expect(opened.size).toBe(1)
  const disabled = menuItem(wrapper, 'Unavailable guide')
  expect(disabled.element.tagName).toBe('A')
  expect(disabled.attributes('href')).toBeUndefined()
  expect(disabled.attributes('aria-disabled')).toBe('true')
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  disabled.element.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(opened.size).toBe(1)
  await menuItem(wrapper, 'Finish').trigger('click')
  await flushPromises()
  expect(opened.size).toBe(0)
  expect(wrapper.get('[role="status"]').text()).toBe('Counter: 1 · Finished.')
})

test('controlled menu separates rejected opening, choice updates, and closing requests', async () => {
  const opened = mockPopover()
  const wrapper = host = mount(MenuControlledDemo, { attachTo: document.body })
  const controls = wrapper.findAll('input[type="checkbox"]')
  await controls[0]!.setValue(false)
  await button(wrapper, 'Controlled menu').trigger('click')
  await flushPromises()
  expect(opened.size).toBe(0)
  expect(wrapper.get('[role="status"]').text()).toContain('Open true: rejected.')
  await controls[0]!.setValue(true)
  await button(wrapper, 'Open at last item').trigger('click')
  await flushPromises()
  expect(opened.size).toBe(1)
  await menuItem(wrapper, 'Review').trigger('click')
  await flushPromises()
  expect(menuItem(wrapper, 'Draft').attributes('aria-checked')).toBe('true')
  expect(wrapper.get('[role="status"]').text()).toContain('Choice review: rejected.')
  await controls[2]!.setValue(true)
  await menuItem(wrapper, 'Review').trigger('click')
  await flushPromises()
  expect(menuItem(wrapper, 'Review').attributes('aria-checked')).toBe('true')
  expect(opened.size).toBe(1)
  await controls[1]!.setValue(false)
  await menuItem(wrapper, 'Close controlled menu').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Open false: rejected.')
  expect(opened.size).toBe(1)
  await controls[1]!.setValue(true)
  await menuItem(wrapper, 'Close controlled menu').trigger('click')
  await flushPromises()
  expect(opened.size).toBe(0)
  expect(wrapper.text()).toContain('closed: select')
})

test('context menu keeps ordinary click inert and offers matching keyboard and visible-menu actions', async () => {
  const opened = mockPopover()
  const wrapper = host = mount(MenuContextDemo, { attachTo: document.body })
  const context = wrapper.get('div[aria-haspopup="menu"]')
  ;(context.element as HTMLElement).focus()
  await context.trigger('click')
  expect(opened.size).toBe(0)
  await context.trigger('keydown', { key: 'F10', shiftKey: true })
  await flushPromises()
  expect(opened.size).toBe(1)
  await menuItem(wrapper.get(`#${context.attributes('aria-controls')}`), 'Archive document').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Document archived locally.')
  expect(opened.size).toBe(0)
  const fallback = button(wrapper, 'Document options')
  await fallback.trigger('click')
  await flushPromises()
  await menuItem(wrapper.get(`#${fallback.attributes('aria-controls')}`), 'Inspect document').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Document details requested.')
})

test('push menu traverses three levels with independent child selection and return navigation', async () => {
  const opened = mockPopover()
  const wrapper = host = mount(MenuNestedDemo, { attachTo: document.body })
  await wrapper.get('[role="combobox"]').trigger('click')
  await flushPromises()
  await wrapper.findAll('[role="option"]').find(option => option.text() === 'push')!.trigger('click')
  await flushPromises()
  await button(wrapper, 'Formatting').trigger('click')
  await flushPromises()
  await menuItem(wrapper, 'Text').trigger('click')
  await flushPromises()
  await menuItem(wrapper, 'Font').trigger('click')
  await flushPromises()
  expect(opened.size).toBe(3)
  expect(menuItem(wrapper, 'Roboto').attributes('aria-checked')).toBe('true')
  const back = wrapper.findAll('.mdv-menu__back').find(control => control.text() === 'Font')!
  await back.trigger('click')
  await flushPromises()
  expect(opened.size).toBe(2)
  await menuItem(wrapper, 'Font').trigger('click')
  await flushPromises()
  await menuItem(wrapper, 'System default').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Font: system')
  expect(opened.size).toBe(0)
})

test('navigation links follow locale and accepted router state while disabled links cannot navigate', async () => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: ['en-US', 'zh-CN'].flatMap(locale => ['getting-started/introduction', 'getting-started/setup', 'components/navigation-bar'].map(slug => ({
      path: `/${locale}/${slug}`, component: { template: '<div />' }, meta: { locale },
    }))),
  })
  let accept = false
  router.beforeEach(to => to.path.endsWith('/setup') ? accept : true)
  await router.push('/zh-CN/components/navigation-bar')
  const wrapper = host = mount(NavigationLinksDemo, { attachTo: document.body, global: { plugins: [router] } })
  const links = wrapper.findAll('a')
  const setup = links[1]!
  expect(links[2]!.attributes('aria-current')).toBe('page')
  expect(setup.attributes('href')).toBe('/zh-CN/getting-started/setup')
  await setup.trigger('click')
  await flushPromises()
  expect(links[2]!.attributes('aria-current')).toBe('page')
  await wrapper.get('input[type="checkbox"]').setValue(true)
  expect(setup.attributes('href')).toBeUndefined()
  expect(setup.attributes('tabindex')).toBe('-1')
  accept = true
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  setup.element.dispatchEvent(event)
  await flushPromises()
  expect(event.defaultPrevented).toBe(true)
  expect(router.currentRoute.value.path).toBe('/zh-CN/components/navigation-bar')
  await wrapper.get('input[type="checkbox"]').setValue(false)
  await setup.trigger('click')
  await flushPromises()
  expect(setup.attributes('aria-current')).toBe('page')
  expect(links[2]!.attributes('aria-current')).toBeUndefined()
  await router.replace('/en-US/components/navigation-bar')
  await flushPromises()
  expect(setup.attributes('href')).toBe('/en-US/getting-started/setup')
  expect(links[0]!.attributes('href')).toBe('/en-US/getting-started/introduction')
})

test('standard drawer preserves selection while reserving its close action for the bound open model', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(DrawerBasicDemo, { attachTo: document.body })
  await drawerRow(wrapper, 'Saved').trigger('click')
  await flushPromises()
  expect(drawerRow(wrapper, 'Saved').attributes('aria-current')).toBe('page')
  expect(wrapper.get('[role="status"]').text()).toBe('Current destination: Saved · Open: true')
  await button(wrapper, 'Close standard drawer').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Current destination: Saved · Open: false')
  await button(wrapper, 'Toggle standard drawer').trigger('click')
  await flushPromises()
  expect(drawerRow(wrapper, 'Saved').attributes('aria-current')).toBe('page')
  expect(button(wrapper, 'Toggle standard drawer').attributes('aria-expanded')).toBe('true')
})

test('drawer groups separate static headings, controlled expansion, keyboard focus, and child disable state', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(DrawerGroupsDemo, { attachTo: document.body })
  expect(wrapper.findAll('.mdv-navigation-drawer-group__heading').map(heading => heading.text())).toEqual(['Mail'])
  expect(drawerRow(wrapper, 'Inbox').get('.mdv-navigation-drawer__badge').text()).toBe('0')
  await button(wrapper, 'Focus current destination').trigger('click')
  const design = drawerRow(wrapper, 'Design')
  expect(document.activeElement).toBe(design.element)
  await wrapper.get('input[type="checkbox"]').setValue(false)
  const projects = drawerRow(wrapper, 'Projects')
  await projects.trigger('click')
  await flushPromises()
  expect(projects.attributes('aria-expanded')).toBe('true')
  expect(wrapper.get('[role="status"]').text()).toContain('Expanded false: rejected.')
  await wrapper.get('input[type="checkbox"]').setValue(true)
  ;(design.element as HTMLElement).focus()
  await projects.trigger('click')
  await flushPromises()
  expect(projects.attributes('aria-expanded')).toBe('false')
  expect(document.activeElement).toBe(projects.element)
  expect(wrapper.get(`#${projects.attributes('aria-controls')}`).attributes('inert')).toBeDefined()
  await projects.trigger('keydown', { key: 'End' })
  const audit = drawerRow(wrapper, 'Read-only audit log')
  expect(document.activeElement).toBe(audit.element)
  expect(drawerRow(wrapper, 'Administration').attributes('disabled')).toBeDefined()
  await audit.trigger('click')
  expect(audit.attributes('aria-current')).toBe('page')
})

test('modal drawer ignores cancelled and disabled destinations and reports accepted selection dismissal', async () => {
  mockDialog()
  const wrapper = host = mount(DrawerModalDemo, { attachTo: document.body })
  const trigger = button(wrapper, 'Open modal drawer')
  ;(trigger.element as HTMLElement).focus()
  await trigger.trigger('click')
  await flushPromises()
  expect(wrapper.get<HTMLDialogElement>('dialog').element.open).toBe(true)
  const cancelled = drawerRow(wrapper, 'Cancelled navigation')
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  cancelled.element.dispatchEvent(event)
  await flushPromises()
  expect(event.defaultPrevented).toBe(true)
  expect(wrapper.get<HTMLDialogElement>('dialog').element.open).toBe(true)
  await drawerRow(wrapper, 'Unavailable folder').trigger('click')
  await drawerRow(wrapper, 'Saved').trigger('click')
  await flushPromises()
  expect(wrapper.get<HTMLDialogElement>('dialog').element.open).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Current: Saved · Last close: select')
  expect(document.activeElement).toBe(trigger.element)
})

test('drawer policy distinguishes guarded denial, parent rejection, and direct model closing', async () => {
  mockDialog()
  const wrapper = host = mount(DrawerPolicyDemo, { attachTo: document.body })
  const controls = wrapper.findAll('input[type="checkbox"]')
  await controls[5]!.setValue(true)
  await button(wrapper, 'Open policy drawer').trigger('click')
  await flushPromises()
  await button(wrapper, 'Request guarded close').trigger('click')
  await flushPromises()
  expect(wrapper.get<HTMLDialogElement>('dialog').element.open).toBe(true)
  expect(wrapper.text()).toContain('Close accepted: false.')
  await controls[5]!.setValue(false)
  await controls[6]!.setValue(false)
  await button(wrapper, 'Request guarded close').trigger('click')
  await flushPromises()
  expect(wrapper.get<HTMLDialogElement>('dialog').element.open).toBe(true)
  expect(wrapper.text()).toContain('Close accepted: false.')
  await controls[5]!.setValue(true)
  await button(wrapper, 'Close by model').trigger('click')
  await flushPromises()
  expect(wrapper.get<HTMLDialogElement>('dialog').element.open).toBe(false)
})

test('drawer policy retains internal input state by default and resets it only when content is destroyed', async () => {
  mockDialog()
  const wrapper = host = mount(DrawerPolicyDemo, { attachTo: document.body })
  for (const destroy of [false, true]) {
    await wrapper.findAll('input[type="checkbox"]')[4]!.setValue(destroy)
    await button(wrapper, 'Open policy drawer').trigger('click')
    await flushPromises()
    await wrapper.get('dialog input').setValue('Local note')
    await button(wrapper, 'Request guarded close').trigger('click')
    await flushPromises()
    expect(wrapper.text()).toContain('Close accepted: true.')
    expect(wrapper.find('dialog input').exists()).toBe(!destroy)
    await button(wrapper, 'Open policy drawer').trigger('click')
    await flushPromises()
    expect(wrapper.get<HTMLInputElement>('dialog input').element.value).toBe(destroy ? '' : 'Local note')
    await button(wrapper, 'Close by model').trigger('click')
    await flushPromises()
  }
})

test('unsaved drawer confirmation rejects Keep editing and accepts Discard without losing the note early', async () => {
  mockDialog()
  const wrapper = host = mount(DrawerGuardDemo, { attachTo: document.body })
  await button(wrapper, 'Open guarded drawer').trigger('click')
  await flushPromises()
  const note = wrapper.get<HTMLInputElement>('input')
  await note.setValue('Unpublished draft')
  await button(wrapper, 'Leave draft workspace').trigger('click')
  await flushPromises()
  expect(wrapper.findAll<HTMLDialogElement>('dialog').filter(dialog => dialog.element.open)).toHaveLength(2)
  await button(wrapper, 'Keep editing').trigger('click')
  await flushPromises()
  expect(note.element.value).toBe('Unpublished draft')
  expect(wrapper.findAll<HTMLDialogElement>('dialog').filter(dialog => dialog.element.open)).toHaveLength(1)
  await button(wrapper, 'Leave draft workspace').trigger('click')
  await flushPromises()
  await button(wrapper, 'Discard and close').trigger('click')
  await flushPromises()
  expect(note.element.value).toBe('')
  expect(wrapper.findAll<HTMLDialogElement>('dialog').some(dialog => dialog.element.open)).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('The note was discarded.')
})

test('responsive drawer carries destination state across modes and disposes an open modal and observer', async () => {
  mockDialog()
  const observers: { targets: Set<Element>; notify: () => void; disconnect: ReturnType<typeof vi.fn> }[] = []
  vi.stubGlobal('ResizeObserver', class {
    targets = new Set<Element>()
    notify: () => void
    disconnect = vi.fn(() => this.targets.clear())
    constructor(callback: () => void) { this.notify = callback; observers.push(this) }
    observe(target: Element) { this.targets.add(target) }
    unobserve(target: Element) { this.targets.delete(target) }
  })
  const wrapper = host = mount(DrawerResponsiveDemo, { attachTo: document.body })
  await wrapper.get('button[aria-label="Open workspace navigation"]').trigger('click')
  await flushPromises()
  await drawerRow(wrapper, 'Saved').trigger('click')
  await flushPromises()
  await wrapper.get('button[aria-label="Open workspace navigation"]').trigger('click')
  await flushPromises()
  const workspace = wrapper.get('[aria-label="Responsive drawer workspace"] > div').element
  const observer = observers.find(candidate => candidate.targets.has(workspace))!
  Object.defineProperty(workspace, 'clientWidth', { configurable: true, value: 720 })
  observer.notify()
  await flushPromises()
  expect(wrapper.find('dialog').exists()).toBe(false)
  expect(wrapper.find('button[aria-label="Open workspace navigation"]').exists()).toBe(false)
  expect(drawerRow(wrapper, 'Saved').attributes('aria-current')).toBe('page')
  expect(wrapper.get('[role="status"]').text()).toBe('Current destination: Saved')
  wrapper.unmount()
  host = undefined
  expect(observer.disconnect).toHaveBeenCalledOnce()
  expect(document.querySelector('dialog[open]')).toBeNull()
})
