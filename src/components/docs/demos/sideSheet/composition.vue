<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvSelect, MdvSideSheet } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const dialogOpen = ref(false)
const sheetOpen = ref(false)
const dark = ref(false)
const rtl = ref(false)
const access = ref<MdvSelectValue | null>('team')
</script>

<template>
  <div class="grid gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right to left" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="rounded-xl bg-mdv-surface p-4 text-mdv-on-surface">
      <MdvButton @click="dialogOpen = true">Open document dialog</MdvButton>
      <MdvDialog v-model="dialogOpen" title="Shared document">
        <div class="grid gap-4">
          <p>Open supplemental settings, then dismiss the topmost overlay first.</p>
          <MdvButton variant="outlined" @click="sheetOpen = true">Edit access settings</MdvButton>
          <MdvSideSheet v-model="sheetOpen" title="Access settings" width="360px" detached placement="end" close-label="Close access settings">
            <MdvSelect v-model="access" label="Who can read" :options="[{ value: 'team', label: 'Team members' }, { value: 'public', label: 'Anyone with the link' }]" full-width />
            <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Apply access</MdvButton></template>
          </MdvSideSheet>
          <p role="status">Access: {{ access }}</p>
        </div>
        <template #actions="{ close }"><MdvButton variant="text" @click="close('done')">Done</MdvButton></template>
      </MdvDialog>
    </div>
  </div>
</template>
