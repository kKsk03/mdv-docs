<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvDialog, MdvTextField } from '@mdv-ui/mdv'

const formId = `project-${useId()}`
const open = ref(false)
const result = ref('No form result yet.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Try method="dialog"</MdvButton>
    <MdvDialog v-model="open" title="Create project" role="dialog" @closed="result = `${$event.reason} · ${$event.returnValue || '(empty)'}`">
      <form :id="formId" method="dialog">
        <MdvTextField label="Project title" name="title" required autofocus full-width />
      </form>
      <template #actions>
        <MdvButton variant="text" type="submit" :form="formId" value="cancelled" formnovalidate>Cancel creation</MdvButton>
        <MdvButton variant="text" type="submit" :form="formId" value="created">Create project</MdvButton>
      </template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
