<script setup lang="ts">
import { ref } from 'vue'
import { MdvSwitch, MdvTab, MdvTabPanel, MdvTabs } from '@mdv-ui/mdv'
import type { MdvTabValue } from '@mdv-ui/mdv'

const selected = ref<MdvTabValue>('summary')
const automatic = ref(false)
const lock = ref(false)
const result = ref('No selection request yet.')

function request(value: MdvTabValue) {
  if (lock.value) {
    result.value = `Rejected: ${value}.`
    return
  }
  selected.value = value
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvSwitch v-model="automatic" label="Select on focus" />
    <MdvSwitch v-model="lock" label="Keep the current panel" />
    <MdvTabs
      :model-value="selected"
      :activation="automatic ? 'automatic' : 'manual'"
      tab-navigation="active"
      aria-label="Report sections"
      @update:model-value="request"
      @change="result = `Accepted: ${$event}.`"
    >
      <MdvTab value="summary" label="Summary" />
      <MdvTab value="archive" label="Archive" disabled />
      <MdvTab value="details" label="Details" />
      <template #panels>
        <MdvTabPanel value="summary" class="p-3">Key facts at a glance.</MdvTabPanel>
        <MdvTabPanel value="archive" class="p-3">Archived reports are unavailable.</MdvTabPanel>
        <MdvTabPanel value="details" class="p-3">Additional figures and notes.</MdvTabPanel>
      </template>
    </MdvTabs>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
