import type { MdvIconData } from '@mdv-ui/mdv'
import introductionIcon from '@iconify-icons/material-symbols/menu-book'
import setupIcon from '@iconify-icons/material-symbols/settings'
import componentsIcon from '@iconify-icons/material-symbols/view-module'
import buttonIcon from '@iconify-icons/material-symbols/smart-button'
import checkboxIcon from '@iconify-icons/material-symbols/check-box-outline'
import appBarIcon from '@iconify-icons/material-symbols/web-asset-outline'
import autocompleteIcon from '@iconify-icons/material-symbols/manage-search'
import badgeIcon from '@iconify-icons/material-symbols/notifications-outline'

export const locales = ['en-US', 'zh-CN'] as const

export type Locale = (typeof locales)[number]

type MarkdownModule = typeof import('./en-US/getting-started/introduction.md')
type MarkdownLoader = () => Promise<MarkdownModule>
type LocalizedText = Record<Locale, string>

export interface DocumentationPage {
  id: string
  slug: string
  title: LocalizedText
  navigationLabel?: LocalizedText
  icon: MdvIconData
  documents: Record<Locale, MarkdownLoader>
}

export interface NavigationGroup {
  id: string
  title: LocalizedText
  icon: MdvIconData
  pages: DocumentationPage[]
  divider?: boolean
}

export type NavigationItem = DocumentationPage | NavigationGroup

function sortComponentPages(pages: DocumentationPage[]) {
  const name = (page: DocumentationPage) =>
    (page.navigationLabel?.['en-US'] ?? page.title['en-US']).replace(/^Mdv/i, '')
  return [...pages].sort((a, b) => name(a).localeCompare(name(b), 'en-US', { sensitivity: 'base' }))
}

export const navigationItems: NavigationItem[] = [
  {
    id: 'introduction',
    slug: 'getting-started/introduction',
    title: { 'en-US': 'Introduction', 'zh-CN': '简介' },
    icon: introductionIcon,
    documents: {
      'en-US': () => import('./en-US/getting-started/introduction.md'),
      'zh-CN': () => import('./zh-CN/getting-started/introduction.md'),
    },
  },
  {
    id: 'setup',
    slug: 'getting-started/setup',
    title: { 'en-US': 'Setup', 'zh-CN': '安装与配置' },
    icon: setupIcon,
    documents: {
      'en-US': () => import('./en-US/getting-started/setup.md'),
      'zh-CN': () => import('./zh-CN/getting-started/setup.md'),
    },
  },
  {
    id: 'components',
    title: { 'en-US': 'Components', 'zh-CN': '组件' },
    icon: componentsIcon,
    divider: true,
    pages: sortComponentPages([
      {
        id: 'button',
        slug: 'components/button',
        title: { 'en-US': 'Button', 'zh-CN': '按钮' },
        navigationLabel: { 'en-US': 'MdvButton', 'zh-CN': 'MdvButton' },
        icon: buttonIcon,
        documents: {
          'en-US': () => import('./en-US/components/button.md'),
          'zh-CN': () => import('./zh-CN/components/button.md'),
        },
      },
      {
        id: 'checkbox',
        slug: 'components/checkbox',
        title: { 'en-US': 'Checkbox', 'zh-CN': '复选框' },
        navigationLabel: { 'en-US': 'MdvCheckbox', 'zh-CN': 'MdvCheckbox' },
        icon: checkboxIcon,
        documents: {
          'en-US': () => import('./en-US/components/checkbox.md'),
          'zh-CN': () => import('./zh-CN/components/checkbox.md'),
        },
      },
      {
        id: 'app-bar',
        slug: 'components/app-bar',
        title: { 'en-US': 'App Bar', 'zh-CN': '应用栏' },
        navigationLabel: { 'en-US': 'MdvAppBar', 'zh-CN': 'MdvAppBar' },
        icon: appBarIcon,
        documents: {
          'en-US': () => import('./en-US/components/app-bar.md'),
          'zh-CN': () => import('./zh-CN/components/app-bar.md'),
        },
      },
      {
        id: 'autocomplete',
        slug: 'components/autocomplete',
        title: { 'en-US': 'Autocomplete', 'zh-CN': '自动补全' },
        navigationLabel: { 'en-US': 'MdvAutocomplete', 'zh-CN': 'MdvAutocomplete' },
        icon: autocompleteIcon,
        documents: {
          'en-US': () => import('./en-US/components/autocomplete.md'),
          'zh-CN': () => import('./zh-CN/components/autocomplete.md'),
        },
      },
      {
        id: 'badge',
        slug: 'components/badge',
        title: { 'en-US': 'Badge', 'zh-CN': '徽标' },
        navigationLabel: { 'en-US': 'MdvBadge', 'zh-CN': 'MdvBadge' },
        icon: badgeIcon,
        documents: {
          'en-US': () => import('./en-US/components/badge.md'),
          'zh-CN': () => import('./zh-CN/components/badge.md'),
        },
      },
    ]),
  },
]

export const documentationPages = navigationItems.flatMap((item) =>
  'pages' in item ? item.pages : [item],
)
export const defaultDocumentId = 'introduction'

export function getRouteName(locale: Locale, documentId: string) {
  return `docs-${locale}-${documentId}`
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.some((locale) => locale === value)
}
