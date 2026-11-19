<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { MdvButton, MdvSideSheet, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSideSheetBeforeClose, MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const saved = ref('')
const note = ref('')
const dirty = computed(() => note.value !== saved.value)
const pendingReason = ref('')
const message = ref('No notes saved.')
let decision: ((allowed: boolean) => void) | undefined
const beforeClose: MdvSideSheetBeforeClose = detail => {
  if (!dirty.value) return true
  pendingReason.value = detail.reason
  return new Promise<boolean>(resolve => { decision = resolve })
}
function decide(discard: boolean) {
  const resolve = decision
  decision = undefined
  pendingReason.value = ''
  if (discard) note.value = saved.value
  resolve?.(discard)
}
function closed(detail: MdvSideSheetCloseDetail) { message.value = `Closed: ${detail.reason} · Result: ${detail.returnValue || '(empty)'}` }
watch(open, value => { if (!value) decide(false) })
onBeforeUnmount(() => decide(false))
</script>

<template>
  <div class="grid gap-3">
    <div><MdvButton @click="open = true">Edit guarded note</MdvButton></div>
    <MdvSideSheet v-model="open" title="Project note" width="360px" :before-close="beforeClose" close-label="Close project note" @closed="closed">
      <div class="grid gap-4">
        <MdvTextField v-model="note" label="Unsaved note" autofocus full-width />
        <div v-if="pendingReason" role="alert" class="grid gap-3 rounded-xl bg-mdv-secondary-container p-4 text-mdv-on-secondary-container">
          <p>Discard your changes? Close reason: {{ pendingReason }}</p>
          <div class="flex flex-wrap gap-2">
            <MdvButton variant="text" @click="decide(false)">Keep editing</MdvButton>
            <MdvButton variant="text" @click="decide(true)">Discard changes</MdvButton>
          </div>
        </div>
      </div>
      <template #actions="{ close }">
        <MdvButton variant="text" :disabled="!!pendingReason" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" :disabled="!!pendingReason" @click="saved = note; close('save')">Save note</MdvButton>
      </template>
    </MdvSideSheet>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Saved: {{ JSON.stringify(saved) }} · Unsaved: {{ dirty }} · {{ message }}</p>
  </div>
</template>
