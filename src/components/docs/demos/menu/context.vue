<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvContextMenu, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'

const message = ref('No context action selected.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvContextMenu>
      <template #trigger="{ triggerProps }">
        <div v-bind="triggerProps" tabindex="0" class="w-full rounded-xl border border-dashed border-mdv-outline bg-mdv-surface-container p-6 text-sm">
          Right-click this document, or focus here and press Shift+F10.
        </div>
      </template>
      <MdvMenuItem label="Inspect document" @select="message = 'Document details requested.'" />
      <MdvMenuItem label="Archive document" @select="message = 'Document archived locally.'" />
    </MdvContextMenu>
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="outlined">Document options</MdvButton></template>
      <MdvMenuItem label="Inspect document" @select="message = 'Document details requested.'" />
      <MdvMenuItem label="Archive document" @select="message = 'Document archived locally.'" />
    </MdvMenu>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
