<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { MdvButton, MdvIcon } from '@mdv-ui/mdv'
import widgetsIcon from '@iconify-icons/material-symbols/widgets-outline'
import launchIcon from '@iconify-icons/material-symbols/rocket-launch-outline'
import libraryIcon from '@iconify-icons/material-symbols/view-module-outline'
import externalIcon from '@iconify-icons/material-symbols/open-in-new'
import releaseIcon from '@iconify-icons/material-symbols/verified-outline'
import paletteIcon from '@iconify-icons/material-symbols/palette-outline'
import darkModeIcon from '@iconify-icons/material-symbols/dark-mode-outline'
import codeIcon from '@iconify-icons/material-symbols/code'
import ComponentLibrary from '@/components/docs/ComponentLibrary.vue'
import { getRouteName, type Locale } from '@/content/registry'

const props = defineProps<{ locale: Locale }>()
const { t } = useI18n({ useScope: 'global' })
const libraryId = computed(() => props.locale === 'zh-CN' ? '组件库' : 'component-library')
const libraryHref = computed(() => `#${encodeURIComponent(libraryId.value)}`)
const libraryTitle = computed(() => t('introduction.componentLibrary', {}, { locale: props.locale }))
const facts = computed(() => [
  { icon: releaseIcon, label: `v${__MDV_LIBRARY__.version}` },
  { icon: widgetsIcon, label: t('introduction.componentCount', { count: __MDV_LIBRARY__.components }, { locale: props.locale }) },
  { icon: paletteIcon, label: t('introduction.dynamicColor', {}, { locale: props.locale }) },
  { icon: darkModeIcon, label: t('introduction.darkMode', {}, { locale: props.locale }), contrast: true },
  { icon: codeIcon, label: 'TypeScript' },
])
</script>

<template>
  <div class="introduction-page px-6 pb-8 pt-7 md:px-8 md:pb-12 md:pt-9">
    <header class="introduction-hero">
      <div class="introduction-hero__backdrop" aria-hidden="true">
        <div class="introduction-hero__folds" />
      </div>
      <h1 lang="en" class="introduction-hero__brand">
        <span class="introduction-hero__initial introduction-hero__initial--material">M</span>aterial
        <span class="introduction-hero__initial introduction-hero__initial--design">D</span>esign
        <span class="introduction-hero__initial introduction-hero__initial--vue">V</span>ue
      </h1>
      <p class="introduction-hero__summary">{{ t('introduction.summary', {}, { locale }) }}</p>

      <div class="introduction-hero__actions">
        <RouterLink :to="{ name: getRouteName(locale, 'setup') }" custom v-slot="{ href, navigate }">
          <MdvButton :href="href" @click="navigate">
            <template #leading><MdvIcon :icon="launchIcon" /></template>
            {{ t('introduction.getStarted', {}, { locale }) }}
          </MdvButton>
        </RouterLink>
        <MdvButton variant="tonal" :href="libraryHref">
          <template #leading><MdvIcon :icon="libraryIcon" /></template>
          {{ t('introduction.browseComponents', {}, { locale }) }}
        </MdvButton>
        <MdvButton variant="outlined" href="https://github.com/kKsk03/mdv" target="_blank" rel="noopener noreferrer">
          <template #leading><MdvIcon :icon="externalIcon" /></template>
          GitHub
        </MdvButton>
      </div>

      <ul class="introduction-hero__facts" role="list">
        <li v-for="fact in facts" :key="fact.label" :class="{ 'introduction-hero__fact--contrast': fact.contrast }">
          <MdvIcon :icon="fact.icon" :size="16" />{{ fact.label }}
        </li>
      </ul>
    </header>

    <section :aria-labelledby="libraryId">
      <h2
        :id="libraryId"
        class="introduction-page__library-title"
        :aria-label="libraryTitle"
        tabindex="-1"
        data-docs-anchor
      >
        <a
          class="docs-heading-anchor"
          :href="libraryHref"
          :aria-label="t('article.headingLink', { title: libraryTitle }, { locale })"
        ><span aria-hidden="true">#</span></a>
        {{ libraryTitle }}
      </h2>
      <ComponentLibrary :locale="locale" />
    </section>
  </div>
</template>

<style scoped>
.introduction-page {
  max-inline-size: 72rem;
  margin-inline: auto;
}

.introduction-hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: grid;
  justify-items: center;
  align-content: center;
  min-block-size: min(26rem, 60svh);
  margin-block-end: 2rem;
  padding: 2.5rem 1rem;
  border-radius: var(--mdv-sys-shape-corner-large);
  background-color: color-mix(
    in srgb,
    var(--mdv-sys-color-primary-container) 72%,
    var(--mdv-sys-color-surface)
  );
  color: var(--mdv-sys-color-on-primary-container);
  letter-spacing: 0;
  text-align: center;
}

.introduction-hero__backdrop {
  position: absolute;
  z-index: -1;
  inset: 0;
  overflow: clip;
  pointer-events: none;
}

