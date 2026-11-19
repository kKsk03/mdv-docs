<script setup lang="ts">
import { onBeforeUnmount, ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvFullscreenDialog, MdvTextField } from '@mdv-ui/mdv'

const dialog = useTemplateRef<InstanceType<typeof MdvFullscreenDialog>>('dialog')
const formId = `publish-form-${useId()}`
const open = ref(false)
const title = ref('Field notes')
const fail = ref(true)
const saving = ref(false)
const message = ref('The first save can simulate a failure.')
let timer: ReturnType<typeof setTimeout> | undefined

function save() {
  if (saving.value) return
  saving.value = true
  message.value = 'Saving…'
  // A local simulation. No network request is made.
  timer = setTimeout(async () => {
    timer = undefined
    saving.value = false
    if (fail.value) message.value = 'Save failed. Your draft is still available; disable failure and retry.'
    else if (await dialog.value?.close('saved')) message.value = `Saved: ${title.value}`
  }, 600)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton variant="tonal" @click="open = true">Try asynchronous save</MdvButton>
    <MdvFullscreenDialog ref="dialog" v-model="open" title="Publish notes" close-label="Close publishing" :before-close="() => !saving">
      <form :id="formId" class="mx-auto grid max-w-2xl gap-5" @submit.prevent="save">
        <MdvTextField v-model="title" label="Document title" required full-width autofocus :disabled="saving" />
        <MdvCheckbox v-model="fail" label="Simulate a save failure" :disabled="saving" />
        <p class="text-sm" role="status">{{ message }}</p>
      </form>
      <template #actions><MdvButton variant="text" type="submit" :form="formId" :loading="saving" :disabled="saving" loading-text="Saving…">Publish</MdvButton></template>
      <template #footer="{ close }"><MdvButton variant="text" :disabled="saving" @click="close('cancelled')">Cancel</MdvButton></template>
    </MdvFullscreenDialog>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
