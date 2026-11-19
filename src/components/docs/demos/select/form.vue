<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvSelect } from '@mdv-ui/mdv'
import type { MdvSelectOption, MdvSelectValue } from '@mdv-ui/mdv'

const formId = `select-delivery-${useId()}`
const field = useTemplateRef<InstanceType<typeof MdvSelect>>('field')
const value = ref<MdvSelectValue | null>(null)
const disabled = ref(false)
const message = ref('Not submitted.')
const options: MdvSelectOption[] = [{ value: '', label: 'Choose a method' }, { value: 'standard', label: 'Standard' }, { value: 'express', label: 'Express' }]
function submit(event: Event) {
  message.value = `Form data: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
function reset() {
  queueMicrotask(() => {
    field.value?.setCustomValidity('')
    message.value = 'Selection and application validation reset.'
  })
}
</script>

<template>
  <div class="grid min-w-0 gap-3">
    <MdvCheckbox v-model="disabled" label="Disable delivery field" />
    <MdvSelect ref="field" v-model="value" label="Delivery method" :options="options" :form="formId" name="delivery" required :disabled="disabled" full-width />
    <form :id="formId" class="flex flex-wrap gap-2" @submit.prevent="submit" @reset="reset">
      <MdvButton type="submit">Submit delivery</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset delivery</MdvButton>
      <MdvButton variant="text" @click="message = `Valid: ${field?.reportValidity()}`">Report validity</MdvButton>
      <MdvButton variant="text" @click="field?.setCustomValidity('Delivery is unavailable for this address.'); field?.reportValidity()">Set custom error</MdvButton>
      <MdvButton variant="text" @click="field?.setCustomValidity(''); message = `Valid: ${field?.checkValidity()}`">Clear custom error</MdvButton>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">Model: {{ JSON.stringify(value) }} · {{ message }}</p>
  </div>
</template>
