<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvSearchView, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSearchBeforeClose, MdvSearchCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const note = ref('')
const dirty = ref(false)
const pendingReason = ref('')
const message = ref('No close request yet.')
let resolveClose: ((accepted: boolean) => void) | undefined
const beforeClose: MdvSearchBeforeClose = detail => {
  if (!dirty.value) return true
  pendingReason.value = detail.reason
  return new Promise<boolean>(resolve => { resolveClose = resolve })
}
function decide(discard: boolean) {
  if (discard) { note.value = ''; dirty.value = false }
  pendingReason.value = ''
  resolveClose?.(discard)
  resolveClose = undefined
}
function closed(detail: MdvSearchCloseDetail) { message.value = `Closed: ${detail.reason}` }
onBeforeUnmount(() => resolveClose?.(false))
</script>

<template>
  <div class="grid gap-4">
    <MdvSearchView v-model:open="open" placeholder="Search and annotate" results-label="Annotation search results" clear-label="Clear annotation query" back-label="Leave annotation search" variant="divided" :before-close="beforeClose" @closed="closed">
      <template #default="{ close }">
        <div class="grid gap-4 p-5">
          <MdvTextField :model-value="note" label="Unsaved note" supporting-text="Type a note, then request closing." @update:model-value="note = String($event); dirty = true" />
          <MdvButton variant="outlined" @click="close()">Close annotation search</MdvButton>
          <div v-if="pendingReason" role="alert" class="grid gap-3 rounded-xl bg-mdv-secondary-container p-4 text-mdv-on-secondary-container">
            <p class="text-sm">Discard the unsaved note? Close reason: {{ pendingReason }}</p>
            <div class="flex flex-wrap gap-3"><MdvButton variant="text" @click="decide(false)">Keep editing</MdvButton><MdvButton variant="tonal" @click="decide(true)">Discard note</MdvButton></div>
          </div>
        </div>
      </template>
    </MdvSearchView>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }} · Unsaved: {{ dirty }}</p>
  </div>
</template>
