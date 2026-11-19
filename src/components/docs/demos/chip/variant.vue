<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvChip, MdvChipSet, MdvIcon } from '@mdv-ui/mdv'
import calendar from '@iconify-icons/material-symbols/calendar-month-outline'

const selected = ref(false)
const attached = ref(true)
const message = ref('Try an action, a filter, or a removable input chip.')
</script>

<template>
  <div class="grid gap-4">
    <MdvChipSet label="Chip variants">
      <MdvChip label="Add to calendar" @click="message = 'Added to your calendar.'">
        <template #leading><MdvIcon :icon="calendar" /></template>
      </MdvChip>
      <MdvChip variant="suggestion" label="Sounds good" @click="message = 'Reply: Sounds good.'" />
      <MdvChip v-model:selected="selected" variant="filter" label="Unread" />
      <MdvChip v-if="attached" variant="input" label="Design notes" remove-label="Remove Design notes" @click="message = 'Opened Design notes.'" @remove="attached = false" />
    </MdvChipSet>
    <MdvButton v-if="!attached" variant="text" @click="attached = true">Restore attachment</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }} · Unread: {{ selected }}</p>
  </div>
</template>
