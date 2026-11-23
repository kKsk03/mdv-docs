<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvIcon, MdvIconButton, MdvSearchView } from '@mdv-ui/mdv'
import searchIcon from '@iconify-icons/material-symbols/search'

const open = ref(false)
const query = ref('')
const acceptOpen = ref(true)
const acceptQuery = ref(true)
const message = ref('No request yet.')
function updateOpen(next: boolean) {
  message.value = `Open requested: ${next}${acceptOpen.value ? '' : ' (rejected)'}`
  if (acceptOpen.value) open.value = next
}
function updateQuery(next: string) {
  message.value = `Query requested: ${JSON.stringify(next)}${acceptQuery.value ? '' : ' (rejected)'}`
  if (acceptQuery.value) query.value = next
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
    <MdvSearchView :open="open" :model-value="query" placeholder="Search with an icon trigger" results-label="Controlled search results" clear-label="Clear controlled query" back-label="Close controlled search" @update:open="updateOpen" @update:model-value="updateQuery">
      <template #trigger="{ triggerProps }"><MdvIconButton v-bind="triggerProps" variant="tonal" aria-label="Open controlled search"><MdvIcon :icon="searchIcon" /></MdvIconButton></template>
      <template #default="{ close }">
        <div class="grid gap-4 p-5">
          <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
          <MdvCheckbox v-model="acceptQuery" label="Accept query requests" />
          <p class="break-words text-sm">Accepted query: {{ query || '(empty)' }}</p>
          <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }}</p>
          <MdvButton variant="outlined" @click="close()">Request search close</MdvButton>
          <MdvButton variant="text" @click="open = false">Close search directly</MdvButton>
        </div>
      </template>
    </MdvSearchView>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Open: {{ open }}</p>
  </div>
</template>
