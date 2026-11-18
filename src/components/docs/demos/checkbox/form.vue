<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox } from '@mdv-ui/mdv'
import type { MdvCheckboxValue } from '@mdv-ui/mdv'

const accepted = ref(false)
const channels = ref<MdvCheckboxValue[]>(['email'])
const result = ref('Submit to inspect the form values.')

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ terms: data.get('terms'), channels: data.getAll('channel') })
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="result = 'Form reset.'">
    <MdvCheckbox
      v-model="accepted"
      name="terms"
      value="accepted"
      label="Accept the terms"
      supporting-text="This option is required."
      error-text="Accept the terms to continue."
      required
    />
    <fieldset class="min-w-0">
      <legend class="mb-2 font-medium">Optional channels</legend>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <MdvCheckbox v-model="channels" name="channel" value="email" label="Email" />
        <MdvCheckbox v-model="channels" name="channel" value="sms" label="SMS" />
      </div>
    </fieldset>
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
