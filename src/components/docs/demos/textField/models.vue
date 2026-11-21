<script setup lang="ts">
import { ref } from 'vue'
import { MdvTextField } from '@mdv-ui/mdv'
import type { MdvTextFieldValue } from '@mdv-ui/mdv'

const displayName = ref<MdvTextFieldValue>('')
const quantity = ref<MdvTextFieldValue>('')
</script>

<template>
  <div class="grid min-w-0 gap-4">
    <MdvTextField
      v-model.trim="displayName"
      label="Display name"
      supporting-text="Try adding spaces or entering text with an IME."
      full-width
    />
    <MdvTextField
      v-model.lazy.number="quantity"
      type="number"
      label="Quantity"
      min="0"
      step="1"
      supporting-text="Commit a numeric value when the input changes, not on every keystroke."
      full-width
    />
    <p class="break-words text-sm text-mdv-on-surface-variant" role="status">
      Name: {{ JSON.stringify(displayName) }} · Quantity: {{ JSON.stringify(quantity) }}
      ({{ typeof quantity }})
    </p>
  </div>
</template>
