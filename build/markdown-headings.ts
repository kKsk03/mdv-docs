import type { MarkdownExit } from 'unplugin-vue-markdown/types'

type Token = ReturnType<MarkdownExit['parse']>[number]

function headingText(tokens: Token[]): string {
  return tokens.map((token) => {
    if (token.type === 'text' || token.type === 'code_inline') return token.content
    if (token.type === 'softbreak' || token.type === 'hardbreak') return ' '
    return token.children ? headingText(token.children) : ''
  }).join('')
}

function headingSlug(text: string): string {
  return text.normalize('NFKC').toLowerCase().trim()
    .replace(/[^\p{L}\p{N}\p{M}\s_-]/gu, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section'
}

export function markdownHeadings(md: MarkdownExit) {
  md.core.ruler.after('inline', 'docs_heading_anchors', (state) => {
    const used = new Set<string>()

    for (let index = 0; index < state.tokens.length; index++) {
      const heading = state.tokens[index]!
      const inline = state.tokens[index + 1]
      if (heading.type !== 'heading_open' || inline?.type !== 'inline') continue

      const text = headingText(inline.children ?? []).trim()
      const base = headingSlug(text)
      let id = base
      let suffix = 0
      while (used.has(id)) id = `${base}-${++suffix}`
      used.add(id)
      heading.attrSet('id', id)
      heading.attrSet('tabindex', '-1')
      heading.attrSet('data-docs-heading', '')

      const open = new state.Token('link_open', 'a', 1)
      open.attrSet('class', 'docs-heading-anchor')
      open.attrSet('href', `#${encodeURIComponent(id)}`)
      open.attrSet(':aria-label', `$t('article.headingLink', { title: ${JSON.stringify(text)} })`)
      const symbol = new state.Token('html_inline', '', 0)
      symbol.content = '<span aria-hidden="true">#</span>'
      const close = new state.Token('link_close', 'a', -1)
      inline.children!.unshift(open, symbol, close)
    }
  })
}
