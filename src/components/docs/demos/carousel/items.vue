<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCarousel } from '@mdv-ui/mdv'
import type { MdvCarouselItem, MdvCarouselKey, MdvCarouselLabels } from '@mdv-ui/mdv'

const initial: MdvCarouselItem[] = [
  { key: 'design', label: 'Design' },
  { key: 'research', label: 'Research' },
  { key: 'drafts', label: 'Drafts', disabled: true },
  { key: 'archive', label: 'Archive' },
]
const items = ref([...initial])
const current = ref<MdvCarouselKey | null>('design')
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No collections.',
  item: (index, count) => `Collection ${index + 1} of ${count}`,
}

function rotate() {
  if (items.value.length) items.value = [...items.value.slice(1), items.value[0]!]
}

function reset() {
  items.value = [...initial]
  current.value = 'design'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCarousel v-model="current" :items="items" :labels="labels" :height="150" aria-label="Dynamic collections">
      <template #empty><p>No collections left. Restore them to continue.</p></template>
    </MdvCarousel>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="!items.length" @click="rotate">Move first to end</MdvButton>
      <MdvButton variant="outlined" :disabled="current === null" @click="items = items.filter(item => item.key !== current)">Remove current</MdvButton>
      <MdvButton variant="text" :disabled="!items.length" @click="items = []">Clear</MdvButton>
      <MdvButton variant="text" @click="reset">Restore</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current ?? '(none)' }} · {{ items.length }} collections</p>
  </div>
</template>
