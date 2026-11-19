<script setup lang="ts">
import { ref } from 'vue'
import { MdvChip, MdvChipSet, MdvIcon } from '@mdv-ui/mdv'
import type { MdvChipSetModelValue } from '@mdv-ui/mdv'
import image from '@iconify-icons/material-symbols/image-outline'

const single = ref<MdvChipSetModelValue>('all')
const multiple = ref<MdvChipSetModelValue>(['images'])
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet v-model="single" selection="single" label="Content type">
      <MdvChip variant="filter" value="all" label="All" />
      <MdvChip variant="filter" value="articles" label="Articles" />
      <MdvChip variant="filter" value="images" label="Images">
        <template #leading><MdvIcon :icon="image" /></template>
      </MdvChip>
      <MdvChip variant="filter" value="unavailable" label="Unavailable" disabled />
    </MdvChipSet>
    <MdvChipSet v-model="multiple" selection="multiple" label="Additional filters">
      <MdvChip variant="filter" value="images" label="Images" />
      <MdvChip variant="filter" value="videos" label="Videos" />
      <MdvChip variant="filter" value="recent" label="Recent" />
    </MdvChipSet>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">Single: {{ JSON.stringify(single) }} · Multiple: {{ JSON.stringify(multiple) }}</p>
  </div>
</template>
