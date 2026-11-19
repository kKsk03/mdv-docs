<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvModalNavigationRail, MdvNavigationRailItem, MdvTextField } from '@mdv-ui/mdv'
import type { MdvNavigationRailCloseDetail } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const id = `rail-policy-${useId()}`
const rail = useTemplateRef<InstanceType<typeof MdvModalNavigationRail>>('rail')
const expanded = ref(false)
const acceptClose = ref(true)
const closeOnEsc = ref(true)
const closeOnScrim = ref(true)
const closeOnSelect = ref(true)
const destroy = ref(false)
const message = ref('No close request yet.')
function update(value: boolean) {
  if (value || acceptClose.value) expanded.value = value
  else message.value = 'Parent rejected closing.'
}
async function close() { message.value = `close() accepted: ${await rail.value?.close()}` }
function closed(detail: MdvNavigationRailCloseDetail) { message.value = `Closed: ${detail.reason}` }
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="closeOnEsc" label="Escape closes" />
      <MdvCheckbox v-model="closeOnScrim" label="Scrim closes" />
      <MdvCheckbox v-model="closeOnSelect" label="Selection closes" />
      <MdvCheckbox v-model="destroy" label="Destroy expanded content on close" />
    </div>
    <MdvButton :aria-controls="id" :aria-expanded="expanded" @click="expanded = true">Open policy example</MdvButton>
    <MdvModalNavigationRail :id="id" ref="rail" :expanded="expanded" hide-on-collapse :close-on-esc="closeOnEsc" :close-on-scrim="closeOnScrim" :close-on-select="closeOnSelect" :destroy-on-close="destroy" aria-label="Rail close policy" @update:expanded="update" @closed="closed">
      <template #menu="{ menuAttrs }"><MdvIconButton v-bind="menuAttrs" variant="standard" aria-label="Request policy close"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
      <MdvNavigationRailItem label="Saved"><template #icon><MdvIcon :icon="bookmarkIcon" /></template></MdvNavigationRailItem>
      <div class="grid gap-3 px-5 py-4">
        <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
        <MdvTextField label="Local note" placeholder="Type, close, then reopen" />
        <MdvButton variant="outlined" @click="close">Request close()</MdvButton>
        <MdvButton variant="text" @click="expanded = false">Close directly</MdvButton>
        <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
      </div>
    </MdvModalNavigationRail>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }}</p>
  </div>
</template>
