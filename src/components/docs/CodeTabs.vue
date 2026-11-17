<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, onUpdated, ref, useId, useTemplateRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { createTabsIndicator, measureTabsIndicator } from './code-tabs-indicator'

// Text-only adaptation of MDV Tabs; see THIRD_PARTY_NOTICES.md.
const props = defineProps<{
  labels: string[]
}>()

const { t } = useI18n({ useScope: 'global' })
const groupId = `docs-code-tabs-${useId()}`
const root = useTemplateRef<HTMLElement>('root')
const viewport = useTemplateRef<HTMLDivElement>('viewport')
const row = useTemplateRef<HTMLDivElement>('row')
const indicator = useTemplateRef<HTMLSpanElement>('indicator')
const active = ref(0)
const ripple = ref<{
  tab: number
  x: number
  y: number
  size: number
  key: number
  released: boolean
} | null>(null)

const motion = createTabsIndicator({ element: () => indicator.value, row: () => row.value })
let mounted = false
let queued = false
let animateQueued = false
let rippleKey = 0
let view: typeof window | null = null
let resizeObserver: ResizeObserver | undefined
let motionQuery: MediaQueryList | undefined

function tabs() {
  return Array.from(row.value?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [])
}

function reveal(tab: HTMLButtonElement | undefined) {
  if (!tab || !viewport.value) return
  const bounds = tab.getBoundingClientRect()
  const clip = viewport.value.getBoundingClientRect()
  if (clip.width <= 0) return
  const distance =
    bounds.left < clip.left
      ? bounds.left - clip.left
      : bounds.right > clip.right
        ? bounds.right - clip.right
        : 0
  if (distance) viewport.value.scrollLeft += distance
}

function schedule(animate = false) {
  if (!mounted) return
  animateQueued ||= animate
  if (queued) return
  queued = true
  void nextTick(() => {
    queued = false
    const play = animateQueued
    animateQueued = false
    if (!mounted) return
    const tab = tabs()[active.value]
    const label = tab?.querySelector<HTMLElement>('.docs-code-tabs__label')
    motion.moveTo(
      row.value && tab && label ? measureTabsIndicator(row.value, tab, label, true) : null,
      play,
    )
  })
}

function select(index: number) {
  if (index < 0 || index >= props.labels.length) return
  if (active.value !== index) {
    active.value = index
    schedule(true)
  }
  reveal(tabs()[index])
}

function handleKeydown(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !root.value)
    return
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
  const buttons = tabs()
  const index = buttons.indexOf(event.target as HTMLButtonElement)
  if (index < 0) return
  const rtl = view?.getComputedStyle(root.value).direction === 'rtl'
  const direction = (event.key === 'ArrowRight') !== rtl ? 1 : -1
  const next =
    event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? buttons.length - 1
        : (index + direction + buttons.length) % buttons.length
  event.preventDefault()
  buttons[next]?.focus({ preventScroll: true })
}

function showRipple(index: number, event: PointerEvent | KeyboardEvent) {
  if (event.defaultPrevented || motionQuery?.matches) return
  const keyboard = event.type === 'keydown'
  if (keyboard) {
    const { key, repeat } = event as KeyboardEvent
    if (repeat || (key !== 'Enter' && key !== ' ')) return
  } else {
    const pointer = event as PointerEvent
    if (pointer.button !== 0 || pointer.isPrimary === false) return
  }
  const bounds = (event.currentTarget as HTMLButtonElement).getBoundingClientRect()
  const x = keyboard
    ? bounds.width / 2
    : Math.max(0, Math.min(bounds.width, (event as PointerEvent).clientX - bounds.left))
  const y = keyboard
    ? bounds.height / 2
    : Math.max(0, Math.min(bounds.height, (event as PointerEvent).clientY - bounds.top))
  const size = Math.hypot(Math.max(x, bounds.width - x), Math.max(y, bounds.height - y)) * 2
  ripple.value = { tab: index, x, y, size, key: ++rippleKey, released: false }
}

function releaseRipple(event: Event) {
  if (event.type === 'keyup' && !['Enter', ' '].includes((event as KeyboardEvent).key)) return
  if (ripple.value) ripple.value.released = true
}

function finishRipple(event: AnimationEvent) {
  if (event.animationName.startsWith('docs-code-tab-ripple-fade')) ripple.value = null
}

