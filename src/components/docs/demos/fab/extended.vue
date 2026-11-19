<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvExtendedFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const fab = useTemplateRef<InstanceType<typeof MdvExtendedFab>>('fab')
const expanded = ref(true)
const accept = ref(false)
const withIcon = ref(true)
const message = ref('Requests are rejected until you allow them.')
const notes = ref(0)

function update(value: boolean) {
  message.value = `Requested ${value ? 'expanded' : 'collapsed'}: ${accept.value ? 'accepted' : 'rejected'}.`
  if (accept.value) expanded.value = value
}

async function request(action: 'expand' | 'collapse' | 'toggle') {
  const accepted = await fab.value?.[action]()
  message.value = `${action}() ${accepted ? 'accepted' : 'not accepted'}.`
}
</script>

<template>
  <div class="grid justify-items-start gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="accept" label="Accept expansion requests" />
      <MdvCheckbox v-model="withIcon" label="Include a leading icon" />
    </div>
    <MdvExtendedFab ref="fab" :expanded="expanded" @update:expanded="update" @click="notes++">
      <template v-if="withIcon" #leading><MdvIcon :icon="editIcon" /></template>
      Write note
    </MdvExtendedFab>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="request('expand')">Request expand</MdvButton>
      <MdvButton variant="tonal" @click="request('collapse')">Request collapse</MdvButton>
      <MdvButton variant="outlined" @click="request('toggle')">Request toggle</MdvButton>
      <MdvButton variant="text" @click="fab?.focus()">Focus action</MdvButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }} · Notes: {{ notes }}</p>
  </div>
</template>
