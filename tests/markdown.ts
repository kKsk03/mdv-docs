import { resolve } from 'node:path'
import { expect } from 'vitest'
import { resolveConfig } from 'vite'
import { compileScript, parse } from 'vue/compiler-sfc'

const config = await resolveConfig({ mode: 'test' }, 'build')
export const root = config.root
const markdown = config.plugins.find((plugin) => plugin.name === 'unplugin-vue-markdown')!
const transform =
  typeof markdown.transform === 'function' ? markdown.transform : markdown.transform!.handler

export async function renderMarkdown(source: string) {
  const result = await Reflect.apply(
    transform,
    { error(error: unknown) { throw error } },
    [source, resolve(root, 'validation.md')],
  )
  const { descriptor, errors } = parse(result.code)
  expect(errors).toEqual([])
  const compiled = compileScript(descriptor, { id: 'code-test', inlineTemplate: true })
  return {
    code: result.code as string,
    template: descriptor.template!.content,
    script: descriptor.scriptSetup!.content,
    compiled: compiled.content,
  }
}
