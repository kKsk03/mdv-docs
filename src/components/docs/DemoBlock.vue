<script setup lang="ts">
import { ref, useId } from 'vue'
import type { VNode } from 'vue'
import { useI18n } from 'vue-i18n'
import { MdvButton, MdvIcon } from '@mdv-ui/mdv'
import arrowDropDownIcon from '@iconify-icons/material-symbols/arrow-drop-down'

defineSlots<{
  default(): VNode[]
  source(): VNode[]
}>()

const { t } = useI18n({ useScope: 'global' })
const sourceId = `docs-demo-source-${useId()}`
const expanded = ref(false)
</script>

<template>
  <div class="docs-demo">
    <div class="docs-demo__preview">
      <slot />
    </div>
    <div
      :id="sourceId"
      class="docs-demo__source"
      :class="{ 'docs-demo__source--expanded': expanded }"
      :inert="!expanded ? true : undefined"
      :aria-hidden="!expanded ? true : undefined"
    >
      <div class="docs-demo__source-clip">
        <div class="docs-demo__source-content">
          <slot name="source" />
        </div>
      </div>
    </div>
    <MdvButton
      class="docs-demo__toggle"
      variant="text"
      shape="square"
      full-width
      :aria-expanded="expanded"
      :aria-controls="sourceId"
      @click="expanded = !expanded"
    >
      {{ t('demo.source') }}
      <template #trailing>
        <MdvIcon
          :icon="arrowDropDownIcon"
          class="docs-demo__chevron"
          :class="{ 'docs-demo__chevron--expanded': expanded }"
        />
      </template>
    </MdvButton>
  </div>
</template>

<style scoped>
.docs-demo {
  min-inline-size: 0;
  margin-block: 1.25rem 2rem;
  overflow: hidden;
  border: 1px solid var(--mdv-sys-color-outline-variant);
  border-radius: var(--mdv-sys-shape-corner-medium);
  background: var(--mdv-sys-color-surface);
}

.docs-demo__preview {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-inline-size: 0;
  min-block-size: 96px;
  align-items: center;
  padding: 1.5rem;
}

.docs-demo__source {
  display: grid;
  grid-template-rows: 0fr;
  min-inline-size: 0;
  border-block-start: 1px solid var(--mdv-sys-color-outline-variant);
  background: var(--mdv-sys-color-surface-container-low);
  transition: grid-template-rows var(--mdv-sys-motion-duration-medium-2)
    var(--mdv-sys-motion-easing-standard);
}

.docs-demo__source--expanded {
  grid-template-rows: 1fr;
}

.docs-demo__source-clip {
  min-block-size: 0;
  min-inline-size: 0;
  overflow: hidden;
}

.docs-demo__source-content {
  min-inline-size: 0;
  border-block-end: 1px solid var(--mdv-sys-color-outline-variant);
}

.docs-demo__source-content :deep(.docs-code-block) {
  margin: 0;
  border-radius: 0;
  background: transparent;
}

.docs-demo__toggle {
  min-block-size: 48px;
  border-radius: 0;
}

.docs-demo__chevron {
  transition: transform var(--mdv-sys-motion-duration-medium-2)
    var(--mdv-sys-motion-easing-standard);
}

.docs-demo__chevron--expanded {
  transform: rotate(180deg);
}

@media (max-width: 767px) {
  .docs-demo__preview {
    padding: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .docs-demo__source,
  .docs-demo__chevron {
    transition: none;
  }
}
</style>
