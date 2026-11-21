<script setup lang="ts">
import { MdvCard, MdvIcon } from '@mdv-ui/mdv'
import { computed, useId } from 'vue'
import { RouterLink } from 'vue-router'
import {
  documentationPages,
  getComponentName,
  getComponentTranslation,
  getRouteName,
  type Locale,
} from '@/content/registry'

const props = defineProps<{ locale: Locale }>()

const componentPages = documentationPages.filter(page => page.slug.startsWith('components/'))
const gridId = useId()
const cards = computed(() => componentPages.map(page => ({
  page,
  nameParts: getComponentName(page).split(/(?<=[a-z0-9])(?=[A-Z])/),
  translation: getComponentTranslation(page, props.locale),
  titleId: `${gridId}-${page.id}-title`,
  subtitleId: `${gridId}-${page.id}-subtitle`,
})))
</script>

<template>
  <ul class="component-library" role="list">
    <li v-for="{ page, nameParts, translation, titleId, subtitleId } in cards" :key="page.id">
      <RouterLink
        :to="{ name: getRouteName(locale, page.id) }"
        custom
        v-slot="{ href, navigate }"
      >
        <MdvCard
          class="component-library__card"
          variant="filled"
          :href="href"
          :aria-labelledby="translation ? `${titleId} ${subtitleId}` : titleId"
          @click="navigate"
        >
          <span class="component-library__label">
            <MdvIcon :icon="page.icon" class="text-mdv-primary" />
            <span class="component-library__names">
              <span :id="titleId" class="component-library__title" lang="en">
                <template v-for="(part, index) in nameParts" :key="index"><wbr v-if="index > 0" />{{ part }}</template>
              </span>
              <span v-if="translation" :id="subtitleId" class="component-library__subtitle" :lang="locale">
                {{ translation }}
              </span>
            </span>
          </span>
        </MdvCard>
      </RouterLink>
    </li>
  </ul>
</template>

<style scoped>
.component-library {
  --tile-gap: 0.75rem;

  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(100%, max(7rem, calc((100% - 3 * var(--tile-gap)) / 4))), 1fr)
  );
  grid-auto-rows: 1fr;
  gap: var(--tile-gap);
  margin-block: 1rem;
  padding: 0;
  list-style: none;
}

.component-library > li {
  display: grid;
  min-inline-size: 0;
  margin-block-start: 0;
}

.component-library__card {
  align-items: center;
}

.component-library__label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-block-size: 4rem;
  color: var(--mdv-sys-color-on-surface);
  font-size: var(--mdv-sys-typescale-label-large-size);
  font-weight: var(--mdv-sys-typescale-label-large-weight);
  line-height: var(--mdv-sys-typescale-label-large-line-height);
  letter-spacing: 0;
  text-align: center;
  text-wrap: balance;
}

.component-library__names {
  display: grid;
  gap: 0.125rem;
  max-inline-size: 100%;
}

.component-library__subtitle {
  color: var(--mdv-sys-color-on-surface-variant);
  font-size: var(--mdv-sys-typescale-body-small-size);
  font-weight: var(--mdv-sys-typescale-body-small-weight);
  line-height: var(--mdv-sys-typescale-body-small-line-height);
}
</style>
