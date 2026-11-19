<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvCheckbox, MdvIcon } from '@mdv-ui/mdv'
import checkIcon from '@iconify-icons/material-symbols/check-circle-outline'
import warningIcon from '@iconify-icons/material-symbols/warning-outline'

const labelId = `attention-label-${useId()}`
const expose = ref(true)
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="expose" label="Expose the standalone status" />
    <div class="flex flex-wrap items-center gap-8">
      <span class="inline-flex items-center gap-2"><MdvIcon :icon="checkIcon" />Saved (decorative icon)</span>
      <MdvIcon :icon="checkIcon" :aria-label="expose ? 'Ready to sync' : undefined" color="var(--mdv-sys-color-primary)" />
      <span class="inline-flex items-center gap-2">
        <MdvIcon :icon="warningIcon" :aria-labelledby="labelId" color="var(--mdv-sys-color-error)" />
        <span :id="labelId">Needs attention</span>
      </span>
    </div>
    <p class="text-sm text-mdv-on-surface-variant">The standalone status is {{ expose ? 'named and exposed as an image' : 'decorative and hidden' }}. None of these icons is an action.</p>
  </div>
</template>
