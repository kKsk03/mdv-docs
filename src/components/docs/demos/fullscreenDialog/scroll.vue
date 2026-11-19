<script setup lang="ts">
import { ref } from 'vue'
import { MdvButton, MdvCheckbox, MdvFullscreenDialog } from '@mdv-ui/mdv'

const open = ref(false)
const dark = ref(true)
const rtl = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="dark" label="Local dark theme" />
      <MdvCheckbox v-model="rtl" label="Right-to-left layout" />
    </div>
    <div :data-mdv-theme="dark ? 'dark' : 'light'">
      <MdvButton @click="open = true">Read long content</MdvButton>
      <MdvFullscreenDialog v-model="open" close-label="Close reading view" :dir="rtl ? 'rtl' : 'ltr'">
        <template #title>Workspace review and reading notes</template>
        <div class="mx-auto grid max-w-3xl gap-6">
          <p v-for="index in 30" :key="index">Section {{ index }}: the body scrolls independently while the header and footer remain available. Keep real content structured with useful headings and concise paragraphs.</p>
        </div>
        <template #actions="{ close }"><MdvButton variant="text" @click="close('finished')">Finish</MdvButton></template>
        <template #footer="{ close }"><MdvButton variant="text" @click="close('back')">Back</MdvButton></template>
      </MdvFullscreenDialog>
    </div>
  </div>
</template>
