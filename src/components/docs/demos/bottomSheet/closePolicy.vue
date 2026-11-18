<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvBottomSheetBeforeClose } from '@mdv-ui/mdv'

const open = ref(false)
const allowClose = ref(false)
const message = ref('Enable closing before leaving this sheet.')

const beforeClose: MdvBottomSheetBeforeClose = (detail) => {
  if (allowClose.value) return true
  message.value = `The ${detail.reason} request was blocked. Enable closing and try again.`
  return false
}
</script>

<template>
  <MdvButton @click="open = true">Try guarded closing</MdvButton>
  <MdvBottomSheet
    v-model="open"
    title="Review before closing"
    :before-close="beforeClose"
    :close-on-scrim="false"
    :close-on-swipe="false"
    expand-label="Expand sheet"
    collapse-label="Collapse sheet"
    close-label="Close sheet"
  >
    <div class="grid gap-4">
      <p>Scrim clicks and downward dismissal are disabled. Escape, the handle, and Close still use the guard.</p>
      <MdvCheckbox v-model="allowClose" label="Allow this sheet to close" />
      <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
    </div>
    <template #actions="{ close }">
      <MdvButton @click="close('reviewed')">Close</MdvButton>
    </template>
  </MdvBottomSheet>
</template>
