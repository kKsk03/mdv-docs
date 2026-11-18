<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import brightnessAutoIcon from '@iconify-icons/material-symbols/brightness-auto'
import darkModeIcon from '@iconify-icons/material-symbols/dark-mode'
import lightModeIcon from '@iconify-icons/material-symbols/light-mode'
import menuIcon from '@iconify-icons/material-symbols/menu'
import moreVertIcon from '@iconify-icons/material-symbols/more-vert'
import translateIcon from '@iconify-icons/material-symbols/translate'
import {
  MdvAppBar,
  MdvAppBarScaffold,
  MdvIcon,
  MdvIconButton,
  MdvModalNavigationDrawer,
  MdvMenu,
  MdvMenuGroup,
  MdvMenuItem,
  MdvNavigationDrawer,
  MdvNavigationDrawerGroup,
  MdvNavigationDrawerItem,
  MdvTooltip,
} from '@mdv-ui/mdv'
import {
  defaultDocumentId,
  getRouteName,
  isLocale,
  navigationItems,
  type DocumentationPage,
  type NavigationGroup,
  type NavigationItem,
  type Locale,
} from '@/content/registry'
import ArticlePage from '@/components/docs/ArticlePage.vue'

const themeModes = ['light', 'dark', 'system'] as const
type ThemeMode = (typeof themeModes)[number]
const themeStorageKey = 'mdv-docs-theme'

function isThemeMode(value: unknown): value is ThemeMode {
  return value === 'light' || value === 'dark' || value === 'system'
}

function getInitialThemeMode(): ThemeMode {
  try {
    const savedTheme = window.localStorage.getItem(themeStorageKey)
    return isThemeMode(savedTheme) ? savedTheme : 'system'
  } catch {
    return 'system'
  }
}

const route = useRoute()
const router = useRouter()
const { locale, t } = useI18n({ useScope: 'global' })
const themeMode = ref<ThemeMode>(getInitialThemeMode())
const desktopQuery =
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(min-width: 768px)')
    : null
const isDesktop = ref(desktopQuery?.matches ?? false)
const mobileNavigationOpen = ref(false)
const expandedGroups = ref<Record<string, boolean>>({})
const drawerComponent = computed(() =>
  isDesktop.value ? MdvNavigationDrawer : MdvModalNavigationDrawer,
)
const activeLocale = computed<Locale>(() =>
  isLocale(route.meta.locale)
    ? route.meta.locale
    : isLocale(locale.value)
      ? locale.value
      : 'en-US',
)
const navigationOpen = computed({
  get: () => isDesktop.value || mobileNavigationOpen.value,
  set: (open: boolean) => {
    if (!isDesktop.value) mobileNavigationOpen.value = open
  },
})
const pageTitle = computed(() =>
  typeof route.meta.title === 'string' ? route.meta.title : t('navigation.introduction'),
)
const themeIcons = {
  light: lightModeIcon,
  dark: darkModeIcon,
  system: brightnessAutoIcon,
}
const themeLabels = computed(() => ({
  light: t('theme.modes.light'),
  dark: t('theme.modes.dark'),
  system: t('theme.modes.system'),
}))
const themeModeLabel = computed(() => themeLabels.value[themeMode.value])
const nextThemeMode = computed<ThemeMode>(() => {
  const currentIndex = themeModes.indexOf(themeMode.value)
  return themeModes[(currentIndex + 1) % themeModes.length]!
})
const themeButtonLabel = computed(() => t('theme.button', { mode: themeModeLabel.value }))

function isNavigationGroup(item: NavigationItem): item is NavigationGroup {
  return 'pages' in item
}

function pageLabel(page: DocumentationPage) {
  return page.navigationLabel?.[activeLocale.value] ?? page.title[activeLocale.value]
}

watch(
  () => route.meta.documentId,
  (documentId) => {
    for (const group of navigationItems.filter(isNavigationGroup)) {
      if (group.pages.some((page) => page.id === documentId)) {
        expandedGroups.value[group.id] = true
      }
    }
  },
  { immediate: true },
)

watch(
  () => route.meta.locale,
  (nextLocale) => {
    if (!isLocale(nextLocale)) return
    locale.value = nextLocale
    if (typeof document !== 'undefined') document.documentElement.lang = nextLocale
  },
  { immediate: true },
)

watch(
  pageTitle,
  (title) => {
    if (typeof document !== 'undefined') document.title = `${title} | MDV UI`
  },
  { immediate: true },
)

function syncViewport() {
  if (!desktopQuery) return
  isDesktop.value = desktopQuery.matches
  if (isDesktop.value) mobileNavigationOpen.value = false
}

