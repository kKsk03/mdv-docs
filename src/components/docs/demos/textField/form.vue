<script setup lang="ts">
import { ref, useId, useTemplateRef } from 'vue'
import { MdvButton, MdvTextField } from '@mdv-ui/mdv'

const email = ref('')
const result = ref('No submission yet.')
const emailHint = useId()
const emailField = useTemplateRef<InstanceType<typeof MdvTextField>>('emailField')

function submit(event: SubmitEvent) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify([...data.entries()])
}

function reportDuplicate() {
  emailField.value?.setCustomValidity('This email address is already in use.')
  emailField.value?.reportValidity()
}

function clearCustomError() {
  emailField.value?.setCustomValidity('')
}

function reset() {
  clearCustomError()
  result.value = 'Reset to the initial values.'
}
</script>

<template>
  <form class="grid min-w-0 gap-4" @submit.prevent="submit" @reset="reset">
    <p :id="emailHint" class="text-sm text-mdv-on-surface-variant">Use an example address.</p>
    <MdvTextField
      ref="emailField"
      v-model="email"
      :aria-describedby="emailHint"
      type="email"
      name="email"
      label="Contact email"
      supporting-text="We send a copy of the report to this address."
      autocomplete="email"
      required
      full-width
      @input="clearCustomError"
    />
    <MdvTextField label="Plan" name="plan" model-value="Starter" readonly full-width />
    <MdvTextField label="Region (unavailable)" name="region" model-value="West" disabled full-width />
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit example</MdvButton>
      <MdvButton variant="tonal" @click="reportDuplicate">Report duplicate email</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-all text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
