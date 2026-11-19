<script setup lang="ts">
import { ref, shallowRef, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvFabMenu, MdvFabMenuItem } from '@mdv-ui/mdv'
import type { MdvFabMenuTriggerAttrs } from '@mdv-ui/mdv'

const menu = useTemplateRef<InstanceType<typeof MdvFabMenu>>('menu')
const trigger = shallowRef<HTMLButtonElement | null>(null)
const triggerAttrs: MdvFabMenuTriggerAttrs = { ref: trigger, title: 'Create a preview item' }
const open = ref(false)
const allowOpen = ref(false)
const rejectNextClose = ref(false)
const message = ref('Allow opening before requesting the menu.')
const closeReason = ref('(none)')

function update(value: boolean) {
  if (value && !allowOpen.value) message.value = 'Opening rejected.'
  else if (!value && rejectNextClose.value) {
    rejectNextClose.value = false
    message.value = 'Closing rejected once. Try again.'
  } else {
    open.value = value
    message.value = `${value ? 'Opening' : 'Closing'} accepted.`
  }
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="allowOpen" label="Allow opening" />
      <MdvCheckbox v-model="rejectNextClose" label="Reject the next close request" />
    </div>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="menu?.open()">Request open</MdvButton>
      <MdvButton variant="outlined" @click="menu?.close()">Request close</MdvButton>
      <MdvButton variant="text" @click="menu?.toggle()">Toggle menu</MdvButton>
      <MdvButton variant="text" @click="menu?.focus()">Focus trigger</MdvButton>
    </div>
    <div class="relative min-h-64 rounded-xl bg-mdv-surface-container-low p-5 pb-24">
      <p class="text-sm text-mdv-on-surface-variant" role="status">Open: {{ open }} · {{ message }} · Last close: {{ closeReason }}</p>
      <MdvFabMenu ref="menu" :model-value="open" :trigger-attrs="triggerAttrs" label="Controlled creation" close-label="Close controlled creation" position="absolute" :offset="16" @update:model-value="update" @closed="closeReason = $event.reason">
        <MdvFabMenuItem label="Create note" />
        <MdvFabMenuItem label="Create collection" />
      </MdvFabMenu>
    </div>
  </div>
</template>
