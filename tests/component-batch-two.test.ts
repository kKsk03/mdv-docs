import { flushPromises, mount } from '@vue/test-utils'
import { expect, test, vi } from 'vitest'
import ButtonGroupSingleDemo from '../src/components/docs/demos/buttonGroup/single.vue'
import ButtonGroupMultipleDemo from '../src/components/docs/demos/buttonGroup/multiple.vue'
import ButtonGroupIndependentDemo from '../src/components/docs/demos/buttonGroup/independent.vue'
import ButtonGroupFormDemo from '../src/components/docs/demos/buttonGroup/form.vue'
import ButtonGroupStatesDemo from '../src/components/docs/demos/buttonGroup/states.vue'
import CardContentDemo from '../src/components/docs/demos/card/content.vue'
import CardInteractiveDemo from '../src/components/docs/demos/card/interactive.vue'
import CardDraggedDemo from '../src/components/docs/demos/card/dragged.vue'

test('single-selection demo prevents clearing the last choice until the option is disabled', async () => {
  const wrapper = mount(ButtonGroupSingleDemo, { attachTo: document.body })
  const week = wrapper.findAll('button').find(button => button.text() === 'Week')!
  await week.trigger('click')
  expect(week.attributes('aria-pressed')).toBe('true')
  expect(wrapper.get('[role="status"]').text()).toBe('View: week')
  await wrapper.get('input[type="checkbox"]').setValue(false)
  await week.trigger('click')
  expect(week.attributes('aria-pressed')).toBe('false')
  expect(wrapper.get('[role="status"]').text()).toBe('View: (none)')
})

test('multiple-selection demo adds and removes accepted values and selected icons', async () => {
  const wrapper = mount(ButtonGroupMultipleDemo, { attachTo: document.body })
  const [photos, videos] = wrapper.findAll('button')
  await videos!.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Filters: ["photos","videos"]')
  expect(videos!.attributes('aria-pressed')).toBe('true')
  expect(videos!.find('svg').exists()).toBe(true)
  await photos!.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Filters: ["videos"]')
  expect(photos!.find('svg').exists()).toBe(false)
})

test('independent formatting toggles preserve each other and update the preview', async () => {
  const wrapper = mount(ButtonGroupIndependentDemo, { attachTo: document.body })
  await wrapper.get('[aria-label="Bold"]').trigger('click')
  await wrapper.get('[aria-label="Italic"]').trigger('click')
  await wrapper.get('[aria-label="Bold"]').trigger('click')
  expect(wrapper.get('[aria-label="Bold"]').attributes('aria-pressed')).toBe('false')
  expect(wrapper.get('[aria-label="Italic"]').attributes('aria-pressed')).toBe('true')
  expect(wrapper.get('p').classes()).toContain('italic')
  expect(wrapper.get('p').classes()).not.toContain('font-bold')
})

test('group form demo submits all selected values and resets to its initial selection', async () => {
  const wrapper = mount(ButtonGroupFormDemo, { attachTo: document.body })
  const sms = wrapper.findAll('button').find(button => button.text() === 'SMS')!
  await sms.trigger('click')
  await wrapper.get('button[type="submit"]').trigger('click')
  expect(JSON.parse(wrapper.get('[role="status"]').text())).toEqual({ channel: ['email', 'sms'] })
  expect(new FormData(wrapper.get('form').element).getAll('channel')).toEqual(['email', 'sms'])
  await wrapper.get('button[type="reset"]').trigger('click')
  await flushPromises()
  expect(new FormData(wrapper.get('form').element).getAll('channel')).toEqual(['email'])
  expect(sms.attributes('aria-pressed')).toBe('false')
  expect(wrapper.get('[role="status"]').text()).toBe('Form reset.')
})

test('publishing demo disables the loading action while keeping preview available', async () => {
  const wrapper = mount(ButtonGroupStatesDemo, { attachTo: document.body })
  await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(true)
  const publish = wrapper.findAll('button').find(button => button.text().includes('Publishing'))!
  expect(publish.attributes('disabled')).toBeDefined()
  const preview = wrapper.findAll('button').find(button => button.text() === 'Preview')!
  expect(preview.attributes('disabled')).toBeUndefined()
  await preview.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Preview opened.')
  await wrapper.findAll('input[type="checkbox"]')[1]!.setValue(true)
  expect(preview.attributes('disabled')).toBeDefined()
})

test('static card actions update content independently without creating a whole-card action', async () => {
  const warn = vi.spyOn(console, 'warn')
  const wrapper = mount(CardContentDemo, { attachTo: document.body })
  expect(wrapper.find('.mdv-card__primary').exists()).toBe(false)
  await wrapper.findAll('button')[0]!.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toContain('4 km')
  await wrapper.findAll('button')[1]!.trigger('click')
  expect(wrapper.findAll('button')[1]!.text()).toBe('Saved')
  expect(warn).not.toHaveBeenCalled()
})

test('action card demo keeps button and link semantics and disables both without firing actions', async () => {
  const warn = vi.spyOn(console, 'warn')
  const wrapper = mount(CardInteractiveDemo, { attachTo: document.body })
  const button = wrapper.get('button.mdv-card__primary')
  const link = wrapper.get('a.mdv-card__primary')
  expect(button.attributes('type')).toBe('button')
  expect(link.attributes('href')).toBe('https://m3.material.io/components/cards/overview')
  await button.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Collection opened 1 times.')
  await wrapper.get('input[type="checkbox"]').setValue(true)
  expect(button.attributes('disabled')).toBeDefined()
  expect(link.attributes('href')).toBeUndefined()
  expect(link.attributes('aria-disabled')).toBe('true')
  await button.trigger('click')
  await link.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Collection opened 1 times.')
  expect(warn).not.toHaveBeenCalled()
})

test('static card disabled state does not disable its independent action', async () => {
  const wrapper = mount(CardDraggedDemo, { attachTo: document.body })
  await wrapper.findAll('input[type="checkbox"]')[1]!.setValue(true)
  const action = wrapper.get('button')
  expect(action.attributes('disabled')).toBeUndefined()
  await action.trigger('click')
  expect(action.text()).toBe('Independent action (1)')
})
