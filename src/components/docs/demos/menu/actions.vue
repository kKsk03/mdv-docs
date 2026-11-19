<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvMenu, MdvMenuItem } from '@mdv-ui/mdv'
import type { MdvMenuSelectEvent } from '@mdv-ui/mdv'

const count = ref(0)
const message = ref('No action has run.')
function cancel(event: MdvMenuSelectEvent) {
  event.preventDefault()
  message.value = 'The action was cancelled; the menu stays open.'
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvMenu>
      <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="outlined">Document actions</MdvButton></template>
      <MdvMenuItem label="Increment preview counter" keep-open @select="count++" />
      <MdvMenuItem label="Cancel this action" @select="cancel" />
      <MdvMenuItem label="Notifications, 3 unread" @select="message = 'Notifications requested.'">
        <template #trailing><MdvBadge variant="large" content="3" /></template>
      </MdvMenuItem>
      <MdvMenuItem label="Read the menu design guide" href="https://m3.material.io/components/menus/overview" target="_blank" rel="noopener noreferrer" />
      <MdvMenuItem label="Unavailable guide" href="https://m3.material.io/" disabled />
      <MdvMenuItem label="Finish" @select="message = 'Finished.'" />
    </MdvMenu>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Counter: {{ count }} · {{ message }}</p>
  </div>
</template>
