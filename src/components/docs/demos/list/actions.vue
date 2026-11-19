<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton, MdvList, MdvListItem, MdvSwitch } from '@mdv-ui/mdv'
import moreIcon from '@iconify-icons/material-symbols/more-vert'
import syncIcon from '@iconify-icons/material-symbols/sync'

const disabled = ref(false)
const saved = ref(false)
const sync = ref(true)
const opens = ref(0)
const more = ref(0)
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disabled" label="Disable action rows" />
    <MdvList layout="segmented" aria-label="Workspace actions">
      <MdvListItem interactive headline="Project details" supporting-text="Open the project from its main action." :selected="saved" :disabled="disabled" @click="opens++">
        <template #leading-action="{ disabled: rowDisabled }"><MdvCheckbox v-model="saved" :disabled="rowDisabled" aria-label="Save project" /></template>
        <template #trailing-action="{ disabled: rowDisabled }">
          <MdvIconButton variant="standard" :disabled="rowDisabled" aria-label="More project actions" @click="more++"><MdvIcon :icon="moreIcon" /></MdvIconButton>
        </template>
      </MdvListItem>
      <MdvListItem headline="Background sync" supporting-text="The switch is an independent action." :icon="syncIcon" :disabled="disabled">
        <template #trailing-action="{ disabled: rowDisabled }"><MdvSwitch v-model="sync" :disabled="rowDisabled" aria-label="Enable background sync" /></template>
      </MdvListItem>
      <MdvListItem href="https://m3.material.io/components/lists/overview" target="_blank" rel="noopener noreferrer" headline="Read the list design guide" :disabled="disabled" />
      <MdvListItem headline="Workspace is up to date" trailing-text="Read only" />
    </MdvList>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Project opens: {{ opens }} · Saved: {{ saved }} · Sync: {{ sync }} · More: {{ more }}</p>
  </div>
</template>
