<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import type { MdvIconButtonShape } from '@mdv-ui/mdv'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark'
import bookmarkOutlineIcon from '@iconify-icons/material-symbols/bookmark-outline'

const shapes: MdvIconButtonShape[] = ['round', 'square']
const selected = ref<Record<MdvIconButtonShape, boolean>>({ round: false, square: false })
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <div v-for="shape in shapes" :key="shape" class="grid justify-items-center gap-3">
      <MdvIconButton v-model:selected="selected[shape]" :shape="shape" size="m" :aria-label="`Bookmark, ${shape} base shape`">
        <template #default="{ selected: active }"><MdvIcon :icon="active ? bookmarkIcon : bookmarkOutlineIcon" /></template>
      </MdvIconButton>
      <span class="text-sm">{{ shape }} → {{ selected[shape] ? 'selected' : 'unselected' }}</span>
    </div>
  </div>
</template>
