<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvTextField } from '@mdv-ui/mdv'
import saveIcon from '@iconify-icons/material-symbols/save'
import resetIcon from '@iconify-icons/material-symbols/restart-alt'
import previewIcon from '@iconify-icons/material-symbols/visibility'

const title = ref('')
const result = ref('Enter a title before saving.')
</script>

<template>
  <div class="grid gap-4">
    <form class="grid gap-4" @submit.prevent="result = `Saved: ${title}`" @reset="title = ''; result = 'Draft reset.'">
      <MdvTextField v-model="title" label="Draft title" name="title" required full-width />
      <div class="flex flex-wrap gap-4">
        <MdvIconButton type="submit" aria-label="Save draft"><MdvIcon :icon="saveIcon" /></MdvIconButton>
        <MdvIconButton type="reset" variant="tonal" aria-label="Reset draft"><MdvIcon :icon="resetIcon" /></MdvIconButton>
        <MdvIconButton variant="standard" aria-label="Preview draft" @click="result = `Preview: ${title || '(empty)'}`"><MdvIcon :icon="previewIcon" /></MdvIconButton>
      </div>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
