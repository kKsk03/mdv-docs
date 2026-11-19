<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'

const open = ref(false)
const message = ref('No workspace action selected.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps">Workspace menu</MdvButton></template>
      <MdvMenuItem label="Open workspace dialog" @select="open = true" />
    </MdvMenu>
    <MdvDialog v-model="open" title="Workspace settings" role="dialog" description="Escape closes the topmost menu before closing this dialog.">
      <div class="flex flex-wrap gap-3">
        <MdvMenu>
          <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="tonal">Settings actions</MdvButton></template>
          <MdvMenuItem label="Reset workspace" @select="message = 'Workspace reset locally.'" />
          <MdvMenuItem label="Preview changes" keep-open @select="message = 'Preview requested.'" />
        </MdvMenu>
        <MdvButton variant="text" @click="message = 'Focus continued after the menu.'">After the menu</MdvButton>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template>
    </MdvDialog>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
