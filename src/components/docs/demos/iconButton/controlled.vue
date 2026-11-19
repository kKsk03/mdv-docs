<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvIcon, MdvIconButton } from '@mdv-ui/mdv'
import bookmarkIcon from '@iconify-icons/material-symbols/bookmark'
import bookmarkOutlineIcon from '@iconify-icons/material-symbols/bookmark-outline'

const selected = ref(false)
const accept = ref(false)
const cancel = ref(false)
const message = ref('The parent currently rejects selection changes.')

function update(value: boolean) {
  message.value = `Requested ${value}: ${accept.value ? 'accepted' : 'rejected'}.`
  if (accept.value) selected.value = value
}

function click(event: MouseEvent) {
  if (cancel.value) {
    event.preventDefault()
    message.value = 'Click cancelled before a selection request.'
  }
}
</script>

<template>
  <div class="grid justify-items-start gap-5">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="accept" label="Accept selection changes" />
      <MdvCheckbox v-model="cancel" label="Cancel the click" />
    </div>
    <MdvIconButton :selected="selected" aria-label="Bookmark note" @update:selected="update" @click="click">
      <MdvIcon :icon="bookmarkOutlineIcon" />
      <template #selected><MdvIcon :icon="bookmarkIcon" /></template>
    </MdvIconButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Selected: {{ selected }} · {{ message }}</p>
  </div>
</template>
