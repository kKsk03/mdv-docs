<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvIcon, MdvIconButton, MdvSelect } from '@mdv-ui/mdv'
import type { MdvIconSize } from '@mdv-ui/mdv'
import favoriteIcon from '@iconify-icons/material-symbols/favorite'
import saveIcon from '@iconify-icons/material-symbols/save'

const size = ref<MdvIconSize>(32)
const sizes = [
  { value: 24, label: '24px (number)' },
  { value: 32, label: '32px (number)' },
  { value: '1em', label: '1em (font size)' },
  { value: '2rem', label: '2rem' },
  { value: 'var(--sample-icon-size)', label: 'CSS variable' },
]
</script>

<template>
  <div class="grid gap-6" style="--sample-icon-size: 40px">
    <MdvSelect :model-value="size" :options="sizes" label="Icon size" @update:model-value="size = $event as MdvIconSize" />
    <div class="flex min-h-16 flex-wrap items-center gap-6 text-2xl">
      <MdvIcon :icon="favoriteIcon" :size="size" class="text-mdv-primary" />
      <MdvIcon :icon="favoriteIcon" :size="size" color="var(--mdv-sys-color-error)" />
      <MdvIcon :icon="favoriteIcon" :size="size" color="#006c4c" />
    </div>
    <div class="flex flex-wrap items-center gap-5">
      <MdvButton><template #leading><MdvIcon :icon="saveIcon" /></template>Save draft</MdvButton>
      <MdvIconButton size="m" aria-label="Save draft"><MdvIcon :icon="saveIcon" /></MdvIconButton>
      <span class="text-sm text-mdv-on-surface-variant">Omit size inside buttons to follow their icon containers.</span>
    </div>
  </div>
</template>