function navigateFromDrawer(event: MouseEvent, navigate: (event: MouseEvent) => void) {
  navigate(event)
  if (!isDesktop.value) mobileNavigationOpen.value = false
}

function prepareLeavingPage(page: Element) {
  const bounds = page.getBoundingClientRect()
  const element = page as HTMLElement
  element.style.inlineSize = `${bounds.width}px`
  element.style.blockSize = `${bounds.height}px`
  const root = page.closest<HTMLElement>('.docs-article-scroll')
  if (root && (root.scrollTop || root.scrollLeft)) {
    // Preserve the outgoing reading position while the incoming page starts at the top.
    element.style.insetBlockStart = `${-root.scrollTop}px`
    root.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }
  page.setAttribute('inert', '')
  page.setAttribute('aria-hidden', 'true')
}

function changeLocale(value: unknown) {
  if (!isLocale(value)) return

  try {
    window.localStorage.setItem('mdv-docs-locale', value)
  } catch {
    // Language switching still works when browser storage is unavailable.
  }

  const documentId =
    typeof route.meta.documentId === 'string' ? route.meta.documentId : defaultDocumentId
  void router.push({ name: getRouteName(value, documentId) })
}

function cycleTheme() {
  changeTheme(nextThemeMode.value)
}

function changeTheme(value: unknown) {
  if (!isThemeMode(value)) return
  themeMode.value = value

  try {
    window.localStorage.setItem(themeStorageKey, themeMode.value)
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
}

onMounted(() => {
  syncViewport()
  desktopQuery?.addEventListener('change', syncViewport)
})

onBeforeUnmount(() => {
  desktopQuery?.removeEventListener('change', syncViewport)
})
</script>

<template>
  <div
    class="flex h-dvh min-w-0 overflow-hidden bg-mdv-surface-container-low text-mdv-on-surface"
    :data-mdv-theme="themeMode"
  >
    <component
      :is="drawerComponent"
      id="docs-navigation"
      v-model="navigationOpen"
      title="Material Design Vue"
      width="360px"
    >
      <template #header>
        <h2 class="docs-drawer-brand">Material Design Vue</h2>
      </template>
      <template v-for="item in navigationItems" :key="item.id">
        <MdvNavigationDrawerGroup
          v-if="isNavigationGroup(item)"
          v-model:expanded="expandedGroups[item.id]"
          :label="item.title[activeLocale]"
          :divider="item.divider ?? false"
          collapsible
        >
          <template #icon>
            <MdvIcon :icon="item.icon" />
          </template>
          <RouterLink
            v-for="page in item.pages"
            :key="page.id"
            :to="{ name: getRouteName(activeLocale, page.id) }"
            custom
            v-slot="{ href, navigate, isActive }"
          >
            <MdvNavigationDrawerItem
              :href="href"
              :label="pageLabel(page)"
              :active="isActive"
              @click="navigateFromDrawer($event, navigate)"
            >
              <template #icon>
                <MdvIcon :icon="page.icon" />
              </template>
              <template #badge>{{ page.title[activeLocale] }}</template>
            </MdvNavigationDrawerItem>
          </RouterLink>
        </MdvNavigationDrawerGroup>
        <RouterLink
          v-else
          :to="{ name: getRouteName(activeLocale, item.id) }"
          custom
          v-slot="{ href, navigate, isActive }"
        >
          <MdvNavigationDrawerItem
            :href="href"
            :label="pageLabel(item)"
            :active="isActive"
            @click="navigateFromDrawer($event, navigate)"
          >
            <template #icon>
              <MdvIcon :icon="item.icon" />
            </template>
          </MdvNavigationDrawerItem>
        </RouterLink>
      </template>
    </component>

    <MdvAppBarScaffold
      class="min-w-0 flex-1"
      :content-attrs="{ class: 'docs-article-scroll', 'aria-label': t('navigation.content') }"
    >
      <template #appbar>
        <MdvAppBar
          :title="pageTitle"
          variant="small"
          scroll-behavior="pinned"
          :heading-level="2"
        >
          <template #leading>
            <MdvIconButton
              v-if="!isDesktop"
              variant="standard"
              :aria-label="navigationOpen ? t('navigation.close') : t('navigation.open')"
              aria-controls="docs-navigation"
              :aria-expanded="navigationOpen"
              @click="mobileNavigationOpen = !mobileNavigationOpen"
            >
              <MdvIcon :icon="menuIcon" />
            </MdvIconButton>
          </template>
          <template #actions>
            <template v-if="isDesktop">
              <MdvTooltip :text="themeModeLabel" placement="bottom">
                <template #trigger="{ triggerProps }">
                  <MdvIconButton
                    v-bind="triggerProps"
                    variant="standard"
                    :aria-label="themeButtonLabel"
                    @click="cycleTheme"
                  >
                    <MdvIcon :icon="themeIcons[themeMode]" />
                  </MdvIconButton>
                </template>
              </MdvTooltip>
              <MdvMenu placement="bottom-end">
                <template #trigger="{ triggerProps }">
                  <MdvIconButton
                    v-bind="triggerProps"
                    variant="standard"
                    :aria-label="t('language.label')"
                    :title="t('language.label')"
                  >
                    <MdvIcon :icon="translateIcon" />
                  </MdvIconButton>
                </template>
                <MdvMenuGroup
                  selection-mode="single"
                  :model-value="activeLocale"
                  :label="t('language.label')"
                  @update:model-value="changeLocale"
                >
                  <MdvMenuItem value="en-US" :label="t('language.english')" />
                  <MdvMenuItem value="zh-CN" :label="t('language.chinese')" />
                </MdvMenuGroup>
              </MdvMenu>
            </template>
            <MdvMenu v-else placement="bottom-end" submenu-mode="push">
              <template #trigger="{ triggerProps }">
                <MdvIconButton
                  v-bind="triggerProps"
                  variant="standard"
                  :aria-label="t('appbar.more')"
                >
                  <MdvIcon :icon="moreVertIcon" />
                </MdvIconButton>
              </template>
              <MdvMenuItem :label="t('theme.label')" :icon="themeIcons[themeMode]">
                <template #children>
                  <MdvMenuGroup
                    selection-mode="single"
                    :model-value="themeMode"
                    :aria-label="t('theme.label')"
                    @update:model-value="changeTheme"
                  >
                    <MdvMenuItem
                      v-for="mode in themeModes"
                      :key="mode"
                      :value="mode"
                      :label="themeLabels[mode]"
                      :icon="themeIcons[mode]"
                    />
                  </MdvMenuGroup>
                </template>
              </MdvMenuItem>
              <MdvMenuItem :label="t('language.label')" :icon="translateIcon">
                <template #children>
                  <MdvMenuGroup
                    selection-mode="single"
                    :model-value="activeLocale"
                    :aria-label="t('language.label')"
                    @update:model-value="changeLocale"
                  >
                    <MdvMenuItem value="en-US" :label="t('language.english')" />
                    <MdvMenuItem value="zh-CN" :label="t('language.chinese')" />
                  </MdvMenuGroup>
                </template>
              </MdvMenuItem>
            </MdvMenu>
          </template>
        </MdvAppBar>
      </template>

      <main id="main-content" class="route-page-container">
        <RouterView v-slot="{ Component, route: currentRoute }">
          <Transition name="route-page" @before-leave="prepareLeavingPage">
            <ArticlePage :key="currentRoute.path" class="route-page">
              <component :is="Component" />
            </ArticlePage>
          </Transition>
        </RouterView>
      </main>
    </MdvAppBarScaffold>
  </div>
</template>

<style scoped>
.route-page-container {
  position: relative;
  isolation: isolate;
  min-inline-size: 0;
}

.route-page {
  position: relative;
  min-inline-size: 0;
  inline-size: 100%;
}

.route-page-enter-active,
.route-page-leave-active {
  transition-property: transform, opacity;
  transition-duration: 0.7s;
  transition-timing-function: linear(
    0 0%,
    0 1.8%,
    0.01 3.6%,
    0.03 6.35%,
    0.07 9.1%,
    0.13 11.4%,
    0.19 13.4%,
    0.27 15%,
    0.34 16.1%,
    0.54 18.35%,
    0.66 20.6%,
    0.72 22.4%,
    0.77 24.6%,
    0.81 27.3%,
    0.85 30.4%,
    0.88 35.1%,
    0.92 40.6%,
    0.94 47.2%,
    0.96 55%,
    0.98 64%,
    0.99 74.4%,
    1 86.4%,
    1 100%
  );
  will-change: transform, opacity;
}

.route-page-enter-active {
  z-index: 1;
}

.route-page-leave-active {
  position: absolute;
  z-index: 0;
  inset: 0;
  overflow: clip;
  pointer-events: none;
}

.route-page-enter-from,
.route-page-leave-to {
  transform: translateX(70%);
  opacity: 0;
}

.route-page-enter-to,
.route-page-leave-from {
  transform: translateX(0);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .route-page-enter-active,
  .route-page-leave-active {
    transition: none;
  }
}

.docs-drawer-brand {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.35;
}
</style>
