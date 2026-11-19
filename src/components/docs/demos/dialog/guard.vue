<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog } from '@mdv-ui/mdv'
import type { MdvDialogBeforeClose } from '@mdv-ui/mdv'

const open = ref(false)
const allow = ref(false)
const checking = ref(false)
const message = ref('Enable dismissal inside the dialog to allow the check to pass.')

const beforeClose: MdvDialogBeforeClose = async detail => {
  checking.value = true
  message.value = `Checking the ${detail.reason} request…`
  try {
    // Simulates an asynchronous check; no network request is made.
    await new Promise(resolve => setTimeout(resolve, 600))
    message.value = allow.value ? 'Dismissal allowed.' : 'Dismissal blocked. Enable it and try again.'
    return allow.value
  } finally {
    checking.value = false
  }
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Try an asynchronous guard</MdvButton>
    <MdvDialog v-model="open" title="Ready to leave?" role="dialog" :before-close="beforeClose">
      <div class="grid gap-4">
        <MdvCheckbox v-model="allow" :disabled="checking" label="Allow dismissal" />
        <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
      </div>
      <template #actions="{ close }">
        <MdvButton variant="text" :disabled="checking" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" :loading="checking" :disabled="checking" @click="close('reviewed')">Check and close</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
