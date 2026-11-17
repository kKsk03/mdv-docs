<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  title: string
  code: string
}>()

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <section class="docs-demo" :aria-label="title">
    <h3 class="docs-demo__title">{{ title }}</h3>
    <div class="docs-demo__preview">
      <slot />
    </div>
    <details class="docs-demo__source">
      <summary>{{ t('demo.source') }}</summary>
      <pre><code>{{ code }}</code></pre>
    </details>
  </section>
</template>

<style scoped>
.docs-demo {
  margin-block: 1.25rem 2rem;
  overflow: hidden;
  border: 1px solid var(--mdv-sys-color-outline-variant);
  border-radius: 6px;
  background: var(--mdv-sys-color-surface);
}

.docs-demo__title {
  margin: 0;
  padding: 0.75rem 1rem;
  border-block-end: 1px solid var(--mdv-sys-color-outline-variant);
  font-size: 0.9rem;
  font-weight: 600;
}

.docs-demo__preview {
  display: flex;
  min-height: 112px;
  align-items: center;
  padding: 1.25rem;
}

.docs-demo__source {
  border-block-start: 1px solid var(--mdv-sys-color-outline-variant);
}

.docs-demo__source summary {
  padding: 0.75rem 1rem;
  color: var(--mdv-sys-color-primary);
  cursor: pointer;
  font-size: 0.9rem;
}

.docs-demo__source pre {
  overflow-x: auto;
  margin: 0;
  padding: 1rem;
  border-block-start: 1px solid var(--mdv-sys-color-outline-variant);
  background: var(--mdv-sys-color-surface-container-low);
  font-size: 0.875rem;
  line-height: 1.6;
}
</style>
