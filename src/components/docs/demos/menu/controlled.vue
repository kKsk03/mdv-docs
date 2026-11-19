<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuModelValue } from '@mdv-ui/mdv'

const menu = useTemplateRef<InstanceType<typeof MdvMenu>>('menu')
const open = ref(false)
const acceptOpen = ref(true)
const acceptClose = ref(true)
const acceptChoice = ref(false)
const choice = ref<MdvMenuModelValue>('draft')
const message = ref('Choice changes are initially rejected.')
const lifecycle = ref<string[]>([])
function requestOpen(value: boolean) {
  const accepted = value ? acceptOpen.value : acceptClose.value
  if (accepted) open.value = value
  message.value = `Open ${value}: ${accepted ? 'accepted' : 'rejected'}.`
}
function requestChoice(value: MdvMenuModelValue) {
  if (acceptChoice.value) choice.value = value
  message.value = `Choice ${value}: ${acceptChoice.value ? 'accepted' : 'rejected'}.`
}
function record(event: string) {
  lifecycle.value = [...lifecycle.value, event].slice(-6)
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
      <MdvCheckbox v-model="acceptClose" label="Accept close requests" />
      <MdvCheckbox v-model="acceptChoice" label="Accept choice requests" />
    </div>
    <div class="flex flex-wrap gap-3">
      <MdvMenu ref="menu" :model-value="open" @update:model-value="requestOpen" @open="record('open')" @opened="record('opened')" @close="record(`close: ${$event.reason}`)" @closed="record(`closed: ${$event.reason}`)">
        <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Controlled menu</MdvButton></template>
        <MdvMenuGroup :model-value="choice" selection-mode="single" label="Document stage" @update:model-value="requestChoice">
          <MdvMenuItem value="draft" label="Draft" keep-open />
          <MdvMenuItem value="review" label="Review" keep-open />
        </MdvMenuGroup>
        <MdvMenuItem label="Close controlled menu" />
      </MdvMenu>
      <MdvButton variant="outlined" @click="menu?.open('last')">Open at last item</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Open: {{ open }} · Stage: {{ choice }} · {{ message }}</p>
    <p class="break-words text-xs text-mdv-on-surface-variant">Lifecycle: {{ lifecycle.join(' → ') || 'none' }}</p>
  </div>
</template>
