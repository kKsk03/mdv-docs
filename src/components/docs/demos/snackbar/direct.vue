<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvSnackbar } from '@mdv-ui/mdv'
import type { MdvSnackbarCloseDetail, MdvSnackbarPlacement } from '@mdv-ui/mdv'

const visible = ref(false)
const placement = ref<MdvSnackbarPlacement>('bottom')
const result = ref('No message has been shown.')
function togglePlacement() {
  placement.value = placement.value === 'bottom' ? 'bottom-start' : 'bottom'
}
function undo() { result.value = 'Undo action completed.' }
function closed(detail: MdvSnackbarCloseDetail) { result.value = `Closed: ${detail.reason}.` }
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvButton @click="visible = true">Show message</MdvButton>
      <MdvButton variant="outlined" @click="togglePlacement">Placement: {{ placement }}</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvSnackbar v-model="visible" message="Draft deleted." :action="{ label: 'Undo', onClick: undo }" :placement="placement" :duration="0" close-label="Close message" focus-shortcut="Alt+G" />
  </div>
</template>