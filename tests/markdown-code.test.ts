import { glob, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { expect, test } from 'vitest'
import { renderMarkdown as render, root } from './markdown.ts'

const fence = (language: string, code: string, marker = '```') =>
  `${marker}${language}\n${code}\n${marker}`
const group = (tabs: Array<[label: string, language: string, code: string]>) =>
  `::: code-tabs\n${tabs.map(([label, language, code]) => `@tab ${label}\n${fence(language, code)}`).join('\n\n')}\n:::`

test('articles without fenced code do not import code components', async () => {
  const result = await render('# Example\n\nUse `pnpm` to install.')
  expect(result.script).not.toMatch(/DocsCode(Block|Tabs)/)
  expect(result.template).toMatch(/<code v-pre>pnpm<\/code>/)
})

test('standalone fences receive the shared wrapper and light/dark highlighting', async () => {
  const result = await render(fence('ts', 'const count: number = 1'))
  expect(result.template).toMatch(/<DocsCodeBlock language="ts">/)
  expect(result.template).toMatch(/--shiki-light:/)
  expect(result.template).toMatch(/--shiki-dark:/)
  expect(result.script.match(/import DocsCodeBlock/g)?.length).toBe(1)
  expect(result.script).not.toMatch(/DocsCodeTabs|shiki/)
  expect(result.template).not.toMatch(/:line-count=/)
})

test('the line-numbers suffix enables numbering without changing TypeScript highlighting', async () => {
  const result = await render(fence('ts:line-numbers', [
    '// 启用行号',
    "const line2 = 'This is line 2'",
    "const line3 = 'This is line 3'",
  ].join('\n')))
  expect(result.template).toMatch(/<DocsCodeBlock language="ts" :line-count="3">/)
  expect(result.template).toMatch(/class="language-ts"/)
  expect(result.template).toMatch(/--shiki-light:/)
  expect(result.template).toMatch(/--shiki-dark:/)
  expect(result.template).not.toMatch(/language="ts:line-numbers"|language-ts:line-numbers/)
})

test.each([
  ['empty', '', 1],
  ['one line', 'value', 1],
  ['internal blank line', 'first\n\nthird', 3],
  ['trailing blank line', 'first\n', 2],
  ['multiple blank lines', '\n\n', 3],
] as const)('numbered fences count %s consistently with Shiki', async (_name, code, count) => {
  const result = await render(fence('text:line-numbers', code))
  expect(result.template).toMatch(new RegExp(`<DocsCodeBlock language="text" :line-count="${count}">`))
  expect(result.template.match(/class="line"/g)?.length).toBe(count)
})

test('each code tab enables numbering independently and keeps language metadata working', async () => {
  const result = await render(group([
    ['config.ts', 'ts:line-numbers title="config.ts"', 'const config = {}\nexport default config'],
    ['config.js', 'js', 'export default {}'],
  ]))
  expect(result.template).toMatch(/<DocsCodeBlock language="ts" :line-count="2">/)
  expect(result.template).toMatch(/<DocsCodeBlock language="js">/)
  expect(result.template.match(/:line-count=/g)?.length).toBe(1)
  expect(result.script.match(/import DocsCodeBlock/g)?.length).toBe(1)
})

test('line-number syntax inside a documented fence remains literal', async () => {
  const result = await render(fence('md', fence('ts:line-numbers', 'const value = 1'), '````'))
  expect(result.template).toMatch(/ts:line-numbers/)
  expect(result.template).not.toMatch(/:line-count=/)
})

test('the config.js/config.ts syntax compiles to labelled Vue slots', async () => {
  const result = await render(group([
    ['config.js', 'js', 'const config = {}\nexport default config'],
    ['config.ts', 'ts', 'const config: Record<string, unknown> = {}\nexport default config'],
  ]))
  expect(result.template).toMatch(/<DocsCodeTabs :labels="\[&quot;config.js&quot;,&quot;config.ts&quot;\]">/)
  expect(result.template).toMatch(/<template #tab-0>/)
  expect(result.template).toMatch(/<template #tab-1>/)
  expect(result.template.match(/<DocsCodeBlock /g)?.length).toBe(2)
  expect(result.template).not.toMatch(/<p>@tab/)
  expect(result.script.match(/import DocsCodeTabs/g)?.length).toBe(1)
})

test('multiple groups keep independent slot sets and deduplicate imports', async () => {
  const result = await render([
    group([['npm', 'sh', 'npm install @mdv-ui/mdv'], ['pnpm', 'sh', 'pnpm add @mdv-ui/mdv']]),
    'Text between the examples.',
    group([['config.ts', 'ts', 'export default {}']]),
  ].join('\n\n'))
  expect(result.template.match(/<DocsCodeTabs /g)?.length).toBe(2)
  expect(result.template.match(/<template #tab-0>/g)?.length).toBe(2)
  expect(result.script.match(/import DocsCodeTabs/g)?.length).toBe(1)
  expect(result.script.match(/import DocsCodeBlock/g)?.length).toBe(1)
  expect(result.template).toMatch(/<p>Text between the examples.<\/p>/)
})

test('container and tab markers inside code remain literal', async () => {
  const result = await render(group([
    ['literal.txt', 'text', '@tab not-a-tab\n:::\n::::\n@tab still-code'],
    ['next.txt', '', 'plain text'],
  ]))
  expect(result.template.match(/<DocsCodeTabs /g)?.length).toBe(1)
  expect(result.template.match(/<template #tab-/g)?.length).toBe(2)
  expect(result.template).toMatch(/@tab not-a-tab/)
  expect(result.template).toMatch(/@tab still-code/)
  expect(result.template).toMatch(/<DocsCodeBlock language="text">/)
})

test('long fences, tilde fences, and longer container delimiters work', async () => {
  const result = await render([
    ':::: code-tabs',
    '@tab markdown.md',
    fence('md', fence('sh', 'pnpm add @mdv-ui/mdv'), '````'),
    '',
    '@tab example.txt',
    fence('text', '::: code-tabs\n@tab literal', '~~~'),
    '::::',
  ].join('\n'))
  expect(result.template.match(/<DocsCodeBlock /g)?.length).toBe(2)
  expect(result.template).toMatch(/markdown.md/)
  expect(result.template).toMatch(/@tab literal/)
})

test('groups can appear in blockquotes and indented list content', async () => {
  const source = group([['example.txt', 'text', 'example']])
  const quote = source.split('\n').map((line) => `> ${line}`).join('\n')
  const list = `- Example\n\n${source.split('\n').map((line) => `  ${line}`).join('\n')}`
  const result = await render(`${quote}\n\n${list}`)
  expect(result.template.match(/<DocsCodeTabs /g)?.length).toBe(2)
  expect(result.template).toMatch(/<blockquote>/)
  expect(result.template).toMatch(/<li>/)
})

test('titles containing quotes, HTML, Unicode, and interpolation stay literal', async () => {
  const label = '配置 "A" & <img src=x> {{ title }}.ts'
  const result = await render(group([[label, 'ts', 'export default {}']]))
  expect(result.template).toMatch(/&amp;/)
  expect(result.template).toMatch(/&lt;img src=x&gt;/)
  expect(result.template).not.toMatch(/<img src=x>/)
  expect(result.compiled).not.toMatch(/_ctx.title/)
})

test('fenced Vue scripts and interpolation stay examples alongside live components', async () => {
  const source = [
    '<script setup lang="ts">\nimport LiveDemo from "./LiveDemo.vue"\n</script>',
    group([['Example.vue', 'vue', '<script setup>\nconst codeOnly = 1\n</script>\n<template>{{ codeOnly }}</template>']]),
    '<LiveDemo />',
  ].join('\n\n')
  const result = await render(source)
  expect(result.script).toMatch(/import LiveDemo/)
  expect(result.script).not.toMatch(/const codeOnly/)
  expect(result.compiled).not.toMatch(/_ctx.codeOnly/)
  expect(result.template).toMatch(/<code[^>]*\bv-pre\b/)
  expect(result.template).toMatch(/<LiveDemo\s*\/>/)
})

test('documenting the syntax in an outer fence does not activate it', async () => {
  const result = await render(fence('md', group([['npm', 'sh', 'npm install @mdv-ui/mdv']]), '````'))
  expect(result.template).not.toMatch(/<DocsCodeTabs /)
  expect(result.script).not.toMatch(/DocsCodeTabs/)
  expect(result.template).toMatch(/::: code-tabs/)
})

test.each([
  ['missing closing container', `::: code-tabs\n@tab npm\n${fence('sh', 'npm install example')}`],
  ['empty group', '::: code-tabs\n:::'],
  ['empty label', `::: code-tabs\n@tab\n${fence('sh', 'npm install example')}\n:::`],
  ['missing code', '::: code-tabs\n@tab npm\n:::'],
  ['missing label', `::: code-tabs\n${fence('sh', 'npm install example')}\n:::`],
  ['extra code fence', `::: code-tabs\n@tab npm\n${fence('sh', 'npm install example')}\n${fence('text', 'extra')}\n:::`],
  ['unclosed fence', '::: code-tabs\n@tab npm\n```sh\nnpm install example\n:::'],
])('malformed groups report a source location and actionable error: %s', async (_name, source) => {
  await expect(render(source)).rejects.toThrow(/validation.md:1: code-tabs:/)
})

test('all current localized Markdown pages compile through the real pipeline', async () => {
  let count = 0
  for await (const path of glob('src/content/**/*.md', { cwd: root })) {
    await render(await readFile(resolve(root, path), 'utf8'))
    count++
  }
  expect(count).toBeGreaterThanOrEqual(6)
})
