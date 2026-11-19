<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvIcon, MdvNavigationBar, MdvNavigationBarItem } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import activeHomeIcon from '@iconify-icons/material-symbols/home'
import exploreIcon from '@iconify-icons/material-symbols/explore-outline'
import activeExploreIcon from '@iconify-icons/material-symbols/explore'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import activeBookmarkIcon from '@iconify-icons/material-symbols/bookmark'

const current = ref('home')
const destinations = [
  { id: 'home', label: 'Home', icon: homeIcon, activeIcon: activeHomeIcon },
  { id: 'explore', label: 'Explore', icon: exploreIcon, activeIcon: activeExploreIcon, badge: '3' },
  { id: 'saved', label: 'Saved', icon: bookmarkIcon, activeIcon: activeBookmarkIcon },
]
</script>

<template>
  <div class="relative isolate h-64 overflow-hidden rounded-xl bg-mdv-surface-container-low [contain:layout]">
    <div class="p-6 pb-28">
      <p class="font-medium">My library</p>
      <p class="mt-3 text-sm text-mdv-on-surface-variant" role="status">Current destination: {{ current }}</p>
    </div>
    <MdvNavigationBar aria-label="Library destinations">
      <MdvNavigationBarItem v-for="destination in destinations" :key="destination.id" :label="destination.label" :active="current === destination.id" :aria-label="destination.badge ? `${destination.label}, ${destination.badge} unread updates` : undefined" @click="current = destination.id">
        <template #icon="{ active }"><MdvIcon :icon="active ? destination.activeIcon : destination.icon" /></template>
        <template v-if="destination.badge" #badge><MdvBadge variant="large" :content="destination.badge" /></template>
      </MdvNavigationBarItem>
    </MdvNavigationBar>
  </div>
</template>
