<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvSideSheet, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const detached = ref(false)
const start = ref(false)
const dividers = ref(false)
const detail = ref(false)
const name = ref('Design system')
const message = ref('No sheet closed yet.')
function closed(event: MdvSideSheetCloseDetail) { message.value = `Closed: ${event.reason} · Result: ${event.returnValue || '(empty)'}` }
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="detached" label="Detached" />
      <MdvCheckbox v-model="start" label="Place at start" />
      <MdvCheckbox v-model="dividers" label="Internal dividers" />
    </div>
    <div><MdvButton @click="open = true">Open project details</MdvButton></div>
    <MdvSideSheet v-model="open" :title="detail ? 'Project history' : 'Project details'" width="360px" :placement="start ? 'start' : 'end'" :detached="detached" :dividers="dividers" :show-back="detail" back-label="Back to project details" close-label="Close project details" @back="detail = false" @closed="closed">
      <div v-if="!detail" class="grid gap-4">
        <MdvTextField v-model="name" label="Project name" autofocus full-width />
        <p>Supplement the current page without replacing its content.</p>
        <MdvButton variant="outlined" @click="detail = true">View history</MdvButton>
      </div>
      <ol v-else class="grid gap-4">
        <li v-for="entry in 16" :key="entry">Revision {{ entry }} — component guidance and implementation notes.</li>
      </ol>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" @click="close('done')">Done</MdvButton>
      </template>
    </MdvSideSheet>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
