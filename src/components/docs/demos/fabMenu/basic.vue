<script setup lang="ts">
import { ref } from 'vue'
import { MdvFabMenu, MdvFabMenuItem } from '@mdv-ui/mdv'
import type { MdvFabMenuVariant } from '@mdv-ui/mdv'
import noteIcon from '@iconify-icons/material-symbols/note-add-outline'
import photoIcon from '@iconify-icons/material-symbols/add-photo-alternate-outline'
import folderIcon from '@iconify-icons/material-symbols/create-new-folder-outline'

const variants: MdvFabMenuVariant[] = ['expressive', 'baseline']
const message = ref('Choose an action in either presentation.')
const actions = [
  { value: 'document', label: 'New document', icon: noteIcon },
  { value: 'photo', label: 'Add photo', icon: photoIcon },
  { value: 'folder', label: 'New folder', icon: folderIcon },
]
</script>

<template>
  <div class="grid gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="variant in variants" :key="variant" class="relative min-h-72 rounded-xl bg-mdv-surface-container-low p-5 pb-24">
        <p class="font-medium">{{ variant }}</p>
        <p class="mt-3 text-sm text-mdv-on-surface-variant">{{ variant === 'expressive' ? 'Use Tab to visit actions.' : 'Use arrow keys to visit actions.' }}</p>
        <MdvFabMenu :variant="variant" :label="`Create content, ${variant}`" close-label="Close create menu" position="absolute" :offset="16">
          <MdvFabMenuItem v-for="action in actions" :key="action.value" v-bind="action" @select="message = `${variant}: ${$event.detail.value}`" />
        </MdvFabMenu>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
