<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvButton, MdvChip, MdvChipSet } from '@mdv-ui/mdv'
import type { MdvChipSetModelValue } from '@mdv-ui/mdv'

const topics = ref<MdvChipSetModelValue>(['design'])
const values = computed(() => Array.isArray(topics.value) ? topics.value : [])
const result = ref('Selected chips are submitted through explicit hidden inputs.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ topic: data.getAll('topic') })
}

function reset() {
  topics.value = ['design']
  result.value = 'Form reset by the application.'
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="reset">
    <MdvChipSet v-model="topics" selection="multiple" label="Newsletter topics">
      <MdvChip variant="filter" value="design" label="Design" />
      <MdvChip variant="filter" value="engineering" label="Engineering" />
      <MdvChip variant="filter" value="research" label="Research" />
    </MdvChipSet>
    <input v-for="value in values" :key="value" type="hidden" name="topic" :value="value" />
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
