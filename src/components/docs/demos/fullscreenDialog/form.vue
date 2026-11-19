<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvFullscreenDialog, MdvTextField } from '@mdv-ui/mdv'

const dialog = useTemplateRef<InstanceType<typeof MdvFullscreenDialog>>('dialog')
const formId = `workspace-form-${useId()}`
const open = ref(false)
const name = ref('')
const result = ref('Create a workspace to see its saved name.')

async function save() {
  if (await dialog.value?.close('saved')) result.value = `Saved: ${name.value}`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Create workspace</MdvButton>
    <MdvFullscreenDialog ref="dialog" v-model="open" title="New workspace" close-label="Close new workspace">
      <form :id="formId" class="mx-auto grid max-w-2xl gap-5" @submit.prevent="save">
        <MdvTextField v-model="name" label="Workspace name" name="workspace" required full-width autofocus />
        <p class="text-sm">The Save button lives in the header and submits this form through its form attribute.</p>
      </form>
      <template #actions><MdvButton variant="text" type="submit" :form="formId">Save</MdvButton></template>
      <template #footer="{ close }"><MdvButton variant="text" @click="close('cancelled')">Cancel</MdvButton></template>
    </MdvFullscreenDialog>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
