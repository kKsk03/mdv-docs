<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvDialog, MdvTextField } from '@mdv-ui/mdv'

const dialog = useTemplateRef<InstanceType<typeof MdvDialog>>('dialog')
const formId = `contact-${useId()}`
const open = ref(false)
const name = ref('')
const email = ref('')
const result = ref('No contact saved.')

async function save() {
  if (await dialog.value?.close('saved')) result.value = `Saved ${name.value} · ${email.value}`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Add a contact</MdvButton>
    <MdvDialog ref="dialog" v-model="open" title="New contact" role="dialog">
      <form :id="formId" class="grid gap-4" @submit.prevent="save">
        <MdvTextField v-model="name" label="Contact name" name="name" required autofocus full-width />
        <MdvTextField v-model="email" label="Email address" name="email" type="email" required full-width />
      </form>
      <template #actions="{ close }">
        <MdvButton variant="text" @click="close('cancel')">Cancel</MdvButton>
        <MdvButton variant="text" type="submit" :form="formId">Save contact</MdvButton>
      </template>
    </MdvDialog>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
