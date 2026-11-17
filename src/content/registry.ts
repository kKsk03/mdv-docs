import type { MdvIconData } from '@mdv-ui/mdv'
import introductionIcon from '@iconify-icons/material-symbols/menu-book'
import setupIcon from '@iconify-icons/material-symbols/settings'
import buttonIcon from '@iconify-icons/material-symbols/smart-button'

export const locales = ['en-US', 'zh-CN'] as const

export type Locale = (typeof locales)[number]

type MarkdownModule = typeof import('./en-US/getting-started/introduction.md')
type MarkdownLoader = () => Promise<MarkdownModule>
type LocalizedText = Record<Locale, string>

export interface DocumentationPage {
  id: string
  slug: string
  title: LocalizedText
  icon: MdvIconData
  documents: Record<Locale, MarkdownLoader>
}

export interface NavigationSection {
  id: string
  title: LocalizedText
  pages: DocumentationPage[]
}

export const navigationSections: NavigationSection[] = [
  {
    id: 'getting-started',
    title: { 'en-US': 'Getting Started', 'zh-CN': '入门指南' },
    pages: [
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
    ],
  },
  {
    id: 'components',
    title: { 'en-US': 'Components', 'zh-CN': '组件' },
    pages: [
      {
        id: 'button',
        slug: 'components/button',
        title: { 'en-US': 'Button', 'zh-CN': '按钮' },
        icon: buttonIcon,
        documents: {
          'en-US': () => import('./en-US/components/button.md'),
          'zh-CN': () => import('./zh-CN/components/button.md'),
        },
      },
    ],
  },
]

export const documentationPages = navigationSections.flatMap((section) => section.pages)
export const defaultDocumentId = 'introduction'

export function getRouteName(locale: Locale, documentId: string) {
  return `docs-${locale}-${documentId}`
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.some((locale) => locale === value)
}
