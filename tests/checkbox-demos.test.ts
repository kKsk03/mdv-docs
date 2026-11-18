import { flushPromises, mount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import CheckboxSelectAllDemo from '../src/components/docs/demos/checkbox/selectAll.vue'
import CheckboxFormDemo from '../src/components/docs/demos/checkbox/form.vue'

test('select-all demo derives the parent state from its children and updates the whole group', async () => {
  const wrapper = mount(CheckboxSelectAllDemo, { attachTo: document.body })
  const [parent, email, sms, push] = wrapper.findAll<HTMLInputElement>('input[type="checkbox"]')
  expect(parent!.element.indeterminate).toBe(true)
  expect(parent!.element.checked).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Selected: Email')

  await parent!.setValue(true)
  expect([email, sms, push].every(input => input!.element.checked)).toBe(true)
  expect(parent!.element.indeterminate).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Selected: Email, SMS, Push')

  await sms!.setValue(false)
  expect(parent!.element.checked).toBe(false)
  expect(parent!.element.indeterminate).toBe(true)
  expect(wrapper.get('[role="status"]').text()).toBe('Selected: Email, Push')

  await parent!.setValue(true)
  await parent!.setValue(false)
  expect([email, sms, push].every(input => !input!.element.checked)).toBe(true)
  expect(parent!.element.indeterminate).toBe(false)
  expect(wrapper.get('[role="status"]').text()).toBe('Selected: None')
})

test('form demo validates consent, submits named selections, and restores its initial state on reset', async () => {
  const wrapper = mount(CheckboxFormDemo, { attachTo: document.body })
  const form = wrapper.get('form').element
  const terms = wrapper.get<HTMLInputElement>('input[name="terms"]')
  const email = wrapper.get<HTMLInputElement>('input[value="email"]')
  const sms = wrapper.get<HTMLInputElement>('input[value="sms"]')
  const status = wrapper.get('[role="status"]')
  const submit = wrapper.get<HTMLButtonElement>('button[type="submit"]')

  expect(terms.attributes('aria-invalid')).toBeUndefined()
  await submit.trigger('click')
  expect(terms.attributes('aria-invalid')).toBe('true')
  expect(wrapper.text()).toContain('Accept the terms to continue.')
  expect(status.text()).toBe('Submit to inspect the form values.')

  await terms.setValue(true)
  await email.setValue(false)
  await sms.setValue(true)
  await submit.trigger('click')
  expect(JSON.parse(status.text())).toEqual({ terms: 'accepted', channels: ['sms'] })

  await wrapper.get('button[type="reset"]').trigger('click')
  await flushPromises()
  expect(terms.element.checked).toBe(false)
  expect(email.element.checked).toBe(true)
  expect(sms.element.checked).toBe(false)
  expect(terms.attributes('aria-invalid')).toBeUndefined()
  expect(new FormData(form).getAll('channel')).toEqual(['email'])
  expect(status.text()).toBe('Form reset.')
})
