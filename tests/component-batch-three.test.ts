import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { expect, test } from 'vitest'
import CarouselControlledDemo from '../src/components/docs/demos/carousel/controlled.vue'
import CarouselItemsDemo from '../src/components/docs/demos/carousel/items.vue'
import CarouselContentDemo from '../src/components/docs/demos/carousel/content.vue'
import ChipSelectionDemo from '../src/components/docs/demos/chip/selection.vue'
import ChipRemovalDemo from '../src/components/docs/demos/chip/removal.vue'
import ChipFormDemo from '../src/components/docs/demos/chip/form.vue'
import CircularProgressBasicDemo from '../src/components/docs/demos/circularProgress/basic.vue'
import CircularProgressModeDemo from '../src/components/docs/demos/circularProgress/mode.vue'
import { setReducedMotion } from './setup.ts'

function button(wrapper: VueWrapper, text: string) {
  const target = wrapper.findAll('button').find(candidate => candidate.text() === text)
  if (!target) throw new Error(`Missing button: ${text}`)
  return target
}

test('controlled carousel demo rejects requests until unlocked and then accepts a focused jump', async () => {
  setReducedMotion(true)
  const wrapper = mount(CarouselControlledDemo, { attachTo: document.body })
  await button(wrapper, 'Next').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Current: first · Requested second: rejected.')
  expect(wrapper.get('.mdv-carousel').attributes('data-current-key')).toBe('first')
  await button(wrapper, 'Jump to chapter 4').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toContain('Jump rejected')

  await wrapper.findAll('input[type="checkbox"]')[0]!.setValue(false)
  await button(wrapper, 'Jump to chapter 4').trigger('click')
  await flushPromises()
  expect(wrapper.get('.mdv-carousel').attributes('data-current-key')).toBe('fourth')
  expect(wrapper.get('[role="status"]').text()).toContain('Jump accepted')
  expect(document.activeElement?.textContent).toBe('Chapter 4')
})

test('dynamic carousel demo preserves key identity after reordering and accepts empty/restored state', async () => {
  setReducedMotion(true)
  const wrapper = mount(CarouselItemsDemo, { attachTo: document.body })
  const design = button(wrapper, 'Design').element
  await button(wrapper, 'Move first to end').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Current: design · 4 collections')
  expect(button(wrapper, 'Design').element).toBe(design)
  await button(wrapper, 'Remove current').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Current: archive · 3 collections')
  expect(wrapper.findAll('.mdv-carousel__item')).toHaveLength(3)
  await button(wrapper, 'Clear').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Current: (none) · 0 collections')
  expect(wrapper.get('.mdv-carousel__empty p').text()).toBe('No collections left. Restore them to continue.')
  await button(wrapper, 'Restore').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Current: design · 4 collections')
})

test('custom notebook demo keeps edited values and native inputs while browsing with external controls', async () => {
  setReducedMotion(true)
  const wrapper = mount(CarouselContentDemo, { attachTo: document.body })
  const input = wrapper.get('input')
  await input.setValue('Bring a sketchbook')
  await button(wrapper, 'Next notebook').trigger('click')
  await flushPromises()
  expect(wrapper.get('.mdv-carousel__header').text()).toBe('Notebook 2 of 3')
  await button(wrapper, 'Previous notebook').trigger('click')
  await flushPromises()
  expect(wrapper.get('input').element).toBe(input.element)
  expect((wrapper.get('input').element as HTMLInputElement).value).toBe('Bring a sketchbook')
  await wrapper.findAll('button').find(candidate => candidate.text() === 'Save note')!.trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Saved Weekend plans: Bring a sketchbook')
})

test('chip selection demo separates arrow focus from single/multiple selection and allows clearing', async () => {
  const wrapper = mount(ChipSelectionDemo, { attachTo: document.body })
  const all = button(wrapper, 'All')
  all.element.focus()
  await all.trigger('keydown', { key: 'ArrowRight' })
  expect(document.activeElement).toBe(button(wrapper, 'Articles').element)
  expect(all.attributes('aria-pressed')).toBe('true')
  await button(wrapper, 'Articles').trigger('click')
  expect(all.attributes('aria-pressed')).toBe('false')
  await button(wrapper, 'Articles').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Single: null · Multiple: ["images"]')
  await button(wrapper, 'Videos').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Single: null · Multiple: ["images","videos"]')
  expect(button(wrapper, 'Unavailable').attributes('disabled')).toBeDefined()
})

