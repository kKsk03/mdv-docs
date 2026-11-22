<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useId, useTemplateRef, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { MdvButton, MdvIcon } from '@mdv-ui/mdv'
import arrowDropDownIcon from '@iconify-icons/material-symbols/arrow-drop-down'
import { readArticleOutline } from '@/content/article-headings'
import type { ArticleOutline } from '@/content/article-headings'

const props = defineProps<{
  article: HTMLElement | null
}>()

const route = useRoute()
const { t } = useI18n({ useScope: 'global' })
const contentId = `docs-outline-${useId()}`
const content = useTemplateRef<HTMLElement>('content')
const navigation = useTemplateRef<HTMLElement>('navigation')
const indicator = useTemplateRef<HTMLElement>('indicator')
const expanded = ref(false)
const wideQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  ? window.matchMedia('(min-width: 1280px)')
  : null
const isWide = ref(wideQuery?.matches ?? false)
const contentVisible = computed(() => isWide.value || expanded.value)
let navigationVersion = 0
let indicatorRect: { x: number; y: number; width: number; height: number } | undefined
const outline = shallowRef<ArticleOutline>({ title: null, items: [], sections: Object.create(null) })
const activeId = computed(() => {
  let id: string
  try {
    id = decodeURIComponent(route.hash.slice(1))
  } catch {
    id = ''
  }
  return outline.value.sections[id] ?? outline.value.items[0]?.id
})
const title = computed(() => outline.value.title?.text ?? route.meta.title)

function syncViewport() {
  isWide.value = wideQuery?.matches ?? false
}

onMounted(() => {
  syncViewport()
  wideQuery?.addEventListener('change', syncViewport)
})
onBeforeUnmount(() => {
  navigationVersion++
  wideQuery?.removeEventListener('change', syncViewport)
})

watch(() => props.article, (article, _, onCleanup) => {
  if (!article) {
    outline.value = { title: null, items: [], sections: Object.create(null) }
    return
  }

  function refresh() {
    outline.value = readArticleOutline(article!)
  }
  refresh()
  const observer = new MutationObserver(refresh)
  observer.observe(article, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['id', 'data-docs-heading', 'hidden', 'inert', 'aria-hidden'],
  })
  onCleanup(() => observer.disconnect())
}, { immediate: true, flush: 'post' })

watch(() => route.path, () => {
  navigationVersion++
  expanded.value = false
  if (navigation.value) navigation.value.scrollTop = 0
})

function updateIndicator(animate = false) {
  const root = navigation.value
  const element = indicator.value
  if (!root || !element) return
  const active = root.querySelector<HTMLElement>('[aria-current="location"]')
  if (!root.clientHeight || !active) {
    element.hidden = true
    root.removeAttribute('data-docs-indicator-ready')
    indicatorRect = undefined
    return
  }
  const bounds = root.getBoundingClientRect()
  const item = active.getBoundingClientRect()
  const target = {
    x: item.left - bounds.left + root.scrollLeft - root.clientLeft,
    y: item.top - bounds.top + root.scrollTop - root.clientTop,
    width: item.width,
    height: item.height,
  }
  // Renders and resize notifications must not interrupt an in-flight transition.
  if (!element.hidden && indicatorRect?.x === target.x && indicatorRect.y === target.y &&
    indicatorRect.width === target.width && indicatorRect.height === target.height) return
  element.style.transition = animate && indicatorRect ? '' : 'none'
  element.style.transform = `translate(${target.x}px, ${target.y}px)`
  element.style.width = `${target.width}px`
  element.style.height = `${target.height}px`
  element.hidden = false
  root.setAttribute('data-docs-indicator-ready', '')
  indicatorRect = target
}

watch([activeId, navigation, expanded, outline], ([id, root, , content], [previousId, previousRoot, , previousContent]) => {
  const animate = id !== previousId && root === previousRoot && content === previousContent
  if (root?.clientHeight) {
    const active = root.querySelector<HTMLElement>('[aria-current="location"]')
    if (active) {
      const bounds = root.getBoundingClientRect()
      const item = active.getBoundingClientRect()
      // Scroll only the outline, never the article or the outer scaffold.
      if (item.top < bounds.top) root.scrollTop += item.top - bounds.top
      else if (item.bottom > bounds.bottom) root.scrollTop += item.bottom - bounds.bottom
    }
  }
  updateIndicator(animate)
}, { flush: 'post' })

