<script setup lang="ts">
import { MdvIcon } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import searchIcon from '@iconify-icons/material-symbols/search'
import settingsIcon from '@iconify-icons/material-symbols/settings'

const icons = [
  { name: 'home-outline', data: homeIcon },
  { name: 'search', data: searchIcon },
  { name: 'settings', data: settingsIcon },
]
</script>

<template>
  <div class="flex flex-wrap gap-6">
    <div v-for="icon in icons" :key="icon.name" class="grid justify-items-center gap-3 rounded-xl bg-mdv-surface-container-low p-4">
      <MdvIcon :icon="icon.data" />
      <span class="text-sm">{{ icon.name }}</span>
    </div>
  </div>
</template>
