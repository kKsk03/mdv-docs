<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, useTemplateRef, watch } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import brightnessAutoIcon from '@iconify-icons/material-symbols/brightness-auto'
import darkModeIcon from '@iconify-icons/material-symbols/dark-mode'
import lightModeIcon from '@iconify-icons/material-symbols/light-mode'
import menuIcon from '@iconify-icons/material-symbols/menu'
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
  type Locale,
} from '@/content/registry'
import { trackArticleHeadings } from '@/router/heading-tracker'

const themeModes = ['light', 'dark', 'system'] as const
type ThemeMode = (typeof themeModes)[number]
const themeStorageKey = 'mdv-docs-theme'

function isThemeMode(value: string | null): value is ThemeMode {
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
const article = useTemplateRef<HTMLElement>('article')
let stopHeadingTracking: (() => void) | undefined
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
watch(
  () => route.meta.documentId,
  (documentId) => {
    for (const item of navigationItems) {
      if ('pages' in item && item.pages.some((page) => page.id === documentId)) {
        expandedGroups.value[item.id] = true
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
  themeMode.value = nextThemeMode.value

  try {
    window.localStorage.setItem(themeStorageKey, themeMode.value)
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
}

onMounted(() => {
  if (article.value) stopHeadingTracking = trackArticleHeadings(article.value, router)
  syncViewport()
  desktopQuery?.addEventListener('change', syncViewport)
})

onBeforeUnmount(() => {
  stopHeadingTracking?.()
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
      width="280px"
    >
      <template #header>
        <h2 class="docs-drawer-brand">Material Design Vue</h2>
      </template>
      <template v-for="item in navigationItems" :key="item.id">
        <MdvNavigationDrawerGroup
          v-if="'pages' in item"
          v-model:expanded="expandedGroups[item.id]"
          :label="item.title[activeLocale]"
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
              :label="page.title[activeLocale]"
              :active="isActive"
              @click="navigateFromDrawer($event, navigate)"
            >
              <template #icon>
                <MdvIcon :icon="page.icon" />
              </template>
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
            :label="item.title[activeLocale]"
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
        </MdvAppBar>
      </template>

      <main id="main-content" class="min-h-full min-w-0 p-6 md:p-8">
        <article ref="article" class="docs-prose">
          <RouterView />
        </article>
      </main>
    </MdvAppBarScaffold>
  </div>
</template>

<style scoped>
.docs-drawer-brand {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.35;
}
</style>
