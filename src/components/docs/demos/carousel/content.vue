<script setup lang="ts">
import { reactive, ref } from 'vue'
import { MdvButton, MdvCarousel, MdvTextField } from '@mdv-ui/mdv'
import type { MdvCarouselLabels } from '@mdv-ui/mdv'

const items = [
  { id: 'weekend', title: 'Weekend plans' },
  { id: 'reading', title: 'Reading list' },
  { id: 'ideas', title: 'New ideas' },
]
const notes = reactive<Record<string, string>>({ weekend: 'Visit the park', reading: '', ideas: '' })
const result = ref('Notes stay mounted while you browse.')
const labels: MdvCarouselLabels = {
  carousel: 'Carousel', slide: 'Slide', previous: 'Previous', next: 'Next',
  skip: 'Skip carousel', empty: 'No notebooks.',
  item: (index, count) => `Notebook ${index + 1} of ${count}`,
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCarousel :items="items" item-key="id" variant="uncontained" :item-size="280" :height="240" :labels="labels" aria-label="Personal notebooks">
      <template #header="{ index, count }">
        <p class="font-medium">Notebook {{ index + 1 }} of {{ count }}</p>
      </template>
      <template #item="{ item }">
        <div class="grid h-full content-start gap-4 bg-mdv-tertiary-container p-5 text-mdv-on-tertiary-container">
          <p class="font-medium">{{ item.title }}</p>
          <div data-mdv-carousel-no-drag>
            <MdvTextField v-model="notes[item.id]" :label="`${item.title} note`" full-width />
          </div>
          <MdvButton variant="tonal" @click="result = `Saved ${item.title}: ${notes[item.id] || '(empty)'}`">Save note</MdvButton>
        </div>
      </template>
      <template #controls="{ previous, next, canPrevious, canNext }">
        <MdvButton variant="text" :disabled="!canPrevious" @click="previous()">Previous notebook</MdvButton>
        <MdvButton variant="text" :disabled="!canNext" @click="next()">Next notebook</MdvButton>
      </template>
    </MdvCarousel>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
