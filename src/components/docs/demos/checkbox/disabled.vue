<script setup lang="ts">
import { MdvCheckbox } from '@mdv-ui/mdv'
</script>

<template>
  <div class="flex flex-wrap gap-x-6 gap-y-3">
    <MdvCheckbox label="Unchecked" disabled />
    <MdvCheckbox :model-value="true" label="Checked" disabled />
    <MdvCheckbox indeterminate label="Indeterminate" disabled />
  </div>
</template>
