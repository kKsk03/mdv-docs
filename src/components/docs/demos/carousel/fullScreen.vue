<script setup lang="ts">
import { ref } from 'vue'
import { MdvCarousel } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const current = ref<MdvCarouselKey | null>('morning')
const items: MdvCarouselItem[] = [
  { key: 'morning', label: 'Morning', color: '#557867' },
  { key: 'afternoon', label: 'Afternoon', color: '#9b7057' },
  { key: 'evening', label: 'Evening', color: '#655d85' },
].map(({ color, ...item }) => ({
  ...item,
  alt: `${item.label} sky above layered hills`,
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><path fill="${color}" d="M0 0h400v600H0z"/><circle cx="290" cy="150" r="45" fill="#ffefba"/><path d="M0 460 150 300 320 470 400 350V600H0Z" fill="#fff" opacity=".25"/></svg>`)}`,
}))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No scenes.',
  item: (index, count) => `Scene ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-4">
    <div class="h-[400px]">
      <MdvCarousel v-model="current" :items="items" variant="full-screen" :labels="labels" show-controls aria-label="A day outdoors" />
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Scene: {{ current }}. Use Up/Down or the controls to browse vertically.</p>
  </div>
</template>
