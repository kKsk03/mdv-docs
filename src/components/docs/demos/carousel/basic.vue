<script setup lang="ts">
import { ref } from 'vue'
import { MdvCarousel } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const current = ref<MdvCarouselKey | null>('lake')
const message = ref('Choose a destination or use the controls.')
const items: MdvCarouselItem[] = [
  { key: 'lake', label: 'Lake', alt: 'Green hills beside a lake', colors: ['#c5dfce', '#396452'] },
  { key: 'coast', label: 'Coast', alt: 'Blue hills beside the coast', colors: ['#c8e4ef', '#426b91'] },
  { key: 'desert', label: 'Desert', alt: 'Warm dunes under the sun', colors: ['#f0d4bb', '#a65e45'] },
  { key: 'alpine', label: 'Alpine', alt: 'Violet mountains at sunrise', colors: ['#ded6ee', '#787094'] },
].map(({ colors, ...item }) => ({
  ...item,
  src: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><path fill="${colors[0]}" d="M0 0h600v400H0z"/><circle cx="450" cy="90" r="45" fill="#fff0b6"/><path d="M0 340 180 100 380 340 500 180 600 320V400H0Z" fill="${colors[1]}"/></svg>`)}`,
}))
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No destinations.',
  item: (index, count) => `Slide ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCarousel
      v-model="current"
      :items="items"
      :labels="labels"
      aria-label="Travel destinations"
      @item-click="message = `Opened ${$event.item.label}.`"
    />
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · {{ message }}</p>
  </div>
</template>
