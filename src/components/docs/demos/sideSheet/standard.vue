<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSideSheetScaffold } from '@mdv-ui/mdv'
import type { MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const sheet = useTemplateRef<InstanceType<typeof MdvSideSheetScaffold>>('sheet')
const open = ref(false)
const detached = ref(false)
const start = ref(false)
const wider = ref(false)
const divider = ref(true)
const rtl = ref(false)
const message = ref('The main area is available while the sheet is open.')
function closed(event: MdvSideSheetCloseDetail) { message.value = `Closed: ${event.reason} · Result: ${event.returnValue || '(empty)'}` }
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="detached" label="Detached" />
      <MdvCheckbox v-model="start" label="Place at start" />
      <MdvCheckbox v-model="wider" label="Wider sheet" />
      <MdvCheckbox v-model="divider" label="Outer divider" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div class="h-[400px] min-w-0 overflow-hidden rounded-xl border border-mdv-outline-variant">
      <MdvSideSheetScaffold ref="sheet" v-model="open" title="Details" :width="wider ? 'min(320px, 65cqw)' : 'clamp(180px, 45cqw, 256px)'" :placement="start ? 'start' : 'end'" :detached="detached" :show-divider="divider" :dir="rtl ? 'rtl' : 'ltr'" close-label="Close standard details" @closed="closed">
        <div class="grid min-w-0 gap-4 p-3 break-words">
          <div class="flex flex-wrap gap-2">
            <MdvButton variant="tonal" @click="open = !open">{{ open ? 'Hide' : 'Open' }}</MdvButton>
            <MdvButton v-if="open" variant="text" @click="sheet?.focus()">Focus</MdvButton>
          </div>
          <p v-for="row in 10" :key="row">Document {{ row }}. The main area resizes and scrolls independently.</p>
        </div>
        <template #sheet>
          <div class="grid gap-4"><p v-for="row in 12" :key="row">Property {{ row }}: supplemental project information.</p></div>
        </template>
        <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Done</MdvButton></template>
      </MdvSideSheetScaffold>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
