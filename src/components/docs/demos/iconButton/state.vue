<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import refreshIcon from '@iconify-icons/material-symbols/refresh'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'
import favoriteOutlineIcon from '@iconify-icons/material-symbols/favorite-outline'
import guideIcon from '@iconify-icons/material-symbols/open-in-new'

const loading = ref(false)
const disabled = ref(false)
const selected = ref(false)
const actions = ref(0)
</script>

<template>
  <div class="grid gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="loading" label="Show loading indicators" />
      <MdvCheckbox v-model="disabled" label="Disable all three actions" />
    </div>
    <div class="flex flex-wrap items-center gap-6">
      <MdvIconButton :loading="loading" :disabled="disabled" aria-label="Refresh preview" @click="actions++"><MdvIcon :icon="refreshIcon" /></MdvIconButton>
      <MdvIconButton v-model:selected="selected" variant="tonal" :loading="loading" :disabled="disabled" aria-label="Favorite preview">
        <MdvIcon :icon="favoriteOutlineIcon" />
        <template #selected><MdvIcon :icon="favoriteIcon" /></template>
      </MdvIconButton>
      <MdvIconButton href="https://m3.material.io/components/icon-buttons/overview" target="_blank" rel="noopener noreferrer" variant="outlined" :loading="loading" :disabled="disabled" aria-label="Read icon button design guide"><MdvIcon :icon="guideIcon" /></MdvIconButton>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Refreshes: {{ actions }} · Favorite: {{ selected }}. Loading alone keeps actions enabled.</p>
  </div>
</template>
