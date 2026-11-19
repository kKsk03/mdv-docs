<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvCheckbox, MdvSearchBar } from '@mdv-ui/mdv'

const id = `search-bar-form-${useId()}`
const query = ref('Material')
const disabled = ref(false)
const readonly = ref(false)
const message = ref('Press Enter to search, or read the form data separately.')
function search(value: string) { message.value = `Search submitted: ${value || '(all documents)'}` }
function submit(event: Event) {
  message.value = `Form data: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="disabled" label="Disable search" /><MdvCheckbox v-model="readonly" label="Read only" /></div>
    <form :id="id" class="grid gap-4" @submit.prevent="submit">
      <MdvSearchBar v-model="query" name="q" placeholder="Search documents" clear-label="Clear query" :disabled="disabled" :readonly="readonly" @search="search" @clear="message = 'Query cleared.'" />
      <div class="flex flex-wrap gap-3"><MdvButton type="submit">Read search form</MdvButton><MdvButton type="reset" variant="outlined">Reset query</MdvButton></div>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Query: {{ query || '(empty)' }}</p>
  </div>
</template>
