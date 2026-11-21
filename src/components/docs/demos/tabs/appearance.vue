<script setup lang="ts">
import history from '@iconify-icons/material-symbols/history'
import overview from '@iconify-icons/material-symbols/space-dashboard-outline'
import { ref } from 'vue'
import { MdvBadge, MdvIcon, MdvSwitch, MdvTab, MdvTabPanel, MdvTabs } from '@mdv-ui/mdv'
import type { MdvTabValue } from '@mdv-ui/mdv'

const selected = ref<MdvTabValue>('overview')
const secondary = ref(false)
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSwitch v-model="secondary" label="Use secondary tabs" />
    <MdvTabs
      v-model="selected"
      :variant="secondary ? 'secondary' : 'primary'"
      aria-label="Project views"
    >
      <MdvTab value="overview" label="Overview">
        <template #icon><MdvIcon :icon="overview" /></template>
      </MdvTab>
      <MdvTab value="activity" label="Activity" aria-label="Activity, 3 unread updates">
        <template #icon><MdvIcon :icon="history" /></template>
        <template #badge><MdvBadge variant="large" :content="3" aria-hidden="true" /></template>
      </MdvTab>
      <template #panels>
        <MdvTabPanel value="overview" class="p-3">Project status and milestones.</MdvTabPanel>
        <MdvTabPanel value="activity" class="p-3">Recent changes to the project.</MdvTabPanel>
      </template>
    </MdvTabs>
  </div>
</template>
