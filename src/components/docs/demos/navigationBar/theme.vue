<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvCheckbox, MdvIcon, MdvNavigationBar, MdvNavigationBarItem } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import mailIcon from '@iconify-icons/material-symbols/mail-outline'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const rtl = ref(false)
const current = ref('Inbox')
const destinations = [{ label: 'Home', icon: homeIcon }, { label: 'Inbox', icon: mailIcon }, { label: 'Recently saved', icon: bookmarkIcon }]
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="rtl" label="Use right-to-left navigation bars" />
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" :dir="rtl ? 'rtl' : 'ltr'" class="relative isolate h-56 min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low text-mdv-on-surface [contain:layout]">
        <p class="p-5 pb-32 text-sm">{{ theme }} · {{ current }}</p>
        <MdvNavigationBar orientation="vertical" :aria-label="`${theme} example destinations`">
          <MdvNavigationBarItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" :aria-label="destination.label === 'Inbox' ? 'Inbox, more than 9 unread messages' : undefined" @click="current = destination.label">
            <template #icon><MdvIcon :icon="destination.icon" /></template>
            <template v-if="destination.label === 'Inbox'" #badge><MdvBadge variant="large" content="9+" /></template>
          </MdvNavigationBarItem>
        </MdvNavigationBar>
      </div>
    </div>
  </div>
</template>
