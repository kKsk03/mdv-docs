<script setup lang="ts">
import { ref } from 'vue'
import { MdvExtendedFab, MdvFab, MdvIcon, MdvTextField } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save-outline'
import resetIcon from '@iconify-icons/material-symbols/restart-alt'

const title = ref('')
const result = ref('Enter a title before saving.')
</script>

<template>
  <div class="grid gap-5">
    <form class="grid gap-4" @submit.prevent="result = `Saved: ${title}`" @reset="title = ''; result = 'Draft reset.'">
      <MdvTextField v-model="title" label="Note title" name="title" required full-width />
      <div class="flex flex-wrap items-center gap-5">
        <MdvExtendedFab type="submit"><template #leading><MdvIcon :icon="saveIcon" /></template>Save note</MdvExtendedFab>
        <MdvFab type="reset" color="secondary-container" aria-label="Reset draft"><MdvIcon :icon="resetIcon" /></MdvFab>
      </div>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
    <MdvExtendedFab class="justify-self-start" href="https://m3.material.io/components/floating-action-button/overview" target="_blank" rel="noopener noreferrer">Design guide</MdvExtendedFab>
  </div>
</template>
