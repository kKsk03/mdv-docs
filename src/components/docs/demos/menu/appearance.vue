<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDivider, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'
import undoIcon from '@iconify-icons/material-symbols/undo'
import copyIcon from '@iconify-icons/material-symbols/content-copy-outline'

const appearances = [
  { variant: 'expressive', colorScheme: 'standard' },
  { variant: 'expressive', colorScheme: 'vibrant' },
  { variant: 'baseline', colorScheme: 'standard' },
] as const
const message = ref('Choose a document action.')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-3">
      <MdvMenu v-for="appearance in appearances" :key="`${appearance.variant}-${appearance.colorScheme}`" v-bind="appearance">
        <template #trigger="{ triggerProps }">
          <MdvButton v-bind="triggerProps" variant="tonal">{{ appearance.variant }} / {{ appearance.colorScheme }}</MdvButton>
        </template>
        <MdvMenuItem label="Undo" :icon="undoIcon" trailing-text="Ctrl+Z" @select="message = 'Undo requested.'" />
        <MdvMenuItem label="Redo" trailing-text="Ctrl+Y" disabled />
        <MdvDivider />
        <MdvMenuItem label="Duplicate document" supporting-text="Keep the original document." :icon="copyIcon" @select="message = 'A duplicate was created locally.'" />
      </MdvMenu>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
