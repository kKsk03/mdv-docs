<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvCheckbox, MdvIcon, MdvIconButton, MdvNavigationRail, MdvNavigationRailItem } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const expanded = ref(true)
const dark = ref(false)
const rtl = ref(false)
const current = ref('A shared workspace with a long destination label')
const labels = ['A shared workspace with a long destination label', 'Reading list', 'Project drafts', 'Notifications', 'Recent activity', 'Archive', 'Account settings']
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="dark" label="Local dark theme" /><MdvCheckbox v-model="rtl" label="Right to left" /></div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="flex h-[27rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low text-mdv-on-surface">
      <MdvNavigationRail v-model:expanded="expanded" expanded-width="280px" show-divider aria-label="Scrollable themed destinations">
        <template #menu="{ menuAttrs }"><MdvIconButton v-bind="menuAttrs" variant="standard" aria-label="Toggle themed rail"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
        <MdvNavigationRailItem v-for="(label, index) in labels" :key="label" :label="label" :active="current === label" @click="current = label">
          <template #icon><MdvIcon :icon="bookmarkIcon" /></template>
          <template v-if="index === 0" #badge><MdvBadge variant="large" content="99+" aria-label="More than 99 updates" /></template>
        </MdvNavigationRailItem>
      </MdvNavigationRail>
      <p class="min-w-0 flex-1 overflow-auto p-4 text-sm" :class="expanded ? 'hidden sm:block' : ''">Long labels wrap. Only the destinations scroll; the menu remains reachable.</p>
    </div>
  </div>
</template>
