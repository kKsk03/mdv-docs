import { afterEach, expect, test, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import type { VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { createI18n } from 'vue-i18n'
import { createMemoryHistory, createRouter } from 'vue-router'
import Layout from '../src/views/Layout.vue'
import { documentationPages, getRouteName, locales } from '../src/content/registry.ts'
import enUS from '../src/locales/en-US.ts'
import zhCN from '../src/locales/zh-CN.ts'

let host: VueWrapper | undefined
let restorePopover: (() => void) | undefined

afterEach(() => {
  host?.unmount()
  host = undefined
  restorePopover?.()
  restorePopover = undefined
  localStorage.clear()
})

// Keep real MDV menus and positioning; supply only jsdom's missing Popover state.
function mockPopover() {
  const opened = new Set<HTMLElement>()
  const showDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'showPopover')
  const hideDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'hidePopover')
  Object.defineProperties(HTMLElement.prototype, {
    showPopover: { configurable: true, value(this: HTMLElement) {
      opened.add(this)
      this.style.display = 'block'
    } },
    hidePopover: { configurable: true, value(this: HTMLElement) {
      opened.delete(this)
      this.style.removeProperty('display')
    } },
  })
  const matches = Element.prototype.matches
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector) {
    return selector === ':popover-open' ? opened.has(this as HTMLElement) : matches.call(this, selector)
  })
  restorePopover = () => {
    if (showDescriptor) Object.defineProperty(HTMLElement.prototype, 'showPopover', showDescriptor)
    else Reflect.deleteProperty(HTMLElement.prototype, 'showPopover')
    if (hideDescriptor) Object.defineProperty(HTMLElement.prototype, 'hidePopover', hideDescriptor)
    else Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover')
  }
  return opened
}

async function fixture(desktop = false, realTransitions = false) {
  localStorage.clear()
  const opened = mockPopover()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const viewport = Object.assign(new EventTarget(), {
    matches: desktop,
    media: '(min-width: 768px)',
  })
  vi.stubGlobal('matchMedia', (query: string) => query === viewport.media ? viewport : reduced)
  const router = createRouter({
    history: createMemoryHistory(),
    routes: locales.flatMap(locale => documentationPages.map(page => ({
      path: `/${locale}/${page.slug}`,
      name: getRouteName(locale, page.id),
      component: { render: () => h('div', [
        h('h1', { id: page.id, 'data-docs-heading': '' }, page.title[locale]),
        ...(page.id === 'introduction' ? [] : [
          h('h2', { id: `${page.id}-section`, 'data-docs-heading': '' }, `${page.title[locale]} section`),
        ]),
      ]) },
      meta: { documentId: page.id, locale, title: page.title[locale] },
    }))),
  })
  await router.push('/zh-CN/components/button')
  const i18n = createI18n({ legacy: false, locale: 'zh-CN', messages: { 'en-US': enUS, 'zh-CN': zhCN } })
  host = mount(Layout, {
    attachTo: document.body,
    global: { plugins: [router, i18n], stubs: { transition: !realTransitions } },
  })
  await flushPromises()
  const wrapper = host
  const action = (label: string) => wrapper.get(`.mdv-app-bar__actions button[aria-label="${label}"]`)
  const item = (label: string) => {
    const control = wrapper.findAll('[data-mdv-menu-item]').find(control => control.text() === label)
    if (!control) throw new Error(`Missing menu item: ${label}`)
    return control
  }
  async function resize(nextDesktop: boolean) {
    viewport.matches = nextDesktop
    viewport.dispatchEvent(new Event('change'))
    await flushPromises()
  }
  return { wrapper, router, opened, action, item, resize }
}

test('compact actions group themes and languages in separate submenus and persist theme choices', async () => {
  const { wrapper, opened, action, item } = await fixture()
  expect(wrapper.findAll('.mdv-app-bar__actions > button')).toHaveLength(1)
  expect(wrapper.find('.mdv-app-bar__actions button[aria-label="语言"]').exists()).toBe(false)
  expect(item('跟随系统').attributes('aria-checked')).toBe('true')
  for (const [label, value] of [['浅色模式', 'light'], ['深色模式', 'dark'], ['跟随系统', 'system']] as const) {
    await action('更多选项').trigger('click')
    await flushPromises()
    expect(opened.size).toBe(1)
    const rootMenu = [...opened][0]!
    expect([...rootMenu.querySelectorAll('[data-mdv-menu-item]')]
      .filter(control => control.closest('[role="menu"]') === rootMenu)
      .map(control => control.textContent?.trim())).toEqual(['主题', '语言'])
    await item('主题').trigger('click')
    await flushPromises()
    expect(opened.size).toBe(2)
    const themePanelId = item('主题').attributes('aria-controls')
    expect(wrapper.get(`#${themePanelId} .mdv-menu__back`).text()).toBe('主题')
    await item(label).trigger('click')
    await flushPromises()
    expect(wrapper.attributes('data-mdv-theme')).toBe(value)
    expect(localStorage.getItem('mdv-docs-theme')).toBe(value)
    expect(item(label).attributes('aria-checked')).toBe('true')
    expect(action('更多选项').attributes('aria-expanded')).toBe('false')
    expect(opened.size).toBe(0)
  }
})

