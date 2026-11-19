<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvIcon } from '@mdv-ui/mdv'
import info from '@iconify-icons/material-symbols/info-outline'

const open = ref(false)
const icon = ref(false)
const result = ref('No close result yet.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="icon" label="Show a header icon" />
    <MdvButton @click="open = true">Review changes</MdvButton>
    <MdvDialog v-model="open" title="Discard changes?" description="Your unsaved edits will be lost. You can keep editing instead." @closed="result = `${$event.reason} · ${$event.returnValue || '(no return value)'}`">
      <template v-if="icon" #icon><MdvIcon :icon="info" /></template>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close('keep-editing')">Keep editing</MdvButton>
        <MdvButton variant="text" @click="close('discard')">Discard</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
