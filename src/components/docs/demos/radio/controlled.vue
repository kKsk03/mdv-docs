<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox, MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const value = ref<MdvRadioModelValue>('basic')
const accept = ref(false)
const requested = ref<MdvRadioModelValue>(null)
function update(next: MdvRadioModelValue) {
  requested.value = next
  if (accept.value) value.value = next
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="accept" label="Accept selection requests" />
    <MdvRadioGroup :model-value="value" label="Controlled plan" @update:model-value="update">
      <MdvRadio value="basic" label="Basic plan" /><MdvRadio value="pro" label="Pro plan" />
    </MdvRadioGroup>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Accepted: {{ value }} · Requested: {{ requested ?? 'none' }}</p>
  </div>
</template>
