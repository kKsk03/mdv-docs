<script setup lang="ts">
import { ref } from 'vue'
import { MdvMenu, MdvMenuItem, MdvSplitButton } from '@mdv-ui/mdv'

const result = ref('Choose a primary action or open related options.')
function save() { result.value = 'The document was saved.' }
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps, open }">
        <MdvSplitButton :expanded="open" :menu-button-attrs="triggerProps" menu-button-label="More save options" @click="save">Save</MdvSplitButton>
      </template>
      <MdvMenuItem label="Save a copy" @select="result = 'A copy was saved.'" />
      <MdvMenuItem label="Export as PDF" @select="result = 'PDF export requested.'" />
    </MdvMenu>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>