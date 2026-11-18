<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCard, MdvIcon } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const count = ref(12)
</script>

<template>
  <MdvCard class="max-w-md">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="grid size-10 shrink-0 place-items-center rounded-full bg-mdv-tertiary-container text-mdv-on-tertiary-container">
          <MdvIcon :icon="folderIcon" />
        </span>
        <div>
          <p class="font-medium">Design resources</p>
          <p class="text-sm text-mdv-on-surface-variant">Shared workspace</p>
        </div>
      </div>
    </template>
    <p class="text-sm" role="status">{{ count }} resources in this collection.</p>
    <template #actions>
      <MdvButton variant="text" @click="count++">Add resource</MdvButton>
    </template>
  </MdvCard>
</template>
