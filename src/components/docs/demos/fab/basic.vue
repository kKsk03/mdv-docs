<script setup lang="ts">
import { ref } from 'vue'
import { MdvExtendedFab, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const notes = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap items-center gap-6">
      <MdvFab aria-label="Write a note" @click="notes++"><MdvIcon :icon="editIcon" /></MdvFab>
      <MdvExtendedFab @click="notes++">
        <template #leading><MdvIcon :icon="editIcon" /></template>
        Write a note
      </MdvExtendedFab>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Notes created: {{ notes }}</p>
  </div>
</template>
