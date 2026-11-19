<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvDialog, MdvList, MdvListItem, MdvSearchView } from '@mdv-ui/mdv'

const dark = ref(false)
const rtl = ref(false)
const dialog = ref(false)
const query = ref('')
const selected = ref('No document selected.')
const documents = ['Design system overview', 'Forms and validation', 'Navigation and focus']
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-4"><MdvCheckbox v-model="dark" label="Local dark theme" /><MdvCheckbox v-model="rtl" label="Right to left" /></div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'" :dir="rtl ? 'rtl' : 'ltr'" class="rounded-xl bg-mdv-surface-container-low p-5 text-mdv-on-surface">
      <MdvButton variant="tonal" @click="dialog = true">Choose a document</MdvButton>
      <p role="status" class="mt-4 text-sm">{{ selected }}</p>
      <MdvDialog v-model="dialog" title="Attach a document" description="Open the nested search. Escape closes search first and returns to this dialog.">
        <MdvSearchView v-model="query" placeholder="Search attachments" clear-label="Clear attachment query" back-label="Back to attachment dialog" variant="divided">
          <template #default="{ close }">
            <MdvList><MdvListItem v-for="title in documents.filter(value => value.toLowerCase().includes(query.toLowerCase()))" :key="title" :headline="title" interactive @click="selected = title; close()" /></MdvList>
            <MdvButton class="m-4" variant="text" @click="close()">Close attachment search</MdvButton>
          </template>
        </MdvSearchView>
        <template #actions="{ close }"><MdvButton variant="text" @click="close()">Finish attaching</MdvButton></template>
      </MdvDialog>
    </div>
  </div>
</template>
