<script setup lang="ts">
import { ref } from 'vue'
import { MdvTextField } from '@mdv-ui/mdv'

const budget = ref('42.00')
const notes = ref('Leave the box at the front desk.')
</script>

<template>
  <div class="grid min-w-0 gap-4 sm:grid-cols-2">
    <MdvTextField
      v-model="budget"
      label="Budget (USD)"
      inputmode="decimal"
      prefix-text="$"
      supporting-text="Enter an amount in US dollars."
      full-width
    />
    <MdvTextField
      v-model="notes"
      variant="filled"
      label="Delivery instructions"
      supporting-text="Include only information the courier needs."
      multiline
      :rows="3"
      :maxlength="80"
      full-width
    />
  </div>
</template>
