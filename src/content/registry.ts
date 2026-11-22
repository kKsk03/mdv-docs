import type { Component } from 'vue'
import type { MdvIconData } from '@mdv-ui/mdv'
import introductionIcon from '@iconify-icons/material-symbols/menu-book'
import setupIcon from '@iconify-icons/material-symbols/settings'
import componentsIcon from '@iconify-icons/material-symbols/view-module'
import buttonIcon from '@iconify-icons/material-symbols/smart-button'
import checkboxIcon from '@iconify-icons/material-symbols/check-box-outline'
import appBarIcon from '@iconify-icons/material-symbols/web-asset-outline'
import autocompleteIcon from '@iconify-icons/material-symbols/manage-search'
import badgeIcon from '@iconify-icons/material-symbols/notifications-outline'
import bottomSheetIcon from '@iconify-icons/material-symbols/vertical-align-bottom'
import buttonGroupIcon from '@iconify-icons/material-symbols/view-column-outline'
import cardIcon from '@iconify-icons/material-symbols/rectangle-outline'
import carouselIcon from '@iconify-icons/material-symbols/view-carousel-outline'
import chipIcon from '@iconify-icons/material-symbols/label-outline'
import circularProgressIcon from '@iconify-icons/material-symbols/progress-activity'
import datePickerIcon from '@iconify-icons/material-symbols/calendar-month-outline'
import dateRangePickerIcon from '@iconify-icons/material-symbols/date-range-outline'
import dialogIcon from '@iconify-icons/material-symbols/chat-bubble-outline'
import dividerIcon from '@iconify-icons/material-symbols/horizontal-rule'
import fabIcon from '@iconify-icons/material-symbols/add-circle-outline'
import fabMenuIcon from '@iconify-icons/material-symbols/expand-circle-up-outline'
import fullscreenDialogIcon from '@iconify-icons/material-symbols/fullscreen'
import iconIcon from '@iconify-icons/material-symbols/image-outline'
import iconButtonIcon from '@iconify-icons/material-symbols/touch-app-outline'
import linearProgressIcon from '@iconify-icons/material-symbols/linear-scale'
import listIcon from '@iconify-icons/material-symbols/format-list-bulleted'
import loadingIndicatorIcon from '@iconify-icons/material-symbols/animation'
import menuIcon from '@iconify-icons/material-symbols/menu-open'
import navigationBarIcon from '@iconify-icons/material-symbols/bottom-navigation'
import navigationDrawerIcon from '@iconify-icons/material-symbols/side-navigation'
import navigationRailIcon from '@iconify-icons/material-symbols/view-sidebar-outline'
import radioIcon from '@iconify-icons/material-symbols/radio-button-checked'
import searchBarIcon from '@iconify-icons/material-symbols/search'
import segmentedButtonIcon from '@iconify-icons/material-symbols/view-week-outline'
import selectIcon from '@iconify-icons/material-symbols/arrow-drop-down-circle-outline'
import sideSheetIcon from '@iconify-icons/material-symbols/dock-to-right-outline'
import sliderIcon from '@iconify-icons/material-symbols/tune'
import snackbarIcon from '@iconify-icons/material-symbols/notifications-active'
import splitButtonIcon from '@iconify-icons/material-symbols/arrow-split'
import switchIcon from '@iconify-icons/material-symbols/toggle-on-outline'
import tabsIcon from '@iconify-icons/material-symbols/tab'
import textFieldIcon from '@iconify-icons/material-symbols/text-fields'
import timePickerIcon from '@iconify-icons/material-symbols/schedule-outline'
import toolbarIcon from '@iconify-icons/material-symbols/construction-outline'
import tooltipIcon from '@iconify-icons/material-symbols/info-outline'

export const locales = ['en-US', 'zh-CN'] as const

export type Locale = (typeof locales)[number]

type PageLoader = () => Promise<{ default: Component }>
type LocalizedText = Record<Locale, string>

export interface DocumentationPage {
  id: string
  slug: string
  title: LocalizedText
  navigationLabel?: LocalizedText
  icon: MdvIconData
  documents: Record<Locale, PageLoader>
}

export interface NavigationGroup {
  id: string
  title: LocalizedText
  icon: MdvIconData
  pages: DocumentationPage[]
  divider?: boolean
}

export type NavigationItem = DocumentationPage | NavigationGroup

export function getComponentName(page: DocumentationPage) {
  return (page.navigationLabel?.['en-US'] ?? page.title['en-US']).replace(/^Mdv/i, '')
}

