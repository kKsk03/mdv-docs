<script setup lang="ts">
import { MdvAutocomplete } from '@mdv-ui/mdv'

const options = [{ value: 'paris', label: 'Paris' }]
</script>

<template>
  <div class="grid gap-5 sm:grid-cols-2">
    <MdvAutocomplete label="Disabled" model-value="paris" :options="options" disabled full-width />
    <MdvAutocomplete label="Destination" :options="options" error error-text="Choose a supported destination." no-options-text="No cities found." full-width />
  </div>
</template>
