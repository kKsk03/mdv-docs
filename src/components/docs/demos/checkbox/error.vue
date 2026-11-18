<script setup lang="ts">
import { ref } from 'vue'
import { MdvCheckbox } from '@mdv-ui/mdv'

const showError = ref(true)
const checked = ref(false)
</script>

<template>
  <div class="grid justify-items-start gap-4">
    <MdvCheckbox v-model="showError" label="Show error" />
    <MdvCheckbox
      v-model="checked"
      :error="showError"
      label="Receive notifications"
      supporting-text="Choose whether to receive notifications."
      error-text="Notifications are currently unavailable."
    />
  </div>
</template>
