import { expect, test } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import enUS from '../src/locales/en-US.ts'
import zhCN from '../src/locales/zh-CN.ts'
import { renderMarkdown } from './markdown.ts'
import HeadingArticle from './fixtures/heading-locales.md'

function readHeadings(template: string) {
  const container = document.createElement('div')
  container.innerHTML = template
  return Array.from(container.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6'))
}

test('all Markdown heading levels receive matching visible permalinks', async () => {
  const result = await renderMarkdown([
    '# Quick Start', '## 代码块标题', '### Mixed Vue 配置',
    '#### API Reference', '##### Options', '###### Details',
  ].join('\n\n'))
  const headings = readHeadings(result.template)
  expect(headings.map(heading => heading.id)).toEqual([
    'quick-start', '代码块标题', 'mixed-vue-配置', 'api-reference', 'options', 'details',
  ])
  for (const heading of headings) {
    const link = heading.querySelector<HTMLAnchorElement>('.docs-heading-anchor')!
    expect(heading.firstElementChild).toBe(link)
    expect(link.getAttribute('href')).toBe(`#${encodeURIComponent(heading.id)}`)
    expect(link.textContent).toBe('#')
    expect(link.firstElementChild!.getAttribute('aria-hidden')).toBe('true')
  }
})

test('duplicate headings and naturally colliding suffixes stay unique within each article', async () => {
  const source = ['Repeat', 'Repeat', 'Repeat 1', 'REPEAT', '配置', '配置', '!!!', '???']
    .map(text => `## ${text}`).join('\n\n')
  const result = await renderMarkdown(source)
  expect(readHeadings(result.template).map(heading => heading.id)).toEqual([
    'repeat', 'repeat-1', 'repeat-1-1', 'repeat-2', '配置', '配置-1', 'section', 'section-1',
  ])
  const next = await renderMarkdown('## Repeat')
  expect(readHeadings(next.template)[0]!.id).toBe('repeat')
})

test('heading IDs use rendered text while retaining emphasis, inline code, links, and Unicode', async () => {
  const result = await renderMarkdown('## Use **MDV** with `Vue` & [links](https://example.com) — 配置')
  const [heading] = readHeadings(result.template)
  expect(heading!.id).toBe('use-mdv-with-vue-links-配置')
  expect(heading!.querySelector('strong')!.textContent).toBe('MDV')
  expect(heading!.querySelector('code')!.textContent).toBe('Vue')
  expect(heading!.querySelector('a[href="https://example.com"]')).toBeTruthy()
  expect(heading!.querySelector('.docs-heading-anchor a')).toBe(null)
})

test('normal fragment references match generated IDs and fenced heading examples stay literal', async () => {
  const result = await renderMarkdown([
    '## 代码块标题', '[跳转](#代码块标题)',
    '```md\n## Example only\n```',
  ].join('\n\n'))
  const container = document.createElement('div')
  container.innerHTML = result.template
  expect(container.querySelectorAll('.docs-heading-anchor').length).toBe(1)
  const reference = container.querySelector<HTMLAnchorElement>('p a')!
  expect(decodeURIComponent(reference.getAttribute('href')!.slice(1))).toBe('代码块标题')
  expect(container.querySelector('[id="代码块标题"]')).toBeTruthy()
})

test('permalink accessible names use locale messages and preserve quoted or code-formatted titles', async () => {
  const host = document.createElement('article')
  document.body.append(host)
  const i18n = createI18n({
    legacy: false, locale: 'zh-CN', messages: { 'en-US': enUS, 'zh-CN': zhCN },
  })
  const wrapper = mount(HeadingArticle, { attachTo: host, global: { plugins: [i18n] } })
  try {
    const link = host.querySelector<HTMLAnchorElement>('.docs-heading-anchor')!
    expect(link.getAttribute('aria-label')).toBe('跳转到章节：安装 "A" & <pkg>')
    i18n.global.locale.value = 'en-US'
    await nextTick()
    expect(link.getAttribute('aria-label')).toBe('Link to section: 安装 "A" & <pkg>')
    expect(host.querySelector('h2 code')!.textContent).toBe('<pkg>')
  } finally {
    wrapper.unmount()
    host.remove()
  }
})
