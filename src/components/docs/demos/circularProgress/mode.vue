<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvCircularProgress } from '@mdv-ui/mdv'

const unknown = ref(true)
const value = ref(25)

function complete() {
  unknown.value = false
  value.value = 100
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="unknown" label="Progress is unknown" />
    <MdvCircularProgress :value="value" :indeterminate="unknown" variant="wavy" label="Processing files" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" :disabled="unknown || value === 100" @click="value = Math.min(100, value + 5)">Advance 5%</MdvButton>
      <MdvButton variant="outlined" @click="complete">Complete</MdvButton>
      <MdvButton variant="text" @click="value = 0; unknown = true">Start over</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ unknown ? 'Waiting for a measurable result…' : value === 100 ? 'Processing complete.' : `Processed ${value}%.` }}</p>
  </div>
</template>
