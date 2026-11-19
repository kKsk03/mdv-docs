<script setup lang="ts">
import { ref } from 'vue'
import { MdvList, MdvListItem, MdvSelect } from '@mdv-ui/mdv'
import type { MdvListDivider } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const dividers = ref<MdvListDivider>('inset')
const options = ['none', 'full-width', 'inset'].map(value => ({ value, label: value }))
const image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56"%3E%3Cpath fill="%23d0bcff" d="M0 0h56v56H0z"/%3E%3Cpath fill="%234f378b" d="m0 48 18-26 13 14 10-11 15 23z"/%3E%3C/svg%3E'
</script>

<template>
  <div class="grid gap-4">
    <MdvSelect :model-value="dividers" :options="options" label="Row dividers" @update:model-value="dividers = $event as MdvListDivider" />
    <MdvList :dividers="dividers" :lines="1" aria-label="List content examples">
      <MdvListItem headline="Workspace files" :icon="folderIcon" trailing-text="12" />
      <MdvListItem :lines="2" headline="Alex Morgan" supporting-text="Shared a document with you" avatar-name="Alex Morgan" trailing-text="Now" />
      <MdvListItem :lines="3" overline="ARCHIVE" headline="Quarterly report" supporting-text="A thumbnail, overline, headline, and supporting text." :image="image" />
      <MdvListItem :lines="2" headline="Workspace export" supporting-text="Custom content keeps the row's normal geometry." :icon="folderIcon">
        <template #content="{ headline, supportingText }">
          <span class="block font-medium">{{ headline }}</span>
          <span class="block text-sm text-mdv-on-surface-variant">{{ supportingText }}</span>
        </template>
      </MdvListItem>
    </MdvList>
  </div>
</template>
