<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvNavigationRail, MdvNavigationRailItem } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import bookIcon from '@iconify-icons/material-symbols/menu-book'
import lockIcon from '@iconify-icons/material-symbols/lock-outline'

const expanded = ref(false)
const accept = ref(true)
const current = ref('Overview')
const message = ref('No navigation requested.')
function update(value: boolean) {
  message.value = `Expansion requested: ${value}${accept.value ? '' : ' (rejected)'}`
  if (accept.value) expanded.value = value
}
function cancel(event: MouseEvent) {
  event.preventDefault()
  message.value = 'Navigation cancelled; the destination is unchanged.'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="accept" label="Accept expansion requests" />
    <div class="flex h-[30rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationRail :expanded="expanded" show-divider aria-label="Controlled destinations" @update:expanded="update">
        <template #menu="{ menuAttrs }"><MdvIconButton v-bind="menuAttrs" variant="standard" aria-label="Toggle controlled rail"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
        <MdvNavigationRailItem label="Overview" :active="current === 'Overview'" @click="current = 'Overview'">
          <template #icon><MdvIcon :icon="homeIcon" /></template>
        </MdvNavigationRailItem>
        <MdvNavigationRailItem label="Material guide" href="https://m3.material.io/components/navigation-rail/overview" target="_blank" rel="noopener noreferrer">
          <template #icon><MdvIcon :icon="bookIcon" /></template>
        </MdvNavigationRailItem>
        <MdvNavigationRailItem label="Cancelled link" href="https://example.com" @click="cancel">
          <template #icon><MdvIcon :icon="bookIcon" /></template>
        </MdvNavigationRailItem>
        <MdvNavigationRailItem label="Unavailable" href="https://example.com" disabled @click="message = 'This must not run.'">
          <template #icon><MdvIcon :icon="lockIcon" /></template>
        </MdvNavigationRailItem>
      </MdvNavigationRail>
      <p class="min-w-0 flex-1 overflow-auto p-4 text-sm text-mdv-on-surface-variant" :class="expanded ? 'hidden sm:block' : ''">Arrow keys move focus without changing the current destination. The external guide opens in a new tab.</p>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">{{ message }} · Current: {{ current }}</p>
  </div>
</template>
