<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon, MdvSelect } from '@mdv-ui/mdv'
import type { MdvFabPlacement } from '@mdv-ui/mdv'
import addIcon from '@iconify-icons/material-symbols/add'

const placement = ref<MdvFabPlacement>('bottom-end')
const rtl = ref(false)
const count = ref(0)
const placements = ['bottom-start', 'bottom-center', 'bottom-end'].map(value => ({ value, label: value }))
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-4">
      <MdvSelect :model-value="placement" :options="placements" label="Action placement" @update:model-value="placement = $event as MdvFabPlacement" />
      <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
    </div>
    <div :dir="rtl ? 'rtl' : 'ltr'" class="relative min-h-60 rounded-xl bg-mdv-surface-container-low p-5 pb-28">
      <p class="font-medium">An action anchored to this preview</p>
      <p class="mt-3 text-sm text-mdv-on-surface-variant" role="status">Items created: {{ count }}</p>
      <MdvFab position="absolute" :placement="placement" :offset="20" aria-label="Create in preview" @click="count++"><MdvIcon :icon="addIcon" /></MdvFab>
    </div>
  </div>
</template>
