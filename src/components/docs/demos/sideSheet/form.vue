<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvSideSheet, MdvTextField } from '@mdv-ui/mdv'
import type { MdvSideSheetCloseDetail } from '@mdv-ui/mdv'

const open = ref(false)
const submitted = ref('No form submitted.')
const result = ref('No close result.')
function submit(event: Event) {
  const form = event.target as HTMLFormElement
  submitted.value = `Form data: ${JSON.stringify([...new FormData(form)])}`
}
function closed(detail: MdvSideSheetCloseDetail) { result.value = `Closed: ${detail.reason} · Result: ${detail.returnValue || '(empty)'}` }
</script>

<template>
  <div class="grid gap-3">
    <div><MdvButton @click="open = true">Open native dialog form</MdvButton></div>
    <MdvSideSheet v-model="open" title="Create a collection" width="360px" detached close-label="Close collection form" @closed="closed">
      <form method="dialog" class="grid gap-4" @submit="submit">
        <MdvTextField name="collection" label="Collection name" required autofocus full-width />
        <div class="flex flex-wrap gap-2">
          <MdvButton type="submit" value="create">Create collection</MdvButton>
          <MdvButton type="submit" value="cancel" variant="text" formnovalidate>Cancel creation</MdvButton>
        </div>
      </form>
    </MdvSideSheet>
    <p role="status" class="break-words text-sm text-mdv-on-surface-variant">{{ submitted }} · {{ result }}</p>
  </div>
</template>
