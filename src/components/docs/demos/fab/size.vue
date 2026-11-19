<script setup lang="ts">
import { MdvExtendedFab, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import type { MdvExtendedFabSize, MdvFabSize } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const sizes: MdvFabSize[] = ['small', 'regular', 'medium', 'large']
const extendedSizes: MdvExtendedFabSize[] = ['small', 'medium', 'large']
</script>

<template>
  <div class="grid gap-7">
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in sizes" :key="size" class="grid justify-items-center gap-3">
        <MdvFab :size="size" :aria-label="`Create item, ${size}`"><MdvIcon :icon="addIcon" /></MdvFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      </div>
    </div>
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in extendedSizes" :key="size" class="grid justify-items-center gap-3">
        <MdvExtendedFab :size="size"><template #leading><MdvIcon :icon="addIcon" /></template>Create</MdvExtendedFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ size }}</span>
      </div>
    </div>
  </div>
</template>
