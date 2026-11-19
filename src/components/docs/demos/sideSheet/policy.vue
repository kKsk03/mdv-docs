<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSideSheet, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const sheet = useTemplateRef<InstanceType<typeof MdvSideSheet>>('sheet')
const open = ref(false)
const acceptClose = ref(true)
const escape = ref(true)
const scrim = ref(true)
const swipe = ref(true)
const destroy = ref(false)
const message = ref('No close request yet.')
function update(value: boolean) {
  if (value || acceptClose.value) open.value = value
  else message.value = 'Parent rejected closing.'
}
async function requestClose() { message.value = `close() accepted: ${await sheet.value?.close('requested')}` }
function closed(event: MdvSideSheetCloseDetail) { message.value = `Closed: ${event.reason} · Result: ${event.returnValue || '(empty)'}` }
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="escape" label="Escape closes" />
      <MdvCheckbox v-model="scrim" label="Scrim closes" />
      <MdvCheckbox v-model="swipe" label="Edge swipe closes" />
      <MdvCheckbox v-model="destroy" label="Destroy content on close" />
    </div>
    <div><MdvButton @click="open = true">Open close policy</MdvButton></div>
    <MdvSideSheet ref="sheet" :model-value="open" title="Close policy" width="360px" :close-on-esc="escape" :close-on-scrim="scrim" :close-on-swipe="swipe" :destroy-on-close="destroy" close-label="Request policy close" @update:model-value="update" @closed="closed">
      <div class="grid gap-4">
        <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
        <MdvTextField label="Local draft" placeholder="Close and reopen to compare retention" full-width />
        <MdvButton variant="outlined" @click="requestClose">Request close()</MdvButton>
        <MdvButton variant="text" @click="open = false">Close directly</MdvButton>
        <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
      </div>
    </MdvSideSheet>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
