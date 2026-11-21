<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvSlider } from '@mdv-ui/mdv'
import type { MdvSliderModelValue } from '@mdv-ui/mdv'

const volume = ref<MdvSliderModelValue>(30)
const range = ref<MdvSliderModelValue>([20, 80])
const submission = ref('Submit to inspect FormData.')
function submit(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  submission.value = JSON.stringify([...new FormData(form).entries()])
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSlider v-model="volume" name="volume" form="settings-form" label="Volume" />
    <MdvSlider v-model="range" variant="range" :step="5" name="price" form="settings-form" label="Price range" start-aria-label="Minimum price" end-aria-label="Maximum price" />
    <form id="settings-form" class="flex flex-wrap gap-3" @submit.prevent="submit">
      <MdvButton type="submit">Submit values</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset to initial values</MdvButton>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Volume: {{ volume }} · Range: {{ JSON.stringify(range) }} · {{ submission }}</p>
  </div>
</template>