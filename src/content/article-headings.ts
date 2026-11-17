export interface ArticleHeadingLink {
  id: string
  text: string
}

export interface ArticleOutlineItem extends ArticleHeadingLink {
  children: ArticleHeadingLink[]
}

export interface ArticleOutline {
  title: ArticleHeadingLink | null
  items: ArticleOutlineItem[]
  sections: Record<string, string>
}

export function getArticleHeadings(article: HTMLElement): HTMLElement[] {
  return Array.from(article.querySelectorAll<HTMLElement>(
    'h1[data-docs-heading][id], h2[data-docs-heading][id], h3[data-docs-heading][id], ' +
    'h4[data-docs-heading][id], h5[data-docs-heading][id], h6[data-docs-heading][id]',
  )).filter(heading => heading.id && !heading.closest('[hidden], [inert], [aria-hidden="true"]'))
}

function headingLink(heading: HTMLElement): ArticleHeadingLink {
  const label = heading.cloneNode(true) as HTMLElement
  label.querySelectorAll('.docs-heading-anchor, [aria-hidden="true"]').forEach(node => node.remove())
  return {
    id: heading.id,
    text: (label.textContent ?? '').replace(/\s+/g, ' ').trim(),
  }
}

export function readArticleOutline(article: HTMLElement): ArticleOutline {
  const outline: ArticleOutline = { title: null, items: [], sections: Object.create(null) }
  let parent: ArticleOutlineItem | undefined
  let section: string | undefined

  for (const heading of getArticleHeadings(article)) {
    if (heading.tagName === 'H1') {
      outline.title ??= headingLink(heading)
      parent = undefined
      section = undefined
    } else if (heading.tagName === 'H2') {
      parent = { ...headingLink(heading), children: [] }
      outline.items.push(parent)
      section = heading.id
    } else if (heading.tagName === 'H3') {
      const link = headingLink(heading)
      if (parent) parent.children.push(link)
      else outline.items.push({ ...link, children: [] })
      section = heading.id
    }
    if (section) outline.sections[heading.id] = section
  }

  return outline
}
