<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { useRouter } from 'vue-router'
import { trackArticleHeadings } from '@/router/heading-tracker'
import OnThisPage from './OnThisPage.vue'

const router = useRouter()
const article = useTemplateRef<HTMLElement>('article')
let stopHeadingTracking: (() => void) | undefined

onMounted(() => {
  if (article.value) stopHeadingTracking = trackArticleHeadings(article.value, router)
})

onBeforeUnmount(() => stopHeadingTracking?.())
</script>

<template>
  <div class="docs-page min-w-0 p-6 md:p-8">
    <OnThisPage :article="article" />
    <article ref="article" class="docs-prose">
      <slot />
    </article>
  </div>
</template>

<style scoped>
.docs-page {
  display: grid;
  max-inline-size: calc(880px + 224px + 7rem);
  align-items: start;
  row-gap: 1.5rem;
  margin-inline: auto;
}

.docs-page > .docs-prose {
  min-inline-size: 0;
  inline-size: 100%;
}

@media (min-width: 1280px) {
  .docs-page:has(.docs-outline) {
    grid-template-columns: minmax(0, 880px) 224px;
    column-gap: 3rem;
  }

  .docs-page > .docs-outline {
    grid-area: 1 / 2;
  }

  .docs-page > .docs-prose {
    grid-area: 1 / 1;
  }
}
</style>
