import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { flushPromises, mount } from '@vue/test-utils'
import type { DOMWrapper, VueWrapper } from '@vue/test-utils'
import { afterEach, expect, test, vi } from 'vitest'
import SliderVariantsDemo from '../src/components/docs/demos/slider/variants.vue'
import SliderSizesDemo from '../src/components/docs/demos/slider/sizes.vue'
import SliderFormDemo from '../src/components/docs/demos/slider/form.vue'
import SnackbarDirectDemo from '../src/components/docs/demos/snackbar/direct.vue'
import SnackbarActionDemo from '../src/components/docs/demos/snackbar/action.vue'
import SnackbarProviderDemo from '../src/components/docs/demos/snackbar/provider.vue'
import SplitButtonMenuDemo from '../src/components/docs/demos/splitButton/menu.vue'
import SplitButtonVariantsDemo from '../src/components/docs/demos/splitButton/variants.vue'
import SplitButtonStateDemo from '../src/components/docs/demos/splitButton/state.vue'
import { documentationPages } from '../src/content/registry.ts'
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

function mockPopover() {
  const opened = new Set<HTMLElement>()
  const prototype = HTMLElement.prototype
  const previous = ['showPopover', 'hidePopover'].map(name => [name, Object.getOwnPropertyDescriptor(prototype, name)] as const)
  Object.defineProperties(prototype, {
    showPopover: { configurable: true, value(this: HTMLElement) { opened.add(this) } },
    hidePopover: { configurable: true, value(this: HTMLElement) { opened.delete(this) } },
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
}

test('slider variants keep numeric models, range ordering, and keyboard events', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(SliderVariantsDemo, { attachTo: document.body })
  const inputs = wrapper.findAll<HTMLInputElement>('input[type="range"]')
  expect(inputs).toHaveLength(4)
  expect(inputs[0]!.element.value).toBe('42')
  await inputs[0]!.trigger('keydown', { key: 'ArrowRight' })
  await flushPromises()
  expect(inputs[0]!.element.value).toBe('43')
  expect(wrapper.get('[role="status"]').text()).toContain('Volume: 43%')
  await inputs[2]!.trigger('keydown', { key: 'ArrowRight' })
  await flushPromises()
  expect(inputs[2]!.element.value).toBe('25')
  expect(wrapper.get('[role="status"]').text()).toContain('Price: [25,80]')
})

test('slider sizes expose disabled state without changing the native model', async () => {
  const wrapper = host = mount(SliderSizesDemo, { attachTo: document.body })
  expect(wrapper.findAll('.mdv-slider')).toHaveLength(6)
  const checkbox = wrapper.get<HTMLInputElement>('input[type="checkbox"]')
  const disabledInput = wrapper.findAll<HTMLInputElement>('input[type="range"]').at(-1)!
  expect(disabledInput.element.disabled).toBe(true)
  await checkbox.setValue(false)
  expect(disabledInput.element.disabled).toBe(false)
})

test('slider form submits both range values and restores its initial snapshot', async () => {
  const wrapper = host = mount(SliderFormDemo, { attachTo: document.body })
  const inputs = wrapper.findAll<HTMLInputElement>('input[type="range"]')
  await inputs[0]!.trigger('keydown', { key: 'ArrowRight' })
  await inputs[1]!.trigger('keydown', { key: 'ArrowRight' })
  await wrapper.get('form').trigger('submit')
  expect(wrapper.get('[role="status"]').text()).toContain('[["volume","31"],["price","25"],["price","80"]]')
  await button(wrapper, 'Reset to initial values').trigger('click')
  await flushPromises()
  expect(inputs.map(input => input.element.value)).toEqual(['30', '20', '80'])
})

test('declarative snackbar opens, invokes its action, and reports close reasons', async () => {
  setReducedMotion(true)
  const wrapper = host = mount(SnackbarDirectDemo, { attachTo: document.body })
  await button(wrapper, 'Show message').trigger('click')
  await flushPromises()
  expect(wrapper.get('.mdv-snackbar__message').text()).toBe('Draft deleted.')
  await button(wrapper, 'Undo').trigger('click')
  await flushPromises()
  expect(wrapper.find('.mdv-snackbar').exists()).toBe(false)
})

test('snackbar provider manages current and queued messages', async () => {
  mockPopover()
  setReducedMotion(true)
  const wrapper = host = mount(SnackbarProviderDemo, { attachTo: document.body, global: { stubs: { transition: false } } })
  await button(wrapper, 'Show first').trigger('click')
  await flushPromises()
  expect(wrapper.get('.mdv-snackbar__message').text()).toBe('Draft saved.')
  await button(wrapper, 'Queue second').trigger('click')
  await button(wrapper, 'Update first').trigger('click')
  await flushPromises()
  expect(wrapper.get('.mdv-snackbar__message').text()).toBe('Draft saved. Ready to review.')
  await button(wrapper, 'Close first').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Close accepted: true')
  await button(wrapper, 'Clear queue').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Provider queue cleared.')
})

test('async snackbar actions disable while pending and report rejected work', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  setReducedMotion(true)
  const wrapper = host = mount(SnackbarActionDemo, { attachTo: document.body, global: { stubs: { transition: false } } })
  await button(wrapper, 'Show async action').trigger('click')
  await flushPromises()
  await button(wrapper, 'Next action: succeed').trigger('click')
  const action = wrapper.get('.mdv-snackbar__action-button')
  await action.trigger('click')
  expect(action.attributes('disabled')).toBeDefined()
  await vi.advanceTimersByTimeAsync(300)
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('The simulated request failed.')
  expect(wrapper.find('.mdv-snackbar').exists()).toBe(true)
})

