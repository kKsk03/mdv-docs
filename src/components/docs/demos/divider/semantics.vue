<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDivider } from '@mdv-ui/mdv'

const semantic = ref(true)
const message = ref('Tab moves between the actions, skipping the divider.')
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="semantic" label="Expose a semantic separator" />
    <div class="grid justify-items-start gap-4 rounded-xl bg-mdv-surface-container-low p-4">
      <MdvButton variant="outlined" @click="message = 'Previous action selected.'">Previous action</MdvButton>
      <MdvDivider class="w-full" :decorative="!semantic" aria-label="Reading and actions" />
      <MdvButton variant="outlined" @click="message = 'Next action selected.'">Next action</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
