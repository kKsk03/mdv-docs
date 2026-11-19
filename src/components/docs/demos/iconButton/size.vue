<script setup lang="ts">
import { ref } from 'vue'
import { MdvIcon, MdvIconButton, MdvSelect } from '@mdv-ui/mdv'
import type { MdvIconButtonSize, MdvIconButtonWidth } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const sizes: MdvIconButtonSize[] = ['xs', 's', 'm', 'l', 'xl']
const width = ref<MdvIconButtonWidth>('default')
const widths = ['narrow', 'default', 'wide'].map(value => ({ value, label: value }))
</script>

<template>
  <div class="grid gap-6">
    <MdvSelect :model-value="width" :options="widths" label="Button width" @update:model-value="width = $event as MdvIconButtonWidth" />
    <div class="flex flex-wrap items-end gap-6">
      <div v-for="size in sizes" :key="size" class="grid justify-items-center gap-3">
        <MdvIconButton :size="size" :width="width" :aria-label="`Add item, ${size}`"><MdvIcon :icon="addIcon" /></MdvIconButton>
        <span class="text-sm">{{ size }}</span>
      </div>
    </div>
  </div>
</template>
