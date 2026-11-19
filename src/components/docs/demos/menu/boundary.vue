<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvMenu, MdvMenuGroup, MdvMenuItem } from '@mdv-ui/mdv'

const selected = ref('No recent document selected.')
</script>

<template>
  <div class="grid gap-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <div v-for="theme in ['light', 'dark']" :key="theme" :data-mdv-theme="theme" class="min-w-0 rounded-xl bg-mdv-surface-container p-5 text-mdv-on-surface">
        <MdvMenu layout="grouped" placement="bottom-end" :offset="8" style="width: 260px; --mdv-menu-max-height: 220px">
          <template #trigger="{ triggerProps }"><MdvButton v-bind="triggerProps" variant="tonal">{{ theme }} recent files</MdvButton></template>
          <MdvMenuGroup label="Recent documents">
            <MdvMenuItem v-for="number in 8" :key="number" :label="`Document ${number}: a longer project description`" supporting-text="ArchiveExportWithALongUnbrokenSupportingValue" @select="selected = `Document ${number} selected.`" />
          </MdvMenuGroup>
          <MdvMenuGroup label="Workspace"><MdvMenuItem label="Create a document" @select="selected = 'New document requested.'" /></MdvMenuGroup>
        </MdvMenu>
      </div>
    </div>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ selected }}</p>
  </div>
</template>
