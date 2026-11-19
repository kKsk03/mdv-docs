<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvDialog, MdvFabMenu, MdvFabMenuItem, MdvIcon, MdvTextField } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/create-new-folder-outline'
import noteIcon from '@iconify-icons/material-symbols/note-add-outline'

const open = ref(false)
const name = ref('Reading list')
const message = ref('No content added yet.')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton @click="open = true">Open workspace</MdvButton>
    <MdvDialog v-model="open" title="Workspace actions" role="dialog">
      <div class="relative min-h-72 pb-24">
        <MdvTextField v-model="name" label="Workspace name" full-width autofocus />
        <p class="mt-4 text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
        <MdvFabMenu label="Add to workspace" close-label="Close workspace menu" position="absolute" :offset="0">
          <template #icon><MdvIcon :icon="folderIcon" /></template>
          <MdvFabMenuItem @select="message = `Note added to ${name}.`">
            <template #leading><MdvIcon :icon="noteIcon" /></template>
            Add a note
          </MdvFabMenuItem>
          <MdvFabMenuItem label="Add a collection" :icon="folderIcon" @select="message = `Collection added to ${name}.`" />
        </MdvFabMenu>
      </div>
      <template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template>
    </MdvDialog>
  </div>
</template>
