<script setup lang="ts">
import { ref } from 'vue'
import { MdvBottomSheet, MdvButton, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvBottomSheetChangeDetail } from '@mdv-ui/mdv'

const open = ref(false)
const expanded = ref(false)
const status = ref('Open the sheet to inspect its height states.')

function onChange(detail: MdvBottomSheetChangeDetail) {
  status.value = `${detail.previousState} → ${detail.state} (${detail.reason})`
}
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="expanded" label="Start expanded" />
    <MdvButton @click="open = true">Browse destinations</MdvButton>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ status }}</p>
    <MdvBottomSheet
      v-model="open"
      v-model:expanded="expanded"
      :partial="0.45"
      title="Plan your next trip"
      expand-label="Expand sheet"
      collapse-label="Collapse sheet"
      close-label="Close sheet"
      @change="onChange"
    >
      <div class="grid gap-5">
        <p>Drag the handle upward, or use the buttons below. The list scrolls inside the sheet.</p>
        <div v-for="city in ['London', 'Paris', 'Tokyo', 'Seoul', 'Singapore', 'Sydney', 'Lisbon', 'Oslo', 'Rome', 'Helsinki', 'Vienna', 'Prague']" :key="city">
          <p class="font-medium">{{ city }}</p>
          <p class="text-sm text-mdv-on-surface-variant">Explore local museums, parks, and independent cafés.</p>
        </div>
      </div>
      <template #actions="{ expand, collapse, close, expanded: isExpanded }">
        <MdvButton variant="text" @click="isExpanded ? collapse() : expand()">
          {{ isExpanded ? 'Collapse' : 'Expand' }}
        </MdvButton>
        <MdvButton @click="close()">Done</MdvButton>
      </template>
    </MdvBottomSheet>
  </div>
</template>
