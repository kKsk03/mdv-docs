import type { MarkdownExit } from 'unplugin-vue-markdown/types'

type Token = ReturnType<MarkdownExit['parse']>[number]

interface CodeTab {
  label: string
  code: Token
}

function parseTabs(tokens: Token[], fail: (message: string) => never): CodeTab[] {
  const tabs: CodeTab[] = []

  for (let index = 0; index < tokens.length; index += 4) {
    const [open, title, close, code] = tokens.slice(index, index + 4)
    const label = title?.content.match(/^@tab[\t ]+([^\r\n]+)$/)?.[1]?.trim()

    if (
      open?.type !== 'paragraph_open' ||
      title?.type !== 'inline' ||
      close?.type !== 'paragraph_close' ||
      !label ||
      code?.type !== 'fence'
    ) {
      fail('Each @tab label must be followed by exactly one fenced code block.')
    }

    tabs.push({ label, code })
  }

  if (!tabs.length) fail('Add at least one @tab label and fenced code block.')
  return tabs
}

export function markdownCode(md: MarkdownExit) {
  const renderFence = md.renderer.rules.fence!

  md.renderer.rules.fence = async (tokens, index, options, env, renderer) => {
    const token = tokens[index]!
    const languageInfo = md.utils.unescapeAll(token.info).trim().split(/\s+/)[0] || 'text'
    const numbered = languageInfo.endsWith(':line-numbers')
    const language =
      (numbered ? languageInfo.slice(0, -':line-numbers'.length) : languageInfo) || 'text'
    const fenceTokens = numbered ? tokens.slice() : tokens
    if (numbered) {
      // Preserve the original token and its attribute helpers while normalizing Shiki's language.
      fenceTokens[index] = Object.assign(Object.create(Object.getPrototypeOf(token)), token, {
        info: token.info.replace(/^(\s*)\S+/, (_, whitespace: string) => `${whitespace}${language}`),
      })
    }
    const highlighted = await renderFence(fenceTokens, index, options, env, renderer)
    // Shiki removes one final newline; intentional blank lines still need their own numbers.
    const lineCount = numbered ? ` :line-count="${token.content.replace(/\n$/, '').split('\n').length}"` : ''

    return `<DocsCodeBlock language="${md.utils.escapeHtml(language)}"${lineCount}>\n${highlighted}</DocsCodeBlock>\n`
  }

  md.block.ruler.before(
    'fence',
    'docs_code_tabs',
    (state, startLine, endLine, silent) => {
      if (state.sCount[startLine]! - state.blkIndent >= 4) return false

      const lineText = (line: number) =>
        state.src.slice(state.bMarks[line]! + state.tShift[line]!, state.eMarks[line])
      const opening = lineText(startLine).match(/^(:{3,})[\t ]+code-tabs[\t ]*$/)
      if (!opening) return false
      if (silent) return true

      const fail = (message: string): never => {
        throw new Error(`${state.env.id || 'Markdown'}:${startLine + 1}: code-tabs: ${message}`)
      }

      const markerLength = opening[1]!.length
      let closingLine = -1
      let fence: { marker: string; length: number } | undefined

      // Container markers and @tab text inside fenced examples stay literal.
      for (let line = startLine + 1; line < endLine; line++) {
        const text = lineText(line)
        if (text && state.sCount[line]! < state.blkIndent) break
        if (state.sCount[line]! - state.blkIndent >= 4) continue

        const codeMarker = text.match(/^(`{3,}|~{3,})(.*)$/)
        if (fence) {
          if (
            codeMarker &&
            codeMarker[1]![0] === fence.marker &&
            codeMarker[1]!.length >= fence.length &&
            !codeMarker[2]!.trim()
          ) {
            fence = undefined
          }
          continue
        }

        if (/^:{3,}[\t ]*$/.test(text) && text.trim().length >= markerLength) {
          closingLine = line
          break
        }

        if (codeMarker && (codeMarker[1]![0] === '~' || !codeMarker[2]!.includes('`'))) {
          fence = { marker: codeMarker[1]![0]!, length: codeMarker[1]!.length }
        }
      }

      if (closingLine < 0) fail('Missing closing ::: marker or an unclosed code fence.')

      const content = state.getLines(startLine + 1, closingLine, state.sCount[startLine]!, true)
      const tokens: Token[] = []
      md.block.parse(content, md, state.env, tokens)
      const tabs = parseTabs(tokens, fail)

      const token = state.push('docs_code_tabs', '', 0)
      token.block = true
      token.map = [startLine, closingLine + 1]
      token.meta = tabs
      state.line = closingLine + 1
      return true
    },
    { alt: ['paragraph', 'reference', 'blockquote', 'list'] },
  )

  md.renderer.rules.docs_code_tabs = async (tokens, index, options, env, renderer) => {
    const tabs = tokens[index]!.meta as CodeTab[]
    const labels = md.utils.escapeHtml(JSON.stringify(tabs.map((tab) => tab.label)))
    const panels = await Promise.all(
      tabs.map(async (tab, tabIndex) => {
        const code = await renderer.renderAsync([tab.code], options, env)
        return `<template #tab-${tabIndex}>\n${code}</template>\n`
      }),
    )

    return `<DocsCodeTabs :labels="${labels}">\n${panels.join('')}</DocsCodeTabs>\n`
  }
}

export function withCodeImports(html: string): string {
  const imports = ['DocsCodeBlock', 'DocsCodeTabs']
    .filter((name) => new RegExp(`<${name}\\b`).test(html))
    .map((name) => `import ${name} from '@/components/docs/${name.slice(4)}.vue'`)

  if (!imports.length) return html
  const scriptSetup = /<script\b[^>]*\bsetup\b[^>]*>/
  if (scriptSetup.test(html)) {
    return html.replace(scriptSetup, (opening) => `${opening}\n${imports.join('\n')}\n`)
  }
  return `<script setup>\n${imports.join('\n')}\n</script>\n${html}`
}