function observeSizes() {
  resizeObserver?.disconnect()
  for (const element of [viewport.value, row.value, ...tabs()]) {
    if (element) resizeObserver?.observe(element)
  }
}

function layoutChanged() {
  schedule()
}

function motionPreferenceChanged() {
  ripple.value = null
  motion.finish()
  schedule()
}

watch(active, () => schedule(true))
watch(
  () => props.labels.length,
  (count) => {
    const previousPanel = root.value?.ownerDocument.getElementById(`${groupId}-panel-${active.value}`)
    const focusInPanel = previousPanel?.contains(root.value?.ownerDocument.activeElement ?? null)
    active.value = Math.max(0, Math.min(active.value, count - 1))
    if (focusInPanel) void nextTick(() => tabs()[active.value]?.focus({ preventScroll: true }))
  },
)

onMounted(() => {
  mounted = true
  view = root.value?.ownerDocument.defaultView ?? null
  if (view?.ResizeObserver) resizeObserver = new view.ResizeObserver(layoutChanged)
  motionQuery = view?.matchMedia?.('(prefers-reduced-motion: reduce)')
  motionQuery?.addEventListener?.('change', motionPreferenceChanged)
  view?.addEventListener('resize', layoutChanged)
  root.value?.ownerDocument.fonts?.addEventListener('loadingdone', layoutChanged)
  void root.value?.ownerDocument.fonts?.ready.then(() => schedule())
  observeSizes()
  schedule()
})

onUpdated(() => {
  observeSizes()
  schedule()
})

onBeforeUnmount(() => {
  mounted = false
  resizeObserver?.disconnect()
  motionQuery?.removeEventListener?.('change', motionPreferenceChanged)
  view?.removeEventListener('resize', layoutChanged)
  root.value?.ownerDocument.fonts?.removeEventListener('loadingdone', layoutChanged)
  motion.reset()
})
</script>

<template>
  <div ref="root" class="docs-code-tabs">
    <div ref="viewport" class="docs-code-tabs__viewport">
      <div
        ref="row"
        role="tablist"
        class="docs-code-tabs__items"
        aria-orientation="horizontal"
        :aria-label="t('code.tabs')"
        @keydown="handleKeydown"
      >
        <button
          v-for="(label, index) in labels"
          :id="`${groupId}-tab-${index}`"
          :key="index"
          type="button"
          role="tab"
          class="docs-code-tabs__tab"
          :class="{ 'docs-code-tabs__tab--active': active === index }"
          :aria-selected="active === index"
          :aria-controls="`${groupId}-panel-${index}`"
          :tabindex="active === index ? 0 : -1"
          @click="select(index)"
          @focus="select(index)"
          @pointerdown="showRipple(index, $event)"
          @pointerup="releaseRipple"
          @pointerleave="releaseRipple"
          @pointercancel="releaseRipple"
          @keydown="showRipple(index, $event)"
          @keyup="releaseRipple"
          @blur="releaseRipple"
        >
          <span class="docs-code-tabs__label">
            {{ label }}
            <span v-if="active === index" class="docs-code-tabs__fallback" aria-hidden="true" />
          </span>
          <span
            v-if="ripple?.tab === index"
            :key="ripple.key"
            class="docs-code-tabs__ripple"
            :class="{ 'docs-code-tabs__ripple--released': ripple.released }"
            aria-hidden="true"
            @animationend="finishRipple"
          >
            <span
              class="docs-code-tabs__ripple-wave"
              :style="{
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
              }"
            />
          </span>
        </button>
        <span ref="indicator" class="docs-code-tabs__indicator" hidden aria-hidden="true" />
      </div>
    </div>
    <div
      v-for="(_, index) in labels"
      :id="`${groupId}-panel-${index}`"
      :key="index"
      role="tabpanel"
      class="docs-code-tabs__panel"
      :aria-labelledby="`${groupId}-tab-${index}`"
      :hidden="active !== index"
      :inert="active !== index ? true : undefined"
      tabindex="0"
    >
      <slot :name="`tab-${index}`" />
    </div>
  </div>
</template>

<style scoped>
.docs-code-tabs {
  min-inline-size: 0;
  margin-block: 1rem;
  overflow: hidden;
  border-radius: var(--mdv-sys-shape-corner-medium);
  background-color: var(--mdv-sys-color-surface-container-highest);
  color: var(--mdv-sys-color-on-surface);
}

.docs-code-tabs__viewport {
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  scrollbar-width: none;
}

