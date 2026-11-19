<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvLinearProgress, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const value = ref<MdvSelectValue | null>(null)
const options = ref<MdvSelectOption[]>([])
const loading = ref(false)
const failNext = ref(false)
const message = ref('Load projects to enable the field.')
let timer: ReturnType<typeof setTimeout> | undefined
function cancel() {
  clearTimeout(timer)
  loading.value = false
  message.value = 'Request cancelled.'
}
function load() {
  clearTimeout(timer)
  loading.value = true
  message.value = 'Loading projects…'
  const fail = failNext.value
  failNext.value = false
  timer = setTimeout(() => {
    loading.value = false
    if (fail) { message.value = 'The simulated service is unavailable. Try again.'; return }
    options.value = [{ value: 'design', label: 'Design system' }, { value: 'website', label: 'Documentation website' }]
    message.value = 'Projects loaded.'
  }, 450)
}
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid min-w-0 gap-3" :aria-busy="loading">
    <MdvCheckbox v-model="failNext" label="Fail the next simulated request" />
    <div class="flex flex-wrap gap-2">
      <MdvButton @click="load">{{ loading ? 'Restart request' : 'Load projects' }}</MdvButton>
      <MdvButton variant="text" :disabled="!loading" @click="cancel">Cancel request</MdvButton>
    </div>
    <MdvLinearProgress v-if="loading" indeterminate aria-label="Loading project options" />
    <MdvSelect v-model="value" label="Project" placeholder="Choose a project" :options="options" :disabled="loading || options.length === 0" :supporting-text="message" full-width />
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }} Model: {{ JSON.stringify(value) }}</p>
  </div>
</template>
