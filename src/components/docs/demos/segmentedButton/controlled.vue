<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvSegmentedButton, MdvSegmentedButtonItem } from '@mdv-ui/mdv'
import type { MdvSegmentedButtonModelValue } from '@mdv-ui/mdv'

const value = ref<MdvSegmentedButtonModelValue>('draft')
const requested = ref<MdvSegmentedButtonModelValue>(null)
const accept = ref(false)
function update(next: MdvSegmentedButtonModelValue) {
  requested.value = next
  if (accept.value) value.value = next
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvCheckbox v-model="accept" label="Accept selection requests" />
    <MdvSegmentedButton :model-value="value" aria-label="Controlled publication state" @update:model-value="update">
      <MdvSegmentedButtonItem value="draft" label="Draft" />
      <MdvSegmentedButtonItem value="published" label="Published" />
      <MdvSegmentedButtonItem value="blocked" label="Cancelled" @click.prevent />
    </MdvSegmentedButton>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Accepted: {{ value }} · Requested: {{ requested ?? 'none' }}</p>
  </div>
</template>
