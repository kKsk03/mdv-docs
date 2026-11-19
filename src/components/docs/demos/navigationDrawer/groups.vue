<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox, MdvIcon, MdvNavigationDrawer, MdvNavigationDrawerGroup, MdvNavigationDrawerItem } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const drawer = useTemplateRef<InstanceType<typeof MdvNavigationDrawer>>('drawer')
const expanded = ref(true)
const accept = ref(true)
const current = ref('Design')
const message = ref('Group changes are accepted.')
function requestExpanded(value: boolean) {
  if (accept.value) expanded.value = value
  message.value = `Expanded ${value}: ${accept.value ? 'accepted' : 'rejected'}.`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="accept" label="Accept project group changes" />
    <MdvButton variant="outlined" @click="drawer?.focus()">Focus current destination</MdvButton>
    <div class="h-96 w-full max-w-90 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationDrawer ref="drawer" title="Workspace">
        <MdvNavigationDrawerGroup label="Mail">
          <MdvNavigationDrawerItem label="Inbox" :badge="0" :active="current === 'Inbox'" @click="current = 'Inbox'" />
          <MdvNavigationDrawerItem label="Unavailable mailbox" disabled />
        </MdvNavigationDrawerGroup>
        <MdvNavigationDrawerGroup label="Projects" collapsible divider :expanded="expanded" @update:expanded="requestExpanded">
          <template #icon><MdvIcon :icon="folderIcon" /></template>
          <MdvNavigationDrawerItem label="Design" :active="current === 'Design'" aria-label="Design, 3 updates" @click="current = 'Design'">
            <template #badge><MdvBadge variant="large" content="3" /></template>
          </MdvNavigationDrawerItem>
          <MdvNavigationDrawerGroup label="Archive" collapsible>
            <MdvNavigationDrawerItem label="Research" :active="current === 'Research'" @click="current = 'Research'" />
          </MdvNavigationDrawerGroup>
        </MdvNavigationDrawerGroup>
        <MdvNavigationDrawerGroup label="Administration" collapsible disabled divider>
          <MdvNavigationDrawerItem label="Read-only audit log" :active="current === 'Read-only audit log'" @click="current = 'Read-only audit log'" />
        </MdvNavigationDrawerGroup>
      </MdvNavigationDrawer>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Current: {{ current }} · {{ message }}</p>
  </div>
</template>
