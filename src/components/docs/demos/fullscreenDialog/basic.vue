<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvFullscreenDialog } from '@mdv-ui/mdv'

const open = ref(false)
const result = ref('No result yet.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Review workspace</MdvButton>
    <MdvFullscreenDialog v-model="open" title="Review workspace" description="Review your workspace before continuing. This dialog fills the viewport on desktop and mobile." close-label="Close workspace review" @closed="result = `${$event.reason} · ${$event.returnValue || '(no result)'}`">
      <template #actions="{ close }"><MdvButton variant="text" @click="close('approved')">Approve</MdvButton></template>
      <template #footer="{ close }"><MdvButton variant="text" @click="close('cancelled')">Cancel</MdvButton></template>
    </MdvFullscreenDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
