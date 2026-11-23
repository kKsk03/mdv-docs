<script setup lang="ts">
import { ref, useId } from 'vue'
import { MdvButton, MdvSearchView } from '@mdv-ui/mdv'

const id = `search-view-form-${useId()}`
const inputId = `search-view-input-${useId()}`
const query = ref('design')
const message = ref('No form submission yet.')
function submit(event: Event) {
  message.value = `Form data: ${JSON.stringify([...new FormData(event.currentTarget as HTMLFormElement)])}`
}
</script>

<template>
  <div class="grid gap-4">
    <MdvSearchView v-model="query" placeholder="Search external form" results-label="Form search results" clear-label="Clear form query" back-label="Back to external form" variant="divided" :input-attrs="{ id: inputId, form: id, name: 'q' }">
      <template #default="{ close }">
        <div class="grid gap-4 p-5">
          <p class="text-sm">Only the active search input belongs to the external form.</p>
          <div class="flex flex-wrap gap-3"><MdvButton type="submit" :form="id">Submit from search</MdvButton><MdvButton type="reset" :form="id" variant="outlined">Reset from search</MdvButton><MdvButton variant="text" @click="close()">Close form search</MdvButton></div>
          <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Query: {{ query }}</p>
        </div>
      </template>
    </MdvSearchView>
    <form :id="id" class="flex flex-wrap gap-3" @submit.prevent="submit">
      <MdvButton type="submit">Submit collapsed search</MdvButton><MdvButton type="reset" variant="outlined">Reset collapsed search</MdvButton>
    </form>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ message }} · Query: {{ query }}</p>
  </div>
</template>
