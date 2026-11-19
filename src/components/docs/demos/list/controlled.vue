<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvList, MdvListItem } from '@mdv-ui/mdv'
import type { MdvListModelValue } from '@mdv-ui/mdv'

const selected = ref<MdvListModelValue>('draft')
const accept = ref(false)
const cancelClick = ref(false)
const message = ref('The parent currently rejects selection changes.')

function update(value: MdvListModelValue) {
  message.value = `Requested ${value}: ${accept.value ? 'accepted' : 'rejected'}.`
  if (accept.value) selected.value = value
}

function activate(event: MouseEvent) {
  if (!cancelClick.value) return
  event.preventDefault()
  message.value = 'Click cancelled before the selection request.'
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="accept" label="Accept list selection" />
      <MdvCheckbox v-model="cancelClick" label="Cancel row clicks" />
    </div>
    <MdvList :model-value="selected" selection-mode="single" layout="segmented" aria-label="Review stage" @update:model-value="update">
      <MdvListItem v-for="stage in ['draft', 'review', 'approved']" :key="stage" :value="stage" :headline="stage" trailing="radio" @click="activate" />
    </MdvList>
    <p class="text-sm text-mdv-on-surface-variant" role="status">Selected: {{ selected }} · {{ message }}</p>
  </div>
</template>
