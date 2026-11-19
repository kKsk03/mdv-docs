<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvRadio } from '@mdv-ui/mdv'
import type { MdvRadioModelValue } from '@mdv-ui/mdv'

const name = `standalone-format-${useId()}`
const format = ref<MdvRadioModelValue>('pdf')
const submitted = ref('Not submitted.')
function submit(event: Event) {
  const value = new FormData(event.currentTarget as HTMLFormElement).get(name)
  submitted.value = `Submitted format: ${value}`
}
</script>

<template>
  <form class="grid gap-4" @submit.prevent="submit">
    <fieldset class="min-w-0 border-0 p-0">
      <legend class="mb-2 text-sm font-medium">Export format</legend>
      <div class="flex flex-wrap gap-3">
        <MdvRadio v-model="format" :name="name" value="pdf" label="PDF" />
        <MdvRadio v-model="format" :name="name" value="html" label="HTML" />
        <MdvRadio v-model="format" :name="name" value="text" label="Plain text" />
      </div>
    </fieldset>
    <div class="flex flex-wrap gap-3"><MdvButton type="submit">Read form data</MdvButton><MdvButton type="reset" variant="outlined">Reset format</MdvButton></div>
    <p role="status" class="text-sm text-mdv-on-surface-variant">Model: {{ format }} · {{ submitted }}</p>
  </form>
</template>