test('split button keeps primary and menu actions independently focusable', async () => {
  const wrapper = host = mount(SplitButtonVariantsDemo, { attachTo: document.body })
  const groups = wrapper.findAll('.mdv-split-button')
  expect(groups).toHaveLength(11)
  const independent = groups.at(-2)!
  expect(independent.findAll('button')[0]!.attributes('disabled')).toBeDefined()
  expect(independent.findAll('button')[1]!.attributes('disabled')).toBeUndefined()
  await wrapper.get('input[type="checkbox"]').setValue(false)
  expect(independent.findAll('button')[0]!.attributes('disabled')).toBeUndefined()
  expect(groups.at(-1)!.find('button').attributes('aria-busy')).toBe('true')
})

test('split button menu binds accepted open state and selects related actions', async () => {
  mockPopover()
  setReducedMotion(true)
  const wrapper = host = mount(SplitButtonMenuDemo, { attachTo: document.body })
  const group = wrapper.get('.mdv-split-button')
  await group.findAll('button')[1]!.trigger('click')
  await flushPromises()
  expect(group.classes()).toContain('mdv-split-button--expanded')
  const item = wrapper.findAll('[data-mdv-menu-item]').find(candidate => candidate.text() === 'Save a copy')
  if (!item) throw new Error('Missing menu item: Save a copy')
  await item.trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('A copy was saved.')
})

test('split button exposed focus methods target the corresponding native controls', async () => {
  const wrapper = host = mount(SplitButtonStateDemo, { attachTo: document.body })
  await button(wrapper, 'Focus main action').trigger('click')
  expect(document.activeElement).toBe(wrapper.get('.mdv-split-button').findAll('button')[0]!.element)
  await button(wrapper, 'Focus menu action').trigger('click')
  expect(document.activeElement).toBe(wrapper.get('.mdv-split-button').findAll('button')[1]!.element)
})
test('batch articles register localized routes and keep displayed demo source synchronized', async () => {
  const pages = [
    { id: 'slider', slug: 'components/slider', demos: ['slider/variants.vue', 'slider/sizes.vue', 'slider/form.vue'] },
    { id: 'snackbar', slug: 'components/snackbar', demos: ['snackbar/direct.vue', 'snackbar/action.vue', 'snackbar/provider.vue'] },
    { id: 'split-button', slug: 'components/split-button', demos: ['splitButton/menu.vue', 'splitButton/variants.vue', 'splitButton/state.vue'] },
  ]
  const names: string[] = []
  for (const page of pages) {
    const route = documentationPages.find(item => item.id === page.id)
    expect(route?.slug).toBe(page.slug)
    names.push(route!.navigationLabel!['en-US'])
    for (const locale of ['en-US', 'zh-CN'] as const) {
      const article = await readFile(resolve(process.cwd(), 'src/content', locale, 'components', page.id + '.md'), 'utf8')
      const sources = [...article.matchAll(/```vue:line-numbers\n([\s\S]*?)\n```/g)].map(match => match[1])
      for (const demo of page.demos) {
        const source = (await readFile(resolve(process.cwd(), 'src/components/docs/demos', demo), 'utf8')).trimEnd()
        expect(sources).toContain(source)
      }
    }
  }
  expect(names).toEqual(['Slider', 'Snackbar', 'SplitButton'])
})