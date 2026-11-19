<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCarousel, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCarouselExpose, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const carousel = useTemplateRef<MdvCarouselExpose>('carousel')
const current = ref<MdvCarouselKey | null>('first')
const locked = ref(true)
const gestures = ref(true)
const result = ref('Unlock navigation to accept a different key.')
const items = ['first', 'second', 'third', 'fourth'].map((key, index) => ({ key, label: `Chapter ${index + 1}` }))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No chapters.',
  item: (index, count) => `Chapter ${index + 1} of ${count}`,
}

function update(key: MdvCarouselKey | null) {
  result.value = `Requested ${key}: ${locked.value ? 'rejected' : 'accepted'}.`
  if (!locked.value) current.value = key
}

async function jump() {
  const accepted = await carousel.value?.scrollTo('fourth', { animate: false, focus: true })
  result.value = accepted ? 'Jump accepted and the chapter was focused.' : 'Jump rejected; the accepted chapter is unchanged.'
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="locked" label="Reject navigation requests" />
      <MdvCheckbox v-model="gestures" label="Enable dragging and wheel" />
    </div>
    <MdvCarousel ref="carousel" :model-value="current" :items="items" :labels="labels" :height="140" :user-scroll-enabled="gestures" aria-label="Controlled chapters" @update:model-value="update" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="jump">Jump to chapter 4</MdvButton>
      <MdvButton variant="outlined" @click="carousel?.focus()">Focus current chapter</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · {{ result }}</p>
  </div>
</template>
