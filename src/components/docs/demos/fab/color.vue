<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvFab, MdvIcon } from '@mdv-ui/mdv'
import type { MdvFabColor } from '@mdv-ui/mdv'
import editIcon from '@iconify-icons/material-symbols/edit-outline'

const elevated = ref(true)
const colors: MdvFabColor[] = ['primary-container', 'secondary-container', 'tertiary-container', 'primary', 'secondary', 'tertiary', 'surface']
</script>

<template>
  <div class="grid gap-5">
    <MdvCheckbox v-model="elevated" label="Elevated surfaces" />
    <div class="flex flex-wrap gap-x-6 gap-y-7">
      <div v-for="color in colors" :key="color" class="grid justify-items-center gap-3">
        <MdvFab :color="color" :elevated="elevated" :aria-label="`Edit with ${color}`"><MdvIcon :icon="editIcon" /></MdvFab>
        <span class="text-sm text-mdv-on-surface-variant">{{ color }}</span>
      </div>
    </div>
  </div>
</template>
