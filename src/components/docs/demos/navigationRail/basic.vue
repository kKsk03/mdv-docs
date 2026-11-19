<script setup lang="ts">
import { ref } from 'vue'
import { MdvBadge, MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvNavigationRail, MdvNavigationRailItem, MdvSelect } from '@mdv-ui/mdv'
import homeIcon from '@iconify-icons/material-symbols/home'
import homeOutlineIcon from '@iconify-icons/material-symbols/home-outline'
import exploreIcon from '@iconify-icons/material-symbols/explore-outline'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark-outline'
import menuIcon from '@iconify-icons/material-symbols/menu'
import editIcon from '@iconify-icons/material-symbols/edit'
import settingsIcon from '@iconify-icons/material-symbols/settings'

const expanded = ref(false)
const current = ref('Home')
const centered = ref(false)
const transparent = ref(false)
const divider = ref(true)
const width = ref('auto')
const drafts = ref(0)
const widths = ['auto', '280px', '360px'].map(value => ({ value, label: value }))
const destinations = [{ label: 'Home', icon: homeOutlineIcon }, { label: 'Explore', icon: exploreIcon }, { label: 'Saved', icon: bookmarkIcon }]
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap items-center gap-x-4 gap-y-2">
      <MdvCheckbox v-model="centered" label="Center items" />
      <MdvCheckbox v-model="transparent" label="Transparent" />
      <MdvCheckbox v-model="divider" label="Divider" />
      <MdvSelect :model-value="width" :options="widths" label="Expanded width" @update:model-value="width = String($event)" />
    </div>
    <div class="flex h-[34rem] min-w-0 overflow-hidden rounded-xl bg-mdv-surface-container-low">
      <MdvNavigationRail v-model:expanded="expanded" :alignment="centered ? 'center' : 'top'" :expanded-width="width === 'auto' ? undefined : width" :transparent="transparent" :show-divider="divider" aria-label="Workspace navigation">
        <template #menu="{ menuAttrs, expanded: isExpanded }">
          <MdvIconButton v-bind="menuAttrs" variant="standard" :aria-label="isExpanded ? 'Collapse rail' : 'Expand rail'"><MdvIcon :icon="menuIcon" /></MdvIconButton>
        </template>
        <template #fab>
          <MdvIconButton variant="tonal" size="m" shape="square" aria-label="Create draft" @click="drafts++"><MdvIcon :icon="editIcon" /></MdvIconButton>
        </template>
        <template #default="{ expanded: isExpanded }">
          <MdvNavigationRailItem v-for="destination in destinations" :key="destination.label" :label="destination.label" :active="current === destination.label" @click="current = destination.label">
            <template #icon="{ active }"><MdvIcon :icon="active && destination.label === 'Home' ? homeIcon : destination.icon" /></template>
            <template v-if="destination.label === 'Explore'" #badge><MdvBadge variant="large" content="3" aria-label="3 new discoveries" /></template>
          </MdvNavigationRailItem>
          <MdvNavigationRailItem v-if="isExpanded" label="Settings" :active="current === 'Settings'" @click="current = 'Settings'">
            <template #icon><MdvIcon :icon="settingsIcon" /></template>
          </MdvNavigationRailItem>
        </template>
      </MdvNavigationRail>
      <div class="min-w-0 flex-1 overflow-auto p-4" :class="expanded ? 'hidden sm:block' : ''">
        <p class="font-medium">{{ current }}</p>
        <p class="mt-3 text-sm text-mdv-on-surface-variant">Standard expansion reserves real layout space. Selection stays under application control.</p>
        <MdvButton class="mt-4" variant="text" @click="expanded = !expanded">Toggle rail</MdvButton>
      </div>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Destination: {{ current }} · Drafts created: {{ drafts }} · Expanded: {{ expanded }}</p>
  </div>
</template>
