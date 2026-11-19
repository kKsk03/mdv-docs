<script setup lang="ts">
import { ref } from 'vue'
import { MdvCarousel, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselLabels, MdvCarouselVariant } from '@mdv-ui/mdv'

const snap = ref(false)
const variants: MdvCarouselVariant[] = ['multi-browse', 'uncontained', 'hero']
const items: MdvCarouselItem[] = ['#54745c', '#527f9e', '#b07854', '#827096', '#507e7a'].map((color, index) => ({
  key: index,
  label: `Journey ${index + 1}`,
  alt: `Abstract landscape ${index + 1}`,
  aspectRatio: [16 / 9, 3 / 4, 1, 9 / 16, 4 / 3][index],
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><path fill="${color}" d="M0 0h600v400H0z"/><circle cx="430" cy="100" r="48" fill="#fff0c6"/><path d="M0 350 200 150 370 320 500 210 600 340V400H0Z" fill="#fff" opacity=".25"/></svg>`)}`,
}))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No journeys.',
  item: (index, count) => `Slide ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-6">
    <MdvCheckbox v-model="snap" label="Snap uncontained items" />
    <div v-for="variant in variants" :key="variant" class="grid min-w-0 gap-2">
      <p class="font-medium">{{ variant }}</p>
      <MdvCarousel
        :items="items"
        :variant="variant"
        :height="180"
        :fling-behavior="variant === 'uncontained' && snap ? 'single-advance' : 'auto'"
        :labels="labels"
        :aria-label="`${variant} journeys`"
      />
    </div>
  </div>
</template>
