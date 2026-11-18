<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton } from '@mdv-ui/mdv'
import type { MdvBottomSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const result = ref('Choose an action in the sheet.')

function onClose(detail: MdvBottomSheetCloseDetail) {
  result.value = `Closed: ${detail.reason}; result: ${detail.returnValue || '(none)'}`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Open bottom sheet</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvBottomSheet
      v-model="open"
      title="Share this document"
      description="Choose how to share your latest notes."
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
      @close="onClose"
    >
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close()">Cancel</MdvButton>
        <MdvButton @click="close('shared')">Share</MdvButton>
      </template>
    </MdvBottomSheet>
  </div>
</template>
