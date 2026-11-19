<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvIcon, MdvNavigationDrawer, MdvNavigationDrawerItem, MdvSelect } from '@mdv-ui/mdv'
import inboxIcon from '@iconify-icons/material-symbols/inbox'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import archiveIcon from '@iconify-icons/material-symbols/archive-outline'

const id = `standard-example-${useId()}`
const open = ref(true)
const current = ref('Inbox')
const width = ref('280px')
const widths = ['240px', '280px', '360px'].map(value => ({ value, label: value }))
const destinations = [{ label: 'Inbox', icon: inboxIcon }, { label: 'Saved', icon: bookmarkIcon }, { label: 'Archive', icon: archiveIcon }]
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-3">
      <MdvButton :aria-controls="id" :aria-expanded="open" @click="open = !open">Toggle standard drawer</MdvButton>
      <MdvSelect :model-value="width" :options="widths" label="Drawer width" @update:model-value="width = String($event)" />
    </div>
    <div class="flex h-80 min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationDrawer :id="id" v-model="open" title="Library" :width="width">
        <MdvNavigationDrawerItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" @click="current = destination.label">
          <template #icon><MdvIcon :icon="destination.icon" /></template>
        </MdvNavigationDrawerItem>
        <template #footer="{ close }"><MdvButton variant="text" @click="close()">Close standard drawer</MdvButton></template>
      </MdvNavigationDrawer>
      <div class="min-w-0 flex-1 overflow-auto p-4" :class="open ? 'hidden sm:block' : ''">
        <p class="font-medium">{{ current }}</p>
        <p class="mt-3 text-sm text-mdv-on-surface-variant">The drawer reserves layout space. Selecting a destination keeps it open.</p>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current destination: {{ current }} · Open: {{ open }}</p>
  </div>
</template>
