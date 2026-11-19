<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'
import listIcon from '@iconify-icons/material-symbols/view-list-outline'
import gridIcon from '@iconify-icons/material-symbols/grid-view-outline'
import doneIcon from '@iconify-icons/material-symbols/done-all'

const view = ref<MdvSegmentedButtonModelValue>('list')
const compact = ref<MdvSegmentedButtonModelValue>('grid')
const showSelectedIcon = ref(true)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvCheckbox v-model="showSelectedIcon" label="Show selected icons" />
    <MdvSegmentedButton v-model="view" :show-selected-icon="showSelectedIcon" aria-label="Content view">
      <MdvSegmentedButtonItem value="list" label="List">
        <template #leading><MdvIcon :icon="listIcon" /></template>
        <template #selected-icon><MdvIcon :icon="doneIcon" /></template>
      </MdvSegmentedButtonItem>
      <MdvSegmentedButtonItem value="grid">
        <template #default="{ selected }">{{ selected ? 'Grid view' : 'Grid' }}</template>
        <template #leading><MdvIcon :icon="gridIcon" /></template>
      </MdvSegmentedButtonItem>
    </MdvSegmentedButton>
    <MdvSegmentedButton v-model="compact" :show-selected-icon="showSelectedIcon" aria-label="Icon-only content view">
      <MdvSegmentedButtonItem value="list" aria-label="List view"><template #leading><MdvIcon :icon="listIcon" /></template></MdvSegmentedButtonItem>
      <MdvSegmentedButtonItem value="grid" aria-label="Grid view"><template #leading><MdvIcon :icon="gridIcon" /></template></MdvSegmentedButtonItem>
    </MdvSegmentedButton>
  </div>
</template>
