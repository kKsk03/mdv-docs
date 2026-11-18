import { flushPromises, mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import AppBarScrollDemo from '../src/components/docs/demos/appBar/scroll.vue'
import AutocompleteBasicDemo from '../src/components/docs/demos/autocomplete/basic.vue'
import AutocompleteRemoteDemo from '../src/components/docs/demos/autocomplete/remote.vue'
import AutocompleteFormDemo from '../src/components/docs/demos/autocomplete/form.vue'
import BadgeCountDemo from '../src/components/docs/demos/badge/count.vue'
import BadgeVisibilityDemo from '../src/components/docs/demos/badge/visibility.vue'
import { setReducedMotion } from './setup'

test('autocomplete demo filters suggestions, submits option values, and retains free text', async () => {
  const wrapper = mount(AutocompleteBasicDemo, { attachTo: document.body })
  const input = wrapper.get<HTMLInputElement>('[role="combobox"]')
  await input.setValue('pa')
  await flushPromises()
  expect(wrapper.findAll('[role="option"]').map(option => option.text())).toEqual(['ParisFrance'])
  expect(wrapper.get('[role="status"]').text()).toBe('Model: "pa"')
  await wrapper.get('[role="option"]').trigger('click')
  await flushPromises()
  expect(input.element.value).toBe('Paris')
  expect(wrapper.get('[role="status"]').text()).toBe('Model: "paris"')
  await input.setValue('My own city')
  await flushPromises()
  expect(wrapper.findAll('[role="option"]')).toHaveLength(0)
  expect(wrapper.text()).toContain('No cities found.')
  expect(wrapper.text()).toContain('Model: "My own city"')
})

test('external-search demo cancels stale responses and clears its pending response on unmount', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  const wrapper = mount(AutocompleteRemoteDemo, { attachTo: document.body })
  const input = wrapper.get('[role="combobox"]')
  await input.setValue('lo')
  await flushPromises()
  expect(wrapper.get('[role="listbox"]').attributes('aria-busy')).toBe('true')
  await vi.advanceTimersByTimeAsync(300)
  await input.setValue('tok')
  await vi.advanceTimersByTimeAsync(50)
  expect(wrapper.get('[role="listbox"]').attributes('aria-busy')).toBe('true')
  expect(wrapper.findAll('[role="option"]')).toHaveLength(0)
  await vi.advanceTimersByTimeAsync(300)
  await flushPromises()
  expect(wrapper.get('[role="option"]').text()).toBe('Tokyo')
  expect(wrapper.get('[role="listbox"]').attributes('aria-busy')).toBeUndefined()
  await input.setValue('par')
  wrapper.unmount()
  expect(vi.getTimerCount()).toBe(0)
})

test('autocomplete form demo validates empty input, submits one model field, and resets', async () => {
  const wrapper = mount(AutocompleteFormDemo, { attachTo: document.body })
  const input = wrapper.get<HTMLInputElement>('[role="combobox"]')
  const status = wrapper.get('p[role="status"]')
  await wrapper.get('button[type="submit"]').trigger('click')
  await flushPromises()
  expect(input.attributes('aria-invalid')).toBe('true')
  expect(status.text()).toBe('Submit a suggestion or your own city.')
  await input.setValue('My own city')
  await wrapper.get('button[type="submit"]').trigger('click')
  expect(JSON.parse(status.text())).toEqual({ destination: 'My own city' })
  expect(new FormData(wrapper.get('form').element).getAll('destination')).toEqual(['My own city'])
  await wrapper.get('button[type="reset"]').trigger('click')
  await flushPromises()
  expect(input.element.value).toBe('')
  expect(input.attributes('aria-invalid')).toBeUndefined()
  expect(new FormData(wrapper.get('form').element).has('destination')).toBe(false)
  expect(status.text()).toBe('Form reset.')
})

test('badge count demo formats large counts, clears mail, and restores the indicator for new messages', async () => {
  const wrapper = mount(BadgeCountDemo)
  const [mail, add, addMany] = wrapper.findAll('button')
  await addMany!.trigger('click')
  expect(wrapper.get('.mdv-badge__indicator').text()).toBe('99+')
  expect(mail!.attributes('aria-label')).toBe('Read mail, 103 unread messages')
  await mail!.trigger('click')
  expect(wrapper.find('.mdv-badge__indicator').exists()).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Unread: 0')
  await add!.trigger('click')
  expect(wrapper.get('.mdv-badge__indicator').text()).toBe('1')
})

test('badge visibility demo preserves its wrapped action and click state while hiding status', async () => {
  const wrapper = mount(BadgeVisibilityDemo, { attachTo: document.body })
  const action = wrapper.get('button')
  await action.trigger('click')
  await wrapper.get('input[type="checkbox"]').setValue(false)
  expect(wrapper.find('.mdv-badge__indicator').exists()).toBe(false)
  expect(wrapper.get('button').element).toBe(action.element)
  await action.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Opened 2 times.')
})

test('App Bar demo scrolls its own Scaffold and respects reduced motion', async () => {
  setReducedMotion(true)
  const wrapper = mount(AppBarScrollDemo, { attachTo: document.body })
  const content = wrapper.get<HTMLElement>('[aria-label="App Bar demo content"]').element
  const scrollTo = vi.fn()
  Object.defineProperty(content, 'scrollTo', { value: scrollTo })
  await wrapper.get('button').trigger('click')
  expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' })
})
