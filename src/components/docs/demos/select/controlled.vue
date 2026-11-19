<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const field = useTemplateRef<InstanceType<typeof MdvSelect>>('field')
const value = ref<MdvSelectValue | null>('basic')
const open = ref(false)
const acceptValue = ref(false)
const acceptOpen = ref(true)
const requested = ref('none')
const options: MdvSelectOption[] = [{ value: 'basic', label: 'Basic' }, { value: 'pro', label: 'Pro' }]
function updateValue(next: MdvSelectValue | null) {
  requested.value = `value=${JSON.stringify(next)}`
  if (acceptValue.value) value.value = next
}
function updateOpen(next: boolean) {
  requested.value = `open=${next}`
  if (acceptOpen.value) open.value = next
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <div class="flex flex-wrap gap-x-4 gap-y-2">
      <MdvCheckbox v-model="acceptValue" label="Accept value requests" />
      <MdvCheckbox v-model="acceptOpen" label="Accept open requests" />
    </div>
    <MdvSelect ref="field" :model-value="value" :open="open" label="Controlled plan" :options="options" full-width @update:model-value="updateValue" @update:open="updateOpen" />
    <div class="flex flex-wrap gap-2">
      <MdvButton variant="outlined" @click="field?.focus(); field?.open()">Request open</MdvButton>
      <MdvButton variant="text" @click="field?.close()">Request close</MdvButton>
      <MdvButton variant="text" @click="open = false">Close directly</MdvButton>
    </div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Accepted: {{ value }} · Open: {{ open }} · Last request: {{ requested }}</p>
  </div>
</template>
