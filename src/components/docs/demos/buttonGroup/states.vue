<script setup lang="ts">
import { ref } from 'vue'
import { MdvButtonGroup, MdvButtonGroupItem, MdvCheckbox } from '@mdv-ui/mdv'

const loading = ref(false)
const disabled = ref(false)
const message = ref('Toggle the states, then try the available actions.')
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-x-6 gap-y-2">
      <MdvCheckbox v-model="loading" label="Show loading" />
      <MdvCheckbox v-model="disabled" label="Disable group" />
    </div>
    <MdvButtonGroup :disabled="disabled" aria-label="Publishing actions">
      <MdvButtonGroupItem :loading="loading" :disabled="loading" loading-text="Publishing…" @click="message = 'Published.'">
        Publish
      </MdvButtonGroupItem>
      <MdvButtonGroupItem variant="elevated" color="tertiary" @click="message = 'Preview opened.'">Preview</MdvButtonGroupItem>
      <MdvButtonGroupItem disabled variant="outlined">Unavailable</MdvButtonGroupItem>
    </MdvButtonGroup>
    <p class="text-sm text-mdv-on-surface-variant" role="status">{{ message }}</p>
  </div>
</template>