watch([navigation, outline], ([root], _, onCleanup) => {
  const view = root?.ownerDocument.defaultView
  if (!root || !view) return
  const resized = () => updateIndicator()
  const observer = view.ResizeObserver ? new view.ResizeObserver(resized) : undefined
  observer?.observe(root)
  root.querySelectorAll('a').forEach(link => observer?.observe(link))
  view.addEventListener('resize', resized)
  onCleanup(() => {
    observer?.disconnect()
    view.removeEventListener('resize', resized)
  })
}, { flush: 'post' })

function toggleOutline() {
  navigationVersion++
  expanded.value = !expanded.value
}

async function navigateToSection(event: MouseEvent, navigate: (event?: MouseEvent) => unknown) {
  if (event.defaultPrevented) return
  if (event.button || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || isWide.value || !expanded.value) {
    void navigate(event)
    return
  }
  event.preventDefault()
  const version = ++navigationVersion
  expanded.value = false
  await nextTick()
  // Finish changing the article's position before the router measures the target.
  const animations = content.value?.getAnimations?.() ?? []
  await Promise.all(animations.map(animation => animation.finished.catch(() => {})))
  if (version === navigationVersion && content.value) void navigate()
}
</script>

<template>
  <aside v-if="outline.items.length" class="docs-outline">
    <div class="docs-outline__heading">
      <p class="docs-outline__label">{{ t('article.onThisPage') }}</p>
      <p v-if="title" class="docs-outline__title">{{ title }}</p>
    </div>
    <MdvButton
      class="docs-outline__toggle"
      variant="text"
      shape="square"
      full-width
      :aria-expanded="expanded"
      :aria-controls="contentId"
      @click="toggleOutline"
    >
      {{ t('article.onThisPage') }}
      <template #trailing>
        <MdvIcon
          :icon="arrowDropDownIcon"
          class="docs-outline__chevron"
          :class="{ 'docs-outline__chevron--expanded': expanded }"
        />
      </template>
    </MdvButton>
    <div
      ref="content"
      class="docs-outline__content"
      :class="{ 'docs-outline__content--expanded': expanded }"
    >
      <div class="docs-outline__clip">
        <nav
          :id="contentId"
          ref="navigation"
          class="docs-outline__navigation"
          :aria-label="t('article.onThisPage')"
          :inert="!contentVisible ? true : undefined"
          :aria-hidden="!contentVisible ? true : undefined"
        >
          <span ref="indicator" class="docs-outline__indicator" hidden aria-hidden="true" />
          <ul class="docs-outline__list">
            <li v-for="item in outline.items" :key="item.id">
              <RouterLink
                :to="{ path: route.path, query: route.query, hash: `#${item.id}` }"
                custom
                v-slot="{ href, navigate }"
              >
                <MdvButton
                  :href="href"
                  variant="text"
                  full-width
                  class="docs-outline__link"
                  :class="{
                    'docs-outline__link--active': activeId === item.id,
                    'docs-outline__link--ancestor': item.children.some(child => child.id === activeId),
                  }"
                  :aria-current="activeId === item.id ? 'location' : undefined"
                  @click="navigateToSection($event, navigate)"
                >{{ item.text }}</MdvButton>
              </RouterLink>
              <ul v-if="item.children.length" class="docs-outline__list docs-outline__sublist">
                <li v-for="child in item.children" :key="child.id">
                  <RouterLink
                    :to="{ path: route.path, query: route.query, hash: `#${child.id}` }"
                    custom
                    v-slot="{ href, navigate }"
                  >
                    <MdvButton
                      :href="href"
                      variant="text"
                      full-width
                      class="docs-outline__link"
                      :class="{ 'docs-outline__link--active': activeId === child.id }"
                      :aria-current="activeId === child.id ? 'location' : undefined"
                      @click="navigateToSection($event, navigate)"
                    >{{ child.text }}</MdvButton>
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.docs-outline {
  min-inline-size: 0;
  overflow: hidden;
  border: 1px solid var(--mdv-sys-color-outline-variant);
  border-radius: var(--mdv-sys-shape-corner-large);
  background-color: var(--mdv-sys-color-surface);
}

