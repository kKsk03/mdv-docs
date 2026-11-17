<script setup lang="ts">
import { computed, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import copyIcon from '@iconify-icons/material-symbols/content-paste'
import copiedIcon from '@iconify-icons/material-symbols/assignment-turned-in-outline'

defineProps<{
  language: string
  lineCount?: number
}>()

const { t } = useI18n({ useScope: 'global' })
const root = useTemplateRef<HTMLDivElement>('root')
const copying = ref(false)
const copyResult = ref<'copied' | 'failed' | null>(null)
const feedback = computed(() =>
  copyResult.value === 'copied'
    ? t('code.copied')
    : copyResult.value === 'failed'
      ? t('code.copyFailed')
      : '',
)
let feedbackTimer: ReturnType<typeof setTimeout> | undefined
let disposed = false

async function copyCode() {
  if (copying.value) return
  const code = root.value?.querySelector('pre code')
  if (!code) return

  clearTimeout(feedbackTimer)
  copyResult.value = null
  copying.value = true

  try {
    const clipboard = root.value?.ownerDocument.defaultView?.navigator.clipboard
    if (!clipboard?.writeText) throw new Error('Clipboard writing is unavailable')
    await clipboard.writeText(code.textContent ?? '')
    if (!disposed) copyResult.value = 'copied'
  } catch {
    if (!disposed) copyResult.value = 'failed'
  } finally {
    if (!disposed) {
      copying.value = false
      feedbackTimer = setTimeout(() => { copyResult.value = null }, 2000)
    }
  }
}

onBeforeUnmount(() => {
  disposed = true
  clearTimeout(feedbackTimer)
})
</script>

<template>
  <div
    ref="root"
    class="docs-code-block"
    :class="{ 'docs-code-block--numbered': lineCount !== undefined }"
  >
    <div
      class="docs-code-block__tools"
      :class="{ 'docs-code-block__tools--active': copying || copyResult !== null }"
    >
      <span class="docs-code-block__language" aria-hidden="true">{{ language }}</span>
      <div class="docs-code-block__actions">
        <span
          class="docs-code-block__feedback"
          :class="{ 'docs-code-block__feedback--error': copyResult === 'failed' }"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >{{ feedback }}</span>
        <MdvIconButton
          class="docs-code-block__copy"
          variant="tonal"
          size="xs"
          shape="square"
          :aria-label="t('code.copy')"
          :aria-busy="copying"
          @click="copyCode"
        >
          <MdvIcon :icon="copyResult === 'copied' ? copiedIcon : copyIcon" />
        </MdvIconButton>
      </div>
    </div>
    <div v-if="lineCount !== undefined" class="docs-code-block__line-numbers" aria-hidden="true">
      <span v-for="line in lineCount" :key="line">{{ line }}</span>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.docs-code-block {
  --docs-code-control-background: color-mix(in srgb, var(--mdv-sys-color-on-surface) 8%, transparent);
  --docs-code-control-color: var(--mdv-sys-color-on-surface-variant);
  position: relative;
  min-inline-size: 0;
  margin-block: 1rem;
  overflow: hidden;
  border-radius: var(--mdv-sys-shape-corner-medium);
  background-color: var(--mdv-sys-color-surface-container-highest);
}

.docs-code-block--numbered {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
}

.docs-code-block__line-numbers,
.docs-code-block :deep(pre) {
  font-family: ui-monospace, SFMono-Regular, Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 0.875rem;
  line-height: 1.7;
}

.docs-code-block__line-numbers {
  grid-area: 1 / 1;
  box-sizing: border-box;
  min-inline-size: calc(2ch + 1.5rem + 1px);
  border-inline-end: 1px solid var(--mdv-sys-color-outline-variant);
  padding: 1.25rem 0.75rem;
  background-color: var(--mdv-sys-color-surface-container-high);
  color: var(--mdv-sys-color-outline);
  font-variant-numeric: tabular-nums;
  text-align: center;
  pointer-events: none;
  user-select: none;
}

.docs-code-block__line-numbers > span {
  display: block;
}

.docs-code-block--numbered :deep(pre) {
  grid-area: 1 / 2;
}

.docs-code-block__tools {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0.25rem;
  z-index: 1;
  display: grid;
  min-inline-size: 48px;
  max-inline-size: calc(100% - 0.5rem);
  block-size: 48px;
  align-items: center;
}

.docs-code-block__language {
  grid-area: 1 / 1;
  align-self: start;
  justify-self: end;
  margin-block-start: 0.375rem;
  padding-inline: 0.25rem;
  color: var(--mdv-sys-color-on-surface-variant);
  font-size: 0.75rem;
  line-height: 0.875rem;
  text-align: end;
  pointer-events: none;
  user-select: none;
  transition: opacity var(--mdv-sys-motion-duration-short-4) var(--mdv-sys-motion-easing-standard);
}

.docs-code-block__actions {
  grid-area: 1 / 1;
  display: none;
  min-inline-size: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 0.25rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--mdv-sys-motion-duration-short-4) var(--mdv-sys-motion-easing-standard);
}

.docs-code-block__feedback {
  min-inline-size: 0;
  color: var(--docs-code-control-color);
  font-size: 0.75rem;
  line-height: 1rem;
}

.docs-code-block__feedback:not(:empty) {
  border-radius: var(--mdv-sys-shape-corner-small);
  padding: 0.5rem 0.75rem;
  background-color: var(--docs-code-control-background);
}

.docs-code-block__copy {
  --mdv-icon-button-container-color: var(--docs-code-control-background);
  --mdv-icon-button-on-container-color: var(--docs-code-control-color);
}

.docs-code-block__feedback--error:not(:empty) {
  background-color: var(--mdv-sys-color-error-container);
  color: var(--mdv-sys-color-on-error-container);
}

.docs-code-block :deep(pre) {
  min-inline-size: 0;
  min-block-size: 4rem;
  margin: 0;
  overflow-x: auto;
  overscroll-behavior-inline: contain;
  border: 0;
  border-radius: 0;
  padding: 1.25rem;
  padding-inline-end: 4.5rem;
  background: transparent;
  tab-size: 2;
}

.docs-code-block :deep(pre code) {
  font: inherit;
}

@media (min-width: 768px) and (hover: hover) and (pointer: fine) {
  .docs-code-block__actions {
    display: flex;
  }

  .docs-code-block__tools:is(:hover, :has(:focus-visible)) .docs-code-block__language,
  .docs-code-block__tools--active .docs-code-block__language {
    opacity: 0;
  }

  .docs-code-block__tools:is(:hover, :has(:focus-visible)) .docs-code-block__actions,
  .docs-code-block__tools--active .docs-code-block__actions {
    opacity: 1;
    pointer-events: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .docs-code-block__language,
  .docs-code-block__actions {
    transition: none;
  }
}
</style>
