<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvIcon, MdvModalNavigationDrawer, MdvNavigationDrawerGroup, MdvNavigationDrawerItem } from '@mdv-ui/mdv'
import inboxIcon from '@iconify-icons/material-symbols/inbox'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'

const id = `modal-example-${useId()}`
const open = ref(false)
const current = ref('Inbox')
const lastClose = ref('none')
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvButton :aria-controls="id" :aria-expanded="open" @click="open = true">Open modal drawer</MdvButton>
    <MdvModalNavigationDrawer :id="id" v-model="open" title="Mail destinations" @closed="lastClose = $event.reason">
      <MdvNavigationDrawerItem label="Inbox" :active="current === 'Inbox'" :badge="12" @click="current = 'Inbox'">
        <template #icon><MdvIcon :icon="inboxIcon" /></template>
      </MdvNavigationDrawerItem>
      <MdvNavigationDrawerItem label="Saved" :active="current === 'Saved'" @click="current = 'Saved'">
        <template #icon><MdvIcon :icon="bookmarkIcon" /></template>
      </MdvNavigationDrawerItem>
      <MdvNavigationDrawerGroup label="Folders" collapsible divider>
        <MdvNavigationDrawerItem label="Reports" :active="current === 'Reports'" @click="current = 'Reports'" />
        <MdvNavigationDrawerItem label="Unavailable folder" disabled />
        <MdvNavigationDrawerItem label="Cancelled navigation" href="#cancelled-navigation" @click.prevent />
        <MdvNavigationDrawerItem label="Open design guide in a new tab" href="https://m3.material.io/components/navigation-drawer/overview" target="_blank" rel="noopener noreferrer" />
      </MdvNavigationDrawerGroup>
      <template #footer="{ close }"><MdvButton variant="text" @click="close()">Close modal drawer</MdvButton></template>
    </MdvModalNavigationDrawer>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · Last close: {{ lastClose }}</p>
  </div>
</template>