export function getComponentTranslation(page: DocumentationPage, locale: Locale) {
  return locale === 'en-US' ? undefined : page.title[locale]
}

function sortComponentPages(pages: DocumentationPage[]) {
  return [...pages].sort((a, b) =>
    getComponentName(a).localeCompare(getComponentName(b), 'en-US', { sensitivity: 'base' }),
  )
}

const loadIntroduction = () => import('@/views/IntroductionPage.vue')

export const navigationItems: NavigationItem[] = [
  {
    id: 'introduction',
    slug: 'getting-started/introduction',
    title: { 'en-US': 'Introduction', 'zh-CN': '简介' },
    icon: introductionIcon,
    documents: {
      'en-US': loadIntroduction,
      'zh-CN': loadIntroduction,
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
        id: 'segmented-button',
        slug: 'components/segmented-button',
        title: { 'en-US': 'Segmented Button', 'zh-CN': '分段按钮' },
        navigationLabel: { 'en-US': 'SegmentedButton', 'zh-CN': 'SegmentedButton' },
        icon: segmentedButtonIcon,
        documents: {
          'en-US': () => import('./en-US/components/segmented-button.md'),
          'zh-CN': () => import('./zh-CN/components/segmented-button.md'),
        },
      },
      {
        id: 'select',
        slug: 'components/select',
        title: { 'en-US': 'Select', 'zh-CN': '选择器' },
        navigationLabel: { 'en-US': 'Select', 'zh-CN': 'Select' },
        icon: selectIcon,
        documents: {
          'en-US': () => import('./en-US/components/select.md'),
          'zh-CN': () => import('./zh-CN/components/select.md'),
        },
      },
      {
        id: 'side-sheet',
        slug: 'components/side-sheet',
        title: { 'en-US': 'Side Sheet', 'zh-CN': '侧边面板' },
        navigationLabel: { 'en-US': 'SideSheet', 'zh-CN': 'SideSheet' },
        icon: sideSheetIcon,
        documents: {
          'en-US': () => import('./en-US/components/side-sheet.md'),
          'zh-CN': () => import('./zh-CN/components/side-sheet.md'),
        },
      },
      {
        id: 'slider',
        slug: 'components/slider',
        title: { 'en-US': 'Slider', 'zh-CN': '滑块' },
        navigationLabel: { 'en-US': 'Slider', 'zh-CN': 'Slider' },
        icon: sliderIcon,
        documents: {
          'en-US': () => import('./en-US/components/slider.md'),
          'zh-CN': () => import('./zh-CN/components/slider.md'),
        },
      },
      {
        id: 'snackbar',
        slug: 'components/snackbar',
        title: { 'en-US': 'Snackbar', 'zh-CN': '消息提示' },
        navigationLabel: { 'en-US': 'Snackbar', 'zh-CN': 'Snackbar' },
        icon: snackbarIcon,
        documents: {
          'en-US': () => import('./en-US/components/snackbar.md'),
          'zh-CN': () => import('./zh-CN/components/snackbar.md'),
        },
      },
      {
        id: 'split-button',
        slug: 'components/split-button',
        title: { 'en-US': 'Split Button', 'zh-CN': '拆分按钮' },
        navigationLabel: { 'en-US': 'SplitButton', 'zh-CN': 'SplitButton' },
        icon: splitButtonIcon,
        documents: {
          'en-US': () => import('./en-US/components/split-button.md'),
          'zh-CN': () => import('./zh-CN/components/split-button.md'),
        },
      },
      {
        id: 'switch',
        slug: 'components/switch',
        title: { 'en-US': 'Switch', 'zh-CN': '开关' },
        navigationLabel: { 'en-US': 'Switch', 'zh-CN': 'Switch' },
        icon: switchIcon,
        documents: {
          'en-US': () => import('./en-US/components/switch.md'),
          'zh-CN': () => import('./zh-CN/components/switch.md'),
        },
      },
      {
        id: 'tabs',
        slug: 'components/tabs',
        title: { 'en-US': 'Tabs', 'zh-CN': '标签页' },
        navigationLabel: { 'en-US': 'Tabs', 'zh-CN': 'Tabs' },
        icon: tabsIcon,
        documents: {
          'en-US': () => import('./en-US/components/tabs.md'),
          'zh-CN': () => import('./zh-CN/components/tabs.md'),
        },
      },
      {
        id: 'text-field',
        slug: 'components/text-field',
        title: { 'en-US': 'Text Field', 'zh-CN': '文本框' },
        navigationLabel: { 'en-US': 'TextField', 'zh-CN': 'TextField' },
        icon: textFieldIcon,
        documents: {
          'en-US': () => import('./en-US/components/text-field.md'),
          'zh-CN': () => import('./zh-CN/components/text-field.md'),
        },
      },
      {
        id: 'time-picker',
        slug: 'components/time-picker',
        title: { 'en-US': 'Time Picker', 'zh-CN': '时间选择器' },
        navigationLabel: { 'en-US': 'TimePicker', 'zh-CN': 'TimePicker' },
        icon: timePickerIcon,
        documents: {
          'en-US': () => import('./en-US/components/time-picker.md'),
          'zh-CN': () => import('./zh-CN/components/time-picker.md'),
        },
      },
      {
        id: 'toolbar',
        slug: 'components/toolbar',
        title: { 'en-US': 'Toolbar', 'zh-CN': '工具栏' },
        navigationLabel: { 'en-US': 'Toolbar', 'zh-CN': 'Toolbar' },
        icon: toolbarIcon,
        documents: {
          'en-US': () => import('./en-US/components/toolbar.md'),
          'zh-CN': () => import('./zh-CN/components/toolbar.md'),
        },
      },
      {
        id: 'tooltip',
        slug: 'components/tooltip',
        title: { 'en-US': 'Tooltip', 'zh-CN': '提示气泡' },
        navigationLabel: { 'en-US': 'Tooltip', 'zh-CN': 'Tooltip' },
        icon: tooltipIcon,
        documents: {
          'en-US': () => import('./en-US/components/tooltip.md'),
          'zh-CN': () => import('./zh-CN/components/tooltip.md'),
        },
      },
      {
        id: 'navigation-rail',
        slug: 'components/navigation-rail',
        title: { 'en-US': 'Navigation Rail', 'zh-CN': '导航轨' },
        navigationLabel: { 'en-US': 'NavigationRail', 'zh-CN': 'NavigationRail' },
        icon: navigationRailIcon,
        documents: {
          'en-US': () => import('./en-US/components/navigation-rail.md'),
          'zh-CN': () => import('./zh-CN/components/navigation-rail.md'),
        },
      },
      {
        id: 'radio',
        slug: 'components/radio',
        title: { 'en-US': 'Radio', 'zh-CN': '单选框' },
        navigationLabel: { 'en-US': 'Radio', 'zh-CN': 'Radio' },
        icon: radioIcon,
        documents: {
          'en-US': () => import('./en-US/components/radio.md'),
          'zh-CN': () => import('./zh-CN/components/radio.md'),
        },
      },
      {
        id: 'search-bar',
        slug: 'components/search-bar',
        title: { 'en-US': 'Search Bar', 'zh-CN': '搜索栏' },
        navigationLabel: { 'en-US': 'SearchBar', 'zh-CN': 'SearchBar' },
        icon: searchBarIcon,
        documents: {
          'en-US': () => import('./en-US/components/search-bar.md'),
          'zh-CN': () => import('./zh-CN/components/search-bar.md'),
        },
      },
      {
        id: 'menu',
        slug: 'components/menu',
        title: { 'en-US': 'Menu', 'zh-CN': '菜单' },
        navigationLabel: { 'en-US': 'Menu', 'zh-CN': 'Menu' },
        icon: menuIcon,
        documents: {
          'en-US': () => import('./en-US/components/menu.md'),
          'zh-CN': () => import('./zh-CN/components/menu.md'),
        },
      },
      {
        id: 'navigation-bar',
        slug: 'components/navigation-bar',
        title: { 'en-US': 'Navigation Bar', 'zh-CN': '导航栏' },
        navigationLabel: { 'en-US': 'NavigationBar', 'zh-CN': 'NavigationBar' },
        icon: navigationBarIcon,
        documents: {
          'en-US': () => import('./en-US/components/navigation-bar.md'),
          'zh-CN': () => import('./zh-CN/components/navigation-bar.md'),
        },
      },
      {
        id: 'navigation-drawer',
        slug: 'components/navigation-drawer',
        title: { 'en-US': 'Navigation Drawer', 'zh-CN': '导航抽屉' },
        navigationLabel: { 'en-US': 'NavigationDrawer', 'zh-CN': 'NavigationDrawer' },
        icon: navigationDrawerIcon,
        documents: {
          'en-US': () => import('./en-US/components/navigation-drawer.md'),
          'zh-CN': () => import('./zh-CN/components/navigation-drawer.md'),
        },
      },
      {
        id: 'linear-progress',
        slug: 'components/linear-progress',
        title: { 'en-US': 'Linear Progress', 'zh-CN': '线性进度指示器' },
        navigationLabel: { 'en-US': 'LinearProgress', 'zh-CN': 'LinearProgress' },
        icon: linearProgressIcon,
        documents: {
          'en-US': () => import('./en-US/components/linear-progress.md'),
          'zh-CN': () => import('./zh-CN/components/linear-progress.md'),
        },
      },
      {
        id: 'list',
        slug: 'components/list',
        title: { 'en-US': 'List', 'zh-CN': '列表' },
        navigationLabel: { 'en-US': 'List', 'zh-CN': 'List' },
        icon: listIcon,
        documents: {
          'en-US': () => import('./en-US/components/list.md'),
          'zh-CN': () => import('./zh-CN/components/list.md'),
        },
      },
      {
        id: 'loading-indicator',
        slug: 'components/loading-indicator',
        title: { 'en-US': 'Loading Indicator', 'zh-CN': '加载指示器' },
        navigationLabel: { 'en-US': 'LoadingIndicator', 'zh-CN': 'LoadingIndicator' },
        icon: loadingIndicatorIcon,
        documents: {
          'en-US': () => import('./en-US/components/loading-indicator.md'),
          'zh-CN': () => import('./zh-CN/components/loading-indicator.md'),
        },
      },
      {
        id: 'fullscreen-dialog',
        slug: 'components/fullscreen-dialog',
        title: { 'en-US': 'Fullscreen Dialog', 'zh-CN': '全屏对话框' },
        navigationLabel: { 'en-US': 'FullscreenDialog', 'zh-CN': 'FullscreenDialog' },
        icon: fullscreenDialogIcon,
        documents: {
          'en-US': () => import('./en-US/components/fullscreen-dialog.md'),
          'zh-CN': () => import('./zh-CN/components/fullscreen-dialog.md'),
        },
      },
      {
        id: 'icon',
        slug: 'components/icon',
        title: { 'en-US': 'Icon', 'zh-CN': '图标' },
        navigationLabel: { 'en-US': 'Icon', 'zh-CN': 'Icon' },
        icon: iconIcon,
        documents: {
          'en-US': () => import('./en-US/components/icon.md'),
          'zh-CN': () => import('./zh-CN/components/icon.md'),
        },
      },
      {
        id: 'icon-button',
        slug: 'components/icon-button',
        title: { 'en-US': 'Icon Button', 'zh-CN': '图标按钮' },
        navigationLabel: { 'en-US': 'IconButton', 'zh-CN': 'IconButton' },
        icon: iconButtonIcon,
        documents: {
          'en-US': () => import('./en-US/components/icon-button.md'),
          'zh-CN': () => import('./zh-CN/components/icon-button.md'),
        },
      },
      {
        id: 'divider',
        slug: 'components/divider',
        title: { 'en-US': 'Divider', 'zh-CN': '分割线' },
        navigationLabel: { 'en-US': 'Divider', 'zh-CN': 'Divider' },
        icon: dividerIcon,
        documents: {
          'en-US': () => import('./en-US/components/divider.md'),
          'zh-CN': () => import('./zh-CN/components/divider.md'),
        },
      },
      {
        id: 'fab',
        slug: 'components/fab',
        title: { 'en-US': 'FAB', 'zh-CN': '浮动操作按钮' },
        navigationLabel: { 'en-US': 'Fab', 'zh-CN': 'Fab' },
        icon: fabIcon,
        documents: {
          'en-US': () => import('./en-US/components/fab.md'),
          'zh-CN': () => import('./zh-CN/components/fab.md'),
        },
      },
      {
        id: 'fab-menu',
        slug: 'components/fab-menu',
        title: { 'en-US': 'FAB Menu', 'zh-CN': '浮动操作菜单' },
        navigationLabel: { 'en-US': 'FabMenu', 'zh-CN': 'FabMenu' },
        icon: fabMenuIcon,
        documents: {
          'en-US': () => import('./en-US/components/fab-menu.md'),
          'zh-CN': () => import('./zh-CN/components/fab-menu.md'),
        },
      },
      {
        id: 'date-picker',
        slug: 'components/date-picker',
        title: { 'en-US': 'Date Picker', 'zh-CN': '日期选择器' },
        navigationLabel: { 'en-US': 'DatePicker', 'zh-CN': 'DatePicker' },
        icon: datePickerIcon,
        documents: {
          'en-US': () => import('./en-US/components/date-picker.md'),
          'zh-CN': () => import('./zh-CN/components/date-picker.md'),
        },
      },
      {
        id: 'date-range-picker',
        slug: 'components/date-range-picker',
        title: { 'en-US': 'Date Range Picker', 'zh-CN': '日期范围选择器' },
        navigationLabel: { 'en-US': 'DateRangePicker', 'zh-CN': 'DateRangePicker' },
        icon: dateRangePickerIcon,
        documents: {
          'en-US': () => import('./en-US/components/date-range-picker.md'),
          'zh-CN': () => import('./zh-CN/components/date-range-picker.md'),
        },
      },
      {
        id: 'dialog',
        slug: 'components/dialog',
        title: { 'en-US': 'Dialog', 'zh-CN': '对话框' },
        navigationLabel: { 'en-US': 'Dialog', 'zh-CN': 'Dialog' },
        icon: dialogIcon,
        documents: {
          'en-US': () => import('./en-US/components/dialog.md'),
          'zh-CN': () => import('./zh-CN/components/dialog.md'),
        },
      },
      {
        id: 'carousel',
        slug: 'components/carousel',
        title: { 'en-US': 'Carousel', 'zh-CN': '轮播' },
        navigationLabel: { 'en-US': 'Carousel', 'zh-CN': 'Carousel' },
        icon: carouselIcon,
        documents: {
          'en-US': () => import('./en-US/components/carousel.md'),
          'zh-CN': () => import('./zh-CN/components/carousel.md'),
        },
      },
      {
        id: 'chip',
        slug: 'components/chip',
        title: { 'en-US': 'Chip', 'zh-CN': '纸片' },
        navigationLabel: { 'en-US': 'Chip', 'zh-CN': 'Chip' },
        icon: chipIcon,
        documents: {
          'en-US': () => import('./en-US/components/chip.md'),
          'zh-CN': () => import('./zh-CN/components/chip.md'),
        },
      },
      {
        id: 'circular-progress',
        slug: 'components/circular-progress',
        title: { 'en-US': 'Circular Progress', 'zh-CN': '圆形进度指示器' },
        navigationLabel: { 'en-US': 'CircularProgress', 'zh-CN': 'CircularProgress' },
        icon: circularProgressIcon,
        documents: {
          'en-US': () => import('./en-US/components/circular-progress.md'),
          'zh-CN': () => import('./zh-CN/components/circular-progress.md'),
        },
      },
      {
        id: 'bottom-sheet',
        slug: 'components/bottom-sheet',
        title: { 'en-US': 'Bottom Sheet', 'zh-CN': '底部面板' },
        navigationLabel: { 'en-US': 'BottomSheet', 'zh-CN': 'BottomSheet' },
        icon: bottomSheetIcon,
        documents: {
          'en-US': () => import('./en-US/components/bottom-sheet.md'),
          'zh-CN': () => import('./zh-CN/components/bottom-sheet.md'),
        },
      },
      {
        id: 'button-group',
        slug: 'components/button-group',
        title: { 'en-US': 'Button Group', 'zh-CN': '按钮组' },
        navigationLabel: { 'en-US': 'ButtonGroup', 'zh-CN': 'ButtonGroup' },
        icon: buttonGroupIcon,
        documents: {
          'en-US': () => import('./en-US/components/button-group.md'),
          'zh-CN': () => import('./zh-CN/components/button-group.md'),
        },
      },
      {
        id: 'card',
        slug: 'components/card',
        title: { 'en-US': 'Card', 'zh-CN': '卡片' },
        navigationLabel: { 'en-US': 'Card', 'zh-CN': 'Card' },
        icon: cardIcon,
        documents: {
          'en-US': () => import('./en-US/components/card.md'),
          'zh-CN': () => import('./zh-CN/components/card.md'),
        },
      },
      {
        id: 'button',
        slug: 'components/button',
        title: { 'en-US': 'Button', 'zh-CN': '按钮' },
        navigationLabel: { 'en-US': 'Button', 'zh-CN': 'Button' },
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
        navigationLabel: { 'en-US': 'Checkbox', 'zh-CN': 'Checkbox' },
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
        navigationLabel: { 'en-US': 'AppBar', 'zh-CN': 'AppBar' },
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
        navigationLabel: { 'en-US': 'Autocomplete', 'zh-CN': 'Autocomplete' },
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
        navigationLabel: { 'en-US': 'Badge', 'zh-CN': 'Badge' },
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
