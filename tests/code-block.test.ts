import { expect, test, vi } from 'vitest'
import { mount as mountComponent } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import enUS from '../src/locales/en-US.ts'
import zhCN from '../src/locales/zh-CN.ts'
import CodeBlock from '../src/components/docs/CodeBlock.vue'
import CodeTabs from '../src/components/docs/CodeTabs.vue'
const sample = 'const name = "你好"\n\t<span>literal & text</span>\nlast line'

async function settle() {
  await nextTick()
  await nextTick()
}

async function mount(options: {
  write?: (text: string) => Promise<void>
  unavailable?: boolean
  tabbed?: boolean
  empty?: boolean
  numbered?: boolean
  locale?: 'en-US' | 'zh-CN'
} = {}) {
  const original = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard')
  const writes: string[] = []
  const writeText = options.write ?? (async (text: string) => { writes.push(text) })
  Object.defineProperty(window.navigator, 'clipboard', {
    configurable: true,
    value: options.unavailable ? undefined : { writeText },
  })
  const host = document.createElement('div')
  document.body.append(host)
  const i18n = createI18n({
    legacy: false,
    locale: options.locale ?? 'en-US',
    messages: { 'en-US': enUS, 'zh-CN': zhCN },
  })
  const block = (text: string) => h(CodeBlock, {
    language: 'sh',
    lineCount: options.numbered ? text.split('\n').length : undefined,
  }, {
    default: () => h('pre', { tabindex: 0 }, h('code', {},
      text.split('\n').flatMap((line, index) => [
        ...(index ? ['\n'] : []), h('span', { class: 'line' }, line),
      ]),
    )),
  })
  const wrapper = mountComponent({
    render: () => options.tabbed
      ? h(CodeTabs, { labels: ['npm', 'pnpm'] }, {
        'tab-0': () => block('npm install @mdv-ui/mdv'),
        'tab-1': () => block('pnpm add @mdv-ui/mdv'),
      })
      : block(options.empty ? '' : sample),
  }, { attachTo: host, global: { plugins: [i18n] } })
  await settle()
  const button = () => Array.from(host.querySelectorAll<HTMLButtonElement>('.docs-code-block button'))
    .find(element => !element.closest('[hidden]'))!
  const status = () => Array.from(host.querySelectorAll<HTMLElement>('[role="status"]'))
    .find(element => !element.closest('[hidden]'))!
  return {
    host, button, status, writes, i18n,
    copy() {
      return wrapper.findAll('button')
        .find(candidate => candidate.element === button())!.trigger('click')
    },
    close() {
      wrapper.unmount()
      host.remove()
      if (original) Object.defineProperty(window.navigator, 'clipboard', original)
      else Reflect.deleteProperty(window.navigator, 'clipboard')
    },
  }
}

test('copying preserves plain code and shows the new icon and localized success temporarily', async () => {
  const fixture = await mount({ locale: 'zh-CN' })
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
  try {
    const button = fixture.button()
    expect(fixture.host.querySelector('.docs-code-block__line-numbers')).toBe(null)
    expect(button.getAttribute('aria-label')).toBe('复制代码')
    button.focus()
    expect(document.activeElement).toBe(button)
    const initialIcon = button.querySelector('svg')!.innerHTML
    expect(initialIcon).toBeTruthy()
    await fixture.copy()
    await settle()
    expect(fixture.writes).toEqual([sample])
    expect(fixture.status().textContent).toBe('已复制')
    expect(fixture.status().getAttribute('aria-live')).toBe('polite')
    expect(button.querySelector('svg')!.innerHTML).not.toBe(initialIcon)
    vi.advanceTimersByTime(1999)
    await settle()
    expect(fixture.status().textContent).toBe('已复制')
    vi.advanceTimersByTime(1)
    await settle()
    expect(fixture.status().textContent).toBe('')
    expect(button.querySelector('svg')!.innerHTML).toBe(initialIcon)
  } finally { fixture.close() }
})

test('numbered fences keep decorative numbers separate from selectable and copied code', async () => {
  const fixture = await mount({ numbered: true })
  try {
    const gutter = fixture.host.querySelector<HTMLElement>('.docs-code-block__line-numbers')!
    expect(gutter).toBeTruthy()
    expect(gutter.getAttribute('aria-hidden')).toBe('true')
    expect(Array.from(gutter.children, line => line.textContent)).toEqual(['1', '2', '3'])
    expect(gutter.closest('pre')).toBe(null)
    expect(fixture.host.querySelector('pre code')!.textContent).toBe(sample)
    await fixture.copy()
    await settle()
    expect(fixture.writes).toEqual([sample])
    expect(fixture.status().textContent).toBe('Copied')
  } finally { fixture.close() }
})

test('the copy action follows the currently visible code tab', async () => {
  const fixture = await mount({ tabbed: true })
  try {
    await fixture.copy()
    await settle()
    fixture.host.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1]!.click()
    await settle()
    expect(fixture.status().textContent).toBe('')
    await fixture.copy()
    await settle()
    expect(fixture.writes).toEqual(['npm install @mdv-ui/mdv', 'pnpm add @mdv-ui/mdv'])
    expect(fixture.status().textContent).toBe('Copied')
  } finally { fixture.close() }
})

test('failed clipboard writes keep the copy icon and provide actionable feedback', async () => {
  const fixture = await mount({ write: async () => { throw new Error('Clipboard denied') } })
  try {
    const initialIcon = fixture.button().querySelector('svg')!.innerHTML
    await fixture.copy()
    await settle()
    expect(fixture.status().textContent).toBe('Copy failed. Please copy manually.')
    expect(fixture.button().querySelector('svg')!.innerHTML).toBe(initialIcon)
    expect(fixture.button().getAttribute('aria-busy')).toBe('false')
  } finally { fixture.close() }
})

test('unavailable clipboard access reports a failure rather than a successful copy', async () => {
  const fixture = await mount({ unavailable: true, locale: 'zh-CN' })
  try {
    await fixture.copy()
    await settle()
    expect(fixture.writes).toEqual([])
    expect(fixture.status().textContent).toBe('复制失败，请手动复制')
  } finally { fixture.close() }
})

test('a pending write is not duplicated and reports success only after resolution', async () => {
  let finish!: () => void
  const pending = new Promise<void>(resolve => { finish = resolve })
  const writes: string[] = []
  const fixture = await mount({ write: async text => { writes.push(text); await pending } })
  try {
    await fixture.copy()
    await fixture.copy()
    await settle()
    expect(writes).toEqual([sample])
    expect(fixture.status().textContent).toBe('')
    expect(fixture.button().getAttribute('aria-busy')).toBe('true')
    finish()
    await settle()
    expect(fixture.status().textContent).toBe('Copied')
    expect(fixture.button().getAttribute('aria-busy')).toBe('false')
  } finally { fixture.close() }
})

test('empty fences can be copied', async () => {
  const fixture = await mount({ empty: true })
  try {
    await fixture.copy()
    await settle()
    expect(fixture.writes).toEqual([''])
    expect(fixture.status().textContent).toBe('Copied')
  } finally { fixture.close() }
})

test('a write completing after unmount does not create a feedback timer', async () => {
  let finish!: () => void
  const pending = new Promise<void>(resolve => { finish = resolve })
  const fixture = await mount({ write: () => pending })
  const timer = vi.spyOn(globalThis, 'setTimeout')
  await fixture.copy()
  await settle()
  fixture.close()
  finish()
  await settle()
  expect(timer).not.toHaveBeenCalled()
})
