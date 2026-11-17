import { expect, test, vi } from 'vitest'
import { mount as mountComponent } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'
import { createI18n } from 'vue-i18n'
import { setReducedMotion } from './setup.ts'
import CodeTabs from '../src/components/docs/CodeTabs.vue'

async function settle() {
  await nextTick()
  await nextTick()
}

async function mount(options: { groups?: number; reduced?: boolean } = {}) {
  setReducedMotion(options.reduced ?? false)
  const host = document.createElement('div')
  document.body.append(host)
  const labels = ref(['npm', 'pnpm', 'yarn'])
  const i18n = createI18n({
    legacy: false,
    locale: 'en-US',
    messages: {
      'en-US': { code: { tabs: 'Code examples' } },
      'zh-CN': { code: { tabs: '代码示例' } },
    },
  })
  let submissions = 0
  const wrapper = mountComponent({
    render: () => h('form', { onSubmit: (event: Event) => { event.preventDefault(); submissions++ } },
      Array.from({ length: options.groups ?? 1 }, () => h(CodeTabs, { labels: labels.value },
        Object.fromEntries(labels.value.map((label, index) => [
          `tab-${index}`, () => h('pre', { tabindex: 0 }, `example for ${label}`),
        ])),
      )),
    ),
  }, { attachTo: host, global: { plugins: [i18n] } })
  await settle()
  const groups = Array.from(host.querySelectorAll<HTMLElement>('.docs-code-tabs'))
  const tabs = (group = groups[0]!) => Array.from(group.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
  const panels = (group = groups[0]!) => Array.from(group.querySelectorAll<HTMLElement>('[role="tabpanel"]'))
  const selected = (group = groups[0]!) => tabs(group).findIndex(tab => tab.getAttribute('aria-selected') === 'true')
  return {
    host, groups, tabs, panels, selected, labels, i18n,
    submissions: () => submissions,
    close() { wrapper.unmount(); host.remove() },
  }
}

function key(button: HTMLButtonElement, value: string, modifiers = {}) {
  button.dispatchEvent(new window.KeyboardEvent('keydown', {
    key: value, bubbles: true, cancelable: true, ...modifiers,
  }))
}

function geometry(fixture: Awaited<ReturnType<typeof mount>>) {
  const viewport = fixture.host.querySelector<HTMLElement>('.docs-code-tabs__viewport')!
  const row = fixture.host.querySelector<HTMLElement>('.docs-code-tabs__items')!
  const rect = (left: number, width: number) => ({ left, right: left + width, width, top: 0, bottom: 48, height: 48, x: left, y: 0, toJSON() {} })
  const widths = [64, 96, 128]
  const labelWidths = [28, 44, 60]
  viewport.getBoundingClientRect = () => rect(0, 160)
  row.getBoundingClientRect = () => rect(-viewport.scrollLeft, 320)
  fixture.tabs().forEach((tab, index) => {
    tab.getBoundingClientRect = () => rect(
      12 + widths.slice(0, index).reduce((sum, width) => sum + width, 0) - viewport.scrollLeft,
      widths[index]!,
    )
    tab.querySelector<HTMLElement>('.docs-code-tabs__label')!.getBoundingClientRect = () => rect(
      tab.getBoundingClientRect().left + (widths[index]! - labelWidths[index]!) / 2,
      labelWidths[index]!,
    )
  })
  window.dispatchEvent(new window.Event('resize'))
  return { viewport, widths, indicator: fixture.host.querySelector<HTMLElement>('.docs-code-tabs__indicator')! }
}

test('native text tabs select matching panels independently and never submit forms', async () => {
  const fixture = await mount({ groups: 2 })
  try {
    expect(fixture.selected()).toBe(0)
    expect(fixture.selected(fixture.groups[1])).toBe(0)
    expect(new Set(Array.from(fixture.host.querySelectorAll('[id]'), el => el.id)).size).toBe(12)
    for (const group of fixture.groups) {
      fixture.tabs(group).forEach((tab, index) => {
        const panel = fixture.panels(group)[index]!
        expect(tab.tagName).toBe('BUTTON')
        expect(tab.getAttribute('type')).toBe('button')
        expect(tab.getAttribute('aria-controls')).toBe(panel.id)
        expect(panel.getAttribute('aria-labelledby')).toBe(tab.id)
        expect(panel.hidden).toBe(index !== 0)
        expect(panel.hasAttribute('inert')).toBe(index !== 0)
      })
    }
    fixture.tabs()[1]!.click()
    await settle()
    expect(fixture.selected()).toBe(1)
    expect(fixture.selected(fixture.groups[1])).toBe(0)
    expect(fixture.panels()[1]!.hidden).toBe(false)
    expect(fixture.panels()[0]!.hidden).toBe(true)
    expect(fixture.submissions()).toBe(0)
  } finally { fixture.close() }
})

test('keyboard navigation wraps, respects RTL and modifiers, and uses one tab stop', async () => {
  const fixture = await mount()
  try {
    fixture.tabs()[0]!.focus()
    key(fixture.tabs()[0]!, 'ArrowLeft')
    await settle()
    expect(fixture.selected()).toBe(2)
    expect(document.activeElement).toBe(fixture.tabs()[2])
    key(fixture.tabs()[2]!, 'Home')
    await settle()
    expect(fixture.selected()).toBe(0)
    key(fixture.tabs()[0]!, 'End')
    await settle()
    expect(fixture.selected()).toBe(2)
    expect(fixture.tabs().filter(tab => tab.tabIndex === 0).length).toBe(1)
    key(fixture.tabs()[2]!, 'Home', { ctrlKey: true })
    await settle()
    expect(fixture.selected()).toBe(2)
    fixture.groups[0]!.style.direction = 'rtl'
    key(fixture.tabs()[2]!, 'ArrowRight')
    await settle()
    expect(fixture.selected()).toBe(1)
  } finally { fixture.close() }
})

test('narrow tab strips reveal the newly focused tab and localize their name', async () => {
  const fixture = await mount()
  try {
    const { viewport } = geometry(fixture)
    await settle()
    fixture.tabs()[2]!.focus()
    await settle()
    expect(viewport.scrollLeft).toBe(140)
    fixture.tabs()[0]!.focus()
    await settle()
    expect(viewport.scrollLeft).toBe(12)
    fixture.i18n.global.locale.value = 'zh-CN'
    await settle()
    expect(fixture.host.querySelector('[role="tablist"]')!.getAttribute('aria-label')).toBe('代码示例')
  } finally { fixture.close() }
})

test('shrinking labels restores focus from a removed panel and handles empty groups', async () => {
  const fixture = await mount()
  try {
    fixture.tabs()[2]!.click()
    await settle()
    fixture.panels()[2]!.querySelector<HTMLElement>('pre')!.focus()
    fixture.labels.value = ['npm']
    await settle()
    expect(fixture.selected()).toBe(0)
    expect(document.activeElement).toBe(fixture.tabs()[0])
    fixture.labels.value = []
    await settle()
    expect(fixture.tabs().length).toBe(0)
    fixture.labels.value = ['pnpm', 'yarn']
    await settle()
    expect(fixture.selected()).toBe(0)
  } finally { fixture.close() }
})

test('ripples release and clear with scoped animation names and honor reduced motion', async () => {
  const fixture = await mount()
  try {
    fixture.tabs()[0]!.dispatchEvent(new window.MouseEvent('pointerdown', { button: 0, bubbles: true }))
    await settle()
    expect(fixture.host.querySelector('.docs-code-tabs__ripple')).toBeTruthy()
    fixture.tabs()[0]!.dispatchEvent(new window.MouseEvent('pointerup', { bubbles: true }))
    await settle()
    const ripple = fixture.host.querySelector('.docs-code-tabs__ripple--released')!
    expect(ripple).toBeTruthy()
    const finished = new window.Event('animationend', { bubbles: true })
    Object.defineProperty(finished, 'animationName', { value: 'docs-code-tab-ripple-fade-test-scope' })
    ripple.dispatchEvent(finished)
    await settle()
    expect(fixture.host.querySelector('.docs-code-tabs__ripple')).toBe(null)
    setReducedMotion(true)
    key(fixture.tabs()[0]!, 'Enter')
    await settle()
    expect(fixture.host.querySelector('.docs-code-tabs__ripple')).toBe(null)
  } finally { fixture.close() }
})

test('the primary indicator follows text width, animates, honors reduced motion, and cancels on unmount', async () => {
  let now = 0
  let sequence = 0
  const frames = new Map<number, FrameRequestCallback>()
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
    frames.set(++sequence, callback)
    return sequence
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(id => { frames.delete(id) })
  vi.spyOn(window.performance, 'now').mockImplementation(() => now)
  const fixture = await mount()
  try {
    const { indicator } = geometry(fixture)
    await settle()
    expect(indicator.hidden).toBe(false)
    expect(indicator.style.transform).toBe('translateX(32px)')
    expect(indicator.style.width).toBe('24px')
    fixture.tabs()[2]!.click()
    await settle()
    expect(frames.size).toBe(1)
    const callbacks = Array.from(frames.values())
    frames.clear()
    now += 16
    callbacks.forEach(callback => callback(now))
    expect(indicator.style.transform).not.toBe('translateX(32px)')
    expect(indicator.style.transform).not.toBe('translateX(208px)')
    expect(Number.parseFloat(indicator.style.width) > 24).toBeTruthy()
    setReducedMotion(true)
    await settle()
    expect(indicator.style.transform).toBe('translateX(208px)')
    expect(indicator.style.width).toBe('56px')
    expect(frames.size).toBe(0)
    fixture.tabs()[1]!.click()
    await settle()
    expect(indicator.style.transform).toBe('translateX(104px)')
    expect(indicator.style.width).toBe('40px')
    expect(frames.size).toBe(0)
    setReducedMotion(false)
    fixture.tabs()[0]!.click()
    await settle()
    expect(frames.size).toBe(1)
    fixture.close()
    expect(frames.size).toBe(0)
  } finally {
    if (fixture.host.isConnected) fixture.close()
  }
})