test('drawer sorts component names A-Z after introductory links and localizes their badges', async () => {
  const { wrapper, router } = await fixture(true)
  expect(wrapper.findAll('.mdv-navigation-drawer-group__heading')).toHaveLength(0)
  expect(wrapper.findAll('.mdv-navigation-drawer__label').map(label => label.text()))
    .toEqual(['简介', '安装与配置', '组件', 'AppBar', 'Autocomplete', 'Badge', 'BottomSheet', 'Button', 'ButtonGroup', 'Card', 'Carousel', 'Checkbox', 'Chip', 'CircularProgress', 'DatePicker', 'DateRangePicker', 'Dialog', 'Divider', 'Fab', 'FabMenu', 'FullscreenDialog', 'Icon', 'IconButton', 'LinearProgress', 'List', 'LoadingIndicator', 'Menu', 'NavigationBar', 'NavigationDrawer', 'NavigationRail', 'Radio', 'SearchBar', 'SegmentedButton', 'Select', 'SideSheet', 'Slider', 'Snackbar', 'SplitButton', 'Switch', 'Tabs', 'TextField', 'TimePicker', 'Toolbar', 'Tooltip'])
  expect(wrapper.findAll('.mdv-navigation-drawer__badge').map(badge => badge.text()))
    .toEqual(['应用栏', '自动补全', '徽标', '底部面板', '按钮', '按钮组', '卡片', '轮播', '复选框', '纸片', '圆形进度指示器', '日期选择器', '日期范围选择器', '对话框', '分割线', '浮动操作按钮', '浮动操作菜单', '全屏对话框', '图标', '图标按钮', '线性进度指示器', '列表', '加载指示器', '菜单', '导航栏', '导航抽屉', '导航轨', '单选框', '搜索栏', '分段按钮', '选择器', '侧边面板', '滑块', '消息提示', '拆分按钮', '开关', '标签页', '文本框', '时间选择器', '工具栏', '提示气泡'])
  expect(wrapper.get('.mdv-navigation-drawer-group__toggle').attributes('aria-expanded')).toBe('true')

  await wrapper.get('.mdv-navigation-drawer-group__toggle').trigger('click')
  await flushPromises()
  expect(wrapper.get('.mdv-navigation-drawer-group__toggle').attributes('aria-expanded')).toBe('false')
  await router.push('/zh-CN/getting-started/setup')
  await router.push('/zh-CN/components/checkbox')
  await flushPromises()
  expect(wrapper.get('.mdv-navigation-drawer-group__toggle').attributes('aria-expanded')).toBe('true')

  await router.push('/en-US/components/checkbox')
  await flushPromises()
  expect(wrapper.findAll('.mdv-navigation-drawer-group__heading')).toHaveLength(0)
  expect(wrapper.findAll('.mdv-navigation-drawer__label').map(label => label.text()))
    .toEqual(['Introduction', 'Setup', 'Components', 'AppBar', 'Autocomplete', 'Badge', 'BottomSheet', 'Button', 'ButtonGroup', 'Card', 'Carousel', 'Checkbox', 'Chip', 'CircularProgress', 'DatePicker', 'DateRangePicker', 'Dialog', 'Divider', 'Fab', 'FabMenu', 'FullscreenDialog', 'Icon', 'IconButton', 'LinearProgress', 'List', 'LoadingIndicator', 'Menu', 'NavigationBar', 'NavigationDrawer', 'NavigationRail', 'Radio', 'SearchBar', 'SegmentedButton', 'Select', 'SideSheet', 'Slider', 'Snackbar', 'SplitButton', 'Switch', 'Tabs', 'TextField', 'TimePicker', 'Toolbar', 'Tooltip'])
  expect(wrapper.findAll('.mdv-navigation-drawer__badge').map(badge => badge.text()))
    .toEqual(['App Bar', 'Autocomplete', 'Badge', 'Bottom Sheet', 'Button', 'Button Group', 'Card', 'Carousel', 'Checkbox', 'Chip', 'Circular Progress', 'Date Picker', 'Date Range Picker', 'Dialog', 'Divider', 'FAB', 'FAB Menu', 'Fullscreen Dialog', 'Icon', 'Icon Button', 'Linear Progress', 'List', 'Loading Indicator', 'Menu', 'Navigation Bar', 'Navigation Drawer', 'Navigation Rail', 'Radio', 'Search Bar', 'Segmented Button', 'Select', 'Side Sheet', 'Slider', 'Snackbar', 'Split Button', 'Switch', 'Tabs', 'Text Field', 'Time Picker', 'Toolbar', 'Tooltip'])
})