.docs-outline__heading {
  display: none;
}

.docs-outline__toggle {
  min-block-size: 48px;
  color: var(--mdv-sys-color-on-surface);
}

.docs-outline__toggle :deep(.mdv-button__content) {
  inline-size: 100%;
  justify-content: space-between;
}

.docs-outline__chevron {
  transition: transform var(--mdv-sys-motion-duration-medium-2) var(--mdv-sys-motion-easing-standard);
}

.docs-outline__chevron--expanded {
  transform: rotate(180deg);
}

.docs-outline__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--mdv-sys-motion-duration-medium-2)
    var(--mdv-sys-motion-easing-standard);
}

.docs-outline__content--expanded {
  grid-template-rows: 1fr;
}

.docs-outline__clip {
  min-block-size: 0;
  min-inline-size: 0;
  overflow: hidden;
}

.docs-outline__navigation {
  position: relative;
  max-block-size: min(50dvh, 24rem);
  min-block-size: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  border-block-start: 1px solid var(--mdv-sys-color-outline-variant);
  padding: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: var(--mdv-sys-color-outline-variant) transparent;
}

.docs-outline__list {
  display: grid;
  gap: 0.125rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.docs-outline__sublist {
  margin-block: 0.25rem 0.5rem;
  margin-inline-start: 0.75rem;
}

.docs-outline__link {
  --mdv-button-color: var(--mdv-sys-color-on-surface-variant);

  min-block-size: 36px;
  justify-content: flex-start;

  border: 1px solid transparent;
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.4;
  text-align: start;
}

.docs-outline__link--ancestor {
  --mdv-button-color: var(--mdv-sys-color-on-surface);
  font-weight: 500;
}

.docs-outline__link--active {
  --mdv-button-color: var(--mdv-sys-color-primary);

  border-color: var(--mdv-sys-color-outline);
  font-weight: 600;
}

.docs-outline__navigation[data-docs-indicator-ready] .docs-outline__link--active {
  border-color: transparent;
}

.docs-outline__indicator {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  border: 1px solid var(--mdv-sys-color-outline);
  border-radius: var(--mdv-sys-shape-corner-full);
  pointer-events: none;
  transition:
    transform var(--mdv-sys-motion-duration-long-2) var(--mdv-sys-motion-easing-standard),
    width var(--mdv-sys-motion-duration-long-2) var(--mdv-sys-motion-easing-standard),
    height var(--mdv-sys-motion-duration-long-2) var(--mdv-sys-motion-easing-standard);
}

.docs-outline__indicator[hidden] {
  display: none;
}

@media (min-width: 1280px) {
  .docs-outline {
    position: sticky;
    inset-block-start: 1.5rem;
    display: flex;
    max-block-size: calc(100dvh - 7rem);
    flex-direction: column;
    border: 0;
    border-radius: 0;
    background-color: transparent;
  }

  .docs-outline__heading {
    display: block;
    flex: none;
    padding-inline: 1rem;
  }

  .docs-outline__label {
    margin: 0 0 0.5rem;
    color: var(--mdv-sys-color-on-surface-variant);
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.5;
  }

  .docs-outline__title {
    margin: 0 0 1rem;
    color: var(--mdv-sys-color-on-surface);
    font-size: 1.5rem;
    font-weight: 500;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }

  .docs-outline__toggle {
    display: none;
  }

  .docs-outline__content,
  .docs-outline__clip {
    display: contents;
  }

  .docs-outline__navigation {
    display: block;
    max-block-size: none;
    border: 0;
    padding: 0.25rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .docs-outline__content,
  .docs-outline__chevron,
  .docs-outline__indicator {
    transition: none;
  }
}
</style>
