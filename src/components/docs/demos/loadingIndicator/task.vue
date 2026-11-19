<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvLoadingIndicator } from '@mdv-ui/mdv'

const phase = ref<'idle' | 'loading' | 'success' | 'error'>('idle')
const fail = ref(false)
const loading = computed(() => phase.value === 'loading')
const message = computed(() => ({
  idle: 'Load recommendations to try the preview.',
  loading: 'Loading recommendations…',
  success: 'Recommendations are ready.',
  error: 'Loading failed. Disable the simulated failure and retry.',
})[phase.value])
let timer: ReturnType<typeof setTimeout> | undefined

function load() {
  if (loading.value) return
  phase.value = 'loading'
  // Simulate a local request; no network request is made.
  timer = setTimeout(() => {
    timer = undefined
    phase.value = fail.value ? 'error' : 'success'
  }, 1200)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap items-center gap-4">
      <MdvButton :disabled="loading" @click="load">Load recommendations</MdvButton>
      <MdvCheckbox v-model="fail" label="Simulate a loading failure" :disabled="loading" />
    </div>
    <section :aria-busy="loading" aria-label="Recommendations" class="grid min-h-40 place-items-center rounded-xl bg-mdv-surface-container-low p-5">
      <MdvLoadingIndicator v-if="loading" label="Loading recommendations" />
      <div v-else-if="phase === 'success'" class="grid gap-2">
        <p class="font-medium">Your reading list</p>
        <p class="text-sm">Designing useful interfaces · Choosing meaningful motion</p>
      </div>
      <p v-else class="text-sm text-mdv-on-surface-variant">{{ phase === 'error' ? 'Nothing loaded. You can retry.' : 'Recommendations will appear here.' }}</p>
    </section>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
