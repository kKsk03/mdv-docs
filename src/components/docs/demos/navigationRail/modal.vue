<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox, MdvDialog, MdvIcon, MdvIconButton, MdvModalNavigationRail, MdvNavigationRailItem } from '@mdv-ui/mdv'
import type { MdvNavigationRailCloseDetail } from '@mdv-ui/mdv'
import menuIcon from '@iconify-icons/material-symbols/menu'
import homeIcon from '@iconify-icons/material-symbols/home-outline'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import editIcon from '@iconify-icons/material-symbols/edit'

const id = `modal-rail-${useId()}`
const expanded = ref(false)
const immersive = ref(false)
const compose = ref(false)
const current = ref('Home')
const reason = ref('Not closed yet')
function closed(detail: MdvNavigationRailCloseDetail) { reason.value = detail.reason }
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="immersive" label="Hide the collapsed rail" />
    <div class="flex h-[28rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvModalNavigationRail :id="id" v-model:expanded="expanded" :hide-on-collapse="immersive" aria-label="Modal workspace navigation" @closed="closed">
        <template #menu="{ menuAttrs, expanded: isExpanded }"><MdvIconButton v-bind="menuAttrs" variant="standard" :aria-label="isExpanded ? 'Close modal rail' : 'Expand modal rail'"><MdvIcon :icon="menuIcon" /></MdvIconButton></template>
        <template #fab><MdvIconButton variant="tonal" size="m" shape="square" aria-label="Compose from rail" @click="compose = true"><MdvIcon :icon="editIcon" /></MdvIconButton></template>
        <MdvNavigationRailItem label="Home" :active="current === 'Home'" @click="current = 'Home'"><template #icon><MdvIcon :icon="homeIcon" /></template></MdvNavigationRailItem>
        <MdvNavigationRailItem label="Saved" :active="current === 'Saved'" @click="current = 'Saved'">
          <template #icon><MdvIcon :icon="bookmarkIcon" /></template>
          <template #badge><MdvBadge variant="large" content="5" aria-label="5 saved updates" /></template>
        </MdvNavigationRailItem>
      </MdvModalNavigationRail>
      <div class="min-w-0 flex-1 overflow-auto p-4">
        <MdvButton :aria-controls="id" :aria-expanded="expanded" @click="expanded = true">Open modal rail</MdvButton>
        <p class="mt-4 text-sm text-mdv-on-surface-variant">Modal expansion overlays the page. The external trigger also works when the collapsed rail is hidden.</p>
      </div>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Destination: {{ current }} · Last close: {{ reason }}</p>
    <MdvDialog v-model="compose" title="New draft" description="This dialog is declared outside the rail slots so only one instance exists.">
      <template #actions="{ close }"><MdvButton variant="text" @click="close()">Done</MdvButton></template>
    </MdvDialog>
  </div>
</template>
