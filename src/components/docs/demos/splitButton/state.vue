<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvSplitButton } from '@mdv-ui/mdv'

const disabled = ref(false)
const loading = ref(false)
const result = ref('Use the focus controls to move between native actions.')
const splitButton = useTemplateRef<InstanceType<typeof MdvSplitButton>>('splitButton')
function submit() { result.value = 'The native submit action ran.' }
</script>

<template>
  <div class="grid min-w-0 gap-5">
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="outlined" @click="disabled = !disabled">Toggle disabled</MdvButton>
      <MdvButton variant="outlined" @click="loading = !loading">Toggle loading</MdvButton>
      <MdvButton variant="text" @click="splitButton?.focus()">Focus main action</MdvButton>
      <MdvButton variant="text" @click="splitButton?.focusMenu()">Focus menu action</MdvButton>
    </div>
    <MdvSplitButton ref="splitButton" :disabled="disabled" :loading="loading" loading-text="Saving" menu-button-label="More save actions" @click="submit">Save document</MdvSplitButton>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>