.introduction-hero__folds {
  position: absolute;
  /* Overscan hides the ribbon's outer edges as it drifts. */
  inset: -10%;
  color: var(--mdv-sys-color-primary);
  background-color: color-mix(in srgb, currentColor 25%, transparent);
  clip-path: polygon(
    0 0, 27.7% 0, 24.9% 8.3%, 26.5% 14.4%, 28% 19%, 30% 23.5%, 33% 28%,
    37% 32.4%, 41% 35.3%, 46% 37.9%, 52% 39.5%, 58% 39.8%, 65% 39.7%, 70% 40%,
    75% 41%, 81% 41%, 86% 42.5%, 90% 45%, 94% 49.1%, 97% 53.1%, 100% 57.6%,
    100% 100%, 71.3% 100%, 70% 92.5%, 68% 83.2%, 66% 76.4%, 64% 71.5%,
    61% 65.7%, 58% 61.6%, 55% 58.5%, 51% 55.5%, 47% 53.3%, 42% 51.2%,
    37% 48.4%, 30% 44.1%, 25% 41.1%, 21% 39.5%, 18% 39.2%, 15% 39.6%,
    12% 41%, 9% 43.1%, 6% 46.5%, 3% 50.9%, 0 56.6%
  );
  opacity: 0.14;
}

/* Darker folds sit inside the shared ribbon silhouette. */
.introduction-hero__folds::before,
.introduction-hero__folds::after {
  position: absolute;
  inset: 0;
  background-color: currentColor;
  content: '';
}

.introduction-hero__folds::before {
  clip-path: polygon(
    0 0, 27.7% 0, 24.9% 8.3%, 22% 15.1%, 20% 18.9%, 18% 22.2%, 15% 26.4%,
    12% 29.7%, 9% 32.3%, 6% 34.5%, 3% 36.6%, 0 38.7%
  );
  opacity: 0.56;
}

.introduction-hero__folds::after {
  clip-path: polygon(
    44% 53%, 48% 52.8%, 51% 52.3%, 55% 51%, 60% 48%, 65% 45%, 70% 42.7%,
    75% 41%, 81% 39%, 100% 39%, 100% 100%, 44% 100%
  );
  opacity: 0.48;
}

.introduction-hero__brand {
  margin: 0;
  color: var(--mdv-sys-color-on-surface);
  font-size: var(--mdv-sys-typescale-display-medium-size);
  font-weight: 700;
  line-height: 1.1;
  text-wrap: balance;
}

.introduction-hero__initial--material {
  color: var(--mdv-sys-color-primary);
}

.introduction-hero__initial--design {
  color: var(--mdv-sys-color-secondary);
}

.introduction-hero__initial--vue {
  color: var(--mdv-sys-color-tertiary);
}

.introduction-hero__summary {
  max-inline-size: 38rem;
  margin: 1rem 0 0;
  font-size: var(--mdv-sys-typescale-body-large-size);
  line-height: 1.55;
  text-wrap: balance;
}

.introduction-hero__actions,
.introduction-hero__facts {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.introduction-hero__actions {
  margin-block-start: 1.5rem;
}

.introduction-hero__facts {
  margin: 1.75rem 0 0;
  padding: 0;
  list-style: none;
}

.introduction-hero__facts li {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.35rem 0.65rem;
  border-radius: var(--mdv-sys-shape-corner-small);
  background: color-mix(in srgb, currentColor 8%, transparent);
  font-size: var(--mdv-sys-typescale-label-medium-size);
  font-weight: var(--mdv-sys-typescale-label-medium-weight);
  line-height: var(--mdv-sys-typescale-label-medium-line-height);
}

.introduction-hero__facts .introduction-hero__fact--contrast {
  background: var(--mdv-sys-color-tertiary-container);
  color: var(--mdv-sys-color-on-tertiary-container);
}

.introduction-page__library-title {
  position: relative;
  margin: 0;
  font-size: var(--mdv-sys-typescale-title-large-size);
  font-weight: 600;
  line-height: var(--mdv-sys-typescale-title-large-line-height);
  scroll-margin-block-start: 1.5rem;
}

.introduction-page__library-title > .docs-heading-anchor {
  inline-size: 1.25rem;
  text-align: center;
}

@media (max-width: 600px) {
  .introduction-hero {
    min-block-size: 0;
    padding: 2rem 1rem;
    margin-block-end: 1.5rem;
  }

  .introduction-hero__brand {
    font-size: var(--mdv-sys-typescale-headline-medium-size);
  }

  .introduction-hero__facts {
    gap: 0.375rem;
    margin-block-start: 1rem;
  }
}

@media (max-height: 32rem), (max-width: 24rem) and (max-height: 40rem) {
  .introduction-page { padding: 1rem; }
  .introduction-page__library-title > .docs-heading-anchor {
    inline-size: 0.875rem;
    font-size: 1rem;
  }
  .introduction-page__library-title > .docs-heading-anchor:focus-visible {
    outline-offset: 0;
  }
  .introduction-hero {
    min-block-size: 0;
    margin-block-end: 1.25rem;
    padding: 1.25rem 0.75rem;
  }
  .introduction-hero__brand {
    font-size: var(--mdv-sys-typescale-title-large-size);
  }
  .introduction-hero__summary {
    margin-block-start: 0.75rem;
    font-size: var(--mdv-sys-typescale-body-medium-size);
  }
  .introduction-hero__actions,
  .introduction-hero__facts { margin-block-start: 0.75rem; }
}

@media (prefers-reduced-motion: no-preference) {
  .introduction-hero__folds {
    animation: introduction-hero-drift 18s ease-in-out infinite alternate;
  }
}

@keyframes introduction-hero-drift {
  from { transform: translate(-3%, -4%) scale(1.02); }
  55% { transform: translate(3%, 1%) scale(1.09); }
  to { transform: translate(-1%, 5%) scale(1.04); }
}

@media (forced-colors: active) {
  .introduction-hero__backdrop { display: none; }
}
</style>
