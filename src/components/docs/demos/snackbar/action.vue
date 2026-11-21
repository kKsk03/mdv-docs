<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvSnackbar } from '@mdv-ui/mdv'
import type { MdvSnackbarCloseDetail } from '@mdv-ui/mdv'

const visible = ref(false)
const fail = ref(false)
const result = ref('The action result will appear here.')
const snackbar = useTemplateRef<InstanceType<typeof MdvSnackbar>>('snackbar')
function runAction() {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => fail.value ? reject(new Error('The simulated request failed.')) : resolve(), 300)
  })
}
function closed(detail: MdvSnackbarCloseDetail) { result.value = `Closed: ${detail.reason}.` }
function actionError(error: unknown) { result.value = error instanceof Error ? error.message : 'The action failed.' }
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvButton @click="visible = true">Show async action</MdvButton>
      <MdvButton variant="outlined" @click="fail = !fail">Next action: {{ fail ? 'fail' : 'succeed' }}</MdvButton>
      <MdvButton variant="text" @click="snackbar?.pause()">Pause timer</MdvButton>
      <MdvButton variant="text" @click="snackbar?.resume()">Resume timer</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvSnackbar ref="snackbar" v-model="visible" message="Sync the latest draft?" :action="{ label: 'Sync', onClick: runAction }" :duration="1500" closable close-label="Close sync message" @closed="closed" @action-error="actionError" />
  </div>
</template>