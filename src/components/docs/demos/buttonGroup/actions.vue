<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem } from '@mdv-ui/mdv'

const message = ref('Choose a document action.')
</script>

<template>
  <div class="grid gap-4">
    <MdvButtonGroup aria-label="Document actions">
      <MdvButtonGroupItem @click="message = 'Document saved.'">Save</MdvButtonGroupItem>
      <MdvButtonGroupItem variant="tonal" @click="message = 'A copy was created.'">Duplicate</MdvButtonGroupItem>
      <MdvButtonGroupItem variant="outlined" @click="message = 'Document archived.'">Archive</MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