.docs-code-tabs__viewport::-webkit-scrollbar {
  display: none;
}

.docs-code-tabs__items {
  position: relative;
  display: flex;
  inline-size: max-content;
  min-inline-size: 100%;
  padding-inline: 0.75rem;
  background: linear-gradient(
      var(--mdv-sys-color-outline-variant),
      var(--mdv-sys-color-outline-variant)
    )
    bottom / 100% 1px no-repeat;
}

.docs-code-tabs__tab {
  --docs-code-tab-state-color: var(--mdv-sys-color-on-surface-variant);
  position: relative;
  display: inline-flex;
  min-inline-size: 48px;
  min-block-size: 48px;
  flex: none;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 8px 16px;
  background: transparent;
  color: var(--mdv-sys-color-on-surface-variant);
  font-family: var(--mdv-sys-typescale-font-family);
  font-size: var(--mdv-sys-typescale-title-small-size);
  font-weight: var(--mdv-sys-typescale-title-small-weight);
  line-height: var(--mdv-sys-typescale-title-small-line-height);
  letter-spacing: var(--mdv-sys-typescale-title-small-tracking);
  cursor: pointer;
  appearance: none;
  -webkit-tap-highlight-color: transparent;
}

.docs-code-tabs__tab--active {
  --docs-code-tab-state-color: var(--mdv-sys-color-primary);
  color: var(--mdv-sys-color-primary);
}

.docs-code-tabs__tab::before {
  position: absolute;
  inset: 0;
  background: var(--docs-code-tab-state-color);
  content: '';
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--mdv-sys-motion-duration-short-2) var(--mdv-sys-motion-easing-standard);
}

@media (hover: hover) {
  .docs-code-tabs__tab:hover::before {
    opacity: 0.08;
  }
}

.docs-code-tabs__tab:active::before,
.docs-code-tabs__tab:focus-visible::before {
  opacity: 0.1;
}

.docs-code-tabs__tab:focus-visible,
.docs-code-tabs__panel:focus-visible {
  outline: 3px solid var(--mdv-sys-color-secondary);
  outline-offset: -3px;
}

.docs-code-tabs__label {
  position: relative;
  display: inline-flex;
  align-self: stretch;
  align-items: center;
  white-space: nowrap;
  pointer-events: none;
}

.docs-code-tabs__indicator,
.docs-code-tabs__fallback {
  position: absolute;
  inset-block-end: 0;
  z-index: 1;
  block-size: 3px;
  border-radius: 3px 3px 0 0;
  background: var(--mdv-sys-color-primary);
  pointer-events: none;
}

.docs-code-tabs__indicator {
  left: 0;
}

.docs-code-tabs__fallback {
  inset-block-end: -8px;
  left: 50%;
  inline-size: max(24px, calc(100% - 4px));
  transform: translateX(-50%);
}

.docs-code-tabs__items[data-docs-indicator-ready] .docs-code-tabs__fallback {
  visibility: hidden;
}

.docs-code-tabs__indicator[hidden],
.docs-code-tabs__panel[hidden] {
  display: none;
}

.docs-code-tabs__ripple {
  position: absolute;
  inset: 0;
  overflow: hidden;
  color: var(--docs-code-tab-state-color);
  pointer-events: none;
}

.docs-code-tabs__ripple-wave {
  position: absolute;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.1;
  transform: translate(-50%, -50%) scale(0);
  animation: docs-code-tab-ripple 450ms var(--mdv-sys-motion-easing-standard) forwards;
}

.docs-code-tabs__ripple--released {
  animation: docs-code-tab-ripple-fade 150ms linear forwards;
}

@keyframes docs-code-tab-ripple {
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes docs-code-tab-ripple-fade {
  to {
    opacity: 0;
  }
}

.docs-code-tabs__panel {
  min-inline-size: 0;
}

.docs-code-tabs :deep(.docs-code-block) {
  margin: 0;
  border-radius: 0;
  background-color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  .docs-code-tabs__tab::before {
    transition: none;
  }

  .docs-code-tabs__ripple {
    display: none;
  }
}

@media (forced-colors: active) {
  .docs-code-tabs {
    outline: 1px solid CanvasText;
    background-color: Canvas;
    color: CanvasText;
  }

  .docs-code-tabs__tab {
    color: ButtonText;
  }

  .docs-code-tabs__indicator,
  .docs-code-tabs__fallback {
    background: Highlight;
    forced-color-adjust: none;
  }
}
</style>
