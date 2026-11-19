<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvNavigationBar, MdvNavigationBarItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvNavigationBarOrientation } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import searchIcon from '@iconify-icons/material-symbols/search'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const orientation = ref<MdvNavigationBarOrientation>('auto')
const wide = ref(false)
const current = ref('Home')
const options = ['auto', 'vertical', 'horizontal'].map(value => ({ value, label: value }))
const destinations = [{ label: 'Home', icon: homeIcon }, { label: 'Search', icon: searchIcon }, { label: 'Saved', icon: bookmarkIcon }]
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="orientation" :options="options" label="Item orientation" @update:model-value="orientation = $event as MdvNavigationBarOrientation" />
    <MdvCheckbox v-model="wide" label="Use a 720px preview" />
    <div class="overflow-x-auto rounded-xl" role="region" aria-label="Navigation bar width preview" tabindex="0">
      <div class="relative isolate h-56 overflow-hidden bg-mdv-surface-container-low [contain:layout]" :style="{ inlineSize: wide ? '720px' : 'min(100%, 360px)' }">
        <p class="p-6 pb-28 text-sm text-mdv-on-surface-variant">{{ orientation }} · {{ wide ? '720px' : 'up to 360px' }}</p>
        <MdvNavigationBar :orientation="orientation" aria-label="Orientation example destinations">
          <MdvNavigationBarItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" @click="current = destination.label">
            <template #icon><MdvIcon :icon="destination.icon" /></template>
          </MdvNavigationBarItem>
        </MdvNavigationBar>
      </div>
    </div>
  </div>
</template>
