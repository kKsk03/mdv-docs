<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvTextField } from '@mdv-ui/mdv'
import type { MdvDialogSlotProps } from '@mdv-ui/mdv'

const open = ref(false)
const confirmation = ref(false)
const removed = ref(false)
const name = ref('Weekend reading')

async function remove(close: MdvDialogSlotProps['close']) {
  if (await close('removed')) removed.value = true
}
</script>

<template>
  <div data-mdv-theme="dark" class="rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
    <MdvButton @click="open = true">Open collection settings</MdvButton>
    <MdvDialog v-model="open" role="dialog">
      <template #title>Collection settings</template>
      <div class="grid gap-4">
        <MdvTextField v-model="name" label="Collection name" full-width />
        <MdvButton class="justify-self-start" variant="outlined" :disabled="removed" @click="confirmation = true">Remove bookmark</MdvButton>
        <p class="text-sm" role="status">{{ removed ? 'Bookmark removed.' : 'One bookmark in this collection.' }}</p>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Done with settings</MdvButton></template>
      <MdvDialog v-model="confirmation" title="Remove this bookmark?" description="The collection will remain available.">
        <template #actions="{ close }">
          <MdvButton variant="text" @click="close('cancel')">Keep bookmark</MdvButton>
          <MdvButton variant="text" @click="remove(close)">Remove it</MdvButton>
        </template>
      </MdvDialog>
    </MdvDialog>
  </div>
</template>