test('removal demo keeps actions separate and restores neighbor then empty-group focus after deletion', async () => {
  const wrapper = mount(ChipRemovalDemo, { attachTo: document.body })
  await button(wrapper, 'Design').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Opened Design.')
  const designRemoval = wrapper.get('[aria-label="Remove Design"]')
  ;(designRemoval.element as HTMLButtonElement).focus()
  await designRemoval.trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Removed Design.')
  expect(document.activeElement).toBe(button(wrapper, 'Review').element)
  await button(wrapper, 'Review').trigger('keydown', { key: 'Delete' })
  await flushPromises()
  expect(document.activeElement).toBe(button(wrapper, 'Release').element)
  await button(wrapper, 'Release').trigger('keydown', { key: 'Backspace' })
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Removed Release.')
  expect(document.activeElement).toBe(wrapper.get('[role="toolbar"]').element)
  expect(wrapper.get('[role="toolbar"]').text()).toContain('All tags removed.')
  await button(wrapper, 'Restore tags').trigger('click')
  expect(wrapper.findAll('.mdv-chip')).toHaveLength(3)
})

test('remove-only demo uses one action per chip and still updates its source collection', async () => {
  const wrapper = mount(ChipRemovalDemo, { attachTo: document.body })
  await wrapper.get('input[type="checkbox"]').setValue(true)
  expect(wrapper.findAll('.mdv-chip button')).toHaveLength(3)
  await wrapper.get('[aria-label="Remove Review"]').trigger('click')
  expect(wrapper.get('[role="status"]').text()).toBe('Removed Review.')
  expect(wrapper.findAll('.mdv-chip button')).toHaveLength(2)
})

test('chip form demo explicitly serializes every chosen topic and resets its application model', async () => {
  const wrapper = mount(ChipFormDemo, { attachTo: document.body })
  await button(wrapper, 'Engineering').trigger('click')
  await button(wrapper, 'Submit').trigger('click')
  expect(JSON.parse(wrapper.get('[role="status"]').text())).toEqual({ topic: ['design', 'engineering'] })
  expect(new FormData(wrapper.get('form').element).getAll('topic')).toEqual(['design', 'engineering'])
  await button(wrapper, 'Reset').trigger('click')
  await flushPromises()
  expect(wrapper.get('[role="status"]').text()).toBe('Form reset by the application.')
  expect(new FormData(wrapper.get('form').element).getAll('topic')).toEqual(['design'])
  expect(button(wrapper, 'Engineering').attributes('aria-pressed')).toBe('false')
})

test('transfer demo reports actual units, completion, and reset independently of visual motion', async () => {
  setReducedMotion(true)
  const wrapper = mount(CircularProgressBasicDemo, { attachTo: document.body })
  const progress = wrapper.get('[role="progressbar"]')
  expect(progress.attributes('aria-label')).toBe('File transfer')
  expect(progress.attributes('aria-valuemax')).toBe('256')
  expect(progress.attributes('aria-valuenow')).toBe('128')
  for (let index = 0; index < 4; index++) await button(wrapper, 'Add 32 MB').trigger('click')
  expect(progress.attributes('aria-valuetext')).toBe('256 of 256 MB')
  expect(wrapper.get('[role="status"]').text()).toBe('256 / 256 MB · Complete')
  expect(button(wrapper, 'Add 32 MB').attributes('disabled')).toBeDefined()
  await button(wrapper, 'Reset').trigger('click')
  expect(progress.attributes('aria-valuenow')).toBe('0')
  expect(wrapper.get('[role="status"]').text()).toBe('0 / 256 MB')
})

test('progress-mode demo exposes values only when known and restores the unknown task on restart', async () => {
  setReducedMotion(true)
  const wrapper = mount(CircularProgressModeDemo, { attachTo: document.body })
  const progress = wrapper.get('[role="progressbar"]')
  expect(progress.attributes('aria-valuenow')).toBeUndefined()
  expect(button(wrapper, 'Advance 5%').attributes('disabled')).toBeDefined()
  await wrapper.get('input[type="checkbox"]').setValue(false)
  expect(progress.attributes('aria-valuenow')).toBe('25')
  await button(wrapper, 'Advance 5%').trigger('click')
  expect(progress.attributes('aria-valuenow')).toBe('30')
  await button(wrapper, 'Complete').trigger('click')
  expect(progress.attributes('aria-valuenow')).toBe('100')
  expect(wrapper.get('[role="status"]').text()).toBe('Processing complete.')
  await button(wrapper, 'Start over').trigger('click')
  expect(progress.attributes('aria-valuenow')).toBeUndefined()
  expect(wrapper.get('[role="status"]').text()).toBe('Waiting for a measurable result…')
})
