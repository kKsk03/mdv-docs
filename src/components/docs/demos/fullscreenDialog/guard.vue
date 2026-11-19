<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { MdvButton, MdvDialog, MdvFullscreenDialog, MdvTextField } from '@mdv-ui/mdv'
import type { MdvDialogBeforeClose, MdvDialogCloseDetail, MdvDialogSlotProps } from '@mdv-ui/mdv'

const open = ref(false)
const confirm = ref(false)
const saved = ref('Weekend reading')
const draft = ref(saved.value)
let answer: ((allowed: boolean) => void) | undefined

const beforeClose: MdvDialogBeforeClose = detail => {
  if (detail.returnValue === 'saved' || draft.value === saved.value) return true
  confirm.value = true
  return new Promise<boolean>(resolve => { answer = resolve })
}

function confirmed(detail: MdvDialogCloseDetail) {
  const resolve = answer
  answer = undefined
  resolve?.(detail.returnValue === 'discard')
}

async function save(close: MdvDialogSlotProps['close']) {
  if (await close('saved')) saved.value = draft.value
}

onBeforeUnmount(() => answer?.(false))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="draft = saved; open = true">Edit reading plan</MdvButton>
    <MdvFullscreenDialog v-model="open" title="Edit reading plan" close-label="Close reading plan" :before-close="beforeClose">
      <div class="mx-auto grid max-w-2xl gap-5">
        <MdvTextField v-model="draft" label="Plan name" full-width autofocus />
        <p class="text-sm">Change the name, then try the close action, Escape, or Cancel.</p>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="save(close)">Save changes</MdvButton></template>
      <template #footer="{ close }"><MdvButton variant="text" @click="close('cancelled')">Cancel</MdvButton></template>
      <MdvDialog v-model="confirm" title="Discard changes?" description="Your saved reading plan will stay unchanged." @closed="confirmed">
        <template #actions="{ close }">
          <MdvButton variant="text" @click="close('keep')">Keep editing</MdvButton>
          <MdvButton variant="text" @click="close('discard')">Discard</MdvButton>
        </template>
      </MdvDialog>
    </MdvFullscreenDialog>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Saved plan: {{ saved }}</p>
  </div>
</template>
