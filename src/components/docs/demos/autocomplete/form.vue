<script setup lang="ts">
import { ref } from 'vue'
import { MdvAutocomplete, MdvButton } from '@mdv-ui/mdv'
import type { MdvSelectValue } from '@mdv-ui/mdv'

const city = ref<MdvSelectValue | null>(null)
const result = ref('Submit a suggestion or your own city.')
const options = [
  { value: 'london', label: 'London' },
  { value: 'paris', label: 'Paris' },
  { value: 'tokyo', label: 'Tokyo' },
]

function submit(event: Event) {
  const data = new FormData(event.currentTarget as HTMLFormElement)
  result.value = JSON.stringify({ destination: data.get('destination') })
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit" @reset="result = 'Form reset.'">
    <MdvAutocomplete
      v-model="city"
      class="max-w-sm"
      name="destination"
      label="Required destination"
      :options="options"
      supporting-text="Free text is also accepted."
      error-text="Enter a destination to continue."
      no-options-text="No cities found."
      required
      full-width
    />
    <div class="flex flex-wrap gap-3">
      <MdvButton type="submit">Submit</MdvButton>
      <MdvButton type="reset" variant="outlined">Reset</MdvButton>
    </div>
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">{{ result }}</p>
  </form>
</template>
