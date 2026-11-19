<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvList, MdvListItem, MdvListSubheader } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'
import folderIcon from '@iconify-icons/material-symbols/folder-outline'

const list = useTemplateRef<InstanceType<typeof MdvList>>('list')
const selected = ref<MdvListModelValue>('research')
const showSubheader = ref(true)
const projects = ref(['research', 'prototype', 'release'])
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="showSubheader" label="Show the project group label" />
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="tonal" @click="projects = [...projects].reverse()">Reverse project order</MdvButton>
      <MdvButton variant="outlined" @click="list?.focus()">Focus selected row</MdvButton>
    </div>
    <MdvList ref="list" v-model="selected" selection-mode="single" layout="segmented" aria-label="Grouped destinations">
      <MdvListSubheader inset>Workspace</MdvListSubheader>
      <MdvListItem value="inbox" headline="Inbox" :icon="folderIcon" />
      <MdvListItem value="archive" headline="Archive" :icon="folderIcon" />
      <MdvListSubheader v-if="showSubheader" inset>Projects</MdvListSubheader>
      <MdvListItem v-for="project in projects" :key="project" :value="project" :headline="project" :icon="folderIcon" />
    </MdvList>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Selected: {{ selected }}. Reordering preserves each row's value.</p>
  </div>
</template>
