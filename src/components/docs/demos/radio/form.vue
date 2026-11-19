<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvCheckbox, MdvRadio, MdvRadioGroup } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const id = `radio-form-${useId()}`
const group = useTemplateRef<InstanceType<typeof MdvRadioGroup>>('group')
const delivery = ref<MdvRadioModelValue>(null)
const disabled = ref(false)
const message = ref('Not submitted.')
function submit(event: Event) {
  message.value = `Submitted: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
function validate() { message.value = group.value?.reportValidity() ? 'Valid selection.' : 'Please choose a delivery option.' }
function serverError() {
  group.value?.setCustomValidity('This service is temporarily unavailable.')
  validate()
}
function reset(event: Event) {
  if (event.defaultPrevented) return
  group.value?.setCustomValidity('')
  message.value = 'Form reset to no selection.'
}
</script>

<template>
  <div class="grid gap-4">
    <MdvCheckbox v-model="disabled" label="Disable delivery group" />
    <MdvRadioGroup ref="group" v-model="delivery" :form="id" name="delivery" label="Required delivery" supporting-text="Only the selected enabled radio is submitted." error-text="Choose an available delivery service." :disabled="disabled" required>
      <MdvRadio value="standard" label="Standard" /><MdvRadio value="express" label="Express" /><MdvRadio value="overnight" label="Overnight (unavailable)" disabled />
    </MdvRadioGroup>
    <form :id="id" class="flex flex-wrap gap-3" @submit.prevent="submit" @reset="reset">
      <MdvButton type="submit">Submit delivery</MdvButton><MdvButton type="reset" variant="outlined">Reset delivery</MdvButton>
    </form>
    <div class="flex flex-wrap gap-3">
      <MdvButton variant="text" @click="validate">Report validity</MdvButton>
      <MdvButton variant="text" @click="serverError">Set custom error</MdvButton>
      <MdvButton variant="text" @click="group?.setCustomValidity('')">Clear custom error</MdvButton>
      <MdvButton variant="text" @click="group?.focus({ preventScroll: true })">Focus selection</MdvButton>
    </div>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Model: {{ delivery ?? 'null' }}</p>
  </div>
</template>