test('article changes replace the page while fragment and query updates preserve it', async () => {
  const { wrapper, router } = await fixture(true)
  const page = wrapper.get('.route-page').element

  await router.replace({ hash: '#api' })
  await flushPromises()
  expect(wrapper.get('.route-page').element).toBe(page)
  await router.replace({ query: { example: 'keep' } })
  await flushPromises()
  expect(wrapper.get('.route-page').element).toBe(page)

  await router.push('/zh-CN/getting-started/setup')
  await flushPromises()
  const setupPage = wrapper.get('.route-page').element
  expect(setupPage).not.toBe(page)
  await router.push('/en-US/getting-started/setup')
  await flushPromises()
  expect(wrapper.get('.route-page').element).not.toBe(setupPage)
})

test('each transitioning page keeps its own article and outline when entering or leaving Introduction', async () => {
  vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'clearTimeout'] })
  const { wrapper, router } = await fixture(true, true)
  const buttonPage = wrapper.get('.route-page')
  const buttonOutline = buttonPage.get('.docs-outline').element
  expect(buttonPage.get('.docs-outline__title').text()).toBe('按钮')
  const scrollRoot = wrapper.get<HTMLElement>('.docs-article-scroll').element
  scrollRoot.scrollTop = 360
  const scroll = vi.fn((options: ScrollToOptions) => {
    scrollRoot.scrollTop = options.top ?? scrollRoot.scrollTop
    scrollRoot.scrollLeft = options.left ?? scrollRoot.scrollLeft
  })
  Object.defineProperty(scrollRoot, 'scrollTo', { value: scroll })

  await router.push('/zh-CN/getting-started/introduction')
  await nextTick()
  expect(scroll).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
  expect(scrollRoot.scrollTop).toBe(0)
  expect((buttonPage.element as HTMLElement).style.insetBlockStart).toBe('-360px')
  expect(wrapper.findAll('.route-page')).toHaveLength(2)
  expect(buttonPage.attributes('inert')).toBeDefined()
  expect(buttonPage.get('.docs-outline').element).toBe(buttonOutline)
  expect(buttonPage.get('.docs-outline__title').text()).toBe('按钮')
  const introduction = wrapper.get('.route-page:not([inert])')
  expect(introduction.get('h1').text()).toBe('简介')
  expect(introduction.find('.docs-outline').exists()).toBe(false)
  await vi.advanceTimersByTimeAsync(800)
  expect(wrapper.findAll('.route-page')).toHaveLength(1)

  await router.push('/zh-CN/getting-started/setup')
  await nextTick()
  expect(introduction.attributes('inert')).toBeDefined()
  expect(introduction.find('.docs-outline').exists()).toBe(false)
  const setup = wrapper.get('.route-page:not([inert])')
  expect(setup.get('.docs-outline__title').text()).toBe('安装与配置')
  await vi.advanceTimersByTimeAsync(800)
  expect(wrapper.findAll('.route-page')).toHaveLength(1)
})

test('language opens a push submenu and changes locale on the same article', async () => {
  const { wrapper, router, opened, action, item } = await fixture()
  await action('更多选项').trigger('click')
  await flushPromises()
  await item('语言').trigger('click')
  await flushPromises()
  expect(opened.size).toBe(2)
  expect(item('语言').attributes('aria-expanded')).toBe('true')
  const languagePanelId = item('语言').attributes('aria-controls')
  expect(wrapper.get(`#${languagePanelId} .mdv-menu__back`).text()).toBe('语言')
  expect(item('简体中文').attributes('aria-checked')).toBe('true')
  await item('English').trigger('click')
  await flushPromises()
  expect(router.currentRoute.value.path).toBe('/en-US/components/button')
  expect(localStorage.getItem('mdv-docs-locale')).toBe('en-US')
  expect(item('English').attributes('aria-checked')).toBe('true')
  expect(action('More options').attributes('aria-expanded')).toBe('false')
  expect(opened.size).toBe(0)
})

test('changing breakpoints disposes open menu layers and preserves shared theme state', async () => {
  const { wrapper, opened, action, item, resize } = await fixture()
  await action('更多选项').trigger('click')
  await flushPromises()
  await item('主题').trigger('click')
  await flushPromises()
  await item('深色模式').trigger('click')
  await flushPromises()
  await action('更多选项').trigger('click')
  await flushPromises()
  await item('语言').trigger('click')
  await flushPromises()
  expect(opened.size).toBe(2)

  await resize(true)
  expect(opened.size).toBe(0)
  expect(wrapper.findAll('.mdv-app-bar__actions > button')).toHaveLength(2)
  expect(wrapper.find('.mdv-app-bar__actions button[aria-label="更多选项"]').exists()).toBe(false)
  await action('主题：深色模式').trigger('click')
  expect(wrapper.attributes('data-mdv-theme')).toBe('system')
  await action('语言').trigger('click')
  await flushPromises()
  expect(opened.size).toBe(1)

  await resize(false)
  expect(opened.size).toBe(0)
  expect(action('更多选项').attributes('aria-expanded')).toBe('false')
  expect(item('跟随系统').attributes('aria-checked')).toBe('true')
})
