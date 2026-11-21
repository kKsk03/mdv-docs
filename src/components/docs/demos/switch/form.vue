<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvSwitch } from '@mdv-ui/mdv'

const formId = useId()
const share = ref(false)
const result = ref('No submission yet.')

function submit(event: SubmitEvent) {
  const form = event.currentTarget as HTMLFormElement
  const value = new FormData(form).get('sharing')
  result.value = `Submitted: sharing=${value}.`
}
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvSwitch
      v-model="share"
      :form="formId"
      name="sharing"
      value="enabled"
      label="Share this report with the project team"
      supporting-text="Enable team access before publishing."
      error-text="Enable team access to continue."
      required
    />
    <form
      :id="formId"
      class="flex flex-wrap gap-3"
      @submit.prevent="submit"
      @reset="result = 'Reset to the initial preference.'"
    >
      <MdvButton type="submit">Publish report</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </form>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </div>
</template>
