<script setup lang="ts">
import { computed, ref } from 'vue'
import { MdvButton, MdvLinearProgress } from '@mdv-ui/mdv'

const phase = ref<'idle' | 'connecting' | 'uploading' | 'complete' | 'error'>('idle')
const transferred = ref(0)
const total = 256
const busy = computed(() => phase.value === 'connecting' || phase.value === 'uploading')
const message = computed(() => {
  if (phase.value === 'connecting') return 'Connecting. The total progress is not known yet.'
  if (phase.value === 'uploading') return `Uploading: ${transferred.value} of ${total} MB.`
  if (phase.value === 'complete') return 'Report uploaded. The completed indicator stays visible.'
  if (phase.value === 'error') return 'Upload failed. Start again to retry.'
  return 'Start an upload to try the task states.'
})

function advance() {
  transferred.value = Math.min(total, transferred.value + 64)
  if (transferred.value === total) phase.value = 'complete'
}
</script>

<template>
  <div class="grid gap-5">
    <section :aria-busy="busy" aria-label="Report upload" class="grid min-h-12 items-center">
      <MdvLinearProgress v-if="busy || phase === 'complete'" :indeterminate="phase === 'connecting'" :value="transferred" :max="total" variant="wavy" label="Report upload" :aria-valuetext="phase === 'connecting' ? undefined : `${transferred} of ${total} MB`" />
      <span v-else class="text-sm text-mdv-on-surface-variant">{{ phase === 'error' ? 'Ready to retry.' : 'No upload is running.' }}</span>
    </section>
    <div class="flex flex-wrap gap-3">
      <MdvButton :disabled="busy" @click="transferred = 0; phase = 'connecting'">Start upload</MdvButton>
      <MdvButton variant="tonal" :disabled="phase !== 'connecting'" @click="phase = 'uploading'">Progress is known</MdvButton>
      <MdvButton variant="outlined" :disabled="phase !== 'uploading'" @click="advance">Upload 64 MB</MdvButton>
      <MdvButton variant="text" :disabled="!busy" @click="phase = 'error'">Simulate failure</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
